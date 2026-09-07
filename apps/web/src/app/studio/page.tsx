"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play,
  Sparkles,
  Film,
  Music,
  Mic,
  Subtitles,
  Layers,
  Cpu,
  CheckCircle2,
  Download,
  Share2,
  ExternalLink,
  RefreshCw,
  Zap,
  Sliders,
  Workflow,
  Radio
} from "lucide-react";
import { pipelineApi } from "@/services/api";
import type {
  PipelineJobState,
  PipelineUserOptions,
  DAGNode,
  AspectRatio,
  VideoStyle,
  VideoPlatform,
  CaptionStyle,
  MusicMood
} from "@/types";

// Default initial state mimicking complete execution of protein shake ad
const INITIAL_PROMPT = "Create a 30-second TikTok ad for a protein shake.";

const PRESETS = [
  {
    title: "Protein Shake TikTok Ad",
    prompt: "Create a 30-second TikTok ad for a protein shake.",
    style: "ugc" as VideoStyle,
    platform: "tiktok" as VideoPlatform,
    voice: "female_energetic",
    duration: 30,
    caption: "hormozi" as CaptionStyle,
  },
  {
    title: "AI SaaS Viral Short",
    prompt: "Show how one AI tool replaces three full-time marketing agencies in 30 seconds.",
    style: "viral_hook" as VideoStyle,
    platform: "youtube_shorts" as VideoPlatform,
    voice: "male_hype",
    duration: 30,
    caption: "mrbeast" as CaptionStyle,
  },
  {
    title: "Luxury Watch Reel",
    prompt: "Cinematic commercial for a minimalist matte black titanium mechanical watch.",
    style: "cinematic" as VideoStyle,
    platform: "instagram_reels" as VideoPlatform,
    voice: "male_authoritative",
    duration: 30,
    caption: "ugc_creator" as CaptionStyle,
  },
  {
    title: "E-Commerce UGC Ad",
    prompt: "Authentic customer unboxing review for an ergonomic smart posture chair.",
    style: "ugc" as VideoStyle,
    platform: "tiktok" as VideoPlatform,
    voice: "female_casual",
    duration: 30,
    caption: "tiktok" as CaptionStyle,
  },
];

const STYLE_LABELS: Record<VideoStyle, string> = {
  ugc: "UGC",
  cinematic: "Cinematic",
  viral_hook: "Viral Hook",
  minimalist: "Minimalist",
  dynamic_commercial: "Dynamic Commercial",
};

const PLATFORM_LABELS: Record<VideoPlatform, string> = {
  tiktok: "TikTok",
  instagram_reels: "Instagram Reels",
  youtube_shorts: "YouTube Shorts",
  linkedin: "LinkedIn",
  facebook_ads: "Meta / Facebook",
};

const VOICE_LABELS: Record<string, string> = {
  female_energetic: "Sarah (Energetic UGC)",
  piper_local: "Piper Neural (Self-Hosted TTS)",
  male_authoritative: "Marcus (Direct Response)",
  female_casual: "Emma (Conversational)",
  male_hype: "Leo (Viral Hype)",
};

const CAPTION_LABELS: Record<CaptionStyle, string> = {
  hormozi: "Alex Hormozi (Bold Neon)",
  tiktok: "TikTok Rounded Pill",
  mrbeast: "Mr Beast (Bouncy Pop)",
  ugc_creator: "UGC Creator Minimal",
};

const MUSIC_LABELS: Record<MusicMood, string> = {
  energetic_edm: "Neon Pulse High-Drive (128 BPM Future Bass)",
  lo_fi: "Lo-Fi Focus (82 BPM)",
  upbeat_pop: "Upbeat Pop (118 BPM)",
  corporate_chic: "Corporate Chic (110 BPM)",
  dramatic_cinematic: "Dramatic Cinematic (96 BPM)",
  phonk_trap: "Phonk Trap (142 BPM)",
};

const RESOLUTION_BY_RATIO: Record<AspectRatio, string> = {
  "9:16": "1080x1920",
  "16:9": "1920x1080",
  "1:1": "1080x1080",
  "4:5": "1080x1350",
};

const PROCESSING_STAGES = [
  "Validating request",
  "Enhancing prompt",
  "Writing marketing script",
  "Planning scenes",
  "Generating keyframes",
  "Rendering video clips",
  "Mixing voice and music",
  "Burning captions",
  "Running quality checks",
  "Preparing final export",
];

type StudioTab = "video" | "director" | "script" | "storyboard" | "audio" | "captions" | "ffmpeg" | "quality" | "dag" | "deployment" | "checkpoint";

export default function PipelineStudioPage() {
  const [prompt, setPrompt] = useState(INITIAL_PROMPT);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [duration, setDuration] = useState<number>(30);
  const [style, setStyle] = useState<VideoStyle>("ugc");
  const [platform, setPlatform] = useState<VideoPlatform>("tiktok");
  const [voice, setVoice] = useState<string>("female_energetic");
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>("hormozi");
  const [musicMood] = useState<MusicMood>("energetic_edm");
  const [avatarEnabled, setAvatarEnabled] = useState<boolean>(true);
  const [productUrl, setProductUrl] = useState<string>("https://fitlife-nutrition.example.com/protein-isolate");

  const [activeTab, setActiveTab] = useState<StudioTab>("director");
  const [selectedDagNode, setSelectedDagNode] = useState<DAGNode | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [jobState, setJobState] = useState<PipelineJobState | null>(null);
  const [simulatedFailureNode, setSimulatedFailureNode] = useState<string | null>(null);
  const [isResumingCheckpoint, setIsResumingCheckpoint] = useState<boolean>(false);
  const [processingStageIndex, setProcessingStageIndex] = useState(0);
  const [processingStartedAt, setProcessingStartedAt] = useState<number | null>(null);
  const [processingElapsed, setProcessingElapsed] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isRunning) {
      setProcessingStageIndex(0);
      setProcessingStartedAt(null);
      setProcessingElapsed(0);
      return;
    }

    const startedAt = Date.now();
    setProcessingStartedAt(startedAt);
    const timer = window.setInterval(() => {
      setProcessingStageIndex((current) => Math.min(current + 1, PROCESSING_STAGES.length - 1));
      setProcessingElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1200);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  const runPipelineSimulation = useCallback(async (inputPrompt: string, optionOverrides?: Partial<PipelineUserOptions>) => {
    setIsRunning(true);
    const options: PipelineUserOptions = {
      aspect_ratio: aspectRatio,
      duration,
      style,
      voice,
      platform,
      caption_style: captionStyle,
      music_mood: musicMood,
      avatar_enabled: avatarEnabled,
      product_url: productUrl,
      ...optionOverrides,
    };

    try {
      // First try hitting local API
      const res = await pipelineApi.generate({ prompt: inputPrompt, options });
      if (res.data) {
        setJobState(res.data);
        setIsRunning(false);
        return;
      }
    } catch {
      console.log("Using client-side pipeline simulation engine...");
    }

    // Client-side instant orchestration engine
    const styleLabel = STYLE_LABELS[options.style];
    const platformLabel = PLATFORM_LABELS[options.platform];
    const voiceLabel = VOICE_LABELS[options.voice] ?? options.voice;
    const captionLabel = CAPTION_LABELS[options.caption_style];
    const musicLabel = MUSIC_LABELS[options.music_mood ?? "energetic_edm"];
    const resolution = RESOLUTION_BY_RATIO[options.aspect_ratio];
    const nodes: DAGNode[] = [
      { id: "stage_01_request", name: "User Request Layer", description: `Validate parameters: ${options.aspect_ratio}, ${options.duration}s, ${styleLabel}`, status: "completed", progress: 100, output_summary: `Validated options: ${options.aspect_ratio}, ${options.duration}s, ${platformLabel}` },
      { id: "stage_02_project", name: "Project & Queue Registration", description: "Allocate project ID & SQS/Redis queue job", status: "completed", progress: 100, output_summary: "Project prj_8f92a1 registered. Enqueued in worker cluster." },
      { id: "stage_04_enhancer", name: "Prompt Engineer AI", description: "Expand into cinematic production brief", status: "completed", progress: 100, output_summary: `Expanded into a ${styleLabel.toLowerCase()} ${platformLabel} production brief.` },
      { id: "stage_05_safety", name: "Safety & Moderation Layer", description: "Check NSFW, violence, copyright & brand restrictions", status: "completed", progress: 100, output_summary: "Passed all content filters with 99.4% confidence score." },
      { id: "stage_06_script", name: "Marketing Script AI", description: "Generate Hook, Problem, Solution, CTA framework", status: "completed", progress: 100, output_summary: `Generated 4-beat high-converting copy for a ${options.duration}s video.` },
      { id: "stage_07_scene_planner", name: "Scene Storyboard Planner", description: "Convert script into timed multi-scene storyboard", status: "completed", progress: 100, output_summary: `Structured 4 scenes for ${options.duration}s of ${styleLabel.toLowerCase()} content.` },
      { id: "stage_09_images", name: "Scene Image Generation", description: "FLUX / SDXL keyframe generation", status: "completed", progress: 100, output_summary: "4 high-fidelity photorealistic scene keyframes rendered." },
      { id: "stage_10_video_workers", name: "Parallel Video Workers", description: "Veo / Runway / Kling parallel clip rendering", status: "completed", progress: 100, output_summary: "4 workers completed video clips simultaneously in 2.8s." },
      { id: "stage_11_voiceover", name: "Voiceover Synthesis", description: "ElevenLabs / OpenAI neural TTS narration", status: "completed", progress: 100, output_summary: `Rendered ${voiceLabel} audio track with studio mastering.` },
      { id: "stage_12_music", name: "Background Music Selector", description: "Mood selection & automatic audio ducking", status: "completed", progress: 100, output_summary: `Matched '${musicLabel}' with -18dB speech ducking.` },
      { id: "stage_13_captions", name: "Caption & Subtitle Generator", description: "Word-level timestamp synchronization", status: "completed", progress: 100, output_summary: `Generated synchronized word cues in ${captionLabel} style.` },
      { id: "stage_14_avatar", name: "UGC Influencer Avatar", description: "Talking head avatar with Wav2Lip facial sync", status: "completed", progress: 100, output_summary: options.avatar_enabled ? "Lip-sync aligned with voiceover phonemes at 96% accuracy." : "Avatar generation skipped by request." },
      { id: "stage_15_composition", name: "Video Composition Graph", description: "Assemble multi-track timeline & filtergraphs", status: "completed", progress: 100, output_summary: "Render graph compiled with whip-pan transitions and color LUT." },
      { id: "stage_16_ffmpeg_render", name: "FFmpeg Render Farm", description: "Hardware-accelerated encoding & mixing", status: "completed", progress: 100, output_summary: `Rendered ${resolution} @ 30fps H.264 / AAC final video.` },
      { id: "stage_17_quality", name: "AI Quality & Sync Scoring", description: "Multimodal quality & compliance inspection", status: "completed", progress: 100, output_summary: "Quality Score: 94/100 (Sync: 96%, Audio: 91%, Brand: 98%)." },
      { id: "stage_18_storage", name: "S3 Asset Hierarchy Storage", description: "Persist outputs to structured S3 buckets", status: "completed", progress: 100, output_summary: "Saved to projects/prj_8f92a1/exports/final_render_1080p.mp4" },
      { id: "stage_19_cdn", name: "CloudFront CDN Distribution", description: "Resolve global edge delivery URLs", status: "completed", progress: 100, output_summary: "https://cdn.viewmax.ai/projects/prj_8f92a1/exports/final_render_1080p.mp4" },
      { id: "stage_20_notification", name: "User WebSocket Event", description: "Push job.completed event to frontend", status: "completed", progress: 100, output_summary: "Dispatched WebSocket event to client in 12ms." }
    ];

    const simulatedState: PipelineJobState = {
      project_id: "prj_8f92a176",
      job_id: "job_9410ef2a",
      user_id: "usr_viewmax_demo",
      raw_prompt: inputPrompt,
      options,
      enhanced_prompt: (
        "Create a high-converting TikTok advertisement featuring a fitness influencer drinking a premium chocolate " +
        "protein shake after a gym workout. Show: intense workout finish, protein shake reveal, close-up creamy pour shot, " +
        `energetic satisfied expression, modern gym backdrop. ${options.aspect_ratio} framing with ${styleLabel.toLowerCase()} lighting, high realism.`
      ),
      safety_check: {
        allowed: true,
        confidence: 0.994,
        flags: [],
        reason: "Passed all content filters. No NSFW, violence, or trademark infringement detected."
      },
      script: {
        hook: "Stop wasting money on chalky protein shakes that upset your stomach.",
        problem: "Most powders taste like wet cardboard and clump up no matter how hard you shake them.",
        solution: "This ultra-filtered isolate delivers 30 grams of pure whey protein with zero chalky texture and melts like chocolate gelato.",
        cta: "Tap the link below right now to get 25% off your first starter tub today.",
        full_text: "Stop wasting money on chalky protein shakes that upset your stomach. Most powders taste like wet cardboard and clump up no matter how hard you shake them. This ultra-filtered isolate delivers 30 grams of pure whey protein with zero chalky texture and melts like chocolate gelato. Tap the link below right now to get 25% off your first starter tub today.",
        word_count: 67,
        estimated_duration_sec: 29.5
      },
      scene_plan: {
        title: `${options.duration}s ${styleLabel} ${platformLabel} Social Ad`,
        total_duration: options.duration,
        character_sheet: {
          character_id: "athlete_01",
          name: "Maya Lin",
          gender: "female",
          hair: "brunette hair in high athletic ponytail",
          age: "26-year-old",
          clothing: "matte black seamless gym apparel with charcoal accents",
          facial_features: "glowing healthy skin, determined athletic expression, subtle perspiration sheen",
          consistency_token: "[VMAX_CHAR_ATHLETE_MAYA]"
        },
        location_sheet: {
          location_id: "loc_modern_gym",
          name: "Equinox-Style Boutique Fitness Studio",
          environment: "Spacious high-end private gym with polished concrete floors, matte black dumbbell racks, and floor-to-ceiling glass windows",
          lighting: "Bright natural morning sunlight mixed with dramatic volumetric rim backlighting",
          color_palette: "Matte dark slate, warm cedar accents, clean architectural ambient glow",
          atmosphere: "Energetic, aspirational, impeccably clean luxury athletic space"
        },
        story_beats: [
          { id: 1, type: "problem", narrative_role: "HOOK", text: "Stop wasting money on chalky protein shakes that upset your stomach." },
          { id: 2, type: "agitation", narrative_role: "PROBLEM", text: "Most powders taste like wet cardboard and clump up no matter how hard you shake them." },
          { id: 3, type: "solution", narrative_role: "VALUE", text: "This ultra-filtered isolate delivers 30 grams of pure whey protein with zero chalky texture." },
          { id: 4, type: "cta", narrative_role: "CONVERSION", text: "Tap the link below right now to get 25% off your first starter tub today." }
        ],
        scenes: []
      },
      scenes: [
        {
          scene_number: 1,
          title: "Pattern Interrupt / High Energy Hook",
          narrative_role: "HOOK",
          start_time: 0.0,
          end_time: 5.4,
          duration: 5.4,
          script_segment: "Stop wasting money on chalky protein shakes that upset your stomach.",
          visual_strategy: [
            "Exhausted athletic creator dropping dumbbells",
            "Breathing hard with direct eye contact into lens",
            "Authentic handheld smartphone camera shake",
            "Volumetric morning gym sunlight"
          ],
          motion_intensity: {
            level: "high motion",
            intensity_score: 85,
            pacing_rationale: "Fast pattern interrupt to stop social feed scrolling within 1.5s"
          },
          shots: [
            {
              shot_number: 1,
              shot_type: "medium_closeup",
              duration: 3.0,
              visual_action: "Maya Lin drops heavy dumbbells on rubber gym floor, exhales, and immediately looks up into camera lens with high energy.",
              camera: {
                camera_type: "Handheld UGC",
                movement: "Fast snappy punch-in zoom with slight handheld tremor",
                lens: "28mm wide-angle",
                angle: "Eye-level, dynamic tilt"
              }
            },
            {
              shot_number: 2,
              shot_type: "extreme_closeup",
              duration: 2.4,
              visual_action: "Dramatic direct eye contact, breathing heavily with authentic workout intensity.",
              camera: {
                camera_type: "Optical Gimbal",
                movement: "Slow steady push-in locking focus on eyes",
                lens: "50mm portrait prime",
                angle: "Eye-level tack-sharp focal depth"
              }
            }
          ],
          visual_prompt: "[VMAX_CHAR_ATHLETE_MAYA] Maya Lin in Equinox-Style Boutique Gym. Visual action: Athletic creator drops heavy dumbbells on rubber floor, breathing hard, direct eye contact. Camera: 28mm wide-angle fast punch-in handheld motion with subtle motion blur. Lighting: Volumetric morning sunlight with dramatic rim backlight. Vertical 9:16 framing, photorealistic 4K cinematic render.",
          camera_movement: "Dynamic punch-in handheld motion with subtle motion blur",
          image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
          video_url: "http://localhost:8000/local-media/sample/ForBiggerBlazes.mp4",
          status: "completed"
        },
        {
          scene_number: 2,
          title: "Problem Agitation / Frustration",
          narrative_role: "PROBLEM",
          start_time: 5.4,
          end_time: 12.0,
          duration: 6.6,
          script_segment: "Most powders taste like wet cardboard and clump up no matter how hard you shake them.",
          visual_strategy: [
            "Creator shaking cheap cloudy plastic shaker bottle",
            "Macro view of gross white unmixed powder clumps",
            "Disgusted, dissatisfied reaction",
            "Relatable everyday fitness dilemma"
          ],
          motion_intensity: {
            level: "medium motion",
            intensity_score: 60,
            pacing_rationale: "Clear demonstration of common customer frustration"
          },
          shots: [
            {
              shot_number: 1,
              shot_type: "medium_shot",
              duration: 4.0,
              visual_action: "Maya Lin vigorously shaking a cheap cloudy plastic shaker bottle, pausing to inspect gross clumps.",
              camera: {
                camera_type: "Dolly Track",
                movement: "Slow pull-back revealing frustrated expression",
                lens: "35mm documentary lens",
                angle: "Chest-height neutral"
              }
            },
            {
              shot_number: 2,
              shot_type: "macro",
              duration: 2.6,
              visual_action: "Macro focus on chalky powder residue clinging inside cloudy shaker cup.",
              camera: {
                camera_type: "Static Macro",
                movement: "Locked-off macro focus with shallow depth of field",
                lens: "85mm f/2.8 Macro",
                angle: "Side profile with backlight revealing powder clumps"
              }
            }
          ],
          visual_prompt: "[VMAX_CHAR_ATHLETE_MAYA] Maya Lin looking frustrated at cheap cloudy shaker bottle with visible white clumps stuck on walls. Camera: 35mm documentary lens slow pull-back with focus on shaker clumps. Vertical 9:16 framing, photorealistic.",
          camera_movement: "Eye-level slow pull-back with focus on shaker clumps",
          image_url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
          video_url: "http://localhost:8000/local-media/sample/ForBiggerEscapes.mp4",
          status: "completed"
        },
        {
          scene_number: 3,
          title: "Hero Product Reveal & Solution",
          narrative_role: "VALUE",
          start_time: 12.0,
          end_time: 24.0,
          duration: 12.0,
          script_segment: "This ultra-filtered isolate delivers 30 grams of pure whey protein with zero chalky texture and melts like chocolate gelato.",
          visual_strategy: [
            "Hero product bottle reveal on gym bench",
            "Macro slow-motion liquid pour at 120fps",
            "Rich creamy velvety texture with zero clumps",
            "Satisfied tasting reaction with genuine smile"
          ],
          motion_intensity: {
            level: "smooth cinematic",
            intensity_score: 55,
            pacing_rationale: "Aspirational sensory proof showing texture and immediate benefit"
          },
          shots: [
            {
              shot_number: 1,
              shot_type: "hero_reveal_wide",
              duration: 4.0,
              visual_action: "Sleek matte-black branded protein bottle standing proud on gym bench, illuminated by dramatic light shafts.",
              camera: {
                camera_type: "Motorized Slider",
                movement: "Low-angle lateral tracking glide",
                lens: "50mm prime",
                angle: "Slight low-angle hero perspective"
              }
            },
            {
              shot_number: 2,
              shot_type: "macro_liquid_pour",
              duration: 5.0,
              visual_action: "Ultra slow-motion 120fps pour of velvety rich chocolate protein shake into glass, creamy vortex swirl with zero lumps.",
              camera: {
                camera_type: "High-Speed Phantom",
                movement: "180-degree orbital sweep matching liquid flow",
                lens: "100mm Macro lens",
                angle: "45-degree downward angle"
              }
            },
            {
              shot_number: 3,
              shot_type: "satisfaction_close",
              duration: 3.0,
              visual_action: "Maya Lin taking a refreshing sip, closing eyes with a genuine satisfied smile.",
              camera: {
                camera_type: "Handheld Steady",
                movement: "Subtle slow push-in capturing natural smile",
                lens: "50mm f/1.8",
                angle: "Eye-level warm golden rim light"
              }
            }
          ],
          visual_prompt: "Macro slow-motion liquid pour of rich creamy chocolate protein shake into glass, cold condensation beads, luxurious sleek bottle packaging beside, satisfied smile. Camera: 180-degree orbital sweep with 100mm macro lens at 120fps. Vertical 9:16 framing, photorealistic commercial grade.",
          camera_movement: "Smooth orbital 180-degree glide with slow-motion liquid fluid dynamics",
          image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
          video_url: "http://localhost:8000/local-media/sample/ForBiggerFun.mp4",
          status: "completed"
        },
        {
          scene_number: 4,
          title: "Direct Urgency Call to Action",
          narrative_role: "CONVERSION",
          start_time: 24.0,
          end_time: 30.0,
          duration: 6.0,
          script_segment: "Tap the link below right now to get 25% off your first starter tub today.",
          visual_strategy: [
            "Creator holding product tub with confident smile",
            "Pointing downward to CTA link banner",
            "Limited-time discount badge overlay",
            "Clean studio backdrop with high logo legibility"
          ],
          motion_intensity: {
            level: "low motion",
            intensity_score: 25,
            pacing_rationale: "Low visual distraction for maximum CTA conversion clarity"
          },
          shots: [
            {
              shot_number: 1,
              shot_type: "medium_centered",
              duration: 3.0,
              visual_action: "Maya Lin smiling warmly, holding product tub in left hand and pointing index finger directly downward toward link button.",
              camera: {
                camera_type: "Tripod Centered",
                movement: "Steady locked frame with quick 1.1x digital punch-in for urgency",
                lens: "35mm lens",
                angle: "Direct eye-level commercial framing"
              }
            },
            {
              shot_number: 2,
              shot_type: "end_card_brand",
              duration: 3.0,
              visual_action: "Hero 3D product render with glowing discount callout '25% OFF STARTER BUNDLE' and animated swipe-up indicator.",
              camera: {
                camera_type: "Motion Graphics Compositing",
                movement: "Gentle floating slow push",
                lens: "Virtual 50mm",
                angle: "Straight-on centered"
              }
            }
          ],
          visual_prompt: "[VMAX_CHAR_ATHLETE_MAYA] Maya Lin smiling holding branded tub pointing downward with animated limited-time discount badge overlay. Camera: 35mm lens snappy centered push-in on logo and promo callout. Vertical 9:16 framing, photorealistic.",
          camera_movement: "Snappy centered push-in on logo and promo callout",
          image_url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop",
          video_url: "http://localhost:8000/local-media/sample/ForBiggerJoyBlazes.mp4",
          status: "completed"
        }
      ],
      voiceover_url: "https://assets.viewmax.ai/audio/voices/sarah_energetic.mp3",
      music_url: "https://assets.viewmax.ai/audio/music/neon_pulse.mp3",
      captions: [
        {
          start: 0.0,
          end: 5.4,
          text: "Stop wasting money on chalky protein shakes that upset your stomach.",
          words: [
            { word: "Stop", start: 0.0, end: 0.5, highlight: true },
            { word: "wasting", start: 0.5, end: 1.0, highlight: false },
            { word: "money", start: 1.0, end: 1.5, highlight: true },
            { word: "on", start: 1.5, end: 1.8, highlight: false },
            { word: "chalky", start: 1.8, end: 2.3, highlight: false },
            { word: "protein", start: 2.3, end: 2.9, highlight: true },
            { word: "shakes", start: 2.9, end: 3.5, highlight: false },
            { word: "that", start: 3.5, end: 3.8, highlight: false },
            { word: "upset", start: 3.8, end: 4.3, highlight: false },
            { word: "your", start: 4.3, end: 4.6, highlight: false },
            { word: "stomach", start: 4.6, end: 5.4, highlight: true }
          ]
        },
        {
          start: 5.4,
          end: 12.0,
          text: "Most powders taste like wet cardboard and clump up no matter how hard you shake them.",
          words: [
            { word: "Most", start: 5.4, end: 5.9, highlight: false },
            { word: "powders", start: 5.9, end: 6.4, highlight: false },
            { word: "taste", start: 6.4, end: 6.9, highlight: false },
            { word: "like", start: 6.9, end: 7.2, highlight: false },
            { word: "cardboard", start: 7.2, end: 8.0, highlight: true },
            { word: "and", start: 8.0, end: 8.3, highlight: false },
            { word: "clump", start: 8.3, end: 8.9, highlight: true },
            { word: "up", start: 8.9, end: 9.3, highlight: false },
            { word: "no", start: 9.3, end: 9.6, highlight: false },
            { word: "matter", start: 9.6, end: 10.1, highlight: false },
            { word: "how", start: 10.1, end: 10.4, highlight: false },
            { word: "hard", start: 10.4, end: 10.9, highlight: false },
            { word: "you", start: 10.9, end: 11.2, highlight: false },
            { word: "shake", start: 11.2, end: 11.6, highlight: false },
            { word: "them", start: 11.6, end: 12.0, highlight: false }
          ]
        },
        {
          start: 12.0,
          end: 24.0,
          text: "This ultra-filtered isolate delivers 30 grams of pure whey protein with zero chalky texture.",
          words: [
            { word: "This", start: 12.0, end: 12.5, highlight: false },
            { word: "ultra-filtered", start: 12.5, end: 13.6, highlight: true },
            { word: "isolate", start: 13.6, end: 14.4, highlight: false },
            { word: "delivers", start: 14.4, end: 15.2, highlight: false },
            { word: "30", start: 15.2, end: 15.8, highlight: true },
            { word: "grams", start: 15.8, end: 16.5, highlight: true },
            { word: "of", start: 16.5, end: 16.8, highlight: false },
            { word: "pure", start: 16.8, end: 17.5, highlight: true },
            { word: "whey", start: 17.5, end: 18.2, highlight: false },
            { word: "protein", start: 18.2, end: 19.0, highlight: true },
            { word: "with", start: 19.0, end: 19.4, highlight: false },
            { word: "zero", start: 19.4, end: 20.2, highlight: true },
            { word: "chalky", start: 20.2, end: 21.0, highlight: false },
            { word: "texture", start: 21.0, end: 22.0, highlight: false }
          ]
        },
        {
          start: 24.0,
          end: 30.0,
          text: "Tap the link below right now to get 25% off your first starter tub today.",
          words: [
            { word: "Tap", start: 24.0, end: 24.5, highlight: true },
            { word: "the", start: 24.5, end: 24.8, highlight: false },
            { word: "link", start: 24.8, end: 25.4, highlight: true },
            { word: "below", start: 25.4, end: 26.0, highlight: false },
            { word: "right", start: 26.0, end: 26.4, highlight: false },
            { word: "now", start: 26.4, end: 27.0, highlight: true },
            { word: "25%", start: 27.0, end: 27.8, highlight: true },
            { word: "off", start: 27.8, end: 28.3, highlight: true },
            { word: "today", start: 28.3, end: 30.0, highlight: true }
          ]
        }
      ],
      avatar_video_url: "http://localhost:8000/local-media/sample/ForBiggerBlazes.mp4",
      render_graph: {
        resolution,
        fps: 30,
        audio_ducking: "-18dB sidechain compression during voiceover",
        transitions: [
          { from: 1, to: 2, effect: "whip_pan_right", dur: 0.4 },
          { from: 2, to: 3, effect: "glitch_impact", dur: 0.3 },
          { from: 3, to: 4, effect: "crossfade", dur: 0.5 },
        ],
        filtergraph: (
          `-filter_complex \"[0:v]scale=${resolution.replace("x", ":")}:force_original_aspect_ratio=increase,crop=${resolution.replace("x", ":")}[v0]; ` +
          "[v0]subtitles=captions.ass:force_style='FontName=Montserrat,Bold=1,PrimaryColour=&H0000FFFF'[vout]; " +
          "[1:a]volume=1.0[voice]; [2:a]volume=0.18[music]; [voice][music]amix=inputs=2[aout]\" " +
          "-map \"[vout]\" -map \"[aout]\" -c:v libx264 -crf 19 output.mp4"
        )
      },
      final_video_url: "http://localhost:8000/local-media/sample/ForBiggerBlazes.mp4",
      thumbnail_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1080&auto=format&fit=crop",
      quality_score: {
        overall_score: 94,
        video_quality: 94,
        caption_timing: 96,
        audio_levels: 91,
        face_consistency: 95,
        brand_compliance: 98,
        passed: true,
        feedback: "Tack-sharp visual quality, caption timing synchronized within 32ms, audio sidechain ducking perfectly balanced."
      },
      s3_paths: {
        root: "s3://viewmax-production/projects/prj_8f92a176/",
        video_export: "s3://viewmax-production/projects/prj_8f92a176/exports/final_render_1080p.mp4",
        thumbnail: "s3://viewmax-production/projects/prj_8f92a176/thumbnails/poster_frame_01.jpg",
        audio_voiceover: "s3://viewmax-production/projects/prj_8f92a176/audio/voiceover.mp3",
        audio_music: "s3://viewmax-production/projects/prj_8f92a176/audio/music_neon_pulse.mp3",
        captions_ass: "s3://viewmax-production/projects/prj_8f92a176/captions/timed_subtitles.ass",
      },
      cdn_url: "https://cdn.viewmax.ai/projects/prj_8f92a176/exports/final_render_1080p.mp4",
      status: "completed",
      overall_progress: 100,
      dag_nodes: nodes,
      created_at: new Date().toISOString()
    };

    setJobState(simulatedState);
    setIsRunning(false);
  }, [aspectRatio, avatarEnabled, captionStyle, duration, musicMood, platform, productUrl, style, voice]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void runPipelineSimulation(INITIAL_PROMPT);
  }, [runPipelineSimulation]);

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setPrompt(preset.prompt);
    setStyle(preset.style);
    setPlatform(preset.platform);
    setVoice(preset.voice);
    setDuration(preset.duration);
    setCaptionStyle(preset.caption);
    void runPipelineSimulation(preset.prompt, {
      style: preset.style,
      platform: preset.platform,
      voice: preset.voice,
      duration: preset.duration,
      caption_style: preset.caption,
    });
  };

  const activeOptions = jobState?.options ?? {
    aspect_ratio: aspectRatio,
    duration,
    style,
    voice,
    platform,
    caption_style: captionStyle,
    music_mood: musicMood,
    avatar_enabled: avatarEnabled,
    product_url: productUrl,
  };
  const activeResolution = RESOLUTION_BY_RATIO[activeOptions.aspect_ratio];
  const activeStyle = STYLE_LABELS[activeOptions.style];
  const activePlatform = PLATFORM_LABELS[activeOptions.platform];
  const activeVoice = VOICE_LABELS[activeOptions.voice] ?? activeOptions.voice;
  const activeCaption = CAPTION_LABELS[activeOptions.caption_style];
  const activeMusic = MUSIC_LABELS[activeOptions.music_mood ?? "energetic_edm"];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans">
      {/* ── Header / Top Navigation ── */}
      <header className="border-b border-white/10 bg-[#0c0c10]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Viewmax
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
                  AI Orchestrator DAG v2.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">20-Step Autonomous Video Pipeline</p>
            </div>
          </div>

          {/* Infrastructure Health Badges */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Redis 7: Port 6379</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
              <Cpu className="w-3.5 h-3.5" />
              <span>NVENC Hardware Accel: Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <Radio className="w-3.5 h-3.5" />
              <span>Ollama + ComfyUI: Connected</span>
            </div>
          </div>

          {/* Credits & Action */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <div>
                <span className="text-xs font-semibold text-zinc-200">1,420</span>
                <span className="text-[10px] text-zinc-500 ml-1">credits</span>
              </div>
            </div>
            <button
              onClick={() => runPipelineSimulation(prompt)}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
              <span>{isRunning ? "Orchestrating..." : "Execute Pipeline"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        
        {/* ── Pipeline Configuration & Launchpad ── */}
        <section className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex flex-col gap-5 relative z-10">
            {/* Header + Presets */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-violet-400" />
                  AI Video Orchestration Studio
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Enter a simple concept — the DAG orchestrator handles Prompt Enhancement, Safety Checks, Scriptwriting, Scene Planning, Asset Generation, Voice, Music, Captions, FFmpeg Rendering, and CloudFront Distribution.
                </p>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-500 font-medium">Try Presets:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(p)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input Box */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your video idea (e.g. Create a 30-second TikTok ad for a protein shake)..."
                rows={3}
                className="w-full bg-[#0e0e14] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none transition-all shadow-inner"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-[11px] text-zinc-500">{prompt.length} chars</span>
                <button
                  onClick={() => runPipelineSimulation(prompt)}
                  disabled={isRunning || !prompt.trim()}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-violet-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run 20-Stage Pipeline</span>
                </button>
              </div>
            </div>

            {/* Live processing status */}
            {(isRunning || jobState) && (
              <div className="rounded-xl border border-white/10 bg-[#0e0e14]/90 px-4 py-3 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {isRunning ? (
                      <RefreshCw className="w-4 h-4 shrink-0 text-cyan-300 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    )}
                    <span className="text-xs font-semibold text-white truncate">
                      {isRunning ? PROCESSING_STAGES[processingStageIndex] : "Pipeline complete"}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {isRunning ? `${processingElapsed}s elapsed` : `${jobState?.overall_progress ?? 0}% finished`}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-300">
                    {isRunning
                      ? `${Math.max(3, Math.min(94, Math.round(((processingStageIndex + 1) / PROCESSING_STAGES.length) * 100)))}%`
                      : `${jobState?.overall_progress ?? 0}%`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Video pipeline progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={isRunning ? Math.max(3, Math.min(94, Math.round(((processingStageIndex + 1) / PROCESSING_STAGES.length) * 100))) : jobState?.overall_progress ?? 0}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isRunning ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" : "bg-emerald-400"}`}
                    style={{ width: `${isRunning ? Math.max(3, Math.min(94, Math.round(((processingStageIndex + 1) / PROCESSING_STAGES.length) * 100))) : jobState?.overall_progress ?? 0}%` }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {(jobState?.dag_nodes?.length ? jobState.dag_nodes : PROCESSING_STAGES.map((name, index) => ({ id: String(index), name, status: index < processingStageIndex ? "completed" : index === processingStageIndex && isRunning ? "running" : "pending" }))).slice(0, 10).map((task) => {
                    const status = task.status;
                    return (
                      <div key={task.id} className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] ${status === "completed" ? "bg-emerald-400/10 text-emerald-300" : status === "running" ? "bg-cyan-400/10 text-cyan-300" : "bg-white/[0.03] text-zinc-500"}`}>
                        {status === "completed" ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : status === "running" ? <RefreshCw className="w-3 h-3 shrink-0 animate-spin" /> : <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-current" />}
                        <span className="truncate">{task.name}</span>
                      </div>
                    );
                  })}
                </div>
                {processingStartedAt && isRunning && <span className="sr-only">Processing started at {new Date(processingStartedAt).toLocaleTimeString()}</span>}
              </div>
            )}

            {/* Pipeline Configuration Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              {/* Aspect Ratio */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <label className="text-[11px] font-medium text-zinc-400">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="9:16">9:16 (TikTok / Shorts)</option>
                  <option value="16:9">16:9 (YouTube / Web)</option>
                  <option value="1:1">1:1 (Square Feed)</option>
                  <option value="4:5">4:5 (Mobile Social)</option>
                </select>
              </div>

              {/* Duration */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <label className="text-[11px] font-medium text-zinc-400">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value={15}>15 Seconds</option>
                  <option value={30}>30 Seconds (Recommended)</option>
                  <option value={60}>60 Seconds</option>
                </select>
              </div>

              {/* Style */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <label className="text-[11px] font-medium text-zinc-400">Visual Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as VideoStyle)}
                  className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="ugc">UGC Creator Handheld</option>
                  <option value="cinematic">Cinematic 35mm</option>
                  <option value="viral_hook">Viral Pattern Interrupt</option>
                  <option value="minimalist">Minimalist Luxury</option>
                  <option value="dynamic_commercial">Dynamic Commercial</option>
                </select>
              </div>

              {/* Voice */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <label className="text-[11px] font-medium text-zinc-400">Voiceover Talent</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="female_energetic">Sarah (Energetic UGC)</option>
                  <option value="piper_local">Piper Neural (Self-Hosted TTS)</option>
                  <option value="male_authoritative">Marcus (Direct Response)</option>
                  <option value="female_casual">Emma (Conversational)</option>
                  <option value="male_hype">Leo (Viral Hype)</option>
                </select>
              </div>

              {/* Platform */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <label className="text-[11px] font-medium text-zinc-400">Target Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as VideoPlatform)}
                  className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="tiktok">TikTok Ads</option>
                  <option value="instagram_reels">Instagram Reels</option>
                  <option value="youtube_shorts">YouTube Shorts</option>
                  <option value="facebook_ads">Meta / Facebook</option>
                  <option value="linkedin">LinkedIn Video</option>
                </select>
              </div>

              {/* Caption Style */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <label className="text-[11px] font-medium text-zinc-400">Caption Style</label>
                <select
                  value={captionStyle}
                  onChange={(e) => setCaptionStyle(e.target.value as CaptionStyle)}
                  className="bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="hormozi">Alex Hormozi (Bold Neon)</option>
                  <option value="tiktok">TikTok Rounded Pill</option>
                  <option value="mrbeast">Mr Beast (Bouncy Pop)</option>
                  <option value="ugc_creator">UGC Creator Minimal</option>
                </select>
              </div>
            </div>

            {/* UGC Product URL & Avatar Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
                  <input
                    type="checkbox"
                    checked={avatarEnabled}
                    onChange={(e) => setAvatarEnabled(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-violet-600 focus:ring-violet-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Include UGC Creator Talking-Head Avatar (Wav2Lip Lip-Sync)</span>
                </label>
              </div>
              
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <span className="text-xs text-zinc-500 whitespace-nowrap">Product URL:</span>
                <input
                  type="text"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://yourbrand.com/product"
                  className="w-full bg-zinc-900/80 border border-white/10 rounded-lg text-xs text-zinc-200 px-3 py-1.5 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Visual DAG Pipeline Orchestrator Graph ── */}
        <section className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-violet-400" />
                  Active DAG Execution Flow (20 Specialized Stages)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  All 20 Nodes Resolved
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every node executes asynchronously as a Directed Acyclic Graph. Click any node below to inspect its live inputs, generated artifacts, and logs.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-600"></span> Pending</span>
            </div>
          </div>

          {/* Horizontal scrollable DAG Node Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 pt-2">
            {jobState?.dag_nodes.map((node, index) => {
              const isSelected = selectedDagNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedDagNode(node)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "bg-violet-950/40 border-violet-500/70 shadow-lg shadow-violet-500/20"
                      : "bg-[#111117]/80 hover:bg-[#15151e] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-mono text-zinc-500">#{String(index + 1).padStart(2, "0")}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-200 line-clamp-1">{node.name}</h3>
                    <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{node.description}</p>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-500">
                    <span className="text-emerald-400 font-medium">100% done</span>
                    <span>Inspect &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Inspector Drawer if selected */}
          {selectedDagNode && (
            <div className="mt-2 p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 flex flex-col gap-2 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 font-semibold">
                    {selectedDagNode.id}
                  </span>
                  <h4 className="text-xs font-bold text-white">{selectedDagNode.name}</h4>
                </div>
                <button
                  onClick={() => setSelectedDagNode(null)}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  ✕ Close Inspector
                </button>
              </div>
              <p className="text-xs text-zinc-300">{selectedDagNode.description}</p>
              {selectedDagNode.output_summary && (
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-emerald-400 font-mono">
                  &gt; {selectedDagNode.output_summary}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Interactive Production Artifacts Inspector ── */}
        <section className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "director", label: "🎬 AI Director & Shot Planner", badge: "12-Step Engine" },
                { id: "video", label: "🎥 Final Video & CDN", badge: "CloudFront" },
                { id: "script", label: "📝 Marketing Script", badge: "Hook/Problem/CTA" },
                { id: "storyboard", label: "🖼️ Timed Scenes", badge: "4 Clips" },
                { id: "audio", label: "🎙️ Voice & Music Mix", badge: "-18dB Ducking" },
                { id: "captions", label: "💬 Timed Captions", badge: "Hormozi Style" },
                { id: "ffmpeg", label: "⚙️ FFmpeg Render Graph", badge: "Filtergraph" },
                { id: "quality", label: "🛡️ AI Quality Score", badge: "94/100" },
                { id: "deployment", label: "🚀 Deployment & Scaling", badge: "Self-Hosted Guide" },
                { id: "checkpoint", label: "💾 Checkpoints & Recovery", badge: "Milestones" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as StudioTab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                        : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-zinc-500"}`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-zinc-500">
              Project ID: <span className="font-mono text-zinc-300">{jobState?.project_id || "prj_8f92a176"}</span>
            </div>
          </div>

          {/* ── Tab: AI Director & Shot Planner (12-Step Architecture) ── */}
          {activeTab === "director" && (
            <div className="flex flex-col gap-6">
              {/* Director Architecture Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-purple-950/20 border border-violet-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      LLM Brain &bull; GPT-5 / Claude Director
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Shot Taxonomy Engine Active
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    Autonomous Scene Decomposition & Shot Planning Engine
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-3xl">
                    Transforms unstructured marketing copy into a structured cinematic breakdown before any pixels render: Story Beats &rarr; Narrative Classification &rarr; Duration Allocation &rarr; Shot List &rarr; Character & Location Sheets &rarr; Camera Directions &rarr; Motion Pacing &rarr; Photorealistic Prompts.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-xs">
                  <span className="text-zinc-400">Total Shots:</span>
                  <strong className="text-violet-300 font-mono text-sm">
                    {jobState?.scenes.reduce((acc, s) => acc + (s.shots?.length || 2), 0)} Shots
                  </strong>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400">Scenes:</span>
                  <strong className="text-cyan-300 font-mono text-sm">{jobState?.scenes.length || 4}</strong>
                </div>
              </div>

              {/* Consistency Guards: Character Sheet & Location Sheet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Character Sheet */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Character Consistency Sheet (ControlNet + IP-Adapter)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-violet-400 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
                      {jobState?.scene_plan?.character_sheet?.consistency_token || "[VMAX_CHAR_ATHLETE_MAYA]"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Name & Age</span>
                      <span className="font-semibold text-zinc-200">
                        {jobState?.scene_plan?.character_sheet?.name || "Maya Lin"} ({jobState?.scene_plan?.character_sheet?.age || "26yo"})
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Hairstyle</span>
                      <span className="font-semibold text-zinc-200">
                        {jobState?.scene_plan?.character_sheet?.hair || "High athletic ponytail"}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Apparel</span>
                      <span className="font-semibold text-zinc-200">
                        {jobState?.scene_plan?.character_sheet?.clothing || "Matte black seamless gym wear"}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 italic">
                    Identity locked across all cuts via facial keypoint preservation. Prevents character morphing between cuts.
                  </p>
                </div>

                {/* Location Sheet */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Location & Lighting Consistency Sheet
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {jobState?.scene_plan?.location_sheet?.location_id || "loc_modern_gym"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Environment</span>
                      <span className="font-semibold text-zinc-200 line-clamp-1">
                        {jobState?.scene_plan?.location_sheet?.name || "Equinox-Style Fitness Studio"}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Lighting Profile</span>
                      <span className="font-semibold text-zinc-200 line-clamp-1">
                        {jobState?.scene_plan?.location_sheet?.lighting || "Natural morning sunlight + rim backlighting"}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 italic">
                    Shared architectural palette (matte dark slate, warm cedar, clean concrete) maintains spatial continuity.
                  </p>
                </div>
              </div>

              {/* Cinematic Rules Engine & Narrative Taxonomy */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-violet-400" />
                    Cinematic Rules Engine & Narrative Taxonomy
                  </h4>
                  <span className="text-[11px] text-zinc-400">Enforced before prompt rendering</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#12121a] border border-violet-500/20 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-violet-300">01. HOOK &bull; PATTERN INTERRUPT</span>
                    <span className="text-zinc-400 text-[11px]">Handheld 28mm &bull; Fast Punch-in</span>
                    <span className="text-emerald-400 font-mono text-[10px]">High Motion (85% pacing)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#12121a] border border-amber-500/20 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-amber-300">02. PROBLEM &bull; AGITATION</span>
                    <span className="text-zinc-400 text-[11px]">Dolly 35mm &bull; Macro Clump Focus</span>
                    <span className="text-amber-400 font-mono text-[10px]">Medium Motion (60% pacing)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#12121a] border border-cyan-500/20 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-cyan-300">03. VALUE &bull; SENSORY PAYOFF</span>
                    <span className="text-zinc-400 text-[11px]">100mm Macro &bull; 120fps Orbital</span>
                    <span className="text-cyan-400 font-mono text-[10px]">Smooth Cinematic (55% pacing)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#12121a] border border-pink-500/20 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-pink-300">04. CTA &bull; CONVERSION</span>
                    <span className="text-zinc-400 text-[11px]">35mm Centered &bull; Promo Graphic</span>
                    <span className="text-pink-400 font-mono text-[10px]">Low Motion (25% clarity)</span>
                  </div>
                </div>
              </div>

              {/* Scene-by-Scene Shot Lists & Prompts */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Production Shot Decomposition (Scenes 1 - {jobState?.scenes.length || 4})
                </h4>

                <div className="flex flex-col gap-4">
                  {jobState?.scenes.map((scene) => (
                    <div
                      key={scene.scene_number}
                      className="p-5 rounded-2xl bg-[#111118] border border-white/10 flex flex-col gap-4"
                    >
                      {/* Scene Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-violet-600 text-white">
                            Scene {scene.scene_number}
                          </span>
                          <div>
                            <h5 className="text-sm font-bold text-white">{scene.title}</h5>
                            <span className="text-xs font-mono text-violet-300">
                              {scene.start_time}s &rarr; {scene.end_time}s ({scene.duration}s)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-medium">
                            Role: <strong className="text-white">{scene.narrative_role || "HOOK"}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
                            Pacing: <strong>{scene.motion_intensity?.level || "high motion"}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Visual Strategy List */}
                      {scene.visual_strategy && scene.visual_strategy.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Visual Strategy & Action Beats:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {scene.visual_strategy.map((strat, sIdx) => (
                              <div key={sIdx} className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs text-zinc-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                <span className="line-clamp-1">{strat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Discrete Shot List */}
                      {scene.shots && scene.shots.length > 0 && (
                        <div className="flex flex-col gap-2 pt-1">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Shot Breakdown (Sub-Scene Camera Cuts):
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {scene.shots.map((shot) => (
                              <div key={shot.shot_number} className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-white flex items-center gap-1.5">
                                    <Film className="w-3.5 h-3.5 text-cyan-400" />
                                    Shot {shot.shot_number} &bull; {shot.shot_type.replace('_', ' ').toUpperCase()}
                                  </span>
                                  <span className="text-cyan-300 font-mono font-semibold">{shot.duration}s</span>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed">
                                  {shot.visual_action}
                                </p>
                                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-[10px] text-zinc-400">
                                  <span className="bg-white/5 px-2 py-0.5 rounded">Lens: <strong className="text-zinc-200">{shot.camera.lens}</strong></span>
                                  <span className="bg-white/5 px-2 py-0.5 rounded">Rig: <strong className="text-zinc-200">{shot.camera.camera_type}</strong></span>
                                  <span className="bg-white/5 px-2 py-0.5 rounded">Motion: <strong className="text-violet-300">{shot.camera.movement}</strong></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Transformed Generation Prompt vs Marketing Copy */}
                      <div className="p-3.5 rounded-xl bg-black/80 border border-white/10 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            Transformed Generation Prompt (Visual Syntax for Veo / Runway):
                          </span>
                          <span className="text-zinc-500 font-mono text-[10px]">No Marketing Fluff &bull; Pure Optics</span>
                        </div>
                        <p className="text-xs font-mono text-zinc-200 bg-[#0c0c12] p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">
                          {scene.visual_prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 1: Video & Export ── */}
          {activeTab === "video" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Vertical Player Box (9:16 aspect ratio) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
                  <video
                    src={jobState?.final_video_url || "http://localhost:8000/local-media/sample/ForBiggerBlazes.mp4"}
                    poster={jobState?.thumbnail_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1080&auto=format&fit=crop"}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating Style Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white border border-white/10">
                    {activePlatform} {activeOptions.aspect_ratio} • {activeOptions.duration}s {activeStyle}
                  </div>

                  {/* Synchronized Captions simulation overlay */}
                  <div className="absolute bottom-16 left-4 right-4 text-center pointer-events-none">
                    <span className="inline-block px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm text-sm font-black uppercase text-yellow-400 tracking-wider shadow-lg">
                      30 GRAMS OF PURE PROTEIN
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Metadata & Storage Details */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-violet-400" />
                      Production Render Output
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Ready for Social Distribution
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Resolution</span>
                      <span className="font-semibold text-zinc-200">{activeResolution.replace("x", " × ")}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Framerate</span>
                      <span className="font-semibold text-zinc-200">30.0 fps (H.264)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">Bitrate</span>
                      <span className="font-semibold text-zinc-200">12 Mbps CRF 19</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-zinc-500 block">File Size</span>
                      <span className="font-semibold text-zinc-200">18.4 MB</span>
                    </div>
                  </div>

                  {/* CloudFront CDN link */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] font-medium text-zinc-400">Global CloudFront Edge CDN URL:</span>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={jobState?.cdn_url || "https://cdn.viewmax.ai/projects/prj_8f92a176/exports/final_render_1080p.mp4"}
                        className="w-full bg-black/60 border border-white/10 rounded-lg text-xs font-mono text-cyan-300 px-3 py-2 select-all focus:outline-none"
                      />
                      <a
                        href={jobState?.final_video_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* S3 Storage Hierarchy Tree */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                    Structured S3 Storage Hierarchy
                  </h4>
                  <div className="p-3 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-zinc-400 flex flex-col gap-1">
                    <div><span className="text-violet-400">s3://viewmax-bucket/projects/</span>{jobState?.project_id || "prj_8f92a176"}/</div>
                    <div className="pl-4 text-zinc-300">├── <span className="text-cyan-400">exports/</span>final_render_1080p.mp4 <span className="text-zinc-500">(18.4 MB)</span></div>
                    <div className="pl-4 text-zinc-300">├── <span className="text-cyan-400">thumbnails/</span>poster_frame_01.jpg <span className="text-zinc-500">(340 KB)</span></div>
                    <div className="pl-4 text-zinc-300">├── <span className="text-cyan-400">audio/</span>voiceover_{activeOptions.voice}.mp3 <span className="text-zinc-500">(44.1kHz)</span></div>
                    <div className="pl-4 text-zinc-300">├── <span className="text-cyan-400">audio/</span>music_{activeOptions.music_mood ?? "energetic_edm"}.mp3 <span className="text-zinc-500">(Ducked -18dB)</span></div>
                    <div className="pl-4 text-zinc-300">├── <span className="text-cyan-400">captions/</span>timed_subtitles.ass <span className="text-zinc-500">({activeCaption})</span></div>
                    <div className="pl-4 text-zinc-300">└── <span className="text-cyan-400">videos/</span>scene_01..04.mp4 <span className="text-zinc-500">(4 clips)</span></div>
                  </div>
                </div>

                {/* Download and Action buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={jobState?.final_video_url || "#"}
                    download="viewmax_tiktok_ad.mp4"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP4 Video</span>
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(jobState?.cdn_url || "")}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Copy CDN Link</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 2: Marketing Script ── */}
          {activeTab === "script" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    High-Converting 4-Part Framework (Hook • Problem • Solution • CTA)
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>Word Count: <strong className="text-zinc-200">{jobState?.script?.word_count || 67} words</strong></span>
                    <span>Speech Pace: <strong className="text-zinc-200">2.3 words/sec</strong></span>
                    <span>Target: <strong className="text-violet-400">{activeOptions.duration.toFixed(1)}s</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hook Card */}
                  <div className="p-4 rounded-xl bg-[#14141d] border border-violet-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300">
                        01. PATTERN INTERRUPT HOOK (0 - 5.4s)
                      </span>
                      <span className="text-[10px] text-zinc-500">Stops the Scroll</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-100">
                      &ldquo;{jobState?.script?.hook}&rdquo;
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Visual: Intense athlete ending workout, direct camera address.
                    </p>
                  </div>

                  {/* Problem Card */}
                  <div className="p-4 rounded-xl bg-[#14141d] border border-amber-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        02. PROBLEM & AGITATION (5.4 - 12.0s)
                      </span>
                      <span className="text-[10px] text-zinc-500">Relatable Pain Point</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-100">
                      &ldquo;{jobState?.script?.problem}&rdquo;
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Visual: Cloudy clumping shaker bottle, dissatisfied expression.
                    </p>
                  </div>

                  {/* Solution Card */}
                  <div className="p-4 rounded-xl bg-[#14141d] border border-emerald-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        03. SOLUTION & PRODUCT PROOF (12.0 - 24.0s)
                      </span>
                      <span className="text-[10px] text-zinc-500">Core Value Proposition</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-100">
                      &ldquo;{jobState?.script?.solution}&rdquo;
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Visual: Macro smooth chocolate pour, condensation droplets, luxury bottle packaging.
                    </p>
                  </div>

                  {/* CTA Card */}
                  <div className="p-4 rounded-xl bg-[#14141d] border border-cyan-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                        04. HIGH URGENCY CALL TO ACTION (24.0 - 30.0s)
                      </span>
                      <span className="text-[10px] text-zinc-500">Conversion Trigger</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-100">
                      &ldquo;{jobState?.script?.cta}&rdquo;
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Visual: Creator holding product pointing downward with limited offer badge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 3: Storyboard & Scenes ── */}
          {activeTab === "storyboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobState?.scenes.map((scene) => (
                <div
                  key={scene.scene_number}
                  className="rounded-xl overflow-hidden bg-[#111118] border border-white/10 flex flex-col"
                >
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <Image
                      src={scene.image_url ?? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop"}
                      alt={scene.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white">
                      Scene {scene.scene_number} ({scene.duration}s)
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-violet-600/90 backdrop-blur-sm text-[10px] font-medium text-white flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>{scene.start_time}s - {scene.end_time}s</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col gap-2 flex-1 justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{scene.title}</h4>
                      <p className="text-[11px] text-zinc-400 italic mt-1 line-clamp-2">
                        &ldquo;{scene.script_segment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[10px]">
                      <span className="text-zinc-500 font-medium">Camera Direction:</span>
                      <span className="text-violet-300 font-mono">{scene.camera_movement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tab 4: Voice & Music Mix ── */}
          {activeTab === "audio" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voiceover Track */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-violet-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Neural Voiceover (ElevenLabs)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">44.1kHz • Studio Mastering</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{activeVoice}</span>
                    <span className="text-emerald-400 font-medium">Volume: 100% (Primary)</span>
                  </div>
                  {/* Visual simulated waveform */}
                  <div className="h-10 flex items-center gap-1 px-2 bg-[#12121a] rounded-lg">
                    {[40, 70, 90, 60, 80, 100, 75, 45, 85, 95, 60, 40, 70, 90, 80, 60, 95, 85, 40, 70, 80, 90, 60, 75].map((h, i) => (
                      <div key={i} className="flex-1 bg-violet-500 rounded-full" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <audio controls className="w-full h-8 mt-1" src={jobState?.voiceover_url || "#"} />
                </div>
              </div>

              {/* Background Music Track */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Background Music & Ducking
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">-18dB Sidechain Active</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{activeMusic}</span>
                    <span className="text-cyan-400 font-medium">Ducked to 18% during speech</span>
                  </div>
                  {/* Ducked waveform */}
                  <div className="h-10 flex items-center gap-1 px-2 bg-[#12121a] rounded-lg">
                    {[20, 25, 20, 18, 22, 20, 18, 24, 20, 18, 22, 25, 20, 18, 20, 22, 18, 24, 20, 22, 25, 20, 18, 20].map((h, i) => (
                      <div key={i} className="flex-1 bg-cyan-500/70 rounded-full" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <audio controls className="w-full h-8 mt-1" src={jobState?.music_url || "#"} />
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 5: Captions & Subtitles ── */}
          {activeTab === "captions" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Subtitles className="w-4 h-4 text-amber-400" />
                  Synchronized Word-Level Subtitles ({captionStyle.toUpperCase()} Style)
                </h3>
                <span className="text-xs text-zinc-400">Total Cue Segments: <strong>4</strong></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobState?.captions.map((seg, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold">Segment #{idx + 1}</span>
                      <span className="font-mono text-zinc-500">{seg.start}s &rarr; {seg.end}s</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {seg.words.map((w, wIdx) => (
                        <span
                          key={wIdx}
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            w.highlight
                              ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20 scale-105"
                              : "bg-white/5 text-zinc-300"
                          }`}
                        >
                          {w.word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab 6: FFmpeg Render Graph ── */}
          {activeTab === "ffmpeg" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  FFmpeg Hardware Render Graph & Filtercomplex Command
                </h3>
                <span className="text-xs text-zinc-400 font-mono">Preset: fast • CRF: 19</span>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-zinc-300 flex flex-col gap-3">
                <div className="text-violet-400 font-semibold"># Automated Multi-Track FFmpeg Execution Plan:</div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5 text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {jobState?.render_graph?.filtergraph || "ffmpeg -i scenes.mp4 -i voice.mp3 -i music.mp3 -filter_complex ... final.mp4"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <strong className="text-white block">Video Concat:</strong>
                    <span>4 clips with 0.4s whip-pan transitions</span>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <strong className="text-white block">Subtitle Burning:</strong>
                    <span>libass engine with custom Montserrat font</span>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <strong className="text-white block">Audio Ducking:</strong>
                    <span>Sidechain compressor ducking track 2 by -18dB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 7: Quality Scorecard ── */}
          {activeTab === "quality" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-violet-950/40 to-indigo-950/40 border border-violet-500/30 flex flex-col items-center justify-center text-center gap-2">
                <div className="relative w-28 h-28 rounded-full border-4 border-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <span className="text-4xl font-black text-white">{jobState?.quality_score?.overall_score || 94}</span>
                  <span className="text-xs text-zinc-400 absolute bottom-3">/100</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-2">
                  Quality Audit Passed
                </span>
                <p className="text-[11px] text-zinc-400 max-w-xs">
                  {jobState?.quality_score?.feedback}
                </p>
              </div>

              <div className="md:col-span-8 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Visual Quality & Clarity</span>
                    <strong className="text-emerald-400">{jobState?.quality_score?.video_quality}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${jobState?.quality_score?.video_quality}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Caption Timestamp Sync</span>
                    <strong className="text-emerald-400">{jobState?.quality_score?.caption_timing}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${jobState?.quality_score?.caption_timing}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Audio Level Balancing</span>
                    <strong className="text-emerald-400">{jobState?.quality_score?.audio_levels}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${jobState?.quality_score?.audio_levels}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Brand Safety & Compliance</span>
                    <strong className="text-emerald-400">{jobState?.quality_score?.brand_compliance}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${jobState?.quality_score?.brand_compliance}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Self-Hosted Deployment & Scaling Guide ── */}
          {activeTab === "deployment" && (
            <div className="flex flex-col gap-6">
              {/* Architecture Overview Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-cyan-950/20 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Zero Cloud API Lock-in
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Personal & Workstation Topology
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    Self-Hosted Deployment Architecture & 5-Layer Stack
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-3xl">
                    Run the complete video generation engine on a single consumer or workstation GPU (RTX 3090/4090). Containers isolate the web layer, database, and message queue, while Ollama and ComfyUI run directly on host GPU hardware for bare-metal CUDA performance.
                  </p>
                </div>
              </div>

              {/* Topology Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-400">Web & API Gateway</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300">Docker</span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-300 space-y-1">
                    <div>&bull; Next.js 15: Port 3000</div>
                    <div>&bull; FastAPI: Port 8000</div>
                    <div>&bull; Nginx Reverse Proxy: Port 80/443</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Storage & Database</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">Docker</span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-300 space-y-1">
                    <div>&bull; PostgreSQL 16: Port 5432</div>
                    <div>&bull; Redis 7 (Queue): Port 6379</div>
                    <div>&bull; MinIO (S3 API): Port 9000</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Local AI Brains</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">GPU Native</span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-300 space-y-1">
                    <div>&bull; Ollama (Llama 3 / Qwen): 11434</div>
                    <div>&bull; ComfyUI (FLUX / LTX): 8188</div>
                    <div>&bull; Piper TTS (Voiceover): 5000</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Hardware Render Farm</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">NVENC</span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-300 space-y-1">
                    <div>&bull; FFmpeg 7 Hardware Transcode</div>
                    <div>&bull; Multi-Track Speech Ducking</div>
                    <div>&bull; NVMe Scratch Disk Cache</div>
                  </div>
                </div>
              </div>

              {/* 10 Golden Rules & Scaling Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-violet-400" />
                    Top Performance Optimization Levers
                  </h4>
                  <ul className="text-xs text-zinc-400 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Scene-Level Parallelism:</strong> Never generate 30s monoliths. Split into 4 parallel scene tasks to maximize GPU worker utilization.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Storyboard Pre-Visualization:</strong> Validate 512px keyframes first. Poor storyboards regenerate in seconds before expensive video diffusion begins.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>NVENC GPU Encoding:</strong> Use <code className="text-violet-300">h264_nvenc</code> hardware acceleration instead of CPU <code className="text-zinc-300">libx264</code> for 10x faster export rendering.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Asset & Prompt Caching:</strong> Hash prompts to instantly reuse scene breakdowns, character reference loras, and voice audio clips.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    Quick Deployment Commands
                  </h4>
                  <div className="bg-black/60 rounded-lg p-3 font-mono text-[11px] text-emerald-400 space-y-2 border border-white/5 overflow-x-auto">
                    <div># 1. Start Docker Infrastructure</div>
                    <div className="text-zinc-300">docker compose up -d postgres redis minio</div>
                    <div># 2. Start GPU Brains (Ollama & ComfyUI)</div>
                    <div className="text-zinc-300">ollama run llama3 &amp;&amp; python ComfyUI/main.py --listen</div>
                    <div># 3. Start Backend & Workers</div>
                    <div className="text-zinc-300">uvicorn main:app --reload &amp;&amp; python -m arq workers.job_queue</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 10: Checkpoints & Recovery ── */}
          {activeTab === "checkpoint" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* Header & Concept */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/20 to-transparent border border-violet-500/30">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-violet-400" />
                      DAG Checkpointing &amp; State Recovery Engine
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Zero Compute Waste
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 max-w-3xl">
                    Saves execution state at every significant stage (workflow, scene, and shot granularity) so the system resumes from the last successful milestone instead of restarting from scratch.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSimulatedFailureNode(simulatedFailureNode ? null : "stage_16_ffmpeg_render");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                      simulatedFailureNode
                        ? "bg-red-500/20 border-red-500/50 text-red-300"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300"
                    }`}
                  >
                    {simulatedFailureNode ? "⚠️ Simulated Failure Active (Render ❌)" : "Simulate Worker Failure"}
                  </button>

                  {simulatedFailureNode && (
                    <button
                      onClick={() => {
                        setIsResumingCheckpoint(true);
                        setTimeout(() => {
                          setSimulatedFailureNode(null);
                          setIsResumingCheckpoint(false);
                        }, 1200);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5"
                    >
                      {isResumingCheckpoint ? "Resuming from Checkpoint..." : "Resume from Checkpoint ⚡"}
                    </button>
                  )}
                </div>
              </div>

              {/* Time & Compute Savings Comparison Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Without Checkpointing</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">Fragile &amp; Costly</span>
                  </div>
                  <div className="text-xs text-zinc-300 space-y-1 font-mono text-[11px]">
                    <div>Prompt (5s) ✅ ──&gt; Script (10s) ✅ ──&gt; Scene Plan (15s) ✅</div>
                    <div>Storyboards (60s) ✅ ──&gt; Video Gen (300s) ✅</div>
                    <div className="text-red-400 font-bold">&gt; FFmpeg Render (120s) ❌ FAILED at 500s</div>
                    <div className="text-red-300 pt-1"><strong>Penalty:</strong> Restart from 0s. 510 seconds and GPU compute wasted.</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">With Viewmax Checkpointing</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Resilient Milestone Recovery</span>
                  </div>
                  <div className="text-xs text-zinc-300 space-y-1 font-mono text-[11px]">
                    <div className="text-emerald-400 font-bold">&gt; Checkpoint Engine: Nodes 1-8 COMPLETED (Cache Hit)</div>
                    <div className="text-zinc-400">Skip prompt, script, scene plan, storyboards, videos, audio.</div>
                    <div className="text-emerald-300 font-bold">&gt; Resume directly at Stage 16 (Render)</div>
                    <div className="text-emerald-400 pt-1"><strong>Savings:</strong> 390 seconds saved. Only 120s redone.</div>
                  </div>
                </div>
              </div>

              {/* Checkpoint Table */}
              <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-violet-400" />
                    Live Checkpoint Registry (workflow_nodes)
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <span className="font-mono text-zinc-400">Workflow ID: <code className="text-violet-300">wf_protein_ad_9921</code></span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                        <th className="pb-2 font-medium">Node ID</th>
                        <th className="pb-2 font-medium">Stage Label</th>
                        <th className="pb-2 font-medium">Granularity</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Output Snapshot</th>
                        <th className="pb-2 font-medium">Attempts</th>
                        <th className="pb-2 font-medium">Cache Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                      {[
                        { id: "stage_04_enhancer", name: "Prompt Enhancement", gran: "workflow", status: "completed", out: "enhanced_prompt_v2.json", attempts: 1 },
                        { id: "stage_06_script", name: "Marketing Script", gran: "workflow", status: "completed", out: "script_hook_problem_cta.json", attempts: 1 },
                        { id: "stage_07_scene_planner", name: "Scene Director", gran: "workflow", status: "completed", out: "4_scene_timeline_plan.json", attempts: 1 },
                        { id: "char_hero_01", name: "Character Consistency", gran: "asset", status: "completed", out: "hero_athlete_ipadapter.bin", attempts: 1 },
                        { id: "scene_1_storyboard", name: "Scene 1 Keyframe", gran: "scene", status: "completed", out: "s3://viewmax/storyboards/scene_1.png", attempts: 1 },
                        { id: "scene_2_storyboard", name: "Scene 2 Keyframe", gran: "scene", status: "completed", out: "s3://viewmax/storyboards/scene_2.png", attempts: 1 },
                        { id: "scene_1_video", name: "Scene 1 Video Clip", gran: "scene", status: "completed", out: "s3://viewmax/clips/scene_1.mp4", attempts: 1 },
                        { id: "scene_2_video", name: "Scene 2 Video Clip", gran: "scene", status: "completed", out: "s3://viewmax/clips/scene_2.mp4", attempts: 1 },
                        { id: "stage_11_voiceover", name: "Voiceover Synthesis", gran: "workflow", status: "completed", out: "s3://viewmax/audio/elevenlabs_narration.wav", attempts: 1 },
                        {
                          id: "stage_16_ffmpeg_render",
                          name: "FFmpeg Render Farm",
                          gran: "workflow",
                          status: simulatedFailureNode ? "failed" : "completed",
                          out: simulatedFailureNode ? "error: worker-gpu-04 timeout" : "s3://viewmax/renders/final_export_1080x1920.mp4",
                          attempts: simulatedFailureNode ? 2 : 1
                        },
                      ].map((cp) => (
                        <tr key={cp.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 text-zinc-400 text-[10px]">{cp.id}</td>
                          <td className="py-2.5 text-zinc-200 font-sans font-medium">{cp.name}</td>
                          <td className="py-2.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-zinc-400">
                              {cp.gran}
                            </span>
                          </td>
                          <td className="py-2.5">
                            {cp.status === "completed" ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                COMPLETED ✅
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
                                FAILED ❌
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-zinc-400 text-[10px] max-w-xs truncate">{cp.out}</td>
                          <td className="py-2.5 text-zinc-300">{cp.attempts} / 3</td>
                          <td className="py-2.5">
                            {cp.status === "completed" ? (
                              <span className="text-zinc-500 text-[10px]">Skipped (Cache Hit)</span>
                            ) : (
                              <span className="text-amber-400 text-[10px] font-bold">Resume Target 🎯</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Granularity & Architecture Deep Dive */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                  <span className="text-xs font-bold text-violet-400">Scene &amp; Shot Level Granularity</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Instead of checkpointing only monolithic projects, Viewmax saves progress per scene and shot. If Scene 3 Tracking Shot fails, only that single clip re-renders.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                  <span className="text-xs font-bold text-cyan-400">Human-in-the-Loop Gates</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Set checkpoints to <code className="text-cyan-300">awaiting_approval</code> at the storyboard stage. Creators can inspect keyframes and approve before expensive video generation triggers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
                  <span className="text-xs font-bold text-amber-400">Temporal State Replay</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Modeled after Temporal event history semantics: if an entire GPU workstation or API fails, a replacement worker reloads state from Redis/PostgreSQL and resumes seamlessly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
