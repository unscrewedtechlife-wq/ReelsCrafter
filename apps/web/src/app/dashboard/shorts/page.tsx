"use client";

import React, { useState } from "react";
import { Youtube, Sparkles, Play } from "lucide-react";

const PLATFORMS = [
  { id: "youtube_shorts", label: "YouTube Shorts", ratio: "9:16", max: 60 },
  { id: "tiktok", label: "TikTok", ratio: "9:16", max: 60 },
  { id: "instagram_reels", label: "Instagram Reels", ratio: "9:16", max: 90 },
];

const HOOK_TEMPLATES = [
  "Wait until you see what happened when...",
  "I tried [X] for 30 days and here's what...",
  "Nobody is talking about this, but...",
  "Stop scrolling — this will change how you...",
  "POV: You just discovered the easiest way to...",
];

export default function ShortsStudioPage() {
  const [platform, setPlatform] = useState("youtube_shorts");
  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [duration, setDuration] = useState(30);
  const [generating, setGenerating] = useState(false);

  const selectedPlatform = PLATFORMS.find((p) => p.id === platform)!;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Shorts Studio</h1>
          <p className="text-zinc-500 text-sm">Optimized for YouTube Shorts, TikTok & Reels</p>
        </div>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            id={`shorts-platform-${p.id}`}
            onClick={() => setPlatform(p.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              platform === p.id
                ? "border-red-500/50 bg-red-500/10 text-red-300"
                : "border-white/8 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          {/* Topic */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="shorts-topic" className="text-sm font-medium text-zinc-300">Topic / Niche</label>
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{selectedPlatform.ratio} · {duration}s</span>
            </div>
            <textarea
              id="shorts-topic"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Morning productivity routine for entrepreneurs, gym motivation, healthy meal prep..."
              className="w-full bg-transparent text-white placeholder-zinc-600 text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Hook templates */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-zinc-300">Opening Hook</div>
              <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                AI Hook
              </button>
            </div>
            <div className="space-y-2 mb-3">
              {HOOK_TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setHook(t)}
                  className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all ${
                    hook === t
                      ? "border-red-500/40 bg-red-500/8 text-red-200"
                      : "border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="text-xs text-zinc-500 mb-2">Duration: {duration}s (max {selectedPlatform.max}s)</div>
            <input
              id="shorts-duration"
              type="range"
              min={15}
              max={selectedPlatform.max}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
              <span>15s</span><span>{selectedPlatform.max}s</span>
            </div>
          </div>

          <button
            id="shorts-generate-btn"
            onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 6000); }}
            disabled={!topic.trim() || generating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-red-500/20"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating Short…</>
            ) : (
              <><Play className="w-4 h-4" />Generate Short</>
            )}
          </button>
        </div>

        {/* Preview mockup */}
        <div className="flex justify-center">
          <div className="relative w-48">
            <div className="aspect-[9/16] bg-[#0d0d12] rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
              <div className="text-center p-4">
                <Youtube className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <div className="text-xs text-zinc-600">9:16 Preview</div>
                <div className="text-xs text-zinc-700 mt-1">{duration}s · {selectedPlatform.label}</div>
              </div>
            </div>
            <div className="absolute -bottom-4 inset-x-0 flex justify-center">
              <div className="text-[10px] text-zinc-600 bg-[#09090b] px-2">Phone Preview</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
