import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.STUDENT


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    role: UserRole | None = None


class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ActiveTokenResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    token: str
    device_info: str | None
    expires_at: datetime
    model_config = ConfigDict(from_attributes=True)
