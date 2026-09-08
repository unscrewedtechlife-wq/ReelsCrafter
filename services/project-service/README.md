# Project Service

Manages user projects, video assets, and metadata.

## Responsibilities
- CRUD for projects, videos, drafts
- Asset versioning and history
- Export format management (TikTok/Reels/Shorts spec enforcement)
- Storage quota tracking per user tier

## Stack
- FastAPI
- PostgreSQL (projects, videos, assets tables)
- S3/MinIO (video and asset storage)
