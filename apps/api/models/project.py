import uuid
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, DateTime, Enum as SAEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import enum

from core.database import Base


class ProjectType(str, enum.Enum):
    video = "video"
    image = "image"
    ugc = "ugc"
    shorts = "shorts"
    marketing = "marketing"
    general = "general"


class ProjectStatus(str, enum.Enum):
    active = "active"
    archived = "archived"
    deleted = "deleted"


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    team_id: Mapped[str | None] = mapped_column(ForeignKey("teams.id", ondelete="SET NULL"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    type: Mapped[ProjectType] = mapped_column(SAEnum(ProjectType), default=ProjectType.general)
    status: Mapped[ProjectStatus] = mapped_column(SAEnum(ProjectStatus), default=ProjectStatus.active)
    thumbnail: Mapped[str | None] = mapped_column(String(500))
    meta: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="projects")
    team = relationship("Team", back_populates="projects")
    assets = relationship("Asset", back_populates="project", cascade="all, delete-orphan")
    generations = relationship("Generation", back_populates="project")
