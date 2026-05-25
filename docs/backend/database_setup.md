# FastAPI Lifespan + Database Initialization

In `main.py` (run using `uvicorn`), we manage database setup and health checks using FastAPI’s `lifespan` and a `/health` endpoint.

---

## 1. Lifespan (Startup & Shutdown Logic)

We use `lifespan` to handle one-time initialization and cleanup tasks such as:

* Database connection validation
* Table creation
* Closing connection pools on shutdown

This ensures resources are created once at startup and reused across requests instead of being recreated repeatedly.

### Why lifespan is used

`lifespan` is FastAPI’s modern way to run startup and shutdown logic:

* **Before `yield` → runs on startup**
* **After `yield` → runs on shutdown**

This is ideal for:

* Database connections
* AI models
* Background tasks
* Resource pools

---

## 2. Implementation

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.core.database import check_db_connection, engine, init_db
import app.models  # noqa: F401  # Ensures all SQLAlchemy models are registered in Base.metadata

# Handles startup and shutdown events exactly once
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    check_db_connection()
    init_db()
    logger.info("Database connected and tables ensured")

    yield  # Application runs here while server is active

    # --- Shutdown ---
    engine.dispose()
    logger.info("Database connection pool closed")


app = FastAPI(lifespan=lifespan)
```

---

## 3. Health Check Endpoint

We use a health check endpoint to verify database connectivity at runtime.

```python
@app.get("/api/health")
def health_check():
    try:
        check_db_connection()
        return {"status": "ok", "database": "connected"}
    except Exception as exc:
        logger.error(f"Health check DB failure: {exc}")
        return {"status": "degraded", "database": "unavailable"}
```

---

## 4. Why `app.models` is Imported

```python
import app.models  # noqa: F401
```

This ensures all SQLAlchemy models are loaded into memory so they are registered in `Base.metadata`.

### How it works

SQLAlchemy stores table definitions in:

```python
Base.metadata
```

Example model:

```python
class User(Base):
    __tablename__ = "users"
```

When the module is imported:

1. Python executes the model class
2. SQLAlchemy registers it in `Base.metadata`
3. `create_all()` can now detect and create the table

If models are not imported, SQLAlchemy never “sees” them.

---

### Flow

```text
import app.models
        ↓
Model classes executed
        ↓
Tables registered in Base.metadata
        ↓
init_db() / create_all() runs
        ↓
Tables created in database
```

---


# The Database Layer (Three-Tier Mental Model)

Think of the database layer as a **three-tier stack**:

```
Your FastAPI Route
       |
       |  "I need to save a user"
       v
SQLAlchemy ORM  (Python objects ↔ SQL rows)
       |
       |  "INSERT INTO users ..."
       v
Database Engine (SQLite in dev, PostgreSQL in prod)
```

You never write raw SQL directly. Instead, you work with Python objects (`User`, `Document`, etc.), and SQLAlchemy translates them into SQL behind the scenes.

---

# Engine, Session, and Connection Pool

These three concepts are the foundation of the entire database system.

| Concept         | Analogy                    | What it does                                             |
| --------------- | -------------------------- | -------------------------------------------------------- |
| Engine          | The database’s phone line  | Long-lived object that manages connections               |
| Connection Pool | A set of ready phone lines | Reuses existing connections instead of creating new ones |
| Session         | A single phone call        | Short-lived interaction with the database                |

---

## Engine + Session Setup
The database layer is designed so that every request gets a safe, temporary session backed by a pooled, long-lived engine — with SQLAlchemy translating Python objects into SQL while FastAPI manages the lifecycle automatically.

```python
# Engine — created once when the app starts
engine = create_db_engine()

# Session factory — blueprint for creating sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
```

---

## Why these settings matter

### `autocommit=False`

Nothing is saved automatically.

- You must explicitly call `db.commit()`

This ensures:

* No partial writes
* Full control over transactions
* Safer data consistency

---

### `autoflush=False`

SQLAlchemy does NOT automatically push changes before queries.

- Changes are only sent when you explicitly decide

This gives:

* Predictable query behavior
* Fewer hidden side effects

---

# Connection Pool (SQLite vs PostgreSQL)

The engine behaves differently depending on the database.

---

## SQLite (development mode)

```python
engine = create_engine(
    url,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
```

### Meaning

* Single shared connection
* Designed for simplicity, not scale
* FastAPI threads are allowed to share the same connection

---

## PostgreSQL (production mode)

```python
engine = create_engine(
    url,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
)
```

### Meaning

* Keeps 20 connections always ready
* Allows up to 40 extra during traffic spikes
* Tests connections before use

---

### `pool_pre_ping=True`

Think of it like this:

> “Before I use this phone line, let me check if it still works.”

If a connection is stale, SQLAlchemy silently replaces it instead of crashing your request.

---

# The Request-Level Database Lifecycle

Every API request gets its **own database session**, and that session must always be closed.

This is handled using a FastAPI dependency:

```python
from collections.abc import Iterator
from sqlalchemy.orm import Session

def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## What this really means

Think of it like a library system:

* Before `yield` → you take a book (open DB session)
* During `yield` → you read it (run queries)
* After request ends → librarian takes it back (closes session)

---

## Why `try/finally` is critical

The `finally` block runs no matter what.

Even if:

* your API crashes
* an exception occurs
* request fails halfway

- The database session is still closed

Without this, you would slowly leak connections and eventually crash the system.

---

# Why `yield` is used here

This function is a **generator**, not a normal function.

Instead of returning once, it:

* pauses at `yield`
* hands control to FastAPI
* resumes after request completes

So it behaves like:

```
open session → pause → use session → resume → close session
```

---

# FastAPI’s Magic with Dependencies

When FastAPI sees:

```python
db: Session = Depends(get_db)
```

It does this internally:

1. Calls `get_db()`
2. Runs until `yield`
3. Extracts the yielded `Session`
4. Injects it into your route
5. After request ends → resumes generator
6. Runs `finally` → closes session

---

## Why the type looks confusing

```python
def get_db() -> Iterator[Session]:
```

But in your route:

```python
db: Session
```

### Why?

* The function is technically a generator → `Iterator[Session]`
* But FastAPI unwraps it and gives you ONLY the `Session`

- So:

* Python sees a generator
* FastAPI sees a dependency injector
* Your route sees a clean `Session`

---

# Mental Model Summary

## Engine

> “I manage all database connections”

## Session

> “I represent one conversation with the database”

## Connection Pool

> “I keep multiple lines ready so you don’t wait”

## get_db()

> “I give you a session and take it back safely when you’re done”

---
