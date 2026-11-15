import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, ListTree } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { BlockView } from "@/components/blog/BlogBlocks";
import { AppCard, InlineCta, WebCard } from "@/components/blog/Cta";
import { TocList } from "@/components/blog/Toc";
import { renderInline } from "@/components/blog/Inline";
import styles from "@/components/blog/blog.module.css";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { titleCase } from "@/lib/title-case";
import { formatBlogDate, relatedPostsFor, resolvePost } from "@/lib/blog-utils";
import { categoryById, toolBySlug, type Tool } from "@/lib/catalog";
import { imageUrl } from "@/lib/image-base";
import { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { GOOGLE_PLAY_URL } from "@/lib/site-info";
import { absoluteImageUrl, buildMetadata, resultShareImage } from "@/lib/seo-meta";

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
    image: post.heroImage ? { url: absoluteImageUrl(post.heroImage.src), width: post.heroImage.width, height: post.heroImage.height, alt: post.heroImage.alt } : lead ? resultShareImage(lead.slug, `${lead.name} example result`) : undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const category = categoryById(post.category);
  const resolved = resolvePost(post);
  const tools = (post.relatedTools ?? post.toolSlugs).map(toolBySlug).filter((tool): tool is Tool => Boolean(tool && tool.status !== "later")).slice(0, 4);
  const lead = tools[0];
  const leadHref = lead ? `/${lead.slug}` : "/tools";
  const related = relatedPostsFor(post, 3);
  const toolHeadline = post.cta?.toolHeadline ?? (lead ? `Try ${lead.name} on your own photo` : "Try it on your own photo");
  const appHeadline = post.cta?.appHeadline ?? "Take your photo tools with you on Android";
  const hasExplicitCta = resolved.sections.some((section) => section.blocks.some((block) => block.type === "cta"));
  const midIndex = Math.floor(resolved.sections.length / 2) - 1;
  const hero = post.heroImage;

  return (
    <MarketingShell>
      <JsonLd data={blogPostingSchema(post, `/img/results/${post.toolSlugs[0]}.png`)} />
      {post.faqs.length > 0 && <JsonLd data={faqSchema(post.faqs)} />}
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <article>
        <header className="bg-[linear-gradient(120deg,#fff,#fff6f9_58%,#f9e5ed)] px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12">
          <div className="mx-auto max-w-[1120px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted"><Link href="/" className="hover:text-plum">Home</Link><ChevronRight size={13} aria-hidden="true" /><Link href="/blog" className="hover:text-plum">Guides</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page" className="line-clamp-1 text-ink">{post.title}</span></nav>
            <p className="mt-10 text-xs font-extrabold uppercase tracking-[.16em] text-berry sm:mt-14">{category.name} guide</p>
            <h1 className="mt-3 max-w-4xl text-[2rem] font-extrabold leading-[1.1] tracking-[-.04em] text-ink sm:text-5xl lg:text-6xl">{titleCase(post.title)}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#4a3d47] sm:text-lg sm:leading-8">{post.description}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted">
              <span>By {resolved.author}</span>
              <span aria-hidden="true">/</span>
              <span>Published <time dateTime={post.published}>{formatBlogDate(post.published)}</time></span>
              <span aria-hidden="true">/</span>
              <span>Updated <time dateTime={post.updated}>{formatBlogDate(post.updated)}</time></span>
              <span aria-hidden="true">/</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden="true" />{resolved.readingMinutes} min read</span>
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1120px] gap-12 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {hero && (
              <figure className={`${styles.figure} mb-10`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- hero picture comes from R2; width and height reserve the space */}
                <img src={imageUrl(hero.src)} alt={hero.alt} width={hero.width} height={hero.height} fetchPriority="high" decoding="async" />
                {hero.credit && <figcaption>{hero.credit}</figcaption>}
              </figure>
            )}

            <section id="key-takeaways" aria-labelledby="key-takeaways-title" className="scroll-mt-28 rounded-2xl border border-[#e8bfd0] bg-[linear-gradient(135deg,#fff,#fdeef2)] p-5 shadow-[0_8px_28px_rgba(109,26,70,0.08)] sm:p-7">
              <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-berry">Short on time? Stop here.</p>
              <h2 id="key-takeaways-title" className="mt-1.5 font-display text-2xl font-bold text-ink">Key Takeaways</h2>
              <ul className="mt-4 space-y-3">
                {resolved.keyTakeaways.map((point) => (
                  <li key={point} className="flex gap-3 text-[16px] leading-7 text-ink sm:text-[17px]"><span aria-hidden="true" className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-berry" /><span>{renderInline(point)}</span></li>
                ))}
              </ul>
            </section>

            <div className="mt-8">
              <InlineCta variant="tool" headline={toolHeadline} text={lead ? `${lead.name} takes a photo and shows you a preview in a few minutes. Free to start.` : undefined} label="Open the web app" toolHref={leadHref} />
            </div>

            <details className="group mt-8 rounded-2xl border border-line bg-white lg:hidden" aria-label="On this page">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-bold text-ink"><span className="inline-flex items-center gap-2"><ListTree size={18} className="text-berry" aria-hidden="true" />On this page</span><ChevronRight size={18} className="transition-transform group-open:rotate-90" aria-hidden="true" /></summary>
              <nav aria-label="Table of contents" className="border-t border-line px-2 py-3"><TocList items={resolved.toc} /></nav>
            </details>

            <div className={`${styles.prose} mt-10`}>
              {resolved.intro && <p className="text-[1.08em]">{renderInline(resolved.intro)}</p>}
              {resolved.sections.map((section, index) => (
                <section key={section.id} aria-labelledby={section.id} className={styles.section}>
                  <h2 id={section.id}>{titleCase(section.heading)}</h2>
                  {section.blocks.map((block, i) => <div key={i} className="mt-[1.25em] first:mt-[.6em]"><BlockView block={block} fallbackToolHref={leadHref} /></div>)}
                  {!hasExplicitCta && index === midIndex && (
                    <div className="mt-[1.75em]"><InlineCta variant="app" headline={appHeadline} text="The same tools on your phone, free to start. Install it from Google Play." label="Get it on Google Play" /></div>
                  )}
                </section>
              ))}

              {post.faqs.length > 0 && (
                <>
                  <div className="mt-[2em]"><InlineCta variant="tool" headline={lead ? `Still unsure? Test ${lead.name} on a photo` : "Still unsure? Test it on a photo"} text="A quick preview often answers more than another article does." label="Open the web app" toolHref={leadHref} /></div>
                  <section id="faq" aria-labelledby="faq-title" className={`${styles.section} ${styles.faq}`}>
                    <h2 id="faq-title">Common Questions</h2>
                    {post.faqs.map(([question, answer]) => <div key={question}><h3>{titleCase(question)}</h3><p className="mt-[.5em]">{renderInline(answer)}</p></div>)}
                  </section>
                </>
              )}

              {post.sources && post.sources.length > 0 && (
                <section id="sources" aria-labelledby="sources-title" className={styles.section}>
                  <h2 id="sources-title">Sources</h2>
                  <ol className={styles.sources}>
                    {post.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>. {source.publisher}. Accessed <time dateTime={source.accessed}>{formatBlogDate(source.accessed)}</time>.</li>)}
                  </ol>
                </section>
              )}
            </div>

            <div className="mt-12 rounded-2xl bg-ink p-6 text-white sm:p-8">
              <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#f4a9c3]">Your turn</p>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{titleCase(lead ? `Put this into practice with ${lead.name}` : "Put this into practice")}</h2>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/80">Pick the way that suits you. Both start free, and your photo stays yours.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={leadHref} className={`${styles.btn} ${styles.btnPrimary} !border-white !bg-white !text-plum hover:!bg-blush`}>Open the web app<ArrowRight size={16} aria-hidden="true" /></Link>
                <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" className={`${styles.btn} border border-white/40 text-white hover:bg-white/10`}>Get it on Google Play</a>
              </div>
            </div>

            <p className="mt-8 rounded-xl border border-line bg-[#fff8fa] px-5 py-4 text-sm leading-6 text-muted">These guides are for photo styling and creative exploration. A generated preview is not a medical assessment, a measurement guarantee, or a substitute for professional advice.</p>
          </div>

          <aside aria-label="Article tools" className="hidden lg:block">
            <div className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col gap-3 overflow-y-auto pb-1 pr-1">
              <nav aria-label="On this page" className="shrink-0 rounded-2xl border border-line bg-white p-3">
                <p className="mb-1 px-3 text-[11px] font-extrabold uppercase tracking-[.15em] text-berry">On this page</p>
                <div className="max-h-[40vh] overflow-y-auto"><TocList items={resolved.toc} /></div>
              </nav>
              <WebCard toolName={lead?.name ?? "the tools"} toolHref={leadHref} />
              <AppCard />
            </div>
          </aside>
        </div>
      </article>

      {(tools.length > 0 || related.length > 0) && (
        <section id="related" aria-labelledby="related-title" className="border-t border-line bg-[#fff9fb] px-5 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-[1120px]">
            {tools.length > 0 && (
              <>
                <h2 id="related-title" className="text-2xl font-bold tracking-tight text-ink">Related Tools</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {tools.map((tool) => <Link key={tool.slug} href={`/${tool.slug}`} className="group rounded-xl border border-line bg-white p-5 hover:border-[#d6abc0]"><span className="flex items-center justify-between gap-3 font-semibold text-ink group-hover:text-plum">{tool.name}<ArrowRight size={16} className="shrink-0" aria-hidden="true" /></span><span className="mt-1.5 block text-sm leading-6 text-muted">{tool.summary}</span></Link>)}
                </div>
                <Link href={`/category/${category.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-plum hover:text-berry">More {category.name} tools <ArrowRight size={14} aria-hidden="true" /></Link>
              </>
            )}
            {related.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink">Keep Reading</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {related.map((item) => <Link key={item.slug} href={`/blog/${item.slug}`} className="group rounded-xl border border-line bg-white p-5 hover:border-[#d6abc0]"><span className="text-[11px] font-extrabold uppercase tracking-[.13em] text-berry">{categoryById(item.category).name}</span><span className="mt-1.5 flex items-start justify-between gap-3 font-semibold leading-6 text-ink group-hover:text-plum">{item.title}<ArrowRight size={16} className="mt-1 shrink-0" aria-hidden="true" /></span></Link>)}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </MarketingShell>
  );
}
