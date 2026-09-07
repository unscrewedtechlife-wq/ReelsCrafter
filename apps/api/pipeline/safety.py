"""
Safety and Moderation Layer (Stage 5).
Guards against NSFW, violence, copyright infringement, and brand compliance abuse.
"""
import re
from typing import List
from pipeline.types import SafetyCheckResult

PROHIBITED_KEYWORDS = [
    "nsfw", "porn", "nude", "nudity", "gore", "violence", "blood",
    "weapon", "terror", "hate", "suicide", "deepfake celebrity",
    "illegal drug", "unauthorized brand trademark leak"
]


class SafetyModeration:
    """
    Evaluates raw prompts and enhanced briefs to verify safety guidelines.
    """

    @classmethod
    async def evaluate(cls, text: str) -> SafetyCheckResult:
        lowered = text.lower()
        flagged: List[str] = []

        for kw in PROHIBITED_KEYWORDS:
            if re.search(r'\b' + re.escape(kw) + r'\b', lowered):
                flagged.append(kw)

        if flagged:
            return SafetyCheckResult(
                allowed=False,
                confidence=0.98,
                flags=flagged,
                reason=f"Prompt flagged for restricted content categories: {', '.join(flagged)}"
            )

        return SafetyCheckResult(
            allowed=True,
            confidence=0.99,
            flags=[],
            reason="Passed automated brand and content moderation filters."
        )
