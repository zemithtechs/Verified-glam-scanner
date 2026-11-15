# Copy review B: makeup-fashion-photo.ts and fun-effects.ts

Reviewer: independent, strict. No source file was edited. Rubric: STYLE_GUIDE section 8. Pass is 85 or more with no hard fail.
Automated checks run over both files: dashes (none found, U+2014 and U+2013 clean), banned words, title length and full stop, body length, primary keyword counts and placements, duplicate sentences inside a page. Prices checked against lib/pricing.ts: 10 starter credits, 5 per result, $10 for 200 credits, 40 results. Every number on every page is correct. No hard fail was found in any tool, so every fail below is a score under 85.

## Scores

| # | Tool (slug) | Score | Result |
|---|---|---|---|
| 1 | lip-color-changer | 90 | pass |
| 2 | eyeshadow-try-on | 87 | pass |
| 3 | colored-contacts | 86 | pass |
| 4 | ai-eyelashes | 87 | pass |
| 5 | ai-eyebrows | 88 | pass |
| 6 | ai-lip-enhancement | 85 | pass (borderline) |
| 7 | virtual-try-on-clothes | 89 | pass |
| 8 | ai-tattoo-generator | 86 | pass |
| 9 | ai-waist-slimming | 83 | fail |
| 10 | old-photo-restoration | 90 | pass |
| 11 | face-blur | 84 | fail |
| 12 | merge-portraits | 82 | fail |
| 13 | cartoon-yourself | 90 | pass |
| 14 | face-filters | 87 | pass |
| 15 | facial-expression-changer | 79 | fail |
| 16 | age-gender-swap | 83 | fail |
| 17 | ai-face-swap | 84 | fail |
| 18 | square-face-filter | 79 | fail |
| 19 | big-head-effect | 82 | fail |
| 20 | halloween-mask | 89 | pass |
| 21 | pregnant-filter | 76 | fail |
| 22 | birthday-image-generator | 84 | fail |
| 23 | ai-fortune-teller | 87 | pass |
| 24 | elf-name-generator | 86 | pass |

Totals: 14 pass, 10 fail. Makeup group 9 pass, 3 fail. Fun group 5 pass, 7 fail. Nobody reaches 95, because of the repeated defects in the next section.

## What went right (so the writer keeps it)

- All 24 pages have the full structure: 3 steps, 3 stories, 2 use cases, 1 guidance heading, 1 banner, 8 FAQ.
- Every step, story, use case and banner title is a full sentence with a full stop. Every story title is 6 to 12 words.
- No dashes, no accuracy percentages, no medical claims, no celebrity look-alike or identification claims. The face swap page explicitly refuses celebrities and strangers. The merge page says it does not blend faces or infer kinship.
- Primary keyword is in H1, meta title, hero (except merge-portraits), FAQ H2 and the first FAQ question on nearly every page. No page is above 7 uses.
- Prices are right. No page uses "a small number" or leaked developer text.
- Reading story titles in order tells a coherent story on 22 of 24 pages. Covering titles, bodies still point back to them except where noted below.

## Defects that repeat across many tools (fix these as a batch)

### G1. "First result free" contradicts "first two free" (all 12 makeup tools plus merge-portraits banner)
The hero and banner say the first two are free. The FAQ "Is X free?" answer on all 12 makeup tools starts "Your first result is free." and then says you can try two. A stranger cannot tell if it is one or two (rubric criterion 4).
Replace the first sentence of each makeup `faqs[2]` answer:
- Before: `Your first result is free. A new account starts with 10 credits and one result uses 5, so you can try two shades before paying.`
- After: `Yes, your first two results are free. A new account starts with 10 credits and one result uses 5.`
Keep the existing second sentence ("After that, $10 a month gives you 200 credits, which is 40 results."), swapping "results" for the tool noun.
Also merge-portraits `downloadBanner.title`: change "Your first joint portrait is free." to "Your first two joint portraits are free."

### G2. Hero opens with a rhetorical question (11 of 12 fun tools, plus colored-contacts and ai-lip-enhancement)
Guide 5.2 bans rhetorical question openers. Eleven fun heroes start the same way ("Want to...", "Curious how...", "Need a...", "Fancy a...", "Not sure which..."). It reads like a template. Statement rewrites are given per tool below.

### G3. Stacked short fragments in `howToIntro`
"Pick a photo, pick a style, save the picture." (cartoon), "Choose a photo, choose a mood, keep the one you like." (face-filters), "Upload, create, laugh, send." (big-head), "One photo, one tap, one very square you." (square), "Two photos, one confirmation, one labeled image." (face-swap), "One adult photo in, one fictional character out." (age-gender), "Show your face, draw a fortune, share the card." (fortune), "Upload, check every corner, then download." (face-blur), "Pick one photo, pick one look, then compare." (eyeshadow). Parallel triplets and fragments are the AI rhythm the guide warns about. Replace each with one plain sentence. Examples are in the per-tool sections.

### G4. Padded, duplicated FAQ tails
The privacy answer and the consent answer are almost the same on all 24 pages, and in fun-effects each ends with a tacked-on repeat of the sentence before it. Examples:
- "If you would rather not keep it on the tool, delete it as soon as you have your picture." (after "Save your finished cartoon first, then remove the upload.")
- "Adults only, and only photos you own or have permission to edit, please." (after the same rule was already stated two sentences earlier)
- "Viewing the page and reading the examples never costs credits." on a consent answer (ai-face-swap FAQ 3) and on most "Is it free?" answers
Rubric criterion 11 and 5 lose points. Fix: delete the last sentence of every fun-effects FAQ privacy and consent answer, and give each privacy answer one tool-specific noun. Suggested privacy form: `We use your photo to make your [cartoon]. Save the finished image first, then delete your upload from your account whenever you like.`

### G5. "X, not Y" and "cost" boilerplate
Counted patterns: "reads as lipstick and not paint", "not after a drawer of returns", "You buy one palette with a reason, not three with a hope", "You decide on the cut, not on the model", "you cancel before it ships, not after the return label", "It is a costume, not a forecast" (twice on age-gender-swap), "Sometimes the clothes need adjusting, not you". The phrase "It costs one result, 5 credits" (or "It costs 5 credits") appears in the use cases of 8 fun tools and sounds copy-pasted. Rewrites below remove the worst ones. For the cost phrase, vary it or drop it where the banner already states the math.

### G6. Fragment `featuresHeading` (fails the full-sentence rule, 2 points each)
Not complete thoughts: age-gender-swap, face-filters, square-face-filter, halloween-mask, ai-fortune-teller, elf-name-generator, pregnant-filter. Rewrites are below. Several `featuresIntro` lines are also noun fragments (square-face-filter, big-head-effect).

### G7. Numbers typed by hand in 24 banners and 192 FAQ answers
Prices are correct today. The guide (section 7) prefers building these sentences from `PRICING` so the copy cannot drift. lib/pricing.ts says every value except 5 credits per result and 10 starter credits is a PROPOSED value. Confirm $10 for 200 credits against the live Polar product before launch, or these pages carry a false number.

### G8. H1 length and colons
Makeup H1s all use a colon ("Lip color changer: try a lipstick shade..."). Guide 4.1 says no colons in titles, with a keyword-led H1 exception, so this is acceptable, only note it. H1 over 12 words: facial-expression-changer (14), age-gender-swap (14), ai-face-swap (13), ai-fortune-teller (13). Fixes below.

### G9. Not in these files
The guidance block body (`photoTip`, `expectation`) lives in lib/tool-page-content.ts, not here. It was not reviewed. Check there for repeated honest-limit text before launch.

---

## Failing tools: exact fixes (lowest score first)

### pregnant-filter (76, fail)
Main problem: a first-time visitor is never told what the tool does. "costume effect", "playful visual" and "a costume prop" never say a fake belly is added. Rubric 3 (specific) and 2 (body to title) lose most. The prank framing also contradicts itself ("a friend who agreed to be the victim").
Assumption to verify against the generation prompt: the effect is a costume belly.

- `h1` "Try the pregnant filter as a harmless joke costume photo." ->
  `Use the pregnant filter to add a joke belly to a costume photo.`
- `heroLead` ->
  `Make a gag photo for a friend who is in on the joke. The pregnant filter adds an obviously fictional costume belly to a photo of a fully clothed adult. It says nothing about anyone's real life and is not meant to fool people. Your first two results are free.`
- `howToIntro` "Upload a clothed adult photo, make the joke, share it with people who are in on it." ->
  `Upload a photo of a clothed adult and share the result only with people who are in on it.`
- `featuresHeading` "A costume prop for a gag photo, and nothing more." ->
  `The effect is a costume prop for one gag photo.`
- `stories[0].body` ->
  `Think of it as a padded costume for one photo. The person stays fully clothed and the belly looks obviously fictional. It is a joke and never a statement that anyone is expecting.`
- `stories[1].body` ->
  `Only the costume belly is added, so the room, the outfit and the light stay yours. It is not a realistic or medical image, which keeps it a gag between friends.`
- `useCases[0].title` "Prank a friend who agreed to be the victim." -> `Send a friend a joke photo they asked for.`
- `useCases[1].body` ->
  `Use it as a prop shot for a party where everyone knows it is a costume. Share it in the event chat with a caption that says so.`
- FAQ 0 answer: delete the last sentence "It is a joke effect and nothing else."
- FAQ 3 answer: delete the last sentence "It is a costume and nothing else, and should stay that way."
- FAQ 1 answer: delete the last sentence "Make sure everyone who sees it knows it is a costume joke." (the previous sentence already says it)
- Policy note: fake pregnancy images are easy to misuse as a deception. The copy already says "never present as real". Keep that line in the hero.

### facial-expression-changer (79, fail)
Problems: H1 has 14 words and "the wrong face" can read as an insult. A sentence is pasted twice inside one use-case body. A claim in `featuresIntro` is stronger than the FAQ admits.

- `h1` ->
  `Use a facial expression changer to rescue a photo with a blink.`
- `howToIntro` "Upload the photo, choose the expression, then compare." -> `Start with the photo you already have.`
- `featuresIntro` ->
  `The tool aims to keep your identity, your age and your lighting in place while one expression changes.`
- `useCases[0].body` (sentence repeated twice) ->
  `Keep the light, the place and the outfit, and change only the expression. It costs 5 credits, which is cheaper than a new shoot and a lot faster than booking one. Keep the original in case you prefer it.`
- `useCases[1].body` (ends with two stacked tips) ->
  `Preview a softer or warmer expression, then post whichever version feels more like you. Your original stays untouched, so nothing is lost. A good test is whether your friends would say it still looks like you.`
- FAQ 3 answer (repeats "If an edit looks off") ->
  `It is designed to look believable, but results vary by photo. Sharp, front-facing pictures with clear eyes and lips work best. If an edit looks off, try another expression or a better photo. Your original stays untouched, so you lose nothing by trying again.`
- FAQ 5 and FAQ 6: delete the final repeated sentence ("If you would rather not keep it there, ..." and "Adults only, and only photos you own or have permission to edit, please.").

### square-face-filter (79, fail)
Problems: one use-case body repeats a sentence word for word; another repeats its own idea twice. `featuresHeading` and `featuresIntro` are fragments. Stories 0 and 1 say the same thing (jaw only, obviously a joke).

- `heroLead` first sentence: "Want a picture that makes your friends groan and then laugh?" ->
  `Make a picture that makes your friends groan and then laugh.`
  Keep the rest.
- `howToIntro` "One photo, one tap, one very square you." -> `Upload a photo and wait a few minutes.`
- `featuresHeading` "A joke jaw, and everything else in the photo stays you." ->
  `Only the jaw gets the joke, and the rest of the photo stays you.`
- `featuresIntro` ->
  `The effect exaggerates one outline for laughs and keeps the picture familiar.`
- `useCases[0].body` ->
  `Swap your avatar for a square-jaw version and see who comments first. It costs 5 credits, and your normal photo is one tap away when the week ends. The original is never touched, so you lose nothing.`
- `useCases[1].body` (first sentence is pasted twice) ->
  `Keep one finished image saved and drop it in when someone says something ridiculous. It lands faster than another sticker, and it is always yours.`
- `stories[1]` overlaps story 0. Change the title to `Everyone can tell it is a joke, so it is safe to share.` and keep the body.
- FAQ 3: delete "It is a joke effect and nothing more, so do not use it to judge anyone's face." Keep "No. It is a joke effect and does not measure or judge your real face shape. For a photo-based look at your face shape, use the Face Shape Analyzer instead."
- FAQ 7: delete the last sentence "Adults only, and only photos you own or have permission to edit."

### big-head-effect (82, fail)
Problems: a use case whose body drifts from its title; a defensive line that mentions "medical or beauty" for no reason; an unsupported closing claim in a FAQ.

- `howToIntro` "Upload, create, laugh, send." -> `Upload a portrait and wait a few minutes.`
- `featuresIntro` ->
  `The portrait is obviously comic and keeps you easy to recognize at a glance.`
- `stories[1].body` ->
  `The exaggeration is cartoonish and says nothing about how anyone's head or face really looks. It is a joke about a photo you already like, drawn for a laugh and nothing else.`
- `useCases[0]` (title says team photo, body says yourself) ->
  title: `Add a big head to the farewell card or the team chat.`
  body: `Caricature yourself for the farewell card or the team chat. It costs 5 credits and gets more reaction than a stock gif. Keep the original so you can switch back for the serious photos on the same card.`
- FAQ 7: delete the last sentence "A plain image with a clear subject also keeps its quality when someone shares it onward." (no basis)
- FAQ 6: delete the last sentence (consent rule repeated).

### merge-portraits (82, fail)
Problems: hero lacks the primary keyword; banner says one free portrait while hero says two; vague use case; padded FAQ; same sentence used in banner and FAQ.

- `heroLead` ->
  `Some people are never in the same place at the same time. Upload two adult photos and this tool will merge portraits into one joint picture with matched light, with each person still recognizable. Your first two are free.`
- `downloadBanner.title` -> `Your first two joint portraits are free.`
- `useCases[1]` ->
  title: `Put two relatives in one family picture.`
  body: `Place two relatives from separate photos in one portrait to hang beside the others. Both must be adults who agreed, and the family should know it is a composite.`
- FAQ 1 answer: delete "The process takes a short wait and nothing more."
- FAQ 2 answer (duplicates banner sentence) ->
  `Yes, your first two portraits are free. After the 10 starter credits, $10 a month gives you 200 credits, which makes 40 portraits.`
- FAQ 6 answer: delete "Their agreement matters more than the picture." (filler)

### ai-waist-slimming (83, fail)
Problems: the honest limit "your body stays as it is" appears in the hero, step 2, `featuresHeading`, story 0, story 1 and FAQ 0 (guide 4.2 rule 8: say it once). "Not you" lines sound pointed. Last FAQ line is awkward. Note: visitors arriving from "ai waist slimming" meet a different product; the copy handles it honestly in FAQ 1, keep that.

- `heroLead` ->
  `Some clothes you own never hang quite right. Upload a photo of yourself wearing one and this garment fit preview shows a neater drape and cleaner seams on the garment. Your body size and shape stay exactly as they are, and your first two previews are free.`
- `featuresHeading` "The garment changes and you stay exactly as you are." -> `Only the clothing changes in your preview.`
- `featuresIntro` -> `The preview tidies the clothing and shows what careful tailoring could do for the same piece.`
- `stories[0].body` ->
  `Loose fabric at the waist or shoulders can make a good shirt feel wrong. The preview smooths the drape on the shirt you already own, so you can picture a simple tailoring fix before you pay for one.`
- `stories[1].body` ->
  `Tailoring happens in the seams and outline of a garment. The preview refines those lines so you can decide whether a tailor visit is worth the cost of the alteration.`
- `stories[2].body` ->
  `Put the original and tailored version side by side and look at how the clothing hangs. It is a visual guess, not a pattern or a measurement, so ask a tailor what is realistic. Take the picture to a fitting if you like what you see.`
- FAQ 6 answer (last two sentences) -> `Only if that person is an adult and agrees. This tool is for people aged 18 and over. Ask first, and keep any comments about the result kind.`

### age-gender-swap (83, fail)
Problems: H1 14 words; opening question; "a costume, not a forecast" appears in hero and story title; featuresHeading says "Four" while three stories are shown; one FAQ question is ungrammatical ("see yourself older"); FAQ consent answer ends with an empty sentence.

- `h1` -> `See a fictional you with the age and gender swap filter.`
- `heroLead` ->
  `See an older adult, a younger adult or a differently styled version of you. The age and gender swap filter turns one photo into a playful character, and every version stays an adult. Your first two results are free.`
- `howToIntro` "One adult photo in, one fictional character out." -> `Upload one adult photo and choose a variation.`
- `featuresHeading` -> `You can try four fictional variations, and every one is an adult.`
- `stories[0].title` -> `The older character is a costume and says nothing about your future.`
- FAQ 3 question -> `Can I see myself older and know how I will look?` Delete the last sentence of the answer ("It is entertainment, in the same spirit as a costume, and not a forecast of any kind.").
- FAQ 4 answer: delete "That applies to every adult photo you upload, not only to photos of other people."
- FAQ 5 answer: delete "The same goes for photos you own: a clear face gives the best character."
- Note: primary keyword is at 7 uses, the cap. Do not add more.

### ai-face-swap (84, fail)
Problems: H1 13 words; opening question; two use-case lines unclear ("a famous holiday scene", which could be read as using famous images); consent FAQ carries an unrelated pricing sentence; filler tails.

- `h1` -> `Try an AI face swap online with two willing adults.`
- `heroLead` ->
  `Put your face in a friend's holiday shot or a costume photo. This AI face swap online takes two photos and builds one labeled Source and Result image. Both people must be adults who agree, and the result is a creative swap and never a real photograph. Your first two results are free.`
- `howToIntro` "Two photos, one confirmation, one labeled image." -> `Upload two photos, confirm consent and download the labeled image.`
- `useCases[1].body` ->
  `Swap two friends, both of whom agreed, into a holiday photo from your own library and label it as a swap. Everyone laughs and nobody is fooled. Delete it from the chat if anyone in the picture asks.`
- FAQ 2 answer: delete the last sentence "Viewing the page and reading the examples never costs credits."
- FAQ 3 answer: delete "It is the same price whether you try it with a friend or on a second pair of photos."
- FAQ 4 answer: replace "it is a creative composition and proof of nothing" with `it is a creative composition, not evidence of anything`.
- FAQ 7 answer: delete "Everyone shown must be an adult who has agreed, no exceptions." (repeated)
- Primary keyword has only 4 uses, so add it once in a story body, for example story 0: `The finished AI face swap online is a labeled Source and Result composition, so anyone who sees it knows what changed.`

### birthday-image-generator (84, fail)
Problems: banner title makes a false comparison ("a stock card never was" free; many e-cards are free); duplicated sentences in a FAQ; awkward FAQ 0; only 4 primary uses.

- `downloadBanner.title` -> `Your first two birthday cards cost nothing.`
- `stories[0].body` (adds the primary keyword) ->
  `The birthday image generator puts a familiar face inside a finished greeting, which makes your message feel thoughtful, whether it goes to a best friend, a sister or yourself. A stock card cannot do that, and this one takes minutes.`
- `stories[1].body`: delete the last sentence "Nothing else is added, so the portrait stays in the middle."
- FAQ 0 answer: replace "It is a card, a simple one, and the portrait does the personal work." with `It is a simple card, and the portrait does the personal work.`
- FAQ 7 answer: delete the last sentence "The design is AI-made, so give it a quick look first." (said one sentence earlier)
- FAQ 6 answer: delete the last sentence "Adults only, and only photos you own or have permission to use."

### face-blur (84, fail)
Problems: `featuresHeading` promises "nothing that gives it away", which contradicts the page's own honest limit (not anonymity) and is an unsupported claim. Story titles 1 and 2 are requirements or user chores, not benefits. "useful" is a flagged word. An invented "thirty seconds".

- `featuresHeading` -> `You get one blurred image, with no original shown beside it.`
- `stories[1].title` -> `Group photos and street scenes get a blur on every face it finds.`
- `stories[2].title` -> `You check the blurred image yourself before you post it.`
- `stories[2].body`: delete the last sentence "Take thirty seconds before you post."
- `ideasIntro` -> `Blurring helps when a photo matters to you but not everyone in it agreed to be posted.`
- `howToIntro` -> `Upload a photo, check every corner of the result, then download it.`
- FAQ 2 first sentence (see G1).

---

## Passing tools below 90: concrete fixes (to lift them)

### ai-lip-enhancement (85)
- `heroLead` opening question -> `See what lip liner and gloss could do for your mouth before you buy either. Upload a clear photo and this lip enhancement preview adds a subtle makeup effect while keeping your expression and lip texture. It is makeup, not a procedure, and your first two previews are free.`
- `stories[2].body`: replace "that is a useful answer too" with `you have your answer`.
- FAQ 2 first sentence (G1).
- Keep FAQ 3 (no filler or surgery simulation). It is the best honest-limit answer in the group.

### colored-contacts (86)
- `heroLead` -> `See how green or blue eyes would look on you before you talk to an optician. Upload a clear photo and this colored contacts try on recolors your irises only, keeping your pupils and the light in your eyes. It is a cosmetic preview, and your first two are free.`
- `featuresHeading` "The new color sits in your eyes and the rest stays you." -> `Only your iris color changes, and the rest of the photo stays yours.`
- `stories[0].body` (two sentences say the same thing) -> `Hazel can look soft against many skin tones. Your pupils and the small reflections stay from the original, so the photo stays believable. Put it next to your natural color and judge for yourself.`
- `downloadBanner.title` "Try the eye color now and pay later if you want more." -> `Your first two eye color previews cost nothing.`
- FAQ 2 first sentence (G1).

### ai-tattoo-generator (86)
- `stories[0].body`: replace the last sentence with `Fine lines can fade at small sizes, so check the scale on your own arm.`
- `stories[1].body`: replace "Rethinking placement on a photo is free, and rethinking it later is not. Move on to another design if the first does not sit right." with `Moving a design on a photo takes a few minutes, and moving a tattoo on skin is much harder.` The word "free" is inaccurate, each preview costs 5 credits after the first two.
- FAQ 0 answer: replace "on visible adult forearm skin with realistic curvature and leaves you and your arm as they are" with `on the forearm in your photo, following the curve of your arm, and leaves the rest of the picture alone`.
- FAQ 2 first sentence (G1).

### elf-name-generator (86)
- `heroLead` -> `Find your elf name and see yourself in an enchanted forest. The elf name generator turns your portrait into an original fantasy elf with pointed ears and a freshly invented name. Your features stay, with a little magic added. Your first two results are free.`
- `featuresHeading` -> `Your elf looks like you and comes with a name to match.`
- "tasteful pointed ears" appears 3 times (hero, story 0, FAQ 0). Keep it once, in story 0.
- FAQ 3 answer: delete the last sentence "Treat it as a game and enjoy it."
- FAQ 6 answer: delete the last sentence (consent rule repeated).

### eyeshadow-try-on (87)
- `howToIntro` "Pick one photo, pick one look, then compare." -> `Upload one photo, choose one look and compare it with your original.`
- `ideasHeading` "Preview the palette before you pay for the palette." -> `Preview the shades before you buy a full palette.`
- `ideasIntro` (flagged "useful") -> `A preview pays off most when you are about to buy a whole palette.`
- `useCases[0].body` -> `Compare two or three tones on the same photo and see which one suits your eye color. You buy one palette for a reason you can point to and skip the two that never leave the drawer.`
- `stories[2].body`: replace "You risk one result, not a whole palette you never open." with `The cost is one result, 5 credits, instead of a palette you never open.`
- FAQ 2 first sentence (G1).

### ai-eyelashes (87)
- `featuresIntro` (unsupported claim: "avoids the clumped, obviously artificial finish") -> `Lashes are added along your own lash line, so the comparison is about the style alone.`
- `useCases[1].body`: delete the last sentence "A fuller set is easy to love in the catalog and hard to wear for hours." (no support)
- FAQ 2 first sentence (G1).

### face-filters (87)
- `h1` -> `Try face filters online and see your portrait as a film still or a painting.` (the cliche "in a new light" goes)
- `heroLead` -> `See your photo as a film still or a painted portrait. Try face filters online on your own picture: warm film, soft watercolor or neon. Each one changes the mood and keeps your face. Your first two results are free, so test more than one.`
- `howToIntro` -> `Upload a portrait, pick a mood and compare it with your original.`
- `featuresHeading` -> `Each filter changes the mood and keeps your face as it is.`
- Story 0 says "Your face is not reshaped" but FAQ 3 says "They aim to leave your face as it is". Align story 0: `The filter aims to leave your face as it is, and only the light and color around it change.`
- Story 1: "Because the original sits nearby" claims a layout the page may not show. Use `Because you can compare it with your original, you can see what changed.`
- FAQ 5 answer: delete "Only use pictures you are comfortable sharing with a tool." and the repeated final sentence.

### ai-fortune-teller (87)
- `h1` (13 words) -> `Get an AI fortune teller card with your photo and one upbeat line.` (12 words)
- `heroLead` -> `Get a small dose of mystery on a portrait card. The AI fortune teller adds one short, upbeat fortune labeled For fun. It never reads your face for real and cannot see your destiny, health, money or personality. Your first two cards are free.`
- `howToIntro` -> `Upload a portrait and draw a fortune.`
- `featuresHeading` -> `Your fortune is made up, and the card keeps your face central.`
- Primary keyword has only 4 uses. Add it in story 1 body: `The AI fortune teller labels every card, so no one mistakes it for advice.`
- FAQ 6 and FAQ 7: delete the repeated final sentences.

### eyebrow and others, lighter fixes
- ai-eyebrows (88): `stories[0].body` ->
  `A gentle arch can open the face and lift the eyes. The preview keeps single hairs visible, so you judge the line itself before any wax or tweezers touch a brow.`
  `stories[1].body` ->
  `Fuller brows are popular, and growing them takes patience. Preview the density first, with your eyes and skin untouched, and decide whether the wait is worth it.`
  FAQ 2 first sentence (G1).
- virtual-try-on-clothes (89): FAQ 0 question lacks the exact primary phrase, use `What is virtual try on clothes and how does it work?`; `stories[2].title` -> `A drape preview tells you yes or skip before you order.`; `useCases[0].body` -> `Try the dress on your photo before you order. If the color or neckline looks off, you cancel before it ships and skip the return label.`; FAQ 2 first sentence (G1).
- halloween-mask (89): `heroLead` -> `Choose your Halloween look before the party. The Halloween mask filter previews original makeup on your own photo: celestial glow, a friendly skeleton or a forest fairy. Nothing is scary or gory. Your first two previews are free, so you can choose before you shop.`; `featuresHeading` -> `Try three original looks on your face before the party.`; `useCases[0].body` -> `Try all three looks on your own photo and buy only what the winner needs. Your first two previews are free, so compare two before you spend a cent on supplies.`
- old-photo-restoration (90): `heroLead` change "while the people and the era stay yours" to `while the people and the era stay true`, and "this old photo restoration repairs" to `this old photo restoration tool repairs`; `useCases[0].body` delete "The clean copy lasts longer than a fading original, and" and keep `Keep the original scan in the archive as your backup.`; FAQ 2 first sentence (G1).
- lip-color-changer (90): `stories[0].body` "so it reads as lipstick and not paint" -> `so it looks like lipstick on your own lips`; `stories[2].body` "not after a drawer of returns" -> `before you pay for the tube`; FAQ 2 first sentence (G1).
- cartoon-yourself (90): `heroLead` first sentence -> `Cartoon yourself without learning to draw.`; `howToIntro` -> `Upload a photo, choose a style and save the picture.`; FAQ 0 question lacks the exact primary phrase, use `How do I cartoon yourself from a photo?`; delete the final sentence of FAQ 5 (privacy) and FAQ 6 (consent) per G4.

---

## Value-for-money and first-time visitor check

- Value: every page states 10 credits, 5 per result, first two free, $10 for 200 credits and 40 results in the banner. A stranger can tell the cost. The best banners tie it to the real alternative (colored-contacts, eyeshadow "two chances to be wrong for free instead of at the till", eyebrows, face-blur). The weakest are generic ("Two square portraits are on the house.").
- First-time clarity: weakest is pregnant-filter (never says what is added). Next is ai-waist-slimming, because the slug and secondary keyword promise body slimming and the page delivers a clothing preview. The copy says so plainly, so keep it, but consider changing the slug in a later pass.
- Titles in order tell a coherent story on 22 of 24 pages. Exceptions: pregnant-filter (vague middle blocks) and big-head-effect (use case title and body differ).
- Cover-the-title test: fails only on big-head-effect use case 0 and, partly, face-blur story 2 and face-blur use of "export".
