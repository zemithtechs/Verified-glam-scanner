import Link from "next/link";
import NextImage from "next/image";
import { Megaphone } from "lucide-react";
import { type Category, type Tool } from "@/lib/catalog";
import { CategoryGlyph, Glyph, IconTile } from "./icons";
import { HANDOFF } from "@/lib/live-mode";

const LEGACY_GLYPH: Record<Category["icon"], string> = { scan: "c-face", palette: "c-color", sparkles: "c-skin", scissors: "c-hair", brush: "c-makeup", shirt: "c-fashion", smile: "c-fun", image: "c-photo" };

export function CategoryIcon({ icon, size = 20 }: { icon: Category["icon"]; size?: number }) {
  return <Glyph name={LEGACY_GLYPH[icon]} size={size} />;
}

export function CategoryBadge({ category, size = 44 }: { category: Category; size?: number }) {
  return (
    <IconTile size={size} className="ring-1 ring-line">
      <CategoryGlyph id={category.id} size={Math.round(size * 0.52)} />
    </IconTile>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function SectionHead({ eyebrow, title, sub, center }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-8 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-berry">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

export function StatusPill({ tool }: { tool: Tool }) {
  if (tool.status === "later") return <span className="rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-semibold text-muted">Coming soon</span>;
  if (tool.badge) return <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tool.badge === "HOT" ? "bg-berry text-white" : "bg-gold/20 text-[#7a5a1f]"}`}>{tool.badge}</span>;
  return null;
}

/** Shared tool card. Public and signed-in surfaces both link to the canonical tool page. */
export function ToolCard({ tool }: { tool: Tool; base?: string }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line/70 bg-white shadow-sm transition hover:border-berry/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry"
    >
      <div className="relative aspect-video bg-white">
        <NextImage src={`/img/results/${tool.slug}.png`} alt={`${tool.name}: complete example result`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-contain" />
      </div>
      <div className="flex flex-1 items-center justify-center px-3 py-4 text-center">
        <h3 className="text-[16px] font-semibold leading-snug text-ink sm:text-lg">{tool.name}</h3>
      </div>
    </Link>
  );
}

/**
 * Placeholder for an AdSense unit. Rendered as a visible dashed box in this
 * preview so the layout team can see where ads will go. In production this
 * component renders <ins class="adsbygoogle"> for free users and nothing for Pro.
 */
export function AdSlot({ label, size = "728×90", className = "" }: { label: string; size?: string; className?: string }) {
  if (HANDOFF) return null; // no ad placeholders on the deployed site until ads are approved and enabled
  return (
    <div className={`flex min-h-[90px] items-center justify-center gap-2 rounded-xl border border-dashed border-berry/40 bg-blush/60 px-4 py-3 text-center text-xs font-semibold text-berry ${className}`}>
      <Megaphone size={14} />
      <span>AD SLOT · {label} · {size} · hidden for Pro</span>
    </div>
  );
}

export function PrimaryButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-plum to-berry px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(184,50,95,0.3)] transition hover:brightness-110 ${className}`}>
      {children}
    </Link>
  );
}

export function GhostButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-full border border-plum/25 bg-white px-6 py-3 text-sm font-bold text-plum transition hover:bg-blush ${className}`}>
      {children}
    </Link>
  );
}
