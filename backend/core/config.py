"""
Application configuration.

Loads settings from environment variables (via .env in local development).
No secrets are stored here — only host/port/CORS configuration.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

HOST: str = os.getenv("HOST", "127.0.0.1")
PORT: int = int(os.getenv("PORT", "8000"))

PROJECT_NAME: str = "DisasterVision"
VERSION: str = "1.0.0"

ALLOWED_ORIGINS: list[str] = [
    "http://localhost:3000",
]

# --- Storage configuration -------------------------------------------------
# STORAGE_ROOT is the base directory for all files the backend persists to
# disk (uploaded imagery, generated reports, temporary processing output).
# Individual feature modules must not hardcode paths — they should resolve
# paths through utils/storage.py, which reads STORAGE_SUBDIRS below.
STORAGE_ROOT: Path = Path(os.getenv("STORAGE_ROOT", "storage")).resolve()

STORAGE_SUBDIRS: dict[str, Path] = {
    "uploads": STORAGE_ROOT / "uploads",
    "reports": STORAGE_ROOT / "reports",
    "temp": STORAGE_ROOT / "temp",
}

# --- Logging configuration --------------------------------------------------
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()