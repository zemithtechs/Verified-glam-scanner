# Landing-page copy brief (SEO + AEO + conversion)

You are rewriting the **copy only** for tool landing pages of AI Beauty Styling (local app `web-hub/`). Do NOT change layout, components, images, catalog, or any file other than your own output file(s).

## Goal
1. **Rank for bottom-of-funnel keywords** — searchers who are ready to *use a tool now* ("attractiveness test", "golden ratio face calculator", "rate my face", "hairstyle changer online free"). These phrases must appear naturally in the meta title, H1, hero lead, at least one step/feature heading, the features H2, and at least one FAQ question.
2. **Be quotable by AI answer engines (AEO)** — FAQ answers start with a direct one-sentence answer, then one or two supporting sentences (35-80 words). Include at least one definition-style Q ("What is a ___?") and one "How do I ___?" Q. Use concrete, specific, factual statements an LLM can lift.
3. **Convert** — the audience is mostly women, many of them curious, self-conscious or wanting reassurance before a haircut, makeup buy, photo post or big day. Sell the *feeling*: clarity, confidence, feeling seen, no more guessing, walking in sure of the choice, looking like the best version of themselves in photos. Lead with the benefit and the emotion, then the mechanism.

## Voice
- Warm, direct, polished — like a knowledgeable friend, not a lab report and not a hype ad. Second person ("you", "your").
- Benefit first, feature second. Short sentences. Specific nouns over adjectives.
- Competitor reference pattern (their strengths to match, in OUR words): keyword-rich H2s that name the tool plus 2-3 related terms ("AI Face Rater For Beauty Score, Face Shape, And Symmetry"); feature rows whose headings name a concrete outcome ("Beauty Score and pretty scale report", "Portrait is preserved"); 3 steps with action titles; an FAQ opening with "What is …?".
- Speak to hopes and curiosity, never to shame. NEVER call anyone ugly, flawed, unattractive or "fix", and never imply the user needs changing. Frame as: see your best angles, understand your features, find what suits you, feel confident.

## Hard rules (accuracy and policy — AdSense and Google Play review the site)
- **Describe only what the tool really does.** Read `web-hub/lib/generation-specs.ts` for each tool's actual output (layout report/comparison/artwork, options, inputs). Read `web-hub/lib/tool-features.ts` and `web-hub/docs/feature-image-briefs.json` — each feature image is paired by index with a feature row; your `stories[i]` must describe what image `i` shows.
- Scores are **subjective photo-based impressions**, not objective measurements. No claims of calibrated measurements, diagnosis, medical/dermatological results, guaranteed outcomes, "scientifically proven", percentages of improvement, or "most accurate".
- No fabricated stats, user counts, ratings, testimonials, awards, press mentions or "as seen in".
- No identity/celebrity/kinship matching claims. `celebrity-look-alike` is currently **unavailable** (see its spec): write honest copy that says matching to named celebrities isn't offered, addresses the searcher's intent respectfully, and points to Face Shape Analyzer and Seasonal Color Palette. `beauty-score-showdown` must not promise winners/leaderboards (see its spec).
- Don't promise body or face "transformation"; for edit tools say "preview", "see how", "try before you commit". Don't mention OpenAI, local preview, dev environment, or billing specifics. Say photos are processed to create your result and can be deleted; "free to try" is fine; say credits only generically.
- Adults 18+ only. Consent line for tools using someone else's photo.
- Don't keyword-stuff. Primary keyword at most ~1 per 120 words; vary with secondary phrases. Every sentence must read naturally aloud.
- US/UK-neutral spelling ("color" is fine). No emojis. No em-dash overuse (max 2 per page). Avoid clichés: "unlock", "elevate", "game-changer", "revolutionary", "cutting-edge", "seamless", "in today's world", "delve".

## Keywords
- `web-hub/docs/seo/gsc-keywords.json` holds real Search Console queries (impressions) mapped to tools, key `byTool[slug]`. Use the highest-impression queries as the primary and secondary keywords for those tools; include misspelling-free variants only. `unmapped` holds extras (e.g. "face rate", "look test", "how attractive am i", "am i good looking").
- For tools with no Search Console data, choose bottom-of-funnel phrases yourself using patterns like "[tool] online", "[tool] free", "try [x] on my photo", "[x] simulator", "[x] app", "[x] filter", "see yourself with [x]", "[x] before you commit", and the way a real person would type it. Do not invent search volumes and don't claim data you don't have.
- Never copy competitor text. Write original sentences.

## Field-by-field (see `web-hub/lib/copy/types.ts`, type `ToolCopy`)
- `metaTitle` ≤ 60 chars, primary keyword first, then a benefit (e.g. "Attractiveness Test: Free AI Face Rating From Your Photo"). `metaDescription` 120-155 chars.
- `h1` contains the primary keyword; benefit-oriented, not just the tool name. `heroLead` 35-60 words.
- `howToHeading`, `featuresHeading`, `faqHeading` each contain the primary keyword.
- `steps`: exactly 3; titles are action phrases; bodies 1-2 sentences; include photo-quality advice appropriate to the tool; step 3 mentions downloading the complete image.
- `stories`: same count and order as the tool's feature images (3; 4 for face-beauty-analysis — check `web-hub/public/img/results/<slug>-detail-*.png` vs `-feature-*.png`). Title 5-12 words naming a concrete outcome; body 35-70 words, emotional benefit + what is shown; optional `points` exactly 3 short bullet strings.
- `downloadBanner`: short title + 1-2 sentence body about saving one finished image to keep or share.
- `faqs`: 8-10 per tool, covering: what is it; how to use / how it works; is it free; accuracy/limits (honest); photo requirements; privacy/photo handling and deletion; can I use it on someone else's photo (consent); what makes a good result; and 1-2 intent questions a buyer would ask ("Is it worth trying before I ___?", "Can I use the result on my profile picture?").

## Output
Write one TypeScript file per group exactly in this shape (UTF-8, double-quoted strings, straight quotes, no template literals needed):

```ts
import type { CopyMap } from "./types";
export const COPY_<GROUP>: CopyMap = {
  "<tool-slug>": { metaTitle: "...", ... },
};
```

Cover **every** tool slug in your assigned categories (list in `web-hub/lib/catalog.ts`), including `later` (coming-soon) tools. Then run `cd web-hub && npx tsc --noEmit` and fix any errors in your file. When finished, reply with: the file path, the count of tools covered, and a table of `slug → primaryKeyword`. Keep the reply under 300 words.
