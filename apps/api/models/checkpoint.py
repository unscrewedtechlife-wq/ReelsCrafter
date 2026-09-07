"""
Checkpoint model — persists every DAG node execution state to the database.

Each workflow_node row represents one pipeline stage at a specific granularity:
  - workflow-level  (whole job)
  - scene-level     (per scene)
  - shot-level      (per shot within a scene)
  - asset-level     (specific generated asset)

This allows the orchestrator to resume from the exact last successful
milestone instead of restarting the entire pipeline.
"""
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from sqlalchemy import (
    Column, String, Integer, Float, Text, Boolean,
    DateTime, Enum as SAEnum, ForeignKey, Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from core.database import Base


class CheckpointGranularity(str, Enum):
    """How fine-grained the checkpoint is."""
    WORKFLOW  = "workflow"   # Whole pipeline job
    SCENE     = "scene"      # Individual scene (Scene 1, 2, 3…)
    SHOT      = "shot"       # Shot within a scene
    ASSET     = "asset"      # Specific generated asset (image, audio, etc.)


class CheckpointStatus(str, Enum):
    PENDING             = "pending"
    RUNNING             = "running"
    COMPLETED           = "completed"
    FAILED              = "failed"
    AWAITING_APPROVAL   = "awaiting_approval"   # Human review gate
    SKIPPED             = "skipped"             # Skipped due to cache hit


class WorkflowCheckpoint(Base):
    """
    A single execution record for one pipeline node (stage, scene, or shot).

    Recovery algorithm:
      1. Load all checkpoints for workflow_id
      2. Find the last completed node
      3. Skip completed nodes → resume execution from next pending/failed node

    Retry algorithm:
      - Increment attempts on each retry
      - If attempts >= max_attempts, mark as permanently failed
    """
    __tablename__ = "workflow_checkpoints"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id    = Column(String(64), nullable=False, index=True)
    job_id         = Column(String(64), nullable=False, index=True)
    user_id        = Column(String(64), nullable=False)
    project_id     = Column(String(64), nullable=False)

    # Node identification
    node_id        = Column(String(128), nullable=False)   # e.g. "stage_07_scene_planner"
    node_name      = Column(String(255), nullable=False)   # Human-readable label
    granularity    = Column(
        SAEnum(CheckpointGranularity),
        nullable=False,
        default=CheckpointGranularity.WORKFLOW
    )

    # Scene / Shot metadata (null for workflow-level nodes)
    scene_index    = Column(Integer, nullable=True)   # 0-based scene index
    shot_index     = Column(Integer, nullable=True)   # 0-based shot index within scene

    # Execution state
    status         = Column(
        SAEnum(CheckpointStatus),
        nullable=False,
        default=CheckpointStatus.PENDING
    )
    progress       = Column(Integer, default=0)       # 0–100
    attempts       = Column(Integer, default=0)       # retry counter
    max_attempts   = Column(Integer, default=3)       # give up after this many

    # Timing
    started_at     = Column(DateTime(timezone=True), nullable=True)
    completed_at   = Column(DateTime(timezone=True), nullable=True)
    duration_ms    = Column(Integer, nullable=True)   # wall-clock ms

    # Outputs — stored as JSON so any artifact type can be saved
    output_path    = Column(Text, nullable=True)      # primary output (s3:// or local path)
    output_meta    = Column(JSONB, nullable=True)     # full metadata dict
    output_summary = Column(Text, nullable=True)      # one-line human summary

    # Input snapshot — what was passed into this node (for replay)
    input_hash     = Column(String(64), nullable=True)  # MD5 of input for cache dedup
    input_meta     = Column(JSONB, nullable=True)

    # Error info
    error_message  = Column(Text, nullable=True)
    error_traceback= Column(Text, nullable=True)

    # Human review gate
    requires_approval = Column(Boolean, default=False)
    approved_by    = Column(String(64), nullable=True)
    approved_at    = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at     = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at     = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        # Fast lookup: "give me all checkpoints for this workflow"
        Index("ix_checkpoint_workflow_node", "workflow_id", "node_id"),
        # Dedup: "was this exact input already processed?"
        Index("ix_checkpoint_input_hash", "workflow_id", "node_id", "input_hash"),
    )

    def __repr__(self) -> str:
        return (
            f"<WorkflowCheckpoint workflow={self.workflow_id} "
            f"node={self.node_id} status={self.status} attempts={self.attempts}>"
        )

    @property
    def is_recoverable(self) -> bool:
        """True if we can retry this node (haven't exceeded max_attempts)."""
        return self.status == CheckpointStatus.FAILED and self.attempts < self.max_attempts

    @property
    def is_cache_hit(self) -> bool:
        """True if this node was completed and its output is still valid."""
        return self.status == CheckpointStatus.COMPLETED and self.output_path is not None
