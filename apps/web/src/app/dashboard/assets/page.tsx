"use client";

import React, { useState } from "react";
import { FolderOpen, Film, Image, Mic, Search, Filter, Download, Trash2, Grid3X3, List } from "lucide-react";

type AssetType = "all" | "video" | "image" | "audio";

const MOCK_ASSETS = [
  { id: "a1", name: "protein_shake_tiktok_final.mp4", type: "video", size: "18.4 MB", date: "2 mins ago", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop" },
  { id: "a2", name: "gym_scene_keyframe_01.png", type: "image", size: "2.1 MB", date: "5 mins ago", thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop" },
  { id: "a3", name: "sarah_energetic_voiceover.mp3", type: "audio", size: "4.7 MB", date: "5 mins ago", thumbnail: null },
  { id: "a4", name: "luxury_watch_reel_1080p.mp4", type: "video", size: "22.1 MB", date: "18 mins ago", thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop" },
  { id: "a5", name: "product_hero_shot.png", type: "image", size: "3.8 MB", date: "1 hour ago", thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop" },
  { id: "a6", name: "cta_scene_final.mp4", type: "video", size: "9.2 MB", date: "1 hour ago", thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop" },
];

const ICON_MAP: Record<string, React.ComponentType<{className?: string}>> = {
  video: Film,
  image: Image,
  audio: Mic,
};

export default function AssetsPage() {
  const [filter, setFilter] = useState<AssetType>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ASSETS.filter((a) => {
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <FolderOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Assets</h1>
          <p className="text-zinc-500 text-sm">All generated videos, images, and audio files</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="assets-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          {(["all", "video", "image", "audio"] as AssetType[]).map((t) => (
            <button
              key={t}
              id={`assets-filter-${t}`}
              onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                filter === t
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                  : "border-white/8 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}

          <div className="flex items-center border border-white/8 rounded-lg overflow-hidden">
            <button
              id="assets-view-grid"
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              id="assets-view-list"
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-xs text-zinc-500">{filtered.length} asset{filtered.length !== 1 ? "s" : ""}</div>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((asset) => {
            const Icon = ICON_MAP[asset.type] || FolderOpen;
            return (
              <div key={asset.id} className="group glass-panel rounded-xl border border-white/8 overflow-hidden hover:border-white/15 transition-all">
                <div className="aspect-video bg-white/5 relative">
                  {asset.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-zinc-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Download className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-medium text-white truncate">{asset.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-zinc-600">{asset.size}</span>
                    <span className="text-[10px] text-zinc-600">{asset.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((asset) => {
            const Icon = ICON_MAP[asset.type] || FolderOpen;
            return (
              <div key={asset.id} className="flex items-center gap-4 glass-panel rounded-xl p-4 border border-white/8 hover:border-white/12 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{asset.name}</div>
                  <div className="text-xs text-zinc-600 mt-0.5 capitalize">{asset.type} · {asset.size}</div>
                </div>
                <div className="text-xs text-zinc-600 hidden sm:block">{asset.date}</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"><Download className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
