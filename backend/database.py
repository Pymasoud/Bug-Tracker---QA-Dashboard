"""
Database configuration for the Bug Tracker backend.

This module sets up the SQLAlchemy engine and session factory
for an SQLite database file stored locally.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# SQLite database URL (file-based, stored in the project directory)
SQLALCHEMY_DATABASE_URL = "sqlite:///./bugtracker.db"

# For SQLite, `check_same_thread=False` allows the connection to be
# shared with the FastAPI app across different threads.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Factory for creating new database sessions for each request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models that will be defined in this project.
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for FastAPI routes to provide a database session.

    Yields:
        A SQLAlchemy `Session` that is closed after the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

