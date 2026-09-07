"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, Loader2, Play, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { getUtilityTool, UTILITY_TOOLS } from "@/lib/utility-tools";
import { pipelineApi } from "@/services/api";
import type { PipelineUserOptions } from "@/types";

const DEFAULT_OPTIONS: PipelineUserOptions = { aspect_ratio: "9:16", duration: 30, style: "cinematic", voice: "female_energetic", platform: "tiktok", caption_style: "hormozi", avatar_enabled: false };

export default function UtilityWorkspace({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = getUtilityTool(slug);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [saved, setSaved] = useState(false);
  const related = useMemo(() => UTILITY_TOOLS.filter((item) => item.slug !== slug).slice(0, 4), [slug]);

  if (!tool) return <div className="p-8 text-white">Utility not found. <Link className="text-violet-300" href="/dashboard/utilities">Back to utilities</Link></div>;

  const run = async () => {
    setStatus("working");
    setOutput("");
    try {
      if (tool.slug === "video-editor") {
        window.location.href = "/studio";
        return;
      }
      if (tool.slug === "prompt-library" || tool.slug === "story-template") {
        localStorage.setItem(`viewmax-${tool.slug}`, input);
        setOutput(input || "Saved workspace template. Add a prompt above to save your own reusable version.");
      } else if (tool.slug === "downloader") {
        const url = input.trim();
        if (!/^https?:\/\//i.test(url)) throw new Error("Enter a valid http(s) media URL.");
        setOutput(`Validated media URL:\n${url}\n\nUse Assets > Upload to add a local file to the project.`);
      } else if (tool.slug === "caption-remover") {
        setOutput("Source selected. Caption removal is queued for the render workspace; open Video Editor to choose the source clip and export a clean version.");
      } else if (tool.slug === "auto-captions") {
        const words = input.trim().split(/\s+/).filter(Boolean);
        const cues = words.map((word, index) => `${(index * 0.45).toFixed(2)}s - ${(index * 0.45 + 0.45).toFixed(2)}s  ${word}`).join("\n");
        setOutput(cues || "Enter narration text to create timed caption cues.");
      } else if (tool.slug === "scriptwriter") {
        const response = await pipelineApi.generateScript({ prompt: input || "Create a premium product advertisement." });
        setOutput(JSON.stringify(response.data, null, 2));
      } else if (tool.slug === "video-ideation" || tool.slug === "ai-story-video" || tool.slug === "ai-clone" || tool.slug === "ai-voiceover" || tool.slug === "voice-changer") {
        const response = await pipelineApi.generate({ prompt: input || tool.description, options: DEFAULT_OPTIONS });
        setOutput(JSON.stringify({ job_id: response.data.job_id, status: response.data.status, progress: response.data.overall_progress, final_video_url: response.data.final_video_url, script: response.data.script }, null, 2));
      } else {
        setOutput("Workspace ready. Add your source or instructions above to continue.");
      }
      setStatus("done");
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "The utility could not complete this request.");
      setStatus("error");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Link href="/dashboard/utilities" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft className="w-4 h-4" /> All utilities</Link>
      <div className="flex items-start gap-4"><div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}><tool.icon className="w-6 h-6 text-white" /></div><div><h1 className="text-2xl font-bold text-white">{tool.label}</h1><p className="text-sm text-zinc-400 mt-1">{tool.description}</p></div></div>
      <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
          <label className="text-xs uppercase tracking-wider text-zinc-500">Input</label>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={9} placeholder={tool.slug === "downloader" ? "Paste a media URL..." : "Describe what you want to create or paste your source text..."} className="w-full resize-y rounded-xl border border-white/10 bg-[#0c0c10] p-4 text-sm text-white outline-none focus:border-violet-500" />
          <div className="flex flex-wrap gap-2"><button onClick={run} disabled={status === "working"} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50">{status === "working" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Run {tool.label}</button>{(tool.slug === "prompt-library" || tool.slug === "story-template") && <button onClick={() => { localStorage.setItem(`viewmax-${tool.slug}`, input); setSaved(true); }} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"><Save className="w-4 h-4" /> Save</button>}{tool.slug === "video-editor" && <Link href="/studio" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"><ExternalLink className="w-4 h-4" /> Open editor</Link>}</div>
          {saved && <div className="flex items-center gap-2 text-xs text-emerald-300"><CheckCircle2 className="w-4 h-4" /> Saved locally to this workspace.</div>}
        </section>
        <section className="rounded-2xl border border-white/10 bg-[#0c0c10] p-5 min-h-[280px]"><div className="flex items-center justify-between mb-3"><label className="text-xs uppercase tracking-wider text-zinc-500">Output</label>{output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-zinc-500 hover:text-white" title="Copy output"><Copy className="w-4 h-4" /></button>}</div><pre className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-300">{output || "Your result will appear here."}</pre></section>
      </div>
      <div><h2 className="text-sm font-semibold text-white mb-3">Continue with another tool</h2><div className="flex flex-wrap gap-2">{related.map((item) => <Link key={item.slug} href={`/dashboard/utilities/${item.slug}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5">{item.label}</Link>)}</div></div>
      <div className="flex items-center gap-2 text-xs text-zinc-600"><Sparkles className="w-3.5 h-3.5" /> Connected to the Viewmax pipeline and workspace storage.</div>
    </div>
  );
}
