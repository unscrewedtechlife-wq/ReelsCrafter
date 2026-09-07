"""
Script Generation AI Agent (Stage 6).
Generates high-converting marketing framework scripts:
- Hook (0-5s): Pattern interrupt to stop scrolling
- Problem (5-10s): Core frustration or friction
- Solution (10-20s): Immediate payoff, proof, and benefits
- CTA (20-30s): High-urgency action prompt
"""
from typing import Optional
from pipeline.types import MarketingScript, PipelineUserOptions


class ScriptGenerator:
    """
    Generates structured Hook/Problem/Solution/CTA scripts tailored to product & platform.
    """

    @classmethod
    async def generate(cls, raw_prompt: str, options: PipelineUserOptions) -> MarketingScript:
        # Attempt local Ollama generation if endpoint is accessible
        import json
        import httpx
        from core.config import settings

        if getattr(settings, "OLLAMA_URL", None):
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.post(
                        f"{settings.OLLAMA_URL}/api/generate",
                        json={
                            "model": getattr(settings, "OLLAMA_MODEL_SCRIPT", "qwen3"),
                            "prompt": (
                                f"Write a 4-part marketing script for '{raw_prompt}' for {options.platform.value}. "
                                "Return JSON with keys: hook, problem, solution, cta."
                            ),
                            "format": "json",
                            "stream": False
                        }
                    )
                    if resp.status_code == 200:
                        data = json.loads(resp.json().get("response", "{}"))
                        if all(k in data for k in ("hook", "problem", "solution", "cta")):
                            h, p, s, c = data["hook"], data["problem"], data["solution"], data["cta"]
                            full = f"{h} {p} {s} {c}"
                            w_count = len(full.split())
                            return MarketingScript(
                                hook=h,
                                problem=p,
                                solution=s,
                                cta=c,
                                full_text=full,
                                word_count=w_count,
                                estimated_duration_sec=round(w_count / 2.5, 1)
                            )
            except Exception:
                pass  # Fall back to curated template

        prompt_lower = raw_prompt.lower()

        if "protein" in prompt_lower or "fitness" in prompt_lower or "workout" in prompt_lower:
            hook = "Stop wasting money on chalky protein shakes that upset your stomach."
            problem = "Most shakes taste like cardboard and clump up no matter how hard you shake them."
            solution = "This ultra-filtered isolate delivers 30 grams of pure whey protein, digests smoothly, and tastes like melted chocolate gelato."
            cta = "Tap the link below to claim your starter bundle with 25% off today."
        elif "app" in prompt_lower or "saas" in prompt_lower or "software" in prompt_lower or "ai" in prompt_lower:
            hook = "This one AI tool replaced three full-time agencies in our marketing stack."
            problem = "Creating organic viral video content used to take hours of manual scripting and tedious editing."
            solution = "With automated scene planning and instant render pipelines, you turn one prompt into ten social-ready ads in seconds."
            cta = "Click learn more to test the AI pipeline free for your first 3 projects."
        else:
            hook = f"Everyone is talking about {raw_prompt.strip()} — here is what they aren't telling you."
            problem = "Finding something that actually delivers on its promises without wasting your time is nearly impossible."
            solution = f"That is why this breakthrough approach changes the game: fast results, unmatched quality, and zero fluff."
            cta = "Upgrade your experience now — hit the link to get started before stock runs out."

        full_text = f"{hook} {problem} {solution} {cta}"
        words = full_text.split()
        word_count = len(words)
        # Assuming average speaking rate of 2.5 words per second
        estimated_duration = round(word_count / 2.5, 1)

        return MarketingScript(
            hook=hook,
            problem=problem,
            solution=solution,
            cta=cta,
            full_text=full_text,
            word_count=word_count,
            estimated_duration_sec=estimated_duration
        )
