"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, User, Lock } from "lucide-react";
import { TOOLS } from "@/lib/tools";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {TOOLS.map((tool) => {
        const href = `/app/${tool.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={tool.slug}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-(--color-burgundy) text-white"
                : "text-(--color-text) hover:bg-(--color-surface)"
            }`}
          >
            <Sparkles size={18} className={active ? "text-white" : "text-(--color-burgundy)"} />
            <span className="flex-1">{tool.title}</span>
            {tool.isPro && !active && <Lock size={14} className="text-(--color-text-muted)" />}
          </Link>
        );
      })}
      <div className="pt-2 mt-2 border-t border-(--color-border)">
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
      <div className="h-[72px] flex items-center px-5 border-b border-(--color-border)">
        <Link href="/app" className="text-lg font-extrabold text-(--color-burgundy-dark)">
          Verified Glam
        </Link>
      </div>
      <NavLinks />
    </aside>
  );
}

export function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  return <NavLinks onNavigate={onNavigate} />;
}
