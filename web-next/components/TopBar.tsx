"use client";

import { useState } from "react";
import Link from "next/link";
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
      <header className="h-[72px] flex items-center justify-between gap-3 px-4 sm:px-6 border-b border-(--color-border) bg-white">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 text-(--color-burgundy-dark)"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link href="/app" className="lg:hidden font-extrabold text-(--color-burgundy-dark)">
            Verified Glam
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-(--color-surface) border border-(--color-border) px-3 py-1.5 text-sm font-semibold text-(--color-burgundy-dark)">
            <Coins size={16} />
            {profile.credits_balance}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-(--color-rose) text-white flex items-center justify-center font-semibold"
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
            <div className="h-[72px] flex items-center justify-between px-5 border-b border-(--color-border)">
              <span className="font-extrabold text-(--color-burgundy-dark)">Verified Glam</span>
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
