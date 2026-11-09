"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { CATEGORIES, COUNTS, TOOLS, isAvailable, type Tool } from "@/lib/catalog";
import { MEGA_ORDER } from "@/lib/nav";
import { CategoryGlyph, Glyph, IconTile, ToolGlyph } from "./icons";
import { Logo } from "./Logo";
import { SideNav } from "./SideNav";

type Menu = "tools" | "popular" | "features" | null;

function Badge({ tool }: { tool: Tool }) {
  if (!tool.badge) return null;
  return <span className={`rounded px-1.5 py-px text-[10px] font-bold uppercase tracking-wide ${tool.badge === "HOT" ? "bg-berry text-white" : "bg-gold/25 text-[#6f5116]"}`}>{tool.badge}</span>;
}

const POPULAR_COLUMNS: { title: string; slugs: string[] }[] = [
  { title: "Face & skin", slugs: ["face-beauty-analysis", "attractiveness-test", "face-golden-ratio", "facial-symmetry", "skin-analysis"] },
  { title: "Looks to try", slugs: ["hairstyle-changer", "ai-hair-color", "lip-color-changer", "colored-contacts", "virtual-try-on-clothes"] },
  { title: "Fun & photo", slugs: ["cartoon-yourself", "old-photo-restoration", "ai-face-enhancer", "ai-skin-enhancement", "seasonal-color-palette"] },
];
const POPULAR_SLUGS = new Set(POPULAR_COLUMNS.flatMap((c) => c.slugs));
/** Everything live that the Popular menu does not already show. */
const MORE_TOOLS = TOOLS.filter((t) => isAvailable(t) && !POPULAR_SLUGS.has(t.slug));
const WORKSPACE = [
  { href: "/app", label: "Dashboard", glyph: "home" },
  { href: "/app/creations", label: "My creations", glyph: "folder" },
  { href: "/app/account", label: "Credits & plan", glyph: "coin" },
  { href: "/pricing", label: "Pricing & Pro", glyph: "coin" },
];

const itemClass = "group flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-[14px] font-medium text-ink transition-colors hover:bg-blush hover:text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum";
const colTitle = "px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

function ToolItem({ tool, close }: { tool: Tool; close: () => void }) {
  return (
    <Link href={`/${tool.slug}`} onClick={close} className={itemClass}>
      <IconTile size={30} className="!rounded-[8px]"><ToolGlyph slug={tool.slug} size={18} /></IconTile>
      <span className="min-w-0 flex-1 truncate">{tool.name}</span>
      <Badge tool={tool} />
    </Link>
  );
}

/** AI Tools: categories only. Each one opens its own category page. */
function ToolsPanel({ close }: { close: () => void }) {
  return (
    <div className="mx-auto max-w-[1080px] px-6 pb-4 pt-5">
      <div className="grid grid-cols-4 gap-x-2 gap-y-1">
        {MEGA_ORDER.map((id) => {
          const c = CATEGORIES.find((x) => x.id === id)!;
          const n = TOOLS.filter((t) => t.category === id && isAvailable(t)).length;
          return (
            <Link key={id} href={`/category/${id}`} onClick={close} className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum">
              <IconTile size={34} className="mt-0.5 transition-colors group-hover:!bg-white"><CategoryGlyph id={id} size={20} /></IconTile>
              <span className="min-w-0">
                <span className="flex items-baseline gap-1.5 text-[14px] font-semibold text-ink group-hover:text-plum">{c.name}<span className="text-[12px] font-medium text-muted">{n}</span></span>
                <span className="mt-0.5 block text-[12.5px] leading-[1.35] text-muted">{c.tagline}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
        <p className="text-[12.5px] text-muted">{COUNTS.available} tools across 8 categories</p>
        <Link href="/tools" onClick={close} className="inline-flex items-center gap-1.5 rounded-sm text-[13px] font-semibold text-plum hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum">Browse all tools<ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
    </div>
  );
}

function PopularPanel({ close }: { close: () => void }) {
  return (
    <div className="mx-auto grid max-w-[1080px] grid-cols-[210px_1fr] gap-8 px-6 py-5">
      <Link href="/face-beauty-analysis" onClick={close} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-[#faf9f8]"><Image src="/img/results/face-beauty-analysis.png" alt="" fill sizes="210px" className="object-cover" /></div>
        <p className="mt-2.5 text-[14px] font-semibold text-ink group-hover:text-plum">Start with the face beauty scan</p>
        <p className="mt-0.5 text-[12.5px] leading-[1.35] text-muted">One photo, one readable report.</p>
      </Link>
      <div className="grid grid-cols-3 gap-4">
        {POPULAR_COLUMNS.map((col) => (
          <section key={col.title} aria-label={col.title}>
            <h3 className={colTitle}>{col.title}</h3>
            <ul>{col.slugs.map((slug) => <li key={slug}><ToolItem tool={TOOLS.find((x) => x.slug === slug)!} close={close} /></li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function FeaturesPanel({ close }: { close: () => void }) {
  const half = Math.ceil(MORE_TOOLS.length / 2);
  return (
    <div className="mx-auto grid max-w-[1080px] grid-cols-[210px_1fr] gap-8 px-6 py-5">
      <div className="flex flex-col justify-between rounded-lg bg-ink p-4 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">Pro</p>
          <p className="mt-1.5 font-display text-[19px] font-semibold leading-tight">No ads, more credits, every tool.</p>
        </div>
        <Link href="/pricing" onClick={close} className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-plum text-[13px] font-semibold text-white hover:bg-berry focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">See plans<ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <section aria-label="More tools">
          <h3 className={colTitle}>More tools</h3>
          <ul>{MORE_TOOLS.slice(0, half).map((t) => <li key={t.slug}><ToolItem tool={t} close={close} /></li>)}</ul>
        </section>
        <section aria-label="More tools, continued">
          <h3 className={`${colTitle} invisible`} aria-hidden="true">More</h3>
          <ul>{MORE_TOOLS.slice(half).map((t) => <li key={t.slug}><ToolItem tool={t} close={close} /></li>)}</ul>
        </section>
        <section aria-label="Your workspace">
          <h3 className={colTitle}>Your workspace</h3>
          <ul>{WORKSPACE.map((w) => <li key={w.href}><Link href={w.href} onClick={close} className={itemClass}><span className="text-plum"><Glyph name={w.glyph} size={18} /></span>{w.label}</Link></li>)}</ul>
        </section>
      </div>
    </div>
  );
}

export function MegaHeader({ onOpenSidebar, maxWidth = "max-w-[1320px]" }: { onOpenSidebar?: () => void; maxWidth?: string }) {
  const path = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => { setMenu(null); setMobile(false); }, [path]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      document.querySelector<HTMLButtonElement>(`[aria-controls="mega-${menu}"]`)?.focus();
      setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);

  const trigger = (id: Exclude<Menu, null>, label: string) => (
    <button type="button" aria-haspopup="true" aria-expanded={menu === id} aria-controls={menu === id ? `mega-${id}` : undefined} onClick={() => setMenu(id)} onMouseEnter={() => setMenu(id)} className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${menu === id ? "bg-blush text-plum" : "text-ink hover:bg-blush/70"}`}>
      {label}<ChevronDown size={14} aria-hidden="true" className={`transition-transform ${menu === id ? "rotate-180" : ""}`} />
    </button>
  );
  const plain = "flex h-9 items-center rounded-lg px-3 text-[14px] font-semibold text-ink transition-colors hover:bg-blush/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white" onMouseLeave={() => setMenu(null)}>
      <div className={`mx-auto flex h-14 items-center justify-between px-4 sm:px-6 ${maxWidth}`}>
        <div className="flex items-center gap-3">
          <button type="button" data-tool-menu-trigger={onOpenSidebar ? true : undefined} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum lg:hidden" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={onOpenSidebar ? undefined : mobile} aria-controls={onOpenSidebar ? undefined : "mobile-site-menu"} onClick={() => (onOpenSidebar ? onOpenSidebar() : setMobile((v) => !v))}>{mobile && !onOpenSidebar ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
          <Logo />
        </div>
        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
          {trigger("tools", "AI Tools")}
          {trigger("popular", "Popular")}
          {trigger("features", "Features")}
          <Link href="/blog" aria-current={path.startsWith("/blog") ? "page" : undefined} className={plain} onMouseEnter={() => setMenu(null)}>Blog</Link>
          <Link href="/pricing" aria-current={path === "/pricing" ? "page" : undefined} className={plain} onMouseEnter={() => setMenu(null)}>Pricing</Link>
        </nav>
        <div className="flex items-center gap-1.5">
          <Link href="/app" className="hidden h-9 items-center rounded-lg px-3.5 text-[14.5px] font-semibold text-ink hover:bg-blush/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum sm:flex">Log in</Link>
          <Link href="/tools" className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-plum px-4 text-[14.5px] font-semibold text-white transition-colors hover:bg-berry focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"><span className="sm:hidden">Start</span><span className="hidden sm:inline">Start for free</span><ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>

      {menu && (
        <div id={`mega-${menu}`} role="region" aria-label={`${menu === "tools" ? "AI Tools" : menu === "popular" ? "Popular" : "Features"} menu`} className="absolute inset-x-0 top-full max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-line bg-white shadow-[0_16px_32px_rgba(31,18,32,0.09)]">
          {menu === "tools" ? <ToolsPanel close={() => setMenu(null)} /> : menu === "popular" ? <PopularPanel close={() => setMenu(null)} /> : <FeaturesPanel close={() => setMenu(null)} />}
        </div>
      )}

      {mobile && !onOpenSidebar && (
        <div id="mobile-site-menu" className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <div className="flex flex-col"><SideNav variant="tool" mode="accordion" onNavigate={() => setMobile(false)} /></div>
          <div className="grid gap-1 border-t border-line p-3 text-[15px] font-semibold"><Link href="/blog" className="rounded-lg px-3 py-3 hover:bg-blush">Blog</Link><Link href="/pricing" className="rounded-lg px-3 py-3 hover:bg-blush">Pricing</Link><Link href="/app" className="rounded-lg px-3 py-3 hover:bg-blush">Log in</Link></div>
        </div>
      )}
    </header>
  );
}
