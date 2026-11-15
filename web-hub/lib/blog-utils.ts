import { BLOG_AUTHOR, BLOG_POSTS, type BlogBlock, type BlogPost } from "@/lib/blog-posts";

export type ResolvedSection = { id: string; heading: string; blocks: Array<BlogBlock & { id?: string }> };
export type TocItem = { id: string; text: string; level: 2 | 3 };
export type ResolvedPost = {
  author: string;
  keyTakeaways: string[];
  intro?: string;
  sections: ResolvedSection[];
  toc: TocItem[];
  wordCount: number;
  readingMinutes: number;
};

const LINK = /\[([^\]]+)\]\([^)]+\)/g;
/** Removes [anchor](url) syntax, leaving the anchor text. */
export const stripLinks = (text: string) => text.replace(LINK, "$1");

export const slugify = (text: string) =>
  stripLinks(text).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/g, "") || "section";

function uniqueId(base: string, used: Set<string>) {
  let id = base;
  for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
  used.add(id);
  return id;
}

function firstSentence(text: string) {
  const plain = stripLinks(text).trim();
  const match = plain.match(/^.+?[.!?](?=\s|$)/);
  return (match ? match[0] : plain).trim();
}

const wordsIn = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

function blockText(block: BlogBlock): string {
  switch (block.type) {
    case "p": case "h3": return block.text;
    case "list": return block.items.join(" ");
    case "table": return [...block.headers, ...block.rows.flat()].join(" ");
    case "callout": return `${block.title ?? ""} ${block.text}`;
    case "steps": return block.items.map((i) => `${i.title} ${i.text}`).join(" ");
    case "summary": return block.text;
    case "cta": return `${block.headline} ${block.text ?? ""}`;
    default: return "";
  }
}

/** Fills in everything a template needs: ids, table of contents, takeaways, reading time. Old paragraph-only posts work unchanged. */
export function resolvePost(post: BlogPost): ResolvedPost {
  const used = new Set<string>(["key-takeaways", "faq", "sources", "related"]);
  const sections: ResolvedSection[] = post.sections.map((section) => {
    const id = uniqueId(section.id ?? slugify(section.heading), used);
    const blocks: ResolvedSection["blocks"] = [
      ...(section.paragraphs ?? []).map((text) => ({ type: "p" as const, text })),
      ...(section.blocks ?? []),
    ].map((block) => (block.type === "h3" ? { ...block, id: uniqueId(block.id ?? slugify(block.text), used) } : block));
    return { id, heading: section.heading, blocks };
  });

  const toc: TocItem[] = [];
  if (post.faqs.length > 0) used.add("faq");
  for (const section of sections) {
    toc.push({ id: section.id, text: section.heading, level: 2 });
    for (const block of section.blocks) if (block.type === "h3" && block.id) toc.push({ id: block.id, text: block.text, level: 3 });
  }
  if (post.faqs.length > 0) toc.push({ id: "faq", text: "Common questions", level: 2 });
  if (post.sources?.length) toc.push({ id: "sources", text: "Sources", level: 2 });

  const derived = post.sections.map((s) => firstSentence(s.paragraphs?.[0] ?? (s.blocks?.find((b) => b.type === "p") as { text: string } | undefined)?.text ?? s.heading)).filter(Boolean).slice(0, 7);
  const keyTakeaways = post.keyTakeaways?.length ? post.keyTakeaways : derived;

  const text = [post.intro ?? "", ...keyTakeaways, ...sections.flatMap((s) => [s.heading, ...s.blocks.map(blockText)]), ...post.faqs.flat()].join(" ");
  const wordCount = wordsIn(stripLinks(text));
  return { author: post.author ?? BLOG_AUTHOR, keyTakeaways, intro: post.intro, sections, toc, wordCount, readingMinutes: Math.max(1, Math.round(wordCount / 220)) };
}

export function readingTime(post: BlogPost): number {
  return resolvePost(post).readingMinutes;
}

export function relatedPostsFor(post: BlogPost, limit = 3): BlogPost[] {
  const chosen = post.relatedPosts?.map((slug) => BLOG_POSTS.find((p) => p.slug === slug)).filter((p): p is BlogPost => Boolean(p && p.slug !== post.slug)) ?? [];
  const rest = BLOG_POSTS.filter((p) => p.slug !== post.slug && !chosen.includes(p)).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category));
  return [...chosen, ...rest].slice(0, limit);
}

export const formatBlogDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
