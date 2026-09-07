"""Creator clone planning worker for consistent avatar and voice jobs."""
import asyncio
import logging
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parents[1]))
from utility_worker import UtilityWorker, idle_loop, text_hash
logging.basicConfig(level=logging.INFO)

async def handle(payload):
    identity = str(payload.get("identity", "creator")).strip()
    reference_url = str(payload.get("reference_url", "")).strip()
    if not reference_url: raise ValueError("reference_url is required")
    return {"clone_id": await text_hash(identity + reference_url), "identity": identity, "reference_url": reference_url, "consistency_token": f"[VMAX_CLONE_{identity.upper().replace(' ', '_')}]", "status": "ready_for_generation"}

async def main(): await idle_loop(UtilityWorker("clone", handle))
if __name__ == "__main__": asyncio.run(main())
