import { BLOG_POSTS } from "@/lib/blog-posts";
import { CATEGORIES, SITE, TOOLS, isAvailable, toolsInCategory } from "@/lib/catalog";
import { PRICING, money } from "@/lib/pricing";
import { CONTENT_UPDATED } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo-meta";
import { GOOGLE_PLAY_URL, SUPPORT_EMAIL } from "@/lib/site-info";
import { getToolPageContent } from "@/lib/tool-page-content";

const SUMMARY = `${SITE.name} (${SITE.domain}) is a collection of AI beauty tools that work from one photo you choose: face analysis, skin analysis, hairstyle and hair color previews, virtual makeup try-on, virtual clothes try-on, fun face effects and photo restoration. Results are subjective entertainment and self-discovery, not medical or professional advice. Tools are for adults aged 18 and over.`;

const facts = () => [
  "- Audience: adults aged 18 and over.",
  "- Purpose: entertainment and self-discovery. Scores, shape labels and skin notes are subjective impressions of one photo, not measurements, diagnoses or medical advice.",
  `- Pricing: new accounts get ${PRICING.starter.credits} free credits. One AI result costs ${PRICING.creditsPerGeneration} credits. Pro Monthly is ${money(PRICING.monthly.price)} (${PRICING.monthly.credits} credits per month). Pro Yearly is ${money(PRICING.yearly.price)} per year (${PRICING.yearly.credits} credits) with a ${PRICING.yearly.trialDays}-day free trial. Pay-as-you-go credit packs run from ${money(PRICING.payg.min)} to ${money(PRICING.payg.max)} and never expire.`,
  "- Photos are processed only when you run a tool and can be deleted by deleting your account.",
  `- Operator: Verified Glam. Android app: ${GOOGLE_PLAY_URL}`,
  `- Support: ${SUPPORT_EMAIL}`,
  `- Content last reviewed: ${CONTENT_UPDATED}`,
];

const toolLines = () => CATEGORIES.flatMap((category) => {
  const tools = toolsInCategory(category.id).filter(isAvailable);
  return [`### ${category.name}`, category.description, ...tools.map((tool) => `- [${tool.name}](${absoluteUrl(`/${tool.slug}`)}): ${tool.summary}`), ""];
});

/** /llms.txt following the llms.txt convention: H1, blockquote summary, then sections of links. */
export function buildLlmsTxt() {
  return [
    `# ${SITE.name}`,
    "",
    `> ${SUMMARY}`,
    "",
    "## Tools by category",
    "",
    ...toolLines(),
    "## Key pages",
    "",
    `- [Home](${absoluteUrl("/")}): Overview of the tools.`,
    `- [All tools](${absoluteUrl("/tools")}): Directory of every tool.`,
    `- [Pricing](${absoluteUrl("/pricing")}): Free credits, Pro Monthly, Pro Yearly and pay-as-you-go credits.`,
    `- [About](${absoluteUrl("/about")}): What AI Beauty Styling is and how it handles photos.`,
    `- [Contact](${absoluteUrl("/contact")}): Support, privacy and partnership questions.`,
    `- [Privacy Policy](${absoluteUrl("/privacy")}): How photos and account data are handled.`,
    `- [Terms of Use](${absoluteUrl("/terms")}): Entertainment disclaimer, subscriptions and acceptable use.`,
    "",
    "## Guides",
    "",
    ...BLOG_POSTS.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.description}`),
    "",
    "## Facts",
    "",
    ...facts(),
    "",
    "## Optional",
    "",
    `- [Full text for language models](${absoluteUrl("/llms-full.txt")}): Tool descriptions and frequently asked questions.`,
    "",
  ].join("\n");
}

/** /llms-full.txt: the same structure with tool descriptions, steps and FAQ text inlined. */
export function buildLlmsFullTxt() {
  const tools = TOOLS.filter(isAvailable).flatMap((tool) => {
    const content = getToolPageContent(tool);
    return [
      `### ${tool.name}`,
      `URL: ${absoluteUrl(`/${tool.slug}`)}`,
      "",
      content.metaDescription ?? tool.summary,
      "",
      content.heroLead,
      "",
      "How it works:",
      ...content.steps.map((step, index) => `${index + 1}. ${step.title}: ${step.body}`),
      "",
      "Frequently asked questions:",
      ...content.faqs.flatMap(([question, answer]) => [`Q: ${question}`, `A: ${answer}`]),
      "",
    ];
  });
  return [
    `# ${SITE.name}: full reference`,
    "",
    `> ${SUMMARY}`,
    "",
    "## Facts",
    "",
    ...facts(),
    "",
    "## Tools",
    "",
    ...tools,
    "## Guides",
    "",
    ...BLOG_POSTS.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.description}`),
    "",
  ].join("\n");
}
