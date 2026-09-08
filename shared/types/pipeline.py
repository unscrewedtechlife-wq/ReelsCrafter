"""
shared/types/pipeline.py
Shared type definitions used across services and workers.
"""
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel


class AspectRatio(str, Enum):
    RATIO_9_16 = "9:16"   # TikTok / Reels / Shorts
    RATIO_16_9 = "16:9"   # YouTube landscape
    RATIO_1_1 = "1:1"     # Instagram square
    RATIO_4_5 = "4:5"     # Instagram portrait


class VideoQuality(str, Enum):
    DRAFT = "draft"
    STANDARD = "standard"
    HIGH = "high"
    ULTRA = "ultra"


class WorkerStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    FAILED = "failed"
    COMPLETED = "completed"


class PipelineStageResult(BaseModel):
    stage_id: int
    stage_name: str
    status: WorkerStatus
    duration_ms: Optional[int] = None
    output_keys: List[str] = []
    error: Optional[str] = None
