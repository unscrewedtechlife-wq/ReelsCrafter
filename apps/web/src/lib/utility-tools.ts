import {
  Captions,
  Download,
  FileEdit,
  FolderOpen,
  ImagePlus,
  Library,
  Mic2,
  Music2,
  PenLine,
  Scissors,
  Sparkles,
  Wand2,
} from "lucide-react";

export const UTILITY_TOOLS = [
  { slug: "auto-captions", label: "Auto Captions", description: "Turn a script into timed caption cues.", icon: Captions, color: "from-blue-500 to-indigo-500", kind: "captions" },
  { slug: "caption-remover", label: "Caption Remover", description: "Prepare a clean source clip for a new caption pass.", icon: Scissors, color: "from-emerald-500 to-green-500", kind: "media" },
  { slug: "prompt-library", label: "Prompt Library", description: "Save and reuse production-ready prompts.", icon: Library, color: "from-pink-500 to-rose-500", kind: "library" },
  { slug: "ai-voiceover", label: "AI Voiceover", description: "Send narration copy to the voice pipeline.", icon: Mic2, color: "from-pink-500 to-fuchsia-500", kind: "pipeline" },
  { slug: "scriptwriter", label: "Scriptwriter", description: "Generate Hook, Problem, Solution, and CTA copy.", icon: PenLine, color: "from-blue-500 to-cyan-500", kind: "pipeline" },
  { slug: "ai-clone", label: "AI Clone", description: "Create a consistent creator-style video brief.", icon: Wand2, color: "from-pink-500 to-purple-500", kind: "pipeline" },
  { slug: "downloader", label: "Downloader", description: "Validate a media URL before adding it to your workspace.", icon: Download, color: "from-emerald-500 to-teal-500", kind: "media" },
  { slug: "voice-changer", label: "Voice Changer", description: "Prepare a voice transformation request.", icon: Music2, color: "from-emerald-500 to-green-500", kind: "pipeline" },
  { slug: "video-editor", label: "Video Editor", description: "Open the full timeline and render workspace.", icon: FileEdit, color: "from-blue-500 to-indigo-500", kind: "link" },
  { slug: "video-ideation", label: "Video Ideation", description: "Turn a rough concept into a production brief.", icon: Sparkles, color: "from-orange-500 to-amber-500", kind: "pipeline" },
  { slug: "ai-story-video", label: "AI Story Video", description: "Generate a scene-led story video from one idea.", icon: ImagePlus, color: "from-blue-500 to-cyan-500", kind: "pipeline" },
  { slug: "story-template", label: "Story Template", description: "Start from a reusable narrative structure.", icon: FolderOpen, color: "from-orange-500 to-amber-500", kind: "library" },
] as const;

export type UtilityTool = (typeof UTILITY_TOOLS)[number];

export function getUtilityTool(slug: string) {
  return UTILITY_TOOLS.find((tool) => tool.slug === slug);
}
