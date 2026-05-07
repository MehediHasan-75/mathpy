import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.assignment import SubmissionStatus


class AssignmentBase(BaseModel):
    title: str
    due_date: datetime
    max_score: float = 100.0


class AssignmentCreate(AssignmentBase):
    lesson_id: uuid.UUID


class AssignmentUpdate(BaseModel):
    title: str | None = None
    due_date: datetime | None = None
    max_score: float | None = None


class AssignmentResponse(AssignmentBase):
    id: uuid.UUID
    lesson_id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


class AssignmentSubmissionCreate(BaseModel):
    assignment_id: uuid.UUID
    user_id: uuid.UUID
    file_url: str


class AssignmentSubmissionUpdate(BaseModel):
    score: float | None = None
    status: SubmissionStatus | None = None


class AssignmentSubmissionResponse(BaseModel):
    id: uuid.UUID
    assignment_id: uuid.UUID
    user_id: uuid.UUID
    file_url: str
    submitted_at: datetime
    score: float | None
    status: SubmissionStatus
    model_config = ConfigDict(from_attributes=True)
