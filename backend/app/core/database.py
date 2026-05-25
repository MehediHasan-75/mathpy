"""Database session management for FastAPI dependency injection."""

from __future__ import annotations

from collections.abc import Generator

from loguru import logger
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings
from app.models import Base


def create_db_engine():
    engine = create_engine(
        settings.DATABASE_URL,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_pre_ping=True,
        echo=settings.DEBUG,
    )
    logger.info(f"PostgreSQL engine created with pool_size={settings.DB_POOL_SIZE}")
    return engine


engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return True


def init_db() -> None:
    """Create all database tables."""
    import app.models # This reads the __init__.py and loads everything!
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")


def drop_db() -> None:
    """Drop all database tables. WARNING: destructive."""
    Base.metadata.drop_all(bind=engine)
    logger.warning("Database tables dropped")
