import hashlib
from datetime import datetime, timezone

from core.exceptions import NotFoundError, ValidationError
from schemas.analysis import AnalysisResponse, DamageLevel
from services import assessment_service
from services import image_service

# In-memory storage
_analysis_store: dict[str, AnalysisResponse] = {}

_DAMAGE_SUMMARIES = {
    DamageLevel.NONE: "No significant structural changes detected.",
    DamageLevel.LOW: "Minor surface-level damage detected.",
    DamageLevel.MEDIUM: "Moderate structural damage detected.",
    DamageLevel.HIGH: "Significant structural damage detected.",
    DamageLevel.SEVERE: "Severe destruction detected.",
}

_CONFIDENCE = {
    DamageLevel.NONE: 0.96,
    DamageLevel.LOW: 0.91,
    DamageLevel.MEDIUM: 0.86,
    DamageLevel.HIGH: 0.81,
    DamageLevel.SEVERE: 0.77,
}


def _deterministic_damage_level(assessment_id: str) -> DamageLevel:
    """
    Return a deterministic damage level based on the assessment ID.

    This keeps mock responses stable across repeated requests while
    remaining simple to replace with a real AI model later.
    """
    digest = hashlib.sha256(assessment_id.encode()).digest()
    index = digest[0] % len(DamageLevel)
    return list(DamageLevel)[index]


def run_analysis(assessment_id: str) -> AnalysisResponse:
    """
    Run a mock damage analysis.
    """

    # Verify assessment exists
    assessment_service.get_assessment(assessment_id)

    # Verify both images exist
    image_pair = image_service.get_image_pair(assessment_id)

    if image_pair.before is None or image_pair.after is None:
        raise ValidationError(
            "Both 'before' and 'after' images must be uploaded before analysis."
        )

    damage = _deterministic_damage_level(assessment_id)

    result = AnalysisResponse(
        assessment_id=assessment_id,
        damage_level=damage,
        confidence=_CONFIDENCE[damage],
        summary=_DAMAGE_SUMMARIES[damage],
        analyzed_at=datetime.now(timezone.utc),
    )

    _analysis_store[assessment_id] = result

    return result


def get_latest_analysis(assessment_id: str) -> AnalysisResponse:
    """
    Return the latest stored analysis.
    """

    assessment_service.get_assessment(assessment_id)

    result = _analysis_store.get(assessment_id)

    if result is None:
        raise NotFoundError(
            f"No analysis found for assessment '{assessment_id}'."
        )

    return result