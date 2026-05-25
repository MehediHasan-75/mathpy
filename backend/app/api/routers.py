#"aggregation" file
from fastapi import APIRouter

# Import the individual routing files you created
from app.api import auth, courses, assignments, exams

# Create a master router
api_router = APIRouter()

# Attach all the individual routers to the master router
# This is where we define the URL prefixes and the tags for the Swagger UI (/docs)
api_router.include_router(auth.router, prefix="/users", tags=["Users"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(assignments.router, prefix="/assignments", tags=["Assignments"])
api_router.include_router(exams.router, prefix="/exams", tags=["Exams"])