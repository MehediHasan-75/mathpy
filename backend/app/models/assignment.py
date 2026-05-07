import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, pk_uuid, created_at_col


class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    GRADED = "graded"


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[uuid.UUID] = pk_uuid()
    lesson_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    due_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    max_score: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)

    submissions: Mapped[list["AssignmentSubmission"]] = relationship(
        "AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan"
    )


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    __table_args__ = (UniqueConstraint("assignment_id", "user_id"),)

    id: Mapped[uuid.UUID] = pk_uuid()
    assignment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    file_url: Mapped[str] = mapped_column(String, nullable=False)
    submitted_at: Mapped[datetime] = created_at_col()
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[SubmissionStatus] = mapped_column(
        nullable=False, default=SubmissionStatus.PENDING
    )

    assignment: Mapped["Assignment"] = relationship("Assignment", back_populates="submissions")
