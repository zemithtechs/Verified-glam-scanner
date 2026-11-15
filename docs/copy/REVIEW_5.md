# Copy Review 5 (independent copy edit and SEO review)

Reviewed 2026-11-14 from the rendered pages on http://localhost:3100 (HTML fetched, scripts and nav stripped). Source files untouched. Benchmark: https://www.beautyplus.com/personal-color-analysis re-opened the same day. This file uses no em or en dashes.

## 1. Verdict

The copy is now clean of the old AI tells. No em or en dashes on our pages, no banned vocabulary, no bullets on landing pages, no "soon", and the numbers are right everywhere (10 free credits, 5 per result, 200 monthly credits for 40 results, $10 monthly, yearly $60 only on /pricing).

What still fails is the owner's main complaint: **the pages read as one template filled with nouns.** Every page has the same 13-slot skeleton, the same 8 FAQ slots, the same banner sentence and, in the bottom half, the same sentences word for word. A first-time visitor who opens three pages will notice. A crawler will notice sooner.

Average score, 13 tool pages: **74.1**. Average across all 16 pages reviewed: **75.1**. Pass mark in STYLE_GUIDE is 85, so nothing passes yet.

## 2. Scores (0 to 100)

Naturalness / Uniqueness / Sales strength vs BeautyPlus. Total is the plain average.

| Page | Nat | Uniq | Sales | Total | Main reason |
|---|---|---|---|---|---|
| seasonal-color-palette | 80 | 72 | 74 | 75 | Good hero and gold/silver block. Never names the four seasons or the 12-season idea that BeautyPlus sells on. |
| face-shape-analyzer | 80 | 74 | 76 | 77 | Strong stylist and frames use cases. Shared photo-tip and "Read Your Report" blocks. |
| attractiveness-test | 82 | 74 | 78 | 78 | Best page. "How attractive am I" FAQ is right. Vague "box below" free answer. |
| skin-analysis | 78 | 72 | 70 | 73 | H2 and cards disagree. Heavy hedging ("does not diagnose" five times). |
| hairstyle-changer | 82 | 72 | 78 | 77 | Concrete (curly bob, pixie). Questions heading is awkward and stuffed. |
| ai-hair-color | 79 | 70 | 76 | 75 | Good specifics. Shared tips block. "Next Cut" guide heading on a color page. |
| lip-color-changer | 77 | 68 | 76 | 74 | Orphan line "It takes about five minutes." contradicts "a few minutes". Free FAQ has no numbers. |
| virtual-try-on-clothes | 78 | 70 | 74 | 74 | "Virtual Try on Clothes" is ungrammatical in six headings. Meta-comment "An honest limit like that...". |
| old-photo-restoration | 76 | 66 | 66 | 69 | No feature section at all (steps jump to use cases). Thinnest page. |
| face-blur | 80 | 70 | 72 | 74 | Honest and useful. Shared tips block and shared banner skeleton. |
| cartoon-yourself | 76 | 68 | 66 | 70 | Only one feature block; comic ink and anime get no block of their own. |
| ai-face-swap | 79 | 74 | 72 | 75 | Consent said in hero, step 2, guidance, FAQ and banner. Over-hedged, weak sell. |
| birthday-image-generator | 77 | 70 | 68 | 72 | "Skip the stock card" is good. FAQ answers are thin and generic. |
| / (home) | 84 | 88 | 80 | 84 | Most human page. Says "first result is free"; tool pages say first two. |
| /pricing | 82 | 90 | 78 | 83 | Clear. One H2 ("Pro Gives You More Credits Every Month") sits above a yearly toggle. |
| /category/hair-beard | 74 | 80 | 62 | 72 | Three tools listed with no description. "Tools still in development" line. |

## 3. Headings audit

### Title Case

Mostly correct. Articles and short prepositions are lowercase (a, an, the, to, of, in, for, by, so, or, and). "AI" and "3D" are kept. Findings:

| Heading | Problem | Fix |
|---|---|---|
| "See Your Skin up Close in a PhotoCurious..." (skin H1) | "up" lowercase. In "up close" it is an adverb, so it takes a capital. | "Up Close" |
| "You See Your Cheek up Close, Exactly as Your Photo Shows It." | Same. | "Up Close" |
| "Send a One-Of-A-Kind Cartoon to a Friend Who Agreed to It." | Hyphen parts must not cap "Of" and "A". | "One-of-a-Kind" |
| "Use Virtual Try on Clothes", "This Virtual Try on Clothes Tool", "Check How Virtual Try on Clothes Works" | "Try on" is a noun here; reads as a broken phrase and lacks the hyphen used in the tool name. | "Virtual Try-On Clothes" |
| CTA "Try Virtual Try-On: Clothes" | Colon, and it breaks the no-colon rule. | "Try Virtual Try-On Clothes" |
| "With" is capitalised everywhere ("Use Your Palette to Shop and Style With Confidence") | Fine under AP, but the owner's list says short prepositions stay lowercase. Decide once and document it. | Pick AP or Chicago in lib/title-case.ts |
| All H2 and H3 end with a full stop | Title Case plus full stop looks unusual and is not what BeautyPlus or news sites do. It also makes every heading a sentence, which is part of why the page reads as labelled paragraphs. | Keep the full stop only if the owner wants it; otherwise drop it. |

### Plain, complete statements

Pass on about 90 percent. Failures:

- Keyword-stuffed or broken: "You Will Find the Hairstyle Changer Online Questions People Ask Most Below." (12 words, nobody talks like this), "Use Virtual Try on Clothes to See the Outfit Before You Buy.", "Check How Virtual Try on Clothes Works Before You Upload Anything."
- Generic section heads that say nothing about the tool: "Run Another Face Report on the Same Portrait.", "Turn the Same Selfie Into Something Different.", "Fix Another Problem With the Photos You Already Have."
- The H2 above the use cases is sometimes about a different idea than the cards (skin-analysis: H2 is "You Learn What to Ask a Pharmacist Before You Buy Skincare." but card 01 is "You Can Read What Your Photo Shows About Your Skin.").
- Length is fine: 7 to 13 words, mostly 9 to 12. Bodies run 45 to 56 words in 94 of 94 measured feature and use-case blocks. That evenness is itself a template signal: every block is a 10-word sentence, then two or three sentences of 15 to 20 words, then a tacked-on short closer.

## 4. Repetition: exact repeats found

Measured across the 13 tool pages and compared with the BEFORE picture (`REPETITION_AUDIT.txt`: "your first result is free" 43x, "what happens to my photo" 36x, "a new account starts with" 31x, 12+ copies of the 200 credits sentence). The monetary wording and the privacy question are now varied, which is real progress. The repeats below remain.

### Body text copied word for word

| Sentence | Pages |
|---|---|
| "Use a sharp, well-lit portrait with the whole head in frame. Avoid a strong filter, deep shadow or anything covering the relevant feature." | 9 (seasonal, face-shape, attractiveness, skin, hairstyle, hair color, face blur, cartoon, birthday) |
| "This is a visual edit, not a promise of a real-world result. Compare the full before and after image before you use it as a reference." | 5 (hairstyle, hair color, lip, cartoon, face swap) |
| "Free AI beauty tools to analyze, restyle and try on your look." footer line | 16 (expected) |
| "Local preview. Uses the configured OpenAI account and may incur API charges. This app does not save your uploads or results to disk." and "Checking local generation service..." | 13 (see section 6, hard fail) |
| "Restored details are plausible interpretations, not verified history." vs FAQ "Restored details are a plausible guess, not verified history." | same page twice |
| Face-shape guide cards "How to Find Your Face Shape From a Photo", "What a Facial Symmetry Preview Can and Cannot Show", "Plan a Hair Change With a Photo Preview", each with identical blurb | 3 to 4 pages each |

### Section headings repeated verbatim

| Heading | Pages |
|---|---|
| "Pick a Straight-On Portrait With Even Light." | 3 (face-shape, attractiveness, skin) |
| "Read Your Report as One Opinion About One Photo." | 3 (face-shape, attractiveness, skin) |
| "Run Another Face Report on the Same Portrait." | 3 |
| "Read Our Guides to Understand Your Face Report." | 3 |
| "Turn the Same Selfie Into Something Different." | 3 (cartoon, face swap, birthday) |
| "Read Our Guides for More Fun Ideas With Your Selfie." | 3 |
| "Enjoy the Result as a Playful Picture, Not a Real Photo." | 3 |
| "Pick a Photo Where Your Face and Expression Are Clear." | 3 |
| "Choose a Photo That Shows Your Hairline and Jawline." / "See Your Preview as an Idea to Show Your Stylist." / "Try Other Hair and Beard Looks on Your Photo." / "Read Our Guides Before You Book Your Next Cut." | 2 each (hairstyle, hair color) |
| "Start With the Clearest Version of the Photo You Have." / "Check the Whole Image Before You Rely on the Result." / "Fix Another Problem With the Photos You Already Have." / "Read Our Guides on Caring for Your Photos." | 2 each (old photo, face blur) |

### Skeletons repeated

1. **H2 for steps:** "You Can [verb] ... in Three [adjective] Steps." on 13 of 13 pages.
2. **Use-case sub-line:** "[Tool] helps most right before [purchase or decision]." in seasonal ("A color season finder helps most right before a purchase."), face-shape, attractiveness ("The test helps most when..."), skin, lip, with "is worth the most before" in hairstyle, hair color, virtual try-on, cartoon.
3. **Banner (Your next step):** "[Your First Two X Cost You Nothing.] [New account / Every new account / Opening an account] [gives you / carries / begins with] 10 credits and [one X costs / uses / takes] 5, so [two ... are free]. [Want more? / For more, / For a long shopping list,] the $10 monthly plan [brings / covers / offers] 200 credits, enough for 40." Used on lip, old photo, face blur, virtual try-on, face swap, birthday, cartoon (7 pages, only nouns swapped). Headings: "Your First Two Lipstick Previews Cost You Nothing.", "Your First Two Outfit Tries Cost You Nothing.", "Your First Two Photo Restorations Cost You Nothing.", "Your First Two Blurred Photos Cost You Nothing."
4. **Hero lead:** hook question or situation, "Upload one photo and this [keyword] [verb]...", then "It is free to try" or "You can try it free" (13 of 13).
5. **Body shape:** sentence 1 restates the heading, sentence 2 adds "so you...", sentence 3 and 4 add a generic benefit. The last sentence is often filler that was added for length (list in section 5).

### FAQ repeats

- Every page asks the same 8 slots in the same order: what is it, how do I use it, is it free, how accurate or will it match, best photo, is my photo kept, someone else's photo, is it worth it. The wording changes, the order and the answers' structure do not.
- "Can I [make/use/check] a friend's / someone else's photo?" appears on 13 of 13 pages. Answers all say adult plus permission.
- "Is [tool] free?" appears on 13 of 13. Eight of the answers carry no numbers at all ("A paid plan only matters if you want more."). That wastes the single most important FAQ for a buyer.
- "What photo gives the best result?" appears on 10 of 13 in near-identical form.
- "Is it worth ...?" closes the FAQ on 5 pages (face-shape does not, attractiveness, skin, lip, birthday) with the same answer structure: "It is a quick way to...".

### Leftovers checked

- Bullets on landing pages: none rendered. Pricing has a feature list, which is fine.
- Em and en dashes: none on our pages.
- "Soon": none. Close call: the category page says "Tools still in development are clearly marked."
- Numbers: all correct. One inconsistency: home says "Your first result is free" while tool pages say the first two are free. $60 yearly appears only on /pricing.

## 5. Naturalness: lines that read as padding

Short closers that restate the benefit and add nothing: "Everyone in the family gets to enjoy it." (old photo), "Your wallet stays happier too." (lip), "That one habit saves both money and time." (try-on), "Your own photo makes the decision easier." (try-on), "That honest limit keeps everyone safer." (blur), "An honest limit like that is easier to plan around." (try-on, a meta comment about the copy), "It is also a friendly nudge for the people who forgot, and you get something nicer than a plain post." (birthday).

Unsupported generalities presented as fact: "Many people pay for the dye before they see the shade on their own face." (hair color), "Berry often looks harsh in the tube and flattering on the face." (lip), "It means more than a forwarded meme" (birthday).

## 6. Hard-fail and risk items

1. **Developer text on every tool page**: "Local preview. Uses the configured OpenAI account and may incur API charges. This app does not save your uploads or results to disk. Download before leaving." and "Checking local generation service..." This is the hard fail from STYLE_GUIDE section 8 (developer or local-preview text on a live page). It is a UI string, not part of the copy files, but a crawler and a visitor both read it.
2. Old photo restoration has no feature blocks and cartoon-yourself has one. Thin pages cannot compete with BeautyPlus's 4 to 5 blocks.
3. No social proof anywhere (BeautyPlus has three reviews and a "Why choose" card row). We have no reviews, so say something concrete instead (what is saved, what is deleted, what a result costs in cents).

## 7. Benchmark: BeautyPlus personal color analysis

What they do better, in sales terms:

- Name the product promise in the first block: "12 Color Palette Analysis", "Primary and Secondary" season. Searchers type "12 season color analysis" and "4 season vs 12 season". Our seasonal page never says how many seasons it uses or lists them. Their own FAQ on this gap has no answer text, so a real answer from us would be the only answer on the page.
- Four use-case cards each tied to one purchase (makeup, wardrobe, hair color, jewelry). Ours has two cards plus the jewelry block, so we are close, but the cards are hedged.
- A "Why use" block and three reviews.
- Same "Upload Image" button four times: weak. Ours vary ("See my palette", "Get my free result", "Find my colors"), which is better.

What we do better: honest limits, a clear price in plain numbers, no "99% accuracy", no brand stuffing, real-world decisions in the use cases (return a jacket, show the stylist). Their copy has typos ("Warm, Cool of Neutral") and AI phrases ("Elevate Your Style"). Ours does not.

Gap to close: sales strength. Our pages explain; they rarely make the visitor want to press the button now. Add one number the visitor can feel (cost per result: 40 results for $10 is 25 cents each) and one specific outcome per hero.

## 8. The 25 worst lines and rewrites

Rewrites keep the primary keyword, headings are 7 to 14 words, bodies are 45 to 65 words. Where a line is one sentence inside a longer body, the fix is for that sentence only.

**1. All tool pages, workspace notice (hard fail)**
Now: "Local preview. Uses the configured OpenAI account and may incur API charges. This app does not save your uploads or results to disk. Download before leaving."
Better: "Your photo is sent for processing and removed when you delete it. Download your result before you leave this page." (Confirm the storage claim with engineering before use.)

**2. lip-color-changer, Classic Red body**
Now: "...Your answer arrives in a few minutes, long before you ever reach the counter. It takes about five minutes."
Better body: "Red is the shade people hesitate over most. Try it on your own photo with your expression unchanged, then decide whether it feels confident or like a costume. The answer takes a few minutes and costs nothing, which beats finding out at the counter with a stranger's sample stick on your lip." (50 words)

**3. Nine pages, shared photo tip**
Now: "Use a sharp, well-lit portrait with the whole head in frame. Avoid a strong filter, deep shadow or anything covering the relevant feature."
Better, seasonal-color-palette: "Stand facing a window with no filter and none of the makeup you do not normally wear. A yellow lamp pulls your palette warm, and a shadow across the cheek can make your skin look a season darker."
Better, skin-analysis: "Wash your face, face a bright window and hold the camera level with your eyes. Shadows hide pores and fine lines, so the brighter and sharper the photo, the more your close-ups can show."
Better, birthday-image-generator: "Pick the photo where the birthday person is smiling at the camera and nobody else is in the frame. A group shot leaves the card without a clear star."
(Write one per page; do not reuse a sentence.)

**4. Five pages, shared disclaimer**
Now: "This is a visual edit, not a promise of a real-world result. Compare the full before and after image before you use it as a reference."
Better, ai-hair-color: "Real dye depends on the color you start with, so a dark base will not reach pastel pink in one visit. Take the preview to your colorist and ask what it would take to get there."
Better, cartoon-yourself: "A cartoon is an illustration, not a photo, so small details such as jewelry or a tattoo can shift. If a style feels off, run another one on the same picture."

**5. face-shape, attractiveness, skin: "Read Your Report as One Opinion About One Photo."**
Better, attractiveness-test: "Your Score Describes One Photo, Not Your Whole Face." (9 words)
Better, skin-analysis: "These Close-Ups Describe Your Photo, Not Your Skin Health." (9)
Better, face-shape-analyzer: "Treat Your Face Shape Label as a Starting Point." (9)

**6. Three pages: "Run Another Face Report on the Same Portrait."**
Better, face-shape-analyzer: "Check Your Facial Symmetry on the Same Portrait Next." (8)
Better, attractiveness-test: "Compare Your Score With a Face Shape Check." (8)
Better, skin-analysis: "Pair Your Close-Ups With a Face Beauty Analysis." (8)

**7. Three pages: "Turn the Same Selfie Into Something Different." and "Read Our Guides for More Fun Ideas With Your Selfie."**
Better, cartoon-yourself: "More Playful Effects to Try on Your Cartoon Photo." and "Guides for Getting a Cleaner Cartoon From Your Selfie."
Better, ai-face-swap: "Other Face Effects to Try With a Willing Friend." and "Guides to Swapping Faces Fairly and Safely."
Better, birthday-image-generator: "Other Party Tools That Use the Same Photo." and "Guides to Making Greetings Feel Personal."

**8. Banner skeleton on seven pages (old-photo-restoration)**
Now: "Your First Two Photo Restorations Cost You Nothing. Every new account carries 10 credits, and a restoration takes 5, so your first two photos are free. Got a shoebox of prints? The $10 monthly plan covers 200 credits."
Better heading: "Restore Two Photos Before You Spend Anything." (7)
Better body: "A new account starts with 10 credits and each restoration uses 5, so two photos are free. If a shoebox of prints is waiting, the $10 monthly plan gives you 200 credits, which is 40 restorations, about 25 cents each. Download every file, then print it or send it to family." (52 words)
Do the same by rewriting the angle per page: blur (event album), face swap (party), birthday (calendar of birthdays), try-on (cart), lip (shade shortlist), cartoon (group chat).

**9. Free FAQ with no numbers (old photo, blur, lip, try-on, swap, cartoon, birthday, face shape, attractiveness)**
Now (old photo): "Your first restorations cost nothing. A paid plan only matters for bigger batches."
Better: "Yes. A new account has 10 credits and one restoration uses 5, so your first two photos are free. After that, the $10 monthly plan gives you 200 credits, which is 40 restorations."
Now (face shape): "Pricing for further results is spelled out in the box below."
Better: "Yes. Your first two face shape results are free, and each one after that uses 5 credits."

**10. Friend-photo FAQ on 13 pages**
Now (lip): "Only if your friend is an adult and has said yes. Lips are personal, so show them the result first, before it goes near a group chat."
Better: keep the full consent answer on ai-face-swap only. Elsewhere replace the question with one that fits the tool: lip, "Can I compare two shades side by side?"; hair color, "Will the preview work with gray or dyed hair?"; skin, "Does makeup change the close-ups?"; old photo, "Can I restore a photo with a torn corner?"; blur, "Can I blur one face and leave the rest?" (Answer each only if the tool supports it. Consent can move to one site-wide line in the guidance block.)

**11. virtual-try-on-clothes, Drape body**
Now: "...Use it to say yes or skip, then still check the size guide. An honest limit like that is easier to plan around."
Better body: "Seeing how fabric falls helps you picture the finished outfit before you pay. The preview is a visual guess at drape, so it cannot confirm your size, stretch or real fit. Use it to say yes or skip, then check the retailer's size guide and return policy before you order." (50 words)

**12. Hero H1 template "Use X to Y." on seven pages (hairstyle-changer)**
Now: "Use This Hairstyle Changer Online to Try a New Cut on Your Own Photo."
Better: "See a New Haircut on Your Photo With the Hairstyle Changer Online" (12)
Lead better: "Walk into the salon knowing exactly what to ask for. Upload one photo and the hairstyle changer online shows a curly bob, soft layers, a pixie cut or a curtain fringe on your face, while your clothes and background stay put. Your first two previews are free." (46 words)

**13. virtual-try-on-clothes, H1 and H2s**
Now: "Use Virtual Try on Clothes to See the Outfit Before You Buy." and "This Virtual Try on Clothes Tool Shows the Piece on Your Own Photo."
Better: "See Any Outfit on Your Own Photo With Virtual Try-On Clothes" (11) and "Virtual Try-On Clothes Puts the Garment on You, Not a Model." (10)

**14. lip-color-changer, H2 sub-line**
Now: "Every lip color try on changes one thing, the color of your lips, so you judge the shade and nothing else."
Better: "Only your lip color changes, so you judge the shade and nothing else." Also remove "try on" noun.

**15. hairstyle-changer, FAQ heading**
Now: "You Will Find the Hairstyle Changer Online Questions People Ask Most Below."
Better: "Hairstyle Changer Online Questions, Answered Before You Book the Salon." (10)

**16. skin-analysis, Title Case and H2 mismatch**
Now: "Try AI Skin Analysis to See Your Skin up Close in a Photo" and "You Learn What to Ask a Pharmacist Before You Buy Skincare."
Better: "Try AI Skin Analysis to See Your Skin Up Close in a Photo" and "Use the Report to Plan Questions for a Pharmacist or Dermatologist." (12)

**17. cartoon-yourself, hyphenation and thin features**
Now: "Send a One-Of-A-Kind Cartoon to a Friend Who Agreed to It."
Better: "Send a One-of-a-Kind Cartoon to a Friend Who Agreed to It." Add two more feature blocks:
"Comic Ink Turns Your Photo Into a Bold Graphic Panel." Body: "Comic ink adds heavy outlines and flat shading, so your portrait looks like a panel from a graphic novel. Your hair, expression and outfit stay recognisable, and the style holds up well on a banner or a game avatar. Run it next to soft 3D and keep whichever one feels more like you." (50)
"Anime Gives You Big Eyes and a Clean, Stylised Look." Body similar, specific to anime profile pictures and the platform-rules note already in the FAQ.

**18. old-photo-restoration, missing feature section**
Add three blocks, for example:
"Scratches and Fading Disappear While the Faces Stay Yours." Body: "Old photo restoration repairs scratches, lifts faded contrast and softens blur without changing who is in the picture. A black and white print stays black and white. The result sits beside your original scan, so you can check every face before you print or share it with the family." (49)
"Your Scan Quality Decides How Much Detail Comes Back." Body about 600 dpi and flat light.
"You Keep Your Original and Get One Clean File to Share." Body about downloading the repaired file and keeping the scan as the record.

**19. home, price consistency**
Now: "Your first result is free. One result uses 5 credits, and Pro is $10 a month for 40 results."
Better: "Your first two results are free: a new account has 10 credits and one result uses 5. Pro is $10 a month for 40 results, about 25 cents each."

**20. category/hair-beard, vague and defensive**
Now: "Tools still in development are clearly marked, so you know which ones are open."
Better: "Every tool opens with an example result, so you see what you will get before you upload." (Only if true. If some tools are not live, hide those cards instead of describing them.) Also give each of AI Beard Removal, Hair Loss Simulation and AI Bald Filter a one-line description like the three popular tools have.

**21. face-shape and attractiveness, "box below" FAQ**
Now (attractiveness): "Yes, you can try it without paying, and looking through this page costs nothing. The credit details sit in the box under the questions, so you know what a second try would cost before you start one."
Better: "Yes. A new account has 10 credits and one test uses 5, so your first two photos are free. A third test costs 5 more credits, and the $10 monthly plan gives you 200."

**22. ai-face-swap, hero over-hedging**
Now: "...Both people must be adults who agree, and the result is a creative swap and never a real photograph. Try it free, with permission from both people."
Better lead: "Put your face in a friend's holiday shot or a costume photo. Upload two photos and get one labeled Source and Result image to laugh about. It is free to try, and both people just need to be adults who said yes." (44 words, adds one word to reach the 45 minimum: "to laugh about with the group chat")

**23. ai-hair-color, unsupported claim and heading**
Now: "Many people pay for the dye before they see the shade on their own face." and "Copper Hair Appears on Your Photo While Your Brows and Skin Stay."
Better: "A box of dye costs money before you see the shade on you." and "See Copper Hair on Your Own Face Before Any Dye Touches It." (12)

**24. birthday-image-generator, weak FAQ**
Now: "Yes, it takes little effort and gives a generic message a personal touch. Preview the card, and download it if it feels right. Give it a quick look before you send it, since the design is AI-made."
Better: "Yes, if the person would enjoy seeing their own face on a card. It takes a few minutes, costs 5 credits and your first two cards are free. Check the picture once before you send it, because the design is AI-made."

**25. seasonal-color-palette, missing the search hook**
Now: heading "Find Your Seasonal Color Palette From One Photo." and no mention of how many seasons.
Better added block: "Your Palette Names One of Four Seasons, Spring to Winter." (10) Body: "The tool reads your skin, hair and eye colors and places you in spring, summer, autumn or winter, then names six shades inside that season. It is a four-season system, so it will not split hairs between close neighbours. Use the six swatches as your shopping shortlist." (46)
Add FAQ: "What is the difference between 4-season and 12-season color analysis?" (BeautyPlus lists it and does not answer it.)

## 9. Priority fixes for the next pass

1. Remove or hide the developer notice and "Checking local generation service..." from the workspace.
2. Make the bottom half of every page unique: photo tips, disclaimer, "Read your report" cards, "Run another report", guide headings. Write them per tool, do not pull them from a shared bank.
3. Replace the banner skeleton with seven different angles, and the FAQ "is it free" answers with the real numbers.
4. Vary FAQ slots: 4 shared (what is it, how, free, privacy), 4 unique to the tool. Drop the friend-photo question except on face swap, face comparison and face blur.
5. Add feature blocks to old photo restoration and cartoon yourself. Add the 4-season versus 12-season hook to the seasonal page.
6. Fix Title Case edge cases: "Up Close", "One-of-a-Kind", "Try-On". Decide on "With" and document it in lib/title-case.ts.
7. Stop padding. Delete the last sentence of any body that only restates the benefit, then add a number or a named example where the space is.
8. Align home with the tool pages: first two results are free.
