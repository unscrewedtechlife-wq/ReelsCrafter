"use client";

import React, { useState } from "react";
import { Film, Cpu, Sliders, Download, Play, Sparkles, ChevronDown } from "lucide-react";

const VIDEO_MODELS = [
  { id: "veo3", name: "Veo 3", provider: "Google", badge: "Best Quality", available: true },
  { id: "runway-gen3", name: "Runway Gen-3", provider: "Runway", badge: "Fast", available: true },
  { id: "kling-2", name: "Kling 2.0", provider: "Kuaishou", badge: "Consistent", available: true },
  { id: "luma-dream", name: "Luma Dream Machine", provider: "Luma AI", badge: "Creative", available: true },
  { id: "hailuo", name: "Hailuo MiniMax", provider: "MiniMax", badge: "Free Tier", available: true },
  { id: "comfyui-svd", name: "SVD (ComfyUI)", provider: "Self-Hosted", badge: "Local", available: true },
];

const ASPECT_RATIOS = ["9:16", "16:9", "1:1", "4:5"];
const DURATIONS = [3, 5, 8, 10, 15, 20, 30];

export default function VideoStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("veo3");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [duration, setDuration] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 8;
      });
    }, 400);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGenerating(false);
    }, 8000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Video Studio</h1>
          <p className="text-zinc-500 text-sm">Generate AI video clips from text prompts</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Prompt & controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <label htmlFor="video-prompt" className="block text-sm font-medium text-zinc-300 mb-2">Video Prompt</label>
            <textarea
              id="video-prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic slow-motion pour of liquid chocolate into a sleek glass, dramatic rim lighting, 4K macro photography, photorealistic..."
              className="w-full bg-transparent text-white placeholder-zinc-600 text-sm resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
              <span className="text-xs text-zinc-600">{prompt.length} characters</span>
              <button
                id="video-enhance-prompt"
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Enhance
              </button>
            </div>
          </div>

          {/* Model selector */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="text-sm font-medium text-zinc-300 mb-3">Model</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {VIDEO_MODELS.map((model) => (
                <button
                  key={model.id}
                  id={`video-model-${model.id}`}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedModel === model.id
                      ? "border-violet-500/50 bg-violet-500/10 text-white"
                      : "border-white/8 hover:border-white/15 text-zinc-400"
                  }`}
                >
                  <div className="text-xs font-semibold mb-0.5">{model.name}</div>
                  <div className="text-[10px] text-zinc-600">{model.provider}</div>
                  {model.badge && (
                    <div className="mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400 inline-block">
                      {model.badge}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings panel */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Sliders className="w-4 h-4" />
              Settings
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-1.5">
                {ASPECT_RATIOS.map((r) => (
                  <button
                    key={r}
                    id={`video-ratio-${r.replace(":", "x")}`}
                    onClick={() => setAspectRatio(r)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                      aspectRatio === r
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                        : "border-white/8 text-zinc-500 hover:border-white/15"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-2">Duration</label>
              <div className="relative">
                <select
                  id="video-duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 cursor-pointer"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d} className="bg-[#0d0d12]">{d}s</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <div className="text-emerald-300 font-medium">NVENC Active</div>
                <div className="text-zinc-500">Hardware acceleration</div>
              </div>
            </div>
          </div>

          <button
            id="video-generate-btn"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-fuchsia-500/20"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating… {Math.round(progress)}%
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Generate Video
              </>
            )}
          </button>

          {generating && (
            <div className="w-full h-1.5 rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Output area (placeholder) */}
      {progress === 100 && (
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Generation Complete
            </div>
            <button id="video-download-btn" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
          <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Film className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
              <div className="text-sm text-zinc-500">Video preview would appear here</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
