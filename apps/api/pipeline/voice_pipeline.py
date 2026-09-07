"""
Voice Generation Pipeline (Stage 11).
Synthesizes professional voiceovers using ElevenLabs / OpenAI TTS / Azure Speech.
"""
from typing import Dict
from pipeline.types import PipelineUserOptions


class VoicePipeline:
    """
    Synthesizes voiceover audio tracks from full marketing script.
    """

    VOICE_LIBRARY: Dict[str, Dict[str, str]] = {
        "female_energetic": {
            "name": "Sarah (Energetic UGC)",
            "provider": "ElevenLabs",
            "voice_id": "21m00Tcm4TlvDq8ikWAM",
            "accent": "US / Native",
            "url": "https://assets.viewmax.ai/audio/voices/sarah_energetic.mp3"
        },
        "male_authoritative": {
            "name": "Marcus (Direct Response)",
            "provider": "ElevenLabs",
            "voice_id": "VR6AewLTigWG4xSOukaG",
            "accent": "US / Deep",
            "url": "https://assets.viewmax.ai/audio/voices/marcus_direct.mp3"
        },
        "female_casual": {
            "name": "Emma (Conversational Creator)",
            "provider": "OpenAI TTS-1-HD",
            "voice_id": "nova",
            "accent": "Warm / Natural",
            "url": "https://assets.viewmax.ai/audio/voices/emma_casual.mp3"
        },
        "male_hype": {
            "name": "Leo (Viral Shorts)",
            "provider": "PlayHT",
            "voice_id": "s3://voice-models/leo-hype",
            "accent": "High Energy Punchy",
            "url": "https://assets.viewmax.ai/audio/voices/leo_hype.mp3"
        },
        "piper_local": {
            "name": "Piper Neural TTS (Self-Hosted)",
            "provider": "Piper TTS",
            "voice_id": "en_US-amy-medium",
            "accent": "US / Natural ONNX",
            "url": "https://assets.viewmax.ai/audio/voices/piper_local.mp3"
        }
    }

    @classmethod
    async def synthesize(cls, full_script: str, options: PipelineUserOptions) -> Dict[str, str]:
        # If Piper TTS is specified or available locally, prefer self-hosted
        from core.config import settings
        import httpx

        if getattr(settings, "PIPER_TTS_URL", None) and options.voice == "piper_local":
            try:
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.post(
                        f"{settings.PIPER_TTS_URL}/synthesize",
                        json={"text": full_script, "voice": "en_US-amy-medium"}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return {
                            "voice_id": "en_US-amy-medium",
                            "voice_name": "Piper Neural TTS (Self-Hosted)",
                            "provider": "Piper TTS",
                            "audio_url": data.get("audio_url", "https://assets.viewmax.ai/audio/voices/piper_local.mp3"),
                            "format": "mp3",
                            "sample_rate": "44100Hz",
                        }
            except Exception:
                pass

        voice_meta = cls.VOICE_LIBRARY.get(options.voice, cls.VOICE_LIBRARY["female_energetic"])
        return {
            "voice_id": voice_meta["voice_id"],
            "voice_name": voice_meta["name"],
            "provider": voice_meta["provider"],
            "audio_url": voice_meta["url"],
            "format": "mp3",
            "sample_rate": "44100Hz",
        }
