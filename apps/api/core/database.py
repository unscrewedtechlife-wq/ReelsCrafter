import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import JSON
import sqlalchemy.dialects.postgresql

logger = logging.getLogger("ViewmaxDB")

# Map PostgreSQL JSONB to standard JSON for cross-database (PostgreSQL + SQLite) compatibility
sqlalchemy.dialects.postgresql.JSONB = JSON

from core.config import settings


class Base(DeclarativeBase):
    pass


def _create_engine(url: str):
    if url.startswith("sqlite"):
        return create_async_engine(
            url,
            echo=settings.ENVIRONMENT == "development",
        )
    return create_async_engine(
        url,
        echo=settings.ENVIRONMENT == "development",
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
    )


engine = _create_engine(settings.DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db():
    global engine, AsyncSessionLocal
    import models  # Ensure all models are registered in Base.metadata

    # 1. Attempt connection with configured settings.DATABASE_URL
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database connected and tables verified.")
        return
    except Exception as e:
        print(f"Primary database connection to {settings.DATABASE_URL} failed: {e}")

    # 2. Fall back to local SQLite database for standalone mode
    sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "viewmax.db"))
    sqlite_url = f"sqlite+aiosqlite:///{sqlite_path}"
    print(f"Proceeding with local persistent SQLite database at: {sqlite_url}")

    try:
        await engine.dispose()
    except Exception:
        pass

    engine = _create_engine(sqlite_url)
    AsyncSessionLocal.configure(bind=engine)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("SQLite database initialized and all tables created successfully.")


async def get_db():
    """FastAPI dependency — yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
