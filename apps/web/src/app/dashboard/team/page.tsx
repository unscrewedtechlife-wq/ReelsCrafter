"use client";

import React, { useState } from "react";
import { Users2, Mail, Shield, Trash2, Plus, Crown } from "lucide-react";

const MEMBERS = [
  { id: "u1", name: "Alex Chen", email: "alex@studio.com", role: "owner", joined: "Aug 1, 2026", avatar: "AC" },
  { id: "u2", name: "Sarah Martinez", email: "sarah@studio.com", role: "admin", joined: "Aug 5, 2026", avatar: "SM" },
  { id: "u3", name: "Jordan Kim", email: "jordan@studio.com", role: "member", joined: "Aug 12, 2026", avatar: "JK" },
  { id: "u4", name: "Riley Thompson", email: "riley@studio.com", role: "viewer", joined: "Sep 1, 2026", avatar: "RT" },
];

const ROLE_COLORS: Record<string, string> = {
  owner: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  admin: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  member: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  viewer: "text-zinc-400 bg-white/5 border-white/10",
};

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Users2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Team</h1>
            <p className="text-zinc-500 text-sm">Manage access and collaboration</p>
          </div>
        </div>
        <button
          id="team-invite-btn"
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all text-sm font-semibold shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="glass-panel-glow rounded-2xl p-5 border border-violet-500/25">
          <h3 className="text-sm font-semibold text-white mb-4">Invite a team member</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="team-invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <select
              id="team-invite-role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="admin" className="bg-[#0d0d12]">Admin</option>
              <option value="member" className="bg-[#0d0d12]">Member</option>
              <option value="viewer" className="bg-[#0d0d12]">Viewer</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              id="team-send-invite"
              disabled={!inviteEmail}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Send Invite
            </button>
            <button
              onClick={() => setShowInvite(false)}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm text-zinc-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="glass-panel rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">{MEMBERS.length} members</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Shield className="w-3.5 h-3.5" />
            Creator Plan · 5 seats
          </div>
        </div>
        {MEMBERS.map((member) => (
          <div key={member.id} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{member.name}</span>
                {member.role === "owner" && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="text-xs text-zinc-500">{member.email}</div>
            </div>
            <div className="hidden sm:block text-xs text-zinc-600">Joined {member.joined}</div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${ROLE_COLORS[member.role]}`}>
              {member.role}
            </span>
            {member.role !== "owner" && (
              <button
                id={`team-remove-${member.id}`}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all"
                title="Remove member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Role permissions table */}
      <div className="glass-panel rounded-2xl p-5 border border-white/8">
        <h3 className="text-sm font-semibold text-white mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left py-2 pr-4 text-zinc-500 font-medium">Permission</th>
                {["Owner", "Admin", "Member", "Viewer"].map((r) => (
                  <th key={r} className="text-center py-2 px-3 text-zinc-500 font-medium">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Generate videos", true, true, true, false],
                ["View assets", true, true, true, true],
                ["Delete assets", true, true, false, false],
                ["Invite members", true, true, false, false],
                ["Manage billing", true, false, false, false],
                ["API access", true, true, false, false],
              ].map(([permission, ...perms]) => (
                <tr key={String(permission)} className="border-b border-white/5 last:border-0">
                  <td className="py-2.5 pr-4 text-zinc-400">{String(permission)}</td>
                  {perms.map((p, i) => (
                    <td key={i} className="text-center py-2.5 px-3">
                      {p ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
