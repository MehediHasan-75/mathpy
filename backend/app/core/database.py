"""Database session management for FastAPI dependency injection."""

from __future__ import annotations

from backend.app.models import Base
from loguru import logger 
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


DEFAULT_DATABASE_URL: str = "sqlite:///./app.db"

def get_batabase_url() -> str:
    """Get database URL from settings or use default SQLite."""
    try:
        from app.config import settings
        db_url = settings.DATABASE_URL
        return db_url

    except Exception:
        return DEFAULT_DATABASE_URL

def create_db_engine(database_url: str | None = None):
    """Create SQLAlchemy engine with appropriate configuration."""
    url = database_url or get_batabase_url()

    try:
        from app.config import settings
        pool_size = settings.DB_POOL_SIZE
        max_overflow = settings.DB_MAX_OVERFLOW
    except Exception:
        pool_size = 5
        max_overflow = 10
    
    engine = create_engine(
        url,
        pool_size=pool_size,
        max_overflow=max_overflow,
        pool_pre_ping=True,
        echo=False,
    )

    logger.info(f"PostgreSQL engine created with pool_size={pool_size}")
    return engine


engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoFlush=False, bind=engine)
    
def init_db() -> None:
    """Create all database tables."""
    from app.models import Assignment, Course, Exam, User
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables creagted")

def drop_db() -> None:
    """Drop all database tables. WARNING: destructive."""
    Base.metadata.drop_all(bind=engine)
    logger.warning("Database tables dropped")


