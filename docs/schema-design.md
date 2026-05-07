# PostgreSQL Schema — SQLAlchemy Models + Pydantic Schemas + TypeScript Types

## Context

MathPy backend is a FastAPI skeleton with empty `app/models/`, `app/schemas/`, `app/core/` directories and no database wiring. This document describes the complete async SQLAlchemy 2.0 schema, Pydantic v2 validation layers, and matching TypeScript interfaces in `shared/`.

**Decisions:**
- Async engine: asyncpg
- Migrations: Alembic
- CourseEnrollment table included
- MCQ options stored as array-of-objects JSONB: `[{key, text}]`

---

## Files Created

### Backend — Core DB Setup
- `backend/app/core/__init__.py`
- `backend/app/core/database.py` — async engine, `AsyncSession`, `get_db` dependency

### Backend — Models (SQLAlchemy 2.0 `mapped_column` style)
- `backend/app/models/__init__.py` — imports all models (Alembic autodiscovery)
- `backend/app/models/base.py` — `Base = DeclarativeBase()`, UUID helper, tz-aware datetime default
- `backend/app/models/user.py` — `User`, `ActiveToken`
- `backend/app/models/course.py` — `Course`, `Chapter`, `Lesson`, `CourseEnrollment`, `LessonProgress`, `StudyMaterial`
- `backend/app/models/assignment.py` — `Assignment`, `AssignmentSubmission`
- `backend/app/models/exam.py` — `Exam`, `Question`, `ExamSubmission`

### Backend — Pydantic Schemas (v2)
- `backend/app/schemas/__init__.py`
- `backend/app/schemas/user.py`
- `backend/app/schemas/course.py`
- `backend/app/schemas/assignment.py`
- `backend/app/schemas/exam.py`

### Shared TypeScript
- `shared/types/users.ts`
- `shared/types/courses.ts`
- `shared/types/exams.ts` — canonical DB-matched types; UI-only type renamed `ExamCard`

### Files Modified
- `backend/requirements.txt` — added `sqlalchemy[asyncio]`, `asyncpg`, `alembic`
- `backend/app/main.py` — imports `Base` + all models, lifespan wired
- `shared/types/data.ts` — `Course` → `CourseCard`, `Exam` → `ExamCard`
- `shared/types/assignments.ts` — replaced mock types with DB-matched types
- `shared/index.ts` — exports all new types

---

## Enums

```python
class UserRole(str, enum.Enum):
    STUDENT = "student"
    MENTOR  = "mentor"
    ADMIN   = "admin"

class SubmissionStatus(str, enum.Enum):
    PENDING   = "pending"
    SUBMITTED = "submitted"
    GRADED    = "graded"

class ExamSubmissionStatus(str, enum.Enum):
    IN_PROGRESS        = "in_progress"
    COMPLETED          = "completed"
    AUTO_SUBMITTED_FOCUS_LOST = "auto_submitted_focus_lost"
```

---

## Model Schemas

### user.py
| Column       | Type            | Constraints             |
|--------------|-----------------|-------------------------|
| id           | UUID            | PK, default uuid4       |
| name         | String          | not null                |
| email        | String          | unique, not null        |
| password_hash| String          | not null                |
| role         | UserRole enum   | not null                |
| created_at   | DateTime(tz)    | default utcnow          |

**ActiveToken**
| Column      | Type         | Constraints                    |
|-------------|--------------|--------------------------------|
| id          | UUID         | PK                             |
| user_id     | UUID         | FK → User.id, cascade delete   |
| token       | String       | unique                         |
| device_info | String       | nullable                       |
| expires_at  | DateTime(tz) | not null                       |

### course.py
**Course**
| Column        | Type         | Constraints          |
|---------------|--------------|----------------------|
| id            | UUID         | PK                   |
| title         | String       | not null             |
| description   | Text         | nullable             |
| thumbnail_url | String       | nullable             |
| is_published  | Boolean      | default False        |
| created_at    | DateTime(tz) | default utcnow       |

**Lesson**
| Column           | Type    | Constraints              |
|------------------|---------|--------------------------|
| id               | UUID    | PK                       |
| course_id        | UUID    | FK → Course.id cascade   |
| title            | String  | not null                 |
| order_index      | Integer | not null                 |
| youtube_video_id | String  | nullable                 |
| notes_content    | Text    | nullable                 |
| created_at       | DateTime(tz) | default utcnow      |

**CourseEnrollment**
| Column      | Type         | Constraints                        |
|-------------|--------------|------------------------------------|
| id          | UUID         | PK                                 |
| user_id     | UUID         | FK → User.id                       |
| course_id   | UUID         | FK → Course.id                     |
| enrolled_at | DateTime(tz) | default utcnow                     |
| —           | —            | UniqueConstraint(user_id, course_id)|

### assignment.py
**Assignment**
| Column     | Type         | Constraints              |
|------------|--------------|--------------------------|
| id         | UUID         | PK                       |
| lesson_id  | UUID         | FK → Lesson.id cascade   |
| title      | String       | not null                 |
| due_date   | DateTime(tz) | not null                 |
| max_score  | Float        | default 100.0            |

**AssignmentSubmission**
| Column        | Type              | Constraints                          |
|---------------|-------------------|--------------------------------------|
| id            | UUID              | PK                                   |
| assignment_id | UUID              | FK → Assignment.id                   |
| user_id       | UUID              | FK → User.id                         |
| file_url      | String            | not null                             |
| submitted_at  | DateTime(tz)      | default utcnow                       |
| score         | Float             | nullable                             |
| status        | SubmissionStatus  | default PENDING                      |
| —             | —                 | UniqueConstraint(assignment_id, user_id)|

### exam.py
**Exam**
| Column           | Type         | Constraints        |
|------------------|--------------|--------------------|
| id               | UUID         | PK                 |
| course_id        | UUID         | FK → Course.id     |
| title            | String       | not null           |
| duration_minutes | Integer      | not null           |
| total_marks      | Integer      | not null           |
| start_time       | DateTime(tz) | not null           |
| end_time         | DateTime(tz) | not null           |

**Question**
| Column         | Type    | Constraints            |
|----------------|---------|------------------------|
| id             | UUID    | PK                     |
| exam_id        | UUID    | FK → Exam.id cascade   |
| text           | Text    | not null               |
| options        | JSONB   | `[{key, text}]`        |
| correct_answer | String  | not null               |
| order_index    | Integer | not null               |

**ExamSubmission**
| Column       | Type                  | Constraints                      |
|--------------|-----------------------|----------------------------------|
| id           | UUID                  | PK                               |
| exam_id      | UUID                  | FK → Exam.id                     |
| user_id      | UUID                  | FK → User.id                     |
| answers      | JSONB                 | `{question_uuid: answer_key}`    |
| score        | Float                 | nullable                         |
| status       | ExamSubmissionStatus  | default IN_PROGRESS              |
| submitted_at | DateTime(tz)          | nullable                         |
| —            | —                     | UniqueConstraint(exam_id, user_id)|

---

## Pydantic Schema Pattern

Each entity gets four classes:

```python
class CourseBase(BaseModel):
    title: str
    description: str | None = None
    thumbnail_url: str | None = None
    is_published: bool = False

class CourseCreate(CourseBase):
    pass  # all required fields inherited

class CourseUpdate(BaseModel):
    title: str | None = None          # all Optional for PATCH
    description: str | None = None
    thumbnail_url: str | None = None
    is_published: bool | None = None

class CourseResponse(CourseBase):
    id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
```

---

## TypeScript Interface Pattern

```typescript
// matches CourseResponse exactly
export interface Course {
  id: string;              // UUID serialized as string
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;      // ISO 8601 datetime
}

export interface CourseCreate {
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
}

export interface CourseUpdate {
  title?: string;
  description?: string | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
}
```

### JSONB Structures

```typescript
// Question.options
type McqOption = { key: string; text: string };

// ExamSubmission.answers — keyed by question UUID
type ExamAnswers = Record<string, string>; // { "uuid": "A" }
```

---

## Alembic Setup

```bash
cd backend
alembic init alembic
```

Edit `alembic.ini`:
```ini
sqlalchemy.url = %(DATABASE_URL)s
```

Edit `alembic/env.py` — use async engine, import Base:
```python
from app.models import Base
target_metadata = Base.metadata
```

Generate and apply first migration:
```bash
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

---

## Verification

```bash
# Install deps
cd backend && pip install -r requirements.txt

# Syntax check models
python -c "from app.models import *; print('models OK')"

# Syntax check schemas
python -c "from app.schemas import *; print('schemas OK')"

# TypeScript type check
cd ../shared && npx tsc --strict --noEmit --module nodenext --moduleResolution nodenext index.ts

# With real DB
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```
