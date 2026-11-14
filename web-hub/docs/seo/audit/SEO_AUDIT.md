# SEO / AEO / LLM audit: aibeautystyling.com

Crawled 2026-11-14 on the live site: **76 pages**, all HTTP 200, 1,158 images. Raw data: `docs/seo/audit/crawl.json` (rebuild with `node scripts/seo-audit.mjs`).
Scope note: the site is deliberately hidden from Google until the SEO cutover (robots.txt `Disallow: /`, `noindex`, empty sitemap). Several findings below are therefore "correct today, but must be ready for cutover day".

## What is already good
- Every page has a unique `<title>` and meta description (no duplicates among indexable pages); every page has exactly one H1.
- 24 tool pages: primary keyword is in title, H1 and at least one H2; 1,000-1,250 words of original copy each; FAQPage JSON-LD present and valid (47 pages).
- No orphan pages; every page is reachable by internal links. 36 internal links on a typical tool page.
- No images missing the `alt` attribute. HTTPS, one language (`en`), clean URLs, no redirects/404s among crawled pages.

## Findings (priority order)

### P0: would block ranking or AI recommendation at launch
1. **Sitemap is empty and robots blocks everything** (by design now). Must be verified to produce all ~76 public URLs with `lastmod` and allow crawlers (including GPTBot, ClaudeBot, PerplexityBot, Google-Extended) when `SITE_INDEXABLE=true`. Never tested with the flag on.
2. **No canonical tag on 71 of 76 pages.** Only tool pages that set it explicitly have one. Risk: duplicate-URL signals, especially during the subdomain-to-domain move.
3. **No Open Graph or Twitter Card tags on any page (76/76):** no og:title, og:description, og:image, og:url, twitter:card. No default share image exists. Links shared on WhatsApp, X, Facebook, LinkedIn and many AI answer surfaces show no preview.
4. **Inconsistent noindex:** 29 pages carry `noindex, nofollow` (home, blog, pricing, tools, categories, legal), but the 47 tool pages carry no robots meta at all (they override the layout). Gating must be one switch for the whole site.

### P1: structured data (schema)
5. **Only one schema type on the whole site: FAQPage (47 pages).** Missing: `Organization` + `WebSite` (with SearchAction) on the home page; `SoftwareApplication`/`WebApplication` (with offers) on each tool page; `BreadcrumbList` on tool, category and blog pages; `Article`/`BlogPosting` with author, datePublished, dateModified on the 9 blog posts; `ItemList` on category pages and /tools; `Offer`/`Product` for the pricing plans; `HowTo` for the 3-step sections; `ImageObject` for result images.
6. 29 pages (home, blog, pricing, tools, categories, about, contact, legal, blog posts) have no JSON-LD at all.

### P1: images
7. **Alt text is generic on important images:** gallery images use "Attractiveness Test complete downloadable example 1"; card images "Illustrative result for X"; related-tool images "Illustrative X output layout". Keyword present, but no descriptive value; repeated patterns across 24 pages look templated.
8. **About half of images on a tool page have `alt=""`** (10 of 20 on /attractiveness-test: thumbnails/duplicates). Acceptable only for true duplicates of an adjacent captioned image; verify each is decorative.
9. Image file names are slugs (`hairstyle-changer-feature-1.png`), not descriptive (`curly-bob-hairstyle-preview.webp`). No image sitemap. Images are served as WebP via `/_opt/`, good, but no `width`/`height` audit done (CLS risk) and no `loading`/`fetchpriority` audit.

### P1: titles, descriptions, headings
10. 7 titles longer than 60 characters (pricing + 6 blog posts); /login title under 30 (noindex page, low priority).
11. 4 descriptions over 160 characters (home, register, login, forgot-password); those three auth pages inherit the same description (noindex, so low priority).
12. H2 structure on tool pages ends with site-wide footer headings ("Popular tools", "Explore all tools", "Your workspace", "Support", "More information") as H2s. These are navigation, not content; they dilute heading hierarchy on every page. Should be non-heading elements or H3/`<p>`.
13. Home page: H1 "AI beauty tools for your photo. See the result." has no head keyword like "AI beauty tools" repeated in a descriptive intro; 471 words, thin for a hub. No keyword research mapped to home/category pages (category pages carry copy written for design, not search).

### P2: content depth
14. **Blog posts are thin: ~310 words each** (9 posts) with no author, no dates, no schema. Too short to rank or be cited. 20 pages under 300 words (blog posts, legal, auth).
15. Category pages (8) and /tools have little unique text; no intro paragraph with target keywords ("hairstyle changer", "makeup try on", etc.).
16. Zero E-E-A-T signals on content: no author byline, no "reviewed/updated" date, no methodology, no sources.

### P2: linking
17. Internal linking is solid but uneven: 6 tool pages have fewer than 3 inbound links (facial-landmarks, pregnant-filter, birthday-image-generator, ai-fortune-teller, elf-name-generator, register). No "related guide" links from tool pages to the blog or from blog to tools in body text (blog posts link to tools only via cards). No breadcrumbs (visual or schema).
18. **External links: 1** (Google Play). No outbound links to authoritative sources (dermatology, color-analysis, photography references) to support claims; add a few where facts are stated, with `rel` appropriate.

### P2: LLM / answer-engine readiness
19. **No `/llms.txt`** (404) and no `/llms-full.txt`.
20. AI crawlers are blocked by `Disallow: /` today (intended); at cutover, robots must explicitly allow the main AI search/retrieval bots and decide on training bots (user choice).
21. FAQ answers are answer-first (good for AEO), but no `speakable`/summary block; no "last updated" signals; no consistent entity definition (what AI Beauty Styling is, who runs it) in schema or an About page marked up with `Organization` and `sameAs`.
22. No `manifest.webmanifest`, no site-wide default OG image (`/opengraph-image` 404). Favicon exists via metadata.
23. Brand entity is split across `AI Beauty Styling` and `Verified Glam`; the Organization schema should state the relationship (`alternateName`/`parentOrganization`) so models connect them.

### Not measured in this audit (be aware)
- **Keyword frequency was checked only on the 24 tools with Search Console / chosen keywords** (primary keyword appears 7 to 17 times per page in body text, within acceptable range). Not measured: category, blog, home, pricing pages; no competitor SERP analysis; no search-volume data beyond the Search Console export.
- **Core Web Vitals / PageSpeed** were not measured (earlier crawl: median HTML response about 0.2-0.8 s).
- **Rendered-JavaScript view** not compared to raw HTML; Google's rendering was not tested (site is blocked).
- **Backlinks, Search Console coverage, and real rankings** cannot be assessed until indexing is enabled.
- No hreflang audit (single language).
