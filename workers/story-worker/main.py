"""Story, ideation, template, and creator-clone planning worker."""
import asyncio
import logging
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parents[1]))
from utility_worker import UtilityWorker, idle_loop, text_hash
logging.basicConfig(level=logging.INFO)

async def handle(payload):
    prompt = str(payload.get("prompt", "")).strip()
    if not prompt: raise ValueError("prompt is required")
    mode = payload.get("mode", "story")
    return {"mode": mode, "project_id": await text_hash(prompt), "hook": f"{prompt}: the moment everything changes.", "scenes": [{"number": 1, "role": "hook"}, {"number": 2, "role": "problem"}, {"number": 3, "role": "solution"}, {"number": 4, "role": "cta"}], "status": "planned"}

async def main(): await idle_loop(UtilityWorker("story", handle))
if __name__ == "__main__": asyncio.run(main())
