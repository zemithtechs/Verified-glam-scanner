import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { toolBySlug } from "@/lib/catalog";
import { featureAlt } from "@/lib/image-alt";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo-meta";
import { getToolPageContent } from "@/lib/tool-page-content";
import { PRICING, generationsFor, money } from "@/lib/pricing";
import { Container } from "@/components/ui";
import HomeTabs from "./HomeTabs";
import styles from "./home.module.css";
import { titleCase } from "@/lib/title-case";

export const metadata: Metadata = buildMetadata({
  title: "AI Beauty Styling: Free AI Beauty Tools for Your Photo",
  description: `Free AI beauty tools for your photo: face analysis, hairstyle changer, virtual makeup try on and clothes try on. Start with ${PRICING.starter.credits} free credits.`,
  path: "/",
  exactTitle: true,
});

const FLOATS = [
  { slug: "face-beauty-analysis", image: "face-beauty-analysis-natural-v2.png", alt: "Sample portrait of a woman with dark curly hair in a blue t-shirt, used to demo Face Beauty Analysis", position: "floatOne" },
  { slug: "facial-symmetry", image: "facial-symmetry-natural-v2.png", alt: "Sample front-facing portrait of a man with dark hair and a green jacket, used for the Facial Symmetry Test", position: "floatTwo" },
  { slug: "hairstyle-changer", image: "hairstyle-changer-natural-v2.png", alt: "Sample portrait of a woman with curly hair pinned up, used to preview styles with the Hairstyle Changer", position: "floatThree" },
  { slug: "lip-color-changer", image: "lip-color-changer-natural-v2.png", alt: "Close sample portrait of a woman with short curly hair, used to try shades with the Lip Color Changer", position: "floatFour" },
  { slug: "virtual-try-on-clothes", image: "virtual-try-on-clothes-natural-v2.png", alt: "Sample full-length photo of a woman in a beige shirt and jeans, used for Virtual Clothes Try-On", position: "floatFive" },
] as const;

const FIRST_TOOLS = [
  { slug: "face-beauty-analysis", name: "Face Beauty Analysis", preview: "face-beauty-analysis-detail-3.png", focus: "10% center", label: "Face report", cta: "Try the face report" },
  { slug: "hairstyle-changer", name: "Hairstyle Changer", preview: "hairstyle-changer-feature-1.png", focus: "17% center", label: "Hair", cta: "Try new hairstyles" },
  { slug: "facial-symmetry", name: "Facial Symmetry Test", preview: "facial-symmetry-feature-2.png", focus: "50% center", label: "Face report", cta: "Test your symmetry" },
  { slug: "virtual-try-on-clothes", name: "Virtual Clothes Try-On", preview: "virtual-try-on-clothes-feature-1.png", focus: "17% center", label: "Style", cta: "Try on clothes" },
  { slug: "lip-color-changer", name: "Lip Color Changer", preview: "lip-color-changer-feature-1.png", focus: "17% center", label: "Makeup", cta: "Try a lip shade" },
  { slug: "beauty-tips", name: "Beauty Tips", preview: "beauty-tips-feature-1.png", focus: "15% center", label: "Ideas", cta: "Get beauty tips" },
] as const;

const EDIT_TOOLS = [
  { slug: "old-photo-restoration", name: "Old Photo Restoration", image: "old-photo-restoration.png", copy: "See a faded portrait beside a restored version." },
  { slug: "face-comparison", name: "Face Comparison", image: "face-comparison.png", copy: "Put two adult portraits side by side in one image." },
  { slug: "colored-contacts", name: "Colored Contacts", image: "colored-contacts.png", copy: "See how a different eye color looks on your photo." },
  { slug: "facial-symmetry", name: "Facial Symmetry", image: "facial-symmetry.png", copy: "See how balanced the two sides of your face look." },
  { slug: "lip-color-changer", name: "Lip Color Changer", image: "lip-color-changer.png", copy: "Put two lip shades side by side." },
] as const;

const STYLE_TOOLS = [
  { slug: "hairstyle-changer", name: "Hairstyle Changer", image: "hairstyle-changer.png", copy: "See a new cut on your own face before you book." },
  { slug: "seasonal-color-palette", name: "Seasonal Color Palette", image: "seasonal-color-palette.png", copy: "Get six shades that suit your skin, hair and eyes." },
  { slug: "virtual-try-on-clothes", name: "Virtual Clothes Try-On", image: "virtual-try-on-clothes.png", copy: "See the outfit before you make a choice." },
] as const;

function DarkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className={styles.darkButton}>{children}<ArrowUpRight size={17} strokeWidth={2} /></Link>;
}

/** Alt text for a close-up crop taken from a tool's feature or detail image (e.g. hairstyle-changer-feature-1.png). */
function previewAlt(slug: string, file: string) {
  const tool = toolBySlug(slug);
  const found = file.match(/-(feature|detail)-(\d)\.png$/);
  // The face report keeps its result image as story 1, so detail-N is story N+1; feature-N is story N.
  const index = Number(found?.[2]) - (found?.[1] === "detail" ? 0 : 1);
  const story = tool ? getToolPageContent(tool).stories[index] : undefined;
  return tool && story ? featureAlt(tool, story) : `${tool?.name ?? slug} example result`;
}

function ResultImage({ file, alt, sizes, className = "" }: { file: string; alt: string; sizes: string; className?: string }) {
  return <div className={`${styles.imageBox} ${className}`}><Image src={`/img/results/${file}`} alt={alt} fill sizes={sizes} /></div>;
}

export default function Home() {
  return <MarketingShell><JsonLd data={organizationSchema()} /><JsonLd data={websiteSchema()} /><div className={styles.home}>
    <section className={styles.hero} aria-labelledby="home-title">
      <Container className={styles.heroCanvas}>
        {FLOATS.map((photo) => <Link href={`/${photo.slug}`} key={photo.position} className={`${styles.floatCard} ${styles[photo.position]}`} aria-label={`Open ${photo.slug.replaceAll("-", " ")}`}><Image src={`/img/tools/${photo.image}`} alt={photo.alt} fill sizes="(max-width: 700px) 30vw, 220px" preload={photo.position === "floatOne"} /></Link>)}
        <div className={styles.heroText}>
          <h1 id="home-title">{titleCase("See how AI beauty tools")}<br /><span>{titleCase("look on your own photo.")}</span></h1>
          <p>Upload one clear photo and see a face report, a new hairstyle, a lip shade or an outfit on yourself. A new account starts with {PRICING.starter.credits} free credits, enough for {generationsFor(PRICING.starter.credits)} results. Test an idea here before you spend money on a cut, a dye or a dress.</p>
          <DarkButton href="/tools">See all beauty tools</DarkButton>
        </div>
      </Container>
    </section>

    <section className={styles.firstTools} aria-labelledby="first-tools-title">
      <Container>
        <div className={styles.sectionLine}><div><h2 id="first-tools-title">{titleCase("Start with the decision on your mind.")}</h2><p>Start with a face report, a new look or an edit you can compare side by side. Each card opens one tool with a sample you can try before you upload your own photo. Pick the one that matches the decision on your mind today.</p></div><Link href="/tools" className={styles.viewAll}>View all tools <ArrowRight size={18} /></Link></div>
        <div className={styles.portraitRail}>{FIRST_TOOLS.map((tool) => <article className={styles.portraitCard} key={tool.slug}><Link href={`/${tool.slug}`} className={styles.portraitImage} aria-label={`Open ${tool.name}`}><Image src={`/img/results/${tool.preview}`} alt={previewAlt(tool.slug, tool.preview)} fill sizes="(max-width: 700px) 62vw, (max-width: 1100px) 27vw, 19vw" style={{ objectPosition: tool.focus }} /><span className={styles.imageTag}>{tool.label}</span><span className={styles.portraitPreview} aria-hidden="true"><Image src={`/img/results/${tool.preview}`} alt="" fill sizes="(max-width: 700px) 25vw, 145px" /></span></Link><h3>{titleCase(tool.name)}</h3><Link href={`/${tool.slug}`} className={styles.cardButton}>{tool.cta} <ArrowUpRight size={15} /></Link></article>)}</div>
      </Container>
    </section>

    <section className={styles.featureChapter} aria-labelledby="report-title">
      <Container>
        <div className={styles.chapterIntro}><span>Face reports</span><h2 id="report-title">{titleCase("See your face report next to your own photo.")}</h2><p>Your portrait and the report sit side by side, so every note points to something you can see. Run a face analysis, a facial symmetry test or a face shape check from one selfie.</p></div>
        <div className={`${styles.featurePanel} ${styles.reportPanel}`}>
          <div className={styles.panelCopy}><span className={styles.smallLabel}>FACE BEAUTY ANALYSIS</span><h3>{titleCase("Your face report arrives as one clear image.")}</h3><p>The example combines a portrait, a photo-harmony score and short notes on visible features. Upload your own photo on the tool page and your report is ready in a few minutes. The score is subjective, so treat it as a styling idea.</p><DarkButton href="/face-beauty-analysis">Open face analysis</DarkButton></div>
          <div className={styles.reportVisual}><ResultImage file="face-beauty-analysis.png" alt="Face beauty analysis example: one image with a portrait, a photo-harmony score and short notes on visible features" sizes="(max-width: 850px) 100vw, 55vw" /></div>
        </div>
        <div className={styles.accordionRows}>
          <details><summary><span>{titleCase("See how balanced your face looks.")}</span><ChevronDown size={22} /></summary><div><p>See how balanced the left and right sides of your face look in the photo you choose. Use it as a quick facial symmetry test, just for curiosity.</p><Link href="/facial-symmetry">Open symmetry test <ArrowRight size={16} /></Link></div></details>
          <details><summary><span>{titleCase("Find out which face shape you have.")}</span><ChevronDown size={22} /></summary><div><p>See how a face shape analyzer reads the outline of your portrait. Use it when you choose a haircut or a pair of glasses.</p><Link href="/face-shape-analyzer">Open face shape analyzer <ArrowRight size={16} /></Link></div></details>
        </div>
      </Container>
    </section>

    <section className={styles.softChapter} aria-labelledby="skin-title"><Container><div className={`${styles.featurePanel} ${styles.skinPanel}`}><div className={styles.panelCopy}><span className={styles.smallLabel}>PORTRAIT EDITS</span><h2 id="skin-title">{titleCase("The edit evens your skin and keeps real texture.")}</h2><p>Each example puts the original and the edited portrait together, so you can judge the difference yourself. Skin enhancement softens blemishes and evens tone while pores stay visible. Compare both before you save a version.</p><DarkButton href="/ai-skin-enhancement">Try skin enhancement</DarkButton></div><div className={styles.skinVisual}><ResultImage file="ai-skin-enhancement.png" alt="Before-and-after skin enhancement example with even tone and natural skin texture still visible" sizes="(max-width: 850px) 100vw, 55vw" /><span>Example image</span></div></div>
        <div className={`${styles.featurePanel} ${styles.hairPanel}`}><div className={styles.hairVisual}><ResultImage file="ai-hair-color.png" alt="Before-and-after hair color example showing the original portrait next to a new shade" sizes="(max-width: 850px) 100vw, 45vw" /></div><div className={styles.panelCopy}><span className={styles.smallLabel}>HAIR & COLOR</span><h3>{titleCase("Try a new hair color before you dye.")}</h3><p>Upload one photo and see a different shade next to the original. Test a bold color or a subtle change before you commit to the salon bill. Your real result still depends on the hair you start with.</p><DarkButton href="/ai-hair-color">Try hair color</DarkButton></div></div>
      </Container></section>

    <section className={styles.editSection} aria-labelledby="editing-title"><Container><div className={styles.sectionLine}><div><span className={styles.smallLabel}>IMAGE TOOLS</span><h2 id="editing-title">{titleCase("Check every photo edit before you save it.")}</h2><p>Every example below shows the result format you get, so you know what to expect before you upload. Your own result depends on the light, the angle and the quality of your photo. Compare each result with the original before you save it.</p></div><Link href="/category/photo-tools" className={styles.viewAll}>See photo tools <ArrowRight size={18} /></Link></div><div className={styles.editRail}>{EDIT_TOOLS.map((tool) => <Link href={`/${tool.slug}`} key={tool.slug} className={styles.editCard}><ResultImage file={tool.image} alt={`${tool.name}: ${tool.copy}`} sizes="(max-width: 700px) 76vw, (max-width: 1100px) 40vw, 25vw" /><span className={styles.editTitle}>{tool.name}<ArrowUpRight size={18} /></span><span className={styles.editCopy}>{tool.copy}</span></Link>)}</div></Container></section>

    <section className={styles.retouchSection} aria-labelledby="retouch-title"><Container><div className={styles.centerHead}><span className={styles.smallLabel}>BEAUTY PREVIEWS</span><h2 id="retouch-title">{titleCase("See skin, lips or hair color in one example.")}</h2><p>Choose a tab to see how skin, lips or hair color look in one example. Each result shows your starting photo beside the edit, so you can judge the change before you try it on your own picture.</p></div><HomeTabs /></Container></section>

    <section className={styles.styleSection} aria-labelledby="style-title"><Container><div className={styles.sectionLine}><div><span className={styles.smallLabel}>PERSONAL STYLE</span><h2 id="style-title">{titleCase("See a new haircut or outfit on your photo first.")}</h2><p>Test a different cut or outfit on your own photo before you spend on it. A preview costs less than a haircut you regret or a dress you return.</p></div><Link href="/tools" className={styles.viewAll}>Browse the library <ArrowRight size={18} /></Link></div><div className={styles.styleGrid}>{STYLE_TOOLS.map((tool) => <Link href={`/${tool.slug}`} className={styles.styleCard} key={tool.slug}><ResultImage file={tool.image} alt={`${tool.name}: ${tool.copy}`} sizes="(max-width: 700px) 100vw, 33vw" /><span className={styles.styleName}>{tool.name}<ArrowUpRight size={18} /></span><span className={styles.styleCopy}>{tool.copy}</span></Link>)}</div></Container></section>

    <section className={styles.endSection}><Container className={styles.endGrid}><div><span className={styles.smallLabel}>AI BEAUTY STYLING</span><h2>{titleCase("Start with the photo you already have.")}</h2><p>Choose a tool, look at its example, then upload your own photo or try a sample where one is available. A new account pays for {generationsFor(PRICING.starter.credits)} results with its {PRICING.starter.credits} free credits, because one result uses {PRICING.creditsPerGeneration}. After that, Pro is {money(PRICING.monthly.price)} a month for {generationsFor(PRICING.monthly.credits)} results. Results are styling ideas for adults, not medical advice.</p><DarkButton href="/tools">Browse all tools</DarkButton></div><div className={styles.endMosaic} aria-hidden="true"><ResultImage file="face-beauty-analysis-detail-2.png" alt="" sizes="(max-width: 700px) 50vw, 18vw" /><ResultImage file="beauty-tips-feature-2.png" alt="" sizes="(max-width: 700px) 50vw, 18vw" /><ResultImage file="face-beauty-retouch-feature-2.png" alt="" sizes="(max-width: 700px) 50vw, 18vw" /></div></Container></section>
  </div></MarketingShell>;
}
