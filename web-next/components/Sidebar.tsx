"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CircleUserRound, Coins, GitCompareArrows, Lightbulb, Lock, LogOut, Palette, Ratio, ScanFace, Scale, Settings, Sparkles, Stars, Trophy, WandSparkles } from "lucide-react";
import { authApi } from "@/lib/client-api";
import { TOOLS } from "@/lib/tools";
import type { Profile } from "@/lib/types";
import { UpgradeModal } from "./UpgradeModal";
import { Avatar } from "./Avatar";

const TOOL_ICONS = [ScanFace, Palette, WandSparkles, Lightbulb, Stars, Scale, Trophy, GitCompareArrows, Sparkles, Ratio];

function NavLinks({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  return <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-2 py-5" : "px-3 py-5"}`}>
    {!collapsed && <><p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-(--color-text-muted)">Your tools</p><Link href="/app/face-beauty-analysis" onClick={onNavigate} className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-(--color-burgundy) px-3 py-3 text-sm font-extrabold text-white shadow-[0_9px_20px_rgba(82,13,28,0.16)]"><Sparkles size={16} />Start a new scan</Link></>}
    <div className="space-y-1">{TOOLS.map((tool, index) => {
      const href = `/app/${tool.slug}`;
      const active = pathname === href;
      const Icon = TOOL_ICONS[index] ?? Sparkles;
      return <Link key={tool.slug} href={href} title={collapsed ? tool.title : undefined} onClick={onNavigate} className={`group flex items-center rounded-xl py-2.5 text-sm font-semibold transition-all ${collapsed ? "justify-center px-2" : "gap-3 px-3"} ${active ? "bg-(--color-blush) text-(--color-burgundy-dark)" : "text-(--color-text) hover:bg-(--color-surface) hover:text-(--color-burgundy-dark)"}`}><Icon size={18} strokeWidth={2.1} className="text-(--color-burgundy)" />{!collapsed && <><span className="flex-1 truncate">{tool.title}</span>{tool.isPro && !active && <Lock size={13} className="text-(--color-text-muted)" />}</>}</Link>;
    })}</div>
    <div className="mt-5 border-t border-(--color-border) pt-4">{!collapsed && <p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-(--color-text-muted)">Account</p>}<Link href="/app/profile" title={collapsed ? "Account settings" : undefined} onClick={onNavigate} className={`flex items-center rounded-xl py-2.5 text-sm font-semibold transition-colors ${collapsed ? "justify-center px-2" : "gap-3 px-3"} ${pathname.startsWith("/app/profile") ? "bg-(--color-blush) text-(--color-burgundy-dark)" : "text-(--color-text) hover:bg-(--color-surface)"}`}><Settings size={18} className="text-(--color-burgundy)" />{!collapsed && "Account & settings"}</Link></div>
  </nav>;
}

function AccountFooter({ profile, collapsed }: { profile: Profile; collapsed: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  async function signOut() { await authApi.signOut(); router.push("/login"); router.refresh(); }
  return <div className="relative border-t border-(--color-border) p-3">
    {open && !collapsed && <div className="absolute bottom-[76px] left-3 right-3 z-30 rounded-2xl border border-(--color-border) bg-white p-2 shadow-[0_16px_36px_rgba(48,19,26,0.16)]"><div className="border-b border-(--color-border) px-3 py-2.5"><p className="truncate text-sm font-extrabold text-(--color-burgundy-dark)">{profile.display_name || "Verified Glam member"}</p><p className="mt-0.5 truncate text-xs text-(--color-text-muted)">{profile.email}</p></div><Link href="/app/profile" className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-(--color-surface)"><CircleUserRound size={16} />Profile & account</Link><Link href="/app/profile" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-(--color-surface)"><Coins size={16} />Credits & usage</Link><Link href="/delete-account" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-(--color-surface)"><Settings size={16} />Privacy settings</Link><button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 hover:bg-red-50"><LogOut size={16} />Sign out</button></div>}
    {!collapsed && !profile.is_pro && <button onClick={() => setUpgradeOpen(true)} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-burgundy)/25 bg-(--color-blush)/45 px-3 py-2.5 text-sm font-extrabold text-(--color-burgundy) transition hover:bg-(--color-blush)"><Sparkles size={16} />Upgrade to Pro</button>}
    <button onClick={() => collapsed ? router.push("/app/profile") : setOpen((value) => !value)} className={`flex w-full items-center gap-2 rounded-xl p-2 text-left transition hover:bg-(--color-surface) ${collapsed ? "justify-center" : ""}`} title={collapsed ? "Account" : undefined}><span className="block shrink-0 overflow-hidden rounded-xl"><Avatar src={profile.avatar_url} name={profile.display_name ?? profile.email} size={36} /></span>{!collapsed && <span className="min-w-0 flex-1"><span className="block truncate text-sm font-extrabold text-(--color-burgundy-dark)">{profile.display_name || "Your account"}</span><span className="mt-0.5 flex items-center gap-1 text-xs text-(--color-text-muted)"><span className={`h-1.5 w-1.5 rounded-full ${profile.is_pro ? "bg-emerald-500" : "bg-amber-500"}`} />{profile.is_pro ? "Pro plan" : "Free plan"}</span></span>}<ChevronRight size={16} className="text-(--color-text-muted)" /></button>
    <UpgradeModal profile={profile} open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
  </div>;
}

export function Sidebar({ profile }: { profile: Profile }) {
  const [collapsed, setCollapsed] = useState(false);
  return <aside className={`hidden shrink-0 border-r border-(--color-border) bg-white transition-[width] duration-200 lg:flex lg:flex-col ${collapsed ? "w-[78px]" : "w-(--sidebar-width)"}`}>
    <div className={`flex h-[76px] items-center border-b border-(--color-border) ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}><Link href="/app" className="flex min-w-0 items-center gap-3" title={collapsed ? "Verified Glam Scanner" : undefined}><Image src="/images/logo.png" alt="Verified Glam" width={38} height={38} className="shrink-0 rounded-xl shadow-sm" />{!collapsed && <span className="min-w-0"><span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-(--color-burgundy)">Verified Glam</span><span className="block text-base font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">Scanner</span></span>}</Link>{!collapsed && <button onClick={() => setCollapsed(true)} className="rounded-lg p-1.5 text-(--color-text-muted) hover:bg-(--color-surface) hover:text-(--color-burgundy)" aria-label="Collapse sidebar"><ChevronLeft size={18} /></button>}</div>
    <NavLinks collapsed={collapsed} />
    <AccountFooter profile={profile} collapsed={collapsed} />
    {collapsed && <button onClick={() => setCollapsed(false)} className="m-3 mt-0 flex h-10 items-center justify-center rounded-xl border border-(--color-border) text-(--color-burgundy) hover:bg-(--color-surface)" aria-label="Expand sidebar"><ChevronRight size={18} /></button>}
  </aside>;
}

export function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) { return <NavLinks onNavigate={onNavigate} />; }
