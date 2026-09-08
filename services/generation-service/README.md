# Generation Service

Orchestrates AI generation tasks across the worker fleet.

## Responsibilities
- Dispatches generation jobs to specialized workers (image, video, voice, render)
- Manages prompt engineering and context injection
- Tracks token usage per provider (OpenAI, Replicate, ElevenLabs)
- Implements retry and fallback strategies

## Stack
- FastAPI + ARQ (async job queue)
- Redis (job pub/sub)
- S3/MinIO (artifact storage)
