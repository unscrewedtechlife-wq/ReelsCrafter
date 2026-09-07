"""Caption generation and caption removal worker."""
import asyncio
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))
from utility_worker import UtilityWorker, idle_loop, text_hash

logging.basicConfig(level=logging.INFO)

async def captions(payload):
    text = str(payload.get("text", "")).strip()
    words = text.split()
    return {"cue_count": len(words), "cues": [{"word": word, "start": round(i * 0.45, 2), "end": round((i + 1) * 0.45, 2)} for i, word in enumerate(words)], "input_hash": await text_hash(text)}

async def remove_captions(payload):
    source_url = str(payload.get("source_url", "")).strip()
    if not source_url: raise ValueError("source_url is required")
    return {"source_url": source_url, "status": "queued_for_inpainting", "operation_id": await text_hash(source_url)}

async def main():
    worker = UtilityWorker("captions", captions)
    await idle_loop(worker)

if __name__ == "__main__": asyncio.run(main())
