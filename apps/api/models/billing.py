import uuid
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, DateTime, Enum as SAEnum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from core.database import Base


class SubscriptionPlan(str, enum.Enum):
    free = "free"
    creator = "creator"
    pro = "pro"
    agency = "agency"


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    past_due = "past_due"
    canceled = "canceled"
    trialing = "trialing"
    incomplete = "incomplete"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    stripe_customer_id: Mapped[str | None] = mapped_column(String(100), unique=True)
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(100), unique=True)
    plan: Mapped[SubscriptionPlan] = mapped_column(SAEnum(SubscriptionPlan), default=SubscriptionPlan.free)
    status: Mapped[SubscriptionStatus] = mapped_column(SAEnum(SubscriptionStatus), default=SubscriptionStatus.active)
    current_period_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    current_period_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancel_at_period_end: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="subscription")


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    credits: Mapped[int] = mapped_column(Integer, nullable=False)   # positive = add, negative = deduct
    balance_after: Mapped[int] = mapped_column(Integer, nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "image_generation", "monthly_reset"
    ref_id: Mapped[str | None] = mapped_column(String(100))          # generation_id, stripe_invoice_id, etc.
    note: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="credit_transactions")
