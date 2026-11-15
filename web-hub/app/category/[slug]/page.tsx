import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/SiteChrome";
import { BrowseCard } from "@/components/BrowseCard";
import { CategoryGlyph } from "@/components/icons";
import { CATEGORIES, categoryBySlug, isBrowsableTool, toolsInCategory, type CategoryId } from "@/lib/catalog";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { buildMetadata, resultShareImage } from "@/lib/seo-meta";
import { cardAlt } from "@/lib/image-alt";
import { isAvailable } from "@/lib/catalog";
import styles from "@/components/browse.module.css";
import { titleCase } from "@/lib/title-case";

const CATEGORY_COPY: Record<CategoryId, { title: string; lead: string }> = {
  "face-analysis": { title: "Get a closer look at your face from one photo.", lead: "Choose a face report, a symmetry check, a golden ratio guide or a skin look-over, and run it on one clear photo. Each result keeps your portrait beside the notes, so you can see what the tool is pointing at. Treat the results as a curious look at one photo, not as a measurement of you." },
  "glow-up": { title: "Find the colors and habits that suit you.", lead: "Find your seasonal colors from one photo, get beauty tips that match your features or follow a seven-day glow-up plan. Each result gives you something small to try this week, such as a lip shade or a scarf. Test the ideas in daylight and keep the ones that feel like you." },
  "skin-retouch": { title: "Retouch your portrait and still look like yourself.", lead: "Even out your skin tone, soften a blemish or sharpen a blurry selfie while your real texture stays visible. Every result sits next to your original, so you can compare the two before you save one. Light edits keep a portrait looking like you, and you decide how far to go." },
  "hair-beard": { title: "See the new cut before you book the salon.", lead: "Try a new haircut, hair color, beard shape or clean-shaven look on your own photo before you visit the salon. Show the result to your stylist or barber as a starting idea. Real hair has its own texture and growth, so the preview is a guide and not a promise." },
  "makeup-tryon": { title: "Try the shade on your own photo first.", lead: "Test lipstick, eyeshadow, lashes, brows and colored contacts on your own portrait before you spend money. Compare a few options side by side and note the ones you like. Screens and light change how color looks, so check your favorite in daylight before you buy the real product." },
  "fashion-style": { title: "Picture the outfit on you before you buy.", lead: "Preview a garment, a tattoo idea or a new silhouette on your own photo before you commit. Compare color and shape in one image, then take it with you when you shop or talk to an artist. A preview cannot confirm size, fabric or fit, so check those details first." },
  "fun-effects": { title: "Turn your selfie into something playful and fun to share.", lead: "Turn your selfie into a cartoon, try a face filter, change your expression or add a seasonal mask. These effects are made for play and for sharing with friends. Use photos of adults who agree to be edited, and say the picture is altered when you post it." },
  "photo-tools": { title: "Make more of the photos you already have.", lead: "Restore an old family photo, blur faces before you post or merge two portraits into one picture. Each tool does one job on the image you give it. Restored detail is a careful guess and not proof of what was there, so check the result before you share it." },
};

/** Search titles and descriptions per category (title + brand stays within 60 characters where possible). */
const CATEGORY_META: Record<CategoryId, { title: string; description: string }> = {
  "face-analysis": { title: "AI Face Analysis: Face Shape, Symmetry, Skin", description: "AI face analysis tools for one photo: face shape, facial symmetry test, golden ratio guide and AI skin analysis. Entertainment-style reports for adults." },
  "glow-up": { title: "Seasonal Color Analysis and Beauty Tips", description: "Find your seasonal color palette, get beauty tips from your photo and follow a seven-day glow-up challenge. For inspiration, not diagnosis." },
  "skin-retouch": { title: "AI Skin Enhancement and Photo Retouch Tools", description: "AI skin enhancement, smart portrait retouch and face enhancer tools that keep real skin texture. Compare with your original photo before you save." },
  "hair-beard": { title: "Hairstyle Changer and Hair Color Preview", description: "Try a hairstyle changer and AI hair color preview on your own photo, plus beard styling previews. See an idea before you visit the salon." },
  "makeup-tryon": { title: "Virtual Makeup Try On: Lips, Eyes and Brows", description: "Virtual makeup try on for lipstick shades, eyeshadow, lashes, brows and colored contacts. Compare looks on your own photo before you buy." },
  "fashion-style": { title: "Virtual Clothes Try On and Tattoo Preview", description: "Preview a virtual clothes try on, a tattoo idea or a garment silhouette on your photo. Explore color and style. Fit still needs a real fitting." },
  "fun-effects": { title: "Fun AI Face Effects: Cartoon, Filters, Masks", description: "Turn a selfie into a cartoon, try AI face filters, change an expression or add a seasonal mask. Playful effects for photos you have permission to edit." },
  "photo-tools": { title: "Old Photo Restoration, Face Blur and Merge", description: "Restore old family photos, blur faces for privacy or merge two portraits into one image. Practical AI photo tools with honest limits." },
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = categoryBySlug((await params).slug);
  if (!category) return {};
  const meta = CATEGORY_META[category.id];
  const lead = toolsInCategory(category.id).find((tool) => tool.popular && isAvailable(tool)) ?? toolsInCategory(category.id).find(isAvailable);
  return buildMetadata({ title: meta.title, description: meta.description, path: `/category/${category.id}`, image: lead ? resultShareImage(lead.slug, cardAlt(lead)) : undefined });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = categoryBySlug((await params).slug);
  if (!category) notFound();
  const tools = toolsInCategory(category.id).filter(isBrowsableTool);
  const available = tools.filter((tool) => tool.status !== "later");
  const featured = [...available].sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular))).slice(0, 3);
  const remaining = tools.filter((tool) => !featured.some((item) => item.slug === tool.slug));
  const others = CATEGORIES.filter((item) => item.id !== category.id);
  const copy = CATEGORY_COPY[category.id];

  return (
    <MarketingShell>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }, { name: category.name, path: `/category/${category.id}` }])} />
      <JsonLd data={itemListSchema(`${category.name} tools`, available)} />
      <section className={styles.categoryHero}>
        <div className={styles.pageWidth}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><ChevronRight size={14} aria-hidden="true" />
            <Link href="/tools">Tools</Link><ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{category.name}</span>
          </nav>
          <div className={styles.categoryHeroMain}>
            <div>
              <p className={styles.eyebrow}>{category.name.toUpperCase()}</p>
              <h1>{titleCase(copy.title)}</h1>
              <p>{copy.lead}</p>
              <Link href="#category-tools" className={styles.heroLink}>Explore {category.name.toLowerCase()} <span aria-hidden="true">↓</span></Link>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.pageWidth} id="category-tools">
        {featured.length > 0 && <section className={styles.categoryFeatured} aria-labelledby="featured-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>START WITH THESE</p>
              <h2 id="featured-title">{titleCase("Start with the most popular tools in this group.")}</h2>
            </div>
          </div>
          <div className={`${styles.featuredGrid} ${featured.length === 1 ? styles.oneFeature : featured.length === 2 ? styles.twoFeatures : ""}`}>{featured.map((tool) => <BrowseCard key={tool.slug} tool={tool} featured />)}</div>
        </section>}

        {remaining.length > 0 && <section className={styles.moreCategoryTools} aria-labelledby="more-tools-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>THE COLLECTION</p>
              <h2 id="more-tools-title">{titleCase("Pick any tool in this group to try on your photo.")}</h2>
              <p>Choose the result you want to see and open its page. Each page shows an example result, explains what the tool does and lets you try a sample before you upload your own photo. Pick the one that matches the decision you are facing today.</p>
            </div>
          </div>
          <div className={styles.cardGrid}>{remaining.map((tool) => <BrowseCard key={tool.slug} tool={tool} />)}</div>
        </section>}

        <section className={styles.otherCategories} aria-labelledby="other-categories-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>KEEP EXPLORING</p>
              <h2 id="other-categories-title">{titleCase("Try a different group of tools on the same photo.")}</h2>
            </div>
            <Link href="/tools">All tools <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.otherLinks}>{others.map((item) => <Link key={item.id} href={`/category/${item.id}`}><CategoryGlyph id={item.id} size={20} /><span>{item.name}</span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div>
        </section>
      </div>
    </MarketingShell>
  );
}
