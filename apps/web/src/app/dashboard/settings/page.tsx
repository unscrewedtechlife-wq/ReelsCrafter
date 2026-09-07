"use client";

import React, { useState } from "react";
import { Settings, User, Key, Bell, Cpu, Save, Eye, EyeOff, AlertTriangle } from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "engine", label: "AI Engine", icon: Cpu },
];

function ProfileTab() {
  const [name, setName] = useState("Alex Chen");
  const [email] = useState("alex@studio.com");
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          AC
        </div>
        <div>
          <div className="text-sm font-medium text-zinc-300 mb-2">Profile Photo</div>
          <button id="settings-avatar-upload" className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-zinc-400">
            Upload photo
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="settings-name" className="block text-xs text-zinc-500 mb-1.5">Display Name</label>
          <input
            id="settings-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
          <input
            id="settings-email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl bg-white/3 border border-white/8 text-zinc-500 text-sm cursor-not-allowed"
          />
        </div>
      </div>
      <button id="settings-save-profile" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 transition-all text-sm font-semibold shadow-lg shadow-violet-500/20">
        <Save className="w-4 h-4" />
        Save Profile
      </button>
    </div>
  );
}

function ApiKeysTab() {
  const [showKey, setShowKey] = useState(false);
  const mockKey = "vmax_sk_live_8f92a176ef2a9410abc123def456xyz";
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-300 leading-relaxed">
          Keep your API keys private. Never expose them in client-side code or commit them to version control.
        </p>
      </div>
      <div className="glass-panel rounded-xl border border-white/8 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-white">Production API Key</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 font-mono text-xs text-zinc-400 bg-white/5 rounded-lg px-3 py-2.5 truncate">
            {showKey ? mockKey : "vmax_sk_live_" + "•".repeat(24)}
          </div>
          <button id="settings-show-key" onClick={() => setShowKey(v => !v)} className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button id="settings-copy-key" className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-zinc-400">Copy</button>
          <button id="settings-rotate-key" className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/8 transition-all text-red-400">Rotate Key</button>
        </div>
      </div>
      <div className="text-xs text-zinc-600 font-mono">
        Base URL: <span className="text-zinc-400">http://localhost:8000</span>
      </div>
    </div>
  );
}

function EngineTab() {
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [comfyUrl, setComfyUrl] = useState("http://localhost:8188");
  const [piperUrl, setPiperUrl] = useState("http://localhost:5000");
  const [nvenc, setNvenc] = useState(true);

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <p className="text-xs text-emerald-300">All local AI engines are reachable.</p>
      </div>
      <div className="space-y-4">
        {[
          { label: "Ollama (LLM)", id: "settings-ollama-url", value: ollamaUrl, setter: setOllamaUrl, status: "online" },
          { label: "ComfyUI (Image)", id: "settings-comfy-url", value: comfyUrl, setter: setComfyUrl, status: "online" },
          { label: "Piper TTS (Voice)", id: "settings-piper-url", value: piperUrl, setter: setPiperUrl, status: "online" },
        ].map((engine) => (
          <div key={engine.label}>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={engine.id} className="text-xs text-zinc-500">{engine.label} URL</label>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{engine.status}</span>
            </div>
            <input
              id={engine.id}
              value={engine.value}
              onChange={(e) => engine.setter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-violet-500/50"
            />
          </div>
        ))}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-violet-400" />
            <div>
              <div className="text-sm font-medium text-white">NVENC Hardware Encoding</div>
              <div className="text-xs text-zinc-500">GPU-accelerated H.264 render with FFmpeg</div>
            </div>
          </div>
          <button
            id="settings-nvenc-toggle"
            onClick={() => setNvenc(v => !v)}
            className={`w-11 h-6 rounded-full border transition-all relative ${nvenc ? "bg-violet-600 border-violet-500" : "bg-white/10 border-white/15"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${nvenc ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>
      <button id="settings-save-engine" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 transition-all text-sm font-semibold">
        <Save className="w-4 h-4" />
        Save Engine Settings
      </button>
    </div>
  );
}

function NotificationsTab() {
  const NOTIF_OPTIONS = [
    { id: "notif-generation-complete", label: "Generation complete", description: "When a video or image finishes rendering" },
    { id: "notif-credit-low", label: "Low credits warning", description: "When credits drop below 20%" },
    { id: "notif-team-invite", label: "Team invitations", description: "When someone accepts your team invite" },
    { id: "notif-billing", label: "Billing updates", description: "Subscription renewals and payment confirmations" },
  ];
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ "notif-generation-complete": true, "notif-credit-low": true, "notif-team-invite": false, "notif-billing": true });

  return (
    <div className="space-y-3">
      {NOTIF_OPTIONS.map((opt) => (
        <div key={opt.id} className="flex items-center justify-between p-4 rounded-xl border border-white/8 hover:border-white/12 transition-colors">
          <div>
            <div className="text-sm font-medium text-white">{opt.label}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{opt.description}</div>
          </div>
          <button
            id={opt.id}
            onClick={() => setEnabled(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
            className={`w-11 h-6 rounded-full border transition-all relative flex-shrink-0 ${enabled[opt.id] ? "bg-violet-600 border-violet-500" : "bg-white/10 border-white/15"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enabled[opt.id] ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center shadow-lg">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-zinc-500 text-sm">Manage your account and engine configuration</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/8 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`settings-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-violet-500 text-violet-300"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/8">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "api" && <ApiKeysTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "engine" && <EngineTab />}
      </div>
    </div>
  );
}
