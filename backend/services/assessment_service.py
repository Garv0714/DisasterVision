"""
Assessment management service.

Implements CRUD operations for Assessment records using in-memory storage.
This module is intentionally the only place that knows how assessments are
persisted — routes call these functions and never touch storage directly,
so swapping the in-memory dict for a database-backed repository later (per
the approved roadmap) will not require any API-layer changes.

Note: the in-memory store is process-local and reset on every restart. It
relies on CPython's GIL for basic dict safety, which is acceptable for
MVP/single-worker development and will be replaced once PostgreSQL is
introduced.
"""

import uuid
from datetime import datetime, timezone

from core.exceptions import NotFoundError
from schemas.assessment import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentStatus,
    AssessmentUpdate,
)
from utils.logger import get_logger

logger = get_logger(__name__)

# In-memory store: assessment_id -> AssessmentResponse
_assessments: dict[str, AssessmentResponse] = {}


def _utc_now() -> datetime:
    """Return the current UTC timestamp."""
    return datetime.now(timezone.utc)


def create_assessment(data: AssessmentCreate) -> AssessmentResponse:
    """Create and store a new assessment record.

    Args:
        data: Validated assessment creation payload.

    Returns:
        An independent copy of the newly created assessment, including
        generated id and timestamps. New assessments always start with
        status PENDING.
    """
    assessment_id = str(uuid.uuid4())
    now = _utc_now()

    assessment = AssessmentResponse(
        id=assessment_id,
        title=data.title,
        description=data.description,
        location=data.location,
        disaster_type=data.disaster_type,
        status=AssessmentStatus.PENDING,
        created_at=now,
        updated_at=now,
    )

    _assessments[assessment_id] = assessment
    logger.info("Created assessment '%s' (%s)", assessment_id, assessment.title)
    return assessment.model_copy()


def list_assessments() -> list[AssessmentResponse]:
    """Return all assessments, most recently created first.

    Each returned object is an independent copy of the stored record.
    """
    ordered = sorted(_assessments.values(), key=lambda a: a.created_at, reverse=True)
    return [a.model_copy() for a in ordered]


def get_assessment(assessment_id: str) -> AssessmentResponse:
    """Retrieve a single assessment by id.

    Returns an independent copy of the stored record so callers cannot
    mutate internal state by modifying the returned object.

    Raises:
        NotFoundError: if no assessment exists with the given id.
    """
    assessment = _assessments.get(assessment_id)
    if assessment is None:
        raise NotFoundError(f"Assessment '{assessment_id}' not found")
    return assessment.model_copy()


def update_assessment(assessment_id: str, data: AssessmentUpdate) -> AssessmentResponse:
    """Apply a partial update to an existing assessment.

    Only fields explicitly set on `data` are applied; omitted fields are
    left unchanged. `updated_at` is always refreshed. Returns an
    independent copy of the stored record.

    Raises:
        NotFoundError: if no assessment exists with the given id.
    """
    existing = get_assessment(assessment_id)

    updates = data.model_dump(exclude_unset=True)
    updated = existing.model_copy(update={**updates, "updated_at": _utc_now()})

    _assessments[assessment_id] = updated
    logger.info("Updated assessment '%s'", assessment_id)
    return updated.model_copy()


def delete_assessment(assessment_id: str) -> None:
    """Delete an assessment by id.

    Raises:
        NotFoundError: if no assessment exists with the given id.
    """
    if assessment_id not in _assessments:
        raise NotFoundError(f"Assessment '{assessment_id}' not found")

    del _assessments[assessment_id]
    logger.info("Deleted assessment '%s'", assessment_id)