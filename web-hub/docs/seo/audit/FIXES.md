# SEO / AEO / LLM fixes: status against SEO_AUDIT.md

Before data: `crawl.json` (live site, 2026-11-14). After data: `crawl-after.json` (local production build with `SITE_INDEXABLE=true NEXT_PUBLIC_APP_MODE=handoff`, crawled on http://localhost:3200 with `scripts/seo-audit.mjs`; 73 public pages, plus 3 auth pages). Structure checks: `node scripts/validate-schema.mjs http://localhost:3200` (73 pages, all passed).

Everything below was tested on a local build only. Nothing was deployed, so "live" behaviour on Cloudflare is not verified.

| # | Finding | Before | After (local, flag on) | Status |
|---|---------|--------|------------------------|--------|
| 1 | Sitemap empty / robots blocks all; never tested with flag on | empty sitemap, `Disallow: /` | 73 URLs with lastmod, changefreq, priority; 192 image entries; 0 private paths; robots allows search/answer bots, training bots controlled by `ALLOW_AI_TRAINING`. Flag off: sitemap empty, `Disallow: /`, all pages `noindex, nofollow`, llms.txt 404 | Fixed (not verified on the live host) |
| 2 | No canonical on 71/76 | 5 of 73 | 73 of 73, absolute | Fixed |
| 3 | No OG/Twitter, no share image | 0 of 73 | 73 of 73 with og:title/description/image/url and twitter summary_large_image; default `/opengraph-image` (1200x630, plum) plus per-tool/per-category result images | Fixed. Caveat: the per-tool images are the existing 1672x941 PNGs (about 2.6 MB each); some platforms (WhatsApp) may skip very large images. Real social previews were not tested |
| 4 | Inconsistent noindex | 26 noindex, 47 tool pages with no robots meta | every page has a robots meta derived from `SITE_INDEXABLE` (`lib/seo.ts`). Private pages always noindex. `/celebrity-look-alike` (an explainer, not a tool) is noindex even when the switch is on and is not in the sitemap | Fixed |
| 5 | Only FAQPage | FAQPage only | Organization (2: home, about), WebSite, BreadcrumbList (67), ItemList (9), WebApplication (47), HowTo (47), BlogPosting (9), Blog index, Product x3 on /pricing, FAQPage (48, now also /pricing). No aggregateRating anywhere. No SearchAction because /tools has no search parameter | Partly fixed: standalone ImageObject not added (images are referenced inside WebApplication/BlogPosting). Validated by my own script, not by Google's Rich Results test |
| 6 | 29 pages without JSON-LD | 26 public pages | 4 left: /contact, /privacy, /terms, /delete-account | Partly fixed (nothing useful to mark up on those) |
| 7 | Generic alt text | "X complete downloadable example 1", "Illustrative X ..." | alt built from each image's own story title and description (e.g. "Explore soft layers with the same expression (Hairstyle Changer example)"), cards "Tool example: outcome", home images hand-described after viewing them | Fixed for the patterns listed. One alt is 142 characters; alts are derived from copy, not written image by image |
| 8 | About half of images alt="" | 531 empty alts | 531 empty alts, all intentional (see below) | Not changed, reviewed: kept empty only where redundant |
| 9 | File names, image sitemap, width/height, loading | none | image sitemap added; files not renamed (as instructed); every next/image uses `fill` inside an aspect-ratio or fixed-height container; first gallery image and first hero portrait use preload, the rest lazy-load | Partly fixed. Layout shift and Core Web Vitals were NOT measured |
| 10 | Titles over 60 | 7 | 0 over 60; /login title 42 characters | Fixed |
| 11 | Descriptions over 160 | home + 3 auth | 0 over 160; login, register, forgot-password have distinct descriptions | Fixed |
| 12 | Footer headings as H2 | 73 pages | 0; they are `<p>` with the same classes | Fixed (visual identity not compared pixel by pixel) |
| 13 | Home thin / no keyword intro | 471 words | 484 words; hero line now says "AI beauty tools"; title and description carry the main terms | Partly fixed; no keyword research done |
| 14 | Blog posts about 310 words, no author/dates | 246 to 328 words | 1,004 to 1,266 words each, byline "AI Beauty Styling editorial team", published 2026-11-01..10, updated 2026-11-14, FAQ block, 2 to 6 contextual tool links each | Fixed |
| 15 | Category pages and /tools thin | 139 to 149 words on categories, 388 on /tools | 40 to 90 word keyword intros in the existing lead paragraph (categories now 180 to 200 words per page, /tools 420) | Fixed |
| 16 | No E-E-A-T signals | none | organisation byline, dates, reviewed date in schema, 4 authoritative sources | Partly fixed: no named author (by instruction), no methodology page |
| 17 | Uneven internal linking | 6 tools with 2 inbound links | facial-landmarks, pregnant-filter, birthday-image-generator, ai-fortune-teller, elf-name-generator now 9 to 10 inbound (rotating related tools + blog links). /register not addressed (auth page) | Fixed for the five tools |
| 18 | One external link | 1 | 5 in total (adds AAD sun protection, FDA decorative contact lenses, Library of Congress photo care, National Archives family archives; all returned HTTP 200 when checked). Other posts have none: I was not sure of a suitable URL, so I skipped them | Partly fixed |
| 19 | No llms.txt | 404 | `/llms.txt` and `/llms-full.txt` (tool descriptions, steps, FAQs), plain text. They return 404 while `SITE_INDEXABLE` is false so the one switch stays in control | Fixed |
| 20 | AI crawlers | blocked | explicit groups for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User, Applebot; training bots (GPTBot, Google-Extended, CCBot, ClaudeBot, anthropic-ai, Applebot-Extended) allowed, flip with `ALLOW_AI_TRAINING` in `lib/seo.ts`. ClaudeBot is placed with the training bots because Anthropic documents it as its training crawler | Fixed |
| 21 | No entity/summary/last-updated signals | none | Organization schema with sameAs, contactPoint, parentOrganization; dateModified in schema; /about carries the Organization schema. No answer-summary block added (the existing hero lead already serves as the summary); no speakable | Partly fixed |
| 22 | No manifest, no default OG image | 404 | `/manifest.webmanifest` and `/opengraph-image` return 200. `/favicon.ico` still 404 (icon is served via metadata) | Fixed (favicon.ico untouched) |
| 23 | Brand split AI Beauty Styling / Verified Glam | not stated | Organization: alternateName and parentOrganization Verified Glam, Google Play app as sameAs | Fixed |

## Empty alt text left in place (alt="")
- Gallery thumbnail strip: each thumbnail is a button with its own aria-label and shows the same image as the main gallery picture.
- Logo images next to the site name (header, footer, mobile drawer).
- Home page: small overlay thumbnail on each tool card (same image as the card), and the decorative image mosaic in the closing section (aria-hidden).
- Mega menu preview image (decorative).

## Other notes
- A previous JSON-LD helper wrote `"<"` in a normal string, which is just `<` after JavaScript parses it, so nothing was escaped. The new `components/JsonLd.tsx` writes `\\u003c`.
- Pricing comes from `lib/pricing.ts`. The working copy there (owner edits, not committed by me) has Pro Yearly at $66, so the schema says $66, not $60.
- Not verified: Google Rich Results / Schema validator, Facebook/X/LinkedIn preview rendering, behaviour of `next/og` and the txt routes on Cloudflare via OpenNext, Core Web Vitals, rendering of the changed footer against the previous design (classes are identical).
- `scripts/check-copy.mjs`: unchanged result (48 tools, 1 error for cartoon-yourself, 9 warnings); I did not touch `lib/copy`.
