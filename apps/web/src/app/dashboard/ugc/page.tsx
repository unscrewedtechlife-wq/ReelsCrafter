"use client";

import React, { useState } from "react";
import { Users2, Mic, Play, Sparkles } from "lucide-react";

const AVATARS = [
  { id: "maya", name: "Maya Lin", style: "Fitness Influencer", gender: "female", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop" },
  { id: "alex", name: "Alex Chen", style: "Tech Reviewer", gender: "male", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { id: "sophie", name: "Sophie M.", style: "Lifestyle Creator", gender: "female", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
  { id: "james", name: "James K.", style: "Business Coach", gender: "male", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
];

const VOICES = [
  { id: "sarah-energetic", label: "Sarah — Energetic UGC", type: "Female" },
  { id: "emma-casual", label: "Emma — Casual Lifestyle", type: "Female" },
  { id: "mike-hype", label: "Mike — Hype Energy", type: "Male" },
  { id: "david-authoritative", label: "David — Authoritative", type: "Male" },
];

export default function UGCStudioPage() {
  const [selectedAvatar, setSelectedAvatar] = useState("maya");
  const [selectedVoice, setSelectedVoice] = useState("sarah-energetic");
  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Users2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">UGC Studio</h1>
          <p className="text-zinc-500 text-sm">AI avatar generation with Wav2Lip facial sync</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Avatar selector */}
        <div className="glass-panel rounded-2xl p-5 border border-white/8">
          <div className="text-sm font-medium text-zinc-300 mb-4">Select Avatar</div>
          <div className="grid grid-cols-2 gap-3">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                id={`ugc-avatar-${avatar.id}`}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`rounded-xl border overflow-hidden transition-all ${
                  selectedAvatar === avatar.id
                    ? "border-emerald-500/50 ring-1 ring-emerald-500/30"
                    : "border-white/8 hover:border-white/15"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar.image} alt={avatar.name} className="w-full aspect-square object-cover" />
                <div className="p-2 text-left">
                  <div className="text-xs font-semibold text-white">{avatar.name}</div>
                  <div className="text-[10px] text-zinc-500">{avatar.style}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Script & Voice */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
              <Mic className="w-4 h-4" />
              Voice
            </div>
            <div className="space-y-1.5">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  id={`ugc-voice-${v.id}`}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                    selectedVoice === v.id
                      ? "border-emerald-500/50 bg-emerald-500/8 text-white"
                      : "border-white/8 text-zinc-400 hover:border-white/15"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-zinc-500">
                    {v.type[0]}
                  </div>
                  <span className="text-xs">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-zinc-300">Script</div>
              <button className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                AI Script
              </button>
            </div>
            <textarea
              id="ugc-script"
              rows={5}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter your UGC script here... The avatar will read this with perfect lip sync."
              className="w-full bg-transparent text-white placeholder-zinc-600 text-sm resize-none focus:outline-none leading-relaxed"
            />
          </div>

          <button
            id="ugc-generate-btn"
            onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 5000); }}
            disabled={!script.trim() || generating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-emerald-500/20"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating Avatar Video…</>
            ) : (
              <><Play className="w-4 h-4" />Generate UGC Video</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
