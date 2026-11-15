# Copy Review 7 (third pass, independent)

Reviewed 2026-11-15 from rendered HTML on http://localhost:3100 (30 URLs fetched, scripts and nav stripped, duplicate-sentence, heading and FAQ checks run by script). Source files untouched. The dev workspace notice ("Local preview...", "Checking local generation service...") is ignored as instructed. Benchmark https://www.beautyplus.com/personal-color-analysis was not re-fetched this pass; the comparison in REVIEW_6 still stands (theirs sells harder per block, ours is warmer and more honest). This file uses no em or en dashes.

## 1. Verdict

A real step up. The pages now read like a person wrote each one, the guidance paragraphs are specific to each tool, contractions are in, and the worst template leaks (tattoo, eyebrows, beauty tips) are fixed. What is left is almost all in the bottom half of the page: shared guide cards, repeated heading frames, and a few contraction bugs introduced by the fix itself.

- Same 16 pages as REVIEW_5 and 6: **79.4** (REVIEW_6: 77.4, **+2.0**).
- Eight REVIEW_6 new pages: **77.4** (was 73.6, **+3.8**).
- All 24 pages from REVIEW_6: **78.8** (was 76.2, **+2.6**).
- Six new pages: **73.5** (77.8 without the celebrity stub).
- All 30 pages: **77.7**. Pass mark is 85. Only /pricing (86) and home (85) reach it.

Verified clean on all 30 pages: no em or en dashes, no "soon", no bullets on landing pages, no exact repeated FAQ question across any two tool pages, no exact repeated body sentence outside the guide cards. Numbers are right everywhere: 10 free credits, 5 per result, first two results free, $10 a month for 200 credits, 40 results, about 25 cents each. `$60` and `$120` appear only on /pricing.

## 2. Scores (0 to 100)

| Page | R6 | Now | Main reason |
|---|---|---|---|
| seasonal-color-palette | 82 | 83 | Best sell on the site. Still "It is a four-season system, so it will not split hairs", two stacked guidance H2s, three padding closers ("Keep it saved so you can check it in store."). |
| face-shape-analyzer | 79 | 81 | Step 2 fixed ("Tick the Photo Rules and Press Start."). Eight real FAQs. Guide cards shared with 7 pages. |
| attractiveness-test | 82 | 82 | Strong hero and honest "How attractive am I" FAQ. "kindest notes" and "anyone who doubts it" are still odd. Two skeleton guidance H3s. |
| skin-analysis | 77 | 79 | "Does not diagnose" down to 4 hits. Skeleton guidance H3s and a shared retouch guide card remain. |
| hairstyle-changer | 81 | 82 | Friend-photo FAQ replaced by "a cut I saw on someone else". Guidance H3 "for Hairstyle Changer" is clumsy. |
| ai-hair-color | 79 | 80 | Box-dye line fixed. "Shows Your Hairline" heading is wrong for color, and the heading is stuffed with the tool name. |
| lip-color-changer | 78 | 80 | Orphan-free, own guidance paragraph, good red and berry blocks. Heading "Buy Your Lip Color Changer Shade" is odd. |
| virtual-try-on-clothes | 72 | 79 | Colon gone everywhere, "Virtual Clothes Try-On" consistent, H2s rewritten. Related list still offers a tattoo tool. |
| old-photo-restoration | 70 | 71 | **Still no feature section.** Two near-identical use cases (print for the wall, share with family). |
| face-blur | 74 | 76 | Padding closers gone. Banner H2 and first sentence are the same sentence. |
| cartoon-yourself | 72 | 76 | Three styles now named in one feature block. Still one block, so comic ink and anime get no heading of their own. |
| ai-face-swap | 77 | 78 | Hero is warm and clear, guidance is its own. Consent line appears four times. |
| birthday-image-generator | 76 | 77 | Good banner ("Got a calendar full of birthdays?"). Card guide pool is a bad fit (outfit preview). |
| / (home) | 85 | 85 | Slogans fixed. The skin, lip and symmetry examples each appear twice on one page. |
| /pricing | 83 | 86 | Toggle H2 now "Pro Gives You 200 Credits a Month or 2,400 a Year." Best page. |
| /category/hair-beard | 70 | 76 | Descriptions added to all six tools, "in development" line gone. Section copy is generic and echoes home. |
| **Same-16 average** | **77.4** | **79.4** | |
| facial-symmetry | 78 | 80 | "Free" said once now. Hero is the best on the face group. |
| beauty-tips | 73 | 78 | Guidance now about hair, frames and light cards. "A fresh photo gives fresher tips." is filler. |
| eyeshadow-try-on | 74 | 79 | Own guidance, "Try-On" noun used consistently. "Shows You How Warm Your Eyes Look With It" is clumsy. |
| ai-tattoo-generator | 69 | 75 | Forearm angle and artist advice landed. Still mislabeled (H1 "Tattoo Try-On", tool "AI Tattoo Generator"), shopping and outfit leftovers in headings and cards. |
| face-filters | 76 | 75 | Mood blocks are strong. **"leave your face as it's" appears twice**, and "applies a trending look" is invented. |
| halloween-mask | 76 | 79 | Own guidance, strong non-gory angle. Tool name mismatch (Mask Filter vs AI Halloween Mask). |
| merge-portraits | 74 | 77 | Own guidance and gift angle. "Is merge portraits free?" and "Distant Relatives" read oddly. |
| ai-eyebrows | 69 | 76 | Brow-specific blocks and "Before the Tweezers Come Out" are good. Heading "Buy Your AI Eyebrows Shade" still makes no sense. |
| **New-8 average** | **73.6** | **77.4** | |
| celebrity-look-alike (new) | | 52 | Stub: one notice, no sections, no FAQ. Honest, but a thin page with an H1 and no content. |
| facial-landmarks (new) | | 79 | Clear, specific, honest. "Are the face points on photo exact?" is broken English. |
| beard-styling (new) | | 78 | "Week three gets itchy" is a real line, then used twice on one page. |
| ai-lip-enhancement (new) | | 78 | Careful makeup-only framing. "Buy Your AI Lip Enhancement Shade" is a wrong heading. |
| age-gender-swap (new) | | 77 | "Costume, Not a Forecast" is good. "who you're" contraction bug. Hero is short. |
| elf-name-generator (new) | | 77 | Fun, specific. Two near-identical headings in the guidance block. |
| **Six-new average** | | **73.5** | |
| **All 24 (R6 set)** | **76.2** | **78.8** | |
| **All 30** | | **77.7** | |

## 3. Did the REVIEW_6 fixes land?

Landed:
- **Guidance paragraphs per tool.** Yes. Lip, eyeshadow, eyebrows, beauty tips, tattoo, face swap, merge, halloween and filters each have their own paragraph now, and the face swap and merge text no longer match. The tattoo clothing leak ("how a material moves") is gone.
- **Virtual Clothes Try-On.** The colon is gone from every heading, the CTA and the related label. Body now says "virtual clothes try-on tool".
- **Contractions.** In hero, FAQ and banner on nearly every page. Biggest single gain in naturalness.
- **Old padding closers.** "Everyone you leave out of view stays comfortable", "Everyone can enjoy it" and the hairstyle vote line are gone.
- **Banner H2s.** The "[Two X] Before You Pay" frame is broken on most pages ("Your First Two Joint Portraits Are Free to Make.", "Two Faded Photos Come Back Without Spending Anything.", "Run Your Selfie and a Level Retake for Free.", "Blur the Photos You Plan to Post This Week."). Only face swap still ends "Before You Pay a Cent."
- **Use-case sub-lines.** Now situations ("Run it before the box goes in the basket.", "Run it the week before the party."). Good.
- **Pricing toggle H2, category descriptions, home slogans.** Fixed.
- **Friend-photo FAQ.** Gone from hairstyle, hair color, beauty tips (replaced by useful questions). Kept on birthday, where it fits.
- **Cartoon styles.** Soft 3D, comic ink and anime are all named in one block with the right descriptions.

Partly landed:
- **Guide cards rotating.** Only partly. Pages now get different cards, but the pool is nine cards and the same ones repeat widely (section 4). Several are wrong for the tool.
- **Skin "does not diagnose".** Down from 5 to 4 hits. Hero, card, FAQ and guidance still each say it.
- **Banner closer.** About 10 pages still end on "$10 a month, 200 credits, 40 results, about 25 cents each". Wording varies, structure does not.

Not landed:
1. Old photo restoration feature section (0 blocks).
2. Separate cartoon blocks for comic ink and anime.
3. Heading skeletons in the bottom half (section 4).
4. Related tools: "Face Beauty Analysis" is in the list on 18 of 29 tool pages, with Facial Symmetry, Attractiveness and Face Shape on 9 to 11 pages each, including blur, merge, tattoo and clothing pages.
5. "Kindest notes", "anyone who doubts it" on attractiveness.

## 4. Repetition hunt

### Exact repeats across pages (script result)
Only the guide cards repeat word for word. Body sentences, FAQ questions and FAQ answers are unique across all 29 tool pages.

| Guide card | Pages |
|---|---|
| Make a Creative Portrait Effect Feel Personal | 14 (including hairstyle changer, lip color changer, virtual try-on, beard styling, tattoo, blur) |
| What to Check in a Virtual Makeup Try-On | 12 (including attractiveness, seasonal, skin, symmetry) |
| Plan a Hair Change With a Photo Preview | 8 (including age and gender swap, elf, eyebrows) |
| How to Find Your Face Shape From a Photo | 8 (including eyebrows, eyeshadow, blur) |
| A Photo-First Guide to Seasonal Color Palettes | 8 (including halloween, elf, try-on) |
| How to Keep a Portrait Retouch Looking Natural | 8 (including cartoon, beard, old photo) |
| How to Prepare an Old Family Photo for Restoration | 5 (including tattoo, birthday) |
| What a Virtual Outfit Preview Can Tell You | 4 (including lip enhancement, birthday) |

A reader who opens five pages sees the "Creative Portrait Effect" card on three of them. Cards on wrong pages: portrait effects on a hairstyle page, outfit preview on a lip enhancement page, old family photo on a tattoo page.

### Heading skeletons (same frame, nouns swapped)

| Skeleton | Pages |
|---|---|
| "Choose the Portrait for Your [Tool]." + "Here Is How to Read Your [Tool] Result." | 5 (attractiveness, shape, skin, symmetry, landmarks) |
| "Try Other Face Reports After Your [Tool]." and "Read How to Get More From Your [Tool]." | 5 each |
| "Try a Different Effect After [Tool]." and "Read Our Guides for More Ideas Like [Tool]." | 6 each |
| "Try More Makeup Shades After [Tool]." and "Read Our Guides Before You Buy Your [Tool] Shade." | 4 each (lip, eyeshadow, eyebrows, lip enhancement) |
| "Fix Another Problem After [Tool]." | 3 (old photo, blur, merge) |
| "Start / Check the Whole Image Before You Rely on [Tool]." | 2 |
| Feature H3 "[Thing] Shows You Whether / How / What ..." | about 20 headings on 8 pages |
| Use-case H3 "You Can [Verb] ..." | about 10 headings on 6 pages |
| "Take Your [Tool] Preview to Your Stylist / Barber / Artist as an Idea." | 5 |
| Banner closer "[Pay] $10 a month for 200 credits ... 40 ... about 25 cents each." | 10 |

### Within-page echoes
- Beard styling: "when week three gets itchy" appears in a use case and again in the banner, and "Plan Your Grow-Out With a Clear Goal Picture in Hand." and "Plan Your Grow-Out With a Picture of Where You Are Heading." are twins.
- Face blur: banner H2 "Blur the Photos You Plan to Post This Week." is followed by the same sentence as the first line of the body.
- Age and gender swap: step 3 heading and body both say "send it to friends who will laugh".
- Elf: H2 "Choose a Clear Adult Portrait and Enjoy the Name as a Game." directly above H3 "Enjoy Your Elf Name and Portrait as a Fantasy Game."
- Beauty tips: use case 2 says "One upload covers both jobs." then "The frames card and the light card come from the same upload."
- Home: skin enhancement, lip shades and facial symmetry each appear in two or three sections with the same link.
- Home and category: "Pick the one that matches the decision on your mind today." and "Pick the one that matches the decision you are facing today."

## 5. Headings, Title Case and numbers

Pass: Title Case is consistent ("so" lowercase, "With" and "Before" capitalised), no colons, no dashes, no question headings outside FAQ, lengths 6 to 14 words. Every H2 and H3 is a complete statement.

Slips and weak headings:
- "Choose a Photo That Shows Your Hairline for AI Hair Color Changer." Wrong for color, tool name tacked on with no article. Same for "for Hairstyle Changer."
- "Read Our Guides Before You Buy Your AI Eyebrows Shade." / "...Lip Enhancement Shade." / "...Shop With AI Tattoo Generator." Nonsense for the tool.
- "Test More Style Ideas After AI Tattoo Generator." Tattoo is not a style tool.
- "Fix Another Problem After Merge Portraits." Merge is not a fix.
- "Soft Bronze Shows You How Warm Your Eyes Look With It." Dangling "With It".
- "Your Nose and Lips Get Clear, Labeled Points Too." Trailing "Too" in a Title Case heading.
- Naming: H1 "Tattoo Try-On" vs tool "AI Tattoo Generator", "Halloween Mask Filter" vs "AI Halloween Mask", "Use an Eyebrow Try-On" vs "AI Eyebrows". Pick one name per tool and use it in the H1, breadcrumb, CTA and banner.
- Grammar bugs from the contraction pass: "leave your face as it's" (face filters, twice), "a claim about who you're" (age and gender swap), "Are the face points on photo exact?" (landmarks), "Is merge portraits free?", "Which photo should I upload for a film look photo filter?".

Numbers: all correct. No "soon". Yearly figures only on /pricing. /pricing is consistent (20 trial credits = 4 results, 2,400 yearly credits = 480 results, $0.025 per credit).

## 6. Naturalness

Good, and clearly better than REVIEW_6: "A palette looks perfect in the pan and wrong on your lids", "Brows grow back slowly, so a shape you regret stays with you for weeks", "Your Older Character Is a Costume, Not a Forecast", "Walk into the salon knowing exactly what to ask for", "Got a calendar full of birthdays?", "Try two designs and sleep on it."

Still padded (last sentence restates the benefit): "That makes it easy to explain to a stylist which layers you mean.", "That one check can spare you a return. The same check works for scarves, bags and shoes.", "Keep it saved so you can check it in store.", "It takes one glance at the image and can save you a second trip to the store.", "A fresh photo gives fresher tips.", "A photo is a safe place to find out.", "It also keeps you honest about how long you really want to wait.", "Cousins who live in different countries work especially well."

Unsupported or odd: "keep the one with the kindest notes" and "show the final choice to anyone who doubts it" (attractiveness), "Expect two or three small ideas, such as where to part your hair" (invented detail), "AI Face Filters applies a trending look" (the tool has three fixed looks), "Merge Portraits combines both faces into one image" (FAQ says it does not blend faces).

## 7. The 25 worst lines and rewrites

Rewrites keep the keyword, bodies run 35 to 60 words, no dashes.

**1. face-filters, story and FAQ (bug, twice)**
Now: "The filter aims to leave your face as it's, and only the light and color around it change." / "They aim to leave your face as it's and change the color, texture and mood around it."
Better: "The filter aims to keep your face as it is and changes only the light and color around it." / "They aim to keep your face as it is and change the color, texture and mood around it."

**2. age-gender-swap FAQ (bug)**
Now: "Nothing in the result is a measurement or a claim about who you're."
Better: "Nothing in the result is a measurement or a claim about who you are."

**3. Guide cards, 14 pages share one card**
Now: "Make a Creative Portrait Effect Feel Personal" on hairstyle, lip color, try-on, beard, tattoo, blur and eight more.
Better: map cards by topic: hair pages get "Plan a Hair Change With a Photo Preview" only; makeup pages get "What to Check in a Virtual Makeup Try-On" only; cartoon, swap, filters, halloween, elf and age swap are the only pages that show the portrait effect card; tattoo, blur and clothing get a card written for them (for example "How to Check a Tattoo Idea Before the Consultation"). Keep a given card on at most 3 pages.

**4. face-blur, banner repeats itself**
Now: H2 "Blur the Photos You Plan to Post This Week." then "Blur the photos you plan to post this week and see how it works."
Better body: "Your first two blurred photos are free, so try one group shot and one street scene. For an event album, $10 a month brings 200 credits, enough for 40 photos." (30, add one detail if wanted)

**5. beard-styling, "week three gets itchy" twice, twin headings**
Now: use case "Plan Your Grow-Out With a Clear Goal Picture in Hand." and banner "Plan Your Grow-Out With a Picture of Where You Are Heading."
Better banner H2: "Two Beard Previews Are Free Before You Grow Anything." Body: "Try a full beard and a boxed one, then keep the one you would wait for. Hand it to your barber for the first trim." (24, add the credit line)

**6. attractiveness, odd lines**
Now: "...you can show the final choice to anyone who doubts it." and FAQ "keep the one with the kindest notes."
Better: "You skip a week of asking friends which picture looks best." and "keep the one whose notes read best to you."

**7. old-photo-restoration, still no feature section**
Add three blocks (see REVIEW_6 item 2 for full text), for example:
"Scratches and Fading Disappear While the Faces Stay Yours." Body: "The tool repairs scratches, lifts faded contrast and softens blur, and a black and white print stays black and white. The restored file sits beside your scan, so you check every face before you print it. Nobody in the picture is swapped or aged."
Also merge the two use cases so they do not both say "print and share".

**8. cartoon-yourself, one block for three styles**
Better: split into "Soft 3D Gives You a Rounded, Animated-Film Finish.", "Comic Ink Turns Your Photo Into a Bold Graphic Panel." and "Anime Gives You Clean Lines and Bigger Eyes." Each body 40 to 50 words, one concrete place to use it (profile picture, banner, game avatar).

**9. Guidance H3 pair on five face pages**
Now: "Choose the Portrait for Your Facial Symmetry Test." / "Here Is How to Read Your Facial Symmetry Test Result."
Better, symmetry: "Hold the Camera Level and a Little Farther Away." / "The Centerline Is a Guide, Not a Measurement."
Better, attractiveness: "Pick the Photo You Would Actually Post." / "Your Score Describes One Photo, Not Your Whole Face."
Better, skin: "Wash Your Face and Stand Near a Window." / "These Close-Ups Describe Your Photo, Not Your Skin Health."
Better, landmarks: "Keep Your Hair Off Your Brows and Jaw." / "Treat the Points as a Guide, Not a Measurement."
Better, face shape: "Pull Your Hair Back and Face the Camera." / "Treat Your Face Shape Label as a Starting Point."

**10. "Try Other Face Reports After Your X." and "Read How to Get More From Your X."**
Better, attractiveness: "Compare Two Faces or Check Your Shape Next." / "Read More Before You Pick a Profile Photo."
Better, skin: "Look at Your Landmarks or Your Balance Next." / "Read More on Getting a Good Skin Photo."
Better, symmetry: "See Your Golden Ratio or Face Shape Next." / "Read What Symmetry Can and Cannot Tell You."

**11. Makeup guide headings, nonsense for brows, tattoos and lips**
Now: "Read Our Guides Before You Buy Your AI Eyebrows Shade." / "...Lip Enhancement Shade." / "Read Our Guides Before You Shop With AI Tattoo Generator."
Better: brows "Read How to Judge a Brow Shape Before You Wax." lip enhancement "Read How to Judge Lip Makeup on Camera." tattoo "Read How to Prepare for a Tattoo Consultation." lip "Read How to Pick a Lipstick Shade Online." eyeshadow "Read How to Judge a Shade Before You Buy a Palette."

**12. "Choose a Photo That Shows Your Hairline for AI Hair Color Changer." and "...for Hairstyle Changer."**
Better, hair color: "Show All of Your Hair in Even Daylight." Better, hairstyle: "Show Your Hairline and Ears in Daylight." Same for the paired H3 "Take Your AI Hair Color Changer Preview to Your Stylist as an Idea." becomes "Take the Shade to Your Colorist as an Idea."

**13. ai-tattoo-generator, wrong related links and naming**
Now: H1 "Use a Tattoo Try-On to See a Design on Your Arm."; related "Virtual Clothes Try-On", "Silhouette Preview"; H2 "Test More Style Ideas After AI Tattoo Generator."
Better: rename the tool "Tattoo Try-On" everywhere, or use "AI Tattoo Generator" in the H1. Replace related tools with body and face pages that fit (for example Skin Analysis, Facial Landmarks Map) and the H2 with "Try a Different Preview After Your Tattoo Idea."

**14. Heading frame "[Thing] Shows You Whether ...", about 20 headings**
Now: "A Soft Arch Shows You Whether a Lifted Line Suits You." / "A Straight Brow Shows You How a Flatter Line Sits on You." / "Rose Nude Shows You How Soft an Everyday Lipstick Looks on You." / "Berry Shows You Whether a Bold Shade Really Suits Your Face." / "Soft Bronze Shows You How Warm Your Eyes Look With It."
Better, vary the verb and subject: "A Soft Arch Lifts the Eyes Without Changing Your Face." / "Straight Brows Look Calm on Some Faces and Stern on Others." / "Rose Nude Is the Lipstick You Can Wear Every Morning." / "Berry Looks Intense in the Tube and Softer on Your Lips." / "Bronze Is the Quiet Eyeshadow for a Workday." Keep the "Shows You" frame on at most two headings per page set.

**15. Use-case frame "You Can [Verb] ..."**
Better: "Ask Your Stylist for the Cut You Want." "Narrow Frames Down Before You Go to the Shop." "Find Out Why Your Selfies Look Uneven." Start with the verb, drop "You Can".

**16. seasonal-color-palette, uncontracted and padded**
Now: "It is a four-season system, so it will not split hairs between close neighbors." / "That one check can spare you a return. The same check works for scarves, bags and shoes." / "Keep it saved so you can check it in store."
Better: "It's a four-season system, so it won't split hairs between close neighbors." / "That one check can spare you a return." (delete the next sentence) / delete the third.

**17. facial-landmarks FAQ and heading**
Now: "Are the face points on photo exact?" / "Your Nose and Lips Get Clear, Labeled Points Too."
Better: "Are the points on my photo exact?" / "Your Nose and Lips Get Their Own Labeled Points."

**18. merge-portraits, FAQ and phrasing**
Now: "Is merge portraits free?" / "You Can Bring Distant Relatives Into One Shared Photo." / "keeps each face their own"
Better: "Is it free to merge two portraits?" / "You Can Put Two Relatives Who Live Far Apart in One Photo." / "keeps each face as it is"
Also FAQ-body mismatch: guidance says "Merge Portraits combines both faces into one image" while the FAQ says no blending. Better: "Merge Portraits places both people in one image, so a big smile in one photo and a serious look in the other will sit oddly together."

**19. Beauty tips, filler and repeat**
Now: "A fresh photo gives fresher tips." / "One upload covers both jobs. ... The frames card and the light card come from the same upload."
Better: delete the first. Second: keep "One upload covers both jobs." and delete the following sentence.

**20. face-filters guidance, invented claim and shared pattern**
Now: "AI Face Filters applies a trending look over your photo, so sunglasses, a hand near your face or a very dark room make the filter slip off the features it needs."
Better: "The warm film, watercolor and neon looks all need your eyes, nose and mouth in view. Sunglasses, a hand near your face or a very dark room give the filter less to follow, so take the photo by a window."

**21. Guidance frame "[Tool] does X, so a hat, hand or filter will change it"**
Now: "AI Eyebrows redraws brow shape and thickness, so makeup already filled in or a strong filter will confuse it." / "AI Lip Enhancement shows a fuller look for makeup planning, so a smile, a pout or gloss that is already strong will change the edge it works from."
Better, vary the opening on each: "Fill in nothing before you start. Brow powder already on the hair hides what the tool reads." / "Close your lips gently. A pout or a wide smile moves the lip line the liner follows."

**22. old-photo-restoration, FAQ tautology**
Now: "A new account has 10 credits and one restoration uses 5, so your first two photos are free. After that, a restoration costs 5 credits."
Better: "A new account has 10 credits and one restoration uses 5, so your first two photos are free."

**23. Home, internal repeats**
Now: skin enhancement example in "Portrait Edits" and again in "Beauty Previews"; facial symmetry in three places; "Start With the Decision on Your Mind." and "Pick the one that matches the decision on your mind today."
Better: keep each tool once. Beauty Previews tabs become hair color, lip shade and eyeshadow, not skin. Cut the last sentence of the first section body and rename the heading "Pick the Result You Want to See First."

**24. Category page**
Now: "Pick Any Tool in This Group to Try On Your Photo." and body "Pick the one that matches the decision you are facing today."
Better: "Six Tools, From a New Cut to a Clean Shave." Body: "Each page shows an example result before you upload anything, so you know what you'll get. Start with the one that answers the question you have today."

**25. celebrity-look-alike, thin stub**
Now: one notice and two links, no FAQ, no sections.
Better: either hide the page from the sitemap or add three short blocks: what it does not do ("We don't match you to a celebrity or identify anyone"), what you can try instead (face shape, seasonal colors, with a sentence each), and two FAQs ("Why can't I find my celebrity look alike?", "What does face shape tell me about styling?"). About 150 words total.

## 8. Priority fixes for the next pass

1. Fix the contraction bugs ("as it's", "who you're") and the broken questions (lines 1, 2, 17, 18). Five minutes, visible to every reader.
2. Cut the guide-card pool pattern: at most 3 pages per card, cards matched to the tool (line 3).
3. Rewrite the bottom-half heading frames for the face group, the makeup group and the portrait-effect group (lines 9, 10, 11, 12).
4. Add the old photo restoration and cartoon style blocks (lines 7, 8).
5. Rotate the feature and use-case heading verbs (lines 14, 15) and clear the padding closers listed in section 6.
6. Settle one name per tool (tattoo, halloween, eyebrows) and fix related-tools lists so blur, merge, tattoo and clothing pages stop linking four face reports.
7. Clean the home and category echoes (lines 23, 24) and give the celebrity page a reason to exist or hide it (line 25).
