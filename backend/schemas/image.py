"""
Pydantic schemas for image upload and image pair resources.

Defines the response contracts for before/after imagery attached to an
assessment. Upload requests themselves are handled via FastAPI's
`UploadFile` (multipart/form-data) in api/images.py rather than a Pydantic
body model, since file uploads aren't JSON payloads — these schemas
describe what gets stored and returned after an upload succeeds.
"""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class ImageRole(str, Enum):
    """The two supported positions an image can occupy in an assessment."""

    BEFORE = "before"
    AFTER = "after"


class ImageMetadata(BaseModel):
    """Metadata for a single stored image."""

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique identifier for this image record")
    assessment_id: str = Field(..., description="Id of the assessment this image belongs to")
    role: ImageRole = Field(..., description="Whether this is the 'before' or 'after' image")
    original_filename: str = Field(..., description="Filename as uploaded by the client")
    stored_filename: str = Field(..., description="Filename used on disk under storage/uploads")
    content_type: str = Field(..., description="Declared MIME type of the uploaded file")
    size_bytes: int = Field(..., ge=0, description="Size of the uploaded file in bytes")
    uploaded_at: datetime = Field(..., description="UTC timestamp the image was uploaded")


class ImagePairResponse(BaseModel):
    """The current before/after image state for an assessment.

    Either field may be null if that role has not been uploaded yet —
    a pair does not need to be complete to be queried.
    """

    assessment_id: str = Field(..., description="Id of the assessment this pair belongs to")
    before: ImageMetadata | None = Field(None, description="The 'before' image, if uploaded")
    after: ImageMetadata | None = Field(None, description="The 'after' image, if uploaded")