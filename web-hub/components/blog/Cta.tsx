import Link from "next/link";
import { IconBrandGooglePlay, IconWorld, IconArrowRight } from "@tabler/icons-react";
import { GOOGLE_PLAY_URL } from "@/lib/site-info";
import styles from "./blog.module.css";

const playProps = { href: GOOGLE_PLAY_URL, target: "_blank", rel: "noopener noreferrer" } as const;

/** Sidebar card: Google Play. */
export function AppCard() {
  return (
    <div className="shrink-0 rounded-2xl border border-line bg-white p-4">
      <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-berry"><IconBrandGooglePlay size={16} aria-hidden="true" />Android app</p>
      <p className="mt-1 font-sans text-base font-bold leading-6 text-ink">Get the Android app</p>
      <p className="mt-1 text-[13px] leading-5 text-muted">Take the tools with you on Android.</p>
      <a {...playProps} className={`${styles.btn} ${styles.btnDark} mt-3 w-full`}><IconBrandGooglePlay size={20} aria-hidden="true" />Get it on Google Play</a>
    </div>
  );
}

/** Sidebar card: web tool plus the tools hub. */
export function WebCard({ toolName, toolHref }: { toolName: string; toolHref: string }) {
  return (
    <div className="shrink-0 rounded-2xl border border-line bg-blush p-4">
      <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-berry"><IconWorld size={16} aria-hidden="true" />On the web</p>
      <p className="mt-1 font-sans text-base font-bold leading-6 text-ink">Try it on the web</p>
      <p className="mt-1 text-[13px] leading-5 text-muted">No download needed. Upload a photo and see a preview in a minute.</p>
      <Link href={toolHref} className={`${styles.btn} ${styles.btnPrimary} mt-3 w-full`}>Open {toolName}<IconArrowRight size={16} aria-hidden="true" /></Link>
      <Link href="/tools" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-plum underline underline-offset-4 hover:text-berry">Browse all tools</Link>
    </div>
  );
}

type InlineProps = { variant: "app" | "tool"; headline: string; text?: string; label?: string; toolHref?: string };

/** Inline call to action with its own headline and a real link. */
export function InlineCta({ variant, headline, text, label, toolHref }: InlineProps) {
  return (
    <aside aria-label={headline} className="my-2 flex flex-col gap-4 rounded-2xl border border-[#e8bfd0] bg-[linear-gradient(120deg,#fff,#fdeef2)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6" style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}>
      <div>
        <p className="text-lg font-bold leading-6 text-ink">{headline}</p>
        {text && <p className="mt-1.5 text-[15px] leading-6 text-muted">{text}</p>}
      </div>
      {variant === "app"
        ? <a {...playProps} className={`${styles.btn} ${styles.btnDark} shrink-0`}><IconBrandGooglePlay size={20} aria-hidden="true" />{label ?? "Get it on Google Play"}</a>
        : <Link href={toolHref ?? "/tools"} className={`${styles.btn} ${styles.btnPrimary} shrink-0`}>{label ?? "Open the web app"}<IconArrowRight size={16} aria-hidden="true" /></Link>}
    </aside>
  );
}
