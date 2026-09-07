"""
Mock Video Provider — simulates a real video generation pipeline.
Returns placeholder video URLs with realistic delay simulation.
Swap this out with RunwayProvider, LumaProvider, etc. when keys are available.
"""
import asyncio
import uuid
from ai.base import VideoProvider, GenerationConfig, GenerationJob, JobStatus

# Local sample videos served from the D: drive via the API.
LOCAL_SAMPLE_BASE = "http://localhost:8000/local-media/sample"
MOCK_VIDEOS = {
    "16:9": f"{LOCAL_SAMPLE_BASE}/BigBuckBunny.mp4",
    "9:16": f"{LOCAL_SAMPLE_BASE}/ElephantsDream.mp4",
    "1:1":  f"{LOCAL_SAMPLE_BASE}/ForBiggerBlazes.mp4",
    "4:3":  f"{LOCAL_SAMPLE_BASE}/ForBiggerEscapes.mp4",
}


class MockVideoProvider(VideoProvider):
    """
    Mock provider for development/testing.
    Simulates async video generation with fake progress updates.
    """

    @property
    def name(self) -> str:
        return "mock"

    async def generate(self, prompt: str, config: GenerationConfig) -> GenerationJob:
        """Immediately returns a job handle. Actual 'work' happens during poll_status."""
        job_id = str(uuid.uuid4())
        return GenerationJob(
            job_id=job_id,
            provider_job_id=f"mock_{job_id}",
            status=JobStatus.queued,
            progress=0,
        )

    async def poll_status(self, provider_job_id: str) -> GenerationJob:
        """
        Simulates polling — in the worker, we call this after a delay.
        Returns completed immediately for simplicity (worker handles delays).
        """
        video_url = MOCK_VIDEOS.get("16:9")
        return GenerationJob(
            job_id=provider_job_id.replace("mock_", ""),
            provider_job_id=provider_job_id,
            status=JobStatus.completed,
            output_url=video_url,
            progress=100,
        )
