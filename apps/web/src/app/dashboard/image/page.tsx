"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Download, Sparkles, Grid3X3, Square, LayoutTemplate } from "lucide-react";

const IMAGE_MODELS = [
  { id: "flux-pro", name: "FLUX.1 Pro", provider: "Black Forest Labs", badge: "Photorealistic" },
  { id: "flux-dev", name: "FLUX.1 Dev", provider: "Black Forest Labs (Local)", badge: "Self-Hosted" },
  { id: "sdxl", name: "SDXL Turbo", provider: "ComfyUI (Local)", badge: "Fast" },
  { id: "dall-e-3", name: "DALL·E 3", provider: "OpenAI", badge: "Creative" },
];

const STYLES = ["Photorealistic", "Cinematic", "UGC", "Product", "Editorial", "Artistic", "Minimalist", "Dark Mode"];
const SIZES = [
  { label: "9:16 Portrait", value: "1080x1920", icon: Square },
  { label: "16:9 Landscape", value: "1920x1080", icon: LayoutTemplate },
  { label: "1:1 Square", value: "1080x1080", icon: Grid3X3 },
  { label: "4:5 Feed", value: "1080x1350", icon: Square },
];

const SAMPLE_OUTPUTS = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop",
];

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("flux-pro");
  const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
  const [selectedSize, setSelectedSize] = useState("1080x1920");
  const [numImages, setNumImages] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 4000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <ImageIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Image Studio</h1>
          <p className="text-zinc-500 text-sm">FLUX / SDXL photorealistic scene generation</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Prompt */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <label htmlFor="image-prompt" className="block text-sm font-medium text-zinc-300 mb-2">Image Prompt</label>
            <textarea
              id="image-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Athletic woman in a modern gym, morning sunlight streaming through floor-to-ceiling windows, photorealistic 4K, dramatic rim lighting..."
              className="w-full bg-transparent text-white placeholder-zinc-600 text-sm resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
              <span className="text-xs text-zinc-600">{prompt.length} chars</span>
              <button id="image-enhance" className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                AI Enhance
              </button>
            </div>
          </div>

          {/* Style chips */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="text-sm font-medium text-zinc-300 mb-3">Style Preset</div>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  id={`image-style-${s.toLowerCase()}`}
                  onClick={() => setSelectedStyle(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedStyle === s
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                      : "border-white/8 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div className="glass-panel rounded-2xl p-5 border border-white/8">
            <div className="text-sm font-medium text-zinc-300 mb-3">Model</div>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_MODELS.map((m) => (
                <button
                  key={m.id}
                  id={`image-model-${m.id}`}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedModel === m.id
                      ? "border-cyan-500/50 bg-cyan-500/10 text-white"
                      : "border-white/8 hover:border-white/15 text-zinc-400"
                  }`}
                >
                  <div className="text-xs font-semibold">{m.name}</div>
                  <div className="text-[10px] text-zinc-600">{m.provider}</div>
                  <div className="mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-500 inline-block">{m.badge}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/8 space-y-4">
            <div>
              <div className="text-xs text-zinc-500 mb-2">Output Size</div>
              <div className="space-y-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    id={`image-size-${s.value}`}
                    onClick={() => setSelectedSize(s.value)}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-all ${
                      selectedSize === s.value
                        ? "border-cyan-500/50 bg-cyan-500/8 text-cyan-300"
                        : "border-white/8 text-zinc-500 hover:border-white/15"
                    }`}
                  >
                    <s.icon className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                    <span className="ml-auto text-zinc-600">{s.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-500 mb-2">Number of images: {numImages}</div>
              <input
                id="image-count"
                type="range"
                min={1}
                max={8}
                value={numImages}
                onChange={(e) => setNumImages(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          <button
            id="image-generate-btn"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-cyan-500/20"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                Generate {numImages} Image{numImages > 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output grid */}
      {generated && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              {numImages} images generated
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SAMPLE_OUTPUTS.slice(0, numImages).map((url, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden aspect-[9/16] bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
