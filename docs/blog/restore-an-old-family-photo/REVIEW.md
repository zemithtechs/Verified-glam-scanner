# Independent review: /blog/restore-an-old-family-photo

Reviewed 2026-11-15 against the rendered page on localhost:3100 (1440 and 390 px, Playwright), the raw HTML (view-source equivalent), `lib/blog-posts.ts` (lines 282-465), `lib/pricing.ts`, the research brief, the owner's standards file, and live re-reads of every cited source. No source files were edited.

## Scores (0 to 100)

| Area | Score | One-line reason |
|---|---|---|
| Content value | 79 | Damage guide, wet-photo triage, scan checklist and honest comparison are things the top results lack. Still missing colorize, print-size/upscale, repair order and a manual-fix walkthrough. |
| Accuracy | 83 | Nearly every conservation and scanning claim matches its source. A few overreaches and unsourced product claims (below). |
| Human voice | 71 | No em or en dashes (0 found in source and rendered text), contractions used, no banned words. But "X says Y" skeleton repeats about 20 times and several lines are filler. |
| SEO / GEO | 64 | Content structure is good. Canonical, og:url and schema URLs point at the wrong host (real bug), author is an Organization, FAQ answers are 36-46 words, only the hero has ImageObject data. |
| UX | 80 | 18px / 31.5px serif body, sticky TOC, 4 CTAs plus sidebar, no horizontal page scroll. The mobile decision table clips 2 of 4 columns with no hint that it scrolls. |
| Overall | 75 | Strong draft. Fix the canonical host bug and the unverified claims before it goes live. |

## Must-fix

### 1. Canonical, og:url and schema `url` use the image host (technical, blocks ranking)
Rendered HTML: `<link rel="canonical" href="https://images.aibeautystyling.com/blog/restore-an-old-family-photo"/>`, same host in `og:url`, BlogPosting `url` and `mainEntityOfPage`, and the BreadcrumbList item 3. The Home and Guides breadcrumb items use `aibeautystyling.com`, so the list mixes hosts. Cause: `absoluteUrl()` in `lib/seo-meta.ts` line 15 routes every path through `imageUrl()` (IMAGE_BASE), so page paths get the R2 host. Likely affects every page, not just this post.
Fix: only run `imageUrl()` for asset paths (`/img/`, `/blog/<slug>/<file>.webp`); build page URLs from `SITE.url`. Expected canonical: `https://aibeautystyling.com/blog/restore-an-old-family-photo`.
Also remember `robots` is noindex while `SITE_INDEXABLE` is false (correct for now, flip on cutover).

### 2. "no card needed" is not supported anywhere in the repo
Appears in the damage-guide CTA, step 2 of the tool steps and the last FAQ ("so that's two results with no card needed"). `lib/pricing.ts` and the pricing page only say the 10 starter credits exist (matches), and that the yearly trial needs no charge before it ends. Nothing states the starter credits need no card.
Replace: "New accounts start with 10 free credits, enough for two results." and FAQ: "A new account starts with 10 credits and each result costs 5 credits, so that is two free results. After that, the monthly plan is $10 for 200 credits." Only restore "no card" if the owner confirms it in the signup flow.

### 3. Android app CTA makes an unverified product claim
Text: "Photograph a print, then repair it with the same account in our Android app." I could not confirm the Play listing (com.verifiedglam.beauty_scanner) has Old Photo Restoration, camera capture of prints and shared login. Verify, otherwise use: "Prefer your phone? Get the AI Beauty Styling app on Google Play, or use the web app in any browser."

### 4. "Scan in color even if the print looks black and white, so toning and stains are recorded"
The tip itself is supported: FADGI section 3.8 notes say "all master files from both color and black and white originals are to be imaged in 16-bit color at or above 3-star performance" (1 and 2 star allow grayscale or color). The reason given is ours, not FADGI's (FADGI cites subtle texture, tone and color differences). Reword: "FADGI says black and white prints should be scanned in color at its upper levels, because subtle tone and color differences are part of the print's character. Color also keeps sepia toning and stains for later." Attribute explicitly.

### 5. Overreach on what FADGI says about dust removal
Step 4: "FADGI says masters should document the original as it is, with no dust removal or color restoration." FADGI's actual text: digitized material "should document the appearance of the original at the time of capture"; it lists "removal of blemishes in the original such as stains, dust, or scratches" among enhancements "that should be avoided" and says traditional contrast and brightness adjustments "may be allowed". It says nothing about scanner hardware dust removal. Replace: "FADGI says a digitized master should show the original as it was at capture, and lists removing dust, stains and scratches among edits to avoid. Switch off the scanner's automatic dust and scratch removal, and do your repairs on a copy."

### 6. Unsourced or unverified product claims in the comparison table
- Photoshop row: "Healing tools and AI-assisted filters" and "it's a subscription". Adobe pages were blocked, so nothing was verified. Use: "Photoshop (Adobe): healing tools and an AI Photo Restoration filter, price on Adobe's pricing page." and link adobe.com only if the owner confirms the claim there.
- Remini and Google Photos editor appear in the table but not in Sources. Add sources or drop Remini (price "not published" plus no source adds nothing).
- MyHeritage: "needs a free account" and "photos uploaded without completing signup are deleted" (privacy callout). My static fetch returned only a nav shell, and a headless render did not reproduce the text. Re-verify in a real browser on the day of publishing; if not reproduced, cut the privacy sentence.

### 7. Mold is mentioned as "don't clean it" but with no health caution
Table row "Mold: Don't try to clean it". A skeptical reader will ask whether it is safe to hold. I did not verify a source in this review. Either add a line sourced from NEDCC or the Library of Congress (for example, wear gloves, keep it away from other items) after checking the exact wording, or leave out any health advice rather than invent it.

### 8. Weak E-E-A-T in schema
`author` is `{"@type":"Organization","name":"AI Beauty Styling editorial team"}`. Use a Person (the founder or a named editor) with a bio page, or keep Organization but add `reviewedBy`/credentials. Also add `ImageObject` with `creditText`, `license` and `acquireLicensePage` for the three CC BY-SA Commons images, and use the post hero (not the generic `/img/results/old-photo-restoration.png`) for `og:image` and `twitter:image`. The og:image alt "Old Photo Restoration example result" is generic.

### 9. FAQ answers are slightly short for citation and one is off-pattern
Word counts: 42, 46, 37, 38, 42, 38, 39, 36, 36. Target 40-80, answer first. Lengthen the five under 40 with one concrete number or source each. Example, "Should I clean an old photo before scanning?": "No, only remove loose dust. Use an air bulb blower, not canned air or a brush, because the Library of Congress says even soft brushes can scratch photographs. Never wipe or wet-clean a dry print at home. Wipe the scanner glass instead, since dust on the glass ends up in your scan, then clean the file digitally on a copy." (60 words.)

### 10. Mobile table clips with no cue
At 390 px the damage table is 599 px wide inside a 348 px container (`overflow-x: auto`); only "What you see" and "First step" show, and the key columns (repair route, call a conservator) are off screen. Fix: add a visible "Swipe for more" hint or fade edge, or stack rows as cards under 640 px (each damage becomes a card with 3 labeled lines).

## Humanizer: worst 15 lines and rewrites

| # | Current | Problem | Rewrite |
|---|---|---|---|
| 1 | "The order you do things in matters more than the software." | Generic opener claim, then three-beat list | "Software matters less than order. Protect the print first, scan second, repair a copy last." |
| 2 | "Damage type decides everything that follows." | Filler thesis | "Dust and fading you can fix at home. Wet or stuck prints cannot wait." |
| 3 | "so the clock is real." | Filler cliche | "so a wet photo can't wait for the weekend." |
| 4 | "Most of the damage people do at home comes from trying to help, so the don't list matters more than the do list." | Unsourced generalization | "The don't list matters more than the do list: tape, glue and wet cleaning are the usual home mistakes." (still opinion, label as ours) |
| 5 | "NEDCC adds that skin oils can cause bleaching or silver mirroring over time." / "NEDCC says..." / "FADGI says..." (about 20 "says") | Same skeleton every paragraph | Vary: "Skin oils can bleach a print or leave a silver mirror (NEDCC)." Put the source in a parenthesis or link and lead with the advice. |
| 6 | "Take a phone photo before you do anything else" callout body: "NEDCC advises photographing the damage before and during salvage. If you have the negative..." | Reporter voice, no "we" | "Take a phone photo of the damage first. NEDCC advises it before and during salvage. And if you still have the negative or a digital file, a reprint may be worth more than saving the wet print." |
| 7 | "A join in the image is easier to fix than taped paper is to undo." | Awkward, inverted | "A seam in the image is easy to retouch. Tape on the back is almost impossible to undo." |
| 8 | "At home, scanning at 600 dpi if your scanner allows it simply gives a repair tool more to work with, and gives you room to enlarge." | "simply", doubled "gives" | "At home, 600 dpi is a good default: more detail for the repair tool and room to enlarge." |
| 9 | "That's the honest limit of every AI restorer, ours included." | Good idea, vague | "Every AI restorer does this, ours included." |
| 10 | "Where we couldn't confirm a price, it says so." | Passive, fine but flat | "Where we couldn't confirm a price, we say so." |
| 11 | "The table below lists what we could confirm on 2026-11-15." | Duplicates caption "as checked on 2026-11-15" | Delete the sentence; keep the caption. |
| 12 | Key takeaway 4: "Free editors handle dust and small scratches, and AI restoration handles fading and cracks faster." | Parallel "handle ... handles" | "Free editors fix dust and small scratches. AI restoration is faster on fading and cracks." |
| 13 | Summary: "Triage the damage, protect the print, scan flat and untouched, repair a copy, check every face, then keep the original and back up the scan three ways." | Six-beat list, mechanical | "Triage first, scan flat, repair a copy, check every face, and keep the original." |
| 14 | "Somebody hands you a shoebox of prints, or you find one portrait with a crease through the middle of a face you love." | Good voice, but the exact keyword is missing from the first 100 words | "Restoring an old family photo starts before any software: somebody hands you a shoebox, or one portrait has a crease through a face you love." |
| 15 | "A professional is worth paying for when a face is missing or the photo is the only record of someone." | Fine, but the paragraph ends on "treat it as a rough guide, not a rate card" (cliche) | "Treat the vendor price range as a rough guide: it comes from one company's marketing page." |

Other voice notes against my-voice: the post has one analogy or aside per article target; it has none. Add one real-life comparison (for example "scanning before repairing is like photographing a room before cleaning it") and a one-line specific closer after the final CTA. No banned words found. No bold used mechanically. Headings are sentence case. Passive hedges are low.

## Fact check summary (sources opened 2026-11-15)

Verified exact: LOC 30 to 50% RH, 70F or below, less than 5% in 24 hours, ISO 18902 and PAT, attics/basements/vents/radiators/exterior walls, "even soft brushes can scratch", air bulb not canned air, clean hands or nitrile gloves, soft graphite pencil, no clips/rubber bands/tape/sticky notes, avoid magnetic or sticky pages. NEDCC 5.3 "doubles (approximately) with each 10F increase", tape/rubber cement/rusting clips/dry rubber bands, self-stick pages acidic, oils cause bleaching or silver mirroring. NEDCC 3.7 mold within 48 hours at 60% RH and 70F, rinse in "a tray of clean water" only if visibly dirty and emulsion intact, face up air drying, freeze if cannot dry, vacuum thermal drying mottles and sticks gelatin photographs, photograph damage before and during salvage, "may not be the best use of resources" if negative or digital file exists. National Archives repairing: "Wet or currently pest-infested materials need quick action", stuck, mold, many pieces, rolled items, AIC Find a Professional. National Archives digitizing: 3-2-1 verbatim, Latin letters and hyphens/underscores, who/what/where/when, keep originals. FADGI: 200/250/400/600 ppi, 8/8/8 or 16/16 bit, TIFF or JPEG 2000, "tightly curled materials must not be forced to lay flat", "stop immediately and seek assistance". MemoryCherish: "From $38 per photo", "$50 to $500" (it says "local restoration studios often charge $50 to $500"). Google PhotoScan: scanner app from Google Photos, Install button, 4.6 stars, 50M+.

Issues: items 4, 5, 6, 7 above, plus:
- "Mark who and when on the back ... never a pen": LOC says pencil only "if absolutely necessary" and prefers marking housing. Say: "If you must write on a print, use a soft graphite pencil on the back near the edge; marking the folder or sleeve is better."
- "For a wallet-size print, you can go higher" is vendor advice (MemoryCherish says 1200 dpi) with no cite. Add "MemoryCherish suggests 1200 dpi for wallet-size prints" or delete.
- "600 gives a repair tool more detail and lets you enlarge" is our reasoning; fine, but note file size: a 4 x 6 inch print at 600 ppi, 16-bit RGB is about 50 MB uncompressed. Add one line so readers do not give up, and say what size/format our tool accepts (not verified in this review; check the tool's upload limit).
- Table row "Fading: leave it alone and store it away from light" has no source; the table source line credits NA and NEDCC for the whole table although several cells are editorial. Change label to "Compiled by us from National Archives and NEDCC guidance; repair routes are our advice."
- ppi and dpi are used interchangeably. Add one clause: "ppi (pixels per inch) and dpi are used interchangeably by scanner software."
- Pricing facts confirmed against `lib/pricing.ts`: 5 credits per result, 10 free credits, 2 free results, $10 per month for 200 credits, 40 results. The post correctly omits the yearly price. `lib/catalog.ts` still lists Old Photo Restoration at 1 credit (noted in the brief): fix before publishing, because the tool page may disagree with the post.

## Value and intent: what is still missing vs top results

I re-read Krea (2,347 words), PhotoScanRestore (1,621) and MemoryCherish (4,002) in Chromium. Our post is ahead on safety triage, sources, 3-2-1 and a neutral table. Gaps a searcher will go back to Google for:
1. Colorize (Krea Step 5; a top "restore old photo" side-intent). Add one short H3 with an honest limit: colors are guessed, and FADGI says colorization is not appropriate for masters.
2. Print or upscale the finished photo (Krea Step 6): which size you can print from a 600 dpi scan, how to export (JPEG for sharing, TIFF kept).
3. Repair order (PhotoScanRestore Step 3): global tone and crop first, big damage next, dust last. Fits the existing "Scan old photos" steps and a GIMP walkthrough in 4 or 5 lines.
4. Photos in frames or behind glass, and photos stuck to album pages (partly covered in the wet section, not in the damage table).
5. A realistic "how long" and "how many photos" line for a shoebox (batch workflow: scan 20 at a time, label files, repair only the keepers).
6. Identify people: write names and dates while relatives are alive. Cheap, high value, not in the post.
Is it recycling anything? No copied text. The 600 dpi plus TIFF advice is common to Krea and MemoryCherish, but here it is anchored to FADGI. The "Short on time? Stop here" summary and the 3-2-1 box are standard SERP content; original parts are the damage guide, wet-photo triage with sources, and the FADGI table.
Is the original structure correct? Yes. Damage guide: useful and correct. Scan checklist: useful, fix items 4 and 5. Comparison table: useful if the unverified cells are fixed. 3-2-1: correct and verbatim.

## SEO and GEO

Passed: title 58 chars and contains the keyword in natural wording ("How to restore an old family photo without making it worse"); meta description 150 chars; one H1; 7 H2s with H3 nested; TOC present (sticky "On this page"); Key Takeaways box; FAQPage, BlogPosting and BreadcrumbList all present and parsed; external links all `rel="noopener noreferrer"` and open in a new tab; sources list with accessed dates; images have alt text, caption and credit; CC BY-SA credits include author, license and Commons link (correct format: title/author, license, via Wikimedia Commons; the MNHS photo credit matches the Commons page). Also confirmed: only one H1, 0 broken internal links.
Improve:
- Keyword placement: exact phrase appears in the H1 and once in body text ("There isn't one best way to restore an old family photo"). Add to the first paragraph (see rewrite 14) and in one H2, for example "How to restore an old family photo with AI Beauty Styling" for the tool section. Long tails present but could be used: "scan old photos", "fix a torn photo", "water damaged photos". Add "free" explicitly to one H2: "Free and paid ways to restore an old family photo".
- External links are only to authorities and one vendor (MemoryCherish, a competing service). A rel="nofollow" is not required, but consider replacing the vendor link with a neutral reference or accept it with the price caveat already shown.
- Anchor text: "Google Play listing", "NEDCC Leaflet 3.7", "National Archives" are fine. The "Compiled from National Archives and NEDCC guidance" source link points at one page only.
- Citation-readiness for AI answers: the three wet-photo, 3-2-1 and scan-level facts are quotable and attributed. Add a 2-sentence "quick answer" paragraph directly under H1 that restates the order (triage, scan flat at 600 dpi as TIFF, repair a copy, keep the original) with the keyword.
- `dateModified` equals the review date; keep it updated only for real edits.
- Image alt for the hero is long (118 chars); shorten to "Cracked sepia couple portrait next to its restored black and white version".

## UX (1440 and 390)

- Body text 18px with 31.5px line height at 628px measure (desktop); 19.4px intro. Readable. Table text and captions are 11-15px, acceptable.
- No horizontal page scroll at either width. Mobile tables scroll inside their container with a sticky first column; see item 10.
- CTAs: inline tool CTA after the first paragraph of damage guide, an app CTA mid-article, a tool CTA at the end, plus a sidebar "Try it on the web / Get the app" card. Good count. Wording is clear. Problem: the first inline CTA says "Restore this photo in a few minutes" before the reader has scanned anything, and sits above the wet-photo warning. A reader with a wet photo sees a sales prompt first. Move it below the decision table or after the scanning section.
- Both Play buttons use the same package id; label is "Get it on Google Play" (fine). The app CTA on mobile is full width.
- I could not reproduce any cut-off text. During a scripted scroll two lazy images were still loading; they were reachable (200 from the image host) so this is not a bug, but check lazy-load shimmer on a slow connection.

## Nice-to-haves

- Add a before-and-after pair with a different damage type (stain or tear) so the single hero is not the only evidence.
- Add a one-page printable checklist (PDF) of the damage table and scan steps, linkable for backlinks.
- Replace the "Sources" heading text with "Sources and further reading" and group by topic (handling, scanning, storage).
- Add `HowTo`-style structure to the scan checklist only if you accept Google no longer shows HowTo rich results; the `steps` block is already clear without it.
- Link the FAQ answer about AI invention to the `/blog/natural-looking-portrait-retouch` guide.
- Add a short "How we wrote this" note listing what we checked and when (we did not test a physical print; do not claim testing).
