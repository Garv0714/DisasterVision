"""
DisasterVision backend entrypoint.

Composition root: creates the FastAPI app, configures CORS and logging,
registers centralized exception handlers, ensures storage directories
exist, and wires up feature routers. Business logic itself lives in the
services/analysis/reports/ml packages, not here.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.assessments import router as assessments_router
from api.health import router as health_router
from core.config import ALLOWED_ORIGINS, PROJECT_NAME, VERSION
from core.exceptions import register_exception_handlers
from utils.logger import get_logger, setup_logging
from utils.storage import ensure_storage_directories

setup_logging()
logger = get_logger(__name__)

app = FastAPI(title=PROJECT_NAME, version=VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)
ensure_storage_directories()

app.include_router(health_router)
app.include_router(assessments_router)


@app.get("/")
async def get_root() -> dict[str, str]:
    return {
        "project": PROJECT_NAME,
        "status": "running",
    }


if __name__ == "__main__":
    import uvicorn

    from core.config import HOST, PORT

    print(f"Starting {PROJECT_NAME} backend on http://{HOST}:{PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)