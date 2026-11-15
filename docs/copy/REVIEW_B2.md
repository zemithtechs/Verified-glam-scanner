# Copy review B2 (second round): makeup-fashion-photo.ts and fun-effects.ts

Reviewer: independent, strict, source files not edited. Rubric: STYLE_GUIDE section 8. Pass is 85 or more with no hard fail.
Script checks run on both files: dashes (U+2014, U+2013: none), banned words (none), story and use-case title length and full stop (all pass, 6 to 12 words), primary keyword counts (no page above 7), "soon" or unavailable wording (none; the one hit is "as soon as you have downloaded" on face-blur, which is fine). Numbers checked against lib/pricing.ts: 10 starter credits, 5 per result, $10 for 200 credits, 40 results. All correct, and every page now says "first two results free" consistently. No hard fail anywhere.

Result: 21 of 24 pass. Makeup 10 of 12. Fun 11 of 12. Only 2 tools reach the 90 target. Worst: face-blur 83, ai-waist-slimming 84, pregnant-filter 84.

## Scores

| # | Tool | Round 1 | Round 2 | Result |
|---|---|---|---|---|
| 1 | lip-color-changer | 90 | 90 | pass, at target |
| 2 | eyeshadow-try-on | 87 | 88 | pass |
| 3 | colored-contacts | 86 | 87 | pass |
| 4 | ai-eyelashes | 87 | 88 | pass |
| 5 | ai-eyebrows | 88 | 86 | pass |
| 6 | ai-lip-enhancement | 85 | 85 | pass, borderline |
| 7 | virtual-try-on-clothes | 89 | 87 | pass |
| 8 | ai-tattoo-generator | 86 | 88 | pass |
| 9 | ai-waist-slimming | 83 | 84 | fail |
| 10 | old-photo-restoration | 90 | 89 | pass |
| 11 | face-blur | 84 | 83 | fail |
| 12 | merge-portraits | 82 | 86 | pass |
| 13 | cartoon-yourself | 90 | 90 | pass, at target |
| 14 | face-filters | 87 | 89 | pass |
| 15 | facial-expression-changer | 79 | 85 | pass, borderline |
| 16 | age-gender-swap | 83 | 89 | pass |
| 17 | ai-face-swap | 84 | 89 | pass |
| 18 | square-face-filter | 79 | 86 | pass |
| 19 | big-head-effect | 82 | 88 | pass |
| 20 | halloween-mask | 89 | 86 | pass |
| 21 | pregnant-filter | 76 | 84 | fail |
| 22 | birthday-image-generator | 84 | 88 | pass |
| 23 | ai-fortune-teller | 87 | 88 | pass |
| 24 | elf-name-generator | 86 | 88 | pass |

## What round 1 asked for and is truly fixed

- G1 (first free vs first two free): fixed everywhere. All 12 makeup "Is it free?" answers and the merge-portraits banner now say first two.
- G2 (rhetorical question hero openers): fixed on all fun heroes. Left over: ai-lip-enhancement use case 1 ("Planning a shoot or a profile photo?") and eyelashes banner ("Need to compare more?").
- G3 (stacked fragment howToIntros): fixed, with one new near-fragment: waist "You wear the piece, and the preview shows what tailoring could change." is fine, and merge-portraits "Two photos, two people who agree, one shared picture." is still a parallel triplet (see merge fix).
- G4 (padded FAQ tails): fixed in most fun privacy and consent answers. Still present: face-filters FAQ 4, halloween FAQ 1, 3 and 4, face-swap FAQ 5, fortune use case 0.
- G6 (fragment featuresHeadings): fixed.
- H1 length and ai-fortune-teller, age-gender, face-swap H1s: fixed.
- Pregnant-filter now says what is added (a joke costume belly). Face-blur no longer promises "nothing that gives it away".
- Not truly fixed (reworded only): "X, not Y" remains in virtual-try-on-clothes story 1 ("You decide on the cut, not on the model") and the group of "How accurate" FAQs. Honest limit repeated in waist and pregnant.

## New defects that appear across many tools (batch fixes)

### N1. Verbatim privacy sentence on 11 fun pages
"We use your photo to make your [noun]. Save the finished image first, then delete your upload from your account whenever you like." is word for word on cartoon, face-filters, expression, age-gender, square, big-head, halloween, pregnant, birthday, fortune and elf. Identical FAQ text across 11 URLs reads copy-pasted and counts as duplicated FAQ (criterion 11). Vary the second half per tool:

| Tool | FAQ 5 answer |
|---|---|
| cartoon-yourself | `Your photo is used to draw your cartoon. Download the finished image first, then delete your upload from your account whenever you like.` (keep) |
| face-filters | `The photo is used to build your filtered portrait. Once you have downloaded the version you like, you can delete the upload from your account.` |
| facial-expression-changer | `Your photo is used to change the expression and nothing else. Download the new version first, then delete the original upload if you want it gone.` |
| age-gender-swap | `Your photo is the base for your fictional character. Download the character you want, then remove the upload from your account.` |
| square-face-filter | `Your photo is used to draw the square-jaw caricature. Save the result you like, then delete the upload whenever you want.` |
| big-head-effect | `Your photo is used to draw the big-head caricature. Download it first, then you can delete the upload from your account.` |
| halloween-mask | `Your photo is used for the Halloween preview. Download the look you like, then delete the upload from your account.` |
| pregnant-filter | `Your photo is used to add the costume belly. Download the result first, then delete the upload from your account.` |
| birthday-image-generator | `Your photo is used to build the card around it. Download the card first, then delete the upload from your account.` |
| ai-fortune-teller | `Your photo is used to make your card. Download it first, then delete the upload from your account whenever you like.` |
| elf-name-generator | `Your photo is used to build your elf portrait. Download the image and the name first, then delete the upload.` |

### N2. Consent answer is near-identical on 8 fun pages
"Only with that adult's permission. Use photos of yourself or of adults who agree, and never upload photos of children, since the tool is for adults aged 18 and over." appears with tiny edits on face-filters, expression, halloween, elf, square, big-head, pregnant, fortune. Keep the rule once per page but change the lead sentence to the tool's situation, for example expression: `Only if that adult says yes first. Changing someone's smile is personal, so show them the result before it goes anywhere.` Then one clause: `Adults aged 18 and over only, never children.`

### N3. "Is it free?" skeleton and price repeated four times per page
Every page states first two free in hero, banner title, banner body and the FAQ. The FAQ also repeats the $10, 200 credits, 40 results math that the banner already gives. Fix: in each fun "Is it free?" answer keep `Yes, your first two results are free. A new account starts with 10 credits and each X uses 5.` and delete the third sentence (the $10 plan sentence). The makeup versions end with the same sentence "After that you can add credits from the pricing page whenever you want more." on 11 pages. Replace it per tool with a different, tool specific close, for example lip: `A third shade is 5 more credits.` eyeshadow: `A third palette look is 5 more credits.` and so on.

### N4. Same skeleton in the "How accurate" FAQ (7 makeup tools)
"It is a visual guess/preview/idea, not a ..." opens lip, eyeshadow, contacts, lashes, brows, waist, tattoo. Keep the honest limit but change the opening on at least four, for example brows: `Treat it as a sketch of the shape, since real results depend on your hair growth and your brow artist.` lashes: `Real lashes depend on your natural length, curl and the products used, so use the preview to choose a direction.` waist: `A real tailor takes measurements, and this preview does not.`

## Per tool: scores under 90, exact lines and replacement text

### face-blur (83, fail)
Problems: title and body claim a result the tool admits it cannot deliver; zoom-in advice repeated three times; one use case overclaims; one title is a chore.
- `stories[0].title` "A close-up face gets a blur you can trust at a glance." (contradicts "can miss a face" and "check each person") ->
  `A close-up face gets a strong, soft-edged blur.`
- `stories[1].body` -> `Wider scenes hide faces in the background, in mirrors and behind your main subject. The tool looks for every visible face, and you scan the result for any it missed. One missed face in the corner is the one people notice.` (delete "Zoom in on the corners.")
- `stories[2].title` "You check the blurred image yourself before you post it." (a chore, not a benefit) -> `The blur hides faces, and captions and context still count.`
- `stories[2].body`: delete the last sentence "Zoom in on the corners before you post."
- `useCases[0].body` ("are covered", "skip the privacy question" overclaim) ->
  `Blur the faces in a street scene or event shot, then share your own moment. Passersby and kids in the background are blurred too, though you should check the corners for any it missed. You keep the moment and share less of everyone else.`
- `useCases[1].body` (34 words) -> append `, then check the result before you post`: `Blur their face before the photo goes online. They stay in the memory, you keep the picture, and nobody is exposed against their wishes. Ask first when you can, and blur when you cannot, then check the result before you post.`

### ai-waist-slimming (84, fail)
Problems: "A tailor can still tell you what is realistic" appears in three places (story 1, story 2, use case 0); "body unchanged" idea still in step 2, featuresHeading, story 0 points, story 2 points, FAQ 0 and hero; filler FAQ tail; "conversation starter" repeated from the tattoo page.
- `stories[1].body`: delete the last sentence "A tailor can still tell you what is realistic."
- `useCases[0].body` -> `Preview the neater fit on your own photo before you pay a tailor. If the change looks small, keep the money. If it looks great, book the fitting and take the picture with you.`
- `stories[0].points[1]` "Body unchanged" -> `Cleaner fit`
- `stories[2].points[1]` "Garment only" -> `Same photo`
- FAQ 2 answer: delete the last sentence "The whole process is a few minutes of waiting."
- FAQ 4 last sentence "Use the preview as a conversation starter about how a garment could fit." -> `Show it to a tailor and ask what is realistic.`

### pregnant-filter (84, fail)
Problems: story 1 body only restates its title; story 2 claims a side by side layout the page may not show; "keep it among people in on it" is said in hero, howToIntro, step 3, story 2, two use cases and ideasHeading.
- `howToIntro` (repeats step 3) -> `Upload a photo of a clothed adult, then pick who gets to see it.`
- `stories[1].title` -> `Everything except the costume belly stays as uploaded.` and `body` -> `The room, the outfit and the light are not touched. The result is not a realistic or medical image, so it stays a gag between friends who already know the truth.`
- `stories[2].body` -> `Keep the original next to the joke version, so the prank is easy to explain. It works best on a friend who asked for it, and the effect stays silly rather than believable.`
- `useCases[0].body` -> `Ask first, then send them their own fictional costume photo. They get the joke, and you both get a laugh you agreed to in advance. Send it in private so nobody outside the joke takes it seriously.`
- `useCases[1].body` -> `Use it as a prop shot for a party where everyone knows it is a costume. Share it in the event chat with a caption that says so, and let the guests add their own.`

### ai-lip-enhancement (85, borderline)
Problems: the same filler sentence added to two stories; a rhetorical question; redundant FAQ closer.
- `stories[1].body`: delete "Skip the guesswork before you buy a gloss."
- `stories[2].body`: delete "Skip the guesswork before you buy."
- `useCases[1].body` ("Planning a shoot or a profile photo?") -> `Before a shoot or a profile photo, see how gloss reads on camera. You will know whether to wear it or keep your lips matte, and you can show the picture to whoever does your makeup. One preview is enough to settle it.`
- FAQ 3 answer: delete "Anything permanent is a decision for a professional, not a photo tool." (the previous sentence says it).

### facial-expression-changer (85, borderline)
Problems: primary keyword only 4 uses; H1 promises a blink fix but the tool offers smile, surprise or wink; definitive claims ("stay as they were") that FAQ 3 softens.
- `h1` -> `Use a facial expression changer to save a stiff photo.`
- `heroLead` second sentence: "Only the expression changes, so it still looks like you in the same light." -> `The tool aims to change only the expression, so it still looks like you in the same light.`
- `stories[0].body`: "while your age, identity and lighting stay as they were" -> `while the tool aims to keep your age, identity and lighting as they were`
- `stories[1].body` first sentence -> `A facial expression changer can turn a plain photo into a reaction picture without a retake.` (adds the 5th keyword use) and "The background and the light do not change" -> `The background and the light are meant to stay put`.

### eyebrows (86)
- `stories[0].body`: delete "Seeing the line first is easier to trust."
- `stories[2].body` last sentence -> `A preview takes minutes, and growing a brow out takes weeks.`
- `useCases[1].body` ending -> `If you love it, you have a reason to wait. If you do not, you just saved yourself weeks.` (removes "a picture and not a guess")
- FAQ 5 last sentence -> `Download your favorite shape first, then delete the upload.`

### merge-portraits (86)
- `howToIntro` (triplet fragment) -> `Upload two adult portraits, check the result and download it.`
- `stories[0].body`: delete "A keepsake like that needs no travel."
- `stories[1].body`: delete the fragment "Different rooms, one frame."
- `useCases[0].body` (30 words, vague "means more than a card") -> `Combine two photos of a couple who live in different cities and frame the result. The gift takes a few minutes to make, and the couple get one picture of themselves together to keep on a shelf.`

### square-face-filter (86)
- `stories[1].body` (overlaps story 0, odd "prediction") -> `The jaw is reshaped in a cartoonish way that no one could mistake for a real photo. Nobody is being measured or judged, so the humor stays kind and the picture is easy to drop into any chat or story.`
- `useCases[0].body` (29 words, idea said twice) -> `Swap your avatar for a square-jaw version and see who comments first. Your normal photo is one tap away when the week ends. Post it on Monday and count the replies by Friday.`
- `useCases[1].body` (29 words, stacked triplet) -> `Keep one finished image saved on your phone and drop it into the chat when someone says something ridiculous. It lands faster than another sticker, and you can reuse it whenever the chat needs a laugh.`

### halloween-mask (86)
Problems: primary keyword only 4 uses; "before you buy/spend/shop" used six times on the page; filler FAQ tails.
- `stories[1].body`: "Because you stay recognizable under the design, you can judge" -> `With the Halloween mask filter you stay recognizable under the design, so you can judge` (5th use).
- `useCases[0].body` -> `Try all three looks on your own photo and buy only what the winner needs. Your first two previews are free, so you can compare two looks and shop with a clear plan.`
- `downloadBanner.title` -> `Two costume previews cost nothing.`
- FAQ 1: delete "Try a second style on the same photo if you want to compare costume ideas."
- FAQ 3: delete "They are made to be shared at a party or in a group chat without a warning label."
- FAQ 4: delete "A plain background and an even light on your face give the design a clean place to sit."

### eyebrows through others, lighter

### virtual-try-on-clothes (87)
- `stories[1].body` last sentence "You decide on the cut, not on the model in the product photo." -> `That shows you the cut on your own shoulders, which the product photo cannot.`
- `useCases[0].body` -> `Try the dress on your photo before you order. If the color or neckline looks off, you cancel before it ships and skip the return label. Check the neckline first, since it changes the look most.`
- `useCases[1].body` last sentence "Fewer returns start with one clear comparison." -> `Order the winner and skip the rest.`

### colored-contacts (87)
- `stories[0].body`: delete ", and take your time with it".
- `stories[1].body`: "Green is requested often and hard to picture." (unsupported "requested often") -> `Green is a hard color to picture without seeing it.`
- `useCases[0].title` -> `See the eye color you keep wondering about.`

### eyeshadow-try-on (88)
- `ideasIntro` (repeats the heading) -> `Two or three tones on one photo show you which one suits your eye color.`
- `stories[1].body` last sentence -> `Decide whether it feels right for dinner or a celebration, or like too much.`
- `featuresIntro` -> `One shade per result keeps the comparison fair, so you see which color works on your lids.`

### ai-eyelashes (88)
- `stories[0].body`: delete "You may find it is all you want."
- `stories[2].body`: "A full set is a statement, which is why a preview matters." -> `A full set is the boldest of the three.`
- `useCases[1].body` (32 words) -> append `If it looks great, show the picture to the person who applies them.`
- `downloadBanner.body`: "Need to compare more? The $10 monthly plan includes 200 credits, enough for 40 previews." -> `To compare more styles, the $10 monthly plan includes 200 credits, enough for 40 previews.`

### ai-tattoo-generator (88)
- `useCases[0].body` last sentence "A few minutes with a preview can change that conversation." -> `Bring the picture and the consultation starts from something real.`

### big-head-effect (88)
- `useCases[0].body` ("more reaction than a stock gif" is unsupported) -> `Caricature yourself for the farewell card or the team chat, and your colleagues will remember it. Keep the original so you can switch back for the serious photos on the same card.`
- `useCases[1].body` (30 words) -> add `Send it first thing in the morning.` at the end.

### birthday-image-generator (88)
- `stories[2].body`: delete "and save the card for when the moment is right."
- `useCases[1].body`: delete "Keep it light and let the picture do the talking."

### ai-fortune-teller (88)
- `heroLead` first sentence (starts with "Get" like the H1) -> `Add a small dose of mystery to a portrait card.`
- `useCases[0].body`: delete "Remember that none of them predict anything, which is part of the fun." (story 2 says it) and add `Vote for the best one.`
- FAQ 3: "Treat it like a cookie fortune." -> `Treat it as a party game.` (the cookie analogy already sits in story 1).

### elf-name-generator (88)
- `stories[0].body`: "tasteful pointed ears" -> `pointed ears`; `points[1]` "Tasteful pointed ears" -> `Pointed ears added`.
- `stories[1].body`: "ideal for games, stories and group chats" -> `a good fit for a game or a story`.
- FAQ 4 answer (broken sentence) -> `A sharp, evenly lit, front-facing photo with your face and hair visible. Avoid heavy filters, hats covering your hairline and small faces, so the elf keeps your familiar features.`

### face-filters (89)
- FAQ 4: delete "A plain background also helps the film or neon effect read clearly on your face."
- `useCases[1].body` (32 words): append `Pick a size the print shop supports.`

### age-gender-swap, ai-face-swap, old-photo-restoration (89)
- age-gender `stories[1].body`: "It is not a record of how you looked or will look." -> `It does not show how you looked or will look.`
- ai-face-swap `useCases[0].body` -> `Put your face into their costume photo, with their agreement, and see if the look works. It can save you from buying a costume that only looked good in your head. Both of you see the result before anyone spends a cent.`
- ai-face-swap `stories[2].body`: "a costume idea, a what-if scene or a prank that the other person asked for" -> `a costume idea or a what-if scene that the other person asked for`.
- ai-face-swap FAQ 5: delete "Photos taken in similar light give the biggest help."
- old-photo `useCases[0].body` last sentence "The wall copy is then easy to reprint." -> `You can reprint it any time.`

## Value-for-money and first-time clarity

A stranger can say what one result costs (5 credits), what the first costs (nothing, and the second too), and what $10 buys (200 credits, 40 results). Banners are clear and correct on all 24. The weak spot is repetition: the same facts appear four times per page. Pricing numbers are still typed by hand; lib/pricing.ts marks everything except 5 credits per result and 10 starter credits as PROPOSED, so confirm $10 for 200 credits against the live Polar product before launch.

## Remaining honest notes

- Primary keyword: no page above 7. facial-expression-changer and halloween-mask have 4 (fixes above).
- Short bodies (under 35 words): about 30 of 144 story and use-case bodies, nearly all second use cases of 29 to 34 words. Fixes above cover the worst; the rest are within 3 words of the line.
- No medical claim, identification claim, celebrity match or accuracy percentage found. The pregnant filter keeps its "never present as real" lines; keep them.
