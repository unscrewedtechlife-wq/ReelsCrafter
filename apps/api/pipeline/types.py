"""
Pydantic types and data contracts for the 20-step AI Video Orchestration Pipeline & Advanced Scene Planner.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Any, List, Optional, Dict
from pydantic import BaseModel, Field


class AspectRatio(str, Enum):
    RATIO_9_16 = "9:16"   # TikTok, Reels, Shorts
    RATIO_16_9 = "16:9"   # YouTube, Web
    RATIO_1_1 = "1:1"     # Instagram Feed, LinkedIn
    RATIO_4_5 = "4:5"     # Mobile Social Feed


class VideoPlatform(str, Enum):
    TIKTOK = "tiktok"
    INSTAGRAM_REELS = "instagram_reels"
    YOUTUBE_SHORTS = "youtube_shorts"
    LINKEDIN = "linkedin"
    FACEBOOK_ADS = "facebook_ads"


class VideoStyle(str, Enum):
    UGC = "ugc"
    CINEMATIC = "cinematic"
    VIRAL_HOOK = "viral_hook"
    MINIMALIST = "minimalist"
    DYNAMIC_COMMERCIAL = "dynamic_commercial"


class CaptionStyle(str, Enum):
    TIKTOK = "tiktok"
    HORMOZI = "hormozi"
    MRBEAST = "mrbeast"
    UGC_CREATOR = "ugc_creator"


class MusicMood(str, Enum):
    ENERGETIC_EDM = "energetic_edm"
    LO_FI = "lo_fi"
    UPBEAT_POP = "upbeat_pop"
    CORPORATE_CHIC = "corporate_chic"
    DRAMATIC_CINEMATIC = "dramatic_cinematic"
    PHONK_TRAP = "phonk_trap"


class NodeStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class NarrativeRole(str, Enum):
    HOOK = "HOOK"               # Dramatic action, pattern interrupt
    PROBLEM = "PROBLEM"         # Frustration, agitation, pain point
    REVEAL = "REVEAL"           # Product introduction, sleek hero visual
    VALUE = "VALUE"             # Benefits breakdown, demonstration in use
    TRUST = "TRUST"             # Social proof, athlete/customer validation
    CONVERSION = "CONVERSION"   # Direct action, branding CTA screen


class PipelineUserOptions(BaseModel):
    aspect_ratio: AspectRatio = AspectRatio.RATIO_9_16
    duration: int = Field(default=30, ge=5, le=120)
    style: VideoStyle = VideoStyle.UGC
    voice: str = "female_energetic"
    platform: VideoPlatform = VideoPlatform.TIKTOK
    music_mood: Optional[MusicMood] = MusicMood.ENERGETIC_EDM
    caption_style: CaptionStyle = CaptionStyle.HORMOZI
    avatar_enabled: bool = False
    product_url: Optional[str] = None
    target_audience: Optional[str] = "Health & Fitness enthusiasts"


class DAGNode(BaseModel):
    id: str
    name: str
    description: str
    status: NodeStatus = NodeStatus.PENDING
    progress: int = 0
    duration_ms: Optional[int] = None
    input_summary: Optional[str] = None
    output_summary: Optional[str] = None
    artifacts: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None


class SafetyCheckResult(BaseModel):
    allowed: bool = True
    confidence: float = 0.99
    flags: List[str] = Field(default_factory=list)
    reason: Optional[str] = None


class MarketingScript(BaseModel):
    hook: str
    problem: str
    solution: str
    cta: str
    full_text: str
    word_count: int
    estimated_duration_sec: float


# ─── Advanced Scene Planner & AI Director Models ──────────────────────────────

class StoryBeat(BaseModel):
    id: int
    type: str                  # problem, product_intro, benefits, social_proof, cta
    narrative_role: NarrativeRole # HOOK, REVEAL, VALUE, TRUST, CONVERSION
    text: str


class CharacterSheet(BaseModel):
    character_id: str
    name: str
    gender: str
    hair: str
    age: str
    clothing: str
    facial_features: Optional[str] = None
    consistency_token: str


class LocationSheet(BaseModel):
    location_id: str
    name: str
    environment: str
    lighting: str
    color_palette: str
    atmosphere: str


class CameraDirection(BaseModel):
    camera_type: str           # Handheld, Dolly, Orbit, Drone, POV, Tracking
    movement: str              # Slow push-in, fast punch-in, orbital sweep
    lens: str                  # 24mm wide, 35mm documentary, 50mm portrait, 85mm macro
    angle: str                 # Eye-level, low angle hero, top-down


class ShotPlanItem(BaseModel):
    shot_number: int
    shot_type: str             # wide, medium, closeup, macro, over_the_shoulder
    duration: float            # seconds
    visual_action: str
    camera: CameraDirection


class MotionIntensity(BaseModel):
    level: str                 # high motion, medium motion, low motion
    intensity_score: int       # 0-100
    pacing_rationale: str


class ScenePlanItem(BaseModel):
    scene_number: int
    title: str
    narrative_role: NarrativeRole = NarrativeRole.HOOK
    start_time: float
    end_time: float
    duration: float
    script_segment: str
    visual_strategy: List[str] = Field(default_factory=list)
    shots: List[ShotPlanItem] = Field(default_factory=list)
    camera: Optional[CameraDirection] = None
    character_ref: Optional[str] = None
    location_ref: Optional[str] = None
    motion_intensity: Optional[MotionIntensity] = None
    visual_prompt: str         # Transformed production prompt (photorealistic language)
    camera_movement: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    status: NodeStatus = NodeStatus.PENDING


class FullScenePlan(BaseModel):
    title: str
    total_duration: float
    character_sheet: CharacterSheet
    location_sheet: LocationSheet
    story_beats: List[StoryBeat]
    scenes: List[ScenePlanItem]
    asset_dag: Dict[str, Any] = Field(default_factory=dict)


# ─── Captions & Quality ────────────────────────────────────────────────────────

class CaptionWordCue(BaseModel):
    word: str
    start: float
    end: float
    highlight: bool = False


class CaptionSegment(BaseModel):
    start: float
    end: float
    text: str
    words: List[CaptionWordCue] = Field(default_factory=list)


class QualityReport(BaseModel):
    overall_score: int  # 0-100
    video_quality: int  # 0-100
    caption_timing: int # 0-100
    audio_levels: int   # 0-100
    face_consistency: int # 0-100
    brand_compliance: int # 0-100
    passed: bool = True
    feedback: str


class PipelineJobState(BaseModel):
    project_id: str
    job_id: str
    workflow_id: Optional[str] = None
    user_id: str
    raw_prompt: str
    options: PipelineUserOptions
    current_checkpoint: Optional[str] = None
    enhanced_prompt: Optional[str] = None
    safety_check: Optional[SafetyCheckResult] = None
    script: Optional[MarketingScript] = None
    scene_plan: Optional[FullScenePlan] = None
    scenes: List[ScenePlanItem] = Field(default_factory=list)
    voiceover_url: Optional[str] = None
    music_url: Optional[str] = None
    captions: List[CaptionSegment] = Field(default_factory=list)
    avatar_video_url: Optional[str] = None
    render_graph: Dict[str, Any] = Field(default_factory=dict)
    final_video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    quality_score: Optional[QualityReport] = None
    s3_paths: Dict[str, str] = Field(default_factory=dict)
    cdn_url: Optional[str] = None
    status: NodeStatus = NodeStatus.PENDING
    overall_progress: int = 0
    dag_nodes: List[DAGNode] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
