# Copy Review 6 (second pass, independent)

Reviewed 2026-11-14 from rendered HTML on http://localhost:3100 (24 URLs fetched, scripts and nav stripped). Source files untouched. Benchmark https://www.beautyplus.com/personal-color-analysis re-fetched the same day: it is now a "GPT Image 2.0" keyword hero ("One-tap AI Color Analysis Online with GPT Image 2.0", "without any costly salon consultations"). Our copy is warmer and more honest, theirs is still more selling-focused per block. This file uses no em or en dashes.

## 1. Verdict

Real progress on the copy itself, one blocking hard fail, and a new problem: the 8 new pages were built from the same shared bank that REVIEW_5 asked to be removed.

- Average, same 16 pages as REVIEW_5: **77.4** (was 75.1, **+2.3**).
- Average, 8 new pages: **73.6**.
- Average, all 24 pages: **76.2**. Pass mark is 85. Nothing passes. Only home (85) reaches it.
- **Hard fail still present on all 21 tool pages:** the workspace notice "Local preview. Uses the configured OpenAI account and may incur API charges. This app does not save your uploads or results to disk. Download before leaving." and "Checking local generation service..." (REVIEW_5 priority 1, not fixed). Per the rubric no tool page can pass while this renders.

Verified clean: no em or en dashes on any of the 24 pages, no "soon", no bullets on landing pages, numbers correct everywhere (10 free credits, 5 per result, 200 monthly credits, 40 results, about 25 cents each, $10 monthly). `$60` and `$120` appear only on /pricing. Home now says first two results (fixed).

## 2. Scores (0 to 100)

| Page | Was | Now | Main reason |
|---|---|---|---|
| seasonal-color-palette | 75 | 82 | Four-season block and 4 vs 12 season FAQ landed. Best sell on the site. Loses points for the stacked guidance H2s and the "color season finder helps most" skeleton line. |
| face-shape-analyzer | 77 | 79 | "box below" gone, free answer has numbers. Step 2 title is clumsy. Shares 3 guide cards with 3 other pages. |
| attractiveness-test | 78 | 82 | Strong hero, honest "How attractive am I" FAQ, numbers in the free answer. Heading skeletons remain. |
| skin-analysis | 73 | 77 | H2 and card now agree ("Pharmacist or Dermatologist"). "Up Close" fixed. "Does not diagnose" still appears 5 times. |
| hairstyle-changer | 77 | 81 | Heading fixed, concrete cuts. Friend-photo FAQ remains. |
| ai-hair-color | 75 | 79 | Copper heading fixed. "A box of dye costs money before you see the shade on you." is awkward and sits next to a near twin. |
| lip-color-changer | 74 | 78 | "About five minutes" orphan gone, free FAQ has numbers. Guidance paragraph is shared with two other pages. |
| virtual-try-on-clothes | 74 | 72 | H1 fixed, but "Virtual Try-On: Clothes" with a colon still sits in 5 headings and the CTA. Body keeps "virtual try on clothes" unhyphenated. Lowest of the original set. |
| old-photo-restoration | 69 | 70 | Banner and FAQ numbers fixed. **Still no feature section.** Steps jump to use cases. |
| face-blur | 74 | 76 | Honest, useful, caption warning is the best line on the page. Shares guidance and guide card with old photo and merge. |
| cartoon-yourself | 70 | 72 | "One-of-a-Kind" fixed. **Still one feature block** (Soft 3D only). Comic ink and anime have no block. |
| ai-face-swap | 75 | 77 | Hero over-hedging fixed, one clean joke line. Consent still appears 6 times. |
| birthday-image-generator | 72 | 76 | Banner and FAQ upgraded. Guidance heading and body are shared with cartoon, filters and halloween. |
| / (home) | 84 | 85 | Aligned to "first two results". Still has two hard-coded openers that read as slogans. |
| /pricing | 83 | 83 | Clear. "Pro Gives You More Credits Every Month" still sits above a yearly toggle. |
| /category/hair-beard | 72 | 70 | Unchanged. "Tools still in development" line stays, three tools still have no description. |
| **Same-16 average** | **75.1** | **77.4** | |
| facial-symmetry (new) | | 78 | Clean, specific, honest. Hero says "free" twice. Weak use-case sub-line. |
| beauty-tips (new) | | 73 | Guidance block is copied from the seasonal palette page and talks about skin, hair and eye color and "true colors", not tip cards. |
| eyeshadow-try-on (new) | | 74 | Good shade blocks. Guidance paragraph is pasted from the lip page and the H1 says "Try On" while headings say "Try-On". |
| ai-tattoo-generator (new) | | 69 | Clothing template leaks in ("how a material moves", "Check the Fit"), a clothing guide card and a Virtual Try-On link. Hero names "tattoo try on", tool is "AI Tattoo Generator". |
| face-filters (new) | | 76 | Strong mood-based blocks. Photo guidance and "playful picture" paragraph reused word for word on halloween. |
| halloween-mask (new) | | 76 | Fun, specific, non-gory angle. Same reuse. |
| merge-portraits (new) | | 74 | Good gift angle. Guidance paragraph is the face swap paragraph. "Merge portraits" as a verb phrase reads awkward in H1 and body. |
| ai-eyebrows (new) | | 69 | "AI Eyebrows paints the shade on the part of your face it can see" and "Treat Your AI Eyebrows Shade as a Guide" make no sense for brows. Lip template pasted. |
| **New-8 average** | | **73.6** | |
| **All 24** | | **76.2** | |

## 3. Did the REVIEW_5 fixes land?

Landed:
- Banner skeleton replaced by per-page angles (shoebox of prints, event album, group chat, calendar of birthdays, costume group). Landed in body text.
- "Is it free" FAQs now state 10 credits, 5 per result and the 200 credit plan on 20 of 21 pages. The "box below" answers are gone.
- Shared photo-tip sentence ("Use a sharp, well-lit portrait with the whole head in frame...") and the shared "visual edit, not a promise" disclaimer are gone from all 13 original pages. Tips are now per tool (window, bare face, hairline).
- Friend-photo FAQ removed from lip, skin, seasonal, blur, old photo and others. Replaced with page-specific questions (torn corner, compare two shades, 4 vs 12 season).
- Title Case edge cases: "Up Close" and "One-of-a-Kind" fixed. Hairstyle FAQ heading rewritten. Virtual try-on H1 and first H2 fixed.
- Seasonal page names four seasons and answers the 4 vs 12 question. Lip orphan sentence removed. Face swap hero de-hedged. Home aligned to two free results.
- Padding closers shrank. "Everyone in the family gets to enjoy it", "Your wallet stays happier too" and the meta line in try-on are gone.

Not landed:
1. Developer notice on every tool page (hard fail).
2. Old photo restoration feature section (0 blocks). Cartoon yourself extra blocks (1 block).
3. "Virtual Try-On: Clothes" colon in headings, CTA and related-tools label.
4. Shared bottom half: guide cards and heading skeletons (section 4).
5. Category page wording and missing descriptions.
6. Yearly toggle H2 on /pricing.

## 4. Repetition (new hunt)

Exact repeated body sentences fell from 9 pages to a handful. What is left is concentrated in the bottom half and in the new pages.

### Exact sentences repeated across pages

| Sentence | Pages |
|---|---|
| "Keep that area clear of heavy filters and strong makeup, because the preview starts from what your photo shows and is easier to judge that way." (with "X paints the shade on the part of your face it can see, so choose a close, front-facing photo in natural light.") | lip, eyeshadow, eyebrows |
| "Real products differ in finish and wear, so use the picture to narrow your choices and test the real thing before you buy." | eyeshadow, eyebrows |
| "Make sure both adults have agreed to their photos being used, and avoid sunglasses or heavy filters on either one so the two faces match up cleanly." (and "needs two clear portraits in similar light") | face swap, merge portraits |
| "Face the camera, keep the light even and avoid sunglasses or a hand over your mouth." plus "A clear starting photo gives the effect something real to play with." | face filters, halloween |
| "Say it is edited when you share it, and use photos only with permission from the adults in them." | birthday, face filters, halloween |
| Guide card "Make a Creative Portrait Effect Feel Personal" with identical blurb | face swap, birthday, cartoon, filters, halloween (5) |
| Guide card "How to Find Your Face Shape From a Photo" with blurb | attractiveness, face shape, symmetry, hairstyle, skin (5) |
| Guide card "What a Facial Symmetry Preview Can and Cannot Show" | attractiveness, face shape, symmetry, skin (4) |
| "Plan a Hair Change With a Photo Preview" | face shape, hairstyle, hair color (3) |
| "A Photo-First Guide to Seasonal Color Palettes" | seasonal, lip, beauty tips (3) |
| "What to Check in a Virtual Makeup Try-On" | lip, eyeshadow, eyebrows (3) |
| "How to Prepare an Old Family Photo for Restoration" | old photo, blur, merge (3) |
| "What a Virtual Outfit Preview Can Tell You" | seasonal, try-on, tattoo (3, tattoo is a wrong fit) |
| "You can try it for free." | hair color, try-on |

### Heading skeletons (same frame, nouns swapped)

| Skeleton | Pages |
|---|---|
| "You Can [verb] ... in Three Steps." | 17 of 21 |
| "Pick a Photo With a Clear Face for [Tool]." | 5 (cartoon, face swap, birthday, filters, halloween) |
| "Enjoy Your [Tool] Result as a Playful Picture." | 5 |
| "Try a Different Effect After [Tool]." | 5 |
| "Read Our Guides for More Ideas Like [Tool]." | 5 |
| "Read Our Guides Before You [Buy / Share / Shop With] ..." | 8 |
| "Choose the Portrait for Your [Tool]." | 4 (attractiveness, face shape, skin, symmetry) |
| "Here Is How to Read Your [Tool] Result." | 4 |
| "Try Other Face Reports After Your [Tool]." and "Read How to Get More From Your [Tool]." | 4 each |
| "Fix Another Problem After [Tool]." / "Check the Whole Image Before You Rely on [Tool]." / "Start [Tool] With the Clearest Photo You Have." | 3 each (old photo, blur, merge) |
| "Pick a Close, Bright Photo for [Tool]." / "Treat Your [Tool] Shade as a Guide, Then Test It." / "Try More Makeup Shades After [Tool]." | 3 each (lip, eyeshadow, eyebrows) |
| "Take Your [Tool] Preview to Your Stylist as an Idea." / "Try Another Hair or Beard Look After [Tool]." | 2 each (hairstyle, hair color) |
| Banner H2 "[Two X] ... Before You Pay / Spend Anything" | 12 of 21 (face swap, cartoon, blur, old photo, merge, symmetry, shape, skin, attractiveness, lip, filters, halloween) |
| Use-case sub-line "[Tool] helps most / is worth the most / pays off before ..." | 8 (seasonal, hairstyle, hair color, lip, try-on, old photo, beauty tips, eyebrows) |

### Other structural repeats
- Banner last sentence "$10 a month ... 200 credits ... 40 ... about 25 cents each" on 10 pages. The nouns change, the sentence does not.
- Every tool page has two stacked H2s in the guidance block that say the same thing ("Take Your Photo in Daylight so Your Palette Shows True Colors." directly above "Pick a Daylight Photo for Your Seasonal Color Palette.").
- "Is it worth ...?" closes the FAQ on 7 pages with the same answer shape.
- Related-tools lists put Face Beauty Analysis, Facial Symmetry Test, Attractiveness Test and Face Shape Analyzer on a clothing page, a blur page and a tattoo page. Face Beauty Analysis appears in 15 of 21 lists.
- Zero contractions on all 24 pages. Style guide asks for "you'll", "it's", "don't" in hero and FAQ. This is the largest single cause of the stiff, uniform voice, and it is also why the pages read as one template.

## 5. Headings and Title Case audit

Pass: Title Case is applied consistently (short prepositions and articles lowercase, "With" capitalised, "Up Close" and "One-of-a-Kind" fixed). Lengths 6 to 14 words. No dashes. Almost every heading is a plain statement.

Fail or weak:
- "Virtual Try-On: Clothes" (colon) in "Use Your Virtual Try-On: Clothes Preview to Plan, Then Check the Fit.", "Choose a Photo Where the Area for Virtual Try-On: Clothes Is Clear.", "Test More Style Ideas After Virtual Try-On: Clothes.", "Read Our Guides Before You Shop With Virtual Try-On: Clothes.", CTA "Try Virtual Try-On: Clothes".
- "Eyeshadow Try On" (H1, H2s, FAQ) next to "Eyeshadow Try-On" (tool name, guidance). Pick "Try-On" as noun everywhere. Same for "Tattoo Try On" and "Eyebrow Try On". Verb "Try On" stays two words ("Pick the Eyeshadow Look You Want to Try On.").
- "Test Two Filters on Your Photo Before You Pay for Any." ends on a dangling "any".
- "Agree That You May Use It and Find Your Face Shape." (face shape step 2) is not a plain statement.
- "Choose a Photo Where the Area for AI Tattoo Generator Is Clear." and "Use Your AI Tattoo Generator Preview to Plan, Then Check the Fit." are template output.
- "Pick a Close, Bright Photo for AI Eyebrows." and "Treat Your AI Eyebrows Shade as a Guide, Then Test It." read as nonsense for brows.
- /pricing: "Pro Gives You More Credits Every Month." sits above the yearly toggle.
- H1 mismatch of tool name: "Face Symmetry Test" vs "Facial Symmetry Test", "Tattoo Try On" vs "AI Tattoo Generator", "Halloween Mask Filter" vs "AI Halloween Mask". Fine for keywords, but pick one and use it in the page title, breadcrumb and CTA.

## 6. Naturalness

Better than REVIEW_5: concrete first lines ("A palette looks perfect in the pan and wrong on your lids", "Brows grow back slowly, so a shape you regret stays with you for weeks", "Some people are never in the same place at the same time"). These read like a copywriter. Keep that register.

Still padding (a last sentence that restates the benefit): "Everyone you leave out of view stays comfortable.", "It is a kind way to share a memory.", "Everyone can enjoy it for what it is.", "Your friend sees the same face with two different cuts, which keeps the vote simple.", "That one check can spare you a return." (repeated idea in seasonal and try-on), "Keep it saved so you can check it in store.", "Both ideas come from the same result, so you pay for one set of cards.", "You keep control of the final result."

Unsupported or odd claims: "The photo with the clearest, kindest notes is usually the one to post." (attractiveness), "A softer look may also suit your coloring better than a scary one" (halloween), "Matched light is what makes the picture feel real." (merge).

## 7. The 25 worst lines and rewrites

Rewrites keep the keyword, headings are 7 to 14 words, bodies 40 to 60 words, no dashes.

**1. All 21 tool pages, workspace notice (hard fail)**
Now: "Local preview. Uses the configured OpenAI account and may incur API charges. This app does not save your uploads or results to disk. Download before leaving." and "Checking local generation service..."
Better: "Your photo is sent for processing and you can delete it from your account any time. Download your result before you leave this page." (Confirm the storage claim with engineering.) Remove the status line, or show "Ready" when true.

**2. old-photo-restoration, missing feature section**
Add three blocks.
"Scratches and Fading Disappear While the Faces Stay Yours." Body: "The tool repairs scratches, lifts faded contrast and softens blur, and a black and white print stays black and white. The restored file sits beside your scan, so you check every face before you print it. Nobody in the picture is swapped or aged." (46)
"A Better Scan Gives You More Detail Back." Body: "Scan the print flat at 600 dpi if your scanner allows it, in even light with no finger shadows. The tool can only repair what the scan keeps, so a sharp scan of a damaged print beats a quick phone snap. Photograph it square to the paper if you have no scanner." (54)
"You Keep the Original and Get One Clean Copy to Share." Body: "Download the repaired file and leave your scan untouched as the record. Send the clean copy to cousins, or print it at a copy shop for the wall. One file replaces a pile of blurry copies of copies." (40, add one concrete detail if wanted)

**3. cartoon-yourself, one feature block**
"Comic Ink Turns Your Photo Into a Bold Graphic Panel." Body: "Comic ink adds heavy outlines and flat shading, so your portrait looks like a panel from a graphic novel. Hair, expression and outfit stay recognizable, and the style holds up on a banner or a game avatar. Run it next to soft 3D and keep the one that feels more like you." (50)
"Anime Gives You Big Eyes and a Clean, Stylized Look." Body: "Anime redraws your face with a smooth finish and simple shading, which suits a profile picture. Check the platform rules before you post an AI-made avatar. If the eyes drift from yours, run it again on a sharper photo." (40)

**4. virtual-try-on-clothes, colon headings**
Now: "Choose a Photo Where the Area for Virtual Try-On: Clothes Is Clear."
Better: "Show the Area the Garment Will Cover, Arms Down and Clear." (10)
Now: "Use Your Virtual Try-On: Clothes Preview to Plan, Then Check the Fit."
Better: "Use the Preview to Decide, Then Check the Size Guide." (10)
Now: "Test More Style Ideas After Virtual Try-On: Clothes." Better: "Other Ways to Try a Look Before You Pay." CTA: "Try Virtual Try-On Clothes". Body text: "this virtual try on clothes tool" becomes "this virtual try-on tool".

**5. lip, eyeshadow, eyebrows: one pasted guidance paragraph, wrong for brows**
Now (all three): "[Tool] paints the shade on the part of your face it can see, so choose a close, front-facing photo in natural light. Keep that area clear of heavy filters and strong makeup, because the preview starts from what your photo shows..."
Better, lip: "Face a window with your lips relaxed and your mouth clear of hands, masks and a phone. A strong filter or shadow across the mouth turns every shade muddy, so judge the color only if the lips look natural before you start."
Better, eyeshadow: "Look straight at the camera with both eyes open and your lids bare. Glasses frames and heavy shadow across the lid hide the area the preview paints, so take the photo by a window."
Better, eyebrows: "Push your hair and fringe back and face a window. Brow powder, glasses frames and a hand near the face change what the tool reads, so start from your usual brows with nothing covering them."

**6. ai-eyebrows, "Treat Your AI Eyebrows Shade as a Guide, Then Test It."**
Better heading: "Take the Brow Preview to Your Artist as an Idea." (9)
Better body: "Real brows depend on your hair growth, your bone structure and your artist's hand. Use the preview to name the shape you like, then ask what it would take to get there and how long it would last." (40)

**7. ai-tattoo-generator, clothing template leak and wrong links**
Now: "AI Tattoo Generator shows how an idea could look on your picture. It cannot confirm size, fit or how a material moves, so check the real details before you commit."
Better heading: "Take the Preview to Your Artist, Not Straight to the Studio." (10)
Better body: "A preview shows an idea at roughly arm scale. It cannot show how ink settles, fades or ages in real skin, and an artist will adjust the design to your anatomy. Use it to explain what you want in a consultation." (40)
Also replace the guide card "What a Virtual Outfit Preview Can Tell You" and the Virtual Try-On link with a tattoo or Silhouette Preview pairing, and change "Choose a Photo Where the Area for AI Tattoo Generator Is Clear." to "Photograph Your Forearm Straight On in Bright Light." (8)

**8. beauty-tips, guidance copied from the seasonal palette**
Now: "Personalized Beauty Tips reads your skin, hair and eye color, so take the photo by a window in daylight... A truer photo gives you a result you can trust in a shop."
Better body: "The hair card reads the outline your hair and face make, and the glasses card reads your face shape, so keep your hair down and your whole head in frame. A window gives the light card something real to judge. Skip hats and sunglasses." (43)
Heading: "Show Your Hair and Whole Face so the Cards Fit You." (11). Also drop the "True Colors" language, the "Try More Color and Style Ideas" heading and the seasonal guide card.

**9. face swap and merge portraits, identical guidance**
Now (both): "...needs two clear portraits in similar light, both showing the face straight on. Make sure both adults have agreed to their photos being used, and avoid sunglasses or heavy filters on either one so the two faces match up cleanly."
Better, face swap: "Pick a source face and a target photo taken at a similar angle, because a face looking left will not sit well in a portrait looking right. Skip sunglasses and masks on either one." (33, then add the consent line once.)
Better, merge portraits: "Choose two photos shot from about the same distance, with light falling from the same side. If one person is close up and the other stands far back, the pair will look pasted together. Crop to the same framing first." (40)

**10. face filters, halloween, birthday: same photo paragraph and same "playful picture" paragraph**
Now: "AI Face Filters keeps your face recognizable when it can see it, so choose a clear photo where your expression is easy to read..." and "X makes a playful, edited image for fun. Say it is edited when you share it..."
Better, face filters: "Soft front light and a relaxed face give the film, watercolor and neon looks the most to work with. A photo that already has a heavy filter will fight the new one, so start from the plain original."
Better, halloween: "Show your bare face with the whole forehead and cheeks in frame. The makeup needs clean skin to sit on, so remove glasses if you can and skip a photo with a filter already applied."
Better, birthday: "A birthday card is a joke between friends, so mention that the picture is AI-made if you post it publicly, and only use a photo of an adult who would enjoy it." (31)

**11. Guide cards shared across 3 to 5 pages**
Now: "Make a Creative Portrait Effect Feel Personal" on five pages with one blurb.
Better: one distinct card per page, for example cartoon: "Pick the Cartoon Style That Still Looks Like You." ("Soft 3D, comic ink and anime read differently at thumbnail size. Here is how to choose.") birthday: "Write a Birthday Message That Goes With the Card." halloween: "Plan a Group Costume From One Photo." face swap: "Face Swaps Without the Awkward Part." Likewise give symmetry, skin and attractiveness each a different primary guide instead of "How to Find Your Face Shape From a Photo".

**12. attractiveness, face shape, skin, symmetry: "Choose the Portrait for Your X." and "Here Is How to Read Your X Result."**
Better, attractiveness: "Pick the Photo You Would Actually Post." and "Your Score Describes One Photo, Not Your Whole Face."
Better, face shape: "Pull Your Hair Back and Face the Camera." and "Treat Your Face Shape Label as a Starting Point."
Better, skin: "Wash Your Face and Stand Near a Window." and "These Close-Ups Describe Your Photo, Not Your Skin Health."
Better, symmetry: "Hold the Camera Level and a Little Farther Away." and "The Centerline Is a Guide, Not a Measurement."

**13. Stacked guidance H2s on every tool page**
Now (seasonal): "Take Your Photo in Daylight so Your Palette Shows True Colors." directly followed by "Pick a Daylight Photo for Your Seasonal Color Palette."
Better: keep one. If the first is the section heading and the second the sub-heading, give the second a different job, for example "Stand Facing a Window and Remove Colored Lamps." and make the body add one new fact (a yellow lamp pulls your palette warm).

**14. Banner H2 skeleton "[Two X] Before You Pay/Spend Anything"**
Now: "Make Two Joint Portraits Before You Spend Anything." / "Restore Two Photos Before You Spend Anything." / "You Get Two Symmetry Checks Before You Pay Anything." / "Blur Your First Two Photos Before You Pay Anything."
Better, merge: "Your First Two Joint Portraits Are Free to Make." Better, old photo: "Two Faded Photos Come Back Without Spending Anything." Better, symmetry: "Run Your Selfie and a Level Retake for Free." Better, blur: "Blur the Photos You Plan to Post This Week." Vary the last sentence too: only a third of pages need the "$10, 200 credits, 40 results" line, the rest can end on the action.

**15. face-filters banner heading**
Now: "Test Two Filters on Your Photo Before You Pay for Any."
Better: "Your First Two Filters Cost Nothing, So Try Film and Neon." (10)

**16. facial-symmetry hero, "free" twice**
Now: "It is free to try, and every face has differences. Give it a go at no cost."
Better: "Every face has small differences, and this shows which ones are real and which ones are just the camera. It is free to try." (25, replace sentence 3 and 4)

**17. face-shape-analyzer step 2**
Now: "Agree That You May Use It and Find Your Face Shape."
Better: "Tick the Photo Rules and Press Start." (7) Body: "Your outline and suggestions are ready in a few minutes."

**18. Padding closers**
Now: "Everyone you leave out of view stays comfortable." (blur) / "It is a kind way to share a memory." (blur) / "Everyone can enjoy it for what it is." (merge) / "Your friend sees the same face with two different cuts, which keeps the vote simple." (hairstyle)
Better: delete all four. If space is needed add one number or named example, for example blur: "A street scene with eight strangers takes the same one upload as a close-up."

**19. Friend-photo FAQ left on four pages**
Now: hairstyle "Can I try hairstyles on a friend's photo?", hair color "Can I try colors on someone else's photo?", beauty tips "Can I get tips from someone else's photo?", birthday "Can I make a card with someone else's photo?"
Better, hairstyle: "Can I preview a cut I saw on someone else?" Answer: "Not directly. Pick the nearest named style, such as a curly bob, then show your stylist the celebrity photo too."
Better, hair color: "Will the preview work on gray or dyed hair?"
Better, beauty tips: "How often should I redo my beauty tips?" Better, birthday: keep, it is the only tool where it is the main use, but answer in one sentence.

**20. ai-hair-color, awkward repeated line**
Now: heading "Choose Between Box Dye and a Salon Visit With a Preview." and body ending "If not, you saved the cost of the box. A box of dye costs money before you see the shade on you."
Better body: "Preview the shade you were about to buy, then decide whether it is worth a salon appointment. If it looks good, bring the image to your colorist. If it does not, you keep the price of the box." (40)

**21. Use-case sub-line "[Tool] helps most right before ..."**
Now: "A color season finder helps most right before a purchase." / "A lip color changer helps most right before a purchase or a big occasion..." / "A haircut simulator is worth the most before a change..." / "A hair color simulator pays off before..."
Better: write each as the situation, not the tool: seasonal "Use it on the day you shop, not after the return." lip "Run it the week before the party." hairstyle "Run it before any cut that takes months to grow back." hair color "Run it before the box goes in the basket."

**22. All pages, no contractions**
Now: "It is a four-season system, so it will not split hairs between close neighbors." / "It does not grade your skin or diagnose anything."
Better: "It's a four-season system, so it won't split hairs between close neighbors." / "It doesn't grade your skin or diagnose anything." Do this in hero, FAQ, banner and about half the body sentences. Keep a few uncontracted ones for rhythm.

**23. skin-analysis, "does not diagnose" five times**
Now: hero ("and does not diagnose"), card 1 ("does not grade your skin or diagnose anything"), three feature blocks ("does not diagnose anything"), guidance, FAQ.
Better: hero and the guidance block say it once each, FAQ answers it in full. Feature body for the nose area: "Lighting and resolution change what shows, so compare two photos before you draw any conclusions." Remove the repeated clause from under-eye and cheek blocks.

**24. /category/hair-beard**
Now: "Tools still in development are clearly marked, so you know which ones are open." and AI Beard Removal, Hair Loss Simulation, AI Bald Filter listed with no text.
Better: "Every tool opens with an example result, so you see what you will get before you upload." Add one line per tool, for example "AI Beard Removal: See a clean-shaven version of your photo before you shave." If a tool is not live, hide its card instead of describing it.

**25. /pricing and home, remaining slogans**
Now: pricing H2 "Pro Gives You More Credits Every Month." above a yearly toggle; home "Pick the Result You Want to See First." and "Pick a Detail and See an Example Result for It."
Better: "Pro Gives You 200 Credits a Month or 2,400 a Year." (11, now it works above the toggle). Home: "Start With the Decision on Your Mind." and "See Skin, Lips or Hair Color in One Example." (7 to 9)

## 8. Priority fixes for the next pass

1. Remove the developer notice and "Checking local generation service..." (hard fail, blocks all 21 pages from passing).
2. Add the old photo restoration and cartoon yourself feature blocks (lines 2 and 3).
3. Stop the new-page template leak: rewrite guidance paragraphs on beauty tips, tattoo, eyebrows, eyeshadow, merge, halloween and filters (lines 5 to 10). These pages share a bank that earlier reviews asked to retire.
4. Replace the shared bottom half on the 13 original pages: give every page its own guide cards and rename the repeated heading skeletons (lines 11 to 13).
5. Break the banner skeleton (line 14) and the use-case sub-line skeleton (line 21).
6. Add contractions in hero, FAQ and banner (line 22). This one change will do more for "sounds like a person wrote it" than any single rewrite.
7. Fix "Virtual Try-On: Clothes" and "Try On" versus "Try-On" in headings and CTAs.
8. Limit repeated disclaimers: skin (diagnosis) and face swap (consent) once per section.
9. Finish the category page descriptions and the pricing toggle H2.
