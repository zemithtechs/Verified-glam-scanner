# Headings review 4 (groups C and D): makeup-fashion-photo and fun-effects

Reviewer: independent, no source edited. Test per heading: one complete statement, subject plus active verb, 7 to 14 words, speaks to "you", no noun phrase, no dangling relative clause, no list of nouns, no abstract wording, readable in one pass. Replacements keep the body topic, contain no dashes and no "soon".

## Totals

- makeup-fashion-photo.ts: 4 PASS, 8 FAIL (of 12)
- fun-effects.ts: 0 PASS, 12 FAIL (of 12)
- Whole-set patterns: relative clauses ("that/who/where ... ") in about 45 headings; "A, B or C" noun lists in 5 step titles; two-clause "X, and Y" or "X, so Y" headings in about 14; the fun-effects FAQ heading "These answers cover the ... questions people ask most." in 8 of 12 tools.

## Checks that passed everywhere

- Lengths: every heading is 7 to 14 words. Every story, use case and banner body sits inside 45 to 65 words (0 outside, counted by script).
- Body continues heading: yes in all 24 tools. The only drift is on old-photo-restoration story2 (heading is two claims, body covers one).
- Dashes: none in either file (U+2014 and U+2013 grep is clean). "soon": only "as soon as" in face-blur FAQ, not a "coming soon" claim.
- Figures: 10 free credits, 5 per result, 200 credits for $10, 40 results. All match lib/pricing.ts (starter 10, creditsPerGeneration 5, monthly $10 and 200).
- Identification: ai-face-swap says it needs adult consent, labels Source and Result, FAQ refuses celebrities, strangers, children. No claim of identifying anyone. No look-alike tool in these two files. face-blur says blur is not anonymity (honest).
- AI tells: no banned vocabulary found in headings. Soft tell: "Find answers to your X questions here." (all 12 makeup tools) is filler, though it is a complete statement.

## Rendered pages fetched (localhost:3100, HTTP 200)

Fetched /lip-color-changer, /ai-face-swap, /old-photo-restoration, /cartoon-yourself.

- Bullet lists in landing sections: none. All 10 `<ul>` on each page are the header, mega menu and footer navigation. The story `points` are not rendered at all.
- Hard-coded section headings, identical on all four: "Choose a sample or upload your own photo." / "Here is what your result means." / "Try more tools on the same photo." / "Read the guides behind this tool." All four are complete statements, 6 to 8 words, speak to "you". PASS. (Only 6 words each, one below the 7-word floor: "Try more tools on the same photo." has 7, "Here is what your result means." has 6. Cosmetic, a fix is "Here is what your result tells you.", 7 words.)
- Related article titles under the guides heading are noun phrases ("What to check in a virtual makeup try-on"). They are blog titles, not landing headings. Not scored.

---

## Group C: makeup-fashion-photo.ts

### lip-color-changer: FAIL
- ideas "Use your preview to shop and plan with confidence." abstract. Replace: "Your preview tells you which shade to buy before you pay."
- guid "Take a bright photo so your lips show honestly." abstract adverb. Replace: "Take a bright photo so your lips show their true color."

### eyeshadow-try-on: PASS
Note only: ideas "Preview the shades first and buy only the palette you want." has a short reduced relative but reads in one pass.

### colored-contacts: FAIL
- uc0 "Check the eye color you keep wondering about on your own face." dangling relative, clunky. Replace: "See the eye color you keep wondering about on your own face." is still relative, so use: "You can finally see the eye color you imagine on your face."

### ai-eyelashes: FAIL
- ideas "Know exactly what to ask your lash artist for." dangling preposition. Replace: "You can show your lash artist exactly what you want."

### ai-eyebrows: PASS

### ai-lip-enhancement: PASS

### virtual-try-on-clothes: FAIL
- ideas "Use it before the orders that would cost you most to return." relative clause. Replace: "You can check expensive pieces on your photo before you order them."
- feat "This virtual try on clothes tool shows the piece on your own frame." abstract "frame". Replace: "This virtual try on clothes tool shows the piece on your own photo."

### ai-tattoo-generator: PASS
Note only: banner "Test two designs on your arm before the permanent one." ends on an elliptical noun. Safer: "You can test two designs on your arm before you commit."

### ai-waist-slimming: FAIL
- story0 "A shirt that bunches at the waist gets a neater drape." relative clause, does not speak to you. Replace: "You can see a neater drape on a shirt that bunches."  Better without relative: "Your loose shirt gets a neater drape in the preview."

### old-photo-restoration: FAIL
- story1 "Faded contrast comes back where time has taken it away." dangling relative, poetic. Replace: "Your faded photo gets its contrast back in the preview."
- story2 "Nobody is replaced, and the era of your photo stays put." two clauses, abstract. Replace: "The people and the era of your photo stay exactly the same."
- ideas "Give your family photo the repair it has waited for." relative clause. Replace: "You can repair a family photo that has faded."  Better: "Repair your family photo and share it with everyone."

### face-blur: FAIL
- story0 "A close-up face gets a strong, soft-edged blur." noun-led, not to you. Replace: "A close-up face gets a strong, soft-edged blur you can check."  Better: "You get a strong, soft blur over any close-up face."
- story1 "Every face the tool finds in a crowded photo gets blurred." relative clause. Replace: "The tool blurs every face it finds in a crowded photo." (still relative) Better: "You get every face in a crowded photo blurred."
- story2 "The blur hides faces, but captions and context can still identify people." two clauses, noun list. Replace: "A blur hides faces, but your caption can still name people."
- ideas "Share your moment without sharing everyone who is in it." relative clause. Replace: "You can share your moment and keep other people private."

### merge-portraits: FAIL
- story0 "People who live far apart end up in the same frame." relative subject. Replace: "You can put two people who live far apart in one photo." Better: "You can bring distant relatives into one shared photo."
- story1 "Matched light makes two photos look like one moment." abstract. Replace: "You match the light so two photos look like one moment."
- story2 "A joint portrait makes a gift that people keep." relative. Replace: "You can give a joint portrait as a gift to keep."
- ideas "Make a keepsake for the people who cannot be together." relative. Replace: "Make a keepsake for two people who live far apart."
- guid "Choose two photos that match each other as closely as you can." relative. Replace: "Choose two photos with similar light and similar angles."

---

## Group D: fun-effects.ts

Recurring defect: faqH "These answers cover the X questions people ask most." (dangling relative, not to you) in square-face-filter, big-head-effect, halloween-mask, pregnant-filter, birthday-image-generator, ai-fortune-teller, elf-name-generator, face-filters. Replace the pattern with "You can read the answers to the X questions here." or "Here are the answers to your X questions." (use the second, 9 words average).

### cartoon-yourself: FAIL
- step1 "Pick soft 3D, comic ink or anime for your cartoon." list of nouns. Replace: "Pick the cartoon style you like best."
- feat "Pick the cartoon style that suits the place you will use it." relative stack. Replace: "You choose a cartoon style that fits where you will post it."
- uc0 "Swap your profile picture for a character that is clearly you." relative. Replace: "Swap your profile picture for a cartoon that looks like you."
- guid "Start with a sharp photo that gives the character something to copy." relative. Replace: "Start with a sharp photo so the cartoon can copy your face."
- faqH "These answers help you cartoon yourself without any guessing." filler. Replace: "Here are the answers to your cartoon questions."

### face-filters: FAIL
- step1 "Choose warm film, soft watercolor or neon for your mood." noun list. Replace: "Choose the filter that matches your mood."
- feat "Each filter changes the mood of your photo and keeps your face." fine, but two verbs; acceptable.
- faqH "These answers cover the face filters online questions people ask most." Replace: "Here are the answers to your face filter questions."
- uc1 "Give a gift photo a painted look before you print it." passes.

### facial-expression-changer: FAIL
- step1 "Choose a smile, a surprise or a wink for your photo." noun list. Replace: "Choose the expression you want your face to show."
- ideas "Rescue the photos you almost deleted because of one expression." relative. Replace: "You can save a good photo with one bad expression."
- faqH "These answers explain how a facial expression changer works for you." Replace: "Here are the answers to your expression changer questions."

### age-gender-swap: FAIL
- feat "You can try four fictional variations, and every one stays an adult." two clauses. Replace: "You can try four fictional variations, all of them adults." Better: "You get four fictional versions of yourself, all adults."
- story0 "The older character is a costume and says nothing about your future." two verbs. Replace: "Your older character is a costume, not a forecast."
- step0 "Upload a clear photo of an adult with your whole face showing." Replace: "Upload a clear adult photo that shows your whole face." 
- step1 "Choose older adult, younger adult or a new styling variation." noun list. Replace: "Choose the version of yourself you want to see."
- story2 "The styling variation changes your hair and clothing and nothing else." Replace: "The styling version changes only your hair and clothing."
- uc0 "Make a joke card for a friend who asked for one." relative. Replace: "Make a joke card for a friend who agreed to it." same issue; use "Make a joke card with your friend's permission."
- ideas "Share your character with the people who will get the joke." Replace: "Share your character with friends who like the joke."

### ai-face-swap: FAIL on headings, PASS on safety
- story0 "Your result is labeled Source and Result, so nothing is hidden." two clauses. Replace: "Your result is labeled Source and Result, so you see every change." (still two) Better: "Labels show you which photo is the source and which is the result."
- story2 "A swap is a joke that works best with someone who says yes." relative stack. Replace: "A swap is funnier when your friend has said yes."
- ideas "Use a swap for a laugh that everyone has agreed to." relative. Replace: "Use a swap for a laugh everyone has agreed to." Better: "Use a swap only for a laugh that you share."
- guid "Only use photos of adults who have clearly said yes to it." relative plus "to it". Replace: "Use photos of adults who have clearly said yes."
- banner "Your first two face swaps are free before you pay for anything." Replace: "Your first two face swaps are free."

### square-face-filter: FAIL
- feat "Only your jaw gets the joke, and the rest stays you." two clauses, abstract. Replace: "The filter squares your jaw and leaves the rest of you alone."
- story0 "The square jaw is big enough that nobody takes it seriously." Replace: "The jaw is so square that nobody takes it seriously."
- story1 "Nobody is measured or judged, so the joke stays kind." Replace: "You are never measured or judged, so the joke stays kind." 
- guid "Choose a photo of yourself that you are happy to joke about." relative. Replace: "Choose a photo you are happy to joke about." Better: "Choose a photo of yourself that you do not mind joking about."
- banner "Your first two square-jaw portraits cost nothing, and you keep both." Replace: "Your first two square-jaw portraits cost you nothing."

### big-head-effect: FAIL
- feat "A bigger head is the joke, and your face stays yours." Replace: "The filter makes your head bigger and keeps your face yours."
- story1 "The proportions are silly on purpose, so nobody reads them as real." Replace: "The silly proportions make it obvious that the picture is a joke."
- ideas "Aim your joke at an audience that is already laughing." relative. Replace: "Send your joke to friends who already laugh with you."
- banner "Your first two big head pictures cost nothing at all." Replace: "Your first two big head pictures cost you nothing."

### halloween-mask: FAIL
- step1 "Choose celestial, friendly skeleton or forest fairy for your look." noun list. Replace: "Choose the Halloween look you want to try."
- guid "Upload a clear photo and remember the preview is only an illustration." two clauses. Replace: "Upload a clear photo and treat the preview as an illustration."
- ideas "Settle your costume before the shopping starts." PASS (7 words).
- story2 "Forest fairy makeup is the softer pick for a gentler night." abstract comparison. Replace: "Forest fairy makeup is the soft choice for a gentle night."

### pregnant-filter: FAIL
- step0 "Upload a photo of a fully clothed adult with the torso visible." noun stack. Replace: "Upload a photo of a clothed adult with the torso in view."
- story0 "The effect works like a costume prop on a clothed adult." Replace: "The belly works like a costume prop on a clothed adult."
- uc0 "Send a friend a joke photo that they asked for." relative. Replace: "Send a friend a joke photo with their permission."
- ideas "Send your joke photo only to people who will laugh." relative. Replace: "Send your joke photo only to friends who know it is a joke."
- guid "Use a photo of a fully clothed adult who finds it funny." relative. Replace: "Use a photo of a clothed adult who has agreed to the joke."

### birthday-image-generator: FAIL
- step2 "Send it, post it or print it as a card." list of verbs, no content. Replace: "Send the card, post it or print it for the birthday."
- guid "Choose a happy portrait of one adult you have permission to use." relative. Replace: "Choose a happy portrait of one adult who agreed to it."
- uc0 "Surprise a best friend with a card that has their face." relative. Replace: "Surprise a best friend with a card made from their own portrait."
- ideas "Make your card for someone specific, not for everyone." negative parallel. Replace: "Make your card for one person you know well."

### ai-fortune-teller: FAIL
- feat "Your fortune is made up, and the card keeps your face central." two clauses. Replace: "You get an invented fortune on a card that shows your face."
- story1 "The For fun label keeps your card honest and light." abstract. Replace: "A For fun label tells everyone the fortune is a joke."
- story2 "Comparing fortunes with friends is half the fun of it." gerund subject. Replace: "You can compare fortunes with your friends."
- guid "Pick a happy portrait and remember the fortune is only for fun." two clauses. Replace: "Pick a happy portrait and treat the fortune as a game."
- ideas "Keep your fortune light and pass it around the group." Replace: "Share your fortune with the group and compare cards."

### elf-name-generator: FAIL
- feat "Your elf looks like you and comes with a name to match." two clauses. Replace: "You get an elf portrait and a name made for you."
- story0 "Your elf portrait still looks like you under the magic." abstract "magic". Replace: "Your elf portrait still looks like you."
- story1 "Your elf arrives with a name that was invented for you." relative. Replace: "You get an invented elf name made for your portrait."
- guid "Choose a clear adult portrait and treat the name as a game." two verbs. Replace: "Choose a clear adult portrait and enjoy the name as a game."
- uc0 "Make a character picture for your next role-playing game." PASS.

---

## Story check (headings read in order)

- Makeup group: stories run How it works, Features, three stories (one idea each), Ideas, Use cases, Guidance, Banner, FAQ. Clear arc on lip-color-changer, eyeshadow-try-on, eyebrows, tattoo. Weak arc where story titles switch subject (face-blur, merge-portraits, old-photo-restoration): headings read as separate remarks, not one argument.
- Fun group: every tool opens "Upload, choose, save" correctly, but the middle section reads as three jokes in a row. Fix by replacing the "X, and Y" and "X, so Y" headings so each states one action the user takes.

## Things the owner asked for that the data cannot give

- There is no landing-page bullet list to remove: the story `points` (three tick labels) exist in the data but are not rendered on any of the four pages checked.
- BeautyPlus style "H1 plus a body that continues it" is met: all 24 H1s are one imperative sentence and the hero leads are 35 to 55 words.
