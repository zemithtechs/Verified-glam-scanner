"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./home.module.css";
import { titleCase } from "@/lib/title-case";

const tabs = [
  { label: "Natural skin", title: "Skin looks softer and still looks real.", copy: "The example softens blemishes and keeps pores and texture visible, so the portrait still looks like you. Compare it with the starting photo before you save anything. If the edit feels too smooth, try again with a different photo.", image: "ai-skin-enhancement-feature-2.png", alt: "Side-by-side skin enhancement example with softer blemishes and natural texture kept", slug: "ai-skin-enhancement", cta: "Try skin enhancement" },
  { label: "Lip shades", title: "Find a lip shade that suits you.", copy: "Compare a lip color preview with your starting photo in one image. Try rose, berry or red on the same portrait before you buy a lipstick. Your skin, hair and light stay the same, so the shade is the only thing that changes.", image: "lip-color-changer-feature-2.png", alt: "Lip color preview shown next to the original photo for comparison", slug: "lip-color-changer", cta: "Try lip color" },
  { label: "Hair color", title: "Preview the new hair shade before you dye your hair.", copy: "A before-and-after view makes a new hair color easy to judge on your own portrait. Check the shade first, then show it to your colorist. Your real result still depends on the hair you start with, so treat the preview as an idea.", image: "ai-hair-color-feature-2.png", alt: "Before-and-after hair color preview on the same portrait", slug: "ai-hair-color", cta: "Try hair color" },
] as const;

export default function HomeTabs() {
  const [active, setActive] = useState(0);
  const selected = tabs[active];
  return <div className={styles.tabExperience}>
    <div className={styles.tabList} aria-label="Beauty preview examples">{tabs.map((tab, index) => <button key={tab.label} type="button" aria-pressed={active === index} className={active === index ? styles.tabActive : ""} onClick={() => setActive(index)}>{tab.label}</button>)}</div>
    <div className={styles.tabPanel}><div className={styles.tabMedia}><Image src={`/img/results/${selected.image}`} alt={selected.alt} fill sizes="(max-width: 850px) 100vw, 54vw" /></div><div className={styles.tabCopy}><span className={styles.smallLabel}>EXAMPLE RESULT</span><h3>{titleCase(selected.title)}</h3><p>{selected.copy}</p><Link href={`/${selected.slug}`} className={styles.darkButton}>{selected.cta}<ArrowUpRight size={17} /></Link></div></div>
  </div>;
}
