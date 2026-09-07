"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { authApi, setTokens } from "@/services/api";

const PLAN_PERKS = [
  "50 credits/month free",
  "20-stage AI video pipeline",
  "4 output platforms",
  "Self-hostable",
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.signup(email, name, password);
      setTokens(data);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(message || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-violet-900/20 to-transparent" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-700/12 blur-[100px]" />

        <Link href="/" className="relative flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Viewmax</span>
        </Link>

        <div className="relative z-10 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Everything you need to create viral content</h2>
            <p className="text-zinc-400 text-sm">Your free account includes:</p>
          </div>
          <div className="space-y-3">
            {PLAN_PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-zinc-300 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 glass-panel rounded-2xl p-5 border border-white/8">
          <div className="text-xs text-zinc-500 mb-3 font-mono uppercase tracking-wider">Free plan · 50 credits/month</div>
          <div className="text-4xl font-extrabold text-white mb-1">$0</div>
          <div className="text-zinc-500 text-sm">No credit card required. Upgrade anytime.</div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Viewmax</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-zinc-400">Start generating AI videos for free</p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      password.length >= level * 2
                        ? password.length >= 12
                          ? "bg-emerald-500"
                          : password.length >= 8
                          ? "bg-amber-500"
                          : "bg-red-500"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-violet-500/25 group mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Free Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600 mt-4">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-zinc-500 hover:text-zinc-400">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="text-zinc-500 hover:text-zinc-400">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
