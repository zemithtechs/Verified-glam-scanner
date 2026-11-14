import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { BLOG_AUTHOR, BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { categoryById, toolBySlug, type Tool } from "@/lib/catalog";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata, resultShareImage } from "@/lib/seo-meta";

/** Turns [anchor](/path) and [anchor](https://...) into links. External links open in a new tab. */
function renderInline(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    const className = "font-semibold text-plum underline underline-offset-4 hover:text-berry";
    return href.startsWith("http")
      ? <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}</a>
      : <Link key={index} href={href} className={className}>{label}</Link>;
  });
}

const formatDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  const lead = toolBySlug(post.toolSlugs[0]);
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated,
    image: lead ? resultShareImage(lead.slug, `${lead.name} example result`) : undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const category = categoryById(post.category);
  const tools = post.toolSlugs.map(toolBySlug).filter((tool): tool is Tool => Boolean(tool && tool.status !== "later")).slice(0, 3);
  const otherPosts = BLOG_POSTS.filter((item) => item.category === post.category && item.slug !== post.slug).slice(0, 2);

  return (
    <MarketingShell>
      <JsonLd data={blogPostingSchema(post, `/img/results/${post.toolSlugs[0]}.png`)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <article>
        <header className="bg-[linear-gradient(120deg,#fff,#fff6f9_58%,#f9e5ed)] px-5 pb-14 pt-9 sm:pb-20 sm:pt-12">
          <div className="mx-auto max-w-5xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted"><Link href="/" className="hover:text-plum">Home</Link><ChevronRight size={13} aria-hidden="true" /><Link href="/blog" className="hover:text-plum">Guides</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page" className="text-ink">{post.title}</span></nav>
            <p className="mt-16 text-xs font-extrabold uppercase tracking-[.16em] text-berry">{category.name} guide</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-.06em] text-ink sm:text-6xl">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">{post.description}</p>
            <p className="mt-5 text-sm font-medium text-muted">By {BLOG_AUTHOR} · Published <time dateTime={post.published}>{formatDate(post.published)}</time> · Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></p>
          </div>
        </header>
        <div className="mx-auto grid max-w-5xl gap-14 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-12">
            {post.sections.map((section) => <section key={section.heading} className="scroll-mt-24"><h2 className="text-2xl font-bold tracking-[-.035em] text-ink sm:text-3xl">{section.heading}</h2><div className="mt-5 space-y-5">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-[16px] leading-8 text-[#544a52]">{renderInline(paragraph)}</p>)}</div></section>)}
            <section className="scroll-mt-24"><h2 className="text-2xl font-bold tracking-[-.035em] text-ink sm:text-3xl">Common questions</h2><div className="mt-5 space-y-6">{post.faqs.map(([question, answer]) => <div key={question}><h3 className="text-lg font-bold text-ink">{question}</h3><p className="mt-2 text-[16px] leading-8 text-[#544a52]">{answer}</p></div>)}</div></section>
            <p className="rounded-xl border border-line bg-[#fff8fa] px-5 py-4 text-sm leading-6 text-muted">These guides are for photo styling and creative exploration. A generated preview is not a medical assessment, a measurement guarantee, or a substitute for professional advice.</p>
          </div>
          <aside className="self-start rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24"><p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-berry">Try it on a photo</p><div className="mt-4 space-y-3">{tools.map((tool) => <Link key={tool.slug} href={`/${tool.slug}`} className="flex items-center justify-between gap-2 border-b border-line pb-3 text-sm font-semibold text-ink hover:text-plum">{tool.name}<ArrowRight size={15} className="shrink-0" aria-hidden="true" /></Link>)}</div><Link href={`/category/${category.id}`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-plum hover:text-berry">More {category.name} tools <ArrowRight size={14} aria-hidden="true" /></Link></aside>
        </div>
      </article>
      {otherPosts.length > 0 && <section className="border-t border-line bg-[#fff9fb] px-5 py-14"><div className="mx-auto max-w-5xl"><h2 className="text-2xl font-bold tracking-tight text-ink">Keep reading</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{otherPosts.map((item) => <Link key={item.slug} href={`/blog/${item.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-5 text-sm font-semibold text-ink hover:border-[#d6abc0] hover:text-plum">{item.title}<ArrowRight size={16} className="shrink-0" aria-hidden="true" /></Link>)}</div></div></section>}
    </MarketingShell>
  );
}
