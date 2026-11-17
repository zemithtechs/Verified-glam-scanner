"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog-utils";
import { titleCase } from "@/lib/title-case";

/** Jump links for the article headings. Highlights the heading being read. */
export function TocList({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const targets = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id); else visible.delete(entry.target.id);
      }
      const first = targets.find((el) => visible.has(el.id));
      if (first) setActive(first.id);
    }, { rootMargin: "-90px 0px -65% 0px" });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <ol className="space-y-0.5 text-sm leading-5">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "ml-4" : undefined}>
          <a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} className={`block rounded-md border-l-2 px-3 py-2 lg:py-0.5 transition-colors hover:text-plum ${active === item.id ? "border-berry bg-blush font-semibold text-plum" : "border-transparent text-muted"}`}>{titleCase(item.text)}</a>
        </li>
      ))}
    </ol>
  );
}
