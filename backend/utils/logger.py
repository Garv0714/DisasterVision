"""
Centralized logging utilities.

Call `setup_logging()` once at application startup (done in main.py), then
call `get_logger(__name__)` in any module to obtain a logger that shares
the same format, level, and output stream.
"""

import logging
import sys

from core.config import LOG_LEVEL


def setup_logging() -> None:
    """Configure the root logger's level, format, and output stream.

    Safe to call more than once: if the root logger already has handlers
    attached, this is a no-op, so repeated imports/calls won't produce
    duplicate log lines.
    """
    root_logger = logging.getLogger()

    if root_logger.handlers:
        return

    root_logger.setLevel(LOG_LEVEL)

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)


def get_logger(name: str) -> logging.Logger:
    """Return a module-scoped logger.

    `setup_logging()` should be called once at startup before this is
    used, otherwise the logger falls back to Python's default handler.
    """
    return logging.getLogger(name)