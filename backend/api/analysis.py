from fastapi import APIRouter, status

from schemas.analysis import AnalysisResponse
from services import analysis_service

router = APIRouter(
    prefix="/assessments/{assessment_id}",
    tags=["Analysis"],
)


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
async def analyze_assessment(assessment_id: str):
    """
    Run a mock damage analysis.
    """
    return analysis_service.run_analysis(assessment_id)


@router.get(
    "/analysis",
    response_model=AnalysisResponse,
)
async def get_analysis(assessment_id: str):
    """
    Return the latest stored analysis.
    """
    return analysis_service.get_latest_analysis(assessment_id)