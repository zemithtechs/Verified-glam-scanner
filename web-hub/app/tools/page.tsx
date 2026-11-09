import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { ToolDirectory } from "@/components/ToolDirectory";
import styles from "@/components/browse.module.css";

export const metadata: Metadata = {
  title: "Explore AI Beauty Tools",
  description: "Explore face reports, photo retouching, hair, makeup and style tools. Find the right tool for your photo in the AI Beauty Styling collection.",
};

export default function ToolsPage() {
  return (
    <MarketingShell>
      <section className={styles.directoryHero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>AI BEAUTY STYLING TOOLS</p>
          <h1>Explore what your photo can do</h1>
          <p>Get a closer look, try a new color, or see a style before you make the change. Pick a tool that fits what you have in mind.</p>
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
