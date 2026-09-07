// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: "user" | "admin";
  credits: number;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ─── Generation ───────────────────────────────────────────────────────────────

export type GenerationStatus = "queued" | "processing" | "rendering" | "completed" | "failed";
export type GenerationType = "video" | "image" | "voice" | "avatar";

export interface Generation {
  id: string;
  type: GenerationType;
  model: string;
  prompt: string;
  status: GenerationStatus;
  progress: number;
  output_url: string | null;
  thumbnail_url: string | null;
  credits_used: number;
  created_at: string;
}

export interface VideoModel {
  id: string;
  name: string;
  provider: string;
  available: boolean;
}

export interface ImageModel {
  id: string;
  name: string;
  provider: string;
  available: boolean;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type ProjectType = "video" | "image" | "ugc" | "shorts" | "marketing" | "general";
export type ProjectStatus = "active" | "archived" | "deleted";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  type: ProjectType;
  status: ProjectStatus;
  thumbnail: string | null;
  created_at: string;
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export type AssetType = "video" | "image" | "audio" | "document" | "other";

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: AssetType;
  size: number | null;
  duration: number | null;
  mime_type: string | null;
  created_at: string;
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export type SubscriptionPlan = "free" | "creator" | "pro" | "agency";

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface Plan {
  id: SubscriptionPlan;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

export interface CreditTransaction {
  id: string;
  credits: number;
  balance_after: number;
  action: string;
  note: string | null;
  created_at: string;
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  invited_at: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  title: string;
  description: string | null;
  category: string;
  thumbnail: string | null;
  tags: string[] | null;
  use_count: number;
  json_config: Record<string, unknown>;
  is_featured: boolean;
}

// ─── WebSocket Events ─────────────────────────────────────────────────────────

export type WSEventType =
  | "connected"
  | "job.queued"
  | "job.started"
  | "job.progress"
  | "job.completed"
  | "job.failed";

export interface WSEvent {
  type: WSEventType;
  jobId?: string;
  status?: string;
  progress?: number;
  outputUrl?: string;
  allUrls?: string[];
  model?: string;
  error?: string;
  position?: number;
  userId?: string;
}

// ─── 20-Stage AI Video Pipeline Types ───────────────────────────────────────

export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:5";
export type VideoPlatform = "tiktok" | "instagram_reels" | "youtube_shorts" | "linkedin" | "facebook_ads";
export type VideoStyle = "ugc" | "cinematic" | "viral_hook" | "minimalist" | "dynamic_commercial";
export type CaptionStyle = "tiktok" | "hormozi" | "mrbeast" | "ugc_creator";
export type MusicMood = "energetic_edm" | "lo_fi" | "upbeat_pop" | "corporate_chic" | "dramatic_cinematic" | "phonk_trap";
export type NodeStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface PipelineUserOptions {
  aspect_ratio: AspectRatio;
  duration: number;
  style: VideoStyle;
  voice: string;
  platform: VideoPlatform;
  music_mood?: MusicMood;
  caption_style: CaptionStyle;
  avatar_enabled: boolean;
  product_url?: string;
  target_audience?: string;
}

export interface DAGNode {
  id: string;
  name: string;
  description: string;
  status: NodeStatus;
  progress: number;
  duration_ms?: number;
  input_summary?: string;
  output_summary?: string;
  artifacts?: Record<string, unknown>;
  error?: string;
}

export interface MarketingScript {
  hook: string;
  problem: string;
  solution: string;
  cta: string;
  full_text: string;
  word_count: number;
  estimated_duration_sec: number;
}

export interface StoryBeat {
  id: number;
  type: string;
  narrative_role: string;
  text: string;
}

export interface CharacterSheet {
  character_id: string;
  name: string;
  gender: string;
  hair: string;
  age: string;
  clothing: string;
  facial_features?: string;
  consistency_token: string;
}

export interface LocationSheet {
  location_id: string;
  name: string;
  environment: string;
  lighting: string;
  color_palette: string;
  atmosphere: string;
}

export interface CameraDirection {
  camera_type: string;
  movement: string;
  lens: string;
  angle: string;
}

export interface ShotPlanItem {
  shot_number: number;
  shot_type: string;
  duration: number;
  visual_action: string;
  camera: CameraDirection;
}

export interface MotionIntensity {
  level: string;
  intensity_score: number;
  pacing_rationale: string;
}

export interface ScenePlanItem {
  scene_number: number;
  title: string;
  narrative_role?: string;
  start_time: number;
  end_time: number;
  duration: number;
  script_segment: string;
  visual_strategy?: string[];
  shots?: ShotPlanItem[];
  camera?: CameraDirection;
  character_ref?: string;
  location_ref?: string;
  motion_intensity?: MotionIntensity;
  visual_prompt: string;
  camera_movement: string;
  image_url?: string;
  video_url?: string;
  status: NodeStatus;
}

export interface FullScenePlan {
  title: string;
  total_duration: number;
  character_sheet: CharacterSheet;
  location_sheet: LocationSheet;
  story_beats: StoryBeat[];
  scenes: ScenePlanItem[];
  asset_dag?: Record<string, unknown>;
}

export interface CaptionWordCue {
  word: string;
  start: number;
  end: number;
  highlight: boolean;
}

export interface CaptionSegment {
  start: number;
  end: number;
  text: string;
  words: CaptionWordCue[];
}

export interface QualityReport {
  overall_score: number;
  video_quality: number;
  caption_timing: number;
  audio_levels: number;
  face_consistency: number;
  brand_compliance: number;
  passed: boolean;
  feedback: string;
}

export interface RenderGraph {
  resolution: string;
  fps: number;
  audio_ducking: string;
  transitions: Array<{ from: number; to: number; effect: string; dur: number }>;
  filtergraph: string;
}

export interface PipelineJobState {
  project_id: string;
  job_id: string;
  user_id: string;
  raw_prompt: string;
  options: PipelineUserOptions;
  enhanced_prompt?: string;
  safety_check?: {
    allowed: boolean;
    confidence: number;
    flags: string[];
    reason?: string;
  };
  script?: MarketingScript;
  scene_plan?: FullScenePlan;
  scenes: ScenePlanItem[];
  voiceover_url?: string;
  music_url?: string;
  captions: CaptionSegment[];
  avatar_video_url?: string;
  render_graph?: RenderGraph;
  final_video_url?: string;
  thumbnail_url?: string;
  quality_score?: QualityReport;
  s3_paths: Record<string, string>;
  cdn_url?: string;
  status: NodeStatus;
  overall_progress: number;
  dag_nodes: DAGNode[];
  created_at: string;
  completed_at?: string;
  error_message?: string;
}
