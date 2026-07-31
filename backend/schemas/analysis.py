from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class DamageLevel(str, Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    SEVERE = "severe"


class AnalysisResponse(BaseModel):
    assessment_id: str
    damage_level: DamageLevel
    confidence: float = Field(..., ge=0.0, le=1.0)
    summary: str
    analyzed_at: datetime