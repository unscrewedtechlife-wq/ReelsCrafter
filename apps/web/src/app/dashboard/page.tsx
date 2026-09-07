"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Film,
  Image,
  Users2,
  Megaphone,
  Youtube,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Wrench,
  Bot,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    href: "/studio",
    label: "AI Pipeline Studio",
    description: "Full 20-stage automated video pipeline",
    icon: Sparkles,
    color: "from-violet-600 to-indigo-600",
    shadow: "shadow-violet-500/25",
    badge: "Most Used",
  },
  {
    href: "/dashboard/video",
    label: "Video Studio",
    description: "Generate AI video clips directly",
    icon: Film,
    color: "from-fuchsia-600 to-pink-600",
    shadow: "shadow-fuchsia-500/20",
    badge: null,
  },
  {
    href: "/dashboard/image",
    label: "Image Studio",
    description: "FLUX / SDXL photorealistic keyframes",
    icon: Image,
    color: "from-cyan-600 to-blue-600",
    shadow: "shadow-cyan-500/20",
    badge: null,
  },
  {
    href: "/dashboard/ugc",
    label: "UGC Studio",
    description: "AI avatar & talking head generation",
    icon: Users2,
    color: "from-emerald-600 to-teal-600",
    shadow: "shadow-emerald-500/20",
    badge: null,
  },
  {
    href: "/dashboard/shorts",
    label: "Shorts Studio",
    description: "YouTube Shorts / TikTok format",
    icon: Youtube,
    color: "from-red-600 to-orange-600",
    shadow: "shadow-red-500/20",
    badge: null,
  },
  {
    href: "/dashboard/marketing",
    label: "Marketing Studio",
    description: "Ad creatives & social campaigns",
    icon: Megaphone,
    color: "from-amber-600 to-yellow-500",
    shadow: "shadow-amber-500/20",
    badge: null,
  },
  {
    href: "/dashboard/utilities",
    label: "Utilities",
    description: "Captions, voice, scripts, prompts, and story tools",
    icon: Wrench,
    color: "from-sky-600 to-cyan-600",
    shadow: "shadow-sky-500/20",
    badge: "New",
  },
  {
    href: "/dashboard/ai-lab",
    label: "AI Lab",
    description: "MCP agents, creative tools, and top AI models",
    icon: Bot,
    color: "from-violet-600 to-fuchsia-600",
    shadow: "shadow-violet-500/20",
    badge: "New",
  },
];

const RECENT_GENERATIONS = [
  {
    id: "gen_001",
    title: "Protein Shake TikTok Ad",
    type: "video",
    status: "completed",
    duration: "30s",
    platform: "TikTok",
    quality: 94,
    time: "2 mins ago",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "gen_002",
    title: "Luxury Watch Reel",
    type: "video",
    status: "completed",
    duration: "30s",
    platform: "Instagram",
    quality: 91,
    time: "18 mins ago",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "gen_003",
    title: "AI SaaS Viral Short",
    type: "video",
    status: "processing",
    duration: "30s",
    platform: "YouTube Shorts",
    quality: null,
    time: "Just now",
    thumbnail: null,
  },
];

const STATS = [
  { label: "Videos Generated", value: "47", icon: Film, change: "+12 this week" },
  { label: "Credits Used", value: "53", icon: Zap, change: "247 remaining" },
  { label: "Avg Quality Score", value: "92", icon: TrendingUp, change: "/100" },
  { label: "Avg Render Time", value: "2.8s", icon: Clock, change: "NVENC active" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning 👋</h1>
          <p className="text-zinc-400 text-sm mt-1">Your AI pipeline is online and ready.</p>
        </div>
        <Link
          href="/studio"
          id="dashboard-new-video"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all text-sm font-semibold shadow-lg shadow-violet-500/25"
        >
          <Plus className="w-4 h-4" />
          New Video
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-5 border border-white/8 hover:border-white/12 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Studios</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              id={`dashboard-studio-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative group glass-panel rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all hover:-translate-y-0.5"
            >
              {action.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                  {action.badge}
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg ${action.shadow} group-hover:scale-105 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-white text-sm mb-1">{action.label}</div>
              <div className="text-zinc-500 text-xs leading-relaxed">{action.description}</div>
              <ArrowRight className="w-4 h-4 text-zinc-600 mt-3 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent generations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Generations</h2>
          <Link href="/dashboard/assets" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {RECENT_GENERATIONS.map((gen) => (
            <div
              key={gen.id}
              className="flex items-center gap-4 glass-panel rounded-xl p-4 border border-white/8 hover:border-white/12 transition-colors"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                {gen.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={gen.thumbnail} alt={gen.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-violet-500/50 border-t-violet-400 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">{gen.title}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                  <span>{gen.platform}</span>
                  <span>·</span>
                  <span>{gen.duration}</span>
                  <span>·</span>
                  <span>{gen.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {gen.status === "completed" ? (
                  <>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">Quality</div>
                      <div className="text-sm font-semibold text-emerald-400">{gen.quality}/100</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <div className="w-3 h-3 border border-amber-400/50 border-t-amber-400 rounded-full animate-spin" />
                    Processing
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
