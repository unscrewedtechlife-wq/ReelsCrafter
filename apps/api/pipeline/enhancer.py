"""
Prompt Enhancement Agent (Stage 4).
Expands brief, simple user prompts into high-converting, cinematic visual instructions.
"""
from typing import Dict, Any
from pipeline.types import PipelineUserOptions, AspectRatio, VideoStyle


class PromptEnhancer:
    """
    Simulates / integrates with GPT-4o / Claude 3.5 / Gemini 1.5 Pro to expand
    raw prompts into rich creative production briefs.
    """

    @classmethod
    async def enhance(cls, raw_prompt: str, options: PipelineUserOptions) -> str:
        prompt_clean = raw_prompt.strip().rstrip(".")
        style_mood_map = {
            VideoStyle.UGC: "Authentic UGC handheld smartphone aesthetic, natural ring-light studio lighting, relatable creator presence",
            VideoStyle.CINEMATIC: "Arri Alexa 35mm look, shallow depth of field, anamorphic flare, volumetric lighting, rich color grade",
            VideoStyle.VIRAL_HOOK: "High-energy fast-cut pacing, dynamic camera zooms, punchy visual contrast, immediate pattern interrupt",
            VideoStyle.MINIMALIST: "Clean Scandinavian aesthetic, muted pastel and neutral tones, smooth gliding gimbal pan, premium whitespace",
            VideoStyle.DYNAMIC_COMMERCIAL: "High-gloss Super Bowl commercial standard, bold product tracking shots, crisp 4K macro detail",
        }

        aspect_notes = "Vertical 9:16 optimized for mobile feeds (TikTok/Reels/Shorts)" if options.aspect_ratio == AspectRatio.RATIO_9_16 else f"Aspect ratio {options.aspect_ratio.value}"
        mood_desc = style_mood_map.get(options.style, "High-impact visual quality")

        # Attempt local Ollama generation if endpoint is accessible
        import httpx
        from core.config import settings

        if getattr(settings, "OLLAMA_URL", None):
            try:
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.post(
                        f"{settings.OLLAMA_URL}/api/generate",
                        json={
                            "model": getattr(settings, "OLLAMA_MODEL_SCRIPT", "llama3"),
                            "prompt": f"Expand this into a cinematic video ad visual brief: '{prompt_clean}' style: {mood_desc}",
                            "stream": False
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        if data.get("response"):
                            return data["response"].strip()
            except Exception:
                pass  # Fall back to template generation

        enhanced = (
            f"Create a high-converting {options.platform.value.replace('_', ' ').title()} advertisement featuring: "
            f"{prompt_clean}.\n\n"
            f"Visual Direction:\n"
            f"- Pacing: Engaging {options.duration}-second dynamic flow\n"
            f"- Aesthetic: {mood_desc}\n"
            f"- Target Framing: {aspect_notes}\n"
            f"- Camera & Lighting: Crisp volumetric rim lighting, smooth optical motion, tack-sharp focal depth\n"
            f"- Key Visual Beats: High-impact opening hook, immediate problem demonstration, tactile product showcase, unmistakable call-to-action."
        )
        return enhanced
