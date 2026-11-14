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
import { Container } from "@/components/ui";
import HomeTabs from "./HomeTabs";
import styles from "./home.module.css";

export const metadata: Metadata = buildMetadata({
  title: "AI Beauty Styling: Free AI Beauty Tools for Your Photo",
  description: "AI beauty tools for your photo: face analysis, skin analysis, hairstyle changer, virtual makeup try on and clothes try on. Try free with a selfie.",
  path: "/",
  exactTitle: true,
});

const FLOATS = [
  { slug: "face-beauty-analysis", image: "face-beauty-analysis-natural-v2.png", alt: "Sample portrait of a woman with dark curly hair in a blue t-shirt, used to demo Face Beauty Analysis", position: "floatOne" },
  { slug: "facial-symmetry", image: "facial-symmetry-natural-v2.png", alt: "Sample front-facing portrait of a man with dark hair and a green jacket, used for the Facial Symmetry Test", position: "floatTwo" },
  { slug: "hairstyle-changer", image: "hairstyle-changer-natural-v2.png", alt: "Sample portrait of a woman with curly hair pinned up, used to preview styles with the Hairstyle Changer", position: "floatThree" },
  { slug: "lip-color-changer", image: "lip-color-changer-natural-v2.png", alt: "Close sample portrait of a woman with short curly hair, used to try shades with the Lip Color Changer", position: "floatFour" },
  { slug: "virtual-try-on-clothes", image: "virtual-try-on-clothes-natural-v2.png", alt: "Sample full-length photo of a woman in a beige shirt and jeans, used for Virtual Try-On: Clothes", position: "floatFive" },
] as const;

const FIRST_TOOLS = [
  { slug: "face-beauty-analysis", name: "Face Beauty Analysis", preview: "face-beauty-analysis-detail-3.png", focus: "10% center", label: "Face report" },
  { slug: "hairstyle-changer", name: "Hairstyle Changer", preview: "hairstyle-changer-feature-1.png", focus: "17% center", label: "Hair" },
  { slug: "facial-symmetry", name: "Facial Symmetry Test", preview: "facial-symmetry-feature-2.png", focus: "50% center", label: "Face report" },
  { slug: "virtual-try-on-clothes", name: "Virtual Try-On Clothes", preview: "virtual-try-on-clothes-feature-1.png", focus: "17% center", label: "Style" },
  { slug: "lip-color-changer", name: "Lip Color Changer", preview: "lip-color-changer-feature-1.png", focus: "17% center", label: "Makeup" },
  { slug: "beauty-tips", name: "Beauty Tips", preview: "beauty-tips-feature-1.png", focus: "15% center", label: "Ideas" },
] as const;

const EDIT_TOOLS = [
  { slug: "old-photo-restoration", name: "Old Photo Restoration", image: "old-photo-restoration.png", copy: "See a faded portrait beside a restored version." },
  { slug: "face-comparison", name: "Face Comparison", image: "face-comparison.png", copy: "Compare two portraits in one visual result." },
  { slug: "colored-contacts", name: "Colored Contacts", image: "colored-contacts.png", copy: "See how a different eye color looks on your photo." },
  { slug: "facial-symmetry", name: "Facial Symmetry", image: "facial-symmetry.png", copy: "See your features in a visual comparison." },
  { slug: "lip-color-changer", name: "Lip Color Changer", image: "lip-color-changer.png", copy: "Put two lip shades side by side." },
] as const;

const STYLE_TOOLS = [
  { slug: "hairstyle-changer", name: "Hairstyle Changer", image: "hairstyle-changer.png", copy: "A new cut, shown on your own photo." },
  { slug: "seasonal-color-palette", name: "Seasonal Color Palette", image: "seasonal-color-palette.png", copy: "A visual palette to explore your colors." },
  { slug: "virtual-try-on-clothes", name: "Virtual Try-On Clothes", image: "virtual-try-on-clothes.png", copy: "See the outfit before you make a choice." },
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
          <h1 id="home-title">AI beauty tools<br /><span>for your photo.</span><br />See the result.</h1>
          <p>AI Beauty Styling is a set of AI beauty tools for face reports, hair previews, makeup try-ons and photo edits. It all starts with an image you choose.</p>
          <DarkButton href="/tools">See all beauty tools</DarkButton>
        </div>
      </Container>
    </section>

    <section className={styles.firstTools} aria-labelledby="first-tools-title">
      <Container>
        <div className={styles.sectionLine}><div><h2 id="first-tools-title">What would you like to try?</h2><p>Start with a face report, a new look, or an edit you can see.</p></div><Link href="/tools" className={styles.viewAll}>View all tools <ArrowRight size={18} /></Link></div>
        <div className={styles.portraitRail}>{FIRST_TOOLS.map((tool) => <article className={styles.portraitCard} key={tool.slug}><Link href={`/${tool.slug}`} className={styles.portraitImage} aria-label={`Open ${tool.name}`}><Image src={`/img/results/${tool.preview}`} alt={previewAlt(tool.slug, tool.preview)} fill sizes="(max-width: 700px) 62vw, (max-width: 1100px) 27vw, 19vw" style={{ objectPosition: tool.focus }} /><span className={styles.imageTag}>{tool.label}</span><span className={styles.portraitPreview} aria-hidden="true"><Image src={`/img/results/${tool.preview}`} alt="" fill sizes="(max-width: 700px) 25vw, 145px" /></span></Link><h3>{tool.name}</h3><Link href={`/${tool.slug}`} className={styles.cardButton}>Try this tool <ArrowUpRight size={15} /></Link></article>)}</div>
      </Container>
    </section>

    <section className={styles.featureChapter} aria-labelledby="report-title">
      <Container>
        <div className={styles.chapterIntro}><span>Face reports</span><h2 id="report-title">A closer look at your portrait.</h2><p>See the photo and the report together, so the details make sense at a glance.</p></div>
        <div className={`${styles.featurePanel} ${styles.reportPanel}`}>
          <div className={styles.panelCopy}><span className={styles.smallLabel}>FACE BEAUTY ANALYSIS</span><h3>Your face report, in one image.</h3><p>The example combines a portrait, a score, and feature notes in a single visual result. Upload your photo on the tool page to create your own.</p><DarkButton href="/face-beauty-analysis">Open face analysis</DarkButton></div>
          <div className={styles.reportVisual}><ResultImage file="face-beauty-analysis.png" alt="Face beauty analysis example: one image with a portrait, a photo-harmony score and short notes on visible features" sizes="(max-width: 850px) 100vw, 55vw" /></div>
        </div>
        <div className={styles.accordionRows}>
          <details><summary><span>Facial symmetry</span><ChevronDown size={22} /></summary><div><p>See a visual breakdown of facial balance from the photo you choose.</p><Link href="/facial-symmetry">Open symmetry test <ArrowRight size={16} /></Link></div></details>
          <details><summary><span>Face shape</span><ChevronDown size={22} /></summary><div><p>Explore how a face-shape report presents the contours in your portrait.</p><Link href="/face-shape-analyzer">Open face shape analyzer <ArrowRight size={16} /></Link></div></details>
        </div>
      </Container>
    </section>

    <section className={styles.softChapter} aria-labelledby="skin-title"><Container><div className={`${styles.featurePanel} ${styles.skinPanel}`}><div className={styles.panelCopy}><span className={styles.smallLabel}>PORTRAIT EDITS</span><h2 id="skin-title">See the change. Keep the character.</h2><p>Our before-and-after examples put the original and edited portrait together, so you can judge the difference for yourself.</p><DarkButton href="/ai-skin-enhancement">Try skin enhancement</DarkButton></div><div className={styles.skinVisual}><ResultImage file="ai-skin-enhancement.png" alt="Before-and-after skin enhancement example with even tone and natural skin texture still visible" sizes="(max-width: 850px) 100vw, 55vw" /><span>Example image</span></div></div>
        <div className={`${styles.featurePanel} ${styles.hairPanel}`}><div className={styles.hairVisual}><ResultImage file="ai-hair-color.png" alt="Before-and-after hair color example showing the original portrait next to a new shade" sizes="(max-width: 850px) 100vw, 45vw" /></div><div className={styles.panelCopy}><span className={styles.smallLabel}>HAIR & COLOR</span><h3>One photo, another shade.</h3><p>Compare a color idea next to the original photo before making a change in real life.</p><DarkButton href="/ai-hair-color">Try hair color</DarkButton></div></div>
      </Container></section>

    <section className={styles.editSection} aria-labelledby="editing-title"><Container><div className={styles.sectionLine}><div><span className={styles.smallLabel}>IMAGE TOOLS</span><h2 id="editing-title">Photo edits you can actually see.</h2><p>Every example below shows the intended result format, not a guaranteed outcome.</p></div><Link href="/category/photo-tools" className={styles.viewAll}>See photo tools <ArrowRight size={18} /></Link></div><div className={styles.editRail}>{EDIT_TOOLS.map((tool) => <Link href={`/${tool.slug}`} key={tool.slug} className={styles.editCard}><ResultImage file={tool.image} alt={`${tool.name}: ${tool.copy}`} sizes="(max-width: 700px) 76vw, (max-width: 1100px) 40vw, 25vw" /><span className={styles.editTitle}>{tool.name}<ArrowUpRight size={18} /></span><span className={styles.editCopy}>{tool.copy}</span></Link>)}</div></Container></section>

    <section className={styles.retouchSection} aria-labelledby="retouch-title"><Container><div className={styles.centerHead}><span className={styles.smallLabel}>BEAUTY PREVIEWS</span><h2 id="retouch-title">Find the detail you want to change.</h2><p>Tap a look to see how the tool presents its result.</p></div><HomeTabs /></Container></section>

    <section className={styles.styleSection} aria-labelledby="style-title"><Container><div className={styles.sectionLine}><div><span className={styles.smallLabel}>PERSONAL STYLE</span><h2 id="style-title">See a new look on your photo.</h2><p>From a different cut to a different outfit, explore an idea before you commit to it.</p></div><Link href="/tools" className={styles.viewAll}>Browse the library <ArrowRight size={18} /></Link></div><div className={styles.styleGrid}>{STYLE_TOOLS.map((tool) => <Link href={`/${tool.slug}`} className={styles.styleCard} key={tool.slug}><ResultImage file={tool.image} alt={`${tool.name}: ${tool.copy}`} sizes="(max-width: 700px) 100vw, 33vw" /><span className={styles.styleName}>{tool.name}<ArrowUpRight size={18} /></span><span className={styles.styleCopy}>{tool.copy}</span></Link>)}</div></Container></section>

    <section className={styles.endSection}><Container className={styles.endGrid}><div><span className={styles.smallLabel}>AI BEAUTY STYLING</span><h2>Start with the photo you already have.</h2><p>Choose a tool, see its example, then upload your own image or try a sample where one is available.</p><DarkButton href="/tools">Browse all tools</DarkButton></div><div className={styles.endMosaic} aria-hidden="true"><ResultImage file="face-beauty-analysis-detail-2.png" alt="" sizes="(max-width: 700px) 50vw, 18vw" /><ResultImage file="beauty-tips-feature-2.png" alt="" sizes="(max-width: 700px) 50vw, 18vw" /><ResultImage file="face-beauty-retouch-feature-2.png" alt="" sizes="(max-width: 700px) 50vw, 18vw" /></div></Container></section>
  </div></MarketingShell>;
}
