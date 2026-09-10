"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, Coins, LogOut, User } from "lucide-react";
import { authApi } from "@/lib/client-api";
import type { Profile } from "@/lib/types";
import { MobileNavLinks } from "./Sidebar";

export function TopBar({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await authApi.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="flex h-[76px] items-center justify-between gap-3 border-b border-(--color-border) bg-white px-4 sm:px-7">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 text-(--color-burgundy-dark)"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link href="/app" className="flex items-center gap-2 lg:hidden">
            <Image src="/images/logo.png" alt="Verified Glam" width={30} height={30} className="rounded-lg" />
            <span className="font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">Verified Glam</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-[13px] border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-burgundy-dark)">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-(--color-burgundy) shadow-sm"><Coins size={15} /></span>
            <span className="leading-none">
              <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-(--color-text-muted)">Credits</span>
              <span className="mt-1 block text-sm font-extrabold">{profile.credits_balance}</span>
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-burgundy) font-semibold text-white shadow-[0_6px_14px_rgba(82,13,28,0.18)]"
            >
              {(profile.display_name ?? profile.email)[0]?.toUpperCase()}
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-11 w-56 rounded-xl border border-(--color-border) bg-white shadow-lg py-1.5 z-20"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="px-4 py-2 text-sm text-(--color-text-muted) truncate border-b border-(--color-border)">
                  {profile.email}
                </div>
                <Link
                  href="/app/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-(--color-surface)"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} /> Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white flex flex-col">
            <div className="flex h-[76px] items-center justify-between border-b border-(--color-border) px-5">
              <span className="font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">Verified Glam</span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <MobileNavLinks onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
