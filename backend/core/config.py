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

# --- Image upload configuration ---------------------------------------------
# Shared validation rules for before/after imagery uploaded against an
# assessment. Kept centralized so services/image_service.py and any future
# consumer validate against the same limits.
MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "20"))
MAX_UPLOAD_SIZE_BYTES: int = MAX_UPLOAD_SIZE_MB * 1024 * 1024

ALLOWED_IMAGE_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png"}
ALLOWED_IMAGE_CONTENT_TYPES: set[str] = {"image/jpeg", "image/png"}