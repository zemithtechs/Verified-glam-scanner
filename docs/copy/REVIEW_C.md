# Review C: home, tools, category, pricing, about, contact, fallbacks

Reviewer: independent, no source edited. Dev server ran on port 3100 (`npm run dev -p 3100`, log at `c:\Users\zenit\Documents\beauty-free\dev.log`). Scored against section 8 of `docs/copy/STYLE_GUIDE.md`. Pass is 85 or more and no hard fail.

## Verdict table

| Page | Score | Result | Why |
|---|---|---|---|
| Home (`app/page.tsx`, `HomeTabs.tsx`) | 86 | PASS | Voice is good. Two fragment headings and one repeated CTA. No dash in source or HTML. |
| `/tools` | 85 | FAIL (hard fail, not copy) | Rendered HTML has 1 em dash, from `lib/catalog.ts` line 128 (face-shape-analyzer summary used as image alt). Copy itself is 85. |
| `/category/[slug]` | 89 | FAIL (hard fail, same cause) | `/category/face-analysis` renders 2 em dashes (same catalog line). CATEGORY_COPY is clean. Other categories render 0 dashes. |
| `/pricing` | 91 | CONDITIONAL PASS | Copy is clean, numbers match `lib/pricing.ts`. Yearly price needs founder confirmation. Three feature claims contradict other pages. |
| `/about` | 78 | FAIL | H1 and two H2s are not sentences, a privacy claim conflicts with the upload notice, the 3-step list omits the AI provider. |
| `/contact` | 86 | PASS | Short, honest. Identical "Email us" CTA twice. |
| `lib/tool-page-content.ts` (fallback) | 88 | PASS, mostly dormant | All 48 tools have hand copy, so stories, steps, FAQ and hero fallbacks never render. `photoTip`, `expectation`, `howToIntro` still do. No dashes, no dev text. |
| `lib/tool-use-cases.ts` TOOL_CASES | 62 | FAIL | 6 tools still render the old cases: 12 of 12 titles have no full stop (hard fail: more than 2 non-sentence titles), 1 semicolon, bodies 18 to 22 words. |
| `lib/tool-use-cases.ts` CATEGORY_CASES | 84 | Near pass | Sentence titles, good bodies. Two category mismatches (tattoo and waist tools get "fit and fabric"). |
| `lib/tool-features.ts` | n/a | DEAD CODE | 0 of 48 tools use it. Noun-phrase titles, 7 to 22 word bodies, and "This local comparison..." (line 99). Delete the file or leave it unused. |

## Render check (curl against http://localhost:3100)

Pages fetched: `/`, `/pricing`, `/tools`, `/category/face-analysis`, `/category/hair-beard`, `/category/photo-tools`, `/about`, `/contact`, and tool pages `/face-beauty-analysis`, `/seasonal-color-palette`, `/facial-landmarks`, `/ai-eyelashes`, `/hair-loss-simulation`, `/merge-portraits`, `/ai-fortune-teller`. All return 200.

| Check | Result |
|---|---|
| "locally configured", "not connected here", "local app" in HTML | None on any page. |
| "Local preview" | Present on all 7 tool pages tested, in the upload widget footer: `Local preview · Uses the configured OpenAI account and may incur API charges. This app does not save your uploads or results to disk.` Source: `components/UploadDemo.tsx` line 93. It shows only when `NEXT_PUBLIC_APP_MODE` is not `handoff` (`lib/live-mode.ts`). Production must set `NEXT_PUBLIC_APP_MODE=handoff` or this is a hard fail on all 48 tool pages. Same flag swaps lines 74 and 90 ("Checking local generation service..."). Verify in the deploy env. |
| Em or en dash in HTML | `/`, `/pricing`, `/about`, `/contact`: 0. `/tools` and `/category/face-analysis`: 1 to 2, all from `lib/catalog.ts` line 128. Every tool page: 2 to 6, from the same catalog line plus `lib/blog-posts.ts` lines 49 and 173 (journal cards). Also `lib/catalog.ts` has 16 dash lines in total, 15 are code comments (safe). |
| Hand copy coverage | 48 of 48 tools have hand copy in `lib/copy`. |

Dash fixes (needed for any page to pass):

- `lib/catalog.ts` line 128: change `Find out if your face is oval, round, square, heart or diamond — then get matching hair and glasses ideas` to `Find out if your face is oval, round, square, heart or diamond, then get matching hair and glasses ideas`.
- `lib/blog-posts.ts` line 49: change `What a facial symmetry preview can—and cannot—show` to `What a facial symmetry preview can and cannot show`.
- `lib/blog-posts.ts` line 173: change `See where a visual try-on helps with color and silhouette—and where fabric, sizing and movement still need a real fitting.` to `See where a visual try-on helps with color and silhouette, and where fabric, sizing and movement still need a real fitting.`

## Pricing: the $66 vs $60 question, exactly where

Source of truth is one number: `lib/pricing.ts` line 16, `yearly: { price: 66, ... }`. The comment on lines 14 to 15 says "Local preview: $66 is 45% below twelve $10 monthly payments. The matching Polar annual product must be updated before publishing." The writer did not hard-type $66 in copy. Everything below is computed, so changing the one number updates all of it. Items that also move with it:

| File and line | What shows | If $60 |
|---|---|---|
| `lib/pricing.ts` 16 | `price: 66` | change to 60 |
| `app/pricing/page.tsx` 17 (metadata description) | "$66 a year" | $60 |
| `app/pricing/page.tsx` 21 (FAQ yearly trial) | "you are charged $66" | $60 |
| `app/pricing/page.tsx` 38 H2 | "2,400 credits a year for $66." | $60 |
| `app/pricing/page.tsx` 39 | "costs $54 less than twelve monthly payments" | $60 less |
| `app/pricing/page.tsx` 42 badge | "45%" | 50% |
| `components/PricingPlans.tsx` 53 badge | "Save 45%" | Save 50% |
| `components/PricingPlans.tsx` 57 to 58 | "$66 / year", "$5.50 a month equivalent" | $60, $5.00 |
| `components/PricingPlans.tsx` 63 | "charged $66 for the year" | $60 |
| `components/PricingPlans.tsx` 75 | "$0.028 per credit" | $0.025 |
| `components/PricingPlans.tsx` 89 | "Then $66 per year" | $60 |
| `components/PlanCompare.tsx` 21 to 22 | "$10/mo or $66/yr", "45% vs monthly, $5.50/mo" | $60, 50%, $5.00 |
| `lib/schema.ts` line 125 | JSON-LD Offer price 66 and description | follows constant |
| Polar annual product (outside repo) | live price | must be changed by hand |

`lib/tool-page-content.ts` correctly never states the yearly price. Math check at $66: 1 minus 66/120 = 45 percent, correct. At $60 it would be exactly 50 percent. Action: ask the founder, then edit only line 16 and the comment on lines 14 to 15, and update Polar. Do not publish with the "Local preview" comment unresolved.

## Pricing claims to verify (not copy style, but they would be false numbers or features)

1. `components/PricingPlans.tsx` line 77 `Full result history` and `components/PlanCompare.tsx` line 34 `Saved creations` (all three plans true) conflict with `UploadDemo.tsx` line 93 ("We do not save your uploads or results, so download your result before leaving") and the tool-page FAQ answer "results are not kept for you to find later" (`tool-page-content.ts`, now dormant but same wording). Pick one truth. If history is not built, change to `Download every result` and delete the "Saved creations" row.
2. `PricingPlans.tsx` line 23 `Supported by ads`: ads are only a placeholder component (`components/ui.tsx` line 61). If no ads ship, delete the bullet and the `Ad-free experience` row, and drop "No ads" from the yearly offer chip (`pricing/page.tsx` line 43) and "and no ads" from `about/page.tsx` list.
3. `PlanCompare.tsx` line 31 `All tools with credits`: Starter is `false`, but Starter users spend 10 credits on any AI tool. Either set to `true` or rename the row. Line 30 `Free-to-try tools` is undefined to a reader; replace with `Browse examples and guidance` or remove.
4. `UploadDemo.tsx` line 93 handoff text says `A limited number of free results is available each day.` That contradicts "10 free credits, then pay". Replace with `Your first result is free, then each result uses 5 credits.`

## Line-by-line fixes

### Home (`app/page.tsx`, `app/HomeTabs.tsx`)

- Line 111, h2 `editing-title`: `Photo edits you can check before you save.` is a noun phrase. Replace with `Check every photo edit before you save it.`
- Line 50 STYLE_TOOLS hairstyle copy `A new cut, shown on your own photo.` Replace with `See a new cut on your own face before you book.`
- Line 51 STYLE_TOOLS palette copy `A visual palette to explore your colors.` Replace with `Get six shades that suit your skin, hair and eyes.`
- Line 45 EDIT_TOOLS facial-symmetry copy `See your features in a visual comparison.` Replace with `See how balanced the two sides of your face look.`
- Line 43 EDIT_TOOLS face-comparison copy `Compare two portraits in one visual result.` Replace with `Put two adult portraits side by side in one image.`
- Line 89 portrait rail: six cards all say `Try this tool`. Change the label to `Try {tool.name}` style per card, for example `Try the face report`, `Try new hairstyles`, `Test your symmetry`, `Try on clothes`, `Try a lip shade`, `Get beauty tips`. Add a `cta` string to FIRST_TOOLS.
- Line 101, accordion body: `It works as a quick facial symmetry test for curiosity.` Replace with `Use it as a quick facial symmetry test, just for curiosity.`
- Hero lead (line 82) is good. Keep. It is the only place on the page that gives the credit math; add the price of the next step in the end section (line 118): after `Your first result is free.` add `One result uses 5 credits, and Pro is $10 a month for 40 results.` Build it from `PRICING` and `generationsFor(PRICING.monthly.credits)`, not typed numbers.
- Meta title (line 15) `AI Beauty Styling: Free AI Beauty Tools for Your Photo` is acceptable as `exactTitle`.
- HomeTabs bodies are about 25 words, under the 35 floor. Optional: add one concrete detail each, for example for lip shades `Try rose, berry or red on the same portrait.`

### Tools (`app/tools/page.tsx`)

- Line 26 hero paragraph is a noun list and says `your first results are free` (plural) while home and tool pages say first result. Replace with: `Pick a face report, a new hairstyle, a makeup shade, an outfit or an old photo to restore. Use a sample or your own photo and review the result before you download it. Your first result is free, and one result uses 5 credits. Results are styling ideas, not medical advice.`
- H1 `Explore what your photo can do` is fine as H1 but holds no keyword. Option: `Explore AI beauty tools for your photo`. The meta title already uses it.

### Category (`app/category/[slug]/page.tsx`)

CATEGORY_COPY titles and leads pass (all sentences, 6 to 10 words, 3 sentences, honest limit once). Fixes:

- Line 22, `fashion-style` lead: `a garment silhouette` is jargon. Replace with `the shape of a garment`.
- Line 87 h2: `Start with these popular {category.name} tools.` leaves a Title Case name mid-sentence. Replace with `Start with these popular tools.` (the eyebrow already says START WITH THESE and the H1 has the category).
- Line 97 h2: `Browse every {category.name} tool.` Replace with `Browse every tool in this group.`
- CATEGORY_META: line 30 `glow-up` description is 157 characters (limit 155). Replace with `Find your seasonal color palette, get beauty tips from your photo and follow a seven-day glow-up challenge. For inspiration, not diagnosis.` Line 34 `fashion-style` has a semicolon: replace `Explore color and style; fit still needs a real fitting.` with `Explore color and style. Fit still needs a real fitting.`
- No category page mentions credits or price. Add one sentence to each lead only if you want rubric criterion 4 above 6 of 10. Optional.

### Pricing (`app/pricing/page.tsx`, `PricingPlans.tsx`, `PlanCompare.tsx`)

- `pricing/page.tsx` line 19 FAQ `What is a credit?` Replace answer start `A credit pays for AI results.` with `A credit is what you spend to make a result.`
- FAQ yearly trial (line 21): add the trial credits. `You start the yearly plan with 3 days free and pay $0 today. You get 20 credits to try, which is 4 results. After 3 days you are charged $66 for the year...` Build with `PRICING.yearly.trialCredits` and `generationsFor`.
- Line 170 eyebrow `Yearly Pro offer` fine. `PricingPlans.tsx` line 18 Starter tagline `Make your first results free and see if it fits.` Replace with `Make your first two results free and see if it fits.`
- `PricingPlans.tsx` line 23: `Free-to-try tools` replace with `Browse every example for free`.
- Lines 77, 23, 30 to 34: see "Pricing claims to verify" above.
- No dash, no banned word, no hype found.

### About (`app/about/page.tsx`)

- Line 32 H1 `Beauty insight should feel personal, clear and kind.` is a rule of three with a vague verb. Replace with `We help you see a new look before you pay for it.`
- Line 42 SectionHead `Designed for better choices, not impossible standards.` (negative parallelism). Replace with `Made to help you choose, not to judge you.`
- Line 57 H2 `How a result is made` (label). Replace with `Your result takes three steps.`
- Line 60 step 02 `The photo is processed securely to prepare the result you asked for.` Replace with `Your photo goes to our AI provider only when you press generate, and only to make your result.`
- Line 22 principle 3 body `Photos are processed through your account and you can remove them whenever you like.` conflicts with "we do not save your uploads". Replace with `We do not keep your uploads or results after you leave the page. You can also delete your account at any time. The Privacy Policy has the details.` Confirm with the founder first.
- Line 77 H2 `Entertainment and self-discovery`. Replace with `Results are for fun and styling ideas.`
- Line 80 `Verified Glam - Beauty Scanner` uses a spaced hyphen that reads as a dash. If the app's store name has a colon, use `Verified Glam: Beauty Scanner`. If the hyphen is the store name, keep it.
- Line 33 `Your first results are free.` Replace with `Your first result is free.`

### Contact (`app/contact/page.tsx`)

- Two identical `Email us` links. Change topic CTAs: `Ask for support`, `Ask a privacy question`; keep `Delete account`. Add `cta` to TOPICS.
- Card titles are labels, acceptable in a contact grid. No other change.

### Fallback: `lib/tool-page-content.ts`

- Dormant for all 48 tools except `photoTip`, `expectation` and the `howToIntro` default. These are clean. No dashes, no dev text.
- Line `Your photo stays in your browser until you press generate ... results are not kept for you to find later.` in the base FAQ (dormant): same history conflict as pricing item 1. If you keep the fallback, align it with the real behavior.
- If you plan to delete the dormant stories and FAQs, `CATEGORY_CONTENT` can shrink to `goodFor` and `resultLabel` only (confirm `ToolLandingPage.tsx` uses them).

### Fallback: `lib/tool-use-cases.ts` TOOL_CASES (not rewritten)

Dead (hand `useCases` exist, so never render): face-beauty-analysis, facial-symmetry, face-golden-ratio, attractiveness-test, face-comparison, beauty-score-showdown, face-shape-analyzer, skin-analysis, seasonal-color-palette, beauty-tips, beauty-routine-challenge, ai-skin-enhancement, smart-beauty, face-beauty-retouch, ai-face-enhancer, hairstyle-changer, ai-hair-color. Delete these 17 entries.

Live and failing (6 tools, 12 cards): replace the whole entries with the following. Titles are sentences, bodies 30 to 40 words, no dash, no semicolon.

```
"lip-color-changer": [
  { title: "Compare an everyday shade with a night-out shade.", body: "Preview rose nude, berry, red or peach gloss on the same portrait, so your skin, hair and light stay the same. Seeing two shades on one face shows you which one you would actually wear." },
  { title: "Narrow your shortlist before you buy a lipstick.", body: "Save the color family you like, then test real formulas in a shop or ask for a sample. Screens change color, so treat the preview as a direction and not an exact swatch." },
],
"eyeshadow-try-on": [
  { title: "Pick a mood for your next event.", body: "Try soft bronze, rose shimmer or smoky plum on one portrait and judge the whole face, not an isolated palette. Choose the look that still feels like you in that light." },
  { title: "Check placement and intensity on your own eye shape.", body: "Look at where the color sits on your lid and how strong it reads at normal size. Your original eye shape stays visible, so you can compare before you buy a palette." },
],
"colored-contacts": [
  { title: "See how a new eye color looks on your face.", body: "Compare hazel, green, blue and gray on your own portrait. Pupil size and reflections stay natural, so the color reads as part of your face and not a sticker." },
  { title: "Use it as a style idea, not as eye-care advice.", body: "The image shows color only. Lens fit, hygiene and eye health need an eye-care professional, so ask one before you buy real contacts." },
],
"virtual-try-on-clothes": [
  { title: "Check an outfit's mood before you buy it.", body: "Pair a clear photo of yourself with a separate photo of the garment to see its color and how it drapes on you. It tells you fast whether the style deserves a closer look." },
  { title: "Build a shopping shortlist from the result.", body: "Use the before-and-after image to rule a style in or out. Then check the real size, fabric and return policy before you pay, because a preview cannot know them." },
],
"cartoon-yourself": [
  { title: "Make a playful profile picture that still looks like you.", body: "Try soft 3D, comic ink or anime and check that your hair, expression and clothes are still recognizable. The best result is a funny version of you, not a stranger." },
  { title: "Turn the cartoon into a party invitation.", body: "Use the illustrated portrait on an invitation or a party graphic. Ask the person in the photo first, and say the picture is an edited cartoon." },
],
"old-photo-restoration": [
  { title: "Clean up a family print before you share it.", body: "Start with the clearest scan you have and review the repaired scratches and faded areas. Check that the people still look like themselves before you send it around." },
  { title: "Keep the original scan next to the restored one.", body: "Save the source file separately. Restored detail is a plausible guess, not proof of what was there, so keep both versions." },
],
```

CATEGORY_CASES (live for 17 tools: ai-eyelashes, ai-eyebrows, ai-lip-enhancement, ai-tattoo-generator, ai-waist-slimming, face-filters, facial-expression-changer, age-gender-swap, ai-face-swap, square-face-filter, big-head-effect, halloween-mask, pregnant-filter, birthday-image-generator, ai-fortune-teller, elf-name-generator, face-blur, merge-portraits). Titles and bodies pass. Two mismatches:

- Line 127 `fashion-style` card 2 `Check fit and fabric in the real world.` suits clothes only, but also serves the tattoo and waist tools. Replace with title `Check the real thing before you commit.` and body `A preview cannot know your size, your skin or how a material moves. Keep the result next to your original photo, then confirm measurements, placement and the return policy or an artist's advice before you decide.`
- Lines 134 and 135 `photo-tools` serve face-blur and merge-portraits, which are privacy and compositing tools. Add per-tool entries for these two in a short rewrite:
  - `face-blur`: `Hide faces before you post a group photo.` / `Blur the faces of people who did not agree to be shared, then check the whole image. Name tags, clothing and reflections can still identify someone, so look at every corner before you post.` and `Keep the original and share only the blurred copy.` / `Download the blurred version as a new file and leave your source untouched. Share the blurred file only, and store the original somewhere private.`
  - `merge-portraits`: `Put two people in one picture with permission.` / `Add two adult portraits, with both people's agreement, and see them combined into one image. It works best when both photos have similar light and the faces point the same way.` and `Check both faces before you share the merge.` / `Open the result at full size and look at the edges, the hair and the skin tone where the two photos meet. Say the image is edited when you post it.`

### Dead file: `lib/tool-features.ts`

Not read by any live tool page (0 of 48 tools fall back to it, `getToolPageContent` uses it only when hand copy is missing, and the hand-copy check short-circuits). If it stays, it fails every rubric item: 138 noun-phrase titles with no full stop and 7 to 22 word bodies, and line 99 reads `This local comparison does not publish a leaderboard.` Recommend deleting it and the `TOOL_FEATURES[...] ||` branch in `tool-page-content.ts`, so a new tool without copy fails loudly instead of shipping label titles. If a safety net is wanted, make `getToolPageContent` throw in dev when copy is missing.

## Scoring detail

| Criterion (weight) | Home | Tools | Category | Pricing | About | Contact |
|---|---|---|---|---|---|---|
| 1 Titles (15) | 13 | 13 | 15 | 14 | 10 | 11 |
| 2 Title and body (15) | 13 | 14 | 14 | 14 | 13 | 14 |
| 3 Specific (12) | 10 | 9 | 11 | 12 | 9 | 10 |
| 4 Value for money (10) | 7 | 5 | 5 | 8 | 5 | 7 |
| 5 Tone (10) | 9 | 9 | 9 | 9 | 8 | 9 |
| 6 Banned and dashes (8) | 8 | 8 | 8 | 8 | 8 | 8 |
| 7 Limits (8) | 6 | 8 | 8 | 7 | 6 | 8 |
| 8 Keywords (8) | 7 | 6 | 6 | 6 | 6 | 6 |
| 9 Structure (6) | 6 | 6 | 6 | 6 | 6 | 6 |
| 10 Length (4) | 3 | 3 | 3 | 3 | 3 | 3 |
| 11 FAQ (4) | 4 | 4 | 4 | 4 | 4 | 4 |
| Total | 86 | 85 | 89 | 91 | 78 | 86 |

The four "hard fail" notes in the verdict table come from rendered dashes and unconfirmed claims, not from the scored copy. Pricing is held at conditional pass until the yearly price and three feature claims are confirmed.

## Priority order

1. Fix the three dash strings (catalog line 128, blog-posts lines 49 and 173). Clears the hard fail on `/tools`, `/category/face-analysis` and every tool page.
2. Confirm `NEXT_PUBLIC_APP_MODE=handoff` in the production build so the "Local preview" footer never ships.
3. Ask the founder: $66 or $60 (one-line edit in `lib/pricing.ts`, plus Polar).
4. Decide the truth on result history, ads, and "A limited number of free results each day". Then fix the matching lines.
5. Replace the 6 live TOOL_CASES entries and delete the 17 dead ones.
6. About page rewrites. Home and Tools line edits.
