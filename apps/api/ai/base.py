from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum


class JobStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


@dataclass
class GenerationConfig:
    """Config for a video generation request."""
    aspect_ratio: str = "16:9"         # 16:9, 9:16, 1:1, 4:3
    duration: int = 5                   # seconds: 5, 10, 15, 30
    resolution: str = "1080p"
    fps: int = 24
    seed: Optional[int] = None
    extra: dict = field(default_factory=dict)


@dataclass
class ImageConfig:
    """Config for an image generation request."""
    width: int = 1024
    height: int = 1024
    num_images: int = 1
    style: Optional[str] = None
    seed: Optional[int] = None
    extra: dict = field(default_factory=dict)


@dataclass
class VoiceConfig:
    """Config for a voice synthesis request."""
    voice_id: str = "default"
    speed: float = 1.0
    stability: float = 0.75
    similarity_boost: float = 0.75


@dataclass
class GenerationJob:
    """A handle to a submitted generation job."""
    job_id: str
    provider_job_id: str                # external job ID from the AI provider
    status: JobStatus = JobStatus.queued
    output_url: Optional[str] = None
    progress: int = 0
    error: Optional[str] = None


# ─── Abstract Providers ───────────────────────────────────────────────────────

class VideoProvider(ABC):
    """Abstract interface for all video generation providers."""

    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    async def generate(self, prompt: str, config: GenerationConfig) -> GenerationJob:
        """Submit a video generation job. Returns immediately with a job handle."""
        ...

    @abstractmethod
    async def poll_status(self, provider_job_id: str) -> GenerationJob:
        """Check the status of a running job. Called in a polling loop."""
        ...


class ImageProvider(ABC):
    """Abstract interface for all image generation providers."""

    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    async def generate(self, prompt: str, config: ImageConfig) -> list[str]:
        """Generate image(s) and return a list of output URLs."""
        ...


class VoiceProvider(ABC):
    """Abstract interface for all voice synthesis providers."""

    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    async def synthesize(self, text: str, config: VoiceConfig) -> str:
        """Synthesize speech. Returns URL to audio file."""
        ...

    @abstractmethod
    async def list_voices(self) -> list[dict]:
        """Return available voices as list of {id, name, preview_url}."""
        ...
