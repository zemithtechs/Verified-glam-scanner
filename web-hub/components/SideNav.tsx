"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Lock } from "lucide-react";
import { TOOLS, categoryById, isBrowsableTool, toolBySlug, type CategoryId, type Tool } from "@/lib/catalog";
import { NAV_GROUPS } from "@/lib/nav";
import { CategoryGlyph, Glyph, IconTile, ToolGlyph } from "./icons";
import type { Category } from "@/lib/catalog";

export const SIDEBAR_W = 208;

function Pill({ tool }: { tool: Tool }) {
  if (tool.status === "later") return <span className="rounded-md bg-ink/[0.07] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Soon</span>;
  if (tool.badge) return <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tool.badge === "HOT" ? "bg-berry text-white" : "bg-gold/25 text-[#6f5116]"}`}>{tool.badge}</span>;
  return null;
}

function ToolRow({ tool, active, onClick, bare = false }: { tool: Tool; active: boolean; onClick: () => void; bare?: boolean }) {
  return (
    <Link href={`/${tool.slug}`} onClick={onClick} aria-current={active ? "page" : undefined} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${active ? "bg-blush text-plum" : "text-ink hover:bg-blush/60"}`}>
      <span className="text-plum"><ToolGlyph slug={tool.slug} size={18} /></span>
      <span className={`min-w-0 flex-1 truncate text-[13.5px] ${active ? "font-semibold" : "font-medium"}`}>{tool.name}</span>
      {!bare && <Pill tool={tool} />}
      {!bare && tool.pro && <Lock size={12} className="shrink-0 text-muted" aria-label="Pro" />}
    </Link>
  );
}

/**
 * Grouped category navigation.
 *  - mode "flyout": category rows open a panel beside the sidebar listing every tool (desktop).
 *  - mode "accordion": category rows expand in place (mobile drawer).
 */
export function SideNav({ variant, mode = "flyout", headerH = 64, onNavigate }: { variant: "tool" | "dash"; mode?: "flyout" | "accordion"; headerH?: number; onNavigate?: () => void }) {
  const path = usePathname();
  const tool = toolBySlug(path.slice(1));
  const activeCat: CategoryId | null = tool?.category ?? (path.startsWith("/category/") ? (path.split("/")[2] as CategoryId) : null);
  const [open, setOpen] = useState<CategoryId | null>(mode === "accordion" ? activeCat : null);
  const [anchorTop, setAnchorTop] = useState(0);
  const keyboardOpen = useRef(false);

  useEffect(() => { setOpen(mode === "accordion" ? activeCat : null); }, [path]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open && mode === "flyout" && keyboardOpen.current) {
      document.querySelector<HTMLAnchorElement>("#nav-flyout a")?.focus();
      keyboardOpen.current = false;
    }
  }, [open, mode]);
  useEffect(() => {
    if (!open || mode !== "flyout") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      document.querySelector<HTMLButtonElement>(`[data-nav-category="${open}"]`)?.focus();
      setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, mode]);

  const done = () => { setOpen(null); onNavigate?.(); };
  const top = variant === "dash"
    ? [{ href: "/app", label: "Home", glyph: "home" }, { href: "/app/creations", label: "My creations", glyph: "folder" }, { href: "/app/account", label: "Credits & plan", glyph: "coin" }]
    : [{ href: "/tools", label: "Browse all tools", glyph: "grid" }, { href: "/app", label: "Dashboard", glyph: "home" }];
  const openCat = open ? categoryById(open) : null;
  const openTools = open ? TOOLS.filter((t) => t.category === open && isBrowsableTool(t)) : [];

  return (
    <>
      <nav aria-label="Tool categories" className="nav-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3">
        <ul className="space-y-0.5">
          {top.map((item) => {
            const active = path === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} onClick={done} aria-current={active ? "page" : undefined} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${active ? "bg-blush font-semibold text-plum" : "font-medium text-ink hover:bg-blush/60"}`}>
                  <span className="text-plum"><Glyph name={item.glyph} size={18} /></span>{item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mt-4">
            <p className="px-2.5 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">{group.label}</p>
            <ul className="space-y-0.5">
              {group.categories.map((id) => {
                const c = categoryById(id);
                const tools = TOOLS.filter((t) => t.category === id && isBrowsableTool(t));
                const isOpen = open === id;
                const isHere = activeCat === id;
                return (
                  <li key={id}>
                    <button type="button" data-nav-category={id} aria-expanded={isOpen} aria-controls={isOpen ? (mode === "flyout" ? "nav-flyout" : `nav-acc-${id}`) : undefined} onClick={(e) => { keyboardOpen.current = e.detail === 0; setAnchorTop(e.currentTarget.getBoundingClientRect().top); setOpen(isOpen ? null : id); }} className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${isOpen ? "bg-blush text-plum" : isHere ? "bg-cream text-plum" : "text-ink hover:bg-blush/60"} ${isHere || isOpen ? "font-semibold" : "font-medium"}`}>
                      <IconTile size={25} className="!rounded-md"><CategoryGlyph id={id} size={17} /></IconTile>
                      <span className="min-w-0 flex-1 truncate">{c.name}</span>
                      {mode === "flyout" ? <ChevronRight size={14} className="shrink-0 text-muted" /> : <ChevronDown size={15} className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                    </button>
                    {mode === "accordion" && isOpen && (
                      <ul id={`nav-acc-${id}`} className="ml-[18px] mt-0.5 space-y-0.5 border-l border-line pl-1.5">
                        {tools.map((t) => <li key={t.slug}><ToolRow tool={t} active={path === `/${t.slug}`} onClick={done} /></li>)}
                        <li><Link href={`/category/${id}`} onClick={done} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-plum hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum">View all {c.name}<ChevronRight size={14} aria-hidden="true" /></Link></li>
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {mode === "flyout" && openCat && (
        <>
          <button type="button" tabIndex={-1} aria-label="Close menu" onClick={() => setOpen(null)} className="fixed z-40 cursor-default" style={{ top: headerH, left: SIDEBAR_W, right: 0, bottom: 0 }} />
          <Flyout cat={openCat} tools={openTools} anchorTop={anchorTop} headerH={headerH} path={path} onNavigate={done} />
        </>
      )}
    </>
  );
}

/** Floating tool panel: detached from the sidebar, positioned beside the clicked row and kept on screen. */
function Flyout({ cat, tools, anchorTop, headerH, path, onNavigate }: { cat: Category; tools: Tool[]; anchorTop: number; headerH: number; path: string; onNavigate: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(Math.max(headerH + 8, anchorTop - 6));
  const wide = tools.length > 4;

  useLayoutEffect(() => {
    const place = () => {
      const h = ref.current?.offsetHeight ?? 0;
      setTop(Math.max(headerH + 8, Math.min(anchorTop - 6, window.innerHeight - h - 12)));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [anchorTop, headerH, tools.length]);

  return (
    <div ref={ref} id="nav-flyout" role="region" aria-label={`${cat.name} tools`} style={{ top, left: SIDEBAR_W + 10, maxHeight: `calc(100vh - ${headerH + 20}px)` }}
      className={`fixed z-[45] flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_rgba(31,18,32,0.16)] ${wide ? "w-[560px]" : "w-[296px]"}`}>
      <div className="flex items-center gap-3 border-b border-line bg-blush/40 px-4 pb-3 pt-3.5">
        <IconTile size={34} className="!bg-white"><CategoryGlyph id={cat.id} size={19} /></IconTile>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-5 text-ink">{cat.name}</p>
          <p className="truncate text-[12px] leading-4 text-muted">{cat.tagline}</p>
        </div>
      </div>
      <ul className={`nav-scroll-panel grid min-h-0 flex-1 gap-1 overflow-y-auto overscroll-contain px-2.5 py-2.5 ${wide ? "grid-cols-2" : "grid-cols-1"}`}>
        {tools.map((t) => {
          const active = path === `/${t.slug}`;
          return (
            <li key={t.slug}>
              <Link href={`/${t.slug}`} onClick={onNavigate} aria-current={active ? "page" : undefined} title={t.name}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum ${active ? "bg-blush text-plum" : "text-ink hover:bg-blush/60"}`}>
                <span className="text-plum"><ToolGlyph slug={t.slug} size={18} /></span>
                <span className={`min-w-0 flex-1 truncate text-[13.5px] ${active ? "font-semibold" : "font-medium"}`}>{t.name}</span>
                <Pill tool={t} />
                {t.pro && <Lock size={12} className="shrink-0 text-muted" aria-label="Pro" />}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href={`/category/${cat.id}`} onClick={onNavigate} className="flex items-center justify-between border-t border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-plum transition-colors hover:bg-blush/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum">
        See all {cat.name}<ChevronRight size={15} />
      </Link>
    </div>
  );
}
