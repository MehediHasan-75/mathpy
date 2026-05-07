import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, pk_uuid, created_at_col


class ExamSubmissionStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    AUTO_SUBMITTED_FOCUS_LOST = "auto_submitted_focus_lost"


class Exam(Base):
    __tablename__ = "exams"

    id: Mapped[uuid.UUID] = pk_uuid()
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    total_marks: Mapped[int] = mapped_column(Integer, nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_practice: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    questions: Mapped[list["Question"]] = relationship(
        "Question", back_populates="exam", cascade="all, delete-orphan"
    )
    submissions: Mapped[list["ExamSubmission"]] = relationship(
        "ExamSubmission", back_populates="exam", cascade="all, delete-orphan"
    )


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[uuid.UUID] = pk_uuid()
    exam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False
    )
    text: Mapped[str] = mapped_column(Text, nullable=False)
    # JSONB: [{key: "A", text: "..."}, ...]
    options: Mapped[list] = mapped_column(JSONB, nullable=False)
    correct_answer: Mapped[str] = mapped_column(String, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)

    exam: Mapped["Exam"] = relationship("Exam", back_populates="questions")


class ExamSubmission(Base):
    __tablename__ = "exam_submissions"
    __table_args__ = (UniqueConstraint("exam_id", "user_id"),)

    id: Mapped[uuid.UUID] = pk_uuid()
    exam_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    # JSONB: {"question_uuid": "A", ...}
    answers: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[ExamSubmissionStatus] = mapped_column(
        nullable=False, default=ExamSubmissionStatus.IN_PROGRESS
    )
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    exam: Mapped["Exam"] = relationship("Exam", back_populates="submissions")
