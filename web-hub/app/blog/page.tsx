import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronRight } from "lucide-react";
import { MarketingShell } from "@/components/SiteChrome";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { categoryById } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Photo & Beauty Guides",
  description: "Original, practical guides to face reports, color palettes, portrait editing, virtual try-ons and photo restoration.",
};

export default function BlogPage() {
  return (
    <MarketingShell>
      <div className="bg-[radial-gradient(ellipse_at_50%_100%,#f8dce8,transparent_68%)] px-5 pb-16 pt-12 text-center sm:pt-20">
        <p className="text-xs font-extrabold uppercase tracking-[.17em] text-berry">The photo guide</p>
        <h1 className="mx-auto mt-4 max-w-4xl font-sans text-4xl font-extrabold tracking-[-.06em] text-ink sm:text-6xl">Ideas worth trying on your own photo</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">Clear advice on choosing a good starting image, reading a preview, and knowing what a digital result can—and cannot—tell you.</p>
      </div>
      <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-extrabold uppercase tracking-[.17em] text-berry">Browse the guides</p><h2 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Helpful reads, organized by what you want to do</h2></div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-plum hover:text-berry">Explore the tools <ChevronRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-[#d6abc0]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blush text-plum"><BookOpen size={19} strokeWidth={1.8} aria-hidden="true" /></span>
              <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[.13em] text-berry">{categoryById(post.category).name}</p>
              <h3 className="mt-2 text-xl font-bold leading-7 tracking-[-.025em] text-ink"><Link href={`/blog/${post.slug}`} className="focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-berry">{post.title}</Link></h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted">{post.description}</p>
              <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-plum group-hover:text-berry">Read the guide <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
