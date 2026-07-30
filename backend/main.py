"""
DisasterVision backend entrypoint.

Milestone 1 scope only: root status route, health route, and CORS
configuration. No business logic, storage, or ML lives here.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.health import router as health_router
from core.config import ALLOWED_ORIGINS, PROJECT_NAME, VERSION

app = FastAPI(title=PROJECT_NAME, version=VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)


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
