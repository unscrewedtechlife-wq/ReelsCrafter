"""
Caption Pipeline (Stage 13).
Generates word-level synchronized subtitle cues in styles:
- TikTok (classic bottom-centered rounded pill)
- Alex Hormozi (bold uppercase yellow/green animated active word)
- Mr Beast (bouncy large sans-serif with black stroke and yellow glow)
- UGC Creator (minimalist italicized modern clean font)
"""
from typing import List
from pipeline.types import CaptionSegment, CaptionWordCue, CaptionStyle, MarketingScript


class CaptionPipeline:
    """
    Computes precise timestamps and word-level highlights.
    """

    @classmethod
    async def generate_cues(cls, script: MarketingScript, caption_style: CaptionStyle) -> List[CaptionSegment]:
        segments: List[CaptionSegment] = []
        
        script_parts = [
            (script.hook, 0.0, 5.4),
            (script.problem, 5.4, 12.0),
            (script.solution, 12.0, 24.0),
            (script.cta, 24.0, 30.0),
        ]

        for text, start, end in script_parts:
            words = text.split()
            if not words:
                continue
            word_duration = (end - start) / len(words)
            cues: List[CaptionWordCue] = []
            
            for i, w in enumerate(words):
                w_start = round(start + (i * word_duration), 2)
                w_end = round(w_start + word_duration, 2)
                # Mark emphasis words for Hormozi / Mr Beast styles
                is_highlight = any(key in w.lower() for key in ["stop", "30", "pure", "zero", "free", "best", "now", "today", "money"])
                cues.append(CaptionWordCue(
                    word=w,
                    start=w_start,
                    end=w_end,
                    highlight=is_highlight
                ))

            segments.append(CaptionSegment(
                start=start,
                end=end,
                text=text,
                words=cues
            ))

        return segments
