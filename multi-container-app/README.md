# ReelsCrafter Multi-Container Application Stack

A production-grade, highly decoupled multi-container infrastructure engineered for **ReelsCrafter (AI Video Studio)**.

## Architecture Overview

```text
                     ┌────────────────────────┐
                     │   Next.js 15 Web UI    │ (Port 3000)
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   FastAPI API Gateway  │ (Port 8000)
                     └─────┬────────────┬─────┘
                           │            │
            ┌──────────────┴────┐  ┌────┴──────────────┐
            │   PostgreSQL 16   │  │   Redis 7 Queue   │
            │    (Port 5432)    │  │    (Port 6379)    │
            └───────────────────┘  └─────────┬─────────┘
                                             │
      ┌──────────────────┬───────────────────┼──────────────────┬──────────────────┐
      ▼                  ▼                   ▼                  ▼                  ▼
┌───────────┐      ┌───────────┐       ┌───────────┐      ┌───────────┐      ┌───────────┐
│ARQ Worker │      │ImageWorker│       │VideoWorker│      │VoiceWorker│      │RenderWrkr │
└───────────┘      └───────────┘       └───────────┘      └───────────┘      └───────────┘
```

## Services Summary

| Service | Port | Image / Context | Purpose |
|---|---|---|---|
| `web` | 3000 | `apps/web` | Next.js 15 App Router Frontend, Canvas & Storyboard UI |
| `api` | 8000 | `apps/api` | FastAPI REST Gateway, 20-Stage DAG Orchestrator & WebSockets |
| `postgres` | 5432 | `postgres:16-alpine` | Relational storage for users, checkpoints, projects, and assets |
| `redis` | 6379 | `redis:7-alpine` | Distributed task queues (ARQ), pub/sub for real-time progress |
| `minio` | 9000/9001 | `minio/minio` | S3-compatible object store for videos, audio, images, storyboards |
| `minio_init` | - | `minio/mc` | Automated S3 bucket provisioner and public policy manager |
| `arq_worker` | - | `apps/api` | High-level job lifecycle orchestrator & credit ledger |
| `image_worker` | - | `workers` | FLUX.1 Schnell & SDXL Turbo ComfyUI image generator |
| `video_worker` | - | `workers` | LTX-Video, Wan 2.1, and SVD motion clip synthesizer |
| `voice_worker` | - | `workers` | Piper TTS neural speech synthesis & voice profile loader |
| `render_worker`| - | `workers` | FFmpeg hardware compositor with sidechain ducking (-18dB) |
| `storyboard_worker`| - | `workers`| Pre-visualization keyframe validator & QA scoring |
| `captions_worker`| - | `workers`| Word-level animated subtitle generator (Hormozi, TikTok styles) |

## Quickstart

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp ../.env.example .env
```

### 2. Launch Entire Multi-Container App
```bash
docker compose up -d
```

### 3. Verify Health & Logs
```bash
docker compose ps
docker compose logs -f api arq_worker
```

### 4. Access Services
- **Web Studio**: [http://localhost:3000](http://localhost:3000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **MinIO S3 Console**: [http://localhost:9001](http://localhost:9001) (`minioadmin` / `minioadmin_secret`)

