"""
Entry point and REST API definition for the Bug Tracker FastAPI backend.

This module:
- Creates the FastAPI application and configures CORS for the React frontend.
- Ensures database tables are created on startup.
- Exposes CRUD endpoints for managing bugs and an endpoint for statistics.
"""

from collections.abc import Mapping
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
from ai_service import suggest_severity
from crud import *  # imported for use in route handlers
from database import *  # provides engine and get_db
from schemas import *  # Pydantic schemas used as request/response models

app = FastAPI(title="Bug Tracker API")

# Frontend origin that is allowed to communicate with this backend.
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure all tables defined on `models.Base` are created in the database.
models.Base.metadata.create_all(bind=engine)


@app.get("/", tags=["Health"])
def read_root() -> dict[str, str]:
    """
    Simple health-check route to confirm that the API is up and reachable.
    """
    return {"status": "BugTracker API running"}


@app.get("/bugs", response_model=list[BugResponse], tags=["Bugs"])
def list_bugs(
    status: Optional[str] = Query(default=None),
    priority: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
) -> list[BugResponse]:
    """
    List all bugs, optionally filtered by status and/or priority.
    """
    bugs = get_bugs(db=db, status=status, priority=priority)
    return bugs


@app.post(
    "/bugs",
    response_model=BugResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Bugs"],
)
def create_bug_endpoint(
    bug: BugCreate,
    db: Session = Depends(get_db),
) -> BugResponse:
    """
    Create a new bug.
    """
    severity = suggest_severity(bug.title, bug.description)
    db_bug = create_bug(db=db, bug=bug, ai_severity=severity)
    return db_bug


@app.get("/bugs/{bug_id}", response_model=BugResponse, tags=["Bugs"])
def get_bug_endpoint(
    bug_id: int,
    db: Session = Depends(get_db),
) -> BugResponse:
    """
    Retrieve a single bug by its ID.
    """
    db_bug = get_bug(db, bug_id)
    if db_bug is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug not found",
        )
    return db_bug


@app.put("/bugs/{bug_id}", response_model=BugResponse, tags=["Bugs"])
def update_bug_endpoint(
    bug_id: int,
    bug_update: BugUpdate,
    db: Session = Depends(get_db),
) -> BugResponse:
    """
    Update an existing bug with the provided fields.
    """
    db_bug = update_bug(db, bug_id, bug_update)
    if db_bug is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug not found",
        )
    return db_bug


@app.delete("/bugs/{bug_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Bugs"])
def delete_bug_endpoint(
    bug_id: int,
    db: Session = Depends(get_db),
) -> None:
    """
    Delete a bug by its ID.
    """
    deleted = delete_bug(db, bug_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug not found",
        )
    # 204 No Content response
    return None


@app.get("/stats", tags=["Stats"])
def get_stats_endpoint(
    db: Session = Depends(get_db),
) -> Mapping[str, Mapping[str, int]]:
    """
    Return aggregate statistics about bugs, grouped by status, priority,
    bug_type, and sprint.
    """
    stats = get_stats(db)
    return stats

