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

const CATEGORY_COPY: Record<CategoryId, { title: string; lead: string }> = {
  "face-analysis": { title: "A closer look at your portrait", lead: "Explore AI face analysis tools built from one clear photo. Check your face shape, try a facial symmetry test, compare proportions with the golden ratio, or run an AI skin analysis of visible texture and tone. Every report is an entertainment-style impression of your portrait, not a medical or scientific measurement, so use it for curiosity and styling ideas." },
  "glow-up": { title: "Find colors that feel like you", lead: "Find your seasonal color palette from a single photo, get personalized beauty tips based on your visible features, and follow a simple seven-day glow-up challenge. These color analysis and self-care tools suggest ideas to test in daylight. They are made for inspiration, not for diagnosing or treating anything." },
  "skin-retouch": { title: "A natural finish, on your terms", lead: "Retouch a portrait without losing the real you. These AI skin enhancement and face enhancer tools even out tone, soften blemishes, sharpen blurry selfies and gently refine contour while keeping skin texture visible. Compare each result with your original photo before you save it, and keep edits light so the portrait still looks natural." },
  "hair-beard": { title: "See the new cut before the cut", lead: "Try a hairstyle changer on your own photo before you visit the salon. Preview new cuts and hair colors, test beard shapes and lengths, see a clean-shaven look, or play with a bald filter. A preview is an idea to discuss with your stylist, because real hair texture and growth will always decide the final result." },
  "makeup-tryon": { title: "Try the shade on your own photo", lead: "Use a virtual makeup try on to test lipstick shades, eyeshadow palettes, lashes, brows and colored contacts on your own portrait. Compare a few options in one photo before you buy, then check them in daylight, because screens, lighting and skin tone all change how a real product looks." },
  "fashion-style": { title: "Picture the look on you", lead: "Preview a virtual clothes try on, a tattoo idea or a garment silhouette using your own photo. These style tools help you compare color and shape before you shop or commit, but they cannot confirm size, fabric or fit, so check measurements and product details before you decide." },
  "fun-effects": { title: "Make room for a little play", lead: "Turn a selfie into a cartoon, try AI face filters, change an expression, preview an older or younger version of yourself or add a seasonal mask. These fun face effects are made for play and sharing with friends, so use photos you have permission to edit and say clearly when an image has been altered." },
  "photo-tools": { title: "Make more of the photos you have", lead: "Restore an old family photo, blur faces for privacy or merge two portraits into one image. These practical photo tools repair scratches and fading, hide identifying details and combine pictures, with limits: restored detail is a plausible guess, and blurred images should always be checked before you share them." },
};

/** Search titles and descriptions per category (title + brand stays within 60 characters where possible). */
const CATEGORY_META: Record<CategoryId, { title: string; description: string }> = {
  "face-analysis": { title: "AI Face Analysis: Face Shape, Symmetry, Skin", description: "AI face analysis tools for one photo: face shape, facial symmetry test, golden ratio guide and AI skin analysis. Entertainment-style reports for adults." },
  "glow-up": { title: "Seasonal Color Analysis and Beauty Tips", description: "Find your seasonal color palette, get personalized beauty tips from your photo and follow a seven-day glow-up challenge. Made for inspiration, not diagnosis." },
  "skin-retouch": { title: "AI Skin Enhancement and Photo Retouch Tools", description: "AI skin enhancement, smart portrait retouch and face enhancer tools that keep real skin texture. Compare with your original photo before you save." },
  "hair-beard": { title: "Hairstyle Changer and Hair Color Preview", description: "Try a hairstyle changer and AI hair color preview on your own photo, plus beard styling previews. See an idea before you visit the salon." },
  "makeup-tryon": { title: "Virtual Makeup Try On: Lips, Eyes and Brows", description: "Virtual makeup try on for lipstick shades, eyeshadow, lashes, brows and colored contacts. Compare looks on your own photo before you buy." },
  "fashion-style": { title: "Virtual Clothes Try On and Tattoo Preview", description: "Preview a virtual clothes try on, a tattoo idea or a garment silhouette on your photo. Explore color and style; fit still needs a real fitting." },
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
              <h1>{copy.title}</h1>
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
              <h2 id="featured-title">Popular in {category.name}</h2>
            </div>
          </div>
          <div className={`${styles.featuredGrid} ${featured.length === 1 ? styles.oneFeature : featured.length === 2 ? styles.twoFeatures : ""}`}>{featured.map((tool) => <BrowseCard key={tool.slug} tool={tool} featured />)}</div>
        </section>}

        {remaining.length > 0 && <section className={styles.moreCategoryTools} aria-labelledby="more-tools-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>THE COLLECTION</p>
              <h2 id="more-tools-title">More {category.name} tools</h2>
              <p>Choose the result you want to explore. Tools still in development are clearly marked.</p>
            </div>
          </div>
          <div className={styles.cardGrid}>{remaining.map((tool) => <BrowseCard key={tool.slug} tool={tool} />)}</div>
        </section>}

        <section className={styles.otherCategories} aria-labelledby="other-categories-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>KEEP EXPLORING</p>
              <h2 id="other-categories-title">More ways to work with your photo</h2>
            </div>
            <Link href="/tools">All tools <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.otherLinks}>{others.map((item) => <Link key={item.id} href={`/category/${item.id}`}><CategoryGlyph id={item.id} size={20} /><span>{item.name}</span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div>
        </section>
      </div>
    </MarketingShell>
  );
}
