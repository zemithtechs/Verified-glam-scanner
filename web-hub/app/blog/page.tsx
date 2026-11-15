import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { MarketingShell } from "@/components/SiteChrome";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-posts";
import { formatBlogDate, resolvePost } from "@/lib/blog-utils";
import { categoryById } from "@/lib/catalog";
import { imageUrl } from "@/lib/image-base";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { titleCase } from "@/lib/title-case";
import { buildMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = buildMetadata({
  title: "Photo and Beauty Guides",
  description: "Original, practical guides to face reports, color palettes, portrait editing, virtual try-ons and photo restoration from the AI Beauty Styling team.",
  path: "/blog",
});

function Meta({ post }: { post: BlogPost }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-medium text-muted">
      <span className="font-extrabold uppercase tracking-[.12em] text-berry">{categoryById(post.category).name}</span>
      <span aria-hidden="true">/</span>
      <span className="inline-flex items-center gap-1"><Clock size={13} aria-hidden="true" />{resolvePost(post).readingMinutes} min read</span>
      <span aria-hidden="true">/</span>
      <time dateTime={post.updated}>{formatBlogDate(post.updated)}</time>
    </p>
  );
}

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.published.localeCompare(a.published));
  const [featured, ...rest] = posts;
  return (
    <MarketingShell>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: "AI Beauty Styling guides", url: "https://aibeautystyling.com/blog", blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `https://aibeautystyling.com/blog/${post.slug}`, datePublished: post.published, dateModified: post.updated })) }} />
      <div className="bg-[radial-gradient(ellipse_at_50%_100%,#f8dce8,transparent_68%)] px-5 pb-12 pt-12 text-center sm:pb-16 sm:pt-20">
        <p className="text-xs font-extrabold uppercase tracking-[.17em] text-berry">The photo guide</p>
        <h1 className="mx-auto mt-4 max-w-4xl font-sans text-[2rem] font-extrabold leading-[1.1] tracking-[-.05em] text-ink sm:text-6xl">Photo and Beauty Guides That Help You Get Better Results</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#4a3d47] sm:text-lg">Clear advice on choosing a good starting image, reading a preview, and knowing what a digital result can and cannot tell you.</p>
      </div>
      <section className="mx-auto max-w-[1120px] px-5 pb-16 sm:px-8 sm:pb-24">
        {featured && (
          <article className="group relative overflow-hidden rounded-3xl border border-[#e8bfd0] bg-[linear-gradient(135deg,#fff,#fdeef2)] p-6 transition-colors hover:border-[#d6abc0] sm:p-10">
            {featured.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element -- hero picture comes from R2; width and height reserve the space
              <img src={imageUrl(featured.heroImage.src)} alt={featured.heroImage.alt} width={featured.heroImage.width} height={featured.heroImage.height} loading="lazy" className="mb-6 aspect-[16/9] w-full rounded-2xl object-cover" />
            )}
            <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-berry">Featured guide</p>
            <h2 className="mt-3 max-w-3xl text-[1.65rem] font-extrabold leading-tight tracking-[-.03em] text-ink sm:text-4xl"><Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-berry">{titleCase(featured.title)}</Link></h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#4a3d47] sm:text-lg sm:leading-8">{featured.description}</p>
            <div className="mt-5"><Meta post={featured} /></div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-plum group-hover:text-berry">Read the guide <ArrowRight size={16} aria-hidden="true" /></span>
          </article>
        )}
        <div className="mb-6 mt-14 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-[-.03em] text-ink sm:text-3xl">All Guides</h2>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-plum hover:text-berry">Explore the tools <ChevronRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((post) => (
            <article key={post.slug} className="group relative flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-[#d6abc0]">
              <Meta post={post} />
              <h3 className="mt-3 text-xl font-bold leading-7 tracking-[-.02em] text-ink"><Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-berry">{titleCase(post.title)}</Link></h3>
              <p className="mt-3 flex-1 text-[15px] leading-7 text-[#4a3d47]">{post.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-plum group-hover:text-berry">Read the guide <ArrowUpRight size={16} aria-hidden="true" /></span>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
