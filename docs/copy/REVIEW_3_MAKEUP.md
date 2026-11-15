# Copy review 3: makeup-fashion-photo.ts (12 tools)

Reviewer: independent third round, strict, source not edited. Rubric: STYLE_GUIDE section 8. Pass 85, target 90.

Script checks: no U+2014 or U+2013 anywhere. No "soon" or coming-soon wording on any tool. Numbers match lib/pricing.ts everywhere (10 starter credits, 5 per result, $10 for 200 credits, 40 results; the $10 plan is marked PROPOSED in pricing.ts, confirm before launch). No hard fail: no medical or identification claim, no dev text. Honest limits are present: try-on says it cannot confirm size or fit (story 2, FAQ 4, FAQ 8); restoration says plausible guess (story 2, FAQ 4).

Reading the titles top to bottom, every page tells a coherent story (what it shows, what it saves you, what it costs). Bodies finish their titles. The remaining weakness is repetition inside a page: the same idea or clause says itself two to six times.

## Scores

| # | Tool | Score | Result | Main reason it is not 90 |
|---|---|---|---|---|
| 1 | lip-color-changer | 89 | pass | "at no cost" echo, rhetorical question in story 2, "before you buy" x4 |
| 2 | eyeshadow-try-on | 87 | pass | ideasIntro duplicates use case 0; featuresIntro repeats featuresHeading |
| 3 | colored-contacts | 86 | pass | "natural color stays beside it" filler; "wondered" x3; "iris only" x4 |
| 4 | ai-eyelashes | 87 | pass | filler closers in story 0 and use case 0 |
| 5 | ai-eyebrows | 85 | pass, borderline | three filler closers, "weeks" x3, question point, awkward FAQ 4 |
| 6 | ai-lip-enhancement | 85 | pass, borderline | "X, not Y" in ideasIntro, duplicated "show a makeup artist", filler closers |
| 7 | virtual-try-on-clothes | 87 | pass | banner rhetorical question, awkward "same person" clause |
| 8 | ai-tattoo-generator | 88 | pass | "something real" said twice, odd step 2 line |
| 9 | ai-waist-slimming | 84 | fail | "worth it" idea x5, "fitting" and "tailor" duplicated sentences, filler FAQ tail |
| 10 | old-photo-restoration | 88 | pass | list-fragment hero opener, "keeps the people as they were" vs plausible guess, "keep your scan" x4 |
| 11 | face-blur | 84 | fail | title and hero overclaim "every face" vs "can miss a face", filler closer, repeated checks |
| 12 | merge-portraits | 84 | fail | duplicated sentence in story 1, "adults who agreed" x6, "say so" x3 |

Rubric view for the weakest pages (waist, blur, merge): titles 15/15, body to title 12 to 15, specific 11/12, value 10/10, tone 6/10 (filler, repeats), banned 8/8, limits 6/8 (repeated), keywords 8/8, structure 6/6, length 3/4, FAQ 3/4.

## Batch note, all 12 tools (FAQ 3 skeleton)

Every "Is it free?" answer is the same three sentences with a noun swapped: "Yes, your first two X are free. A new account starts with 10 credits and each result uses 5, which covers two tries before you pay anything. A third Y is 5 more credits." Delete the middle clause ", which covers two tries before you pay anything" on all 12 (the first sentence already says it). Costs about 1 point of criterion 11 per page otherwise.

Example (lip): `Yes, your first two lipstick previews are free. A new account starts with 10 credits and each result uses 5. A third shade is 5 more credits.`

## Fixes per tool (exact lines)

### 1. lip-color-changer (89)
- `heroLead` last sentence "Your first two results are free, so you can test shades at no cost." -> `Your first two results are free.`
- `stories[2].body` "then ask one question: does this feel confident or like a costume? You get your answer in a few minutes, before you pay for the tube." -> `then decide whether it feels confident or like a costume. You get your answer in a few minutes.`

### 2. eyeshadow-try-on (87)
- `ideasIntro` "Two or three tones on one photo show you which one suits your eye color." -> `A preview is cheapest before the palette goes in your basket.`
- `featuresIntro` -> `One shade per result keeps the comparison fair: you see each color alone, never mixed with another.`

### 3. colored-contacts (86)
- `stories[0].body` "Put it next to your natural color and judge for yourself. Your natural color stays beside it." -> `Put it next to your natural color and judge the difference yourself.`
- `useCases[0].body` -> `Try the shade on your own photo and get your answer in one result. If you still love it, you have a clear picture to bring to an appointment.`
- `steps[1].body` "Only the iris changes. Your eye shape, skin and expression stay as they are." -> `Eye shape, skin and expression stay as they are.`

### 4. ai-eyelashes (87)
- `stories[0].body` delete last sentence "Light definition often reads as enough."
- `useCases[0].body` delete last sentence "Your artist then knows exactly how long and how full you mean."

### 5. ai-eyebrows (85)
- `stories[0].body` delete "A gentle arch looks different on every forehead, so check yours."
- `stories[1].body` delete "Fuller brows suit some faces better than others."
- `stories[1].points[2]` "Worth the wait?" -> `Wait or skip`
- `stories[2].body` "and it only works on some faces" -> `and it can feel stern on some faces`
- `useCases[1].body` -> `Preview full natural brows on your photo before you stop plucking. If you love them, you have a reason to wait. If you do not, you keep your routine and lose nothing.`
- FAQ 4 last sentence "It is a starting point for a talk with them, and it is no instruction." -> `Use it as a starting point for a talk with them.`

### 6. ai-lip-enhancement (85)
- `metaDescription` -> `Try a lip enhancement preview with makeup-style liner and gloss on your photo. It is makeup only. Your first two results are free.`
- `ideasIntro` ("not when you are considering a procedure" is an X, not Y) -> `A lip enhancement preview helps when you are choosing makeup. For a procedure, talk to a licensed professional.`
- `stories[1].body` delete "Check the finish on your own mouth before you spend on a tube."
- `stories[2].body` delete "A side-by-side view makes that choice quick."
- `useCases[1].body` -> `Before a shoot or a profile photo, see how gloss reads on camera. You will know whether to wear it or keep your lips matte. One preview is enough to settle it.`
- FAQ 4 delete last sentence "It is a makeup effect and nothing else."

### 7. virtual-try-on-clothes (87)
- `downloadBanner.body` -> `A new account has 10 credits and each try uses 5. For a big shopping list, 200 credits cost $10 a month and cover 40 try-ons, enough to check a whole cart before you order.`
- `stories[1].body` "Compare two cuts on the same person, face and body shape kept, and notice which one you reach for." -> `Put two cuts on the same photo and notice which one you reach for.`

### 8. ai-tattoo-generator (88)
- `heroLead` "so looking first is only sensible" -> `so looking first makes sense`
- `steps[1].body` -> `Every design is an original drawing, placed on visible skin so it follows your arm's shape.`
- `useCases[0].body` delete last sentence "Bring the picture and the consultation starts from something real." (the ideasHeading says it)

### 9. ai-waist-slimming (84)
- `stories[1].body` "so you can decide whether a tailor visit is worth the cost of the alteration. Compare the seam lines on both versions." -> `so you can see which seams a tailor would need to touch.`
- `stories[2].title` -> `Before and after show how much tailoring changes.` (8 words, stops "worth it" repeating a fifth time)
- `stories[2].body` delete last sentence "Take the picture to a fitting if you like what you see." (use case 0 says it)
- FAQ 2 delete last sentence "The whole process is a few minutes of waiting."
- FAQ 4 -> `A real tailor takes measurements, and this preview does not. It is a visual guess, so a tailor may suggest different changes.`

### 10. old-photo-restoration (88)
- `heroLead` first two sentences -> `Your grandparents' wedding photo has faded, and nobody can retake it. Upload a scan and this old photo restoration tool repairs scratches, brings back faded contrast and softens blur, keeping the people and the era in place.` (keep "Your first two restorations are free.")
- `stories[0].body` "keeps the people as they were" -> `aims to keep the people as they were` (matches the plausible-guess limit)
- `stories[2].body` "Clothing, composition and mood remain, and monochrome stays monochrome." -> `Clothing, composition and mood remain.`
- `useCases[0].body` -> `Restore the one photo everyone asks about and print the new version for the wall. You can reprint it any time.`

### 11. face-blur (84)
- `heroLead` "covers every visible face with a strong, soft-edged blur ... It helps, though it cannot promise anonymity." -> `looks for every visible face and covers it with a strong, soft-edged blur and gives you only the blurred image. Your first two are free. It makes people harder to recognize, though it cannot promise anonymity.`
- `stories[1].title` -> `Group shots and street scenes get a blur on every face found.`
- `stories[0].body` second sentence -> `This result exports a strongly obscured image with no original beside it, so you do not post the wrong version by mistake.`
- `stories[2].body` delete "Look at the whole frame once more."
- `useCases[0].body` "Passersby and kids in the background are blurred too" -> `Passersby in the background get blurred too`

### 12. merge-portraits (84)
- `stories[0].body` delete last sentence "Both people must be adults who agreed." (step 1, ideasIntro and FAQ 7 already say it)
- `stories[1].body` delete duplicate sentence "Close matches give the best result."
- `stories[2].body` delete last sentence "Say so if you share it publicly." (FAQ 8 covers it)
- `stories[2].points[2]` "Each person themselves" -> `Gift ready`
- `useCases[1].body` -> `Place two relatives from separate photos in one portrait to hang beside the others. Tell the family it is a composite, so nobody mistakes it for a photo taken together.`

## Projected after fixes

Lip 91, eyeshadow 89, contacts 89, lashes 89, brows 89, lip-enhancement 89, try-on 89, tattoo 90, waist 88, old photo 90, blur 88, merge 88. Everything passes. To reach 90 on all, also apply the batch FAQ 3 trim and vary the "What happens to my photo?" and "Can I use someone else's photo?" openers on at least half the pages.

## Value for money and first-time clarity

A stranger can say what one result costs (5 credits), that the first two are free, and what $10 buys (200 credits, 40 results). Correct on all 12. The weak spot is repeating "first two free" up to four times per page (hero, banner title, banner body, FAQ). Pricing numbers are hand typed; build them from lib/pricing.ts before launch.

## Other notes

- virtual-try-on-clothes FAQ 1 "What is virtual try on clothes and how does it work?" is grammatically odd but keeps the keyword. Acceptable, optional: `What is virtual try on for clothes, and how does it work?`
- Primary keyword counts are 5 to 7 on all pages; none stuffed in a single sentence.
- No triplet filler found beyond functional option lists (rose nude, berry, red; natural, wispy, full), which are product choices and fine.
