"""
CRUD (Create, Read, Update, Delete) helpers for Bug records.

These functions encapsulate common database operations on the `Bug` model
so the FastAPI route handlers can stay clean and focused on HTTP concerns.
"""

from collections.abc import Mapping
from typing import Any, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Bug
from schemas import BugCreate, BugUpdate


def get_bugs(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> list[Bug]:
    """
    Return all bugs, optionally filtered by status and/or priority.
    """
    query = db.query(Bug)

    if status is not None:
        query = query.filter(Bug.status == status)
    if priority is not None:
        query = query.filter(Bug.priority == priority)

    return query.order_by(Bug.created_at.desc()).all()


def get_bug(db: Session, bug_id: int) -> Optional[Bug]:
    """
    Return a single bug by its primary key ID, or None if not found.
    """
    return db.query(Bug).filter(Bug.id == bug_id).first()


def create_bug(db: Session, bug: BugCreate, ai_severity: Optional[str]) -> Bug:
    """
    Create and persist a new bug record.

    Args:
        db: Active database session.
        bug: Pydantic schema with user-supplied bug details.
        ai_severity: Optional AI-generated severity label.
    """
    bug_data: Mapping[str, Any] = bug.model_dump()

    db_bug = Bug(
        **bug_data,
        ai_suggested_severity=ai_severity,
    )

    db.add(db_bug)
    db.commit()
    db.refresh(db_bug)
    return db_bug


def update_bug(db: Session, bug_id: int, bug_update: BugUpdate) -> Optional[Bug]:
    """
    Update an existing bug with only the fields provided in `bug_update`.

    Returns the updated bug, or None if the bug does not exist.
    """
    db_bug = get_bug(db, bug_id)
    if db_bug is None:
        return None

    update_data: Mapping[str, Any] = bug_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_bug, field, value)

    db.commit()
    db.refresh(db_bug)
    return db_bug


def delete_bug(db: Session, bug_id: int) -> bool:
    """
    Delete a bug by its ID.

    Returns True if a bug was deleted, False if the bug did not exist.
    """
    db_bug = get_bug(db, bug_id)
    if db_bug is None:
        return False

    db.delete(db_bug)
    db.commit()
    return True


def get_stats(db: Session) -> dict[str, dict[str, int]]:
    """
    Return aggregated statistics for bugs.

    The result is a dictionary with counts grouped by status, priority,
    bug_type, and sprint (sprints with no value are omitted).
    """
    status_counts = dict(
        db.query(Bug.status, func.count(Bug.id)).group_by(Bug.status).all()
    )
    priority_counts = dict(
        db.query(Bug.priority, func.count(Bug.id)).group_by(Bug.priority).all()
    )
    bug_type_counts = dict(
        db.query(Bug.bug_type, func.count(Bug.id)).group_by(Bug.bug_type).all()
    )
    sprint_counts = dict(
        db.query(Bug.sprint, func.count(Bug.id))
        .filter(Bug.sprint.isnot(None))
        .group_by(Bug.sprint)
        .all()
    )

    return {
        "status": status_counts,
        "priority": priority_counts,
        "bug_type": bug_type_counts,
        "sprint": sprint_counts,
    }

