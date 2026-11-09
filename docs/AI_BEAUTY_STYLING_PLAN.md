# AI Beauty Styling — Hub Plan

Status: **design preview only.** Nothing here is deployed, committed to a database, or pointed at a domain.
Preview app: `web-hub/` → `npm run dev` → http://localhost:3100
The live scanner (`web-next/`, scanner.verifiedglam.com) is untouched.

---

## 1. What we're building

A beauty-tools directory on its own brand domain (`aibeautystyling.com`), replacing the `scanner.verifiedglam.com` subdomain.

| Goal | How the design serves it |
|------|--------------------------|
| Traffic | One indexable page per tool + category hubs + guides, all on one domain so authority compounds |
| AdSense approval | Real content pages, About/Contact/Privacy/Terms, clear navigation, fixed ad slots |
| Subscription | Free tier → credits → Pro (removes ads, unlocks premium tools) |
| Trust | Own brand domain instead of a subdomain; disclaimers + 18+ gate carried over |

## 2. Site map (what the preview contains)

**Public (SEO) pages**

| URL | Purpose |
|-----|---------|
| `/` | Landing: hero, category strip, popular tools, how-it-works, results showcase, categories, Pro teaser, FAQ |
| `/tools` | Searchable/filterable directory of every tool |
| `/category/[slug]` | 8 category hubs |
| `/[tool-slug]` | One landing page per tool, with upload box, how-to, tips, FAQ, related tools |
| `/pricing` | Free / Pro Monthly / Pro Yearly + comparison |
| `/guides` | Article index (content engine for SEO + AdSense) |
| `/about /contact /privacy /terms /delete-account` | Required pages (stubs in preview) |

**Logged-in dashboard** (`/app/...`, never indexed)

| URL | Purpose |
|-----|---------|
| `/app` | Home: greeting, credits, recent creations, recommended, trending, categories, upgrade bar |
| `/app/[tool-slug]` | Tool workspace: upload, options, result, tips, "try next" |
| `/app/creations` | History grid with favorite/download/delete |
| `/app/account` | Credits, usage, plan, profile, account deletion |

Admin (`/admin`) stays as it is today in `web-next` — it just needs the new tool catalog added.

## 3. URL strategy (the part that protects SEO)

Every existing scanner tool keeps its **exact current slug**, so the move is a pure host swap:

```
scanner.verifiedglam.com/facial-symmetry   →301→   aibeautystyling.com/facial-symmetry
scanner.verifiedglam.com/app/...           →301→   aibeautystyling.com/app/...
scanner.verifiedglam.com/pricing           →301→   aibeautystyling.com/pricing
```

That is one Cloudflare redirect rule (`*scanner.verifiedglam.com/*` → `https://aibeautystyling.com/${1}`, status 301, preserve query string). No per-page mapping table needed. Slugs for the 10 live tools are fixed in `web-hub/lib/catalog.ts` and must not change.

Rules going forward: tools live at the root path (`/skin-analysis`), never on subdomains; categories at `/category/…`; keep slugs permanent.

## 4. Tool catalog

Your list had ~50 provider endpoints. Several are the same tool at different quality levels (Face Beauty / Advanced / Pro, Skin Analyze ×3, Hairstyle Pro / Premium, Try-on / Pro, etc.). Separate pages for those would be near-duplicates, which AdSense and Google treat as thin content. So they are **merged into one page per tool with quality levels**.

Result: **48 user-facing tools in 8 categories.**

| Phase | Count | Meaning |
|-------|-------|---------|
| Live today | 10 | Existing scanner tools, same slugs |
| Launch (Phase 1) | 14 | Built before/at go-live |
| Later (Phase 2–3) | 24 | Shown as "Coming soon", `noindex` until real content exists |

Launch set: Face Shape Analyzer, AI Skin Analysis, AI Skin Enhancement, Smart Beauty Retouch, Face Beauty Editor, AI Face Enhancer, Hairstyle Changer, AI Hair Color, Lip Color Changer, Eyeshadow Try-On, Colored Contacts, Virtual Try-On: Clothes, Cartoon Yourself, Old Photo Restoration.

Categories: Face Analysis · Glow-Up & Color · Skin & Retouch · Hair & Beard · Makeup Try-On · Fashion & Style · Fun Face Effects · Photo Tools.

Full list with merges is in `web-hub/lib/catalog.ts` (single source of truth; every page reads from it).

## 5. Monetization design

- **Ads (AdSense)** — free users only. Slots (shown as dashed boxes in the preview): leaderboard under hero, in-feed mid-page, below each tool, in-content 336×280 on tool pages, sticky sidebar 300×600, dashboard banner, workspace side 300×250. Pro users see none.
- **Credits** — each tool has a credit cost (0–3). Free accounts get a finite monthly allowance (matches the finite free-tier credits already built).
- **Pro** — monthly and yearly via the existing Polar setup; prices in the preview are placeholders.
- **Rule:** no ads inside the upload/result area itself; keep them beside or below to avoid accidental-click policy problems.

## 6. Tools I held back (decision needed)

I left four out of the catalog because they are sexualised or body-shaming edits, which are likely to get AdSense approval refused or an account flagged, and they are also a Play Store risk:

- AI Breast Expansion
- AI Butt Enhancement
- AI Lip Bite Expressions
- AI Fat Filter

Also softened: "AI Waist Slimming" became **Silhouette Preview** (garment-fit framing), and "AI Pregnant Filter" became a clearly-labelled joke filter. AI Face Swap and Age & Gender Swap are in Phase 3 behind a consent checkbox. If you want any of the held-back four, the safe option is a separate site that doesn't carry your AdSense account.

## 7. Content you must write before applying to AdSense

The preview's tool-page copy is **templated placeholder text**. AdSense approves sites with original, useful pages, not template fill. Before applying:

1. A unique 300–500 word section per launch tool (what it does, who it's for, tips, 3 specific FAQs).
2. At least 10 guides (list on `/guides`), 1,200+ words each, written for people, not keywords.
3. About, Contact, Privacy (with ad/cookie disclosure), Terms.
4. Cookie/consent banner for EU/UK traffic (required to serve personalised ads there).

Apply once launch tools + guides are live — not with 48 pages of mostly "coming soon".

## 8. Backend work per new tool (not in preview)

The preview upload box is a **mock**; photos never leave the browser. Real tools need:

- A worker-api route per tool (or per provider endpoint), reusing the existing `analyze` pattern, rate limits and credit deduction.
- **Cost check before launch:** confirm the per-call price of the third-party provider for each launch tool and make sure credits/Pro price cover it. Free users cost real money on every run, so the free allowance must stay finite. I have not seen the provider's pricing, so I haven't assumed any.
- Result storage in R2 + D1 table for creations (history page).
- Content moderation / consent handling for face-swap type tools.

## 9. When you buy the domain — migration checklist

I will do these together once you tell me the domain is bought:

1. Merge the hub UI into `web-next` (one codebase keeps auth, results, admin, worker-api) and set `SITE_URL`/`SITE_NAME` in `lib/site.ts`.
2. Add `aibeautystyling.com` as a custom domain on the Cloudflare Worker; keep the old one attached.
3. Update: canonical tags, sitemap, robots, OG tags, JSON-LD, Better Auth base URL + cookie domain, Google OAuth redirect URIs, CORS in worker-api, Polar return/webhook URLs, `NEXT_PUBLIC_SELF_ORIGIN`.
4. Add the 301 host-swap rule (§3); keep it for at least 12 months.
5. Search Console: verify new domain, submit sitemap, keep old property to watch the move.
6. **`app-ads.txt` must be served from the developer website domain listed on the Play Store.** Copy it to the new root domain and update the Play Console developer website field.
7. Android app: update any hardcoded API/web host; keep the old host working for installed versions.
8. Apply for AdSense on the new domain after §7 content is live.

## 10. Phases

| Phase | Work |
|-------|------|
| 0 (now) | Design preview approved; catalog, content plan agreed |
| 1 | Buy domain; port hub UI into web-next; build the 14 launch tools; write launch content; migrate with 301s |
| 2 | Apply for AdSense; ship ~8 more tools; weekly guides |
| 3 | Remaining tools incl. consent-gated ones; SEO expansion by category |

## 11. Questions for you

1. Brand look: the preview uses a new plum/rose-gold palette with a serif headline font. Keep it, or stay with the old burgundy to look like the Verified Glam app?
2. Do you approve holding back the four tools in §6?
3. Is the provider you'll use for the new tools decided (and do you have its per-call pricing)? That decides credit costs and which launch tools are viable.
4. Should the Android app be rebranded to AI Beauty Styling too, or stay Verified Glam?
