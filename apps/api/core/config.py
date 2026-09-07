# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "change_me_in_production_at_least_32_chars_long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    FRONTEND_URL: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://viewmax:viewmax_secret@localhost:5432/viewmax"

    # Redis
    REDIS_URL: str = "redis://:redis_secret@localhost:6379/0"
    REDIS_PASSWORD: Optional[str] = "redis_secret"

    # Storage (S3 / MinIO)
    S3_ENDPOINT_URL: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin_secret"
    S3_REGION: str = "us-east-1"
    S3_BUCKET_UPLOADS: str = "uploads"
    S3_BUCKET_IMAGES: str = "generated-images"
    S3_BUCKET_VIDEOS: str = "generated-videos"
    S3_BUCKET_AUDIO: str = "audio"
    S3_BUCKET_EXPORTS: str = "exports"

    # Stripe
    STRIPE_SECRET_KEY: str = "sk_test_placeholder"
    STRIPE_WEBHOOK_SECRET: str = "whsec_placeholder"
    STRIPE_PRICE_CREATOR: str = "price_creator_monthly"
    STRIPE_PRICE_PRO: str = "price_pro_monthly"
    STRIPE_PRICE_AGENCY: str = "price_agency_monthly"

    # AI Providers & Self-Hosted Engines
    OPENAI_API_KEY: Optional[str] = None
    RUNWAY_API_KEY: Optional[str] = None
    LUMA_API_KEY: Optional[str] = None
    ELEVENLABS_API_KEY: Optional[str] = None
    REPLICATE_API_KEY: Optional[str] = None

    # Self-Hosted Endpoints
    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_MODEL_DIRECTOR: str = "llama3"
    OLLAMA_MODEL_SCRIPT: str = "qwen3"
    OLLAMA_MODEL_REASONING: str = "deepseek-r1"
    COMFYUI_URL: str = "http://localhost:8188"
    PIPER_TTS_URL: str = "http://localhost:5000"

    # Hardware & Performance Acceleration
    USE_NVENC: bool = True
    FFMPEG_PRESET: str = "fast"
    STORYBOARD_RESOLUTION: int = 512
    DRAFT_RESOLUTION_P: int = 480
    FINAL_RESOLUTION_P: int = 1080

    # Plans
    FREE_CREDITS: int = 10
    CREATOR_CREDITS: int = 1000
    PRO_CREDITS: int = 4000
    AGENCY_CREDITS: int = 20000

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
