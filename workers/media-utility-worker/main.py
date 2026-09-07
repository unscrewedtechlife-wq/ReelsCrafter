"""Downloader, editor, and voice transformation worker."""
import asyncio
import logging
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parents[1]))
from utility_worker import UtilityWorker, idle_loop, text_hash
logging.basicConfig(level=logging.INFO)

async def handle(payload):
    operation = payload.get("operation", "download")
    source_url = str(payload.get("source_url", "")).strip()
    if operation == "download":
        if not source_url.startswith(("http://", "https://")): raise ValueError("A valid source_url is required")
        return {"operation": operation, "source_url": source_url, "asset_id": await text_hash(source_url), "status": "queued"}
    if operation == "edit":
        return {"operation": operation, "source_url": source_url, "timeline": payload.get("timeline", []), "status": "queued_for_render"}
    if operation == "voice_change":
        return {"operation": operation, "source_url": source_url, "voice_profile": payload.get("voice_profile", "neutral"), "status": "queued_for_synthesis"}
    raise ValueError(f"Unsupported operation: {operation}")

async def main(): await idle_loop(UtilityWorker("media-utility", handle))
if __name__ == "__main__": asyncio.run(main())
