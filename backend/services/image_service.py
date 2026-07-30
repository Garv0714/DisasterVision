"""
Image upload and image pair management service.

Implements validation, physical storage, and in-memory metadata tracking
for before/after imagery attached to an assessment. Physical file I/O is
delegated entirely to utils/storage.py (Milestone 2); this module only
decides *what* gets stored and *validates* what comes in. Existence of the
parent assessment is enforced by calling into services/assessment_service.py
(Milestone 3) rather than duplicating lookup logic.

Note: like assessment_service.py, image metadata is kept in an in-memory,
process-local dict. It is reset on every restart and will be replaced when
persistent storage (database) is introduced.
"""

import uuid
from datetime import datetime, timezone
from pathlib import Path

from core.config import (
    ALLOWED_IMAGE_CONTENT_TYPES,
    ALLOWED_IMAGE_EXTENSIONS,
    MAX_UPLOAD_SIZE_BYTES,
    MAX_UPLOAD_SIZE_MB,
)
from core.exceptions import NotFoundError, ValidationError
from schemas.image import ImageMetadata, ImagePairResponse, ImageRole
from services import assessment_service
from utils.logger import get_logger
from utils.storage import delete_file, save_file

logger = get_logger(__name__)

# In-memory store: assessment_id -> {"before": ImageMetadata, "after": ImageMetadata}
_image_pairs: dict[str, dict[str, ImageMetadata]] = {}

_STORAGE_CATEGORY = "uploads"


def _utc_now() -> datetime:
    """Return the current UTC timestamp."""
    return datetime.now(timezone.utc)


def validate_image_file(filename: str, content_type: str, size_bytes: int) -> None:
    """Validate an incoming image against the configured upload rules.

    Checks file extension, declared content type, and size. Does not
    inspect the actual file bytes (no image-decoding library is part of
    the MVP stack yet), so this is a best-effort validation based on
    client-declared metadata.

    Raises:
        ValidationError: if any rule is violated.
    """
    if size_bytes == 0:
        raise ValidationError("Uploaded file is empty")

    if size_bytes > MAX_UPLOAD_SIZE_BYTES:
        raise ValidationError(
            f"File exceeds maximum allowed size of {MAX_UPLOAD_SIZE_MB} MB"
        )

    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_IMAGE_EXTENSIONS))
        raise ValidationError(f"Unsupported file extension '{extension}'. Allowed: {allowed}")

    if content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        allowed = ", ".join(sorted(ALLOWED_IMAGE_CONTENT_TYPES))
        raise ValidationError(f"Unsupported content type '{content_type}'. Allowed: {allowed}")


def save_image(
    assessment_id: str,
    role: ImageRole,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> ImageMetadata:
    """Validate, persist, and record metadata for an uploaded image.

    Confirms the parent assessment exists, validates the file against
    upload rules, writes it to disk via utils/storage.py, and replaces
    any previously stored image for the same assessment/role (including
    deleting the old physical file to avoid orphaned uploads).

    Args:
        assessment_id: Id of the assessment this image belongs to.
        role: Whether this is the "before" or "after" image.
        filename: Original filename as uploaded by the client.
        content_type: Declared MIME type of the uploaded file.
        file_bytes: Raw file content.

    Returns:
        An independent copy of the stored image's metadata.

    Raises:
        NotFoundError: if the assessment does not exist.
        ValidationError: if the file fails validation.
    """
    # Confirms the assessment exists; raises NotFoundError otherwise.
    assessment_service.get_assessment(assessment_id)

    validate_image_file(filename, content_type, len(file_bytes))

    extension = Path(filename).suffix.lower()
    stored_filename = f"{assessment_id}_{role.value}_{uuid.uuid4().hex}{extension}"

    save_file(file_bytes, stored_filename, _STORAGE_CATEGORY)

    pair = _image_pairs.setdefault(assessment_id, {})
    previous = pair.get(role.value)

    metadata = ImageMetadata(
        id=str(uuid.uuid4()),
        assessment_id=assessment_id,
        role=role,
        original_filename=filename,
        stored_filename=stored_filename,
        content_type=content_type,
        size_bytes=len(file_bytes),
        uploaded_at=_utc_now(),
    )
    pair[role.value] = metadata

    if previous is not None:
        delete_file(previous.stored_filename, _STORAGE_CATEGORY)
        logger.info(
            "Replaced existing '%s' image for assessment '%s'", role.value, assessment_id
        )

    logger.info(
        "Stored '%s' image for assessment '%s' as '%s'",
        role.value,
        assessment_id,
        stored_filename,
    )
    return metadata.model_copy()


def get_image_pair(assessment_id: str) -> ImagePairResponse:
    """Retrieve the current before/after image metadata for an assessment.

    Either or both of `before`/`after` may be null if not yet uploaded.

    Raises:
        NotFoundError: if the assessment does not exist.
    """
    # Confirms the assessment exists; raises NotFoundError otherwise.
    assessment_service.get_assessment(assessment_id)

    pair = _image_pairs.get(assessment_id, {})
    before = pair.get(ImageRole.BEFORE.value)
    after = pair.get(ImageRole.AFTER.value)

    return ImagePairResponse(
        assessment_id=assessment_id,
        before=before.model_copy() if before else None,
        after=after.model_copy() if after else None,
    )


def delete_image(assessment_id: str, role: ImageRole) -> None:
    """Delete the stored image for a given assessment/role.

    Removes both the physical file (via utils/storage.py) and the
    in-memory metadata record.

    Raises:
        NotFoundError: if the assessment does not exist, or if no image
            has been uploaded for that role.
    """
    # Confirms the assessment exists; raises NotFoundError otherwise.
    assessment_service.get_assessment(assessment_id)

    pair = _image_pairs.get(assessment_id, {})
    existing = pair.get(role.value)

    if existing is None:
        raise NotFoundError(
            f"No '{role.value}' image found for assessment '{assessment_id}'"
        )

    delete_file(existing.stored_filename, _STORAGE_CATEGORY)
    del pair[role.value]

    logger.info("Deleted '%s' image for assessment '%s'", role.value, assessment_id)