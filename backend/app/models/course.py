import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, pk_uuid, created_at_col


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[uuid.UUID] = pk_uuid()
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String, nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = created_at_col()

    chapters: Mapped[list["Chapter"]] = relationship(
        "Chapter", back_populates="course", cascade="all, delete-orphan"
    )
    enrollments: Mapped[list["CourseEnrollment"]] = relationship(
        "CourseEnrollment", back_populates="course", cascade="all, delete-orphan"
    )
    study_materials: Mapped[list["StudyMaterial"]] = relationship(
        "StudyMaterial", back_populates="course", cascade="all, delete-orphan"
    )


class Chapter(Base):
    __tablename__ = "chapters"

    id: Mapped[uuid.UUID] = pk_uuid()
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)

    course: Mapped["Course"] = relationship("Course", back_populates="chapters")
    lessons: Mapped[list["Lesson"]] = relationship(
        "Lesson", back_populates="chapter", cascade="all, delete-orphan"
    )
    study_materials: Mapped[list["StudyMaterial"]] = relationship(
        "StudyMaterial", back_populates="chapter"
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[uuid.UUID] = pk_uuid()
    chapter_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    youtube_video_id: Mapped[str | None] = mapped_column(String, nullable=True)
    notes_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes_file_url: Mapped[str | None] = mapped_column(String, nullable=True)
    live_class_url: Mapped[str | None] = mapped_column(String, nullable=True)
    live_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_free: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = created_at_col()

    chapter: Mapped["Chapter"] = relationship("Chapter", back_populates="lessons")
    progress_records: Mapped[list["LessonProgress"]] = relationship(
        "LessonProgress", back_populates="lesson", cascade="all, delete-orphan"
    )


class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"
    __table_args__ = (UniqueConstraint("user_id", "course_id"),)

    id: Mapped[uuid.UUID] = pk_uuid()
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    enrolled_at: Mapped[datetime] = created_at_col()

    course: Mapped["Course"] = relationship("Course", back_populates="enrollments")


class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id"),)

    id: Mapped[uuid.UUID] = pk_uuid()
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    lesson_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="progress_records")


class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id: Mapped[uuid.UUID] = pk_uuid()
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    chapter_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    file_url: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = created_at_col()

    course: Mapped["Course"] = relationship("Course", back_populates="study_materials")
    chapter: Mapped["Chapter | None"] = relationship("Chapter", back_populates="study_materials")
