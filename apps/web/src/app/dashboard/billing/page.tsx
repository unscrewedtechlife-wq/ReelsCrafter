"use client";

import React, { useState } from "react";
import { CreditCard, Zap, Check, ArrowRight, TrendingDown } from "lucide-react";
import Link from "next/link";

const PLANS = [
  { id: "free", name: "Free", price: 0, credits: 50 },
  { id: "creator", name: "Creator", price: 29, credits: 300 },
  { id: "pro", name: "Pro", price: 79, credits: 1000 },
  { id: "agency", name: "Agency", price: 199, credits: 5000 },
];

const TRANSACTIONS = [
  { id: "t1", action: "Video generation (30s TikTok ad)", credits: -30, balance: 247, date: "Today, 2:14 PM" },
  { id: "t2", action: "Image generation (4 keyframes)", credits: -8, balance: 277, date: "Today, 2:08 PM" },
  { id: "t3", action: "Voice synthesis (30s narration)", credits: -5, balance: 285, date: "Today, 2:05 PM" },
  { id: "t4", action: "Monthly credit refill — Creator Plan", credits: +300, balance: 290, date: "Sep 1, 2026" },
];

export default function BillingPage() {
  const [currentPlan] = useState("creator");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Billing</h1>
          <p className="text-zinc-500 text-sm">Manage your subscription and credits</p>
        </div>
      </div>

      {/* Current plan card */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-violet-500/25">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1">Current Plan</div>
            <div className="text-2xl font-bold text-white">Creator</div>
            <div className="text-zinc-400 text-sm mt-1">$29/month · Renews Oct 1, 2026</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 mb-1">Credits remaining</div>
            <div className="text-3xl font-bold text-white">247</div>
            <div className="text-xs text-zinc-500">of 300</div>
            <div className="mt-2 w-24 h-1.5 rounded-full bg-white/8 ml-auto">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: "82%" }} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/8">
          <button id="billing-portal" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:border-white/25 hover:bg-white/5 transition-all text-sm font-medium">
            <CreditCard className="w-4 h-4" />
            Manage Subscription
          </button>
          <Link href="/pricing" id="billing-upgrade" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 transition-all text-sm font-medium text-violet-300">
            <Zap className="w-4 h-4 text-amber-400" />
            Upgrade Plan
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Plan comparison */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Available Plans</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-4 transition-all ${
                plan.id === currentPlan
                  ? "border-violet-500/40 bg-violet-500/8"
                  : "border-white/8 hover:border-white/15"
              }`}
            >
              <div className="text-sm font-semibold text-white mb-1">{plan.name}</div>
              <div className="text-xl font-bold text-white">${plan.price}<span className="text-sm font-normal text-zinc-500">/mo</span></div>
              <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
                <Zap className="w-3 h-3 text-amber-400" />
                {plan.credits.toLocaleString()} credits
              </div>
              {plan.id === currentPlan ? (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-violet-400">
                  <Check className="w-3.5 h-3.5" />
                  Current plan
                </div>
              ) : (
                <button
                  id={`billing-select-${plan.id}`}
                  className="mt-3 w-full py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-medium transition-all"
                >
                  {plan.price > PLANS.find(p => p.id === currentPlan)!.price ? "Upgrade" : "Downgrade"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Credit history */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Credit History</h2>
        <div className="glass-panel rounded-2xl border border-white/8 overflow-hidden">
          <div className="grid grid-cols-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3 border-b border-white/8">
            <div className="col-span-2">Action</div>
            <div className="text-right">Credits</div>
            <div className="text-right">Balance</div>
          </div>
          {TRANSACTIONS.map((t) => (
            <div key={t.id} className="grid grid-cols-4 items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
              <div className="col-span-2">
                <div className="text-sm text-zinc-300">{t.action}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{t.date}</div>
              </div>
              <div className={`text-right text-sm font-semibold ${t.credits > 0 ? "text-emerald-400" : "text-zinc-400"}`}>
                {t.credits > 0 ? "+" : ""}{t.credits}
              </div>
              <div className="text-right text-sm text-zinc-300 flex items-center justify-end gap-1">
                {t.credits < 0 && <TrendingDown className="w-3 h-3 text-zinc-600" />}
                {t.balance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
