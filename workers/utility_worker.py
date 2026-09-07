"""Shared queue-ready utility worker implementations for Viewmax."""
from __future__ import annotations

import asyncio
import hashlib
import logging
from dataclasses import dataclass
from typing import Any, Awaitable, Callable

logger = logging.getLogger("ViewmaxUtilityWorker")

@dataclass
class UtilityResult:
    status: str
    worker: str
    output: dict[str, Any]

class UtilityWorker:
    def __init__(self, name: str, handler: Callable[[dict[str, Any]], Awaitable[dict[str, Any]]]):
        self.name = name
        self.handler = handler

    async def process(self, payload: dict[str, Any]) -> UtilityResult:
        if not isinstance(payload, dict):
            raise ValueError("Worker payload must be an object")
        output = await self.handler(payload)
        return UtilityResult(status="completed", worker=self.name, output=output)

    async def run_once(self, payload: dict[str, Any]) -> dict[str, Any]:
        result = await self.process(payload)
        return {"status": result.status, "worker": result.worker, **result.output}

async def text_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]

async def idle_loop(worker: UtilityWorker) -> None:
    logger.info("%s worker ready for queue jobs", worker.name)
    while True:
        await asyncio.sleep(5)
