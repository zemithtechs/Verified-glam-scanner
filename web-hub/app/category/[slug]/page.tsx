import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/SiteChrome";
import { BrowseCard } from "@/components/BrowseCard";
import { CategoryGlyph } from "@/components/icons";
import { CATEGORIES, categoryBySlug, isBrowsableTool, toolsInCategory, type CategoryId } from "@/lib/catalog";
import styles from "@/components/browse.module.css";

const CATEGORY_COPY: Record<CategoryId, { title: string; lead: string }> = {
  "face-analysis": { title: "A closer look at your portrait", lead: "Explore face shape, symmetry, visible skin details and more through photo-based reports." },
  "glow-up": { title: "Find colors that feel like you", lead: "Discover palettes and small beauty ideas drawn from the features in your photo." },
  "skin-retouch": { title: "A natural finish, on your terms", lead: "Explore gentle portrait refinements that keep skin texture and character in view." },
  "hair-beard": { title: "See the new cut before the cut", lead: "Try a different hairstyle or color on your photo before you head to the salon." },
  "makeup-tryon": { title: "Try the shade on your own photo", lead: "Preview lip, eye and brow looks without opening a makeup bag." },
  "fashion-style": { title: "Picture the look on you", lead: "See how an outfit or style idea might work with your own photo." },
  "fun-effects": { title: "Make room for a little play", lead: "Turn a portrait into something unexpected with creative face and photo effects." },
  "photo-tools": { title: "Make more of the photos you have", lead: "Restore a favorite memory or explore practical ways to edit and combine portraits." },
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = categoryBySlug((await params).slug);
  if (!category) return {};
  return { title: `${category.name} Tools`, description: category.description };
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
