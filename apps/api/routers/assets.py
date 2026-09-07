from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Optional
import uuid

from core.database import get_db
from core.security import get_current_user
from core.config import settings
from core import storage
from models.user import User
from models.asset import Asset, AssetType

router = APIRouter()

MIME_TO_TYPE = {
    "video/mp4": AssetType.video, "video/webm": AssetType.video,
    "image/jpeg": AssetType.image, "image/png": AssetType.image, "image/webp": AssetType.image,
    "audio/mpeg": AssetType.audio, "audio/wav": AssetType.audio, "audio/ogg": AssetType.audio,
}

BUCKET_FOR_TYPE = {
    AssetType.video: settings.S3_BUCKET_VIDEOS,
    AssetType.image: settings.S3_BUCKET_IMAGES,
    AssetType.audio: settings.S3_BUCKET_AUDIO,
    AssetType.document: settings.S3_BUCKET_UPLOADS,
    AssetType.other: settings.S3_BUCKET_UPLOADS,
}


@router.post("/upload", status_code=201)
async def upload_asset(
    file: UploadFile = File(...),
    project_id: Optional[str] = Form(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    mime = file.content_type or "application/octet-stream"
    asset_type = MIME_TO_TYPE.get(mime, AssetType.other)
    bucket = BUCKET_FOR_TYPE[asset_type]
    key = f"{user.id}/{uuid.uuid4().hex}_{file.filename}"

    url = await storage.upload_file(content, bucket, key, mime)

    asset = Asset(
        user_id=user.id,
        project_id=project_id,
        type=asset_type,
        name=file.filename or key,
        url=url,
        bucket=bucket,
        key=key,
        size=len(content),
        mime_type=mime,
    )
    db.add(asset)
    await db.flush()
    await db.refresh(asset)

    return {
        "id": asset.id,
        "name": asset.name,
        "url": asset.url,
        "type": asset.type.value,
        "size": asset.size,
        "created_at": asset.created_at.isoformat(),
    }


@router.get("/")
async def list_assets(
    type: Optional[str] = Query(None),
    project_id: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Asset).where(Asset.user_id == user.id)
    if type:
        q = q.where(Asset.type == type)
    if project_id:
        q = q.where(Asset.project_id == project_id)
    q = q.order_by(Asset.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(q)
    assets = result.scalars().all()
    return [
        {
            "id": a.id, "name": a.name, "url": a.url,
            "type": a.type.value, "size": a.size,
            "duration": a.duration, "mime_type": a.mime_type,
            "created_at": a.created_at.isoformat(),
        }
        for a in assets
    ]


@router.delete("/{asset_id}", status_code=204)
async def delete_asset(
    asset_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Asset).where(and_(Asset.id == asset_id, Asset.user_id == user.id))
    )
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    await storage.delete_file(asset.bucket, asset.key)
    await db.delete(asset)
    await db.flush()
