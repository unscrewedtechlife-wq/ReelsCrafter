from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.template import Template

router = APIRouter()

SEED_TEMPLATES = [
    {
        "title": "Product Launch Ad",
        "description": "A punchy 15-second product reveal with dynamic transitions",
        "category": "ugc",
        "tags": ["product", "ecommerce", "ads"],
        "json_config": {"duration": 15, "aspect_ratio": "9:16", "scenes": 3},
    },
    {
        "title": "Viral Hook Reel",
        "description": "Attention-grabbing short-form reel optimized for Instagram/TikTok",
        "category": "shorts",
        "tags": ["viral", "tiktok", "reels"],
        "json_config": {"duration": 30, "aspect_ratio": "9:16", "scenes": 5},
    },
    {
        "title": "Brand Story Video",
        "description": "Cinematic brand story with voiceover and B-roll",
        "category": "marketing",
        "tags": ["brand", "story", "corporate"],
        "json_config": {"duration": 60, "aspect_ratio": "16:9", "scenes": 6},
    },
    {
        "title": "Before & After Showcase",
        "description": "Split-screen comparison template for transformations",
        "category": "ugc",
        "tags": ["comparison", "before-after", "demo"],
        "json_config": {"duration": 15, "aspect_ratio": "9:16", "scenes": 2},
    },
    {
        "title": "Talking Head Ad",
        "description": "Authentic UGC-style talking head with captions",
        "category": "ugc",
        "tags": ["ugc", "authentic", "captions"],
        "json_config": {"duration": 30, "aspect_ratio": "9:16", "avatar": True},
    },
]


async def seed_templates_if_empty(db: AsyncSession):
    result = await db.execute(select(Template).limit(1))
    if not result.scalar_one_or_none():
        for t in SEED_TEMPLATES:
            template = Template(**t)
            db.add(template)
        await db.flush()


@router.get("/")
async def list_templates(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    await seed_templates_if_empty(db)

    q = select(Template).where(Template.is_public == True)
    if category:
        q = q.where(Template.category == category)
    q = q.order_by(Template.is_featured.desc(), Template.use_count.desc()).limit(limit)

    result = await db.execute(q)
    templates = result.scalars().all()

    return [
        {
            "id": t.id, "title": t.title, "description": t.description,
            "category": t.category, "thumbnail": t.thumbnail,
            "tags": t.tags, "use_count": t.use_count,
            "json_config": t.json_config, "is_featured": t.is_featured,
        }
        for t in templates
    ]


@router.get("/{template_id}")
async def get_template(template_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Template).where(Template.id == template_id))
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    template.use_count += 1
    await db.flush()
    return {
        "id": template.id, "title": template.title, "description": template.description,
        "category": template.category, "thumbnail": template.thumbnail,
        "tags": template.tags, "use_count": template.use_count,
        "json_config": template.json_config,
    }
