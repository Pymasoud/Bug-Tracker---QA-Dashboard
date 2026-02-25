"""
SQLAlchemy ORM models for the Bug Tracker backend.

This module currently defines the `Bug` model, which represents a single
bug report in the system and is stored in the SQLite database configured
in `database.py`.
"""

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, func

from database import Base


class Bug(Base):
    """
    Database model for a bug report.

    The enum-like string fields (`status`, `priority`, `bug_type`) are
    constrained by convention in the application layer, but stored as
    plain strings in the database for simplicity.
    """

    __tablename__ = "bugs"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title: str = Column(String(200), nullable=False)
    description: str = Column(Text, nullable=False)

    # Status of the bug: "open", "in_progress", "fixed", "closed"
    status: str = Column(String(50), nullable=False, server_default="open")

    # Priority level: "high", "medium", "low"
    priority: str = Column(String(50), nullable=False, server_default="medium")

    # Type/category of bug: "crash", "ui", "performance", "logic", "security", "other"
    bug_type: str = Column(String(50), nullable=False, server_default="other")

    # Optional sprint label, e.g. "Sprint-1"
    sprint: str | None = Column(String(100), nullable=True)

    # Optional AI-generated severity suggestion from an LLM
    ai_suggested_severity: str | None = Column(String(100), nullable=True)

    # Timestamps are handled automatically by the database.
    created_at: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

