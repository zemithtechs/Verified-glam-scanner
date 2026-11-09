"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { MegaHeader } from "./MegaHeader";
import { SIDEBAR_W, SideNav } from "./SideNav";
import { SiteFooter } from "./SiteChrome";

export function ToolPageShell({ children }: { children: React.ReactNode; category?: string }) {
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!drawer) return;
    const first = drawerRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close menu"]');
    first?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setDrawer(false); return; }
      if (event.key !== "Tab") return;
      const focusable = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
      if (!focusable.length) return;
      const firstItem = focusable[0];
      const lastItem = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus(); }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.querySelector<HTMLButtonElement>('[data-tool-menu-trigger]')?.focus();
    };
  }, [drawer]);

  return <div className="tool-page-shell min-h-screen bg-[#f4f4f6] text-[#353642]">
    <a href="#main-content" className="fixed left-5 top-2 z-[70] -translate-y-20 rounded-md bg-plum px-4 py-3 text-sm font-semibold text-white focus:translate-y-0">Skip to content</a>
    <MegaHeader onOpenSidebar={() => setDrawer(true)} maxWidth="max-w-none" />

    <aside aria-label="Tools" className="fixed bottom-0 left-0 top-14 z-30 hidden flex-col border-r border-line bg-white lg:flex" style={{ width: SIDEBAR_W }}>
      <SideNav variant="tool" headerH={56} />
    </aside>

    {drawer && <div className="fixed inset-0 z-[60] flex lg:hidden">
      <div ref={drawerRef} className="flex w-[min(320px,88vw)] flex-col bg-white shadow-xl" role="dialog" aria-modal="true" aria-label="Tool menu">
        <div className="flex h-14 items-center justify-between border-b border-line px-4"><Logo /><button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"><X size={20} aria-hidden="true" /></button></div>
        <SideNav variant="tool" mode="accordion" onNavigate={() => setDrawer(false)} />
        <div className="grid gap-1 border-t border-line p-3 text-sm font-semibold">
          <Link href="/blog" onClick={() => setDrawer(false)} className="rounded-lg px-3 py-2.5 text-ink hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-plum">Blog</Link>
          <Link href="/pricing" onClick={() => setDrawer(false)} className="rounded-lg px-3 py-2.5 text-ink hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-plum">Pricing</Link>
        </div>
      </div>
      <button type="button" tabIndex={-1} aria-label="Close menu" className="flex-1 bg-ink/40" onClick={() => setDrawer(false)} />
    </div>}

    <div className="lg:ml-[208px]">
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1600px] scroll-mt-20 px-2 py-2 sm:px-4 sm:py-4">{children}</main>
      <SiteFooter className="mt-2" />
    </div>
  </div>;
}
