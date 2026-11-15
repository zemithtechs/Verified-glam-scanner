# Copy review round 3: face-analysis.ts (10 tools)

Reviewer: independent, fresh read of every tool as a first-time visitor. Scored against STYLE_GUIDE section 8. No source file was edited. Pass is 85, target is 90. Line numbers are for lib/copy/face-analysis.ts as read.

## Automated checks

- U+2014 and U+2013 dashes: none. No hard fail.
- "soon", "waitlist", developer or local-preview text: none. Every tool reads as live.
- Credit numbers (10 free credits, 5 per result, 200 monthly credits, 40 results): all match lib/pricing.ts (creditsPerGeneration 5, starter 10, monthly 200). No false number.
- Medical or identification claims: none. skin-analysis and celebrity-look-alike state their limits correctly.
- Counts: 3 steps, 3 stories (4 for face-beauty-analysis), 2 use cases, guidance heading, banner and 8 FAQs on every tool.
- Round-2 fixes verified as landed: "It is built not to" gone, "X, not Y" gone, facial-landmarks limit cut from five mentions to three, celebrity titles reworked, duplicated sentences gone.

## Score table

| # | Tool | Round 2 | Round 3 | Result | Main reason it is not 90+ |
|---|---|---|---|---|---|
| 1 | attractiveness-test | 89 | 91 | pass | Clean. One repeated "beauty is personal". |
| 2 | face-golden-ratio | 87 | 89 | pass | Two story points say the same thing ("Reference idea only", "Fun reference"). |
| 3 | face-beauty-analysis | 88 | 88 | pass | "Bring facts" overclaims for a subjective report. Three near-synonym points. |
| 4 | facial-symmetry | 86 | 87 | pass | Confusing hero hook, "of it" title with no referent, muddled use-case sentence. |
| 5 | celebrity-look-alike | 84 | 86 | pass | "Identity recognition" reason stated 4 times, "adapt" 4 times, duplicate points. |
| 6 | face-comparison | 87 | 87 | pass | "No identity or family claims" said 5 times. FAQ 3 repeats FAQ 1. |
| 7 | beauty-score-showdown | 88 | 87 | pass | "No winners" said 7 times. FAQ 1 and 3 near duplicates. Heading too long. |
| 8 | face-shape-analyzer | 89 | 90 | pass | One odd FAQ line (delete "before your salon visit"). |
| 9 | skin-analysis | 86 | 86 | pass | "Does not diagnose" said 6 times, "plain words" 3 times, story 2 and 3 repeat the lighting caveat. |
| 10 | facial-landmarks | 83 | 85 | pass | FAQ 3 duplicates FAQ 1 and the hero, "light points" skeleton in two titles. |

Average 87.6. All 10 pass, no hard fails. Only attractiveness-test (91) and face-shape-analyzer (90) reach the 90 target. Applying the fixes below should lift every tool to about 90 or above.

## Cross-tool findings (optional, lifts every page by about 1 point)

- Privacy FAQ opener "Your photo is used only to build your X, and nothing is posted publicly." appears on 9 of 10 tools.
- Consent FAQ opener "Only with their consent, and only for adults (18+)." appears on 6 tools. Per-tool replacements are included below ("Yes, if they are an adult (18+) and agree first.").
- Banner skeleton "A new account starts with 10 credits and one result costs 5, so two ... A monthly plan has 200 credits, which is 40 ..." is on all 10. Facts may repeat, but vary the order on two or three pages.
- "Is it free" FAQ uses the same four sentences on all 10. Same advice.

## Fixes per tool

Edits are text replacements inside the string on that line.

### 1. attractiveness-test (91), optional only

- Line 50 answer: replace "It is for fun and styling ideas, and beauty stays personal." with "It is for fun and styling ideas." (line 53 already says "beauty is personal").

### 2. face-golden-ratio (89)

- Line 93 points: replace ["Phi in plain words", "Reference idea only", "Fun reference"] with ["Phi in plain words", "Shown beside your portrait", "For curiosity only"].
- Line 87 points: replace "No isolated numbers" with "Whole face in view" (the body no longer talks about a lone number).
- Line 103 body: replace "It turns an online argument into a quick, friendly look at proportions, and nobody has to match anything." with "It turns an online argument into a quick, friendly look at proportions." (FAQ line 112 keeps the "nothing to match" point.)

### 3. face-beauty-analysis (88)

- Line 161 ideasHeading: replace "Bring facts to your next appointment." with "Bring something concrete to your next appointment."
- Line 162 ideasIntro: replace "want something concrete to point at" with "want a picture to point at".
- Line 124 hero: replace "notes on face outline, eye spacing and lighting, and two styling ideas" with "notes on your face outline and eye spacing, and two styling ideas".
- Line 150 points: replace ["Original face preserved", "Natural texture kept", "No retouching"] with ["Original face preserved", "Natural texture kept", "Notes sit around the photo"].
- Line 176 answer: replace "Only with their consent, and only for adults (18+). A face report is personal, so ask first and delete the result straight away if they change their mind." with "Yes, if they are an adult (18+) and agree first. A face report is personal, so delete the result straight away if they change their mind."

### 4. facial-symmetry (87)

- Line 187 hero: replace "or does it only look that way from one side?" with "or does it only look that way in one photo?"
- Line 211 title: replace "You find out how much of it is the camera." with "You find out how much of the difference is the camera."
- Line 222 body: replace "Upload a selfie and a photo taken at arm's length from a friend, then compare the centerlines." with "Upload a selfie and a photo a friend took from a few steps back, then compare the centerlines."
- Line 206 body: delete the last sentence "Small differences between left and right are normal." (the point "Normal variation shown" and the hero already carry it).
- Line 234 answer: replace "Only with their consent, and only for adults (18+). Symmetry can be a sensitive topic, so ask first and share the result privately." with "Yes, if they are an adult (18+) and agree first. Symmetry can be a sensitive topic, so share the result privately."

### 5. celebrity-look-alike (86)

- Line 244 hero: replace "because matching a face to a real person is identity recognition" with "because that would mean matching a face to a real person".
- Line 256 title: replace "Your face shape shows which styles will work on you." with "Your face shape points to styles worth trying."
- Line 257 body: replace "so you can adapt a favorite haircut to your own face." with "so you can bring a favorite haircut to your stylist in the version that fits."
- Line 270 points: replace ["No face matching", "No named-person matching", "Inspiration without comparison"] with ["No face matching", "No names from photos", "Your own features only"].
- Line 279 title: replace "Copy a favorite haircut without copying it blindly." with "Ask for a favorite haircut in the version that suits you."
- Line 286 answer: replace "Naming a real person from a photo is facial recognition, and we leave it out to protect your privacy and theirs. Our tools describe your own features and styling instead." with "We leave it out to protect your privacy and the privacy of the people it would name. Our tools describe your own features and styling instead."
- Line 290 answer: replace "Only with their consent, and only for adults (18+). Our alternatives describe the face in your photo, so a friend should say yes before you upload theirs." with "Yes, if they are an adult (18+) and agree first. The alternatives describe the face in the photo, so a friend should say yes before you upload theirs."
- Line 291 answer: replace "so you can borrow the style and adapt it to your face." with "so you can borrow the style that fits."

### 6. face-comparison (87)

- Line 343 answer: replace with "No. The report sticks to what you can see, such as outline, hair, lighting and framing. There is no resemblance percentage, which keeps it fair to both people." (identity and family limits stay in the hero, FAQ 1 and use case 2.)
- Line 315 points: replace "No identification" with "Only visible differences".
- Line 345 question: replace "Which two photos work best to compare photos online?" with "Which photos work best when I compare two photos online?"
- Line 347 answer: replace "Only with their consent, and only for adults (18+). Both people should agree to be placed side by side, and either of you can ask for the result to be deleted." with "Yes, if they are an adult (18+) and agree first. Both people should be fine with being placed side by side, and either of you can ask for the result to be deleted."

### 7. beauty-score-showdown (87)

- Line 366 featuresHeading (14 words): replace with "Both of you get the same space and the same kind of note."
- Line 367 featuresIntro: replace with "Scores are playful and notes are kind, so the game stays about fun."
- Line 371 body: replace "Both portraits appear at equal size with a score" with "Both portraits sit side by side with a score".
- Line 372 points: replace "Equal presentation" with "Both portraits side by side".
- Line 377 body: replace "Instead of naming a winner, the card gives each of you something to try in your next photo." with "The card gives each of you something to try in your next photo."
- Line 378 points: replace "No winner declared" with "Tips for your next photo".
- Line 393 body: replace "You might both learn that your lighting needs work, and you leave with a card to post if you both agree." with "You might both learn that your lighting needs work. Then you have a card to post if you both agree."
- Line 398 answer, last sentence: replace "It does not choose a winner, rank people or publish a leaderboard." with "Nobody wins and nothing is published."
- Line 400 answer: replace with "No. Both photos are treated the same, and the scores are impressions of photos, so there is nothing to win. The card never ranks anyone against a wider group."
- Line 405 answer: replace "Yes, with their consent, and only for adults (18+)." with "Yes, if they are an adult (18+) and agree first."

### 8. face-shape-analyzer (90), optional only

- Line 460 answer: replace "then delete the upload if you want it gone before your salon visit." with "then delete the upload whenever you like."

### 9. skin-analysis (86)

- Line 480 featuresHeading: replace "Your photo is zoomed in and described in plain words." with "Your photo gets close-ups with a label on each one."
- Line 485 body: replace "It describes visible appearance only, so there is no score and no diagnosis." with "Nothing is graded or scored."
- Line 486 points: replace ["Real photo detail", "Clear, simple labels", "No diagnosis or scoring"] with ["Real photo detail", "Short labels", "Nothing graded"]. (Hero, use case 1, FAQ 1 and FAQ 3 keep the "does not diagnose" limit.)
- Line 496 title: replace "Your under-eye area gets a close-up with a plain label." with "Your under-eye area gets its own close-up."
- Line 497 body: replace "Notes remind you that light and resolution affect what shows up, so you can read the picture as it is." with "A bright window and a sharp camera bring out the most, so retake it if the first try looks flat." (line 491 already gives the lighting and resolution caveat.)
- Line 498 points: replace ["Under-eye close-up", "Lighting caveats noted", "Calm, honest wording"] with ["Under-eye close-up", "Shows visible lines", "Plain wording"].

### 10. facial-landmarks (85)

- Line 543 points: replace "No dense mesh" with "Reads at a glance" (the heading and body already say no mesh).
- Line 553 title: replace "Light points follow the outline of your face." with "Your jaw and face edge get points too." (avoids repeating "light points" from story 1.)
- Line 554 body: replace with "A short line of points follows your jaw and the edge of your face, and your photo stays intact. Read the outline against your own photo at full size, then compare it with a retake in softer light to see how the points shift."
- Line 555 points: replace ["Jaw and outline points", "Photo stays intact", "Full-size view"] with ["Jaw and outline points", "Full-size view", "Compare with a retake"].
- Line 571 FAQ 3 (duplicates FAQ 1 and the hero): replace the whole entry with ["What can I do with a facial landmarks map?", "Keep it beside you while you practice a makeup look, or show it to a stylist or makeup artist so you can point at the exact area you mean. It is one image on your phone, ready whenever you need it."].
- Line 576 answer: replace "Only with their consent, and only for adults (18+)." with "Yes, if they are an adult (18+) and agree first."
