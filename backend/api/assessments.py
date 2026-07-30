"""
Assessment management routes.

Thin HTTP layer over services/assessment_service.py: routes validate
input via Pydantic schemas, delegate to the service layer, and return
the result. All error handling is delegated to the centralized exception
handlers registered in core/exceptions.py — routes do not catch
NotFoundError themselves.
"""

from fastapi import APIRouter, status

from schemas.assessment import AssessmentCreate, AssessmentResponse, AssessmentUpdate
from services import assessment_service

router = APIRouter(prefix="/assessments", tags=["Assessments"])


@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(payload: AssessmentCreate) -> AssessmentResponse:
    """Create a new assessment record."""
    return assessment_service.create_assessment(payload)


@router.get("", response_model=list[AssessmentResponse])
async def list_assessments() -> list[AssessmentResponse]:
    """List all assessments, most recently created first."""
    return assessment_service.list_assessments()


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(assessment_id: str) -> AssessmentResponse:
    """Retrieve a single assessment by id.

    Returns 404 (via the centralized NotFoundError handler) if the
    assessment does not exist.
    """
    return assessment_service.get_assessment(assessment_id)


@router.patch("/{assessment_id}", response_model=AssessmentResponse)
async def update_assessment(assessment_id: str, payload: AssessmentUpdate) -> AssessmentResponse:
    """Partially update an existing assessment.

    Only fields present in the request body are changed. Returns 404
    (via the centralized NotFoundError handler) if the assessment does
    not exist.
    """
    return assessment_service.update_assessment(assessment_id, payload)


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(assessment_id: str) -> None:
    """Delete an assessment by id.

    Returns 404 (via the centralized NotFoundError handler) if the
    assessment does not exist.
    """
    assessment_service.delete_assessment(assessment_id)