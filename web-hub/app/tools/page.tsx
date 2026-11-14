import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { ToolDirectory } from "@/components/ToolDirectory";
import { JsonLd } from "@/components/JsonLd";
import { TOOLS, isAvailable } from "@/lib/catalog";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo-meta";
import styles from "@/components/browse.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Explore AI Beauty Tools for Your Photo",
  description: "Browse AI beauty tools: face analysis, skin analysis, hairstyle changer, virtual makeup try on, clothes try on, fun face effects and photo restoration.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <MarketingShell>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }])} />
      <JsonLd data={itemListSchema("AI Beauty Styling tools", TOOLS.filter(isAvailable))} />
      <section className={styles.directoryHero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>AI BEAUTY STYLING TOOLS</p>
          <h1>Explore what your photo can do</h1>
          <p>AI Beauty Styling brings AI beauty tools together in one place: face analysis and AI skin analysis, a hairstyle changer, virtual makeup try on, clothes and tattoo previews, fun face effects and old photo restoration. Pick a category or a tool, try a sample or your own photo, and review the result before you download it.</p>
          <Link href="#start-here-title" className={styles.heroLink}>Browse the tools <span aria-hidden="true">↓</span></Link>
        </div>
      </section>
      <div className={styles.pageWidth}><ToolDirectory /></div>
      <section className={styles.bottomCta}>
        <h2>Not sure where to start?</h2>
        <p>A face report gives you a simple first look at your portrait before you try a new style.</p>
        <Link href="/face-beauty-analysis">Try Face Beauty Analysis <span aria-hidden="true">↗</span></Link>
      </section>
    </MarketingShell>
  );
}
