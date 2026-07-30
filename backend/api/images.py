"""
Image upload routes.

Thin HTTP layer over services/image_service.py. Handles multipart file
uploads and delegates all validation and business logic to the service layer.
"""

from fastapi import APIRouter, File, Form, UploadFile, status

from schemas.image import ImageMetadata, ImagePairResponse, ImageRole
from services import image_service

router = APIRouter(
    prefix="/assessments/{assessment_id}/images",
    tags=["Images"],
)


@router.post("", response_model=ImageMetadata, status_code=status.HTTP_201_CREATED)
async def upload_image(
    assessment_id: str,
    role: ImageRole = Form(...),
    file: UploadFile = File(...),
) -> ImageMetadata:
    file_bytes = await file.read()

    return image_service.save_image(
        assessment_id=assessment_id,
        role=role,
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream",
        file_bytes=file_bytes,
    )


@router.get("", response_model=ImagePairResponse)
async def get_image_pair(assessment_id: str) -> ImagePairResponse:
    return image_service.get_image_pair(assessment_id)


@router.delete("/{role}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    assessment_id: str,
    role: ImageRole,
) -> None:
    image_service.delete_image(assessment_id, role)