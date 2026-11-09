# AI Beauty Styling: go-live state and SEO cutover

## Where things stand
- **Deployed (hidden from Google):** the public site runs as its own Cloudflare Worker `ai-beauty-styling-web` (account: komolafephilip), currently at `https://ai-beauty-styling-web.komolafephilip.workers.dev`. It sends `noindex, nofollow`, serves `Disallow: /` in robots.txt, and has an empty sitemap.
- **Handoff mode** (`NEXT_PUBLIC_APP_MODE=handoff`, set by `npm run build:live`): the public pages work as designed; everything needing a real account or image processing is handed to the existing app on `scanner.verifiedglam.com`:
  - `/app/*` redirects (307) to `scanner.verifiedglam.com/app`.
  - The 9 tools that run in the existing app link to `/app/<slug>` there; new tools show "opens soon".
  - Pro and credit-pack buttons read "Opening soon" (the new $10 / $60 / pay-as-you-go products do not exist in the backend yet).
  - No ad placeholders, no local-only generator (`/api/generate` returns 404).
- **Local preview** (`npm run dev` in `web-hub`, port 3100) is unchanged: full mock dashboard and the local-only OpenAI generator.
- **Old site untouched.** `scanner.verifiedglam.com` still owns all rankings. Nothing redirects yet.

## Why the redirect is not on yet
Redirecting old URLs now would send ranking traffic to pages that cannot process photos or log anyone in. Launching the new domain as `noindex` also avoids two copies of the same pages competing in Google.

## Cutover day (do all of this together)
Preconditions: login, dashboard, the tool runner and checkout work on the new domain; Polar products and webhook updated.

1. **Index the new site.** Rebuild with `SITE_INDEXABLE=true` and without the handoff redirects. Check `robots.txt`, the sitemap and `<meta name="robots">`.
2. **301 the old subdomain.** Cloudflare, zone `verifiedglam.com`, Redirect Rule: when host is `scanner.verifiedglam.com`, redirect to `concat("https://aibeautystyling.com", http.request.uri.path)`, status 301, preserve query string. Paths are identical (see table), so no per-page mapping is needed.
3. **Search Console.** Add a Domain property for `aibeautystyling.com` (DNS TXT record), submit `/sitemap.xml`, then use URL Inspection to request indexing for the top pages. Keep the old property to watch the move. The Change of Address tool does not support subdomain-to-domain moves, so the 301s do the work.
4. **Canonicals and metadata** all use `SITE.url` (aibeautystyling.com). Spot-check Open Graph tags and JSON-LD on the home page and top tool pages.
5. **Backend and accounts.** Update the worker CORS and allowed origins, auth base URL and cookie domain, Google OAuth origins and redirect URIs, Polar success/cancel/return URLs, and the Android app's web links. Keep `scanner.verifiedglam.com` answering for installed app versions.
6. **Ads and Play Store.** Serve `app-ads.txt` from the new root domain and update the developer website in Play Console. Only then add AdSense, and update the Privacy Policy for it.
7. **Monitor** Search Console weekly for 8 weeks. Keep the 301s for at least 12 months and keep `verifiedglam.com` registered.

## Old pages that already exist at the same path on the new site
`/`, `/attractiveness-test`, `/face-golden-ratio`, `/celebrity-look-alike`, `/face-beauty-analysis`, `/face-comparison`, `/beauty-score-showdown`, `/facial-symmetry`, `/beauty-tips`, `/pricing`, `/about`, `/seasonal-color-palette`, `/privacy`, `/beauty-routine-challenge`, `/terms`, `/delete-account`.

## Decisions still open
- **celebrity-look-alike.** The old page ranks for "what celebrity do i look like" (about 1,100 impressions). The new page says celebrity matching is not offered. Decide before cutover whether to keep that position or offer the tool.
- **Legal text.** Privacy and Terms are the live text plus one line saying AI Beauty Styling is the new home of the web experience. Review before launch. Privacy must be updated for AdSense once ads are enabled. The contact email is still `support@verifiedglam.com`.
- **Pricing numbers** in `lib/pricing.ts` are proposed values. Check them against the real cost of one generation.

## Deploying
`web-hub/.env` (git-ignored) holds `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- `npm run build:live` builds in handoff mode (indexing off unless `SITE_INDEXABLE=true`).
- `npm run deploy:live` builds and deploys.
Custom domain: add routes `aibeautystyling.com` and `www.aibeautystyling.com` (`custom_domain: true`) to `wrangler.jsonc` once the zone is in the same Cloudflare account as the Worker.
