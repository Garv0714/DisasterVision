"""
Reusable file storage utilities.

Provides a small, storage-agnostic API for saving, reading, checking, and
deleting files under the configured storage root (see core/config.py:
STORAGE_ROOT, STORAGE_SUBDIRS). Feature modules (image upload, PDF reports,
etc.) should go through these helpers instead of touching the filesystem
directly, so storage behavior stays consistent and swappable later.
"""

import uuid
from pathlib import Path

from core.config import STORAGE_SUBDIRS
from core.exceptions import StorageError
from utils.logger import get_logger

logger = get_logger(__name__)


def ensure_storage_directories() -> None:
    """Create the storage root and all configured subdirectories if missing.

    Safe to call on every application startup; existing directories are
    left untouched.
    """
    for category, path in STORAGE_SUBDIRS.items():
        path.mkdir(parents=True, exist_ok=True)
        logger.info("Storage category '%s' ready at %s", category, path)


def generate_unique_filename(original_filename: str) -> str:
    """Generate a collision-resistant filename that preserves the original extension.

    Example: "before.png" -> "3f9a1c2b8e4d4f0a9c1e7b6d2a5f8e3c.png"
    """
    extension = Path(original_filename).suffix
    return f"{uuid.uuid4().hex}{extension}"


def get_storage_path(filename: str, category: str) -> Path:
    """Resolve the full filesystem path for a file within a storage category.

    Raises:
        StorageError: if `category` is not a configured storage category.
    """
    if category not in STORAGE_SUBDIRS:
        raise StorageError(f"Unknown storage category: '{category}'")
    return STORAGE_SUBDIRS[category] / filename


def save_file(file_bytes: bytes, filename: str, category: str) -> Path:
    """Save raw bytes to disk under the given storage category.

    Args:
        file_bytes: The raw file content to persist.
        filename: The filename to save as (use generate_unique_filename
            for user-uploaded content to avoid collisions).
        category: One of the keys in STORAGE_SUBDIRS (e.g. "uploads").

    Returns:
        The full path the file was saved to.

    Raises:
        StorageError: if the category is unknown or the write fails.
    """
    destination = get_storage_path(filename, category)

    try:
        destination.write_bytes(file_bytes)
    except OSError as exc:
        logger.error("Failed to save file '%s' to '%s': %s", filename, category, exc)
        raise StorageError(f"Failed to save file '{filename}': {exc}") from exc

    logger.info("Saved file '%s' to category '%s'", filename, category)
    return destination


def read_file(filename: str, category: str) -> bytes:
    """Read raw bytes from disk for a file in the given storage category.

    Raises:
        StorageError: if the category is unknown, the file does not
            exist, or the read fails.
    """
    path = get_storage_path(filename, category)

    if not path.exists():
        raise StorageError(f"File not found: '{filename}' in category '{category}'")

    try:
        return path.read_bytes()
    except OSError as exc:
        logger.error("Failed to read file '%s' from '%s': %s", filename, category, exc)
        raise StorageError(f"Failed to read file '{filename}': {exc}") from exc


def delete_file(filename: str, category: str) -> bool:
    """Delete a file from the given storage category.

    Returns:
        True if a file was found and deleted, False if it did not exist.

    Raises:
        StorageError: if the category is unknown or the delete fails.
    """
    path = get_storage_path(filename, category)

    if not path.exists():
        return False

    try:
        path.unlink()
    except OSError as exc:
        logger.error("Failed to delete file '%s' from '%s': %s", filename, category, exc)
        raise StorageError(f"Failed to delete file '{filename}': {exc}") from exc

    logger.info("Deleted file '%s' from category '%s'", filename, category)
    return True


def file_exists(filename: str, category: str) -> bool:
    """Check whether a file exists within the given storage category."""
    return get_storage_path(filename, category).exists()