from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all models so Alembic can discover them
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connection pool is created lazily by SQLAlchemy
    yield
    # Shutdown: dispose engine if needed


app = FastAPI(title="EdTech Platform API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add Vercel URL here later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running!"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
