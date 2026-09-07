from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from pydantic import BaseModel
from typing import Optional
from arq import create_pool
from arq.connections import RedisSettings

from core.database import get_db
from core.security import get_current_user
from core.config import settings
from models.user import User
from models.generation import Generation, GenerationStatus, GenerationType
from models.billing import CreditTransaction
from ai.registry import get_video_provider, get_image_provider, get_voice_provider, CREDIT_COSTS, VIDEO_MODELS, IMAGE_MODELS

router = APIRouter()


# ─── Schemas ──────────────────────────────────────────────────────────────────

class VideoGenerateRequest(BaseModel):
    prompt: str
    model: str = "mock"
    aspect_ratio: str = "16:9"
    duration: int = 5             # seconds
    resolution: str = "1080p"
    project_id: Optional[str] = None
    negative_prompt: Optional[str] = None


class ImageGenerateRequest(BaseModel):
    prompt: str
    model: str = "mock"
    width: int = 1024
    height: int = 1024
    num_images: int = 1
    project_id: Optional[str] = None
    negative_prompt: Optional[str] = None


class VoiceGenerateRequest(BaseModel):
    text: str
    model: str = "mock"
    voice_id: str = "default"
    project_id: Optional[str] = None


class GenerationResponse(BaseModel):
    id: str
    type: str
    model: str
    prompt: str
    status: str
    progress: int
    output_url: Optional[str]
    thumbnail_url: Optional[str]
    credits_used: int
    created_at: str

    class Config:
        from_attributes = True


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _video_credit_key(duration: int) -> str:
    if duration <= 5:   return "video_5s"
    if duration <= 10:  return "video_10s"
    if duration <= 15:  return "video_15s"
    return "video_30s"


async def _check_and_deduct_credits(db: AsyncSession, user: User, credits: int, action: str, ref_id: str):
    if user.credits < credits:
        raise HTTPException(status_code=402, detail=f"Insufficient credits. Need {credits}, have {user.credits}.")
    user.credits -= credits
    txn = CreditTransaction(
        user_id=user.id,
        credits=-credits,
        balance_after=user.credits,
        action=action,
        ref_id=ref_id,
    )
    db.add(txn)
    await db.flush()


async def _get_arq_pool():
    return await create_pool(RedisSettings.from_dsn(settings.REDIS_URL))


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/models/video")
async def list_video_models():
    return {"models": VIDEO_MODELS}


@router.get("/models/image")
async def list_image_models():
    return {"models": IMAGE_MODELS}


@router.post("/video", response_model=GenerationResponse, status_code=201)
async def generate_video(
    body: VideoGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    credit_key = _video_credit_key(body.duration)
    credits_needed = CREDIT_COSTS[credit_key]

    generation = Generation(
        user_id=user.id,
        project_id=body.project_id,
        type=GenerationType.video,
        model=body.model,
        prompt=body.prompt,
        negative_prompt=body.negative_prompt,
        config={
            "aspect_ratio": body.aspect_ratio,
            "duration": body.duration,
            "resolution": body.resolution,
        },
        status=GenerationStatus.queued,
        credits_used=credits_needed,
    )
    db.add(generation)
    await db.flush()

    await _check_and_deduct_credits(db, user, credits_needed, "video_generation", generation.id)
    await db.commit()
    await db.refresh(generation)

    # Enqueue background job
    pool = await _get_arq_pool()
    await pool.enqueue_job("job_generate_video", generation.id)
    await pool.close()

    return GenerationResponse(
        id=generation.id,
        type=generation.type.value,
        model=generation.model,
        prompt=generation.prompt,
        status=generation.status.value,
        progress=generation.progress,
        output_url=generation.output_url,
        thumbnail_url=generation.thumbnail_url,
        credits_used=generation.credits_used,
        created_at=generation.created_at.isoformat(),
    )


@router.post("/image", response_model=GenerationResponse, status_code=201)
async def generate_image(
    body: ImageGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    is_hd = body.width >= 1024 or body.height >= 1024
    credits_needed = CREDIT_COSTS["image_hd"] if is_hd else CREDIT_COSTS["image_sd"]

    generation = Generation(
        user_id=user.id,
        project_id=body.project_id,
        type=GenerationType.image,
        model=body.model,
        prompt=body.prompt,
        negative_prompt=body.negative_prompt,
        config={"width": body.width, "height": body.height, "num_images": body.num_images},
        status=GenerationStatus.queued,
        credits_used=credits_needed,
    )
    db.add(generation)
    await db.flush()

    await _check_and_deduct_credits(db, user, credits_needed, "image_generation", generation.id)
    await db.commit()
    await db.refresh(generation)

    pool = await _get_arq_pool()
    await pool.enqueue_job("job_generate_image", generation.id)
    await pool.close()

    return GenerationResponse(
        id=generation.id,
        type=generation.type.value,
        model=generation.model,
        prompt=generation.prompt,
        status=generation.status.value,
        progress=generation.progress,
        output_url=generation.output_url,
        thumbnail_url=generation.thumbnail_url,
        credits_used=generation.credits_used,
        created_at=generation.created_at.isoformat(),
    )


@router.post("/voice", response_model=GenerationResponse, status_code=201)
async def generate_voice(
    body: VoiceGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    credits_needed = CREDIT_COSTS["voice"]

    generation = Generation(
        user_id=user.id,
        project_id=body.project_id,
        type=GenerationType.voice,
        model=body.model,
        prompt=body.text,
        config={"voice_id": body.voice_id},
        status=GenerationStatus.queued,
        credits_used=credits_needed,
    )
    db.add(generation)
    await db.flush()

    await _check_and_deduct_credits(db, user, credits_needed, "voice_generation", generation.id)
    await db.commit()
    await db.refresh(generation)

    pool = await _get_arq_pool()
    await pool.enqueue_job("job_synthesize_voice", generation.id)
    await pool.close()

    return GenerationResponse(
        id=generation.id,
        type=generation.type.value,
        model=generation.model,
        prompt=generation.prompt,
        status=generation.status.value,
        progress=generation.progress,
        output_url=generation.output_url,
        thumbnail_url=generation.thumbnail_url,
        credits_used=generation.credits_used,
        created_at=generation.created_at.isoformat(),
    )


@router.get("/{generation_id}", response_model=GenerationResponse)
async def get_generation(
    generation_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Generation).where(
            and_(Generation.id == generation_id, Generation.user_id == user.id)
        )
    )
    gen = result.scalar_one_or_none()
    if not gen:
        raise HTTPException(status_code=404, detail="Generation not found")

    return GenerationResponse(
        id=gen.id,
        type=gen.type.value,
        model=gen.model,
        prompt=gen.prompt,
        status=gen.status.value,
        progress=gen.progress,
        output_url=gen.output_url,
        thumbnail_url=gen.thumbnail_url,
        credits_used=gen.credits_used,
        created_at=gen.created_at.isoformat(),
    )


@router.get("/", response_model=list[GenerationResponse])
async def list_generations(
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Generation).where(Generation.user_id == user.id)
    if type:
        q = q.where(Generation.type == type)
    if status:
        q = q.where(Generation.status == status)
    q = q.order_by(Generation.created_at.desc()).limit(limit).offset(offset)

    result = await db.execute(q)
    gens = result.scalars().all()

    return [
        GenerationResponse(
            id=g.id, type=g.type.value, model=g.model, prompt=g.prompt,
            status=g.status.value, progress=g.progress, output_url=g.output_url,
            thumbnail_url=g.thumbnail_url, credits_used=g.credits_used,
            created_at=g.created_at.isoformat(),
        )
        for g in gens
    ]
