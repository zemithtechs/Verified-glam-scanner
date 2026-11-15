# AI Beauty Styling: Landing Page Copy Style Guide

Scope: tool landing pages (`web-hub/app/[slug]`, rendered by `web-hub/components/ToolLandingPage.tsx`) and the home page. Copy only. No layout, image or design changes.

Source data: BeautyPlus pages fetched 2026-11-14 (personal color analysis, AI hairstyle changer, face shape detector, AI clothes changer, AI headshot generator, photo colorizer, AI image enhancer, Glow Cam). Only the pattern is extracted. Do not reuse their wording.

This file contains no em dashes or en dashes on purpose. Keep it that way.

---

## 1. What BeautyPlus actually does (the pattern worth taking)

### Page skeleton (same on all 8 pages)

1. Hero: H1 plus one subline of 1 to 2 sentences (20 to 40 words), upload box (their CTA).
2. "Explore more tools" chip row.
3. 4 to 5 feature blocks. Each is H2 + one body paragraph + a CTA button ("Upload Image" / "Upload Photo"). Same CTA repeated on every block.
4. A use-case group (4 to 5 tabs or cards): H3 + 3 to 4 sentence body + "Try Now". Each card is one concrete situation (makeup, wardrobe, hair color, jewelry; or bikini, wedding dress, headshot, e-commerce, OOTD).
5. "Why choose us" 3 to 4 short cards (label + 2 sentences): free access, realistic results, privacy, no install.
6. "How to use": 3 steps, label + one sentence.
7. 3 user reviews.
8. FAQ, 5 questions.
9. More tools, footer.

(On face shape and clothes changer, the 3-step "how to" comes right after the hero instead. Both orders appear.)

### Numbers measured

| Item | Observed |
|---|---|
| Feature block title length | 5 to 10 words |
| Feature block body | 3 sentences, 45 to 65 words |
| Use-case body | 3 to 4 sentences, 45 to 70 words |
| "Why choose" card body | 2 sentences, 25 to 40 words |
| Step body | 1 sentence, 10 to 20 words |
| Sentence length | 12 to 25 words, average about 17 |
| FAQ answer | 1 to 2 sentences, answer first (the answers for 3 of 5 questions did not appear in the static HTML, so do not copy that gap) |
| CTA label | one short verb phrase, identical on every block |

### What works (take this)

- Every body expands its own title. Title says the benefit, body says how and why, last sentence gives the payoff. Example of the shape: title "Identify Your Warm, Cool of Neutral Skin Tone", body ends with coordinating "gold or silver jewelry with your natural radiance". The body stays on the title's topic from first word to last.
- Each block names one concrete job: pick a lipstick, choose gold or silver, decide on a haircut, avoid a bad return. The reader sees themselves in the sentence ("Stop going for haircuts that only look good in pictures of models").
- Cost and effort proof is stated plainly: "no sign-up", "up to 5 times daily free", "up to 3 photos per day for free with no ads or watermarks", "no costly salon consultations".
- Second person ("you", "your"), present tense, mostly active verbs.
- The keyword appears in the H1, the first H2, the how-to H2 and the FAQ, and in synonym form inside bodies ("color palette analysis", "seasonal color analysis", "what colors look good on me").
- FAQ questions are the exact search phrasing ("What is personal color analysis?", "How can I change my hairstyle in a picture online for free?").

### What does not work (do not copy)

- Titles are keyword phrases in Title Case, not full sentences, and never end with a full stop ("Change Hair Color in Photo Online", "Face Shape Scanner", "Lip Shape Identify", "Nose Shape Analysis"). Several read like labels. Our guide is deliberately stricter than the competitor here.
- Brand name and keyword stuffing in bodies ("BeautyPlus AI hair changer ... This super-fast AI hair generator ..."). Reads machine-made.
- AI vocabulary: "Elevate Your Style", "seamless technology", "Level up", "radiance".
- Unbacked claims: "accuracy rate of 99%", "guaranteed results". We will not make claims we cannot prove.
- Typos and grammar slips ("Warm, Cool of Neutral", "the same as normal, thin, thick, or normal"). Proofread.
- Reviews duplicated and the same CTA repeated 4 times in a row with no variation.

---

## 2. Our current copy (audit)

### Rendered structure of a tool page today

Order in `ToolLandingPage.tsx` for a live tool (for example `/attractiveness-test`, `/seasonal-color-palette`):

| # | Section | Source of text | Count |
|---|---|---|---|
| 1 | Hero: H1, lead, upload workspace | `copy.h1`, `copy.heroLead` | 1 |
| 2 | How it works: H2 + hard-coded subline + 3 steps | `howToHeading`, steps[] (hard-coded subline) | 3 steps |
| 3 | Features: H2 + intro, then image rows (title, body, 3 check points, CTA "Try {tool}") | `featuresHeading`, `featuresIntro`, `stories[]` | 3 rows (4 for face-beauty-analysis) |
| 4 | "Ideas for using it" eyebrow + H2 "Ways to use your {tool} result" + 2 cards | hard-coded labels, `lib/tool-use-cases.ts` | 2 cards |
| 5 | "Before you try" eyebrow + H2 "Prepare your photo for {tool}" + photo tips + image | hard-coded, `photoTip`, `expectation` | 1 |
| 6 | More tools to try | hard-coded | 6 cards |
| 7 | "From the journal" related reading | blog data | up to 3 |
| 8 | FAQ H2 + 8 to 10 questions | `faqHeading`, `faqs[]` | 9 typical |
| 9 | "Your next step" banner + CTA | `downloadBanner` | 1 |

Home page (`app/page.tsx`): H1 in three short lines, then sections whose H2s are mostly short full sentences ("A closer look at your portrait.", "See the change. Keep the character.", "Photo edits you can actually see.", "Start with the photo you already have."). Eyebrows are small uppercase labels ("FACE REPORTS", "PORTRAIT EDITS", "BEAUTY PREVIEWS"). The home page is the nearest to the target already. Keep its voice, tighten vague lines.

Data: `lib/copy/*.ts` holds hand-written copy for 4 groups (face-analysis, glowup-skin-hair, makeup-fashion-photo, fun-effects). Anything without hand-written copy falls back to the generic template in `lib/tool-page-content.ts`.

### Concrete problems found

1. Keyword-string H2s that are not thoughts. `featuresHeading: "AI Attractiveness Test With Face Rating, Photo Score, And Styling Notes"` and `"Seasonal Color Palette, Swatches And Outfit Pairings In One Image"` are lists of nouns. They exist for SEO and read as such. Same for `howToHeading: "How To Take The Attractiveness Test In 3 Steps"` in Title Case.
2. Story titles are noun phrases, not complete thoughts. "A photo harmony score with the reasons behind it", "Six wearable swatches with clear names", "A color direction for makeup and accessories", "Analysis without reshaping the portrait". None ends with a full stop and none says what the user gets.
3. Title and body drift apart. "Treat the report as a creative point of view" is followed by a body about lighting and lens choice. "See the whole face and the small details together" is followed by a body about numbers and layout.
4. Filler and AI-flavored phrasing. "It gives you a calm, simple direction instead of an overwhelming wall of shades", "which feels far more useful than a bare number", "wonderfully varied, and that is the point", "Faces are wonderfully varied", "Explore your {tool} result", "A photo in. A complete result out." (hard-coded subline), "Different photos, different possibilities." (fallback intro), "Your photo stays yours".
5. Vague claims where a number is available. `free()` helper: "New accounts get free credits ... each preview uses a small number of credits." Our real values are 10 free credits and 5 credits per generation (`lib/pricing.ts`). The user cannot tell what they get for their money.
6. Developer text leaking into public FAQs. The generic template contains "Is this local preview free to generate?", "uses the locally configured OpenAI API account and may incur provider charges", "Website credit billing and production sign-in are not connected here", "This local app does not write uploads". These must never ship on a live page.
7. Em dash present in copy: `lib/tool-use-cases.ts` ("photo framing[em dash]not to verify identity"), and two in `lib/tool-page-content.ts`. Count in all of `lib/copy/*.ts`: none. Fix the three.
8. Heroes in the generic template are template text: `"Create one complete creative image based on the supplied photo with {tool}. Try a sample or use your own photo, review the result, and download a single PNG."` No benefit, no feeling, no keyword in context. Category hero leads ("Turn one clear portrait into an easy-to-read visual breakdown") are abstract.
9. Eyebrows and card headings act as small labels: "Ideas for using it", "Before you try", "Your next step", "From the journal", "More tools to try". Fine as eyebrows, but several H2s under them are generic template strings ("Ways to use your {tool} result", "Prepare your photo for {tool}").
10. Defensive over-hedging repeated in every FAQ ("a score is only one view", "not a rule", "not a measurement of beauty"). Honest limits are required, but one clear sentence per page is enough, not one per block.
11. Titles are 8 to 15 words in several places and use Title Case in some H2s. Target is 6 to 12 words, sentence case.
12. FAQ answers are 40 to 80 words, which is fine, but the privacy and consent answers are identical on every page (via helpers `privacy()` and `consent()`), so pages look duplicated to a reader and to search engines.

---

## 3. Target pattern for a tool landing page

No layout or design change. We keep every existing image, card, step grid, FAQ accordion and banner. Only the text inside them changes, plus a few hard-coded strings move into the copy data.

### 3.1 Block recipe (every content block)

```
Title   One complete sentence, 6 to 12 words, ends with a full stop.
Body    2 to 3 sentences, 35 to 60 words. Sentence 1 finishes the title's thought
        (how or why). Sentence 2 adds one specific detail, number or example.
        Sentence 3 (optional) is the payoff or an honest limit.
CTA     Short verb phrase, specific to the block, not the same label four times.
```

### 3.2 Page order and the exact number of blocks

| Order | Slot in current layout | Job | Count | Title pattern |
|---|---|---|---|---|
| 0 | Hero (H1, lead, CTA in workspace) | Promise one result, say the effort and the price | 1 | H1 keeps the primary keyword. Lead 35 to 55 words, 2 to 3 sentences. |
| 1 | How it works (3 steps) | Show it takes 3 simple actions | 3 | Step title is a short complete sentence with a full stop ("Upload one clear photo."). Step body 1 to 2 sentences. |
| 2 | Feature row 1 | What it is: what the tool is and what appears in your result | 1 | Sentence title. Primary keyword or close synonym appears in body. |
| 3 | Feature row 2 | How it works: what the AI looks at and what you see because of it | 1 | |
| 4 | Feature row 3 | What you get: the file, the extras, what you can do with it | 1 | |
| 4b | Feature row 4 (face-beauty-analysis only) | Second "what you get" or proof | 1 | |
| 5 | Ideas for using it (2 cards) | Who it is for: two real situations | 2 | Title names the person or moment ("Pick a profile photo you feel good about."). |
| 6 | Before you try (photo guidance) | Proof, privacy and honest limits: photo tips, deletion, entertainment-style results | 1 | |
| 7 | FAQ | Answer the buying questions fast | 8 | Question in the user's search wording. Answer-first. |
| 8 | Banner ("Your next step") | Pricing and credits in plain numbers, then CTA | 1 | |

So a standard tool page has: 1 hero + 3 steps + 3 feature blocks + 2 use-case blocks + 1 guidance block + 1 pricing banner + 8 FAQ = 12 content blocks before FAQ, plus the FAQ. "More tools" and "related reading" cards are navigation, not copy blocks.

What each block must do:

- **Hero:** the user gets one specific result from one photo, in minutes, and the first result costs nothing. Example shape: "Upload one photo and see your seasonal color palette in minutes. Your first result is free."
- **What it is (row 1):** name the output as an object ("a six-swatch palette", "a score from 0 to 100 with reasons").
- **How it works (row 2):** say what the tool looks at in the photo (skin tone, hair, eyes, face outline) and why the result matches the photo.
- **What you get (row 3):** the downloadable image, what it contains, what you can do next.
- **Who it is for (2 cards):** one concrete decision each (before a haircut, before shopping, before choosing a profile photo, before a dye). Feeling of value: you avoid a mistake or a wasted purchase.
- **Proof, privacy, limits:** photo tips, that uploads can be deleted, that results are for fun and styling ideas, not medical or scientific. One clear paragraph, not repeated in every block.
- **Pricing and credits:** use real numbers from `lib/pricing.ts` (see section 5.3). Say what one result costs and what the user gets for the price.
- **FAQ:** 8 questions: what is it, how do I use it, is it free, how accurate, best photo, privacy, someone else's photo, plus one page-specific question (worth it? what to do with the result?).

### 3.3 CTA labels

Do not repeat one label. Pattern: verb + object + (optional) free signal.

- Hero workspace: leave as is (UI string).
- Feature rows: "Try the {short tool name}" is acceptable once. For rows 2 and 3 use "See my {result noun}" and "Get my free result".
- Use-case cards have no CTA in the layout today, keep it that way.
- Banner: "Start with 10 free credits" style.

---

## 4. Rules for titles and bodies

### 4.1 Titles

1. A title is one complete sentence with subject and verb, ending in a full stop. Test: read it aloud as a statement. If it needs the body to make sense, it fails.
2. 6 to 12 words. Under 5 reads as a label, over 14 reads as a headline pasted from a keyword list.
3. Sentence case. Capitalize only the first word and proper nouns.
4. The title states a benefit or an outcome the user feels, not a feature name. Not "Six named swatches." but "You get six shades that fit your own colors."
5. No colons, no pipes, no ampersands, no "With X, Y, And Z" lists.
6. No question titles except FAQ.
7. H1 is the one exception: it may be a keyword-led phrase, because search engines and the page tab show it. It must still read as one clear promise. Examples: "Take the Attractiveness Test and See How Your Photo Comes Across". Use sentence case and no full stop on the H1 if the keyword phrase leads; if it can be a sentence, use a sentence.

### 4.2 Bodies

1. 2 to 3 sentences, 35 to 60 words. 12 to 20 words per sentence on average. Never more than 28.
2. Sentence 1 completes the title. If the title says "You get six shades that fit your own colors.", sentence 1 explains how: "Each swatch has a short name and sits beside your portrait, so you can judge it against your real face."
3. Sentence 2 gives one concrete detail: a number, a file type, a time, a named example (lip, blush, gold or silver, bangs, a profile photo).
4. Sentence 3, if used, is the payoff ("Take the image with you when you shop.") or the single honest limit for the page.
5. One idea per block. If a body needs "also", split it.
6. Active voice, second person ("you", "your"), present tense. Contractions are allowed and preferred in FAQ and hero ("you'll", "it's"), keep bodies natural, not stiff.
7. Use numbers when we have them (0 to 100, six swatches, two outfit pairings, 5 credits, 10 free credits, a few minutes). If we do not have a number, do not invent one and do not write "a small number".
8. Honest limit appears once per page in the guidance block and once in the relevant FAQ answer. Not in every feature body.
9. Check points (the three short ticks under each feature row): 2 to 5 words each, noun or verb phrase, no full stop. They are proof tokens, not sentences.

### 4.3 Ten before and after examples from our pages

Format: location, before, after. All "after" text follows the rules above.

**1. `attractiveness-test` featuresHeading (keyword-string H2)**
- Before: `AI Attractiveness Test With Face Rating, Photo Score, And Styling Notes`
- After: `Your attractiveness test gives you a score and the reasons behind it.`

**2. `attractiveness-test` stories[0] (phrase title, vague body)**
- Before title: `A photo harmony score with the reasons behind it`
- Before body: `Your portrait sits beside a score from 0 to 100, clearly labeled Subjective, with short notes that explain the impression. You see why a photo reads the way it does, which feels far more useful than a bare number.`
- After title: `Your photo gets a score from 0 to 100 with short reasons.`
- After body: `The score sits next to your own portrait and is labeled Subjective, so you know it is an opinion about one photo. Short notes say what helped or hurt it, such as light, angle or expression. Use it to pick the photo that works best.`

**3. `face-golden-ratio` stories[2] (title and body say two different things)**
- Before title: `Meet phi 1.618 as a reference, not a rule`
- After title: `Phi is a fun reference for your photo, not a rule for your face.`
- After body: `The golden ratio is about 1.618, a number designers have used for centuries. We show it beside your portrait so you can see how your thirds and eye spacing compare. It is for curiosity and does not say how attractive you are.`

**4. `seasonal-color-palette` stories[0] (noun phrase)**
- Before title: `Six wearable swatches with clear names`
- After title: `You get six named shades that match your own colors.`
- After body: `Each swatch has a short name, like a shade you could ask for in a shop, and sits beside the portrait it came from. That lets you judge the colors against your real face. Take the image shopping and skip the shades that look off.`

**5. `seasonal-color-palette` stories[2] (filler, "calm, simple direction")**
- Before title: `A color direction for makeup and accessories`
- Before body: `... It gives you a calm, simple direction instead of an overwhelming wall of shades ...`
- After title: `Your palette tells you which lip, blush and jewelry shades to try first.`
- After body: `Warm shades go with gold and cool shades go with silver, and your palette shows which side you are on. Pick one lipstick and one accessory from the swatches instead of testing a whole shelf. Your photo is not edited, so your natural skin color stays as you uploaded it.`

**6. Generic template (`category face-analysis` stories[1]), vague and label-like**
- Before title: `Analysis without reshaping the portrait`
- Before body: `The source portrait remains recognizable throughout the experience. Visual guides sit around the image instead of hiding it behind heavy effects.`
- After title: `Your original photo stays exactly as you uploaded it.`
- After body: `The guides and notes sit around your portrait and never change your face. You can zoom in and compare the report with your own photo at full size. Nothing is retouched unless the tool says so.`

**7. Generic template hero lead (no benefit)**
- Before: `Create one complete creative image based on the supplied photo with Hairstyle Changer. Try a sample or use your own photo, review the result, and download a single PNG.`
- After (hairstyle-changer): `See a new haircut on your own photo before you book the appointment. Upload one clear photo, pick a style, and get your result in a few minutes. Your first result is free.`

**8. `lib/tool-use-cases.ts` skin-analysis card (hedged, em dash style, label title)**
- Before title: `Notice what the photo actually shows`
- Before body: `The connected close-ups call out visible texture, pores, fine lines and tone variation without turning them into a diagnosis or severity rating.`
- After title: `Read what your photo shows about your skin in plain words.`
- After body: `The report points out visible texture, pores, fine lines and uneven tone. It does not diagnose anything or grade your skin. Use it to know what to ask a pharmacist or a dermatologist.`

**9. `lib/tool-use-cases.ts` face-comparison card (contains an em dash)**
- Before body: `Place two consenting adults' portraits together to notice visible differences in hair, face outline and photo framing[em dash]not to verify identity or family relationship.`
- After title: `Compare two looks side by side with a friend who agrees.`
- After body: `Add two adult portraits with permission and see how hair, face outline and framing differ between them. It is a fun comparison and it cannot confirm identity or family ties.`

**10. `free()` FAQ helper (vague money claim) and leaked dev text**
- Before answer: `Yes, you can try a seasonal color palette free. New accounts get free credits to run a preview, and each preview uses a small number of credits. ...`
- Before (generic template): `Is this local preview free to generate? ... uses the locally configured OpenAI API account and may incur provider charges.`
- After question: `Is the seasonal color palette tool free?`
- After answer: `Your first result is free. A new account starts with 10 credits and one result uses 5, so you can make two before paying anything. After that, a monthly plan gives you 200 credits, which is 40 results, so each one costs less than a coffee.`
  (Verify every figure against `lib/pricing.ts` and the live Polar products before publishing. The comment in that file says some values are still proposed.)

---

## 5. Tone rules

### 5.1 Punctuation and form

- No em dashes. No en dashes. Anywhere. Use a full stop, a comma, a colon or "to" ("0 to 100", "5 to 10 minutes"). Search the finished files for the characters U+2014 and U+2013 before review.
- No semicolons in titles or bodies.
- No exclamation marks except the occasional one in a banner. Never two on a page.
- No emojis.
- Hyphenate only where needed ("front-facing photo", "side-by-side").
- Numbers: use digits for 0 to 100 scores and prices, words for "one", "two" in prose where it reads better.

### 5.2 Banned vocabulary and constructions

Do not use: delve, elevate, unlock, seamless, journey, testament, tapestry, landscape, crucial, pivotal, vibrant, game-changing, empower, leverage, harness, revolutionize, cutting-edge, state-of-the-art, stunning, effortless, unleash, "in today's world", "whether you are X or Y", "not just X but Y", "more than just X", "it's not about X, it's about Y", "level up", "take it to the next level", "dive in", "radiance", "wonderfully", "truly", "simply".

Also avoid: rule-of-three lists used as filler ("clear, simple and fun"), rhetorical question openers in bodies, "Imagine", "Picture this", and vague closers ("and so much more").

### 5.3 Value-for-money voice

The reader should feel they get real value for the money, so say what they get in plain terms.

- Name the output and the price in one place on every page: one result is 5 credits, a new account has 10 free credits, a monthly plan has 200 credits (check `lib/pricing.ts` PRICING for current values). Convert to "results" for readers: 10 credits is 2 results, 200 credits is 40 results.
- Compare with the real alternative when it is true and checkable: a haircut you regret, a returned dress, a color consultation. Do not name competitors or quote prices we cannot source.
- Say what stays free: viewing examples, reading guidance, trying a sample where available.
- No countdown pressure, no fake scarcity, no "limited time".
- Make the benefit specific to the tool: shopping with a palette, choosing a profile photo, checking a haircut before the salon.

### 5.4 Honest limits (entertainment style, not medical)

- Results are creative and for fun or styling ideas. Scores are subjective opinions of one photo. Guides are illustrative, not measurements.
- Never claim accuracy percentages, "guaranteed", "scientifically proven" or medical benefits. Never diagnose. Skin, hair loss and body tools must say "does not diagnose" once.
- Adults only, and only photos you own or have permission to use.
- Say the limit once, plainly, in the guidance block and the matching FAQ. Example: "This is a styling idea, not a verdict."
- Do not use limits as a way to apologize in every title.

### 5.5 Person, tense, contractions

- Second person ("you", "your") in all user-facing bodies. We say "we" only for the service and keep it rare.
- Present tense for what the tool does. Future only for "you'll see".
- Contractions: fine in hero, banner and FAQ answers ("you'll", "it's", "don't"). In feature bodies mix naturally, never more than one per sentence.
- Name the tool the way people search for it. Use the full name once in the body, then "it" or a close synonym. Never repeat the brand name in successive sentences.

---

## 6. Keywords: weaving bottom-of-funnel phrases

Source: `web-hub/docs/seo/gsc-keywords.json` (617 queries, 13,041 impressions in 16 months, average position mostly 40 to 90, so this is demand, not rankings). Structure: `byTool[slug] = [{query, clicks, impressions, position}]`. Top demand examples: attractiveness-test ("attractiveness test" 313, "attractive test" 191, "beauty test" 190, "face rating" 149, "how attractive am i" 113, "rate my face" 110); face-golden-ratio ("golden ratio face" 396, "golden ratio upload photo" 216, "golden ratio checker" 212, "golden ratio face calculator" 191); face-beauty-analysis ("facial analysis" 156, "beauty scanner" 92, "beauty analyzer" 74); celebrity-look-alike ("what celebrity do i look like" 217); facial-symmetry ("face symmetry test" 191); seasonal-color-palette (only 18 impressions so far, so lean on page-intent terms like "what colors suit me", "color season").

### Placement rules

1. Primary keyword (one per page, `primaryKeyword` field): H1, meta title, first 100 words of the hero lead, one feature title or body, the FAQ H2, and the first FAQ question. 5 to 7 uses on the page in total, never twice in one sentence.
2. Secondary keywords (4 to 8 per page): each used once or twice, inside a body or FAQ question where it is the natural wording. Prefer the question or full-sentence form: "how attractive am i" belongs in an FAQ question or a hero sentence, not a title list.
3. Match the searcher's words in FAQ questions: "How do I rate my face for free?", "How attractive am I? Can a photo test tell me?", "Is a golden ratio face calculator accurate?". Use real queries as questions verbatim where grammatical.
4. Bottom-of-funnel intent words belong near the hero and the pricing blocks: "free", "online", "from a photo", "upload photo", "test", "checker", "calculator", "analyzer". Use them where the user decides to act.
5. Use synonyms in rotation across blocks (test, rating, analysis, checker) so no phrase is repeated more than 3 times in a section.
6. Never put a keyword in a title that makes it a list. A title may carry the keyword only if it stays a natural sentence: "The golden ratio face calculator shows your face thirds on your own photo." (12 words, full stop, keyword inside a real thought).
7. Do not keyword-stuff the brand. One mention of the tool name per body maximum.
8. Do not use a keyword we cannot honor. We do not identify people, match to celebrities by identity, or give calibrated measurements. Celebrity look-alike copy must say the result is an artistic resemblance idea and not identification.
9. Alt text, meta title, meta description and FAQ schema stay in their existing fields. Meta description: 120 to 155 characters, primary keyword, one benefit, soft CTA, no dashes.
10. Before finalizing, grep the page copy: primary keyword count 5 to 7, no secondary keyword above 3, no keyword inside two adjacent titles.

---

## 7. Mapping to our data structure (`web-hub/lib/copy/types.ts`)

Current `ToolCopy` fields and how they map. "Repurpose" means same field, new rules. "Add" means a new optional field that the existing JSX can read without any change to markup or classes.

| Pattern element | Current field | Action |
|---|---|---|
| H1 | `h1` | Keep. Keyword-led, sentence case, 6 to 12 words. |
| Hero lead (2 to 3 sentences, benefit, effort, free first result) | `heroLead` | Keep. Doc comment says 35 to 60 words, keep it. Add the free first result. |
| Meta | `metaTitle`, `metaDescription` | Keep. No dashes. |
| Keywords | `primaryKeyword`, `secondaryKeywords` | Keep. Source from gsc-keywords.json. |
| How-to H2 | `howToHeading` | Repurpose: sentence ending in a full stop ("Get your result in three steps."). |
| How-to subline (currently hard-coded "A photo in. A complete result out. Here is what to expect at each step.") | none | **Add** `howToIntro?: string`, one sentence. Read it in place of the hard-coded string, fall back to the old string. |
| Steps (3) | `steps` | Repurpose: `title` becomes a short sentence with a full stop, body 1 to 2 sentences. Tuple length stays 3. |
| Features H2 | `featuresHeading` | Repurpose: one sentence, no keyword list. |
| Features intro | `featuresIntro` | Repurpose: one sentence of 15 to 25 words. |
| Feature blocks 1 to 3 (4 for face report) | `stories[]` (`title`, `body`, `points`) | Repurpose. `title` is a sentence ending in a full stop. `body` is 2 to 3 sentences. `points` stays 3 short proof tokens. Count must match images (unchanged rule). |
| Feature CTA label (currently `Try {tool.name}` in JSX) | none | **Add** optional `stories[i].cta?: string`. JSX uses it if present. |
| Ideas section H2 and intro (hard-coded `Ways to use your {tool} result` and "{tool} is most helpful when ...") | none | **Add** `ideasHeading?: string`, `ideasIntro?: string`. |
| Two use-case cards | not in `ToolCopy`; lives in `lib/tool-use-cases.ts` (`TOOL_CASES`, category fallbacks) | Keep the file and the `UseCase = {title, body}` type. Rewrite text under the new rules. Optionally **add** `useCases?: [UseCase, UseCase]` to `ToolCopy` so one file holds the whole page, with `getToolUseCases` preferring it. |
| Photo guidance block (H2 `Prepare your photo for {tool}`, eyebrow, tips) | `photoTip` and `expectation` from `practicalGuidance()` in `tool-page-content.ts` | Repurpose those two strings under the new rules. **Add** `guidanceHeading?: string` so the H2 can be a sentence. |
| Pricing and credits | `downloadBanner: {title, body}` | Repurpose: title is a sentence about what the user gets, body states the credit math from `PRICING`. Prefer building the credit sentence from `lib/pricing.ts` constants in code, not hard-typed numbers, so the copy cannot drift. |
| FAQ H2 | `faqHeading` | Repurpose: "Your {keyword} questions, answered." style sentence, contains primary keyword. |
| FAQs | `faqs: [question, answer][]` | Keep. 8 entries, first question uses primary keyword, answer first. Replace shared `free()`, `privacy()`, `consent()` helpers with per-tool wording or at least vary the second sentence. |
| Eyebrows and section labels ("Ideas for using it", "Before you try", "Your next step", "From the journal", "More tools to try") | hard-coded in JSX | Leave as small labels. Optional: **add** `labels?: Partial<Record<"ideas"|"guidance"|"next"|"journal", string>>`. Not required for the rewrite. |
| Generic fallback (tools without hand-written copy) | `lib/tool-page-content.ts` templates | Rewrite the `CATEGORY_CONTENT` and generic builder strings to the same rules, and delete the dev-only FAQ entries ("local preview", "locally configured OpenAI API account", "not connected here"). Better: write hand copy for every live tool so fallbacks are rare. |

Do not add fields that change layout (no new sections, no new images, no new card counts). Every new field above is a string that replaces a string already rendered in the same element.

Update the doc comments in `types.ts` when fields change: for example `steps` titles, `stories` title, `featuresHeading` and `faqHeading` currently say "keyword-rich" or "like a competitor's ..."; replace with the new rules.

Build checks to add (cheap): a small test or script that fails on (1) U+2014 or U+2013 in `lib/copy/*.ts`, `lib/tool-use-cases.ts`, `lib/tool-page-content.ts`; (2) any banned word from section 5.2; (3) any `stories[].title` not ending in a full stop; (4) any body outside 25 to 70 words.

---

## 8. Review rubric (score out of 100)

Score each page. A page passes at 85 or above and with no hard-fail item.

| # | Criterion | Weight | How to score |
|---|---|---|---|
| 1 | Titles are complete sentences ending in a full stop, 6 to 12 words | 15 | 15 if all titles pass. Lose 2 points per failing title, floor 0. |
| 2 | Body finishes its title's thought (title and body connected) | 15 | Ask: could the body belong under a different title? If yes for a block, lose 3 points per block. |
| 3 | Benefit-led and specific: concrete job, number or example in each block | 12 | 12 if every block has one specific detail. Lose 2 per vague block ("a small number", "useful insights"). |
| 4 | Value-for-money clarity: price, credits, free first result stated in plain numbers and matching `lib/pricing.ts` | 10 | 10 when hero and banner both state the facts correctly. 5 if only one. 0 if vague or wrong. |
| 5 | Tone: second person, active, natural contractions, no filler or hype | 10 | Lose 2 per instance of filler, hype or "not just X but Y" style. |
| 6 | Banned words and punctuation: no em or en dashes, no AI vocabulary | 8 | 8 if clean. Lose 2 per instance. Any dash is also a hard fail (see below). |
| 7 | Honest limits stated once, clearly (entertainment or styling, not medical, adults, consent) | 8 | 8 if clear and not repeated in every block. 4 if missing or repeated. 0 if the page makes a medical or accuracy claim. |
| 8 | Keyword use: primary in H1, hero, one block, FAQ H2 and first FAQ question; secondaries natural; no stuffing | 8 | Lose 2 per missing placement, lose 2 per stuffed sentence. |
| 9 | Structure and counts match section 3 (3 steps, 3 or 4 feature blocks, 2 use cases, 1 guidance, 1 pricing banner, 8 FAQ) | 6 | 6 if complete. Lose 1 per missing or extra block. |
| 10 | Length and readability: bodies 35 to 60 words, sentences average under 20 words | 4 | 4 if 90 percent of bodies pass. Scale down by share failing. |
| 11 | FAQ quality: real search wording, answer-first, 35 to 80 words, not copy-pasted across pages | 4 | Lose 1 per duplicated or non-answer-first entry. |

Total 100.

### Hard fails (page cannot pass regardless of score)

- Any em dash or en dash.
- Developer or local-preview text visible on a live page.
- A false or unsourced number (accuracy percentage, price that does not match `lib/pricing.ts`).
- A medical claim or a claim of identifying a real person.
- A title that is not a sentence in more than 2 blocks.

### Reviewer quick checks

1. Read only the titles in order. Do they tell the whole story of the page as a series of sentences? If not, fix titles first.
2. Read one body per block and cover its title. Does the body still point back to the same idea?
3. Find the price. Can a stranger say what one result costs and what the first one costs?
4. Search for the two dash characters, the banned words and "small number", "useful", "powerful", "easy-to-use".
5. Count the primary keyword. It should be 5 to 7 times and never twice in one sentence.
