# Copy review round 3: lib/copy/fun-effects.ts (12 tools)

Reviewer: independent, source not edited. Rubric: STYLE_GUIDE section 8. Pass 85, target 90.

Script checks: no U+2014 or U+2013, no "soon", "coming" or "beta" wording, all story and use-case titles 6 to 12 words with a full stop, all story and use-case bodies 35 to 60 words, heroes 35 to 60 words. Numbers match lib/pricing.ts everywhere (10 starter credits, 5 per result, first two free, $10 for 200 credits, 40 results). No hard fail. No medical claim, no accuracy figure. Face swap never implies identifying a person (consent, labeled Source and Result, celebrity and stranger refused). No look-alike tool is in this file.

Result: 12 of 12 pass. 0 of 12 reach 90. Most of the gap is cross-page templating, not single-page defects.

## Score table

| # | Tool | R2 | R3 | Result |
|---|---|---|---|---|
| 1 | cartoon-yourself | 90 | 87 | pass |
| 2 | face-filters | 89 | 88 | pass |
| 3 | facial-expression-changer | 85 | 86 | pass |
| 4 | age-gender-swap | 89 | 89 | pass |
| 5 | ai-face-swap | 89 | 88 | pass |
| 6 | square-face-filter | 86 | 86 | pass |
| 7 | big-head-effect | 88 | 87 | pass |
| 8 | halloween-mask | 86 | 86 | pass |
| 9 | pregnant-filter | 84 | 85 | pass, borderline |
| 10 | birthday-image-generator | 88 | 83 | FAIL (duplicated sentence) |
| 11 | ai-fortune-teller | 88 | 87 | pass |
| 12 | elf-name-generator | 88 | 87 | pass |

Cartoon and birthday scored lower than round 2 because a fresh read found a broken keyword question (cartoon) and a sentence printed twice (birthday).

## Cross-tool findings (apply to all 12)

### X1. "Is it free?" FAQ and banner skeleton are identical on all 12 pages
FAQ: `Yes, your first two ... are free. A new account starts with 10 credits and each X uses 5. A third X is 5 more credits.` Banner body: `A new account starts with 10 credits and each X uses 5 ... the $10 monthly plan ... 200 credits, which is 40 X. Each X takes a few minutes.` A reader or crawler sees one template across 12 URLs. Keep the facts, change the wording and order per tool. Examples for the FAQ:
- cartoon: `Yes. Your first two cartoons cost nothing, and a third style is 5 credits.`
- face-filters: `Yes, two filtered portraits are free. After that each one is 5 credits.`
- expression: `Yes, your first two edits are free. Each one after that is 5 credits.`
- age-gender: `Yes, your first two characters are free. A third is 5 credits.`
- face swap: `Yes, two swaps are free on a new account. A third swap is 5 credits.`
- square: `Yes, your first two caricatures are free, and a third is 5 credits.`
- big head: `Yes, two big heads are free. Each one after that is 5 credits.`
- halloween: `Yes, you can preview two looks free. The third look is 5 credits.`
- pregnant: `Yes, two joke photos are free, and a third is 5 credits.`
- birthday: `Yes, two cards are free. Each card after that is 5 credits.`
- fortune: `Yes, two draws are free. Another draw is 5 credits.`
- elf: `Yes, two elves are free. Each extra elf and name is 5 credits.`

### X2. "Which photo works best?" answer is the same sentence on about 10 pages
"A sharp, evenly lit, front-facing photo/portrait ... Avoid heavy filters, sunglasses and small faces ..." appears on face-filters, age-gender, square, big-head, halloween, pregnant, birthday, fortune, elf and cartoon. Give each its own detail:
- cartoon FAQ 4 (keep, it is the origin).
- face-filters FAQ 5: `Soft, even light works best. Skip sunglasses, crowds and photos that already carry a strong filter, because the effect needs clean detail to build on.`
- age-gender FAQ 6: `Use a clear adult portrait with the whole face showing, and no sunglasses. A few familiar cues carry over, so a sharp photo makes a better character.`
- square FAQ 5: `Pick a photo where your jaw and hair are visible. Hats and hands over the face leave the caricature nothing to square off.`
- big-head FAQ 5: `Use a photo with your face and shoulders in view against a plain background, so the enlarged head has room.`
- halloween FAQ 5: `Show your whole face with no makeup filter on top, so the design has bare skin to sit on.`
- pregnant FAQ 6: `Use a fully clothed adult with the torso in view. A plain background and a standing pose give the effect a clean place to sit.`
- birthday FAQ 5: `Choose one person with a natural smile. Group shots and tiny faces leave the card without a clear star.`
- fortune FAQ 5: `A smiling, front-facing portrait gives the card the most character. A plain background keeps it tidy.`
- elf FAQ 5: `Show your face and hair, and skip hats that cover the hairline, so the elf keeps your features.`

### X3. Retry-costs-credits is hidden
Fortune ("so you can keep trying", "Draw again"), elf ("Run it again for a new name", said four times) and cartoon ("run a second style") invite repeat runs without saying each costs 5 credits. For value-for-money honesty, say it once per page. See per-tool fixes.

### X4. Square-face-filter and big-head-effect are the same page twice
Same three-story arc (obvious joke, safe to share, compare with original), same CTA "Make my caricature", same "joke profile picture / chat reaction" lines. Differentiate big-head by its own hook (size gap, bobblehead, a farewell card) and drop the "safe to share" story from square-face (see fixes).

## Per tool: lines and replacement text

### birthday-image-generator (83)
- `stories[2].body` prints one sentence twice. Replace with:
  `The card carries a plain Happy birthday message and nothing extra, which suits chats, stories or a printed note. Write your own words in the message you send with it.`
- `stories[0].body` (triplet and clause pile "best friend, a sister or yourself") ->
  `The birthday image generator puts a familiar face inside a finished greeting, so your message feels thoughtful before anyone reads a word. A stock card cannot do that, and this one takes minutes.`
- `stories[1].body`: delete "It also looks good on a phone screen." and change "polished rather than busy and prints cleanly" -> `polished and prints cleanly`.
- `useCases[0].body` ("Add one line of your own" repeats story 3 and FAQ 4) -> `Use a favorite photo of them and send it in the morning. It means more than a forwarded meme, and it takes a few minutes. Their face on the card is the whole gift.`
- FAQ 7 answer (clumsy "such as for a surprise they would welcome") -> `Yes, if that adult would be happy to be on a card, for example a surprise they would welcome. Adults only, never children.`

### cartoon-yourself (87)
- FAQ 1 question is ungrammatical: `How do I cartoon yourself from a photo?` -> `How do I cartoon myself from a photo?`
- `faqHeading` "Here are answers to your cartoon yourself questions." (filler opener, differs from the other 11 headings) -> `Your cartoon yourself questions, answered.`
- `stories[2].title` "...clean lines and big feeling." (vague) -> `Anime style redraws you with clean lines and big eyes.`
- `stories[2].body` first sentence (clumsy "in the style people want for an anime profile picture") -> `Your features, hair and mood guide the drawing, so the character keeps your look in an anime style made for profile pictures.`
- `useCases[0].body`: "and nobody else will have the same one" is unsupported, -> `It still reads as you at thumbnail size. Pick the style that stays clear when the picture shrinks to a small circle.` (add after: `Try a second style if the first one gets lost.` only if under 60 words.)
- Retry cost: `steps[1].body` last sentence -> `If the first one is not right, a second style on the same photo is another 5 credits.`

### face-filters (88)
- `useCases[0].body` last clause (vague) -> `Try two looks, post the one you like better, and save the other for a different platform.`
- `useCases[1].body`: delete the fragment "Pick a size the print shop supports." and use `Use a high-resolution original so the print looks sharp.`
- `stories[1].body` "Because you can compare it with your original, you can see what changed" -> `Next to your original, the change is easy to see, so you can choose which one to post.`
- Apply X1 and X2.

### facial-expression-changer (86)
- "aims" hedge appears in hero, featuresIntro, story 0 and FAQ 3 while `featuresHeading` says "leave the rest of the photo alone". Make the heading match: `Change the expression and keep the rest of the photo in place.` and drop "aims" from `featuresIntro` -> `The tool keeps your identity, your age and your lighting in view while one expression changes.` (keeps one honest hedge in hero and FAQ 3).
- `howToIntro` "Start with the photo you already have." (filler) -> `Upload a photo, pick an expression and compare it with the original.`
- `stories[1].body` first sentence is a run-on with an awkward tail -> `A facial expression changer turns a plain photo into a reaction picture without a retake, with wide eyes and an open mouth.`
- `useCases[0].body`: delete "Compare both before you post." (said in step 3, story 1 and FAQ 2) and "Keep the original too, in case you decide you prefer it."; end with `You still have the original if you change your mind.`
- `stories[0].title` repeats the H1's "stiff photo": -> `A gentle smile can soften a frozen face.`

### age-gender-swap (89)
- `useCases[0].body`: unpunctuated phrase -> `Add a caption such as "Guess who this is" and let your friends try before you reveal the original.`
- `stories[2].title` "works like a costume piece for your photo" echoes story 0 ("costume") -> `The styling variation changes hair and clothing, and nothing more.`
- `stories[1].title` "...is made for fun and stays an adult." -> `The younger character is a playful guess, always an adult.`
- Apply X1 and X2.

### ai-face-swap (88)
- `useCases[1].body` is ambiguous about how a two-photo tool "swaps two friends into a holiday photo" -> `Put one friend's face into another friend's holiday photo, with both agreeing, and label it as a swap. Everyone laughs and nobody is fooled. Delete it from the chat if anyone in the picture asks.`
- `stories[0].title` says "side by side" but body says "composition": -> `Your result is labeled Source and Result, so nothing is hidden.`
- `downloadBanner.title` "before you pay for one" is slightly off -> `Two swaps are free before you pay for anything.`
- Keep every consent line. No look-alike or identification wording present.

### square-face-filter (86)
- `h1` "see your very square caricature" is weak -> `Try the square face filter and see your square-jaw caricature.`
- `stories[1]` overlaps story 0 and its points include "Not a suggestion" (unclear). Replace title and body:
  title `Nobody is measured or judged, so the joke stays kind.`
  body `The jaw is reshaped in a cartoonish way no one could mistake for a real photo. That keeps the humor friendly, and the picture is easy to drop into any chat or story.`
  points `Cartoonish reshaping` / `Nobody is judged` / `Easy to share`.
- `useCases[0].body`: delete "The original photo is never changed." (said in story 2 and FAQ).
- FAQ 3: delete "Looking at the page is free, and" -> `Yes, your first two results are free. A new account starts with 10 credits and each caricature uses 5.`
- FAQ 5: delete "and an even light keeps the outline clean" (repeats "evenly lit").
- `guidanceHeading` -> `Choose a photo you are happy to joke about.`

### big-head-effect (87)
- Story 2 title and story 0 body both rest on "nobody reads it as real" and "bobblehead rather than a stranger". `stories[0].body` -> `The size gap makes the joke land in a second. The face stays recognizable, like a bobblehead of you. A plain background keeps every eye on the head.`
- `stories[2].body` repeats step 3, use case 1 and FAQ 4 ("reaction, joke profile picture, birthday greeting"). -> `Put the caricature next to your photo and choose the version that gets the bigger laugh. Then send it where it will land best.`
- `useCases[0].body` first clause restates its title -> `Use it on the farewell card or in the team chat, and colleagues will remember it. Keep the original so you can switch back for the serious photos, and pick the funnier one.`
- Apply X4: change the `cta` "Make my caricature" on story 1 to `Shrink the body, grow the head` is wrong (body is normal). Use `Make a bobblehead of me`.

### halloween-mask (86)
- "before you buy / shop / spend" is on H1, story 1, story 2, ideasHeading, ideasIntro, use case 0 and FAQ 7. Reduce:
  - `stories[1].body` -> `Playful skeleton lines appear on your face with no gore and nothing frightening. With the Halloween mask filter you stay recognizable under the design, so you can judge whether you would really wear it. If you hate it, you saved the cost of the face paint.`
  - `stories[2].body` last two sentences -> `Send the preview to the friends you are going with and settle the theme in one message. A softer look may also suit your coloring better than a scary one.`
  - `useCases[0].body` -> `Try all three looks on your own photo and buy only what the winner needs. Two previews are free, and a third look is 5 credits.`
  - `useCases[1].body` first sentence repeats story 2; -> `Post your fairy or skeleton preview in the group chat and see which look the others pick. It ends the long thread about who is dressing as what.`
- `heroLead` second to last sentence "Nothing is scary or gory." is fine; keep.
- FAQ 1: "The previews are creative illustrations, not instructions for real makeup." duplicates guidance heading and FAQ 8. Delete.

### pregnant-filter (85)
- "costume prop" is said in featuresHeading, story 0 title, story 0 body, points and use case 1. `featuresHeading` -> `One gag photo, with the scene left as it was.` and `stories[0].body` -> `The person stays fully clothed and the belly looks obviously fictional. It is a joke and never a statement that anyone is expecting, so keep that in mind when you share it.`
- `stories[1].body`: delete final sentence "Nothing else in the picture is changed." (repeats title).
- "in on it" repeated in hero, step 2, ideasHeading, ideasIntro, use case 1. `ideasHeading` -> `Send it only to people who will laugh.` and `ideasIntro` -> `This effect only works as a gag, so pick your audience first.`
- `downloadBanner.title` "and then you decide" is vague -> `Your first two joke photos are free.`
- Keep: "never presented as real", "no medical meaning", "do not deceive". Do not soften.

### ai-fortune-teller (87)
- `heroLead`: "Add a small dose of mystery to a portrait card. The AI fortune teller adds one short..." repeats "add". -> `Give your portrait a small dose of mystery. The AI fortune teller puts one short, upbeat fortune on a card labeled For fun.`
- `stories[2].body` duplicates use case 0 (everyone draws, compares). -> `A fortune card is a quick way to start a laugh in the group chat. Each friend gets a different line, so there is always something to read out loud. One result each takes a couple of minutes.`
- "Brighten" is used twice (story 1 body, use case 1 title). `useCases[1].title` -> `Send a friend a card made just for them.`
- Retry cost: `steps[1].body` "Draw again for a different one." -> `Another draw is 5 more credits.`; `stories[0].body` "so you can keep trying" -> `and another draw gives a different line.`
- FAQ 1 repeats "does not really read your face or your future" three times page-wide. Keep it in the hero and FAQ 4 only: FAQ 1 -> `It is a playful tool that writes a made-up fortune. This one creates a portrait card with one short upbeat line and a For fun label.`

### elf-name-generator (87)
- "Run it again" appears in step 1, story 1, use case 0 and FAQ 1 (each run costs 5 credits). `steps[1].body` -> `Start the tool and it builds a woodland portrait with an invented name. Another run is 5 more credits and gives a new name.` Remove "Run it again if you want another one." from story 1 and "Results change each time, so you can run it again." from FAQ 1.
- `useCases[1].body` ends in two fragments ("Keep it friendly. Ask first.") -> `With their permission, turn their photo into an elf and send it with a message. They get a name and a picture to keep, and you can swap names back and forth.`
- `heroLead` "Your features stay, with a little magic added." -> `Your features stay recognizable, with pointed ears added.`
- `ideasIntro` "An elf is more fun when it has a story, so choose where you will use it first." is fine; keep.

## Value-for-money and first-time reading

A first-time visitor can say what a result costs (5 credits), what is free (two results), and what $10 buys (200 credits, 40 results) on every page. Titles read as a coherent story on all 12 (headline benefit, three steps, three stories, two uses, honest limits, FAQ). The recurring weakness is that the price line is word for word the same on every page and the retry cost is hidden on three. Confirm $10 for 200 credits against the live Polar product, since pricing.ts marks it proposed.

## AI-tell scan

- Triplets: only light cases remain (birthday story 0, big-head story 2, halloween hero). Fixed above.
- "X, not Y": cartoon FAQ 3 ("an illustration inspired by you, not a copy"), age-gender story 0 points ("Not a prediction"), square story 1 points, birthday story 1. Acceptable as honest limits except the birthday one.
- Fragments: elf use case 1, square FAQ 3, face-filters use case 1. Fixed above.
- Filler: birthday "also looks good on a phone screen", cartoon FAQ heading, expression howToIntro. Fixed above.
- Duplicated sentence: birthday story 2 (hard defect). FAQ answers duplicated across tools: X1 and X2.
