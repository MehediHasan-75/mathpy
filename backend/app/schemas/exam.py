import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.exam import ExamSubmissionStatus


class McqOption(BaseModel):
    key: str
    text: str


class ExamBase(BaseModel):
    title: str
    duration_minutes: int
    total_marks: int
    start_time: datetime
    end_time: datetime
    is_practice: bool = False


class ExamCreate(ExamBase):
    course_id: uuid.UUID


class ExamUpdate(BaseModel):
    title: str | None = None
    duration_minutes: int | None = None
    total_marks: int | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    is_practice: bool | None = None


class ExamResponse(ExamBase):
    id: uuid.UUID
    course_id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


class QuestionBase(BaseModel):
    text: str
    options: list[McqOption]
    correct_answer: str
    order_index: int


class QuestionCreate(QuestionBase):
    exam_id: uuid.UUID


class QuestionUpdate(BaseModel):
    text: str | None = None
    options: list[McqOption] | None = None
    correct_answer: str | None = None
    order_index: int | None = None


class QuestionResponse(QuestionBase):
    id: uuid.UUID
    exam_id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


class ExamSubmissionCreate(BaseModel):
    exam_id: uuid.UUID
    user_id: uuid.UUID


class ExamSubmissionUpdate(BaseModel):
    # answers keyed by question UUID string → answer key string e.g. "A"
    answers: dict[str, str] | None = None
    score: float | None = None
    status: ExamSubmissionStatus | None = None
    submitted_at: datetime | None = None


class ExamSubmissionResponse(BaseModel):
    id: uuid.UUID
    exam_id: uuid.UUID
    user_id: uuid.UUID
    answers: dict[str, str]
    score: float | None
    status: ExamSubmissionStatus
    submitted_at: datetime | None
    model_config = ConfigDict(from_attributes=True)
