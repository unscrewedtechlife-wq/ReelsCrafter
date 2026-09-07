import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from core.database import Base


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar: Mapped[str | None] = mapped_column(String(500))
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.user)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    credits: Mapped[int] = mapped_column(default=10)  # free tier default
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    generations = relationship("Generation", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    credit_transactions = relationship("CreditTransaction", back_populates="user")
    owned_teams = relationship("Team", back_populates="owner")
    team_memberships = relationship("TeamMember", back_populates="user")
