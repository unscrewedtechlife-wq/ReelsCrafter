import uuid
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, DateTime, Integer, Float, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import enum

from core.database import Base


class AssetType(str, enum.Enum):
    video = "video"
    image = "image"
    audio = "audio"
    document = "document"
    other = "other"


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type: Mapped[AssetType] = mapped_column(SAEnum(AssetType), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(1000), nullable=False)
    bucket: Mapped[str] = mapped_column(String(100))
    key: Mapped[str] = mapped_column(String(500))
    size: Mapped[int | None] = mapped_column(Integer)          # bytes
    duration: Mapped[float | None] = mapped_column(Float)     # seconds
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    mime_type: Mapped[str | None] = mapped_column(String(100))
    meta: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="assets")
    user = relationship("User")
