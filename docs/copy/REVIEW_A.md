# Copy review A: face-analysis.ts (10 tools) and glowup-skin-hair.ts (14 tools)

Reviewer: independent, strict. Scored against STYLE_GUIDE section 8. No source file was edited. Pass is 85 or above and no hard fail.

Automated checks run on both files:
- U+2014 and U+2013 dashes: none found. No hard fail.
- Developer or local-preview text: none found.
- Credit numbers (10 free credits, 5 per result, 200 monthly credits, 40 results): all match lib/pricing.ts. No wrong numbers found.
- Banned vocabulary: only "useful" (3 hits, listed below). Nothing else.
- Counts: every tool has 3 steps, 3 stories (4 for face-beauty-analysis), 2 use cases, 1 guidance heading, 1 banner and 8 FAQs.

## Score table

| # | Tool | File | Score | Result |
|---|---|---|---|---|
| 1 | attractiveness-test | face-analysis | 88 | pass |
| 2 | face-golden-ratio | face-analysis | 84 | fail |
| 3 | face-beauty-analysis | face-analysis | 86 | pass |
| 4 | facial-symmetry | face-analysis | 82 | fail |
| 5 | celebrity-look-alike | face-analysis | 78 | fail |
| 6 | face-comparison | face-analysis | 80 | fail |
| 7 | beauty-score-showdown | face-analysis | 80 | fail |
| 8 | face-shape-analyzer | face-analysis | 86 | pass |
| 9 | skin-analysis | face-analysis | 84 | fail |
| 10 | facial-landmarks | face-analysis | 72 | fail |
| 11 | seasonal-color-palette | glowup | 90 | pass |
| 12 | beauty-tips | glowup | 86 | pass |
| 13 | beauty-routine-challenge | glowup | 78 | fail |
| 14 | ai-skin-enhancement | glowup | 85 | pass |
| 15 | smart-beauty | glowup | 80 | fail |
| 16 | face-beauty-retouch | glowup | 80 | fail |
| 17 | ai-face-enhancer | glowup | 85 | pass |
| 18 | ai-face-slimming | glowup | 76 | fail |
| 19 | hairstyle-changer | glowup | 89 | pass |
| 20 | ai-hair-color | glowup | 87 | pass |
| 21 | beard-styling | glowup | 86 | pass |
| 22 | beard-remover | glowup | 83 | fail |
| 23 | hair-loss-simulation | glowup | 74 | fail |
| 24 | bald-filter | glowup | 86 | pass |

Totals: 11 pass, 13 fail. No page has a hard fail, so every fail is on score. Only seasonal-color-palette reaches 90.

## Patterns that cost points on many pages

1. "X, not Y" rhythm. About 26 hits in face-analysis alone ("a choice and not a guess", "not a rule", "not a verdict", "not a different face"). The guide bans the "not just X but Y" family and the user flagged it. Cut most of them. Keep one honest limit per page.
2. Copy-paste FAQs. The privacy and consent answers repeat almost word for word. face-analysis: "Ask before you upload anything, keep the result kind and private, and delete it straight away if they ask you to. Nobody should find their face in a report they did not agree to." appears on 6 pages. glowup: "It is used only to create your X. Delete it from your result or history and the upload is removed. Please keep other people and documents out of the picture." appears on all 14. The pricing FAQ and banner are also near identical on every page. Pricing sentences can match (facts), but vary the surrounding words and drop the repeated closing sentences.
3. Keyword stuffing of an awkward primary keyword. smart-beauty ("portrait retouch online") and face-beauty-retouch ("face retouch online") use the exact phrase in hero, featuresIntro, ideasIntro, faqHeading and the first FAQ question, and some read ungrammatically ("What does portrait retouch online do?"). face-golden-ratio has "golden ratio upload photo tools" in a question. face-shape-analyzer repeats the tool name in both use cases.
4. Title Case H1 with a colon on all 10 face-analysis tools ("Attractiveness Test: See How Your Photo Comes Across"). The guide allows a keyword-led H1 but asks for sentence case. The glowup H1s are in sentence case and read better.
5. Unsupported "many people / most people / often" claims: "Many people find the gap smaller than they feared", "Most people begin with this level", "Many people find the lighter one looks better", "By day three you are usually back in the swing", "Many people find a shaved head and a beard work well together", "Some research links symmetry with perceived attractiveness". Replace with a plain statement or drop.
6. Title story. Reading titles alone, every page except celebrity-look-alike and facial-landmarks tells a clear story (what you get, how it works, what you do with it). The two exceptions are called out below.

## Titles read in order, per page (coherence check)

- attractiveness-test: score with reasons, one change to improve, styling ideas. Coherent.
- face-golden-ratio: thirds, eye spacing, phi is only a reference. Coherent. The last title is an "X, not Y".
- face-beauty-analysis: score with details, face shape, face stays yours, two ideas. Coherent.
- facial-symmetry: compare features, centerline, how much is the camera. Coherent.
- celebrity-look-alike: face shape, palette, "we skip celebrity matching to keep your photo private". The last title gives the wrong reason (matching a face to a person is identity recognition, which is a different reason from keeping your photo private), and a first-time visitor still does not know which tool the upload box runs.
- face-comparison: equal size, hair and framing, lighting. Coherent. "Lighting and angle get credit" is odd.
- beauty-score-showdown: equal card, one note each, card stays private. Coherent, but title 1 offers no benefit.
- face-shape-analyzer, skin-analysis, seasonal-color-palette, beauty-tips and all hair and beard pages: coherent.
- facial-landmarks: "A few clear points beat a dense mesh every time" is a claim, not a benefit, and there is a "Join the waitlist" call to action for a waitlist the page does not describe.
- beauty-routine-challenge: coherent, but it never says why a plan is worth 5 credits.

## Per-tool fixes (failing or under 90)

Line numbers refer to the files as read. Each replacement follows the style guide.

### 1. attractiveness-test (88, pass, polish)

- Line 9 h1. Replace with: `Attractiveness test: see how your photo comes across`
- Line 29 stories[1].body. Replace with: `A softer smile, a lower camera or a different crop can change how a picture reads. The notes name the one change that matters most in your photo, so you pick your next profile shot on purpose.`
- Line 41 ideasHeading. Replace with: `Use your score to pick a photo you like.`
- Line 53 FAQ answer ("useful" and an X, not Y). Replace with: `A photo test can only tell you how one photo reads. Light, angle and expression move the score a lot, and beauty is personal. Read the number lightly and spend your time on the notes.`

### 2. face-golden-ratio (84, fail)

- Line 66 h1. Replace with: `Golden ratio face calculator: see your proportions on your photo`
- Line 67 heroLead. Replace with: `Curious how your face lines up with the golden ratio? Upload one photo to the golden ratio face calculator and see your face thirds and eye spacing marked with guide lines. It is a fun reference that takes a few minutes, and your first result is free.`
- Line 91 stories[2].title. Replace with: `Phi sits beside your portrait as a fun reference.`
- Line 92 stories[2].body. Replace with: `The golden ratio is about 1.618, a number designers have used for centuries. It appears next to your portrait so you can see how your proportions compare. It is for curiosity and says nothing about how attractive you are.`
- Line 99 ideasIntro. Replace with: `A golden ratio checker works best for comparing two shots of yourself.`
- Line 103 useCases[1].body, last clause. Replace "and nobody has to match a number" with "and nobody has to match anything".
- Line 111 FAQ question. Replace with: `Which photo works best for a golden ratio face test?`

### 3. face-beauty-analysis (86, pass, polish)

- Line 123 h1. Replace with: `Face beauty analysis: a clear, kind report on your photo`
- Line 149 stories[2].body. Replace with: `The analysis adds notes around your portrait and leaves the photo alone. Skin texture, beard detail and expression stay as you uploaded them, so you still see yourself. Nothing is retouched.`
- Line 165 useCases[0].body, end. Replace the last sentence with: `You ask better questions and avoid the haircut you regret. The report costs 5 credits.`

### 4. facial-symmetry (82, fail)

- Line 186 h1. Replace with: `Face symmetry test: see how balanced your face looks`
- Line 206 stories[1].body. Replace with: `Your full face stays in view while a centerline shows how the two sides sit around it. That lets you see ordinary variation instead of imagining it. Small differences between left and right are normal.`
- Line 207 points[0] and points[2]. Replace with: `Light centerline` and `Normal variation shown`.
- Line 232 FAQ answer (vague attribution and X, not Y). Replace with: `Not necessarily. Attractiveness depends on far more than symmetry, and many admired faces are clearly asymmetrical. Small differences often add character, so treat this as a curious look at one photo.`

### 5. celebrity-look-alike (78, fail)

- Line 243 h1. Replace with: `Celebrity look alike finder: what you can do instead`
- Line 244 heroLead. Replace with: `Searching for a celebrity look alike finder? We do not name celebrities from your photo, because matching a face to a real person is identity recognition. Upload one photo and choose a face shape or a color palette instead. Your first result is free.`
- Line 263 stories[1].body. Replace with: `Seasonal Color Palette shows a suggested color family and named swatches beside your portrait. Pick a lip, a blush and a piece of jewelry from your own swatches and you get a favorite star's put-together feel in shades chosen for your coloring.`
- Line 268 stories[2].title. Replace with: `We never match your photo to a real person.`
- Line 269 stories[2].body. Replace with: `Naming a person from a face is identity recognition, and we do not offer it. Any resemblance you notice is your own idea and not a claim about a real person. Take inspiration from anyone, then adapt the look to fit you.`
- Line 279 useCases[0].body. Replace with: `Find your face shape first, then compare it with the cut you admire. If the shapes differ, ask your stylist for the version that suits yours. You keep the style you love and skip a cut that fights your outline.`
- Line 286 FAQ answer. Replace with: `Naming a real person from a photo is facial recognition, and we leave it out to protect your privacy and theirs. Our tools describe your own features and styling instead.`

### 6. face-comparison (80, fail)

- Line 300 h1. Replace with: `Face comparison: two photos, side by side`
- Line 301 heroLead. Replace with: `Want to compare two photos at a glance? This face comparison puts both portraits at equal size and notes visible differences in outline, hair, lighting and framing. It never checks identity or scores resemblance, and your first result is free.`
- Line 309 featuresHeading. Replace with: `You see two photos side by side and what sets them apart.`
- Line 314 stories[0].body, middle sentence. Replace with: `The notes describe only what is visible and never name or identify anyone.`
- Line 315 points[0]. Replace with: `Equal size and space`
- Line 325 stories[2].title. Replace with: `Lighting and angle explain many of the differences you see.`

### 7. beauty-score-showdown (80, fail)

- Line 357 h1. Replace with: `Beauty score showdown: a friendly photo score for two`
- Line 358 heroLead. Replace with: `Want a playful beauty score showdown with a friend or partner? Add two photos and each person gets a score from 0 to 100 and one kind styling note on an equal card. There are no winners or rankings, and your first round is free.`
- Line 366 featuresHeading. Replace with: `Each person on the card gets the same space and the same kind of note.`
- Line 370 stories[0].title. Replace with: `Both of you get a score on a card of equal size.`
- Line 377 stories[1].body, last sentence. Replace with: `Instead of naming a winner, the card gives each of you something to try in your next photo.`
- Line 389 ideasHeading. Replace with: `Make it a game night with friends.`
- Line 400 FAQ question and answer. Question: `Does anyone win the showdown?` Answer: `No. Both photos are treated the same, and the scores are impressions of photos. We do not declare winners, rank people or compare anyone with a wider group.`

### 8. face-shape-analyzer (86, pass, polish)

- Line 414 h1. Replace with: `Face shape analyzer: find hair and glasses that suit you`
- Line 428 stories[0].body, middle. Replace "Seeing the outline makes the face shape analyzer label easy to understand, and your photo stays natural." with `Seeing the outline makes the label easy to understand, and your photo stays natural.`
- Line 450 useCases[0].body. Replace with: `Show the outline and the suggested cuts from your result, then say which one you like. You describe the result with a picture and not a guess, which helps you avoid a cut that only works on someone else's face.`
- Line 451 useCases[1].body. Replace with: `Take the frame shapes from your result with you and start with those. You spend less time at the mirror, return fewer pairs and still try everything on in person before you buy.`
- Line 440 body: "from fifty frames to five" is an invented example. Replace with `to cut a wall of frames down to a handful`.

### 9. skin-analysis (84, fail)

- Line 471 h1. Replace with: `AI skin analysis: a closer look at your skin in a photo`
- Line 491 stories[1].body. Replace with: `A zoomed view of your nose carries a label tied to that spot. Seeing pores plainly, in context, shows how they look in this photo. Lighting and resolution change what shows, so compare two photos before you draw conclusions.`
- Line 496 stories[2].title. Replace with: `Your under-eye area gets a close-up with a plain label.`
- Line 510 faqHeading (lowercase "ai" bug). Replace with: `Your AI skin analysis questions, answered.`

### 10. facial-landmarks (72, fail)

- Line 528 h1. Replace with: `Facial landmarks map: see the key points of your face`
- Line 537 featuresHeading. Replace with: `A few clear points are easier to read than a dense mesh.`
- Line 554 stories[2].body. Replace with: `Points trace your jaw and face outline while the photo stays intact. They are illustrative and are not exported detector coordinates, so use the map as a visual guide. Do not expect data you can export to other software.`
- Line 556 stories[2].cta. "Join the waitlist" promises something the page does not offer. Replace with: `Preview the outline`
- Line 559 banner title. Replace with: `Your first two maps are free when the tool opens.`
- Value for money: the page sells credits for a tool that is not live. State once near the hero that the tool opens soon and that nothing is charged until then (the hero already says "coming soon"). Move that sentence to the first line: `This tool opens soon. Here is what your map will show.`

### 11. seasonal-color-palette (90, pass)

- Line 22 stories[1].body, last two fragments. Replace "Fewer impulse buys, fewer returns." with `That can mean fewer impulse buys and fewer returns.`
- Line 26 ideasIntro, trim the doubled "earns its credits" idea. Replace with: `A color season finder helps most right before a purchase.`

### 12. beauty-tips (86, pass, polish)

- Line 52 heroLead. Replace with: `Generic advice rarely fits one face. Upload one portrait and get personalized beauty tips for hair shape, glasses frames and photo lighting, all taken from what your picture shows. Your first result is free, and you get specific ideas to try.`
- Line 63 stories[0].body, last sentence. Replace with: `Treat it as an idea to talk through.`
- Line 70 useCases[0].body, last sentences. Replace with: `You leave with a cut you chose on purpose.`

### 13. beauty-routine-challenge (78, fail)

- Line 94 heroLead (unsupported "works because"). Replace with: `Big makeovers are hard to finish. A 7 day glow up challenge asks for one small task a day, so you can actually do it. Upload a portrait and get a seven-day self-care and style plan beside your photo. Your first plan is free, and you can start tomorrow.`
- Line 106 stories[1].body. Replace with: `Tasks are small and practical, like laying out tomorrow's outfit or finding the best window light for a photo. Each one takes minutes. Skip or swap any day that does not suit you.`
- Line 112 useCases[0].body. Replace with: `When work or exams ate your habits, a full routine feels like too much. Seven small tasks are easier to restart with, and the plan stays on your phone until you are ready.`
- Line 119 FAQ answer. Replace with: `It is a week of small self-care and style tasks, one per day, from outfit pairing to hair styling and rest. This tool puts the plan beside your portrait so you can follow it day by day.`
- Line 122 FAQ answer. Replace with: `No. The plan covers small habits such as gentle cleansing, sun protection and rest, and it does not promise any change to your skin. Think of it as a routine and not a treatment.`
- Line 116 banner body (value for money: say what the 5 credits buy). Replace with: `A new account starts with 10 free credits and each plan uses 5, so two plans cost nothing. One plan gives you seven days of tasks on a single image for your phone. After that, a monthly plan has 200 credits, which is 40 plans.`

### 14. ai-skin-enhancement (85, pass, polish)

- Line 148 stories[1].body, sentence 2. Replace with: `The aim is to look like you on a good day.`
- Line 164 FAQ answer, first words. Replace "It is built not to." with `Not if you start with Subtle.`

### 15. smart-beauty (80, fail)

- Line 178 heroLead. Replace with: `Some photos are nearly perfect, except for shine on your forehead or a shadow that makes you look tired. This portrait retouch makes a light one-tap fix and shows it beside your original, so you pick the honest version. Your first result is free.`
- Line 187 featuresIntro. Replace with: `A light retouch should fix shine, exposure and small blemishes. Your face, pores and age stay out of the edit.`
- Line 194 ideasIntro. Replace with: `A one-tap retouch earns its credits when the photo is already good and one thing distracts.`
- Line 203 FAQ question. Replace with: `What does a portrait retouch do?`

### 16. face-beauty-retouch (80, fail)

- Line 229 featuresIntro. Replace with: `Each level appears beside your original, so nothing is a surprise.`
- Line 231 stories[0].body, last sentence. Replace with: `It is the safest place to start.`
- Line 232 stories[1].body, sentence 3. Replace with: `The result still looks like you, and the photo sits closer to how you remember the night.`
- Line 233 stories[2].title. Replace with: `Polished gives you a headshot finish that still looks like you.`
- Line 236 ideasIntro. Replace with: `Choosing a level works best when you know how polished the picture needs to be.`
- Line 245 FAQ question. Replace with: `What is a face retouch online tool?`

### 17. ai-face-enhancer (85, pass, polish)

- Line 273 stories[0].body, middle. Replace "The goal is clarity you can believe, not a different face, so the photo still feels like the day it was taken." with `The goal is believable clarity in the same face, so the photo still feels like the day it was taken.`
- Line 152 and 278 ideasIntro use "useful". Replace line 278 with: `An AI face enhancer matters most for pictures you cannot retake. Here are two common ones.`

### 18. ai-face-slimming (76, fail)

- Line 304 heroLead. Replace with: `Curious how a different angle or contour might look in a photo? This face slimming preview shows a subtle, fictional contour edit beside your original, with your features and complexion kept. It is only for curiosity. Your first result is free.`
- Line 316 stories[1].body, last sentence. Replace with: `Lenses and angles reshape faces in every photo.`
- Line 317 stories[2].body. Replace with: `The result still looks like you, with the same expression and skin color. There is no ideal face shape, and the preview makes no beauty or health recommendation.`
- Line 323 useCases[1].body. Replace with: `Seeing a subtle change beside the original can settle the question. Keeping your photo as it is is a perfectly good result. You spend one or two free results and decide.`
- Value for money: the page gives no concrete job for the credits beyond curiosity. The angle use case (line 322) is the strongest, so lead the banner with it. Banner body: `A new account starts with 10 free credits and each preview uses 5, so two results cost nothing. Use them to compare two angles of the same photo. After that, a monthly plan has 200 credits, which is 40 previews.`
- "fictional" appears at least 8 times on the page. Cut it to the hero, the first story and the first FAQ.

### 19. hairstyle-changer (89, polish)

- Line 359 stories[2].body. Replace with: `Short hair is a big step, so preview it first. If it is not for you, you lost nothing, and if you love it, you walk in with a reference photo and a calmer head.`
- Line 365 useCases[1].body, sentence 2. Replace with: `Their reaction can settle the choice before you pay a stylist anything.`

### 20. ai-hair-color (87, polish)

- Line 401 stories[2].title. Replace with: `You can compare three shades before you pick one.`
- Line 400 stories[1].body, last sentence. Replace with: `You find out whether copper suits you before any dye touches your hair.`

### 21. beard-styling (86, polish)

- Line 430 heroLead, first sentence. Replace with: `A beard takes weeks to grow, and a bad trim takes just as long to fix.`
- Line 443 stories[2].body. Replace with: `Real growth depends on your own hair, so some patches may come in slower. A preview still gives you a shape to aim for. Your expression stays as it was in the photo.`

### 22. beard-remover (83, fail)

- Line 483 stories[0].body (body drifts from the jaw title). Replace with: `You get your bearded portrait and a clean-shaven version in one image, with your own jaw shape intact. You can compare them privately before you pick up the razor. Delete the result afterward if you like.`
- Line 485 stories[2].body, last sentence. Replace with: `The aim is a rough idea you can trust, with you still recognizable.`

### 23. hair-loss-simulation (74, fail)

- Line 514 heroLead. Replace with: `Curious what a receding hairline would look like on you, or want a laugh with friends? This hair loss simulation is an entertainment preview that shows a mildly receded hairline on your own photo, with your face and remaining hair kept. It predicts nothing. Your first result is free.`
- Line 525 stories[0].title. Replace with: `A mild hairline preview is a lighthearted what-if.`
- Line 525 stories[0].body. Replace with: `Your face and the rest of your hair stay unchanged, so only the hairline moves. It is fiction, so it forecasts nothing and says nothing about your health. Treat it as a joke filter.`
- Line 527 stories[2].title. Replace with: `You can use the preview as a grooming idea.`
- Line 533 useCases[1].title. Replace with: `Plan a shorter cut that suits a higher hairline.` Body: `Some people use the preview to picture short styles that work with a higher hairline. Take the picture to a barber as a conversation starter. It is not advice.`
- Product note for the owner: this tool is the hardest to sell on value for money. Keep the page strictly entertainment and keep the single "see a doctor" line already in the guidance block.

### 24. bald-filter (86, polish)

- Line 567 stories[0].body, last two sentences. Replace with: `Your features and expression stay as they were in the photo, and the scalp has a believable shape.`
- Line 569 stories[2].body, sentence 1. Replace with: `A shaved head and a beard are a common pairing, and this lets you see whether it works on you.`

## Shared fix across all 24 pages (FAQ duplication)

Vary these two FAQ answers per tool so pages stop reading as copies:
- Consent FAQ: keep "adults 18+ and only with their permission" but write one line specific to the tool, for example for beard-remover: `Only with their permission, and only for adults aged 18 and over. Changing someone's face, even for a joke, is their call to make.` Drop the repeated sentence "Nobody should find their face in a report they did not agree to." on all but one face-analysis page.
- Photo handling FAQ: state the deletion fact once in the same words, then end with a sentence about that tool's photo, for example `Keep other people and documents out of the shot.` is fine on one page but should not end every glowup answer.

## Worst offenders

facial-landmarks (72), hair-loss-simulation (74), ai-face-slimming (76), celebrity-look-alike (78), beauty-routine-challenge (78).
