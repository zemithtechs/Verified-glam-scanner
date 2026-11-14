import type { MetadataRoute } from "next";
import { SITE } from "@/lib/catalog";
import { ALLOW_AI_TRAINING, PRIVATE_PATHS, SITE_INDEXABLE } from "@/lib/seo";

/** Search and live-answer crawlers: always allowed when the site is indexable. */
const SEARCH_AND_ANSWER_BOTS = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User", "Applebot"];

/**
 * Model-training crawlers. Controlled by ALLOW_AI_TRAINING in lib/seo.ts (owner decision).
 * ClaudeBot is Anthropic's training crawler, so it sits here with the other training bots.
 */
const TRAINING_BOTS = ["GPTBot", "Google-Extended", "CCBot", "ClaudeBot", "anthropic-ai", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    { userAgent: SEARCH_AND_ANSWER_BOTS, allow: "/", disallow: PRIVATE_PATHS },
    ALLOW_AI_TRAINING
      ? { userAgent: TRAINING_BOTS, allow: "/", disallow: PRIVATE_PATHS }
      : { userAgent: TRAINING_BOTS, disallow: "/" },
  ];
  return { rules, sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url };
}
