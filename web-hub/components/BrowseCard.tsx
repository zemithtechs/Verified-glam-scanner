import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/catalog";
import styles from "./browse.module.css";

export function BrowseCard({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
  const content = (
    <>
      <span className={styles.cardImage}>
        <Image
          src={`/img/results/${tool.slug}.png`}
          alt={`Illustrative result for ${tool.name}`}
          fill
          sizes={featured ? "(max-width: 640px) 82vw, (max-width: 1000px) 46vw, 30vw" : "(max-width: 640px) 48vw, (max-width: 1000px) 30vw, 23vw"}
          className={styles.image}
        />
        {tool.status === "later" && <span className={styles.soonBadge}>Coming soon</span>}
      </span>
      <span className={styles.cardBody}>
        <span className={styles.cardTitle}>{tool.name}</span>
        {tool.status !== "later" && <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} className={styles.cardArrow} />}
      </span>
      {featured && <span className={styles.cardSummary}>{tool.summary}</span>}
    </>
  );
  const className = `${styles.card} ${featured ? styles.featuredCard : ""} ${tool.status === "later" ? styles.unavailableCard : ""}`;
  if (tool.status === "later") return <article className={className}>{content}</article>;
  return <Link href={`/${tool.slug}`} className={className}>{content}</Link>;
}
