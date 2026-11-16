import type { CategoryId, Tool } from "@/lib/catalog";
import { findYourFaceShapeFromAPhotoPost } from "@/lib/blog/posts/find-your-face-shape-from-a-photo";
import { whatFacialSymmetryReallyShowsPost } from "@/lib/blog/posts/what-facial-symmetry-really-shows";
import { seasonalColorPalettePhotoGuidePost } from "@/lib/blog/posts/seasonal-color-palette-photo-guide";
import { naturalLookingPortraitRetouchPost } from "@/lib/blog/posts/natural-looking-portrait-retouch";
import { planAHairChangeWithAPreviewPost } from "@/lib/blog/posts/plan-a-hair-change-with-a-preview";
import { virtualMakeupTryOnLightingPost } from "@/lib/blog/posts/virtual-makeup-try-on-lighting";
import { virtualOutfitPreviewLimitsPost } from "@/lib/blog/posts/virtual-outfit-preview-limits";
import { creativePortraitEffectsResponsiblyPost } from "@/lib/blog/posts/creative-portrait-effects-responsibly";
import { restoreAnOldFamilyPhotoPost } from "@/lib/blog/posts/restore-an-old-family-photo";

/** One piece of article content. Inline links written as [anchor](/path or https://...) work in every text field. */
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string; source?: { label: string; url?: string } }
  | { type: "image"; src: string; alt: string; width?: number; height?: number; caption?: string; creditText?: string; creditUrl?: string; license?: string }
  | { type: "callout"; tone: "tip" | "warning" | "note"; title?: string; text: string }
  | { type: "steps"; items: Array<{ title: string; text: string }> }
  | { type: "cta"; variant: "app" | "tool"; headline: string; text?: string; label?: string; toolSlug?: string }
  | { type: "summary"; title?: string; text: string };

export type BlogSection = {
  heading: string;
  /** Anchor id; derived from the heading when left out. */
  id?: string;
  /** Plain paragraphs, rendered before `blocks`. Old posts use only this. */
  paragraphs?: string[];
  blocks?: BlogBlock[];
};

export type BlogSource = { title: string; url: string; publisher: string; accessed: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  toolSlugs: string[];
  /** ISO dates shown on the page and in BlogPosting schema. */
  published: string;
  updated: string;
  /** 4 to 7 short points. When left out they are derived from the first sentence of each section. */
  keyTakeaways?: string[];
  /** Opening paragraph shown after the Key Takeaways. */
  intro?: string;
  sections: BlogSection[];
  faqs: Array<[string, string]>;
  sources?: BlogSource[];
  /** Tool slugs to feature; defaults to toolSlugs. */
  relatedTools?: string[];
  /** Guide slugs to feature; defaults to other guides in the same category. */
  relatedPosts?: string[];
  /** Defaults to BLOG_AUTHOR. */
  author?: string;
  /** Lead picture, stored in R2 at /blog/<slug>/<file>. */
  heroImage?: { src: string; alt: string; width: number; height: number; credit?: string };
  /** The one phrase the post is written to rank for, and 4 to 8 related search phrases (used in schema and for internal checks). */
  primaryKeyword?: string;
  keywords?: string[];
  /** Overrides for the headline of the tool and app calls to action. */
  cta?: { toolHeadline?: string; appHeadline?: string };
};

/** Author line used on every guide. Never a named person. */
export const BLOG_AUTHOR = "AI Beauty Styling editorial team";

/** Original, published guides. Add a post here and its category/tool associations
 * automatically place it beside relevant tool pages. */
export const BLOG_POSTS: BlogPost[] = [
  findYourFaceShapeFromAPhotoPost,
  whatFacialSymmetryReallyShowsPost,
  seasonalColorPalettePhotoGuidePost,
  naturalLookingPortraitRetouchPost,
  planAHairChangeWithAPreviewPost,
  virtualMakeupTryOnLightingPost,
  virtualOutfitPreviewLimitsPost,
  creativePortraitEffectsResponsiblyPost,
  restoreAnOldFamilyPhotoPost,
];

export const getBlogPost = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug);

/** Hand-picked guides for each tool, most relevant first. A tool lists only guides that fit it, and never more than two. */
const TOOL_GUIDES: Record<string, string[]> = {
  "face-beauty-analysis": ["find-your-face-shape-from-a-photo", "what-facial-symmetry-really-shows"],
  "facial-symmetry": ["what-facial-symmetry-really-shows", "find-your-face-shape-from-a-photo"],
  "face-golden-ratio": ["what-facial-symmetry-really-shows", "find-your-face-shape-from-a-photo"],
  "attractiveness-test": ["find-your-face-shape-from-a-photo", "natural-looking-portrait-retouch"],
  "face-comparison": ["what-facial-symmetry-really-shows", "natural-looking-portrait-retouch"],
  "beauty-score-showdown": ["natural-looking-portrait-retouch"],
  "face-shape-analyzer": ["find-your-face-shape-from-a-photo", "plan-a-hair-change-with-a-preview"],
  "skin-analysis": ["natural-looking-portrait-retouch"],
  "facial-landmarks": ["what-facial-symmetry-really-shows", "find-your-face-shape-from-a-photo"],
  "seasonal-color-palette": ["seasonal-color-palette-photo-guide", "virtual-makeup-try-on-lighting"],
  "beauty-tips": ["seasonal-color-palette-photo-guide"],
  "beauty-routine-challenge": ["seasonal-color-palette-photo-guide"],
  "ai-skin-enhancement": ["natural-looking-portrait-retouch"],
  "smart-beauty": ["natural-looking-portrait-retouch"],
  "face-beauty-retouch": ["natural-looking-portrait-retouch"],
  "ai-face-enhancer": ["natural-looking-portrait-retouch", "restore-an-old-family-photo"],
  "ai-face-slimming": ["natural-looking-portrait-retouch"],
  "hairstyle-changer": ["plan-a-hair-change-with-a-preview", "find-your-face-shape-from-a-photo"],
  "ai-hair-color": ["plan-a-hair-change-with-a-preview", "seasonal-color-palette-photo-guide"],
  "beard-styling": ["plan-a-hair-change-with-a-preview", "find-your-face-shape-from-a-photo"],
  "beard-remover": ["plan-a-hair-change-with-a-preview"],
  "hair-loss-simulation": ["plan-a-hair-change-with-a-preview"],
  "bald-filter": ["plan-a-hair-change-with-a-preview"],
  "lip-color-changer": ["virtual-makeup-try-on-lighting", "seasonal-color-palette-photo-guide"],
  "eyeshadow-try-on": ["virtual-makeup-try-on-lighting", "seasonal-color-palette-photo-guide"],
  "colored-contacts": ["virtual-makeup-try-on-lighting"],
  "ai-eyelashes": ["virtual-makeup-try-on-lighting"],
  "ai-eyebrows": ["virtual-makeup-try-on-lighting"],
  "ai-lip-enhancement": ["virtual-makeup-try-on-lighting"],
  "virtual-try-on-clothes": ["virtual-outfit-preview-limits", "seasonal-color-palette-photo-guide"],
  "ai-tattoo-generator": ["creative-portrait-effects-responsibly"],
  "ai-waist-slimming": ["virtual-outfit-preview-limits"],
  "cartoon-yourself": ["creative-portrait-effects-responsibly"],
  "face-filters": ["creative-portrait-effects-responsibly"],
  "facial-expression-changer": ["creative-portrait-effects-responsibly"],
  "age-gender-swap": ["creative-portrait-effects-responsibly"],
  "ai-face-swap": ["creative-portrait-effects-responsibly"],
  "square-face-filter": ["creative-portrait-effects-responsibly"],
  "big-head-effect": ["creative-portrait-effects-responsibly"],
  "halloween-mask": ["creative-portrait-effects-responsibly"],
  "pregnant-filter": ["creative-portrait-effects-responsibly"],
  "birthday-image-generator": ["creative-portrait-effects-responsibly"],
  "ai-fortune-teller": ["creative-portrait-effects-responsibly"],
  "elf-name-generator": ["creative-portrait-effects-responsibly"],
  "old-photo-restoration": ["restore-an-old-family-photo", "natural-looking-portrait-retouch"],
  "face-blur": ["restore-an-old-family-photo", "creative-portrait-effects-responsibly"],
  "merge-portraits": ["creative-portrait-effects-responsibly"],
};

/** One-sentence blurbs per guide. Each has several phrasings, and the tool name makes the sentence specific to the page. */
const GUIDE_BLURBS: Record<string, string[]> = {
  "find-your-face-shape-from-a-photo": ["Check your face shape by hand first, then see how {tool} reads the same photo.", "A plain guide to reading your outline, so your {tool} result makes sense.", "Learn what a face shape label means in practice before you act on {tool}.", "Start here if you want to know which outline {tool} is looking at.", "Follow these steps on your photo and compare them with what {tool} shows."],
  "what-facial-symmetry-really-shows": ["See what a symmetry guide can and cannot show before you read your {tool} result.", "A calm look at why faces are never perfectly even, written for {tool} users.", "Learn how camera angle can fake asymmetry, then run {tool} with that in mind.", "Read this before you decide what {tool} says about the two sides of your face.", "Understand the centerline guide that {tool} draws on your portrait."],
  "seasonal-color-palette-photo-guide": ["Learn how daylight and bare skin change the colors you see, then try {tool} again.", "A photo-first guide to seasons, written for people using {tool}.", "See how a palette is read from a photo before you shop with your {tool} result.", "Read how to take a photo that gives {tool} a fair view of your coloring.", "Find out why one season is only a starting point, whatever {tool} shows."],
  "natural-looking-portrait-retouch": ["Learn how to keep a retouch natural, then judge your {tool} result with fresh eyes.", "See which details to leave alone when you use {tool} on a portrait.", "A guide to light edits that still look like you, written for {tool}.", "Check your edit against this list before you save the {tool} version.", "Read how to compare the original and the edit when you use {tool}."],
  "plan-a-hair-change-with-a-preview": ["Plan your hair change from a photo before you act on {tool}.", "See how to turn a preview into a clear request for your stylist after {tool}.", "Learn what a photo preview cannot tell you about real hair, then use {tool}.", "A short guide to choosing a change you will still like after {tool}.", "Read how to talk to your stylist with your {tool} image in hand."],
  "virtual-makeup-try-on-lighting": ["See how light changes color on screen, then check your {tool} result in daylight.", "Learn why a shade looks different in a shop, and what that means for {tool}.", "A lighting guide for virtual makeup, written for people using {tool}.", "Read this before you buy anything based on your {tool} preview.", "Learn how to photograph your face so {tool} starts from true color."],
  "virtual-outfit-preview-limits": ["See what an outfit preview can show, and what {tool} cannot know about fit.", "Learn which details to check in the shop after you use {tool}.", "A guide to the limits of a clothing preview, written for {tool} users.", "Read this before you spend money on an idea you saw in {tool}.", "Compare a preview with the real thing, step by step, after {tool}."],
  "creative-portrait-effects-responsibly": ["Learn how to share an edited picture kindly, especially one made with {tool}.", "Read how to ask permission and label your {tool} result before you post it.", "A short guide to playful edits that still respect the people in them, for {tool}.", "See how to keep a {tool} picture fun and clearly marked as edited.", "Check this list before you send your {tool} image to anyone."],
  "restore-an-old-family-photo": ["Learn how to prepare a print before you scan it, then use {tool}.", "See how to save the original beside the new version when you use {tool}.", "A guide to scanning and storing old photos, written for people using {tool}.", "Read what a repair can and cannot bring back before you rely on {tool}.", "Follow these steps to give {tool} the best scan you can."],
};

export function guideBlurb(tool: Tool, post: BlogPost): string {
  const options = GUIDE_BLURBS[post.slug];
  if (!options) return post.description;
  let hash = 0;
  for (const char of tool.slug + post.slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return options[hash % options.length].replace("{tool}", tool.name);
}

export function getRelatedBlogPosts(tool: Tool, limit = 2): BlogPost[] {
  const picked = TOOL_GUIDES[tool.slug];
  if (picked) return picked.map((slug) => getBlogPost(slug)).filter((post): post is BlogPost => Boolean(post)).slice(0, limit);
  return BLOG_POSTS.filter((post) => post.toolSlugs.includes(tool.slug)).slice(0, limit);
}
