"""
Pydantic schemas for the Bug Tracker backend.

These classes define the shapes of data exchanged via the API:
- `BugCreate` for creating new bug reports.
- `BugUpdate` for partial updates to existing bug reports.
- `BugResponse` for data returned to clients.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class BugCreate(BaseModel):
    """
    Schema for creating a new bug.
    """

    title: str
    description: str
    priority: str
    bug_type: str
    sprint: Optional[str] = None


class BugUpdate(BaseModel):
    """
    Schema for updating an existing bug.

    All fields are optional to support partial updates.
    """

    status: Optional[str] = None
    priority: Optional[str] = None
    bug_type: Optional[str] = None
    sprint: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None


class BugResponse(BaseModel):
    """
    Schema for bug objects returned from the API.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: str
    priority: str
    bug_type: str
    sprint: Optional[str] = None
    ai_suggested_severity: Optional[str] = None
    created_at: datetime
    updated_at: datetime

