import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Camera, Check, ChevronDown, Download, ScanFace } from "lucide-react";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { ToolStepIcon } from "@/components/ToolStepIcon";
import { isBrowsableTool, type Category, type Tool } from "@/lib/catalog";
import { getToolPageContent } from "@/lib/tool-page-content";
import { GENERATION_SPECS } from "@/lib/generation-specs";
import { getToolUseCases } from "@/lib/tool-use-cases";
import { getRelatedBlogPosts } from "@/lib/blog-posts";
import styles from "./tool-content.module.css";

const sectionClass = "tool-section bg-white px-5 py-12 sm:px-10 sm:py-16 xl:px-16";
const headingClass = "text-center text-[29px] font-extrabold tracking-[-0.05em] leading-[1.12] text-ink sm:text-[38px]";

export function ToolLandingPage({ tool, category, related }: { tool: Tool; category: Category; related: Tool[] }) {
  const content = getToolPageContent(tool);
  const useCases = getToolUseCases(tool);
  const relatedPosts = getRelatedBlogPosts(tool);
  if (GENERATION_SPECS[tool.slug]?.unavailable) return <section className="rounded-lg bg-white p-8 sm:p-16"><h1 className="text-3xl font-semibold text-ink">{tool.name}</h1><p className="mt-5 max-w-2xl leading-7 text-muted">{GENERATION_SPECS[tool.slug].unavailable} We do not identify people or match an uploaded face to a celebrity.</p><div className="mt-7 flex flex-wrap gap-4"><Link href="/face-shape-analyzer" className="tool-primary-button rounded-md bg-plum px-5 py-3 text-sm font-semibold text-white">Explore face shape</Link><Link href="/seasonal-color-palette" className="tool-secondary-button rounded-md border border-line px-5 py-3 text-sm font-semibold text-plum">Explore color palettes</Link></div></section>;
  if (tool.status === "later") return <div className="tool-landing space-y-3">
    <section className={`${sectionClass} rounded-lg`}><div className="mx-auto max-w-[1000px] grid items-center gap-8 md:grid-cols-2">
      <div><span className="inline-flex rounded-full bg-blush px-3 py-1 text-xs font-semibold text-plum">In development</span><h1 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{tool.name}</h1><p className="mt-4 text-base leading-7 text-muted">{tool.summary}</p><p className="mt-4 text-sm leading-6 text-muted">This tool is not open for generation yet. The image is a concept preview, not a result from your photo.</p><Link href={`/category/${category.id}`} className="tool-secondary-button mt-7 inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-5 py-3 text-sm font-semibold text-plum">Explore {category.name}<ArrowRight size={16} aria-hidden="true" /></Link></div>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-blush"><Image src={content.visuals[0]} alt={`Concept preview for ${tool.name}`} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" /></div>
    </div></section>
    <section className={sectionClass}><div className="mx-auto max-w-[1000px]"><h2 className="text-2xl font-semibold text-ink">What this idea is for</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{useCases.map(item => <article key={item.title} className="rounded-lg border border-line p-6"><h3 className="font-semibold text-ink">{item.title}</h3><p className="mt-3 text-sm leading-6 text-muted">{item.body}</p></article>)}</div></div></section>
    {related.length > 0 && <section className={sectionClass}><div className="mx-auto max-w-[1000px]"><h2 className="text-2xl font-semibold text-ink">Tools you can explore now</h2><div className="mt-6 flex flex-wrap gap-3">{related.filter(isBrowsableTool).slice(0, 4).map(item => <Link key={item.slug} href={`/${item.slug}`} className="tool-secondary-button inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-semibold text-plum">{item.name}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div></div></section>}
    {relatedPosts.length > 0 && <section className={sectionClass}><div className="mx-auto max-w-[1000px]"><h2 className="text-2xl font-semibold text-ink">Related reading</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{relatedPosts.slice(0, 2).map(post => <Link key={post.slug} href={`/blog/${post.slug}`} className="tool-related-card rounded-lg border border-line p-5"><h3 className="font-semibold text-ink">{post.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{post.description}</p></Link>)}</div></div></section>}
  </div>;
  const isFaceReport = tool.slug === "face-beauty-analysis";
  // Only render illustrations that exist. Some tools have not received a full
  // feature-image set yet; a broken image would misrepresent the result.
  const featureCount = tool.slug === "old-photo-restoration" ? 0 : tool.slug === "cartoon-yourself" ? 1 : 3;
  const featureImages = isFaceReport ? content.visuals : Array.from({ length: featureCount }, (_, index) => `/img/results/${tool.slug}-feature-${index + 1}.png`);
  const galleryImages = [...new Set([content.visuals[0], ...featureImages])];
  const stories = content.stories.slice(0, featureImages.length);

  return (
    <div className="tool-landing space-y-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: content.faqs.map(([q, answer]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: answer } })) }).replace(/</g, "\u003c") }} />
      <ToolWorkspace key={tool.slug} tool={tool} title={content.heroTitle} lead={content.heroLead} images={galleryImages} />

      <section id="how-it-works" className={sectionClass}>
        <h2 className={headingClass}>{content.howToHeading ?? `How to use ${tool.name}`}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-7 text-muted">A photo in. A complete result out. Here is what to expect at each step.</p>
        <ol className="mt-9 grid gap-4 md:grid-cols-3 lg:gap-6">
          {content.steps.map((step, index) => <li key={step.title} className="relative rounded-xl border border-line bg-cream/40 px-6 py-7 sm:px-7"><div className="flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-[14px] border border-plum/10 bg-blush text-plum"><ToolStepIcon stage={index} slug={tool.slug} /></span><span className="text-sm font-medium tabular-nums text-muted/70" aria-label={`Step ${index + 1}`}>0{index + 1}</span></div><h3 className="mt-6 text-lg font-bold leading-6 text-ink">{step.title}</h3><p className="mt-3 text-sm leading-6 text-muted">{step.body}</p></li>)}
        </ol>
      </section>

      {stories.length > 0 && <section id="features" className={sectionClass}>
        <h2 className={headingClass}>{content.featuresHeading ?? `Explore your ${tool.name} result`}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-7 text-muted">{content.featuresIntro ?? "Different photos, different possibilities. Take a closer look at the details in each example."}</p>
        <div className="mx-auto mt-12 max-w-[1220px] space-y-12 sm:space-y-16">
          {stories.map((story, index) => <article key={story.title} className="grid items-center gap-7 md:grid-cols-[1.1fr_1fr] md:gap-10 xl:gap-16">
            <a href={featureImages[index]} download className={`tool-example-link relative block aspect-video w-full overflow-hidden rounded-lg border border-line bg-[#faf9f8] ${index % 2 ? "md:order-2" : ""}`} aria-label={`Download ${tool.name} example: ${story.title}`}><Image src={featureImages[index]} alt={`${story.title} — complete ${tool.name} example`} fill sizes="(min-width: 1440px) 620px, (min-width: 768px) 46vw, 100vw" className="object-contain" /><span className="tool-image-download absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-line bg-white/95 text-plum shadow-sm" aria-hidden="true"><Download size={17} /></span></a>
            <div className={index % 2 ? "md:order-1" : ""}>
              <h3 className="max-w-lg text-[23px] font-semibold tracking-[-0.02em] leading-[1.3] text-ink sm:text-[26px]">{story.title}</h3>
              <p className="mt-4 text-[15px] leading-7 text-muted">{story.body}</p>
              {story.points.length > 0 && <ul className="mt-5 space-y-2.5">{story.points.slice(0, 3).map(point => <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-muted"><Check size={16} className="mt-1 shrink-0 text-plum" aria-hidden="true" />{point}</li>)}</ul>}
              <a href="#tool-workspace" className="tool-primary-button mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-plum px-5 py-3 text-sm font-semibold text-white">Try {tool.name}<ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </article>)}
        </div>
      </section>}

      <section id="tool-ideas" className={sectionClass}>
        <div className="mx-auto max-w-[1220px]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-plum">Ideas for using it</p><h2 className="mt-3 max-w-xl text-[26px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[32px]">Ways to use your {tool.name} result</h2></div><p className="max-w-lg text-sm leading-7 text-muted">{tool.name} is most helpful when you have a specific question in mind. These are two practical ways to use its visual result.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">{useCases.map((item, index) => <article key={item.title} className={`${styles.reveal} rounded-xl border border-line bg-cream p-6 sm:p-8`}><span className="text-sm font-semibold tabular-nums text-berry">0{index + 1}</span><h3 className="mt-8 text-xl font-semibold leading-snug text-ink">{item.title}</h3><p className="mt-3 max-w-lg text-sm leading-7 text-muted">{item.body}</p></article>)}</div>
        </div>
      </section>

      <section id="photo-guidance" className={sectionClass}>
        <div className="mx-auto grid max-w-[1220px] overflow-hidden rounded-xl border border-line bg-blush/50 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-7 sm:p-10 lg:p-12"><p className="text-xs font-bold uppercase tracking-[0.16em] text-plum">Before you try</p><h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[32px]">Prepare your photo for {tool.name}</h2><div className="mt-8 space-y-7"><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-plum"><Camera size={20} aria-hidden="true" /></span><div><h3 className="font-semibold text-ink">Choose the source</h3><p className="mt-2 text-sm leading-7 text-muted">{content.photoTip}</p></div></div><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-plum"><ScanFace size={20} aria-hidden="true" /></span><div><h3 className="font-semibold text-ink">Know what the preview means</h3><p className="mt-2 text-sm leading-7 text-muted">{content.expectation}</p></div></div></div></div>
          <div className="relative min-h-[280px] bg-[#f8f5f5] sm:min-h-[380px]"><Image src={content.visuals[0]} alt={`Illustrative ${tool.name} output layout`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" /></div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>More tools to try</h2>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.filter(isBrowsableTool).slice(0, 6).map(item => <Link key={item.slug} href={`/${item.slug}`} className="tool-related-card overflow-hidden rounded-lg border border-line bg-white"><div className="relative aspect-video bg-[#faf9f8]"><Image src={`/img/results/${item.slug}.png`} alt={`${item.name} result example`} fill sizes="(min-width: 1440px) 460px, (min-width: 1024px) 31vw, (min-width: 640px) 45vw, 100vw" className="object-contain" /></div><div className="flex items-center justify-between gap-3 px-5 py-4"><h3 className="text-[15px] font-semibold text-ink">{item.name}</h3><ArrowUpRight size={17} className="shrink-0 text-plum" aria-hidden="true" /></div></Link>)}
        </div>
        <div className="mt-8 text-center"><Link href="/tools" className="tool-text-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-plum">Browse all tools<ArrowRight size={16} aria-hidden="true" /></Link></div>
      </section>

      {relatedPosts.length > 0 && <section id="related-reading" className={sectionClass}>
        <div className="mx-auto max-w-[1220px]"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-plum">From the journal</p><h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[32px]">Read a little further</h2></div><Link href="/blog" className="tool-text-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-plum">All guides<ArrowRight size={16} aria-hidden="true" /></Link></div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">{relatedPosts.map(post => <Link key={post.slug} href={`/blog/${post.slug}`} className="tool-related-card flex min-h-52 flex-col rounded-xl border border-line bg-cream p-6"><BookOpen size={22} className="text-plum" aria-hidden="true" /><h3 className="mt-7 text-lg font-semibold leading-snug text-ink">{post.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted">{post.description}</p><span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-plum">Read guide<ArrowUpRight size={15} aria-hidden="true" /></span></Link>)}</div>
        </div>
      </section>}

      <section id="tool-faq" className={`${sectionClass} !pb-20`}>
        <h2 className={headingClass}>{content.faqHeading ?? `${tool.name}: your questions, answered`}</h2>
        <div className="mx-auto mt-9 max-w-[960px] space-y-3">{content.faqs.map(([question, answer]) => <details key={question} className="group rounded-xl border border-line bg-cream/50 px-5 py-4 open:bg-white sm:px-6 [&_summary::-webkit-details-marker]:hidden"><summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-5 text-[17px] font-bold leading-6 tracking-[-0.025em] text-ink"><span>{question}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush text-plum"><ChevronDown size={18} className="transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></span></summary><p className="mt-3 max-w-3xl pr-8 text-[15px] leading-7 text-muted">{answer}</p></details>)}</div>
        <p className="mt-7 text-center text-sm text-muted">Still have a question? <Link href="/contact" className="tool-text-link font-semibold text-plum underline underline-offset-4">Get in touch</Link></p>
      </section>

      <section className="tool-section bg-plum px-5 py-14 text-center text-white sm:px-10 sm:py-20"><div className="mx-auto max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Your next step</p><h2 className="mt-4 text-[27px] font-semibold leading-tight tracking-[-0.025em] sm:text-[34px]">{content.downloadBanner?.title ?? `See ${tool.name} with your photo`}</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/80">{content.downloadBanner?.body ?? `Try a sample first, or use a photo you have permission to process. Review the complete ${tool.name} result before you download it.`}</p><a href="#tool-workspace" className="tool-primary-button mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-plum hover:!bg-blush">Try {tool.name}<ArrowRight size={16} aria-hidden="true" /></a></div></section>
    </div>
  );
}
