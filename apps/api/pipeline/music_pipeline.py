"""
Background Music Pipeline (Stage 12).
Selects and aligns royalty-free / AI-generated soundtrack with automated audio ducking.
"""
from typing import Dict
from pipeline.types import MusicMood, PipelineUserOptions


class MusicPipeline:
    """
    Selects soundscapes matching genre, pacing, and mood.
    """

    MUSIC_LIBRARY: Dict[MusicMood, Dict[str, any]] = {
        MusicMood.ENERGETIC_EDM: {
            "title": "Neon Pulse High-Drive",
            "bpm": 128,
            "genre": "Commercial Future Bass",
            "url": "https://assets.viewmax.ai/audio/music/neon_pulse.mp3",
            "ducking_level_db": -18.0,
        },
        MusicMood.LO_FI: {
            "title": "Midnight Coffee Chillhop",
            "bpm": 84,
            "genre": "Lo-Fi Beats",
            "url": "https://assets.viewmax.ai/audio/music/lofi_chill.mp3",
            "ducking_level_db": -14.0,
        },
        MusicMood.UPBEAT_POP: {
            "title": "Summer Spark Groove",
            "bpm": 116,
            "genre": "Indie Pop Feelgood",
            "url": "https://assets.viewmax.ai/audio/music/summer_spark.mp3",
            "ducking_level_db": -16.0,
        },
        MusicMood.CORPORATE_CHIC: {
            "title": "Minimal Silicon Valley",
            "bpm": 105,
            "genre": "Modern Tech Ambient",
            "url": "https://assets.viewmax.ai/audio/music/silicon_ambient.mp3",
            "ducking_level_db": -20.0,
        },
        MusicMood.DRAMATIC_CINEMATIC: {
            "title": "Apex Horizon Trailer",
            "bpm": 90,
            "genre": "Orchestral Hybrid",
            "url": "https://assets.viewmax.ai/audio/music/apex_horizon.mp3",
            "ducking_level_db": -18.0,
        },
        MusicMood.PHONK_TRAP: {
            "title": "Tokyo Drift Driftwave",
            "bpm": 140,
            "genre": "Drift Phonk",
            "url": "https://assets.viewmax.ai/audio/music/tokyo_drift.mp3",
            "ducking_level_db": -19.0,
        },
    }

    @classmethod
    async def select_track(cls, options: PipelineUserOptions) -> Dict[str, any]:
        mood = options.music_mood or MusicMood.ENERGETIC_EDM
        track_data = cls.MUSIC_LIBRARY.get(mood, cls.MUSIC_LIBRARY[MusicMood.ENERGETIC_EDM])
        return track_data
