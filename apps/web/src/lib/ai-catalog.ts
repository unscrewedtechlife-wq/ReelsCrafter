import { Clapperboard, Film, Image as ImageIcon, Megaphone, Scissors, Youtube } from "lucide-react";

export const MCP_AGENTS = [
  { slug: "marketing", label: "Marketing", description: "Generates automated marketing assets.", icon: Megaphone, href: "/dashboard/marketing" },
  { slug: "faceless-videos", label: "Faceless videos", description: "Creates shorts without on-camera talent.", icon: Youtube, href: "/dashboard/shorts" },
  { slug: "story-videos", label: "Story videos", description: "Builds narrative-driven video sequences.", icon: Clapperboard, href: "/dashboard/utilities/ai-story-video" },
  { slug: "video-generation", label: "Video generation", description: "Direct text-to-video creation.", icon: Film, href: "/dashboard/video" },
  { slug: "captioned-edits", label: "Captioned edits", description: "Automated video editing and captioning.", icon: Scissors, href: "/dashboard/utilities/auto-captions" },
] as const;

export const CREATIVE_TOOLS = [
  { label: "AI Video Generator", description: "Runs 3 models from a single prompt.", icon: Film, href: "/dashboard/video", accent: "from-fuchsia-500 to-pink-500" },
  { label: "Shorts Studio", description: "Offers 13 proven formats for viral content.", icon: Youtube, href: "/dashboard/shorts", accent: "from-red-500 to-orange-500" },
  { label: "AI Image Generator", description: "Generates in 10 aspect ratios, up to 4K.", icon: ImageIcon, href: "/dashboard/image", accent: "from-cyan-500 to-blue-500" },
  { label: "Marketing Studio", description: "Clones winning ads from end to end.", icon: Megaphone, href: "/dashboard/marketing", accent: "from-amber-500 to-yellow-500" },
] as const;

export const TOP_MODELS = [
  { label: "Video Seedance 2.5", type: "Video", description: "Generates up to 30s in 1080p.", href: "/dashboard/video" },
  { label: "Kling 3.0 Turbo", type: "Video", description: "Fast 1080p video generation with audio.", href: "/dashboard/video" },
  { label: "Video Veo 3.1", type: "Video", description: "High-resolution 4K video generation.", href: "/dashboard/video" },
  { label: "Video Seedance 2.0", type: "Video", description: "Animates static images into video.", href: "/dashboard/video" },
  { label: "Nano Banana Pro", type: "Image", description: "Generates photorealistic still images.", href: "/dashboard/image" },
  { label: "Gemini Omni 1.1 Flash", type: "Video + editing", description: "Handles both video generation and editing.", href: "/dashboard/video" },
  { label: "GPT Image 2", type: "Image", description: "Strictly follows long, detailed prompts.", href: "/dashboard/image" },
  { label: "Grok Imagine", type: "Video", description: "Creates stylized videos up to 15 seconds.", href: "/dashboard/video" },
] as const;
