import Link from "next/link";
import { CATEGORIES, SITE, TOOLS, isBrowsableTool } from "@/lib/catalog";
import { Logo } from "./Logo";
import { appHref } from "@/lib/live-mode";
import { MegaHeader } from "./MegaHeader";

export { Logo } from "./Logo";

export function SiteHeader() {
  return <MegaHeader />;
}

/** One footer for marketing, category, and individual tool pages. */
export function SiteFooter({ className = "mt-24" }: { className?: string }) {
  const popular = TOOLS.filter((tool) => tool.popular && isBrowsableTool(tool)).slice(0, 8);
  const footerLink = "rounded-sm text-white/65 transition-colors hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <footer className={`${className} bg-ink text-white/65`}>
      <div className="mx-auto grid max-w-[1450px] grid-cols-2 gap-x-7 gap-y-10 px-7 py-12 text-sm sm:px-12 lg:grid-cols-5">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-white/80">Popular tools</p>
          <ul className="space-y-2.5">{popular.map((tool) => <li key={tool.slug}><Link href={`/${tool.slug}`} className={footerLink}>{tool.name}</Link></li>)}</ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-white/80">Explore all tools</p>
          <ul className="space-y-2.5">{CATEGORIES.map((category) => <li key={category.id}><Link href={`/category/${category.id}`} className={footerLink}>{category.name}</Link></li>)}</ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-white/80">Your workspace</p>
          <ul className="space-y-2.5">
            <li><Link href={appHref("/app")} className={footerLink}>Dashboard</Link></li>
            <li><Link href={appHref("/app/creations")} className={footerLink}>My creations</Link></li>
            <li><Link href="/pricing" className={footerLink}>Plans & credits</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-white/80">Support</p>
          <ul className="space-y-2.5">
            <li><Link href="/blog" className={footerLink}>Blog</Link></li>
            <li><Link href="/contact" className={footerLink}>Contact</Link></li>
            <li><Link href="/about" className={footerLink}>About us</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-white/80">More information</p>
          <ul className="space-y-2.5">
            <li><Link href="/privacy" className={footerLink}>Privacy policy</Link></li>
            <li><Link href="/terms" className={footerLink}>Terms of use</Link></li>
            <li><Link href="/delete-account" className={footerLink}>Delete account</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-7 py-7 sm:px-12">
        <div className="mx-auto flex max-w-[1354px] flex-wrap items-end justify-between gap-5">
          <div><Logo light /><p className="mt-3 max-w-sm text-xs leading-5 text-white/50">{SITE.tagline}. For entertainment and self-discovery, not medical or professional advice. 18+.</p></div>
          <p className="text-xs text-white/45">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /></>;
}
