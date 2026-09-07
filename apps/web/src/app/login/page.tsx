"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, ArrowRight, Github } from "lucide-react";
import { authApi, setTokens } from "@/services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      setTokens(data);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-indigo-900/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-700/15 blur-[100px]" />

        <Link href="/" className="relative flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Viewmax</span>
        </Link>

        <div className="relative z-10">
          <blockquote className="text-2xl font-semibold text-white leading-relaxed mb-4">
            &ldquo;Generated 30 TikTok ads in an afternoon.
            The AI pipeline thinks like a real director.&rdquo;
          </blockquote>
          <div className="text-zinc-400 text-sm">Alex K. — UGC Creator</div>
        </div>

        <div className="relative z-10 glass-panel rounded-2xl p-5 border border-white/8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-zinc-400 font-mono">pipeline · active</span>
          </div>
          <div className="font-mono text-xs space-y-1.5">
            <div><span className="text-violet-400">[orchestrator]</span> <span className="text-zinc-300">20-stage DAG initialized</span></div>
            <div><span className="text-emerald-400">[scene_planner]</span> <span className="text-zinc-300">4 scenes decomposed ✓</span></div>
            <div><span className="text-cyan-400">[ffmpeg_render]</span> <span className="text-zinc-300">NVENC H.264 1080p ✓</span></div>
            <div><span className="text-amber-400">[quality_check]</span> <span className="text-zinc-300">score: 94/100 ✓</span></div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Viewmax</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-zinc-400">Sign in to your AI Studio</p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <Link href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-lg shadow-violet-500/25 group mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#09090b] px-3 text-xs text-zinc-600">or continue with</span>
            </div>
          </div>

          <button
            id="login-github"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium text-zinc-300"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
