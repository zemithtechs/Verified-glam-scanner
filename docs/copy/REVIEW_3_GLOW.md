# Copy review round 3: glowup-skin-hair.ts (14 tools)

Reviewer: independent, fresh read of every tool, top to bottom as a first-time visitor. Scored against STYLE_GUIDE section 8. No source file was edited. Pass is 85 with no hard fail. Target is 90. Line numbers refer to `web-hub/lib/copy/glowup-skin-hair.ts` as read.

## Automated checks

- U+2014 and U+2013: none. No hard fail.
- "soon", "waitlist", "useful", "powerful", "truly", "simply", "unlock", "elevate": none. No developer text.
- Numbers: 10 free credits, 5 per result, 200 monthly credits, 40 results all match `lib/pricing.ts` on every tool. Every hero and every banner states the free first result. No false number.
- Counts: 3 steps, 3 stories, 2 use cases, 1 guidance heading, 1 banner, 8 FAQs on all 14.
- Medical: no diagnosis or treatment claim anywhere. "Does not diagnose" is present on beauty-tips, beauty-routine-challenge, ai-skin-enhancement, smart-beauty, face-beauty-retouch, ai-face-slimming, hairstyle-changer, ai-hair-color and hair-loss-simulation. Not needed on the colour, beard and bald pages.
- Round 2 fixes landed (duplicate "Brows are left unchanged", "It is built not to", slimming duplicate sentence, "useful").

## Score table

| # | Tool | Round 2 | Round 3 | Result | Main reason it is not higher |
|---|---|---|---|---|---|
| 1 | seasonal-color-palette | 90 | 91 | pass | Clean. Only the shared privacy and consent wording. |
| 2 | beauty-tips | 87 | 89 | pass | Use case 1 repeats story 1 (show the stylist) and ends on filler. |
| 3 | beauty-routine-challenge | 86 | 88 | pass | "tomorrow" 6 times, banner repeats hero, story 2 body repeats its title. |
| 4 | ai-skin-enhancement | 85 | 88 | pass | "look like you" loop, ideasHeading says photos but case 2 is a settings test, keyword absent from bodies. |
| 5 | smart-beauty | 86 | 88 | pass | Story 3 body does not finish its title, story 2 body repeats title, a triplet in case 2. |
| 6 | face-beauty-retouch | 85 | 87 | pass | Story 1 and 2 say "remember" and "start" twice. Nearly the same pitch as smart-beauty. |
| 7 | ai-face-enhancer | 84 | 89 | pass | Hero closes with two clipped sentences, story 1 body repeats "recognizable". |
| 8 | ai-face-slimming | 79 | 85 | pass (borderline) | "Original beside the edit" said 5 times, limit stated 4 times, question hero, weak reason to pay. |
| 9 | hairstyle-changer | 88 | 89 | pass | Tense slip "you lost nothing", "risk-free", case 1 repeats story 3. |
| 10 | ai-hair-color | 87 | 90 | pass | Clean. One awkward title ("Copper hair arrives..."). |
| 11 | beard-styling | 87 | 89 | pass | Story 1 filler, story 3 point repeats its title. |
| 12 | beard-remover | 84 | 86 | pass | Question hero, story 1 and banner repeat the same sentence, a fragment. |
| 13 | hair-loss-simulation | 83 | 85 | pass (borderline) | Limit said 7 or more times, "Some people use" twice, "a few years" contradicts "predicts nothing". |
| 14 | bald-filter | 81 | 88 | pass | Question hero, story 1 body repeats its title, "not a pasted-on head". |

Average 87.6. Two tools reach 90. Target 90 is not met for 12 of 14, so the fixes below are needed.

## Cross-tool tells (fix once, benefits all pages)

1. Four heroes open with a rhetorical question: ai-face-slimming (line 304), beard-remover (472), hair-loss-simulation (514), bald-filter (556). Same skeleton "Curious / Wondering / Thinking about ...?". Replacements below.
2. All 14 heroes end with "Your first result is free." That is the required fact, but it is the same closing line 14 times. Acceptable, vary on the four pages touched below.
3. Privacy FAQ ends "delete it from your history and the upload is removed" on 10 pages (beauty-tips 83, smart-beauty 209, face-beauty-retouch 251, ai-face-slimming 335, hairstyle-changer 377, ai-hair-color 419, beard-styling 461, hair-loss 545, beard-remover 503, bald-filter 587). Consent FAQ opens "Only with their permission, and only for adults aged 18 and over" on 8 pages. Page-level fixes below for the five worst cases; apply the same one-sentence tool-specific change to the rest.
4. "X, not Y" in bodies: "preserved, not redrawn" (526), "not a pasted-on head" (568). Honest-limit uses in FAQ answers are fine.

## Fixes per tool (every tool under 90)

### 2. beauty-tips (89)
- Line 70 body: replace with "Save the hair card on your phone as a starting point for your stylist. You spend the appointment refining one idea instead of guessing, and you leave with a cut you chose on purpose."
- Line 83 FAQ answer, sentence 2: replace "If you would rather not keep it, delete it from your history and the upload is removed." with "Delete the result from your history whenever you like and the upload goes with it."

### 3. beauty-routine-challenge (88)
- Line 105 body, last sentence: replace "You only ever do today's task, and tomorrow's can wait until tomorrow." with "You only do today's task."
- Line 106 body: replace "Each one takes a few minutes, so a busy day does not break the week." with "A busy day does not break the week."
- Line 116 banner title: replace "Your first plan is free, so begin tomorrow morning." with "Your first two plans are free, so start a week you can finish."
- Line 100 step 3 body: replace "so tomorrow's task is the first thing you see" with "so the day's task is the first thing you see".

### 4. ai-skin-enhancement (88)
- Line 147 body, sentence 1: replace with "The AI skin enhancement edit targets temporary blemishes and leaves the rest of your skin alone."
- Line 148 body: delete "You still recognize yourself the moment you see it."
- Line 151 ideasHeading: replace with "Two moments for a gentle skin edit."
- Line 155 body, last sentence: replace "Two results use 10 credits, which your free credits cover in full, so the comparison costs you nothing." with "Both runs fit inside your free credits."

### 5. smart-beauty (88)
- Line 190 body: replace with "The exposure is balanced while your complexion and the original light are kept. A photo that came out too dark or too pale gets closer to what you saw at the time. Nothing gets whitened or tinted along the way."
- Line 191 body: replace with "Every result comes as a before and after, so you can check the edit against the untouched photo before you post. There is no face reshaping and no skin whitening, and real pores and your age stay visible. If you prefer the original, keep it."
- Line 197 body, last sentence: replace "You skip the photographer, the waiting and the extra cost." with "You skip the photographer and the wait."
- Line 209 FAQ answer, last two sentences: replace with "The upload exists to make your retouched image, and deleting the result from your history removes it too. Crop group shots to just you first."

### 6. face-beauty-retouch (87)
- Line 231 body: delete "It is the safest place to start."
- Line 232 body: replace with "The middle level tames reflections and evens texture in the same frame. Skin under flash often reflects more than you expect, so this brings it back to how it looked in the room. Compare it with the original to see the difference."
- Line 232 points[1]: replace "Texture compared in one frame" with "Even texture in one frame".
- Line 233 body, last sentence: replace "Your first results are free to experiment with." with "Your first two results are free, so you can compare both."
- Line 251 FAQ answer: replace "Remove it from your history later and the upload goes too." with "You can remove it from your history later."

### 7. ai-face-enhancer (89)
- Line 262 hero, last two sentences: replace "Compare before and after. Your first result is free." with "You see before and after side by side, and your first result is free."
- Line 273 body: replace with "Eyes carry a portrait, so clearer eyes and nearby detail change how the whole picture feels. The goal is believable clarity in the same face, so you still recognize the person you photographed."

### 8. ai-face-slimming (85)
- Line 304 hero: replace with "A different angle or contour can change how a face looks in a photo. This face slimming preview shows a subtle, fictional contour edit beside your original, with your features and complexion kept. It is only for curiosity, and your first result is free."
- Line 313 featuresIntro: replace with "Both versions sit in one image, so you judge the change yourself."
- Line 315 body: replace with "The edit is restrained, so any difference is small and easy to judge against the untouched photo. It is a fun look at how editing, angle and framing change a picture."
- Line 317 body, last sentence: replace "There is no ideal face shape, and the preview makes no beauty or health recommendation of any kind, so use it only if you are curious." with "There is no ideal face shape, so treat the preview as curiosity and nothing more."
- Line 335 FAQ answer: replace "Delete it from your history and the upload is removed. If a preview does not feel good, deleting it takes a moment." with "If a preview does not feel good, delete it from your history and the upload goes too."

### 9. hairstyle-changer (89)
- Line 359 body: replace "you lost nothing" with "you lose nothing".
- Line 359 points[0]: replace "A bold cut, risk-free" with "A bold cut, previewed first".
- Line 364 body: replace with "Preview the cut you keep thinking about and look at the picture a few times over a week. If you still like it, book the appointment with a reference in hand. If not, you saved yourself a regrow."
- Line 377 FAQ answer, sentence 2: replace with "The upload is removed when you delete the result from your history."

### 11. beard-styling (89)
- Line 441 body: replace with "It is a tidy, polished direction, and your own photo shows how the edges sit against your jaw. It helps when you tell your barber what you want, so the first trim holds no surprises."
- Line 443 points[2]: replace "A target to grow toward" with "A shape to aim for".
- Line 461 FAQ answer: replace with "The upload is used for your beard preview and goes when you delete the result. Take a fresh front-facing shot if you would rather not use an old photo."

### 12. beard-remover (86)
- Line 472 hero: replace with "A long-time beard makes it hard to picture your bare face. This beard remover shows a clean-shaven version of your own photo, with believable skin and your jaw shape, lips, age and lighting kept. Look at both versions side by side, then decide about the razor. Your first result is free."
- Line 485 body, sentences 2 and 3: replace with "Your identifying features stay in place. Treat the result as a rough idea of the shaved you, which is enough to help you decide."
- Line 494 banner body, last sentence: replace "Decide in your own time, and delete the image afterward if you like." with "Save the pair and show it to whoever has an opinion."
- Line 503 FAQ answer: replace with "Your photo is used to make the clean-shaven preview, and deleting the result removes the upload. This is a personal curiosity check, so share it only if you want to."

### 13. hair-loss-simulation (85)
- Line 514 hero: replace with "A receding hairline is easy to joke about and hard to picture. This hair loss simulation is an entertainment preview that shows a mildly receded hairline on your own photo, with your face and remaining hair kept. It predicts nothing, and your first result is free."
- Line 526 body, last sentence: replace "Your remaining hair is preserved, not redrawn, and your face is untouched." with "Only the hairline moves, so you can compare the temples directly."
- Line 527 body: replace with "Show it to a barber to start a talk about how short to go with a higher hairline. For real worries about thinning, ask a doctor or dermatologist."
- Line 533 body: replace with "Take the preview to a barber and ask which short styles work with a higher hairline. It is a conversation starter, nothing more."
- Line 543 FAQ answer: replace with "No. It is for entertainment only, edits your photo and does not diagnose or assess anything. Please talk with a professional about real concerns, and skip the preview if it feels uncomfortable."
- Line 545 FAQ answer, last sentence: replace "Because it is a joke preview, delete it from your history the moment you are done and the upload is removed with it." with "It is a joke preview, so delete it from your history when you are done."

### 14. bald-filter (88)
- Line 556 hero: replace with "Shaving your head is quick to do and slow to undo. This bald filter shows a naturally shaved head on your own photo with realistic scalp shape and light, while your face, brows and beard stay the same. Your first result is free, so look first."
- Line 567 body: replace with "It is a private way to find out whether the look suits you, before you pick up clippers or book the chair. The scalp has a believable shape and your face is untouched."
- Line 567 points[1]: replace "Realistic scalp shape" with "Believable scalp shape".
- Line 568 body, sentence 1: replace with "Matching the original light makes the preview read like a real photo of you."
- Line 568 points[1]: replace "Plausible scalp shape" with "Shadows follow the room".
- Line 587 FAQ answer: replace "Delete the result from your history and the upload is removed." with "Deleting the result from your history removes the upload."

### 10. ai-hair-color (90) and 1. seasonal-color-palette (91)
No fix required. Optional: line 400 title replace "Copper hair arrives without touching your brows or skin." with "Copper hair shows on your photo while your brows and skin stay put."

## Verdict

All 14 pass, no hard fail. Two reach 90. Apply the fixes above and the file should land at 89 to 92 per tool. Biggest remaining risks: the four question heroes, hair-loss limit repetition, and the shared privacy and consent sentences.
