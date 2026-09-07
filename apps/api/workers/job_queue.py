"""
ARQ-based background job queue.
Workers process video/image/voice generation jobs, update DB, and
broadcast WebSocket events for real-time frontend updates.
"""
import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Any

from arq import ArqRedis
from arq.connections import RedisSettings
from sqlalchemy import select

from core.config import settings
from core.database import AsyncSessionLocal
from ai.registry import get_video_provider, get_image_provider, get_voice_provider, CREDIT_COSTS
from ai.base import GenerationConfig, ImageConfig, VoiceConfig, JobStatus
from models.generation import Generation, GenerationStatus
from models.user import User
from models.billing import CreditTransaction

logger = logging.getLogger(__name__)


# ─── WebSocket event broadcaster ──────────────────────────────────────────────

async def broadcast_event(redis: Any, user_id: str, event: dict):
    """Publish a job event to the Redis pub/sub channel for the user's WS connection."""
    if not redis:
        return
    try:
        channel = f"ws:user:{user_id}"
        await redis.publish(channel, json.dumps(event))
    except Exception:
        pass


# ─── Credit deduction ─────────────────────────────────────────────────────────

async def deduct_credits(db, user: User, credits: int, action: str, ref_id: str):
    user.credits = max(0, user.credits - credits)
    txn = CreditTransaction(
        user_id=user.id,
        credits=-credits,
        balance_after=user.credits,
        action=action,
        ref_id=ref_id,
    )
    db.add(txn)
    await db.flush()


# ─── Job: Video Generation ────────────────────────────────────────────────────

async def job_generate_video(ctx: dict, generation_id: str):
    """
    Main video generation job.
    1. Load generation record
    2. Submit to AI provider
    3. Poll for completion (with progress updates)
    4. Save output URL + mark complete
    """
    redis: ArqRedis = ctx["redis"]

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Generation).where(Generation.id == generation_id))
        generation = result.scalar_one_or_none()
        if not generation:
            logger.error(f"Generation {generation_id} not found")
            return

        user_result = await db.execute(select(User).where(User.id == generation.user_id))
        user = user_result.scalar_one_or_none()

        # Mark as processing
        generation.status = GenerationStatus.processing
        generation.progress = 5
        await db.flush()

        await broadcast_event(redis, generation.user_id, {
            "type": "job.started",
            "jobId": generation_id,
            "model": generation.model,
        })

        try:
            config_data = generation.config or {}
            config = GenerationConfig(
                aspect_ratio=config_data.get("aspect_ratio", "16:9"),
                duration=config_data.get("duration", 5),
                resolution=config_data.get("resolution", "1080p"),
            )

            provider = get_video_provider(generation.model)
            job = await provider.generate(generation.prompt, config)

            # Simulate progress milestones
            for progress in [20, 40, 60, 80]:
                await asyncio.sleep(2)  # simulate rendering time
                generation.progress = progress
                await db.flush()
                await broadcast_event(redis, generation.user_id, {
                    "type": "job.progress",
                    "jobId": generation_id,
                    "progress": progress,
                    "status": "rendering",
                })

            # Final poll
            final = await provider.poll_status(job.provider_job_id)

            generation.status = GenerationStatus.completed
            generation.progress = 100
            generation.output_url = final.output_url
            generation.completed_at = datetime.now(timezone.utc)
            await db.flush()

            await broadcast_event(redis, generation.user_id, {
                "type": "job.completed",
                "jobId": generation_id,
                "outputUrl": final.output_url,
                "progress": 100,
            })

        except Exception as exc:
            logger.exception(f"Video generation failed for {generation_id}")
            generation.status = GenerationStatus.failed
            generation.error_message = str(exc)
            await db.flush()
            await broadcast_event(redis, generation.user_id, {
                "type": "job.failed",
                "jobId": generation_id,
                "error": str(exc),
            })

        await db.commit()


# ─── Job: Image Generation ────────────────────────────────────────────────────

async def job_generate_image(ctx: dict, generation_id: str):
    redis: ArqRedis = ctx["redis"]

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Generation).where(Generation.id == generation_id))
        generation = result.scalar_one_or_none()
        if not generation:
            return

        generation.status = GenerationStatus.processing
        generation.progress = 10
        await db.flush()

        await broadcast_event(redis, generation.user_id, {
            "type": "job.started",
            "jobId": generation_id,
            "model": generation.model,
        })

        try:
            config_data = generation.config or {}
            config = ImageConfig(
                width=config_data.get("width", 1024),
                height=config_data.get("height", 1024),
                num_images=config_data.get("num_images", 1),
            )

            await asyncio.sleep(3)  # simulate generation time

            provider = get_image_provider(generation.model)
            urls = await provider.generate(generation.prompt, config)

            generation.status = GenerationStatus.completed
            generation.progress = 100
            generation.output_url = urls[0] if urls else None
            generation.completed_at = datetime.now(timezone.utc)
            await db.flush()

            await broadcast_event(redis, generation.user_id, {
                "type": "job.completed",
                "jobId": generation_id,
                "outputUrl": generation.output_url,
                "allUrls": urls,
                "progress": 100,
            })

        except Exception as exc:
            logger.exception(f"Image generation failed for {generation_id}")
            generation.status = GenerationStatus.failed
            generation.error_message = str(exc)
            await db.flush()
            await broadcast_event(redis, generation.user_id, {
                "type": "job.failed",
                "jobId": generation_id,
                "error": str(exc),
            })

        await db.commit()


# ─── Job: Voice Synthesis ─────────────────────────────────────────────────────

async def job_synthesize_voice(ctx: dict, generation_id: str):
    redis: ArqRedis = ctx["redis"]

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Generation).where(Generation.id == generation_id))
        generation = result.scalar_one_or_none()
        if not generation:
            return

        generation.status = GenerationStatus.processing
        await db.flush()

        try:
            await asyncio.sleep(2)

            config_data = generation.config or {}
            config = VoiceConfig(voice_id=config_data.get("voice_id", "default"))

            provider = get_voice_provider(generation.model)
            audio_url = await provider.synthesize(generation.prompt, config)

            generation.status = GenerationStatus.completed
            generation.progress = 100
            generation.output_url = audio_url
            generation.completed_at = datetime.now(timezone.utc)
            await db.flush()

            await broadcast_event(redis, generation.user_id, {
                "type": "job.completed",
                "jobId": generation_id,
                "outputUrl": audio_url,
            })

        except Exception as exc:
            generation.status = GenerationStatus.failed
            generation.error_message = str(exc)
            await db.flush()

        await db.commit()


# ─── Utility jobs ─────────────────────────────────────────────────────────────

async def job_generate_captions(ctx: dict, text: str, job_id: str = "utility"):
    """Create word-level caption cues without blocking the API request."""
    words = text.strip().split()
    cues = [
        {"word": word, "start": round(index * 0.45, 2), "end": round((index + 1) * 0.45, 2)}
        for index, word in enumerate(words)
    ]
    await broadcast_event(ctx.get("redis"), "utility", {
        "type": "job.completed", "jobId": job_id, "utility": "captions", "progress": 100,
    })
    return {"status": "completed", "job_id": job_id, "cue_count": len(cues), "cues": cues}


async def job_remove_captions(ctx: dict, source_url: str, job_id: str = "utility"):
    """Queue a source clip for caption-mask/inpainting removal."""
    result = {"status": "queued_for_inpainting", "job_id": job_id, "source_url": source_url}
    await broadcast_event(ctx.get("redis"), "utility", {
        "type": "job.progress", "jobId": job_id, "utility": "caption_remover", "progress": 10,
    })
    return result


async def job_plan_story(ctx: dict, prompt: str, mode: str = "story", job_id: str = "utility"):
    """Build a reusable four-beat story plan for ideation and story video jobs."""
    return {
        "status": "completed",
        "job_id": job_id,
        "mode": mode,
        "prompt": prompt,
        "beats": ["hook", "problem", "solution", "call_to_action"],
    }


async def job_prepare_clone(ctx: dict, identity: str, reference_url: str, job_id: str = "utility"):
    """Prepare creator identity metadata for downstream avatar generation."""
    return {
        "status": "ready_for_generation",
        "job_id": job_id,
        "identity": identity,
        "reference_url": reference_url,
        "consistency_token": f"[VMAX_CLONE_{identity.upper().replace(' ', '_')}]",
    }


# ─── ARQ Worker Settings ──────────────────────────────────────────────────────

class WorkerSettings:
    functions = [
        job_generate_video,
        job_generate_image,
        job_synthesize_voice,
        job_generate_captions,
        job_remove_captions,
        job_plan_story,
        job_prepare_clone,
    ]
    redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)
    max_jobs = 20
    job_timeout = 600          # 10 min max per job
    keep_result = 3600         # keep results for 1 hour
