import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB

from core.database import Base


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    thumbnail: Mapped[str | None] = mapped_column(String(1000))
    preview_url: Mapped[str | None] = mapped_column(String(1000))
    json_config: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    tags: Mapped[list | None] = mapped_column(JSONB)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    use_count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
