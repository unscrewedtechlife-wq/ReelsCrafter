"use client";

import React, { useState } from "react";
import { Megaphone, Sparkles, Target } from "lucide-react";

const AD_FORMATS = [
  { id: "tiktok_ugc", label: "TikTok UGC Ad", description: "Authentic creator-style content" },
  { id: "facebook_video", label: "Facebook Video Ad", description: "16:9 with captions & hook" },
  { id: "instagram_story", label: "Instagram Story Ad", description: "9:16 full-screen interactive" },
  { id: "youtube_pre", label: "YouTube Pre-Roll", description: "15–30s non-skippable" },
];

const OBJECTIVES = ["Brand Awareness", "Product Launch", "Lead Generation", "Sales Conversion", "App Install", "Event Promotion"];

export default function MarketingStudioPage() {
  const [format, setFormat] = useState("tiktok_ugc");
  const [objective, setObjective] = useState("Sales Conversion");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [generating, setGenerating] = useState(false);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Marketing Studio</h1>
          <p className="text-zinc-500 text-sm">AI ad creatives optimized for conversion</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          {/* Product info */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8 space-y-4">
            <div className="text-sm font-medium text-zinc-300">Product / Offer</div>
            <div>
              <label htmlFor="marketing-product" className="text-xs text-zinc-500 mb-1.5 block">Product Name & Description</label>
              <textarea
                id="marketing-product"
                rows={3}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. UltraShake Pro — ultra-filtered whey protein isolate, 30g protein per serving, zero clumps, chocolate gelato flavor..."
                className="w-full bg-transparent text-white placeholder-zinc-600 text-sm resize-none focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="marketing-audience" className="text-xs text-zinc-500 mb-1.5 block">Target Audience</label>
              <input
                id="marketing-audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Gym-goers 25-35, fitness enthusiasts, protein supplement buyers..."
                className="w-full bg-transparent text-white placeholder-zinc-600 text-sm focus:outline-none border-b border-white/8 pb-2"
              />
            </div>
          </div>

          {/* Campaign objective */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
              <Target className="w-4 h-4 text-amber-400" />
              Campaign Objective
            </div>
            <div className="flex flex-wrap gap-2">
              {OBJECTIVES.map((o) => (
                <button
                  key={o}
                  id={`marketing-objective-${o.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setObjective(o)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    objective === o
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                      : "border-white/8 text-zinc-500 hover:border-white/15"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <button
            id="marketing-generate-btn"
            onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 7000); }}
            disabled={!product.trim() || generating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm text-[#09090b] shadow-lg shadow-amber-500/20"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Generating Ad Creative…</>
            ) : (
              <><Sparkles className="w-4 h-4" />Generate Ad Campaign</>
            )}
          </button>
        </div>

        {/* Format selector */}
        <div className="glass-panel rounded-2xl p-5 border border-white/8">
          <div className="text-sm font-medium text-zinc-300 mb-4">Ad Format</div>
          <div className="space-y-2.5">
            {AD_FORMATS.map((f) => (
              <button
                key={f.id}
                id={`marketing-format-${f.id}`}
                onClick={() => setFormat(f.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  format === f.id
                    ? "border-amber-500/50 bg-amber-500/8 text-white"
                    : "border-white/8 hover:border-white/15 text-zinc-400"
                }`}
              >
                <div className={`w-3 h-3 rounded-full border mt-0.5 flex-shrink-0 ${format === f.id ? "border-amber-400 bg-amber-400" : "border-zinc-600"}`} />
                <div>
                  <div className="text-sm font-semibold">{f.label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{f.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-violet-500/8 border border-violet-500/15">
            <div className="text-xs font-medium text-violet-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Copywriter
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The pipeline will automatically generate Hook + Problem + Solution + CTA copy optimized for {objective.toLowerCase()} on the selected format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
