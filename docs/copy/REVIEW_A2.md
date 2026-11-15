# Copy review A2 (second round): face-analysis.ts (10 tools) and glowup-skin-hair.ts (14 tools)

Reviewer: independent, strict, fresh read of every tool. Scored against STYLE_GUIDE section 8. No source file was edited. Pass is 85 or above with no hard fail. Target is 90.

## Automated checks

- U+2014 and U+2013 dashes: none in either file. No hard fail.
- Developer or local-preview text: none. "soon", "waitlist" and "coming soon": none. facial-landmarks now reads as a live tool.
- Credit numbers (10 free credits, 5 per result, 200 monthly credits, 40 results): all match lib/pricing.ts. No false number found.
- Banned vocabulary: one hit, "useful" at glowup-skin-hair.ts line 152 (ai-skin-enhancement ideasIntro).
- Counts: 3 steps, 3 stories (4 for face-beauty-analysis), 2 use cases, 1 guidance heading, 1 banner, 8 FAQs on every tool.

## Verdict on round-one fixes

Most round-one fixes landed (H1s, "useful", kinder FAQ wording, celebrity-look-alike reasoning, landmarks "waitlist" and "soon" removed, hair-loss story 1, face-comparison and showdown titles). Four were not truly fixed or were broken further:

1. ai-face-enhancer FAQ (line 291) and beard-remover FAQ (line 502) still open with "It is built not to."
2. ai-face-slimming story 2 (line 316) now says the same thing twice in a row ("lenses and angles reshape faces all day" then "Lenses and angles reshape faces in every photo."). A paste artifact.
3. bald-filter story 3 (line 569) repeats "Brows are left unchanged." twice. Same kind of artifact.
4. "X, not Y" was cut in face-analysis (grep count 0 for the plain forms) but moved to glowup (21 hits), and facial-landmarks now states its "illustrative, not exported" limit five times.

New cross-tool tells found:

- Glowup banner skeleton. 13 of 14 banners are the same sentence: "A new account starts with 10 free credits and each X uses 5, so two results cost nothing. After that, a monthly plan gives you 200 credits, which is 40 Xs. Download the image and ...". Titles are the same shape too: "Your first two X are free, so Y." Facts may repeat, shape should not. Titles are varied below; a rewrite of the body skeleton is optional.
- Privacy FAQ across glowup: "Delete it from your history and the upload is removed" appears on nearly all 14. Consent FAQ across face-analysis: "Only with their consent, and only for adults (18+)" on 8 of 10.
- Parallel triplet "light, angle and expression" repeats in attractiveness-test, face-beauty-analysis, golden ratio and symmetry.
- "still looks like you" appears 6 times on face-beauty-retouch.
- Vague claims: "Most people asking...", "Many admired faces...", "Many people feel self-conscious", "A shared week is easier to stick with", "plenty of people look great".

## Score table

| # | Tool | File | Round 1 | Round 2 | Result |
|---|---|---|---|---|---|
| 1 | attractiveness-test | face-analysis | 88 | 89 | pass |
| 2 | face-golden-ratio | face-analysis | 84 | 87 | pass |
| 3 | face-beauty-analysis | face-analysis | 86 | 88 | pass |
| 4 | facial-symmetry | face-analysis | 82 | 86 | pass |
| 5 | celebrity-look-alike | face-analysis | 78 | 84 | fail |
| 6 | face-comparison | face-analysis | 80 | 87 | pass |
| 7 | beauty-score-showdown | face-analysis | 80 | 88 | pass |
| 8 | face-shape-analyzer | face-analysis | 86 | 89 | pass |
| 9 | skin-analysis | face-analysis | 84 | 86 | pass |
| 10 | facial-landmarks | face-analysis | 72 | 83 | fail |
| 11 | seasonal-color-palette | glowup | 90 | 90 | pass |
| 12 | beauty-tips | glowup | 86 | 87 | pass |
| 13 | beauty-routine-challenge | glowup | 78 | 86 | pass |
| 14 | ai-skin-enhancement | glowup | 85 | 85 | pass |
| 15 | smart-beauty | glowup | 80 | 86 | pass |
| 16 | face-beauty-retouch | glowup | 80 | 85 | pass |
| 17 | ai-face-enhancer | glowup | 85 | 84 | fail |
| 18 | ai-face-slimming | glowup | 76 | 79 | fail |
| 19 | hairstyle-changer | glowup | 89 | 88 | pass |
| 20 | ai-hair-color | glowup | 87 | 87 | pass |
| 21 | beard-styling | glowup | 86 | 87 | pass |
| 22 | beard-remover | glowup | 83 | 84 | fail |
| 23 | hair-loss-simulation | glowup | 74 | 83 | fail |
| 24 | bald-filter | glowup | 86 | 81 | fail |

Totals: 17 pass, 7 fail. No hard fails. Only seasonal-color-palette reaches 90, so the 90 target is not met. Face-analysis 8 of 10 pass, glowup 9 of 14 pass. Worst: ai-face-slimming 79, bald-filter 81, facial-landmarks 83, hair-loss-simulation 83.

## Fixes per tool (every tool under 90)

Line numbers are for the files as read. Edits are text replacements inside the string on that line.

### face-analysis.ts

**1. attractiveness-test (89)**
- Line 10: replace "plus notes on light, angle and expression" with "plus notes on what helps and what hurts the shot".
- Line 53 answer, sentence 2: replace with "A different light or angle can move the score a lot, and beauty is personal."

**2. face-golden-ratio (87)**
- Line 86: replace "Instead of a lone number, the gap between your eyes is shown across your full face and described in words." with "The gap between your eyes is shown across your full face and described in words."
- Line 93 points[2]: replace "No beauty ideal claims" with "Fun reference".
- Line 112 answer: replace with "No. Beauty varies from person to person, and no single ratio defines it. The ratio is a fun reference for exploring your features, and you have nothing to match."

**3. face-beauty-analysis (88)**
- Line 149 body: delete the last sentence "Nothing is retouched." (the point "No retouching" already says it).
- Line 155 body: replace the last sentence with "Keep what you like."
- Line 177 answer: delete "The final choice should still feel right to you."

**4. facial-symmetry (86)**
- Line 200 body: delete "Small gaps between sides are normal and often hard to spot." Keep the normal-variation line only on line 206.
- Line 227 answer: replace sentences 2 and 3 with "Ours draws a centerline and guides and explains them in words. It does not decide how attractive anyone is."
- Line 232 answer: replace with "Not necessarily. Attractiveness depends on far more than symmetry. Small differences often add character, so treat this as a curious look at one photo."
- Line 234 answer: replace "Many people feel self-conscious about symmetry, so ask first" with "Symmetry can be a sensitive topic, so ask first".

**5. celebrity-look-alike (84)**
- Line 257 body, sentence 1: replace with "If you are asking which celebrity you look like, you may really be asking which cuts and frames suit you."
- Line 262 title: replace with "Your color palette shows the shades that suit your coloring."
- Line 263 body: replace with "Seasonal Color Palette shows a suggested color family and named swatches beside your portrait. Pick a lip, a blush and a piece of jewelry from those swatches and you get a put-together look in shades chosen for your coloring."
- Line 270 points[0]: replace "Privacy first" with "No face matching".
- Line 280 title: replace with "Shop for shades that suit you before you copy a look."
- Line 280 body: replace "wear the polish of someone you admire in tones chosen for your own coloring" with "borrow the look you admire in tones chosen for your coloring".
- Line 291 answer, last sentence: replace with "so you can borrow the style and adapt it to your face."

**6. face-comparison (87)**
- Line 320 body, sentences 2 and 3: replace with "A fringe, a parting or a tighter crop can make two photos of one person look different. Seeing which one is doing it helps you pick."
- Line 326 body: replace with "Light and camera position can change a photo a lot. The notes say where a difference comes from, so you can tell a facial difference from a lighting one and judge both shots fairly."
- Line 337 body (over 60 words): replace with "Add two adult portraits with permission and see how hair, outline and framing differ. Share the side-by-side with the friend who agreed. It cannot confirm identity or family ties."

**7. beauty-score-showdown (88)**
- Line 394 body: replace "and neither of you has to win anything" with "and nobody gets ranked".
- Line 405 answer: delete "Treat it as a game night idea."

**8. face-shape-analyzer (89)**
- Line 434 body: replace "so you leave feeling sure of your choice" with "so you can say exactly what you want".
- Line 462 answer: replace "plenty of people look great in styles outside their shape" with "a style outside your shape can still look great on you".

**9. skin-analysis (86)**
- Line 491 body: replace with "A zoomed view of your nose carries a label tied to that spot, so you see how pores look in this photo. Lighting and resolution change what shows, so compare two photos before you draw conclusions."
- Line 497 body: replace "so you read the picture calmly and decide for yourself what, if anything, to do" with "so you can read the picture as it is".
- Line 513 answer: replace "four labeled close-ups of your cheek, nose and under-eye areas" with "labeled close-ups of your cheek, nose and under-eye areas" (the page describes three).

**10. facial-landmarks (83)**
- Line 529 hero: replace the last sentence with "Your first result is free, and it takes a few minutes." and delete "It is an illustrative guide,".
- Line 542 body: replace "illustrative points" with "light points".
- Line 554 body: replace with "Points trace your jaw and face outline while the photo stays intact. You can read the outline against your own photo at full size."
- Line 555 points: replace with ["Jaw and outline points", "Photo stays intact", "Full-size view"].
- Line 571 answer: delete "They are not calibrated coordinates, and you cannot export them." and end with "Download it as one image." Keep the limit on lines 569 and 573 only.

### glowup-skin-hair.ts

**11. seasonal-color-palette (90)**
- Line 32 banner title: replace "so try one today" with "so start today" (it says two results, then "one").

**12. beauty-tips (87)**
- Line 70 body: delete "A clear first sentence often makes the whole visit calmer, and" so it ends "...refining one idea instead of guessing. You leave with a cut you chose on purpose."
- Line 74 banner title: replace with "Two sets of tip cards cost nothing to start."

**13. beauty-routine-challenge (86)**
- Line 107 body: delete "A shared week is easier to stick with than a solo one."
- Line 113 body: delete "Doing it together turns self-care into something you look forward to."
- Line 122 answer: replace "Think of it as a routine and not a treatment." with "It is a routine and makes no treatment claims."

**14. ai-skin-enhancement (85)**
- Line 149 body, sentence 2: replace with "Heavy smoothing tends to look edited, so keeping them makes the photo easier to believe."
- Line 152 ideasIntro (banned word "useful"): replace with "Skin retouching helps when one good photo has one small distraction. Here are two common cases."
- Line 158 banner title: replace with "Two edits cost nothing, so compare both levels."

**15. smart-beauty (86)**
- Line 180 howToIntro: replace with "A portrait retouch takes a few minutes: upload, pick a strength and compare."
- Line 197 body: replace "A light portrait retouch online keeps you recognizable" with "A light retouch keeps you recognizable".
- Line 200 banner title: replace with "Two retouches cost nothing, so try both levels."

**16. face-beauty-retouch (85)**
- Line 232 body, last sentence: replace with "The photo ends up closer to how you remember the night."
- Line 233 title: replace with "Polished gives you a headshot-ready finish."
- Line 242 banner title: replace with "Two finishes cost nothing, so test two levels."

**17. ai-face-enhancer (84)**
- Line 275 title: replace with "Crisper edges help the photo hold up when you share or print it."
- Line 275 body, sentence 2: replace with "The enhancer cannot invent details that are not in the original, so expect a cleaner photo within what the original holds."
- Line 284 banner title: replace with "Two enhancements cost nothing, so rescue a photo."
- Line 290 answer, last sentence: replace with "Expect a cleaner photo, with limits."
- Line 291 answer: replace with "No. The enhancer keeps your identity, skin texture, age, expression and lighting, and does not invent a different face. Compare with your original to be sure you are happy with the result."

**18. ai-face-slimming (79)**
- Line 315 body: delete "What you do with it is entirely up to you."
- Line 316 body: replace with "Because the two sides use the same photo, you see what the edit changed and nothing else. It also shows how much lenses and angles reshape a face in any photo."
- Line 326 banner title: replace with "Two previews cost nothing, so look and decide."

**19. hairstyle-changer (88)**
- Line 358 body: replace "Run it before you book, not after." with "Run it before you book."
- Line 359 body: replace "a reference photo and a calmer head" with "a reference photo".
- Line 368 banner title: replace with "Two cuts cost nothing to preview."

**20. ai-hair-color (87)**
- Line 401 title: replace with "You can compare two shades before you pick one." (three previews cost 15 credits, only two are free).
- Line 401 body: replace with "Run two previews and compare them in your camera roll. Seeing two shades together makes the choice clearer than imagining each one. The best one becomes a reference image, so you and your colorist talk about a real shade."
- Line 401 points[0]: replace "Compare several shades" with "Compare two shades".
- Line 410 banner title: replace with "Two shade previews are free before you book."

**21. beard-styling (87)**
- Line 441 body: replace "That clarity helps when you tell your barber what you want" with "It helps when you tell your barber what you want".
- Line 442 body: replace "The whiskers look individual and believable instead of painted on." with "The whiskers look individual and believable."
- Line 452 banner title: replace with "Two beard previews cost nothing."
- Line 457 answer: replace "so you can compare as many styles as you like" with "so you can compare several styles".

**22. beard-remover (84)**
- Line 483 title: replace with "You see your clean-shaven face before you pick up the razor."
- Line 483 body: replace with "You get your bearded portrait and a clean-shaven version in one image, with your jaw shape kept. You can compare them privately and decide in your own time. Delete the result afterward if you like."
- Line 485 body, last sentence: replace with "The result is a rough idea of the shaved you, still recognizable."
- Line 494 banner title: replace with "Two previews cost nothing, so look before you shave."
- Line 502 answer: replace "It is built not to." with "No."

**23. hair-loss-simulation (83)** (limit is stated seven times; keep it in featuresIntro, FAQ 4 and FAQ 5)
- Line 525 body: replace with "Your face and the rest of your hair stay unchanged, so only the hairline moves. Treat it as a joke filter and share it only if it makes you laugh."
- Line 527 body: replace with "Some people use it to think about which barber to see or how short to go. For real worries about thinning, ask a doctor or dermatologist."
- Line 527 points: replace with ["Fun what-if only", "Face unchanged", "Ask a doctor about worries"].
- Line 539 answer: replace with "It is a fictional entertainment preview that shows a mildly receded hairline on your photo. Your face stays unchanged."
- Line 543 answer: replace with "No. The tool is for entertainment only and just edits your photo. Please talk with a professional about real concerns."
- Line 536 banner title: replace with "Two previews cost nothing, so keep it fun."

**24. bald-filter (81)**
- Line 569 body: replace "Brows are left unchanged. Brows are left unchanged." with "Brows are left unchanged." (duplicated sentence).
- Line 578 banner title: replace with "Two previews cost nothing, so look before you buzz."
- Line 584 answer: replace "The preview is a styling idea, it does not diagnose hair health, and your barber can tell you what to expect." with "The preview is a styling idea, and your barber can tell you what to expect."

## Optional shared fix to reach 90 across the glowup file

Rewrite the 13 repeated banner bodies so only the numbers match. One variant per tool is enough, for example: "Ten free credits cover your first two results at 5 credits each. The monthly plan has 200 credits, which is 40 more. Save the image and [tool-specific job]." Also end the privacy FAQ answers differently on each page and give the consent FAQs one tool-specific sentence.
