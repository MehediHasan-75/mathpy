from contextlib import asynccontextmanager

from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]

# Import all models so Alembic can discover them
from app.api.routers import api_router
import app.models  # noqa: F401

#handling things that need to happen exactly once when the server starts, and exactly once when it shuts down
@asynccontextmanager
async def lifespan(app: FastAPI):
    
    # Pause here and let the FastAPI server run
    # All API requests are handled while paused at `yield`
    yield
    
    # --- PHASE 3: SHUTDOWN ---
    # This code runs once when the server is stopping
    print("3. Server is shutting down!")


app = FastAPI(title="EdTech Platform API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add Vercel URL here later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running!"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
