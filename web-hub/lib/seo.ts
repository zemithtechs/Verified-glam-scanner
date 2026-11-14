/**
 * SEO switches. This file is the ONLY place that decides whether the site may be indexed.
 *
 * SITE_INDEXABLE: local previews and the pre-launch site are never indexable. The owner flips
 * this to true (env SITE_INDEXABLE=true in the production deployment) on cutover day. It drives
 * the robots meta tag of every public page, robots.txt and sitemap.xml together.
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";

/**
 * OWNER DECISION: may AI companies use the site's public pages to TRAIN models?
 * true  = GPTBot, Google-Extended, CCBot, ClaudeBot, anthropic-ai and Applebot-Extended are allowed in robots.txt.
 * false = those training crawlers are disallowed (search and answer bots stay allowed).
 * This does not affect normal Google/Bing search indexing or live AI answer/search bots.
 */
export const ALLOW_AI_TRAINING = true;

/** Paths that must never be crawled or indexed (accounts, admin, API, internal tools). */
export const PRIVATE_PATHS = ["/app", "/admin", "/login", "/register", "/forgot-password", "/api/", "/icon-sheet"];

/** Date the public content was last reviewed. Used for sitemap lastModified and schema dateModified. */
export const CONTENT_UPDATED = "2026-11-14";

/** Robots meta for a public page. Always noindex while SITE_INDEXABLE is false. */
export const publicRobots = () => ({ index: SITE_INDEXABLE, follow: SITE_INDEXABLE });
/** Robots meta for private pages (login, dashboard, admin). Never indexable, regardless of the switch. */
export const privateRobots = { index: false, follow: false } as const;
