"""
Pydantic schemas for Assessment resources.

Defines the request/response contracts for assessment management endpoints.
Schemas here are intentionally scoped to CRUD operations on assessment
records — no image, analysis, or report data lives on this model yet;
those will be added as their own schemas in later milestones and referenced
here (e.g. via an assessment_id foreign key) rather than embedded.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DisasterType(str, Enum):
    """Supported disaster categories for an assessment."""

    EARTHQUAKE = "earthquake"
    FLOOD = "flood"
    HURRICANE = "hurricane"
    WILDFIRE = "wildfire"
    TORNADO = "tornado"
    OTHER = "other"


class AssessmentStatus(str, Enum):
    """Lifecycle status of an assessment.

    Milestone 3 only creates/reads/updates this field directly. Later
    milestones (image upload, analysis) may transition status
    automatically as work progresses through the pipeline.
    """

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class AssessmentBase(BaseModel):
    """Fields shared by create and update payloads."""

    title: str = Field(..., min_length=1, max_length=200, description="Short name for the assessment")
    description: Optional[str] = Field(
        None, max_length=2000, description="Free-text notes about the assessment"
    )
    location: Optional[str] = Field(
        None, max_length=200, description="Human-readable location, e.g. city/region"
    )
    disaster_type: DisasterType = Field(..., description="Category of disaster being assessed")


class AssessmentCreate(AssessmentBase):
    """Payload for creating a new assessment."""


class AssessmentUpdate(BaseModel):
    """Payload for partially updating an existing assessment.

    All fields are optional; only fields explicitly provided are applied.
    """

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    location: Optional[str] = Field(None, max_length=200)
    disaster_type: Optional[DisasterType] = None
    status: Optional[AssessmentStatus] = None


class AssessmentResponse(AssessmentBase):
    """Full assessment record returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique assessment identifier")
    status: AssessmentStatus = Field(..., description="Current lifecycle status")
    created_at: datetime = Field(..., description="UTC timestamp the assessment was created")
    updated_at: datetime = Field(..., description="UTC timestamp the assessment was last updated")