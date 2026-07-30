"""
Centralized exception types and FastAPI exception handlers.

Feature modules should raise the exceptions defined here (instead of bare
Exception or ad-hoc HTTPException) so that every error response returned by
the API follows the same JSON shape: {"error": <type>, "detail": <message>}.
"""

import logging

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class DisasterVisionError(Exception):
    """Base class for all application-specific errors.

    Feature-specific exceptions should subclass this rather than being
    raised directly, so they carry a sensible default status_code.
    """

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class StorageError(DisasterVisionError):
    """Raised when a file storage operation (save/read/delete) fails."""

    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NotFoundError(DisasterVisionError):
    """Raised when a requested resource does not exist."""

    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=status.HTTP_404_NOT_FOUND)


class ValidationError(DisasterVisionError):
    """Raised when input fails application-level validation."""

    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


async def _disaster_vision_error_handler(
    request: Request, exc: DisasterVisionError
) -> JSONResponse:
    """Handle any DisasterVisionError subclass with a consistent JSON body."""
    logger.error("%s: %s (%s)", exc.__class__.__name__, exc.message, request.url.path)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.__class__.__name__, "detail": exc.message},
    )


async def _unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for exceptions that were not anticipated.

    Prevents raw tracebacks from leaking to API consumers while still
    logging the full exception for debugging.
    """
    logger.exception("Unhandled exception on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "detail": "An unexpected error occurred.",
        },
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Attach centralized exception handlers to the FastAPI app instance."""
    app.add_exception_handler(DisasterVisionError, _disaster_vision_error_handler)
    app.add_exception_handler(Exception, _unhandled_exception_handler)