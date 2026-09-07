import uuid
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from core.database import Base


class TeamRole(str, enum.Enum):
    owner = "owner"
    admin = "admin"
    member = "member"
    viewer = "viewer"


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    plan: Mapped[str] = mapped_column(String(50), default="free")
    avatar: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="owned_teams", foreign_keys=[owner_id])
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="team")


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    team_id: Mapped[str] = mapped_column(ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[TeamRole] = mapped_column(SAEnum(TeamRole), default=TeamRole.member)
    invited_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")
