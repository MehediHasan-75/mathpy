import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, mapped_column, MappedColumn
from sqlalchemy.dialects.postgresql import UUID


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


# Reusable column helpers
def pk_uuid() -> MappedColumn:
    return mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


def created_at_col() -> MappedColumn:
    return mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
