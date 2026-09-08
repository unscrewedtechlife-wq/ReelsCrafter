# ─── ReelsCrafter Distributed Worker Fleet Dockerfile ──────────────────────────
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install system dependencies: FFmpeg for video rendering, curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install lightweight worker Python dependencies
RUN pip install --no-cache-dir \
    redis==5.0.8 \
    httpx==0.28.1 \
    aiohttp==3.10.9 \
    pydantic==2.9.2 \
    shortuuid==1.0.13

# Copy worker modules
COPY . /app

# Default command runs utility worker, can be overridden per service in compose
CMD ["python", "utility_worker.py"]

