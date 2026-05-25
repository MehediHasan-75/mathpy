from contextlib import asynccontextmanager

from app.core.database import check_db_connection, engine, init_db
from app.core.logger import log_requests, setup_logger
from loguru import logger

setup_logger()

from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]

from app.api.routers import api_router
import app.models  # noqa: F401

#handling things that need to happen exactly once when the server starts, and exactly once when it shuts down
@asynccontextmanager
async def lifespan(app: FastAPI):
    check_db_connection()
    init_db()
    logger.info("Database connected and tables ensured")
    yield
    engine.dispose()
    logger.info("Database connection pool closed")


app = FastAPI(title="EdTech Platform API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add Vercel URL here later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(log_requests)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running!"}


@app.get("/api/health")
def health_check():
    try:
        check_db_connection()
        return {"status": "ok", "database": "connected"}
    except Exception as exc:
        logger.error(f"Health check DB failure: {exc}")
        return {"status": "degraded", "database": "unavailable"}
