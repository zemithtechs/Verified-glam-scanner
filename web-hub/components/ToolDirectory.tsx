"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { CATEGORIES, TOOLS, isBrowsableTool, type CategoryId } from "@/lib/catalog";
import { BrowseCard } from "./BrowseCard";
import styles from "./browse.module.css";

const FEATURED_SLUGS = [
  "face-beauty-analysis",
  "ai-skin-enhancement",
  "hairstyle-changer",
  "lip-color-changer",
  "virtual-try-on-clothes",
  "old-photo-restoration",
];

export function ToolDirectory({ initialCategory = "all" as CategoryId | "all", showSoon = true }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">(initialCategory);
  const [onlyFree, setOnlyFree] = useState(false);
  const featured = FEATURED_SLUGS.map((slug) => TOOLS.find((tool) => tool.slug === slug)).filter((tool) => tool !== undefined);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (!isBrowsableTool(tool)) return false;
      if (!showSoon && tool.status === "later") return false;
      if (category !== "all" && tool.category !== category) return false;
      if (onlyFree && (tool.credits > 0 || tool.status === "later")) return false;
      if (needle && !`${tool.name} ${tool.summary}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [query, category, onlyFree, showSoon]);
  const isDefault = !query.trim() && category === "all" && !onlyFree;
  const sections = CATEGORIES.filter((item) => category === "all" || category === item.id)
    .map((item) => ({
      category: item,
      tools: filtered.filter((tool) => tool.category === item.id && (!isDefault || !FEATURED_SLUGS.includes(tool.slug))),
    }))
    .filter((section) => section.tools.length > 0);

  function selectCategory(id: CategoryId | "all") {
    setCategory(id);
    window.setTimeout(() => document.getElementById("browse-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <div className={styles.directory}>
      {isDefault && (
        <section className={styles.featuredSection} aria-labelledby="start-here-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>START HERE</p>
              <h2 id="start-here-title">A good place to begin</h2>
              <p>Explore a report, preview a change, or bring an old photo back into focus.</p>
            </div>
          </div>
          <div className={styles.featuredGrid}>{featured.map((tool) => <BrowseCard key={tool.slug} tool={tool} featured />)}</div>
        </section>
      )}

      <div className={styles.browser} id="browse-results">
        <div className={styles.browserHeading}>
          <div>
            <p className={styles.eyebrow}>BROWSE THE COLLECTION</p>
            <h2>Find the right tool for your photo</h2>
          </div>
          <p>{filtered.length} {filtered.length === 1 ? "tool" : "tools"}{onlyFree ? " · Free to try" : ""}</p>
        </div>
        <div className={styles.controls}>
          <label className={styles.searchBox}>
            <Search size={19} strokeWidth={1.9} aria-hidden="true" />
            <span className="sr-only">Search beauty tools</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hair, skin, makeup..." />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button>}
          </label>
          <label className={styles.freeFilter}>
            <input type="checkbox" checked={onlyFree} onChange={(event) => setOnlyFree(event.target.checked)} />
            <span>Free to try</span>
          </label>
        </div>
        <nav className={styles.categoryChips} aria-label="Filter tools by category">
          <button type="button" aria-pressed={category === "all"} className={category === "all" ? styles.activeChip : ""} onClick={() => selectCategory("all")}>All tools</button>
          {CATEGORIES.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} className={category === item.id ? styles.activeChip : ""} onClick={() => selectCategory(item.id)}>{item.name}</button>)}
        </nav>

        {sections.length ? sections.map(({ category: item, tools }) => (
          <section key={item.id} className={styles.categorySection} id={`category-${item.id}`} aria-labelledby={`title-${item.id}`}>
            <div className={styles.categoryHeading}>
              <div>
                <h3 id={`title-${item.id}`}>{item.name}</h3>
                <p>{item.tagline}</p>
              </div>
              <Link href={`/category/${item.id}`}>View category <ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
            <div className={styles.cardGrid}>{tools.map((tool) => <BrowseCard key={tool.slug} tool={tool} />)}</div>
          </section>
        )) : <div className={styles.emptyState}><h3>No matches yet</h3><p>Try another search or clear the filters to see the full collection.</p><button type="button" onClick={() => { setQuery(""); setCategory("all"); setOnlyFree(false); }}>Clear filters</button></div>}
      </div>
    </div>
  );
}
