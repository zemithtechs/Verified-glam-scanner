"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Search, X } from "lucide-react";
import { Glyph } from "./icons";
import { Logo } from "./Logo";
import { SIDEBAR_W, SideNav } from "./SideNav";
import { authApi } from "@/lib/client-api";
import { SiteFooter } from "./SiteChrome";

const HEADER_H = 56;

export type DashUser = { name: string; email: string; credits: number; max: number; isPro: boolean; plan: string };
export type Announcement = { text: string; type: string } | null;

export function DashShell({ children, user, announcement }: { children: React.ReactNode; user: DashUser; announcement?: Announcement }) {
  const [mobile, setMobile] = useState(false);
  const router = useRouter();
  const u = user;
  const pct = Math.min(100, (u.credits / Math.max(u.max, 1)) * 100);
  async function signOut() { await authApi.signOut().catch(() => {}); router.push("/"); router.refresh(); }
  return (
    <div className="flex min-h-screen bg-[#f6f4f5]">
      <aside className="sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-line bg-white lg:flex" style={{ width: SIDEBAR_W }}>
        <div className="flex items-center border-b border-line px-4" style={{ height: HEADER_H }}><Logo /></div>
        <SideNav variant="dash" headerH={HEADER_H} />
        <div className="space-y-1.5 border-t border-line p-2.5">
          <Link href="/app/account" className="block rounded-lg border border-line px-3 py-2 transition-colors hover:bg-blush/50">
            <div className="flex items-center justify-between text-[13px] font-semibold"><span className="flex items-center gap-2 text-plum"><Glyph name="coin" size={18} />Credits</span><span>{u.credits} / {u.max}</span></div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-blush"><div className="h-full rounded-full bg-plum" style={{ width: `${pct}%` }} /></div>
            
          </Link>
          <div className="flex items-center gap-3 rounded-xl p-1.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-plum text-sm font-semibold text-white">{u.name[0]?.toUpperCase()}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold">{u.name}</p><p className="truncate text-xs text-muted">{u.email}</p></div>
          </div>
        </div>
      </aside>

      {mobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex w-[min(320px,88vw)] flex-col bg-white shadow-xl"><div className="flex items-center justify-between border-b border-line px-4" style={{ height: HEADER_H }}><Logo /><button type="button" aria-label="Close menu" onClick={() => setMobile(false)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-blush"><X size={20} /></button></div><SideNav variant="dash" mode="accordion" onNavigate={() => setMobile(false)} /></div>
          <button className="flex-1 bg-ink/40" onClick={() => setMobile(false)} aria-label="Close menu" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 sm:px-6" style={{ height: HEADER_H }}>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-blush lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu"><Menu size={22} /></button>
          <label className="hidden h-10 max-w-md flex-1 items-center gap-2 rounded-lg border border-line bg-cream px-3.5 sm:flex">
            <Search size={16} className="text-muted" /><input placeholder="Search 48 tools" className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted/70" />
          </label>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/app/account" className="flex h-10 items-center gap-2 rounded-lg border border-line px-3.5 text-[14px] font-semibold"><span className="text-plum"><Glyph name="coin" size={18} /></span>{u.credits}</Link>
            {!u.isPro && <Link href="/pricing" className="hidden h-10 items-center rounded-lg bg-plum px-5 text-[14px] font-semibold text-white transition-colors hover:bg-ink sm:flex">Go Pro</Link>}
            <button type="button" onClick={signOut} className="flex h-10 items-center gap-2 rounded-lg px-3 text-[14px] font-semibold text-muted hover:bg-blush hover:text-ink" aria-label="Log out"><LogOut size={17} /><span className="hidden sm:inline">Log out</span></button>
            <Link href="/" className="hidden h-10 items-center rounded-lg px-3 text-[14px] font-semibold text-muted hover:text-ink md:flex">Site</Link>
          </div>
        </header>
        {announcement && (
          <div role="status" className={`border-b px-4 py-2.5 text-center text-sm font-semibold ${announcement.type === "warning" ? "border-amber-200 bg-amber-50 text-amber-900" : announcement.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-line bg-blush text-plum"}`}>{announcement.text}</div>
        )}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        <SiteFooter className="mt-0" />
      </div>
    </div>
  );
}
