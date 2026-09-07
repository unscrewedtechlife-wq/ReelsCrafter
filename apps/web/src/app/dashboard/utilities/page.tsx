"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { UTILITY_TOOLS } from "@/lib/utility-tools";

export default function UtilitiesPage() {
  const [query, setQuery] = useState("");
  const tools = UTILITY_TOOLS.filter((tool) =>
    `${tool.label} ${tool.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-violet-400 mb-2"><Sparkles className="w-4 h-4" /> Viewmax toolset</div>
          <h1 className="text-3xl font-bold text-white">Utilities</h1>
          <p className="text-sm text-zinc-400 mt-2">Everyday tools for captions, voice, scripts, prompts, and story production.</p>
        </div>
        <label className="relative block w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search utilities" className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-violet-500" />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/dashboard/utilities/${tool.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-violet-400/40 hover:bg-white/[0.06] transition-all">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}><tool.icon className="w-5 h-5 text-white" /></div>
            <div className="mt-5 flex items-center justify-between gap-3"><h2 className="font-semibold text-white">{tool.label}</h2><ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-300 group-hover:translate-x-1 transition-all" /></div>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
