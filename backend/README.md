# backend

FastAPI backend with async PostgreSQL (SQLAlchemy 2.0 + asyncpg).

## Setup

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/mathpy
```

## Structure

```
app/
├── main.py          # FastAPI app + CORS + lifespan
├── core/
│   └── database.py  # async engine, AsyncSession, get_db dependency
├── models/          # SQLAlchemy 2.0 ORM models
│   ├── base.py
│   ├── user.py      # User, ActiveToken
│   ├── course.py    # Course, Chapter, Lesson, CourseEnrollment, LessonProgress, StudyMaterial
│   ├── assignment.py
│   └── exam.py      # Exam, Question, ExamSubmission
└── schemas/         # Pydantic v2 validation (Base/Create/Update/Response per entity)
    ├── user.py
    ├── course.py
    ├── assignment.py
    └── exam.py
```

## Migrations (Alembic)

```bash
alembic init alembic
# configure alembic/env.py — import Base from app.models, use async engine
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

See `docs/schema-design.md` at repo root for full schema reference.
