import { SITE, type Category, type Tool } from "@/lib/catalog";
import { GOOGLE_PLAY_URL, SUPPORT_EMAIL } from "@/lib/site-info";
import { PRICING, money } from "@/lib/pricing";
import { CONTENT_UPDATED } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo-meta";
import type { ToolPageContent } from "@/lib/tool-page-content";
import type { BlogPost } from "@/lib/blog-posts";

const CTX = "https://schema.org";
export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;
const orgRef = { "@id": ORG_ID };

/** Organization: AI Beauty Styling, operated by Verified Glam. No ratings, reviews or awards. */
export function organizationSchema() {
  return {
    "@context": CTX,
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: "Verified Glam",
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/img/favicon.png` },
    description: SITE.tagline,
    parentOrganization: { "@type": "Organization", name: "Verified Glam" },
    sameAs: [GOOGLE_PLAY_URL],
    contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", email: SUPPORT_EMAIL, availableLanguage: "en" }],
  };
}

/** WebSite. No SearchAction: /tools has no search query parameter. */
export function websiteSchema() {
  return { "@context": CTX, "@type": "WebSite", "@id": SITE_ID, url: SITE.url, name: SITE.name, description: SITE.tagline, inLanguage: "en", publisher: orgRef };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function itemListSchema(name: string, tools: Tool[]) {
  return {
    "@context": CTX,
    "@type": "ItemList",
    name,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: absoluteUrl(`/${tool.slug}`) })),
  };
}

const APP_CATEGORY: Record<Category["id"], string> = {
  "face-analysis": "LifestyleApplication",
  "glow-up": "LifestyleApplication",
  "skin-retouch": "MultimediaApplication",
  "hair-beard": "LifestyleApplication",
  "makeup-tryon": "LifestyleApplication",
  "fashion-style": "LifestyleApplication",
  "fun-effects": "MultimediaApplication",
  "photo-tools": "MultimediaApplication",
};

export function webApplicationSchema(tool: Tool, content: Pick<ToolPageContent, "metaDescription" | "heroLead">, image: string) {
  const url = absoluteUrl(`/${tool.slug}`);
  return {
    "@context": CTX,
    "@type": "WebApplication",
    "@id": `${url}#app`,
    name: tool.name,
    description: content.metaDescription ?? tool.summary,
    url,
    image: absoluteUrl(image),
    applicationCategory: APP_CATEGORY[tool.category],
    operatingSystem: "Web",
    inLanguage: "en",
    isAccessibleForFree: true,
    // Every account starts with PRICING.starter.credits free credits; no payment needed to try a tool.
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD", availability: "https://schema.org/InStock", description: `Free to start: new accounts get ${PRICING.starter.credits} free credits.`, url: absoluteUrl("/pricing") },
    audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
    dateModified: CONTENT_UPDATED,
    publisher: orgRef,
  };
}

export function howToSchema(tool: Tool, content: Pick<ToolPageContent, "steps" | "howToHeading">) {
  const url = absoluteUrl(`/${tool.slug}`);
  return {
    "@context": CTX,
    "@type": "HowTo",
    name: content.howToHeading ?? `How to use ${tool.name}`,
    step: content.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.body, url: `${url}#how-it-works` })),
  };
}

export function faqSchema(faqs: Array<[string, string]>) {
  return { "@context": CTX, "@type": "FAQPage", mainEntity: faqs.map(([q, answer]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: answer } })) };
}

export function blogPostingSchema(post: BlogPost, image: string) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": CTX,
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [absoluteUrl(image)],
    author: { "@type": "Organization", name: `${SITE.name} editorial team`, url: absoluteUrl("/about") },
    publisher: { "@type": "Organization", "@id": ORG_ID, name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/img/favicon.png` } },
    datePublished: post.published,
    dateModified: post.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en",
  };
}

/** Pricing: Pro Monthly, Pro Yearly (with trial) and pay-as-you-go credits. All numbers come from lib/pricing.ts. */
export function pricingSchema() {
  const url = absoluteUrl("/pricing");
  const brand = { "@type": "Brand", name: SITE.name };
  return [
    { "@context": CTX, "@type": "Product", name: `${SITE.name} Pro Monthly`, description: `${PRICING.monthly.credits} credits every month and access to all tools. Cancel any time.`, brand, offers: { "@type": "Offer", price: PRICING.monthly.price, priceCurrency: "USD", availability: "https://schema.org/InStock", url } },
    { "@context": CTX, "@type": "Product", name: `${SITE.name} Pro Yearly`, description: `${PRICING.yearly.credits} credits over the year and access to all tools. Starts with a ${PRICING.yearly.trialDays}-day free trial; cancel before it ends and pay nothing, then ${money(PRICING.yearly.price)} per year.`, brand, offers: { "@type": "Offer", price: PRICING.yearly.price, priceCurrency: "USD", availability: "https://schema.org/InStock", url } },
    { "@context": CTX, "@type": "Product", name: `${SITE.name} pay-as-you-go credits`, description: `One-time credit packs from ${money(PRICING.payg.min)} to ${money(PRICING.payg.max)}. Credits never expire and nothing renews.`, brand, offers: { "@type": "AggregateOffer", lowPrice: PRICING.payg.min, highPrice: PRICING.payg.max, priceCurrency: "USD", availability: "https://schema.org/InStock", url } },
  ];
}
