"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, Coins, LogOut, Menu, Settings, Sparkles, X } from "lucide-react";
import { authApi } from "@/lib/client-api";
import type { Profile } from "@/lib/types";
import { MobileNavLinks } from "./Sidebar";
import { UpgradeModal } from "./UpgradeModal";
import { Avatar } from "./Avatar";

export function TopBar({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const analysesLeft = Math.floor(profile.credits_balance / 5);

  async function handleSignOut() { await authApi.signOut(); router.push("/login"); router.refresh(); }

  return <>
    <header className="relative flex h-[76px] items-center justify-between gap-3 border-b border-(--color-border) bg-white px-4 sm:px-7">
      <div className="flex items-center gap-3"><button className="-ml-2 p-2 text-(--color-burgundy-dark) lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open menu"><Menu size={22} /></button><Link href="/app" className="flex items-center gap-2 lg:hidden"><Image src="/images/logo.png" alt="Verified Glam" width={30} height={30} className="rounded-lg" /><span className="font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">Verified Glam</span></Link></div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative"><button onClick={() => setCreditsOpen((value) => !value)} className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-[#fffdfd] px-2.5 py-2 text-left text-(--color-burgundy-dark) transition hover:border-(--color-burgundy)/35 hover:bg-(--color-surface) sm:px-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-blush) text-(--color-burgundy)"><Coins size={15} /></span><span className="hidden leading-none sm:block"><span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-(--color-text-muted)">Credits</span><span className="mt-1 block text-sm font-extrabold">{profile.credits_balance}</span></span><ChevronDown size={14} className="text-(--color-text-muted)" /></button>
          {creditsOpen && <div className="absolute right-0 top-12 z-40 w-[290px] rounded-2xl border border-(--color-border) bg-white p-4 shadow-[0_18px_44px_rgba(48,19,26,0.16)]"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold text-(--color-burgundy-dark)">{profile.is_pro ? "Pro account" : "Free account"}</p><p className="mt-1 text-xs leading-relaxed text-(--color-text-muted)">{profile.is_pro ? "Your subscription is active." : "Upgrade when you want more analyses and ad-free results."}</p></div>{!profile.is_pro && <button onClick={() => { setCreditsOpen(false); setUpgradeOpen(true); }} className="rounded-lg bg-(--color-burgundy) px-2.5 py-1.5 text-xs font-extrabold text-white">Upgrade</button>}</div><div className="mt-4 border-y border-(--color-border) py-3"><div className="flex justify-between text-sm"><span className="text-(--color-text-muted)">Available credits</span><strong className="text-(--color-burgundy-dark)">{profile.credits_balance}</strong></div><div className="mt-2 flex justify-between text-sm"><span className="text-(--color-text-muted)">Analyses available</span><strong className="text-(--color-burgundy-dark)">{analysesLeft}</strong></div></div><Link href="/app/profile" onClick={() => setCreditsOpen(false)} className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-(--color-burgundy)">View usage <span aria-hidden="true">→</span></Link></div>}
        </div>
        <div className="relative"><button onClick={() => setMenuOpen((value) => !value)} className="block shrink-0 overflow-hidden rounded-full shadow-[0_6px_14px_rgba(82,13,28,0.18)]" aria-label="Open account menu"><Avatar src={profile.avatar_url} name={profile.display_name ?? profile.email} size={40} /></button>{menuOpen && <div className="absolute right-0 top-11 z-40 w-56 rounded-xl border border-(--color-border) bg-white py-1.5 shadow-lg"><div className="truncate border-b border-(--color-border) px-4 py-2 text-sm text-(--color-text-muted)">{profile.email}</div><Link href="/app/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-(--color-surface)" onClick={() => setMenuOpen(false)}><Settings size={16} />Account settings</Link><button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut size={16} />Sign out</button></div>}</div>
      </div>
    </header>
    {drawerOpen && <div className="fixed inset-0 z-[70] lg:hidden"><div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} /><div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white"><div className="flex h-[76px] items-center justify-between border-b border-(--color-border) px-5"><span className="font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">Verified Glam</span><button onClick={() => setDrawerOpen(false)} aria-label="Close menu"><X size={20} /></button></div><MobileNavLinks onNavigate={() => setDrawerOpen(false)} /></div></div>}
    <UpgradeModal profile={profile} open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
  </>;
}
