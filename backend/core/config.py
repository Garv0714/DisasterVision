"""
Application configuration.

Loads settings from environment variables (via .env in local development).
No secrets are stored here — only host/port/CORS configuration.
"""

import os

from dotenv import load_dotenv

load_dotenv()

HOST: str = os.getenv("HOST", "127.0.0.1")
PORT: int = int(os.getenv("PORT", "8000"))

PROJECT_NAME: str = "DisasterVision"
VERSION: str = "1.0.0"

ALLOWED_ORIGINS: list[str] = [
    "http://localhost:3000",
]
