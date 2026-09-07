"""
Mock Voice Provider — simulates TTS/voice synthesis.
Returns a publicly accessible audio sample URL.
Swap with ElevenLabsProvider when API key is available.
"""
from ai.base import VoiceProvider, VoiceConfig

MOCK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

MOCK_VOICES = [
    {"id": "rachel", "name": "Rachel", "gender": "female", "accent": "american", "preview_url": MOCK_AUDIO_URL},
    {"id": "adam",   "name": "Adam",   "gender": "male",   "accent": "american", "preview_url": MOCK_AUDIO_URL},
    {"id": "bella",  "name": "Bella",  "gender": "female", "accent": "british",  "preview_url": MOCK_AUDIO_URL},
    {"id": "josh",   "name": "Josh",   "gender": "male",   "accent": "american", "preview_url": MOCK_AUDIO_URL},
]


class MockVoiceProvider(VoiceProvider):

    @property
    def name(self) -> str:
        return "mock"

    async def synthesize(self, text: str, config: VoiceConfig) -> str:
        """Returns a mock audio URL."""
        return MOCK_AUDIO_URL

    async def list_voices(self) -> list[dict]:
        return MOCK_VOICES
