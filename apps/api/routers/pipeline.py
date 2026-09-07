"""
FastAPI Router for the 20-Step AI Video Orchestration Pipeline.
"""
import asyncio
from typing import List, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel

from pipeline.types import (
    PipelineUserOptions,
    PipelineJobState,
    AspectRatio,
    VideoPlatform,
    VideoStyle,
    CaptionStyle,
    MusicMood,
)
from pipeline.orchestrator import PipelineOrchestrator
from pipeline.checkpoint_manager import CheckpointManager
from pipeline.enhancer import PromptEnhancer
from pipeline.safety import SafetyModeration
from pipeline.scriptwriter import ScriptGenerator
from pipeline.scene_planner import ScenePlanner

router = APIRouter(prefix="/pipeline", tags=["AI Video Pipeline"])


class PipelineGenerateRequest(BaseModel):
    prompt: str
    options: Optional[PipelineUserOptions] = None


class EnhancePromptRequest(BaseModel):
    prompt: str
    options: Optional[PipelineUserOptions] = None


class ModerateRequest(BaseModel):
    text: str


@router.post("/generate", response_model=PipelineJobState)
async def generate_pipeline_video(payload: PipelineGenerateRequest, background_tasks: BackgroundTasks):
    """
    Submits a user prompt into the 20-stage DAG AI Video Pipeline.
    Runs asynchronously and updates DAG status, artifacts, and WebSocket notifications.
    """
    options = payload.options or PipelineUserOptions()
    
    # Run the full pipeline
    job_state = await PipelineOrchestrator.run_pipeline(
        raw_prompt=payload.prompt,
        options=options,
        user_id="usr_viewmax_demo"
    )
    return job_state


@router.get("/jobs/{job_id}", response_model=PipelineJobState)
async def get_pipeline_job(job_id: str):
    """
    Retrieves real-time DAG execution state, intermediate artifacts, and final video render.
    """
    job = PipelineOrchestrator.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Pipeline job not found")
    return job


@router.get("/jobs", response_model=List[PipelineJobState])
async def list_pipeline_jobs():
    """
    Lists recent video generation pipeline jobs.
    """
    return PipelineOrchestrator.list_jobs(limit=15)


@router.post("/enhance")
async def enhance_prompt_preview(payload: EnhancePromptRequest):
    """
    Standalone Prompt Engineer AI expansion.
    """
    options = payload.options or PipelineUserOptions()
    enhanced = await PromptEnhancer.enhance(payload.prompt, options)
    return {"original": payload.prompt, "enhanced": enhanced}


@router.post("/moderate")
async def check_moderation(payload: ModerateRequest):
    """
    Standalone safety and moderation check.
    """
    result = await SafetyModeration.evaluate(payload.text)
    return result


@router.post("/script")
async def generate_script_preview(payload: PipelineGenerateRequest):
    """
    Standalone script generator producing Hook, Problem, Solution, and CTA.
    """
    options = payload.options or PipelineUserOptions()
    script = await ScriptGenerator.generate(payload.prompt, options)
    return script


@router.post("/scene-plan")
async def generate_scene_plan(payload: PipelineGenerateRequest):
    """
    Storyboard scene planner returning structured scene items.
    """
    options = payload.options or PipelineUserOptions()
    script = await ScriptGenerator.generate(payload.prompt, options)
    enhanced = await PromptEnhancer.enhance(payload.prompt, options)
    scenes = await ScenePlanner.plan(script, enhanced, options)
    return {"script": script, "scenes": scenes}


@router.post("/scene-planner")
async def generate_full_scene_director_plan(payload: PipelineGenerateRequest):
    """
    The Full AI Director & Shot Planner Engine (12-Step Architecture):
    Story beats, narrative classification, cinematic rules, character sheet,
    location sheet, shot-by-shot decomposition, camera specs, and generation prompts.
    """
    options = payload.options or PipelineUserOptions()
    script = await ScriptGenerator.generate(payload.prompt, options)
    enhanced = await PromptEnhancer.enhance(payload.prompt, options)
    full_plan = await ScenePlanner.plan_comprehensive(enhanced, script, options)
    return full_plan


@router.get("/jobs/{job_id}/checkpoints")
async def get_job_checkpoints(job_id: str):
    """
    Returns all saved checkpoints for this workflow, including granular
    scene-level and shot-level execution states.
    """
    job = PipelineOrchestrator.get_job(job_id)
    wf_id = job.workflow_id if job else f"wf_{job_id}"
    checkpoints = await CheckpointManager.get_checkpoints(wf_id)
    return {
        "job_id": job_id,
        "workflow_id": wf_id,
        "checkpoints": checkpoints,
        "checkpoint_count": len(checkpoints)
    }


@router.post("/jobs/{job_id}/resume", response_model=PipelineJobState)
async def resume_job_from_checkpoint(job_id: str):
    """
    Resumes a failed or interrupted DAG job directly from its last successful checkpoint milestone.
    """
    job = PipelineOrchestrator.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Pipeline job not found")

    resumed_state = await PipelineOrchestrator.resume_pipeline(job_id)
    return resumed_state


@router.post("/checkpoints/{workflow_id}/{node_id}/approve")
async def approve_checkpoint_gate(workflow_id: str, node_id: str, approved_by: str = "creator"):
    """
    Approves a human-review gate checkpoint (e.g. storyboard review), allowing
    the pipeline to proceed to video generation.
    """
    ok = await CheckpointManager.approve_checkpoint(workflow_id, node_id, approved_by)
    return {
        "workflow_id": workflow_id,
        "node_id": node_id,
        "approved": ok,
        "approved_by": approved_by
    }


