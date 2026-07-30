"""
Health check endpoint.

Used by the frontend to confirm the backend is reachable.
"""

from fastapi import APIRouter

from core.config import VERSION

router = APIRouter()


@router.get("/health")
async def get_health() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "backend",
        "version": VERSION,
    }
