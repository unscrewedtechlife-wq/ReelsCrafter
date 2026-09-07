"use client";

import React, { useState } from "react";
import { FileVideo, Search, Tag, Star, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "TikTok Ads", "YouTube Shorts", "UGC", "Cinematic", "Product", "E-Commerce", "SaaS"];

const TEMPLATES = [
  {
    id: "t1",
    title: "High-Converting Protein Shake Ad",
    category: "TikTok Ads",
    tags: ["UGC", "fitness", "hook-problem-solution"],
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop",
    uses: 2847,
    featured: true,
    duration: "30s",
  },
  {
    id: "t2",
    title: "Luxury Product Reveal Cinematic",
    category: "Cinematic",
    tags: ["luxury", "reveal", "macro"],
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    uses: 1234,
    featured: true,
    duration: "30s",
  },
  {
    id: "t3",
    title: "Viral Hook Short (AI SaaS)",
    category: "YouTube Shorts",
    tags: ["viral", "hook", "tech", "saas"],
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
    uses: 982,
    featured: false,
    duration: "30s",
  },
  {
    id: "t4",
    title: "Authentic UGC Unboxing Review",
    category: "UGC",
    tags: ["unboxing", "review", "authentic"],
    thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop",
    uses: 756,
    featured: false,
    duration: "45s",
  },
  {
    id: "t5",
    title: "E-Commerce Product Launch",
    category: "E-Commerce",
    tags: ["product", "launch", "discount", "cta"],
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    uses: 1891,
    featured: false,
    duration: "30s",
  },
  {
    id: "t6",
    title: "SaaS Demo Explainer",
    category: "SaaS",
    tags: ["saas", "demo", "screen-recording"],
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop",
    uses: 445,
    featured: false,
    duration: "60s",
  },
];

export default function TemplatesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    if (category !== "All" && t.category !== category) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.tags.some((tag) => tag.includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <FileVideo className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Templates</h1>
          <p className="text-zinc-500 text-sm">Pre-built AI pipeline configurations for every use case</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          id="templates-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-pink-500/50"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`template-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              category === cat
                ? "border-pink-500/50 bg-pink-500/10 text-pink-300"
                : "border-white/8 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured row */}
      {category === "All" && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-white">Featured Templates</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {TEMPLATES.filter((t) => t.featured).map((template) => (
              <div key={template.id} className="glass-panel rounded-2xl border border-amber-500/20 overflow-hidden hover:border-amber-500/35 transition-all group">
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Featured</span>
                    <span className="text-xs text-zinc-600">{template.duration}</span>
                  </div>
                  <div className="font-semibold text-white mb-1">{template.title}</div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600">{template.uses.toLocaleString()} uses</span>
                    <button id={`template-use-${template.id}`} className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                      Use Template <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All templates grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.filter((t) => category !== "All" || !t.featured).map((template) => (
          <div key={template.id} className="glass-panel rounded-xl border border-white/8 overflow-hidden hover:border-white/15 transition-all group">
            <div className="aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{template.category}</span>
                <span className="text-[10px] text-zinc-600">{template.duration}</span>
              </div>
              <div className="font-semibold text-white text-sm mb-2">{template.title}</div>
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-600">
                    <Tag className="w-2.5 h-2.5 inline mr-0.5" />{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">{template.uses.toLocaleString()} uses</span>
                <button id={`template-use-${template.id}`} className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                  Use <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
