"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Film,
  Image,
  Users2,
  Megaphone,
  Youtube,
  FolderOpen,
  CreditCard,
  Settings,
  FileVideo,
  ChevronLeft,
  Bell,
  Zap,
  LogOut,
  Menu,
  User,
  Wrench,
  Bot,
} from "lucide-react";

const NAV_ITEMS = [
  {
    section: "STUDIO",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/studio", label: "AI Pipeline Studio", icon: Sparkles },
      { href: "/dashboard/video", label: "Video Studio", icon: Film },
      { href: "/dashboard/image", label: "Image Studio", icon: Image },
      { href: "/dashboard/ugc", label: "UGC Studio", icon: Users2 },
      { href: "/dashboard/shorts", label: "Shorts Studio", icon: Youtube },
      { href: "/dashboard/marketing", label: "Marketing Studio", icon: Megaphone },
      { href: "/dashboard/utilities", label: "Utilities", icon: Wrench },
      { href: "/dashboard/ai-lab", label: "AI Lab", icon: Bot },
    ],
  },
  {
    section: "MANAGE",
    items: [
      { href: "/dashboard/assets", label: "Assets", icon: FolderOpen },
      { href: "/dashboard/templates", label: "Templates", icon: FileVideo },
      { href: "/dashboard/team", label: "Team", icon: Users2 },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        active
          ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-400" : "group-hover:text-zinc-300"}`} />
      {!collapsed && <span className="truncate">{label}</span>}
      {active && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div
      className={`flex flex-col h-full border-r border-white/8 bg-[#0a0a0f] transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-16 border-b border-white/8 flex-shrink-0 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-sm tracking-tight">Viewmax</div>
            <div className="text-[10px] text-zinc-500">AI Studio</div>
          </div>
        )}
      </div>

      {/* Credits widget */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-violet-500/8 border border-violet-500/15">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Credits</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-end gap-1 mb-1.5">
            <span className="text-xl font-bold text-white">247</span>
            <span className="text-zinc-500 text-xs mb-0.5">/ 300</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/8">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: "82%" }} />
          </div>
          <Link href="/dashboard/billing" className="text-xs text-violet-400 hover:text-violet-300 mt-2 block transition-colors">
            Upgrade plan →
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 mb-2">
                {section.section}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle + logout */}
      <div className={`px-2 py-3 border-t border-white/8 space-y-1 flex-shrink-0`}>
        <button
          id="sidebar-collapse"
          onClick={() => setCollapsed((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 text-sm transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          id="sidebar-logout"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 text-sm transition-all ${collapsed ? "justify-center" : ""}`}
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#09090b] text-[#f4f4f5] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">{sidebar}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex h-full">{sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-white/8 bg-[#0a0a0f]/90 backdrop-blur-xl flex-shrink-0">
          <button
            id="mobile-sidebar-btn"
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <div className="text-sm text-zinc-500">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              id="header-notifications"
              className="w-9 h-9 rounded-xl border border-white/8 hover:border-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8 hover:border-white/15 cursor-pointer transition-all">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:block">Demo User</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
