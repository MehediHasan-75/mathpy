import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ── Course ────────────────────────────────────────────────────────────────────

class CourseBase(BaseModel):
    title: str
    description: str | None = None
    thumbnail_url: str | None = None
    is_published: bool = False


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    thumbnail_url: str | None = None
    is_published: bool | None = None


class CourseResponse(CourseBase):
    id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ── Chapter ───────────────────────────────────────────────────────────────────

class ChapterBase(BaseModel):
    title: str
    order_index: int


class ChapterCreate(ChapterBase):
    course_id: uuid.UUID


class ChapterUpdate(BaseModel):
    title: str | None = None
    order_index: int | None = None


class ChapterResponse(ChapterBase):
    id: uuid.UUID
    course_id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


# ── Lesson ────────────────────────────────────────────────────────────────────

class LessonBase(BaseModel):
    title: str
    order_index: int
    youtube_video_id: str | None = None
    notes_content: str | None = None
    notes_file_url: str | None = None
    live_class_url: str | None = None
    live_at: datetime | None = None
    is_free: bool = False


class LessonCreate(LessonBase):
    chapter_id: uuid.UUID


class LessonUpdate(BaseModel):
    title: str | None = None
    order_index: int | None = None
    youtube_video_id: str | None = None
    notes_content: str | None = None
    notes_file_url: str | None = None
    live_class_url: str | None = None
    live_at: datetime | None = None
    is_free: bool | None = None


class LessonResponse(LessonBase):
    id: uuid.UUID
    chapter_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ── CourseEnrollment ──────────────────────────────────────────────────────────

class EnrollmentCreate(BaseModel):
    user_id: uuid.UUID
    course_id: uuid.UUID


class EnrollmentResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    course_id: uuid.UUID
    enrolled_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ── LessonProgress ────────────────────────────────────────────────────────────

class LessonProgressCreate(BaseModel):
    user_id: uuid.UUID
    lesson_id: uuid.UUID


class LessonProgressResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    lesson_id: uuid.UUID
    completed_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ── StudyMaterial ─────────────────────────────────────────────────────────────

class StudyMaterialBase(BaseModel):
    title: str
    file_url: str
    course_id: uuid.UUID
    chapter_id: uuid.UUID | None = None


class StudyMaterialCreate(StudyMaterialBase):
    pass


class StudyMaterialUpdate(BaseModel):
    title: str | None = None
    file_url: str | None = None
    chapter_id: uuid.UUID | None = None


class StudyMaterialResponse(StudyMaterialBase):
    id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
