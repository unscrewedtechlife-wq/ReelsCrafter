"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  Zap,
  Film,
  Mic,
  Shield,
  ChevronRight,
  Star,
  ArrowRight,
  Cpu,
  Globe,
  TrendingUp,
  Check,
  Menu,
  X,
} from "lucide-react";

// ─── Typewriter component ──────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => setSubIndex((prev) => prev + (deleting ? -1 : 1)), speed);
    return () => clearTimeout(t);
  }, [subIndex, deleting, index, words]);

  return (
    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ComponentType<{className?:string}> }) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-2 border border-white/8 hover:border-violet-500/30 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-1">
        <Icon className="w-5 h-5 text-violet-400" />
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">{value}</div>
      <div className="text-sm text-zinc-400">{label}</div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ComponentType<{className?:string}>;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all hover:-translate-y-1 group">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Pipeline step ────────────────────────────────────────────────────────────
function PipelineStep({ number, label, detail }: { number: string; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-lg shadow-violet-500/25">
        {number}
      </div>
      <div>
        <div className="font-semibold text-white text-sm">{label}</div>
        <div className="text-zinc-500 text-xs mt-0.5">{detail}</div>
      </div>
    </div>
  );
}

const TYPEWRITER_WORDS = [
  "TikTok Ads",
  "YouTube Shorts",
  "UGC Creatives",
  "Brand Videos",
  "Instagram Reels",
  "Product Demos",
];

const FEATURES = [
  {
    icon: Film,
    title: "20-Stage AI Pipeline",
    description: "Fully autonomous DAG workflow from raw prompt to finished, platform-ready video with zero manual editing.",
    color: "bg-violet-500/20",
  },
  {
    icon: Sparkles,
    title: "Scene & Shot Planner",
    description: "LLM-powered director decomposes scripts into timed scenes, camera angles, lighting, and visual prompts automatically.",
    color: "bg-fuchsia-500/20",
  },
  {
    icon: Mic,
    title: "Neural Voice Synthesis",
    description: "ElevenLabs, OpenAI TTS, and local Piper TTS support with studio mastering and automatic audio ducking.",
    color: "bg-cyan-500/20",
  },
  {
    icon: Cpu,
    title: "NVENC Hardware Encoding",
    description: "GPU-accelerated FFmpeg render pipeline with NVENC H.264, HDR tone mapping, and multi-track composition.",
    color: "bg-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Self-Hosted & Private",
    description: "Deploy on your own GPU workstation, VPS, or home lab. Your data, your models, your infrastructure.",
    color: "bg-amber-500/20",
  },
  {
    icon: Globe,
    title: "Multi-Platform Output",
    description: "Native formats for TikTok (9:16), YouTube Shorts, Instagram Reels, LinkedIn, and Facebook Ads.",
    color: "bg-blue-500/20",
  },
];

const PIPELINE_STEPS = [
  { number: "01", label: "Prompt Enhancement", detail: "Ollama LLM expands your brief into a cinematic production script" },
  { number: "02", label: "Safety Screening", detail: "Content moderation with 99.4% confidence scoring" },
  { number: "03", label: "Scene Planning", detail: "Story beats, character sheets, location specs, and shot lists" },
  { number: "04", label: "Asset Generation", detail: "FLUX / SDXL keyframes, video clips via Veo or Runway" },
  { number: "05", label: "Voice & Music", detail: "Neural TTS narration + mood-matched background audio ducking" },
  { number: "06", label: "Caption Sync", detail: "Word-level timestamp captions in Hormozi, MrBeast, or TikTok style" },
  { number: "07", label: "FFmpeg Render", detail: "Hardware-accelerated 1080p/4K H.264 final composition" },
  { number: "08", label: "Quality Scoring", detail: "AI quality inspection: sync, audio levels, brand compliance" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-violet-700/12 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-fuchsia-700/8 blur-[100px]" />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#09090b]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Viewmax</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#pipeline" className="hover:text-white transition-colors">Pipeline</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">Docs</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25"
            >
              Get Started Free
            </Link>
          </div>

          <button
            id="mobile-menu-btn"
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/8 bg-[#09090b] px-4 py-4 flex flex-col gap-4">
            <Link href="#features" className="text-zinc-400 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#pipeline" className="text-zinc-400 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Pipeline</Link>
            <Link href="/pricing" className="text-zinc-400 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/login" className="text-zinc-400 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
            <Link href="/signup" className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-center" onClick={() => setMobileMenuOpen(false)}>
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            20-Stage Autonomous AI Video Pipeline
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Create stunning{" "}
            <br className="hidden sm:block" />
            <Typewriter words={TYPEWRITER_WORDS} />
            <br className="hidden sm:block" />
            with one prompt.
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Viewmax is a fully self-hosted AI content studio. Go from a single text prompt to a finished,
            platform-ready social video in under 60 seconds — no editing required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/signup"
              id="hero-cta-primary"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all text-base font-semibold shadow-xl shadow-violet-500/25 group"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/studio"
              id="hero-cta-demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/25 hover:bg-white/5 transition-all text-base font-medium"
            >
              <Play className="w-4 h-4 text-violet-400" />
              Launch AI Studio
            </Link>
          </div>

          {/* Pipeline preview badge */}
          <div className="relative mx-auto max-w-3xl rounded-2xl border border-white/8 bg-[#0d0d12] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs text-zinc-500 font-mono">viewmax — ai pipeline orchestrator v2.0</span>
            </div>
            <div className="p-6 font-mono text-xs text-left space-y-2">
              {[
                { color: "text-violet-400", label: "[stage_01]", text: "prompt_engineer", detail: "→ TikTok protein shake ad, 30s, 9:16, UGC style" },
                { color: "text-emerald-400", label: "[stage_06]", text: "script_generator", detail: "→ Hook + Problem + Solution + CTA (74 words, 29.6s)" },
                { color: "text-cyan-400", label: "[stage_07]", text: "scene_planner", detail: "→ 4 scenes decomposed with cinematic shot lists" },
                { color: "text-fuchsia-400", label: "[stage_10]", text: "video_workers", detail: "→ 4x parallel FLUX keyframes + Veo video clips" },
                { color: "text-amber-400", label: "[stage_11]", text: "voice_synthesis", detail: "→ Sarah (Energetic UGC) — studio mastered .mp3" },
                { color: "text-emerald-400", label: "[stage_16]", text: "ffmpeg_render", detail: "→ 1080x1920 NVENC H.264 30fps — 18.4MB ✓ DONE" },
              ].map((line) => (
                <div key={line.label} className="flex items-center gap-3">
                  <span className="text-zinc-600">{line.label}</span>
                  <span className={`${line.color} font-semibold`}>{line.text}</span>
                  <span className="text-zinc-500">{line.detail}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-white/8">
                <span className="text-emerald-400 font-semibold">✓ quality_score: 94/100</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-500">final render exported in 2.8s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="20" label="Pipeline stages" icon={Zap} />
          <StatCard value="< 60s" label="End-to-end generation" icon={TrendingUp} />
          <StatCard value="6" label="Output platforms" icon={Globe} />
          <StatCard value="100%" label="Self-hosted & private" icon={Shield} />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Everything you need to ship viral content</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              A complete AI production stack, self-hosted on your own hardware — no monthly API fees.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pipeline breakdown ── */}
      <section id="pipeline" className="py-20 px-4 border-t border-white/8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">How it works</div>
            <h2 className="text-4xl font-bold mb-5">From prompt to viral video in one click</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Our 20-stage DAG orchestrator chains together specialized AI agents — each one focused on a single
              task and producing structured outputs for the next stage in the pipeline.
            </p>
            <Link
              href="/studio"
              id="pipeline-cta"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all text-sm font-semibold shadow-lg shadow-violet-500/25 group"
            >
              Try the Pipeline Studio
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-5">
            {PIPELINE_STEPS.map((step) => (
              <PipelineStep key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="py-20 px-4 border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Built for creators who move fast</h2>
            <p className="text-zinc-400">Join creators using Viewmax to scale their content production.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "Generated 30 TikTok ads in an afternoon. The scene planner alone is worth it — it thinks like a real director.",
                name: "Alex K.",
                role: "UGC Creator",
                stars: 5,
              },
              {
                quote: "Finally a platform where I own my data. Runs on my RTX 4090 and renders faster than any cloud service I've tried.",
                name: "Sarah M.",
                role: "Independent Filmmaker",
                stars: 5,
              },
              {
                quote: "The Hormozi-style caption sync is insane. Word-level timestamps out of the box, zero manual work.",
                name: "Jordan T.",
                role: "Marketing Agency Owner",
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="glass-panel rounded-2xl p-6 border border-white/8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-zinc-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing CTA ── */}
      <section className="py-20 px-4 border-t border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-panel-glow rounded-3xl p-10 border border-violet-500/20">
            <h2 className="text-4xl font-bold mb-4">Start creating for free</h2>
            <p className="text-zinc-400 text-lg mb-8">
              Free plan includes 50 credits/month. No credit card required. Deploy on your own hardware for unlimited generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                id="bottom-cta-signup"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold shadow-xl shadow-violet-500/25 group"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                id="bottom-cta-pricing"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/25 hover:bg-white/5 transition-all font-medium"
              >
                View Pricing
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-zinc-500">
              {["No credit card", "Self-hostable", "Open source models", "NVENC acceleration"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">Viewmax</span>
            <span className="text-zinc-600 text-sm ml-2">AI Video Studio</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/studio" className="hover:text-white transition-colors">Studio</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
          </div>
          <div className="text-xs text-zinc-600">© {new Date().getFullYear()} Viewmax. Self-hosted AI platform.</div>
        </div>
      </footer>
    </div>
  );
}
