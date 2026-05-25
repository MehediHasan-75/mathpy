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