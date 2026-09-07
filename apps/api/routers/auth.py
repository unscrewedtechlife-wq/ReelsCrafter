from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr

from core.database import get_db
from core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    get_current_user,
)
from core.config import settings
from models.user import User
from models.billing import Subscription, SubscriptionPlan

router = APIRouter()


# ─── Schemas ──────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar: str | None
    role: str
    credits: int
    created_at: str

    class Config:
        from_attributes = True


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(body: SignupRequest, db: AsyncSession = Depends(get_db)):
    # Check duplicate email
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=body.email,
        name=body.name,
        password_hash=hash_password(body.password),
        credits=settings.FREE_CREDITS,
    )
    db.add(user)
    await db.flush()

    # Create free subscription record
    sub = Subscription(user_id=user.id, plan=SubscriptionPlan.free)
    db.add(sub)
    await db.flush()

    access = create_access_token({"sub": user.id})
    refresh = create_refresh_token({"sub": user.id})
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    access = create_access_token({"sub": user.id})
    refresh = create_refresh_token({"sub": user.id})
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest):
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = payload.get("sub")
    access = create_access_token({"sub": user_id})
    refresh_new = create_refresh_token({"sub": user_id})
    return TokenResponse(access_token=access, refresh_token=refresh_new)


@router.get("/me", response_model=UserResponse)
async def me(user: User = Depends(get_current_user)):
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        avatar=user.avatar,
        role=user.role.value,
        credits=user.credits,
        created_at=user.created_at.isoformat(),
    )


@router.post("/logout")
async def logout():
    # JWT is stateless; client should discard tokens.
    # For production, maintain a token blocklist in Redis.
    return {"message": "Logged out successfully"}
