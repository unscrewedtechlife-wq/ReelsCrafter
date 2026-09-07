"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Check, Zap, ArrowRight, HelpCircle } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, annual: 0 },
    credits: 50,
    description: "Perfect for trying out the platform",
    color: "border-white/10",
    badge: null,
    features: [
      "50 credits / month",
      "720p video export",
      "3 active projects",
      "Basic AI pipeline (12 stages)",
      "TikTok & Reels output",
      "Standard captions",
      "Community support",
    ],
    missing: [
      "1080p / 4K export",
      "NVENC hardware encoding",
      "Scene planner",
      "Custom voice models",
      "Team collaboration",
      "Priority render queue",
    ],
    cta: "Get Started Free",
    ctaHref: "/signup",
    highlight: false,
  },
  {
    id: "creator",
    name: "Creator",
    price: { monthly: 29, annual: 22 },
    credits: 300,
    description: "For creators scaling their content",
    color: "border-violet-500/40",
    badge: "Most Popular",
    features: [
      "300 credits / month",
      "1080p video export",
      "Unlimited projects",
      "Full 20-stage AI pipeline",
      "All 6 output platforms",
      "Scene & shot planner",
      "Hormozi / MrBeast captions",
      "NVENC hardware encoding",
      "Email support",
    ],
    missing: [
      "4K export",
      "Custom voice models",
      "Team collaboration",
      "White-label export",
    ],
    cta: "Start Creator Plan",
    ctaHref: "/signup?plan=creator",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 79, annual: 59 },
    credits: 1000,
    description: "For professional studios & agencies",
    color: "border-cyan-500/30",
    badge: null,
    features: [
      "1,000 credits / month",
      "1080p + 4K export",
      "Unlimited projects",
      "Full 20-stage AI pipeline",
      "All 6 output platforms",
      "Scene & shot planner",
      "All caption styles",
      "NVENC hardware encoding",
      "Custom voice model upload",
      "5-seat team collaboration",
      "Priority render queue",
      "Priority support",
    ],
    missing: [
      "Unlimited team seats",
      "White-label export",
      "Custom deployment",
    ],
    cta: "Start Pro Plan",
    ctaHref: "/signup?plan=pro",
    highlight: false,
  },
  {
    id: "agency",
    name: "Agency",
    price: { monthly: 199, annual: 149 },
    credits: 5000,
    description: "Unlimited production for agencies",
    color: "border-amber-500/30",
    badge: "Best Value",
    features: [
      "5,000 credits / month",
      "1080p + 4K export",
      "Unlimited projects",
      "Full 20-stage AI pipeline",
      "All 6 output platforms",
      "Scene & shot planner",
      "All caption styles",
      "NVENC hardware encoding",
      "Custom voice models",
      "Unlimited team seats",
      "White-label export",
      "Self-hosted deployment support",
      "Dedicated account manager",
    ],
    missing: [],
    cta: "Start Agency Plan",
    ctaHref: "/signup?plan=agency",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "What is a credit?",
    a: "One credit generates approximately 1 second of final rendered video, including all AI pipeline stages (script, scene planning, image generation, voiceover, and encoding).",
  },
  {
    q: "Can I self-host Viewmax?",
    a: "Yes. Viewmax is designed to run on your own GPU workstation, VPS, or home lab. The free and self-hosted tiers let you run unlimited generation on your own hardware.",
  },
  {
    q: "What AI models does Viewmax use?",
    a: "Viewmax integrates with Ollama (local LLMs), ComfyUI (FLUX/SDXL), Piper TTS, ElevenLabs, OpenAI, and can be extended with any compatible API endpoint.",
  },
  {
    q: "Is there a free trial of paid plans?",
    a: "All paid plans include a 7-day free trial with full feature access. No credit card required to start.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel any time from your billing dashboard. Your credits and projects remain accessible until the end of your billing period.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-800/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#09090b]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Viewmax</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2">Sign in</Link>
            <Link href="/signup" className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-zinc-400 text-xl max-w-xl mx-auto mb-8">
            Start free. Scale as you grow. Self-host for unlimited generation.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              id="pricing-monthly"
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-white/10 text-white" : "text-zinc-500"}`}
            >
              Monthly
            </button>
            <button
              id="pricing-annual"
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-white/10 text-white" : "text-zinc-500"}`}
            >
              Annual
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border ${plan.color} bg-[#0d0d12] p-6 flex flex-col transition-all hover:-translate-y-1 ${
                plan.highlight ? "shadow-xl shadow-violet-500/15 ring-1 ring-violet-500/30" : ""
              }`}
            >
              {/* Gradient top line for highlighted */}
              {plan.highlight && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-t-2xl" />
              )}

              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${
                  plan.badge === "Most Popular"
                    ? "bg-violet-600 text-white"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">{plan.name}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">${annual ? plan.price.annual : plan.price.monthly}</span>
                  {plan.price.monthly > 0 && <span className="text-zinc-500 text-sm mb-1">/mo</span>}
                </div>
                {plan.price.monthly > 0 && annual && (
                  <div className="text-xs text-emerald-400">Billed annually — save ${(plan.price.monthly - plan.price.annual) * 12}/yr</div>
                )}
                <p className="text-zinc-500 text-sm mt-2">{plan.description}</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/4 border border-white/8 mb-6">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-white">{plan.credits.toLocaleString()} credits</span>
                <span className="text-zinc-500 text-xs">/ month</span>
              </div>

              <div className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-zinc-600 line-through">
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <Link
                href={plan.ctaHref}
                id={`plan-cta-${plan.id}`}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25"
                    : "border border-white/15 hover:border-white/25 hover:bg-white/5 text-white"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Self-hosted banner */}
        <div className="glass-panel-glow rounded-2xl p-8 border border-violet-500/20 mb-20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-2">Self-Hosted Edition</div>
            <h3 className="text-2xl font-bold text-white mb-2">Run Viewmax on your own GPU</h3>
            <p className="text-zinc-400 max-w-xl">
              Deploy on your RTX workstation, VPS, or home lab. Use local Ollama LLMs, ComfyUI, and Piper TTS for unlimited generation with zero per-use API costs.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col gap-3">
            <Link href="#" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 transition-all text-sm font-semibold text-violet-300">
              Read Deployment Guide
            </Link>
            <Link href="/studio" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium text-zinc-300">
              Try the Pipeline Studio
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/8 bg-[#0d0d12] overflow-hidden"
              >
                <button
                  id={`faq-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="font-medium text-white text-sm">{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180 text-violet-400" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/8 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-zinc-400">Viewmax</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <Link href="/studio" className="hover:text-zinc-400 transition-colors">Studio</Link>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Sign in</Link>
          </div>
          <div>© {new Date().getFullYear()} Viewmax</div>
        </div>
      </footer>
    </div>
  );
}
