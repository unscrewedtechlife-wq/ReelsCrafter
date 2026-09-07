"""
Mock Image Provider — returns placeholder images for development.
Swap with FluxProvider, OpenAIImageProvider, etc. when keys are available.
"""
import uuid
from ai.base import ImageProvider, ImageConfig

# Use picsum.photos for realistic mock images
def _mock_image_url(width: int, height: int, seed: int) -> str:
    return f"https://picsum.photos/seed/{seed}/{width}/{height}"


class MockImageProvider(ImageProvider):

    @property
    def name(self) -> str:
        return "mock"

    async def generate(self, prompt: str, config: ImageConfig) -> list[str]:
        """Returns a list of placeholder image URLs."""
        urls = []
        for i in range(config.num_images):
            seed = (config.seed or hash(prompt + str(i))) % 10000
            urls.append(_mock_image_url(config.width, config.height, abs(seed)))
        return urls
