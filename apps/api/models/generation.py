import uuid
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, DateTime, Integer, Float, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import enum

from core.database import Base


class GenerationStatus(str, enum.Enum):
    queued = "queued"
    processing = "processing"
    rendering = "rendering"
    completed = "completed"
    failed = "failed"


class GenerationType(str, enum.Enum):
    video = "video"
    image = "image"
    voice = "voice"
    avatar = "avatar"


class Generation(Base):
    __tablename__ = "generations"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id: Mapped[str | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))

    # Generation config
    type: Mapped[GenerationType] = mapped_column(SAEnum(GenerationType), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "runway", "flux", "mock"
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    negative_prompt: Mapped[str | None] = mapped_column(Text)
    config: Mapped[dict | None] = mapped_column(JSONB)   # aspect_ratio, duration, etc.

    # Status
    status: Mapped[GenerationStatus] = mapped_column(SAEnum(GenerationStatus), default=GenerationStatus.queued)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    error_message: Mapped[str | None] = mapped_column(Text)

    # Output
    output_url: Mapped[str | None] = mapped_column(String(1000))
    thumbnail_url: Mapped[str | None] = mapped_column(String(1000))
    duration: Mapped[float | None] = mapped_column(Float)

    # Credits
    credits_used: Mapped[int] = mapped_column(Integer, default=0)

    # ARQ job reference
    job_id: Mapped[str | None] = mapped_column(String(100))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user = relationship("User", back_populates="generations")
    project = relationship("Project", back_populates="generations")
