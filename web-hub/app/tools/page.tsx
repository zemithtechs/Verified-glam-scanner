import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { ToolDirectory } from "@/components/ToolDirectory";
import { JsonLd } from "@/components/JsonLd";
import { TOOLS, isAvailable } from "@/lib/catalog";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo-meta";
import { PRICING, generationsFor } from "@/lib/pricing";
import styles from "@/components/browse.module.css";
import { titleCase } from "@/lib/title-case";

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
          <h1>{titleCase("Browse the beauty tools and see what your photo can do.")}</h1>
          <p>Pick a face report, a new hairstyle, a makeup shade, an outfit or an old photo to restore. Use a sample or your own photo and review the result before you download it. A new account covers {generationsFor(PRICING.starter.credits)} results for free, and one result uses {PRICING.creditsPerGeneration} credits. Results are styling ideas, not medical advice.</p>
          <Link href="#start-here-title" className={styles.heroLink}>Browse the tools <span aria-hidden="true">↓</span></Link>
        </div>
      </section>
      <div className={styles.pageWidth}><ToolDirectory /></div>
      <section className={styles.bottomCta}>
        <h2>{titleCase("Start with a face report on your own photo.")}</h2>
        <p>One selfie shows how your portrait reads before you try a new style. The report keeps your photo beside the notes, so you can check each point yourself. Free credits cover your first two results, and each one takes a few minutes.</p>
        <Link href="/face-beauty-analysis">Try Face Beauty Analysis <span aria-hidden="true">↗</span></Link>
      </section>
    </MarketingShell>
  );
}
