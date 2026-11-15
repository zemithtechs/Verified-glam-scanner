# REVIEW 4 AB: headings one-read test

Scope: all 10 tools in `web-hub/lib/copy/face-analysis.ts` and all 14 in `web-hub/lib/copy/glowup-skin-hair.ts`. Reviewed 2026-11-14. No source files edited.

Test applied to every heading (h1, how-to H2, steps, features H2, story titles, ideas H2, use-case titles, guidance H2, banner title, FAQ H2): subject plus active verb, 7 to 14 words, one complete statement, no noun phrase, no passive without an actor, no dangling reference, no list of nouns, no abstract wording. "You" is expected but I only fail a heading for missing "you" when it also fails on structure.

## Result

- face-analysis.ts: 4 PASS, 6 FAIL.
- glowup-skin-hair.ts: 2 PASS, 12 FAIL.
- Total: 6 PASS, 18 FAIL out of 24.
- Worst pattern: 12 of 14 glowup h1s are noun phrases ("Hairstyle changer online to see a new cut on your own photo"). All 18 fails are listed below with a replacement.
- Global WARN on all 24 tools: the FAQ H2. See "Global items".

## File integrity: glowup-skin-hair.ts

Intact. Loaded the file with the TypeScript transpiler and checked every tool: 14 tools present (seasonal-color-palette, beauty-tips, beauty-routine-challenge, ai-skin-enhancement, smart-beauty, face-beauty-retouch, ai-face-enhancer, ai-face-slimming, hairstyle-changer, ai-hair-color, beard-styling, beard-remover, hair-loss-simulation, bald-filter). Each has all 19 fields filled: metaTitle, metaDescription, primaryKeyword, secondaryKeywords, h1, heroLead, howToHeading, howToIntro, steps (3), featuresHeading, featuresIntro, stories (3), ideasHeading, ideasIntro, useCases (2), guidanceHeading, downloadBanner, faqHeading, faqs (8). face-analysis.ts is also complete: 10 tools, face-beauty-analysis has 4 stories, the rest 3.

## Checks that passed everywhere

- No em dash or en dash, no "soon", no yearly or $60 mention in either file.
- Credit figures match `lib/pricing.ts` (10 free credits, 5 per generation, monthly 200 credits, 200 / 5 = 40 results, 2 free results). They are typed as numbers in the copy, not built from `PRICING`, so they can drift if pricing changes. Style guide 5.3 prefers constants.
- Story, use-case and banner bodies are 45 to 59 words. Steps, features intro and how-to intro are shorter by design.
- Titles tell a coherent story in order (how it works, what you get, who it is for, photo tip, price). Where the order breaks, it is noted per tool.

## Rendered pages (localhost:3100, HTTP 200)

Fetched `/attractiveness-test`, `/hairstyle-changer`, `/skin-analysis`, `/seasonal-color-palette`.

- Landing sections contain 0 `<ul>` elements. The only 3 `<li>` in each page are the three step cards, not bullets.
- The story "points" check marks are not rendered at all (strings like "Six named swatches" are absent from the HTML). No bullets leak in.
- Hard-coded headings are all complete statements: "Choose a sample or upload your own photo.", "Here is what your result means.", "Try more tools on the same photo.", "Read the guides behind this tool." PASS.
- The remaining h3s are tool names (card labels) and blog post titles from `lib/blog-posts.ts`, not landing copy. Two blog titles are noun phrases ("A photo-first guide to seasonal color palettes", "What a virtual outfit preview can tell you"). Out of scope here, mention only.
- Rendered h1/h2/h3 text matches the copy files exactly.

## Global items

1. FAQ H2 (all 24, WARN). Two shapes are in use. File 1: "Your attractiveness test questions get plain answers here." The subject is a noun pile ("attractiveness test questions") and "here" is filler. File 2: "Here are answers to your seasonal color palette questions." Starts with "Here are", no actor. Replacement pattern for all 24: "You can read answers to your {keyword} questions below." Example: "You can read answers to your attractiveness test questions below." (10 words)
2. Padded tail sentences that repeat the sentence before them (AI padding tell, body not heading, but visible next to the headings):
   - bald-filter story1: "Highlights and shadows on the scalp follow the room you were in. Shadows and highlights follow the room you were in."
   - ai-skin-enhancement uc1: "Put the results side by side" twice, and banner repeats "Keep the comparison image" twice.
   - face-beauty-retouch story2 and banner repeat the same two facts ("Your marks and complexion stay as they are"; "Each finish is one result at 5 credits").
   - hairstyle-changer banner: "show it to your stylist" and "take it to the salon on your phone" back to back.
   - ai-face-slimming banner: two "both previews / two angles" sentences.
3. Mild AI tells in bodies: "feels alive" (ai-face-enhancer story0), "Handy before you shoot..." (beauty-tips story2).

## Per tool: face-analysis.ts

### attractiveness-test: PASS
All 12 headings pass. Sequence reads well: take the test, steps, score with reasons, fix one thing, styling ideas, choose a photo, dating photo, price. Bodies continue their titles.

### face-golden-ratio: FAIL
- story0 "Your face is split into three clear thirds on your photo." Passive, no actor. Replace: "You see your face split into three clear thirds on your photo." (12 words)
- story1 "Your eye spacing is drawn against the width of your face." Passive. Replace: "You see your eye spacing drawn across the width of your face." (11)
- story2 "Phi sits beside your portrait as a fun reference number." "Phi" is not understood in one read, abstract. Replace: "You see the golden ratio, about 1.618, beside your portrait for fun." (12)

### face-beauty-analysis: FAIL
- ideas "Bring something concrete with you to your next appointment." "Something concrete" is abstract and the body does not say what. Replace: "Use your report to explain what you want at your next appointment." (12)
Other headings pass.

### facial-symmetry: FAIL
- story0 "Your eyes, brows and mouth are compared side by side." Passive plus a noun list. Replace: "You compare your eyes, brows and mouth side by side on one photo." (12)

### celebrity-look-alike: PASS
Headings are plain. Minor: step1 "Pick either Face Shape Analyzer or Seasonal Color Palette." is a choice between two tool names but reads fine. Story2 "We never match your photo to a real person." is a clear honest statement.

### face-comparison: PASS
Minor: story0 "Both faces appear at the same size and scale." has no "you". Optional: "You see both faces at the same size and scale."

### beauty-score-showdown: FAIL
- featuresHeading "You both get the same space and the same kind of note." Abstract and it repeats story0 ("You both get a score on a card of equal size."). Replace: "You play a friendly game where nobody wins and nobody is ranked." (12)

### face-shape-analyzer: PASS
All headings pass.

### skin-analysis: FAIL
- story0 "Your cheek texture is shown up close and left natural." Passive. Replace: "You see your cheek up close, exactly as your photo shows it." (11)
- ideas "You can know what to ask before you buy skincare." "You can know" is not natural. Replace: "You learn what to ask a pharmacist before you buy skincare." (11)

### facial-landmarks: FAIL
- featuresHeading "A few clear points are easier to read than a dense mesh." Comparison with no actor, abstract. Replace: "You read a few clear points on your photo instead of a dense mesh." (13)

## Per tool: glowup-skin-hair.ts

### seasonal-color-palette: PASS
Strong sequence: find palette, three steps, which shades to buy, six named shades, outfit pairings, gold or silver, shop with it, daylight tip, free palettes. Matches the BeautyPlus style.

### beauty-tips: FAIL
- h1 "Personalized beauty tips based on your own photo" Noun phrase, no verb. Replace: "Get personalized beauty tips that fit your face from one photo." (11)

### beauty-routine-challenge: PASS
All headings pass.

### ai-skin-enhancement: FAIL
- h1 "AI skin enhancement that keeps your real skin texture" Noun phrase with a relative clause. Replace: "Use AI skin enhancement to fix blemishes and keep your real skin texture." (12)

### smart-beauty: FAIL
- h1 "Portrait retouch online for a natural, camera-ready photo" Noun phrase. Replace: "Retouch your portrait online and keep a natural, camera-ready look." (10)
- featuresHeading "A light retouch fixes the distractions and leaves you recognizable." "The distractions" is vague. Replace: "A light retouch fixes shine and blemishes, and you still look like you." (13)

### face-beauty-retouch: FAIL
- h1 "Face retouch online with three natural finish levels" Noun phrase. Replace: "Retouch your face online and pick one of three natural finish levels." (12)

### ai-face-enhancer: FAIL
- h1 "AI face enhancer to sharpen blurry portraits" Noun phrase, 7 words. Replace: "Use the AI face enhancer to sharpen your blurry portraits in minutes." (12)

### ai-face-slimming: FAIL
- h1 "Face slimming preview with a subtle side-by-side edit" Noun phrase. Replace: "Preview a subtle face slimming edit next to your original photo." (11)

### hairstyle-changer: FAIL
- h1 "Hairstyle changer online to see a new cut on your own photo" Noun phrase. Replace: "Use this hairstyle changer online to try a new cut on your own photo." (14)

### ai-hair-color: FAIL
- h1 "Hair color changer to preview your next shade" Noun phrase. Replace: "Use the hair color changer to preview your next shade on your photo." (13)

### beard-styling: FAIL
- h1 "Beard styling preview to see your next beard before you grow it" Noun phrase lead. Replace: "Use the beard styling preview to see your next beard before you grow it." (14)

### beard-remover: FAIL
- h1 "Beard remover to see yourself clean-shaven before you shave" Noun phrase lead. Replace: "Use the beard remover to see yourself clean-shaven before you shave." (11)
- uc1 "Settle the debate with your partner or a friend." Dangling reference, "the debate" is never named. Replace: "Settle the shave debate with your partner or a friend." (10)

### hair-loss-simulation: FAIL
- h1 "Hair loss simulation for fun, with a fictional hairline preview" Noun phrase with a trailing list. Replace: "Use the hair loss simulation for fun and see a fictional hairline on your photo." (14)
- story1 "Your temples are compared in the same light and frame." Passive. Replace: "You compare your temples in the same light and frame." (10)

### bald-filter: FAIL
- h1 "Bald filter to see yourself with a shaved head before you buzz" Noun phrase lead. Replace: "Use the bald filter to see yourself with a shaved head before you buzz." (14)
- Optional tidy, not counted as a fail: story1 "The scalp light matches the light in your own photo." Replace: "The light on your scalp matches the light in your own photo." (12)

## What to fix first

1. The 12 glowup h1s that are noun phrases (all start with the product name, none has a verb). Same "Use the X to ..." or "Get / Retouch / Preview ..." shape as the face-analysis h1s, which already pass.
2. The five passive story titles (golden-ratio x2, facial-symmetry, skin-analysis, hair-loss-simulation).
3. The FAQ H2 pattern in one pass over all 24.
4. The repeated tail sentences listed in Global items.
