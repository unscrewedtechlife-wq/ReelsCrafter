"""
WebSocket endpoint for real-time job progress updates.
Clients connect to /ws/{user_id} and receive job events as they happen.
The worker publishes events to Redis pub/sub, this endpoint forwards them to the browser.
"""
import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import redis.asyncio as aioredis
from core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    logger.info(f"WebSocket connected: user={user_id}")

    # Subscribe to the user's Redis pub/sub channel
    redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    pubsub = redis.pubsub()
    channel = f"ws:user:{user_id}"
    await pubsub.subscribe(channel)

    try:
        # Send initial handshake
        await websocket.send_json({"type": "connected", "userId": user_id})

        # Forward messages from Redis to the WebSocket client
        async for message in pubsub.listen():
            if message["type"] == "message":
                try:
                    data = json.loads(message["data"])
                    await websocket.send_json(data)
                except Exception as e:
                    logger.warning(f"WS send error: {e}")
                    break

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: user={user_id}")
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.close()
        await redis.close()
