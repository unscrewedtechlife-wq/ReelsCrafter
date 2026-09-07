"""
Checkpoint Manager — Engine for saving, resuming, retrying, and approving DAG nodes.

Implements the Checkpointing Architecture:
  1. Node-level persistence (workflow, scene, shot granularity)
  2. Crash recovery: resume from the last successful milestone
  3. Retry logic: retry only failed nodes up to max_attempts
  4. Human review gate: pausing for approval (e.g. storyboard approval)
  5. Asset reuse & cache deduplication
"""
import hashlib
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Tuple
import uuid

from sqlalchemy import select, update, and_
from core.database import AsyncSessionLocal
from models.checkpoint import WorkflowCheckpoint, CheckpointStatus, CheckpointGranularity

logger = logging.getLogger("pipeline.checkpoint")

# In-memory fast cache and fallback when database is running standalone
_IN_MEMORY_CHECKPOINTS: Dict[str, Dict[str, dict]] = {}


class CheckpointManager:
    """
    Central service for DAG workflow checkpointing and state persistence.
    """

    @classmethod
    def _make_key(cls, node_id: str, scene_index: Optional[int] = None, shot_index: Optional[int] = None) -> str:
        key = node_id
        if scene_index is not None:
            key += f":scene_{scene_index}"
        if shot_index is not None:
            key += f":shot_{shot_index}"
        return key

    @classmethod
    def _compute_input_hash(cls, input_data: Any) -> Optional[str]:
        if not input_data:
            return None
        try:
            serialized = json.dumps(input_data, sort_keys=True, default=str)
            return hashlib.md5(serialized.encode("utf-8")).hexdigest()
        except Exception:
            return None

    @classmethod
    async def save_checkpoint(
        cls,
        workflow_id: str,
        job_id: str,
        user_id: str,
        project_id: str,
        node_id: str,
        node_name: str,
        status: CheckpointStatus,
        granularity: CheckpointGranularity = CheckpointGranularity.WORKFLOW,
        scene_index: Optional[int] = None,
        shot_index: Optional[int] = None,
        progress: int = 100,
        output_path: Optional[str] = None,
        output_meta: Optional[Dict[str, Any]] = None,
        output_summary: Optional[str] = None,
        input_meta: Optional[Dict[str, Any]] = None,
        error_message: Optional[str] = None,
        duration_ms: Optional[int] = None,
        requires_approval: bool = False,
    ) -> dict:
        """
        Saves or updates a checkpoint record in both the database and fast in-memory cache.
        """
        now = datetime.now(timezone.utc)
        sub_key = cls._make_key(node_id, scene_index, shot_index)
        input_hash = cls._compute_input_hash(input_meta)

        # In-memory update
        if workflow_id not in _IN_MEMORY_CHECKPOINTS:
            _IN_MEMORY_CHECKPOINTS[workflow_id] = {}

        existing_in_mem = _IN_MEMORY_CHECKPOINTS[workflow_id].get(sub_key, {})
        attempts = existing_in_mem.get("attempts", 0)
        if status == CheckpointStatus.RUNNING:
            attempts += 1

        record_data = {
            "id": existing_in_mem.get("id", str(uuid.uuid4())),
            "workflow_id": workflow_id,
            "job_id": job_id,
            "user_id": user_id,
            "project_id": project_id,
            "node_id": node_id,
            "node_name": node_name,
            "granularity": granularity.value if isinstance(granularity, CheckpointGranularity) else granularity,
            "scene_index": scene_index,
            "shot_index": shot_index,
            "status": status.value if isinstance(status, CheckpointStatus) else status,
            "progress": progress,
            "attempts": attempts,
            "max_attempts": 3,
            "started_at": existing_in_mem.get("started_at", now.isoformat()),
            "completed_at": now.isoformat() if status in (CheckpointStatus.COMPLETED, CheckpointStatus.FAILED) else None,
            "duration_ms": duration_ms or existing_in_mem.get("duration_ms"),
            "output_path": output_path or existing_in_mem.get("output_path"),
            "output_meta": output_meta or existing_in_mem.get("output_meta"),
            "output_summary": output_summary or existing_in_mem.get("output_summary"),
            "input_hash": input_hash,
            "input_meta": input_meta,
            "error_message": error_message,
            "requires_approval": requires_approval,
            "approved_by": existing_in_mem.get("approved_by"),
            "approved_at": existing_in_mem.get("approved_at"),
            "updated_at": now.isoformat(),
        }

        _IN_MEMORY_CHECKPOINTS[workflow_id][sub_key] = record_data

        # Database persistence
        try:
            async with AsyncSessionLocal() as session:
                # Check if record exists
                stmt = select(WorkflowCheckpoint).where(
                    and_(
                        WorkflowCheckpoint.workflow_id == workflow_id,
                        WorkflowCheckpoint.node_id == node_id,
                        WorkflowCheckpoint.scene_index == scene_index,
                        WorkflowCheckpoint.shot_index == shot_index,
                    )
                )
                res = await session.execute(stmt)
                db_record = res.scalar_one_or_none()

                if db_record:
                    db_record.status = status
                    db_record.progress = progress
                    db_record.attempts = attempts
                    db_record.output_path = output_path or db_record.output_path
                    db_record.output_meta = output_meta or db_record.output_meta
                    db_record.output_summary = output_summary or db_record.output_summary
                    db_record.error_message = error_message
                    db_record.updated_at = now
                    if status in (CheckpointStatus.COMPLETED, CheckpointStatus.FAILED):
                        db_record.completed_at = now
                    if duration_ms:
                        db_record.duration_ms = duration_ms
                else:
                    db_record = WorkflowCheckpoint(
                        workflow_id=workflow_id,
                        job_id=job_id,
                        user_id=user_id,
                        project_id=project_id,
                        node_id=node_id,
                        node_name=node_name,
                        granularity=granularity,
                        scene_index=scene_index,
                        shot_index=shot_index,
                        status=status,
                        progress=progress,
                        attempts=attempts,
                        started_at=now,
                        completed_at=now if status == CheckpointStatus.COMPLETED else None,
                        duration_ms=duration_ms,
                        output_path=output_path,
                        output_meta=output_meta,
                        output_summary=output_summary,
                        input_hash=input_hash,
                        input_meta=input_meta,
                        error_message=error_message,
                        requires_approval=requires_approval,
                    )
                    session.add(db_record)
                await session.commit()
                record_data["id"] = str(db_record.id)
        except Exception as e:
            logger.warning(f"Database checkpoint save skipped (using in-memory): {e}")

        return record_data

    @classmethod
    async def get_checkpoints(cls, workflow_id: str) -> List[dict]:
        """
        Retrieves all checkpoint records for a given workflow.
        """
        try:
            async with AsyncSessionLocal() as session:
                stmt = (
                    select(WorkflowCheckpoint)
                    .where(WorkflowCheckpoint.workflow_id == workflow_id)
                    .order_by(WorkflowCheckpoint.created_at.asc())
                )
                res = await session.execute(stmt)
                records = res.scalars().all()
                if records:
                    return [
                        {
                            "id": str(r.id),
                            "workflow_id": r.workflow_id,
                            "job_id": r.job_id,
                            "node_id": r.node_id,
                            "node_name": r.node_name,
                            "granularity": r.granularity.value if hasattr(r.granularity, "value") else str(r.granularity),
                            "scene_index": r.scene_index,
                            "shot_index": r.shot_index,
                            "status": r.status.value if hasattr(r.status, "value") else str(r.status),
                            "progress": r.progress,
                            "attempts": r.attempts,
                            "output_path": r.output_path,
                            "output_meta": r.output_meta,
                            "output_summary": r.output_summary,
                            "error_message": r.error_message,
                            "requires_approval": r.requires_approval,
                            "completed_at": r.completed_at.isoformat() if r.completed_at else None,
                        }
                        for r in records
                    ]
        except Exception:
            pass

        # Fallback to in-memory store
        return list(_IN_MEMORY_CHECKPOINTS.get(workflow_id, {}).values())

    @classmethod
    async def has_completed(
        cls,
        workflow_id: str,
        node_id: str,
        scene_index: Optional[int] = None,
        shot_index: Optional[int] = None
    ) -> Tuple[bool, Optional[dict]]:
        """
        Checks if a node has successfully completed with valid output.
        Returns (is_completed, checkpoint_dict).
        """
        sub_key = cls._make_key(node_id, scene_index, shot_index)
        in_mem = _IN_MEMORY_CHECKPOINTS.get(workflow_id, {}).get(sub_key)
        if in_mem and in_mem.get("status") == CheckpointStatus.COMPLETED.value:
            return True, in_mem

        try:
            async with AsyncSessionLocal() as session:
                stmt = select(WorkflowCheckpoint).where(
                    and_(
                        WorkflowCheckpoint.workflow_id == workflow_id,
                        WorkflowCheckpoint.node_id == node_id,
                        WorkflowCheckpoint.scene_index == scene_index,
                        WorkflowCheckpoint.shot_index == shot_index,
                        WorkflowCheckpoint.status == CheckpointStatus.COMPLETED,
                    )
                )
                res = await session.execute(stmt)
                rec = res.scalar_one_or_none()
                if rec:
                    return True, {
                        "id": str(rec.id),
                        "node_id": rec.node_id,
                        "status": rec.status.value,
                        "output_path": rec.output_path,
                        "output_meta": rec.output_meta,
                        "output_summary": rec.output_summary,
                    }
        except Exception:
            pass

        return False, None

    @classmethod
    async def find_resume_target(cls, workflow_id: str, ordered_node_ids: List[str]) -> Tuple[Optional[str], Dict[str, dict]]:
        """
        Inspects checkpoints to find the first node that needs execution:
        - Skipped: completed nodes
        - Target: first failed or pending node
        Returns (resume_node_id, dict_of_completed_outputs).
        """
        checkpoints = await cls.get_checkpoints(workflow_id)
        status_map = {c["node_id"]: c for c in checkpoints}
        completed_artifacts: Dict[str, dict] = {}

        for node_id in ordered_node_ids:
            cp = status_map.get(node_id)
            if cp and cp["status"] == CheckpointStatus.COMPLETED.value:
                completed_artifacts[node_id] = {
                    "output_path": cp.get("output_path"),
                    "output_meta": cp.get("output_meta"),
                    "output_summary": cp.get("output_summary"),
                }
            else:
                # First non-completed node is our target!
                return node_id, completed_artifacts

        return None, completed_artifacts

    @classmethod
    async def approve_checkpoint(cls, workflow_id: str, node_id: str, approved_by: str = "creator") -> bool:
        """
        Approves a human-review gate checkpoint (e.g. storyboard review), allowing pipeline to resume.
        """
        now = datetime.now(timezone.utc)
        sub_key = cls._make_key(node_id)
        if workflow_id in _IN_MEMORY_CHECKPOINTS and sub_key in _IN_MEMORY_CHECKPOINTS[workflow_id]:
            _IN_MEMORY_CHECKPOINTS[workflow_id][sub_key]["status"] = CheckpointStatus.COMPLETED.value
            _IN_MEMORY_CHECKPOINTS[workflow_id][sub_key]["approved_by"] = approved_by
            _IN_MEMORY_CHECKPOINTS[workflow_id][sub_key]["approved_at"] = now.isoformat()

        try:
            async with AsyncSessionLocal() as session:
                stmt = (
                    update(WorkflowCheckpoint)
                    .where(
                        and_(
                            WorkflowCheckpoint.workflow_id == workflow_id,
                            WorkflowCheckpoint.node_id == node_id,
                        )
                    )
                    .values(
                        status=CheckpointStatus.COMPLETED,
                        approved_by=approved_by,
                        approved_at=now,
                        updated_at=now,
                    )
                )
                await session.execute(stmt)
                await session.commit()
                return True
        except Exception:
            return True
