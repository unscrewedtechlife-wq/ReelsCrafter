import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from core.database import get_db
from core.security import get_current_user
from core.config import settings
from models.user import User
from models.billing import Subscription, SubscriptionPlan, SubscriptionStatus, CreditTransaction

stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

PLAN_DETAILS = {
    "free":    {"name": "Free",    "price": 0,   "credits": 10,    "price_id": None},
    "creator": {"name": "Creator", "price": 29,  "credits": 1000,  "price_id": settings.STRIPE_PRICE_CREATOR},
    "pro":     {"name": "Pro",     "price": 79,  "credits": 4000,  "price_id": settings.STRIPE_PRICE_PRO},
    "agency":  {"name": "Agency",  "price": 299, "credits": 20000, "price_id": settings.STRIPE_PRICE_AGENCY},
}


class SubscribeRequest(BaseModel):
    plan: str
    success_url: str
    cancel_url: str


class SubscriptionResponse(BaseModel):
    id: str
    plan: str
    status: str
    current_period_end: Optional[str]
    cancel_at_period_end: bool


@router.get("/plans")
async def get_plans():
    return {"plans": [
        {
            "id": "free",    "name": "Free",    "price": 0,   "credits": 10,
            "features": ["10 credits/mo", "720p", "Watermark", "Limited queue"],
        },
        {
            "id": "creator", "name": "Creator", "price": 29,  "credits": 1000,
            "features": ["1,000 credits/mo", "1080p", "No watermark", "Standard queue"],
        },
        {
            "id": "pro",     "name": "Pro",     "price": 79,  "credits": 4000,
            "features": ["4,000 credits/mo", "1080p", "Priority queue", "Team workspaces"],
        },
        {
            "id": "agency",  "name": "Agency",  "price": 299, "credits": 20000,
            "features": ["20,000 credits/mo", "4K", "Priority queue", "White label", "API access"],
        },
    ]}


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Subscription).where(Subscription.user_id == user.id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="No subscription found")
    return SubscriptionResponse(
        id=sub.id,
        plan=sub.plan.value,
        status=sub.status.value,
        current_period_end=sub.current_period_end.isoformat() if sub.current_period_end else None,
        cancel_at_period_end=sub.cancel_at_period_end,
    )


@router.post("/subscribe")
async def subscribe(
    body: SubscribeRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    plan = PLAN_DETAILS.get(body.plan)
    if not plan or not plan["price_id"]:
        raise HTTPException(status_code=400, detail="Invalid plan or free plan selected")

    # Get or create Stripe customer
    result = await db.execute(select(Subscription).where(Subscription.user_id == user.id))
    sub = result.scalar_one_or_none()

    customer_id = sub.stripe_customer_id if sub else None
    if not customer_id:
        customer = stripe.Customer.create(email=user.email, name=user.name)
        customer_id = customer.id
        if sub:
            sub.stripe_customer_id = customer_id
        await db.flush()

    # Create Stripe Checkout Session
    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": plan["price_id"], "quantity": 1}],
        mode="subscription",
        success_url=body.success_url,
        cancel_url=body.cancel_url,
        metadata={"user_id": user.id, "plan": body.plan},
    )
    return {"checkout_url": session.url}


@router.post("/portal")
async def billing_portal(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Subscription).where(Subscription.user_id == user.id))
    sub = result.scalar_one_or_none()
    if not sub or not sub.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No billing account found")

    portal = stripe.billing_portal.Session.create(
        customer=sub.stripe_customer_id,
        return_url=f"{settings.FRONTEND_URL}/billing",
    )
    return {"portal_url": portal.url}


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["metadata"]["user_id"]
        plan_name = session["metadata"]["plan"]
        stripe_sub_id = session.get("subscription")

        plan = PLAN_DETAILS.get(plan_name, {})

        result = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
        sub = result.scalar_one_or_none()
        if sub:
            sub.plan = SubscriptionPlan(plan_name)
            sub.status = SubscriptionStatus.active
            sub.stripe_subscription_id = stripe_sub_id
            sub.stripe_customer_id = session.get("customer")

        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if user:
            credits_to_add = plan.get("credits", 0)
            user.credits += credits_to_add
            txn = CreditTransaction(
                user_id=user_id,
                credits=credits_to_add,
                balance_after=user.credits,
                action="subscription_purchase",
                ref_id=stripe_sub_id,
                note=f"Plan upgrade to {plan_name}",
            )
            db.add(txn)

        await db.flush()

    elif event["type"] == "customer.subscription.deleted":
        stripe_sub = event["data"]["object"]
        result = await db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub["id"])
        )
        sub = result.scalar_one_or_none()
        if sub:
            sub.status = SubscriptionStatus.canceled
            sub.plan = SubscriptionPlan.free

    return {"received": True}


@router.get("/credits")
async def get_credits(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CreditTransaction)
        .where(CreditTransaction.user_id == user.id)
        .order_by(CreditTransaction.created_at.desc())
        .limit(20)
    )
    txns = result.scalars().all()
    return {
        "balance": user.credits,
        "transactions": [
            {
                "id": t.id,
                "credits": t.credits,
                "balance_after": t.balance_after,
                "action": t.action,
                "note": t.note,
                "created_at": t.created_at.isoformat(),
            }
            for t in txns
        ],
    }
