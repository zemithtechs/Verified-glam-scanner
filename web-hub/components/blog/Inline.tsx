import Link from "next/link";
import type { ReactNode } from "react";

/** Turns [anchor](/path) and [anchor](https://...) into links. External links open in a new tab with rel="noopener noreferrer". */
export function renderInline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    if (/^https?:\/\//.test(href)) return <a key={index} href={href} target="_blank" rel="noopener noreferrer">{label}</a>;
    if (href.startsWith("#")) return <a key={index} href={href}>{label}</a>;
    return <Link key={index} href={href}>{label}</Link>;
  });
}
