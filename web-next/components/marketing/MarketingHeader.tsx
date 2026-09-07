"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { DEFAULT_TOOL_SLUG } from "@/lib/tools";
import { GooglePlayBadge } from "./GooglePlayBadge";

const MEGA_COLUMNS = [
  {
    title: "Face analysis",
    links: [
      { label: "Face Beauty Analysis", href: "/face-beauty-analysis", badge: "Popular" },
      { label: "Attractiveness Test", href: "/attractiveness-test" },
      { label: "Facial Symmetry", href: "/facial-symmetry" },
      { label: "Face Golden Ratio", href: "/face-golden-ratio" },
    ],
  },
  {
    title: "Style & match",
    links: [
      { label: "Seasonal Color Palette", href: "/seasonal-color-palette" },
      { label: "Celebrity Look Alike", href: "/celebrity-look-alike" },
      { label: "Beauty Tips", href: "/beauty-tips" },
      { label: "Face Comparison", href: "/face-comparison" },
    ],
  },
  {
    title: "Programs & fun",
    links: [
      { label: "Beauty Routine Challenge", href: "/beauty-routine-challenge", badge: "New" },
      { label: "Beauty Score Showdown", href: "/beauty-score-showdown", badge: "New" },
      { label: "All tools", href: "/tools" },
    ],
  },
];

const ALL_TOOL_LINKS = [
  { label: "Face Beauty Analysis", href: "/face-beauty-analysis" },
  { label: "Seasonal Color Palette", href: "/seasonal-color-palette" },
  { label: "Beauty Routine Challenge", href: "/beauty-routine-challenge" },
  { label: "Beauty Tips", href: "/beauty-tips" },
  { label: "Celebrity Look Alike", href: "/celebrity-look-alike" },
  { label: "Facial Symmetry", href: "/facial-symmetry" },
  { label: "Beauty Score Showdown", href: "/beauty-score-showdown" },
  { label: "Face Comparison", href: "/face-comparison" },
  { label: "Attractiveness Test", href: "/attractiveness-test" },
  { label: "Face Golden Ratio", href: "/face-golden-ratio" },
];

function Badge({ text }: { text: string }) {
  const isNew = text === "New";
  return (
    <span
      className={`ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        isNew ? "bg-green-100 text-green-700" : "bg-(--color-blush) text-(--color-burgundy)"
      }`}
    >
      {text}
    </span>
  );
}

export function MarketingHeader({ isSignedIn }: { isSignedIn: boolean }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!megaOpen) return;
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [megaOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white border-b border-(--color-border)">
      <div className="max-w-(--max-content) mx-auto flex items-center gap-4 px-4 sm:px-6 h-[72px]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/images/logo.png" alt="" width={36} height={36} className="rounded-lg" />
          <span className="hidden sm:inline text-lg font-extrabold text-(--color-burgundy-dark)">Verified Glam Scanner</span>
          <span className="sm:hidden text-lg font-extrabold text-(--color-burgundy-dark)">Verified Glam</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-(--color-text) ml-4">
          <button
            onClick={() => setMegaOpen((v) => !v)}
            aria-expanded={megaOpen}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold ${
              megaOpen ? "bg-(--color-blush) text-(--color-burgundy)" : "hover:bg-(--color-surface)"
            }`}
          >
            AI Tools <ChevronDown size={14} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
          </button>
          <Link href="/pricing" className="px-3 py-2 rounded-lg hover:bg-(--color-surface)">
            Pricing
          </Link>
          <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-(--color-surface)">
            About
          </Link>
          {!isSignedIn && (
            <Link href="/login" className="px-3 py-2 rounded-lg hover:bg-(--color-surface)">
              Log in
            </Link>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5 ml-auto">
          {isSignedIn ? (
            <Link
              href={`/app/${DEFAULT_TOOL_SLUG}`}
              className="rounded-full bg-(--color-burgundy) text-white font-semibold px-5 py-2.5 hover:opacity-90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="font-semibold text-(--color-text) px-3 py-2 hover:text-(--color-burgundy)">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-(--color-border) font-semibold px-4 py-2.5 hover:bg-(--color-surface)"
              >
                Sign up
              </Link>
            </>
          )}
          <GooglePlayBadge className="h-9" />
        </div>

        <button className="lg:hidden p-2 ml-auto text-(--color-burgundy-dark)" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>

      {/* Full-width mega menu — anchored to the header itself (not the
          small toggle button) so it's centered under the whole page,
          matching a real mega-menu instead of sitting lopsided wherever
          the button happens to be. */}
      {megaOpen && (
        <>
          <div className="fixed inset-0 top-[72px] bg-black/20 z-30" aria-hidden="true" />
          <div className="absolute left-0 right-0 top-full z-40 border-t border-(--color-border) bg-white shadow-[0_24px_56px_rgba(135,43,63,0.18)]">
            <div className="max-w-(--max-content) mx-auto px-4 sm:px-6 py-8 grid grid-cols-[280px_1fr] gap-8">
              <div>
                <div className="rounded-xl overflow-hidden aspect-[3/2] relative mb-3">
                  <Image src="/images/lifestyle/value-scan.jpg" alt="" fill className="object-cover" />
                </div>
                <p className="font-bold text-(--color-burgundy-dark)">Verified Glam Scanner</p>
                <p className="mt-1 text-sm text-(--color-text-muted) leading-relaxed">
                  An all-in-one AI beauty analysis platform — upload a selfie for face scores, symmetry, color
                  palettes, tips, and fun challenges.
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/app/${DEFAULT_TOOL_SLUG}`}
                    onClick={() => setMegaOpen(false)}
                    className="rounded-full bg-(--color-burgundy) text-white text-xs font-semibold px-3.5 py-2"
                  >
                    Start analysis
                  </Link>
                  <Link
                    href="/tools"
                    onClick={() => setMegaOpen(false)}
                    className="rounded-full border border-(--color-border) text-xs font-semibold px-3.5 py-2"
                  >
                    Browse tools
                  </Link>
                </div>
                <Link href="/tools" onClick={() => setMegaOpen(false)} className="mt-3 inline-block text-sm font-semibold text-(--color-burgundy)">
                  Explore all tools →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {MEGA_COLUMNS.map((col) => (
                  <div key={col.title}>
                    <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted) mb-3">{col.title}</p>
                    <ul className="space-y-2.5">
                      {col.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setMegaOpen(false)}
                            className="text-sm text-(--color-text) hover:text-(--color-burgundy) flex items-center flex-wrap"
                          >
                            {link.label}
                            {link.badge && <Badge text={link.badge} />}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-(--color-border)">
              <span className="font-bold text-(--color-burgundy-dark)">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="p-5 flex gap-2">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center rounded-full bg-(--color-burgundy) text-white font-semibold px-4 py-2.5"
              >
                Sign up free
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center rounded-full border border-(--color-border) font-semibold px-4 py-2.5"
              >
                Log in
              </Link>
            </div>
            <div className="px-5 pb-5">
              <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted) mb-2">Explore</p>
              <div className="flex flex-col">
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-(--color-border) text-(--color-text)">
                  Pricing
                </Link>
                <Link href="/about" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-(--color-border) text-(--color-text)">
                  About
                </Link>
                <Link
                  href={`/app/${DEFAULT_TOOL_SLUG}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 border-b border-(--color-border) text-(--color-text)"
                >
                  Start analysis
                </Link>
              </div>
            </div>
            <div className="px-5 pb-5">
              <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted) mb-2">AI Tools</p>
              <div className="flex flex-col">
                <Link href="/tools" onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-(--color-border) text-(--color-text)">
                  All tools
                </Link>
                {ALL_TOOL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 border-b border-(--color-border) text-(--color-text)"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-5 mt-auto flex justify-center">
              <GooglePlayBadge />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
