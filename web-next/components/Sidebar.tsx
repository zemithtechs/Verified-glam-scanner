"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, User, Lock, ScanFace, Palette, WandSparkles, Lightbulb, Stars, Scale, Trophy, GitCompareArrows, Ratio } from "lucide-react";
import { TOOLS } from "@/lib/tools";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const icons = [ScanFace, Palette, WandSparkles, Lightbulb, Stars, Scale, Trophy, GitCompareArrows, Sparkles, Ratio];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-5">
      <p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-(--color-text-muted)">Analysis tools</p>
      <div className="space-y-1">
      {TOOLS.map((tool, index) => {
        const href = `/app/${tool.slug}`;
        const active = pathname === href;
        const Icon = icons[index] ?? Sparkles;
        return (
          <Link
            key={tool.slug}
            href={href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              active
                ? "bg-(--color-burgundy) text-white shadow-[0_8px_18px_rgba(82,13,28,0.16)]"
                : "text-(--color-text) hover:bg-(--color-surface) hover:text-(--color-burgundy-dark)"
            }`}
          >
            <Icon size={17} strokeWidth={2.1} className={active ? "text-white" : "text-(--color-burgundy)"} />
            <span className="flex-1">{tool.title}</span>
            {tool.isPro && !active && <Lock size={14} className="text-(--color-text-muted)" />}
          </Link>
        );
      })}
      </div>
      <div className="mt-5 border-t border-(--color-border) pt-4">
        <p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-(--color-text-muted)">Account</p>
        <Link
          href="/app/profile"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/app/profile")
              ? "bg-(--color-burgundy) text-white"
              : "text-(--color-text) hover:bg-(--color-surface)"
          }`}
        >
          <User size={18} className={pathname.startsWith("/app/profile") ? "text-white" : "text-(--color-burgundy)"} />
          Profile
        </Link>
      </div>
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-(--sidebar-width) shrink-0 border-r border-(--color-border) bg-white">
      <div className="flex h-[76px] items-center border-b border-(--color-border) px-5">
        <Link href="/app" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Verified Glam" width={38} height={38} className="rounded-xl shadow-sm" />
          <span>
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-(--color-burgundy)">Verified Glam</span>
            <span className="block text-base font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">Scanner</span>
          </span>
        </Link>
      </div>
      <NavLinks />
    </aside>
  );
}

export function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  return <NavLinks onNavigate={onNavigate} />;
}
