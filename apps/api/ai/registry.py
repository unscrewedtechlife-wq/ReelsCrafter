"""
Provider registry — resolves provider name → provider instance.
Add real providers here when API keys are available.
"""
from core.config import settings
from ai.base import VideoProvider, ImageProvider, VoiceProvider
from ai.video.mock_provider import MockVideoProvider
from ai.image.mock_provider import MockImageProvider
from ai.voice.mock_provider import MockVoiceProvider


# ─── Video ─────────────────────────────────────────────────────────────────────

def get_video_provider(name: str = "mock") -> VideoProvider:
    providers: dict[str, VideoProvider] = {
        "mock": MockVideoProvider(),
    }
    # Conditionally load real providers based on available API keys
    if settings.RUNWAY_API_KEY:
        try:
            from ai.video.runway_provider import RunwayVideoProvider
            providers["runway"] = RunwayVideoProvider()
        except ImportError:
            pass

    if settings.LUMA_API_KEY:
        try:
            from ai.video.luma_provider import LumaVideoProvider
            providers["luma"] = LumaVideoProvider()
        except ImportError:
            pass

    return providers.get(name, MockVideoProvider())


# ─── Image ─────────────────────────────────────────────────────────────────────

def get_image_provider(name: str = "mock") -> ImageProvider:
    providers: dict[str, ImageProvider] = {
        "mock": MockImageProvider(),
    }
    if settings.OPENAI_API_KEY:
        try:
            from ai.image.openai_provider import OpenAIImageProvider
            providers["gpt-image"] = OpenAIImageProvider()
        except ImportError:
            pass

    if settings.REPLICATE_API_KEY:
        try:
            from ai.image.flux_provider import FluxImageProvider
            providers["flux"] = FluxImageProvider()
        except ImportError:
            pass

    return providers.get(name, MockImageProvider())


# ─── Voice ─────────────────────────────────────────────────────────────────────

def get_voice_provider(name: str = "mock") -> VoiceProvider:
    providers: dict[str, VoiceProvider] = {
        "mock": MockVoiceProvider(),
    }
    if settings.ELEVENLABS_API_KEY:
        try:
            from ai.voice.elevenlabs_provider import ElevenLabsProvider
            providers["elevenlabs"] = ElevenLabsProvider()
        except ImportError:
            pass

    return providers.get(name, MockVoiceProvider())


# ─── Credit costs ──────────────────────────────────────────────────────────────

CREDIT_COSTS = {
    # Images
    "image_sd":    2,
    "image_hd":    4,
    # Videos by duration
    "video_5s":   20,
    "video_10s":  40,
    "video_15s":  60,
    "video_30s": 100,
    # Voice & avatar
    "voice":       5,
    "avatar":     15,
}

VIDEO_MODELS = [
    {"id": "mock",   "name": "Viewmax Demo",  "provider": "mock",   "available": True},
    {"id": "runway", "name": "Runway Gen-3",   "provider": "runway", "available": bool(settings.RUNWAY_API_KEY)},
    {"id": "luma",   "name": "Luma Dream Machine", "provider": "luma", "available": bool(settings.LUMA_API_KEY)},
    {"id": "kling",  "name": "Kling 1.6",      "provider": "kling",  "available": False},
    {"id": "pika",   "name": "Pika 2.0",        "provider": "pika",   "available": False},
]

IMAGE_MODELS = [
    {"id": "mock",      "name": "Viewmax Demo",  "provider": "mock",   "available": True},
    {"id": "gpt-image", "name": "GPT Image 1",   "provider": "openai", "available": bool(settings.OPENAI_API_KEY)},
    {"id": "flux",      "name": "FLUX Pro 1.1",  "provider": "replicate", "available": bool(settings.REPLICATE_API_KEY)},
    {"id": "ideogram",  "name": "Ideogram 2",    "provider": "ideogram", "available": False},
]
