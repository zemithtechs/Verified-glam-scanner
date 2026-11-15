# Research brief: /blog/restore-an-old-family-photo

Date of research: 2026-11-15. Browser: Playwright Chromium (headless) plus web search for SERP discovery. Screenshots: `web-hub/media/blog/restore-an-old-family-photo/research/` (15 PNGs). Images: `web-hub/media/blog/restore-an-old-family-photo/images/` plus `credits.json`.

Repo notes the writer must know:
- A post with this slug already exists in `web-hub/lib/blog-posts.ts` (title "How to prepare an old family photo for restoration", published 2026-11-10, ~1,000 words, no tables, 3 FAQs, no external sources). The new post should replace and extend it, keeping the slug.
- `web-hub/.gitignore` ignores the whole `media/` folder, so the downloaded images and screenshots are not committed. Images used in the post must be moved to wherever site images live (R2 or public) before publishing.
- Price conflict inside our own repo: `lib/pricing.ts` says 5 credits per result, 10 free credits, $10 per month for 200 credits (also $60 per year for 2,400 credits with a 3 day trial, pay as you go $0.075 per credit). `lib/catalog.ts` still lists Old Photo Restoration at `credits: 1`. Use the pricing.ts numbers (matches the brief) and have someone fix the catalog entry.
- Existing guide slugs on the site (for internal links): find-your-face-shape-from-a-photo, what-facial-symmetry-really-shows, seasonal-color-palette-photo-guide, natural-looking-portrait-retouch, plan-a-hair-change-with-a-preview, virtual-makeup-try-on-lighting, virtual-outfit-preview-limits, creative-portrait-effects-responsibly. Most relevant: natural-looking-portrait-retouch (keeping results believable) and creative-portrait-effects-responsibly. Tools: /old-photo-restoration, /ai-face-enhancer, /face-blur, /merge-portraits.
- The video transcript (UK photo organiser) was NOT included in the task I received, so I could not read it. I only evaluated its two claims as you described them (see section 5).

---

## 1. Search intent and reader goals

Primary intent: informational and "do it myself now". The searcher has a physical photo (or a box of them) that is torn, faded, creased, stained or water damaged, and wants to (a) not make it worse, (b) get it into a digital file, (c) repair or improve the digital copy, free if possible, and (d) know when to pay a professional.

Reader goals the post must satisfy so they do not go back to Google:
1. Triage: what kind of damage do I have and which route fits it (decision guide).
2. Do no harm: what to do and what not to do with the physical print first.
3. Wet, stuck or moldy photos are an emergency and need a different answer from a faded print.
4. How to scan or photograph it properly (dpi, file format, settings) with real numbers.
5. Which tool for which job, with honest prices (free, editors, AI, professional).
6. How to check the result for invented detail, especially faces.
7. How to store and back up so it does not happen again (3-2-1).

Secondary intents: "old photo restoration online free" (commercial investigation), "scan old photos" (tool and settings), "repair water damaged photos" (emergency), "fix a torn photo" (physical vs digital repair).

## 2. Competitor analysis (browsed in Chromium, full page screenshots saved)

| # | Page (URL) | Words (approx, body) | H2 outline (short) | Format | Gaps |
|---|---|---|---|---|---|
| 1 | HowStuffWorks, electronics.howstuffworks.com/cameras-photography/tips/how-to-restore-old-family-photos.htm | 380 on page 1 of 4 | Multi page slideshow, no useful headings on page 1 | Paginated, 1 image, ads | Very old, no scan numbers, no AI, mentions pro price "as little as $5" (dated), no wet photo guidance |
| 2 | TechRadar, techradar.com/computing/software/im-a-photoshop-pro-heres-how-to-restore-your-old-family-photos-this-christmas | 2,270 | Digitize; Neural Filters; restore color; remove blemishes; restore for free | Step guide, 32 images, no table, no FAQ | Photoshop centric, no dpi/format, no storage, no damage triage, no wet photos, colorization caveat only |
| 3 | TechRadar, techradar.com/how-to/photography-video-capture/cameras/restore-old-photos-how-to-rescue-vintage-prints-and-family-pictures-1320889 | 1,650 | "How to restore old photos: steps 1 to 9" | Numbered steps, multipage | Older, manual Photoshop healing only, no AI comparison, no emergency guidance |
| 4 | Digital Photography School, digital-photography-school.com/how-to-restore-old-damaged-photos/ | Body did not render headless (3 words); text from comments only, dated 2013-08-22 | Photoshop levels, curves, spot fixes | Tutorial plus long comment thread | Dated (2013), the comments show readers still asking about dpi (one says 300 dpi is fine unless enlarging), unanswered reader pain |
| 5 | Adobe, adobe.com/in/creativecloud/roc/blog/photography/how-to-bring-old-photos-back-to-life | Access Denied in browser | n/a | n/a | Could not open. Search snippets only: Neural Filter under Filter > Neural Filters > Photo Restoration, Spot Healing brush |
| 6 | BeFunky, befunky.com/learn/restore-damaged-old-photos | 860 | Can a damaged photo be restored; 5 ways (scratches, sun damage or fading, dirt and dust, creases and cracks, clarify details) | 17 images, no table, no FAQ | Product led, thin, nothing on scanning or physical handling; search snippet said Old Photo Restorer needs BeFunky Plus (not re-verified on page) |
| 7 | Krea, krea.ai/blog/how-to-restore-old-photos | 2,040 | Protect the original; digitize (flatbed, phone); diagnose damage; repair; colorize; upscale for print; check the result; AI or professional; store originals; FAQ | 2 tables, 7 images, FAQ. Updated 2026-10-27 | Best structured competitor. Says 600 dpi, 1200 for wallet photos, TIFF/PNG. Gaps: no sources, no wet or moldy guidance, no 3-2-1, no comparison of other tools (promotes Krea), no price table |
| 8 | Adorama (42West), adorama.com/alc/basic-photo-restoration-restore-old-photos-using-photoshop/ | 2,460 | 7 steps in Photoshop; FAQ (Can damaged photos be restored; why photos fade; best free app) | 12 images, FAQ | Photoshop only, 2022, no dpi numbers, no AI, no emergency guidance |
| 9 | PhotoshopBuzz, photoshopbuzz.com/how-to-restore-old-photo/ | 1,280 | 6 steps: upload, crop and adjust, copy image, start with major stuff, reduce dust speckles, color correction | 31 images, 2023-10-06 | Pure Photoshop tutorial, no scanning, no storage, no free options |
| 10 | MemoryCherish, memorycherish.com/how-to-restore-old-photos/ | 3,570 | Home guide plus 3 step service pitch; FAQ of ~30 questions; "First, make a good digital copy", "Handle and clean old prints gently", "When to skip DIY" | 132 images, big FAQ, service sales page | Strong practical bits (scan 600 dpi, 1200 for wallet size, TIFF or high quality JPEG, dust with soft brush or puff of air, no water or cleaners on image side) but it is a sales page: the only cost data is its own "from $38 per photo" and "studios charge $50 to $500" |
| 11 | PhotoScanRestore, photoscanrestore.com/guides/old-photo-repair | 1,380 | Protect original; repair-ready scan; repair in the right order; when automatic is enough; save properly; when to use a professional; FAQ ("Should I clean an old photo before scanning?") | 1 table, FAQ, updated 2026-09-17 | App promotion, no sources, no wet photo steps |
| 12 | Restory, restory.photos/how-to/fix-torn-photo | 1,350 | Handle carefully; capture (clean tear, missing pieces, crease); upload; choose features; verify; missing face; real example; comparing options; FAQ | FAQ, 1 image | Good torn photo specifics (physical vs digital repair, scan pieces) but tool promotion only |
| 13 | aboutphotography.blog/blog/how-to-restore-old-photos | 2,240 | Opens with a disclaimer: "a collaboration and not my work"; H2s are about Yasuhiro Ogawa in Kyoto | Off topic | Page title promises a restoration guide but headings are about an unrelated photographer. Weak, thin on the topic, ranking on authority |
| 14 | Search-surfaced extras not browsed in full: restory how-to flood-damaged guide, photoscanrestore, imageupscaler.world, zsky.ai, vanceai | n/a | n/a | n/a | Mostly vendors |

Pattern across the top results: almost all are "scan, then Photoshop or an AI app" tutorials written by a tool vendor. None cites a conservation authority (Library of Congress, NEDCC, National Archives, FADGI). None gives a damage-type decision guide that includes "stop, do not scan, call a conservator". None has a neutral multi tool price comparison. Few mention backups.

What they claim that we should verify or avoid repeating:
- "600 dpi, 1200 for wallet size" (Krea, MemoryCherish): reasonable rule of thumb, FADGI's top level for prints is 600 ppi (see section 3). Present as a rule of thumb.
- "Studios charge $50 to $500" (MemoryCherish): vendor claim, not independent.
- "Photos should be restored within 2 to 3 days" and "UV lamp to dry photos" or "rinse with distilled water" (search snippets of water damage vendors): NOT supported by NEDCC, which gives a 48 hour mold window at 60% RH and 70F and says drying face up with moving air or freezing. Do not repeat the UV lamp claim.
- Colorization as an easy step: TechRadar itself warns it is patchy. FADGI says colorization is not appropriate for archival masters.

## 3. Verified fact list (source, exact URL, date read 2026-11-15)

Storage and handling
1. Library of Congress, https://www.loc.gov/preservation/care/photo.html: store at 70F or below with 30 to 50% relative humidity; RH should fluctuate less than 5% in 24 hours; for color photos and film negatives, 40F or below is recommended for cold storage. Avoid attics, basements, vents, fireplaces, radiators, exterior walls. Enclosures must pass ISO 18902 including the Photographic Activity Test (PAT). Plastic only uncoated polyester, polyethylene or polypropylene, and avoid plastic in uncontrolled environments above 70% RH (emulsions may stick), and never for nitrate or acetate negatives. Handle by edges, clean hands or clean nitrile gloves, avoid touching the image area. Remove loose dust with an air bulb blower, not canned air, and "even soft brushes can scratch". Do not use paper clips, rubber bands, self-adhesive tape, sticky notes, glue, or albums with magnetic or sticky pages. Mark with soft graphite pencil on the back near the edge. Keep negatives separate from prints. The page does not cover wet photos or scanning, and sends readers to digitalpreservation.gov and the AIC conservator directory.
2. NEDCC Leaflet 5.3 Care of Photographs, https://nedcc.org/free-resources/preservation-leaflets/5.-photographs/5.3-care-of-photographs: chemical deterioration "doubles (approximately) with each 10F increase in temperature"; set point 70F or below, mixed use 65 to 70F; RH 30 to 50% with daily swings under 5%; avoid kraft and glassine paper, PVC, acidic groundwood sleeves, dry rubber bands, rusting clips, pressure sensitive tape, rubber cement, animal glue; self-stick album pages are acidic and can bond to photos, use corner mounts and acid-free paper; look for ISO 18902 and the PAT logo; clean dry hands or clean gloves since oils can cause bleaching or silver mirroring; display low light, not on exterior walls, bathrooms or over heat. The leaflet does not give cleaning methods.

Wet, stuck, moldy
3. NEDCC Leaflet 3.7 Emergency Salvage of Wet Photographs, https://nedcc.org/free-resources/preservation-leaflets/3.-emergency-management/3.7-emergency-salvage-of-wet-photographs (note: the earlier URL without "emergency-management" 404s): mold can grow "within 48 hours at 60% relative humidity and 70F". Do not pull stuck photos apart: "If they are stuck together or adhered to glass, they should be bagged while still damp and frozen" and "It will be necessary to consult with a conservator". Freeze when air drying is not possible, interleave with non-woven polyester or waxed paper, seal in a labeled bag. Air dry: separate from enclosures and frames, rinse only if visibly dirty and the emulsion is intact "in a tray of clean water", drain, "spread the photographs out to dry, face up", keep air moving with fans. Vacuum thermal drying is not recommended for photographs (gelatin prints mottle and stick). Take digital photos of damage before and during salvage. Framed prints stuck to glass can sometimes be imaged through the glass. If you have the negative or a digital file, saving the damaged print may not be the best use of resources. Strongly adhered prints in albums should be removed by a conservator.
4. National Archives, https://www.archives.gov/preservation/family-archives/repairing.html: contact a conservator if the problem cannot be solved with storage and handling. "Wet or currently pest-infested materials need quick action". Examples: items stuck together, mold, many pieces, rolled items that tear on unrolling. AIC "Find a Professional" directory searchable by location, specialization and service. (The page has no tape or cleaning advice.)

Scanning and digital files
5. FADGI Technical Guidelines for Digitizing Cultural Heritage Materials, Third Edition (2023), https://www.digitizationguidelines.gov/guidelines/FADGITechnicalGuidelinesforDigitizingCulturalHeritageMaterials_ThirdEdition_05092023.pdf (I downloaded and read section 3.8 "Prints and Photographs", pp. 50 to 53). Master file format TIFF or JPEG 2000. Resolution by star level: 1 star 200 ppi, 2 star 250 ppi, 3 star 400 ppi, 4 star 600 ppi ("in rare cases, resolutions higher than 600 ppi may be needed"). Bit depth: 1 and 2 star 8 bit, 3 star 8 or 16 bit, 4 star 16 bit. Color space Adobe RGB (1998) or ProPhoto at 3 and 4 star. Flatbed scanners, planetary scanners and digital cameras are recommended; drum scanners are not. Text from FADGI: "the intent in scanning photographs is to maintain the smallest significant details" and tone and color accuracy matter "equal, if not more" than resolution. Glass to hold a print flat only if the original will not be harmed, "tightly curled materials must not be forced to lay flat", and "in any situation where there is potential harm to the original, stop immediately and seek assistance". Flatbed dust and dirt on the glass ends up in the file.
6. FADGI same document, front matter (p. 3 area): "Digitized material should document the appearance of the original at the time of capture, not what it may once have looked like if restored." Dust removal, color or tone enhancement and restoration are NOT allowed on master images. Adjustments may be made to separate access versions, labelled as such. Avoid colorization, color restoration, digital infill, removal of stains, dust or scratches on masters. FADGI also notes TIFF is the long standing master format but very large, and suggests JPEG 2000 for some uses. Note this is institutional archival standard, not a consumer requirement.
7. National Archives, https://www.archives.gov/preservation/family-archives/digitizing.html: 3-2-1 rule: "Three copies, stored on two different media, and one copy located off-site". Use only Latin letters A to Z in file names, hyphens or underscores not spaces, add who, what, where, when metadata. Keep the originals after digitizing because "digital files have their own preservation risks and can easily be lost". Avoid automatic feed scanners for fragile or valuable papers. The page gives no dpi or format and points to digitizationguidelines.gov.
8. Library of Congress FAQ, https://www.loc.gov/preservation/about/faqs/reformatting.html: resolution "depends on what is being digitized and the intended use of the digitized image"; refers to the FADGI guidelines.
9. Earlier agent (not re-opened by me): NEDCC Leaflet 5.1 says save scans as TIFF at a resolution high enough to capture detail, with metadata, keep redundant copies; negatives roughly 1890 to 1950 may be nitrate and flammable. Re-verify before quoting.
10. Independent consumer rule of thumb from search snippets only (not browsed): Family Tree Magazine suggests 600 dpi minimum if you want to enlarge to double size; many vendor guides say 300 to 600 dpi. Treat as consumer advice, cite FADGI for the top level.

Not found or not openable (do not cite)
- archives.gov/preservation/family-archives/photographs: 404. loc.gov/preservation/care/digital-photo.html: 404. digitalpreservation.gov/personalarchiving/documents/Scanning_Photos.pdf: 404. NEDCC leaflet 6.1 URL: 404.
- get.google.com/photoscan: 404 (page gone). Adobe pages (Photoshop plans, Lightroom plans, Neural Filters help, creativecloud blog): "Access Denied" to automated browser. Remini /pricing: 404. MyHeritage /plans: 404. I did not bypass the blocks.

## 4. Comparison table data (checked in the browser today unless marked)

| Option | What it is | Price as seen today | Source | Notes for the post |
|---|---|---|---|---|
| Google PhotoScan (phone scan app) | Free scanner app from Google Photos: glare free multi shot capture, auto crop with edge detection, perspective correction, smart rotation, saves to Google Photos | Free to install (Google Play shows an Install button, no price). 4.6 stars, 205K reviews, 50M+ downloads | https://play.google.com/store/apps/details?id=com.google.android.apps.photos.scanner | The official get.google.com/photoscan page is 404, so say "listed on Google Play". Scans only, does not repair damage. I could not verify the iOS listing |
| Google Photos editor | Basic sliders and suggested edits | Free to use (Help page lists tools, no price) | https://support.google.com/photos/answer/6128850 | The page lists generic edit tools, no restoration feature mentioned. Do not claim it restores photos |
| GIMP | Free open source editor, healing and clone tools, cross platform | Free. Current stable 3.2.8 (released 2026-11-02) | https://www.gimp.org/ and https://www.gimp.org/downloads/ | Steeper learning curve (opinion, label it as such) |
| Adobe Photoshop (Neural Filters Photo Restoration, healing tools) | Full manual and AI-assisted editor | Price not published (adobe.com pricing pages return Access Denied to automated browsers) | adobe.com/products/photoshop/pricing.html not openable | Say "subscription, check Adobe's pricing page". Per a search snippet, Photoshop's Photo Restoration filter sits under Filter, Neural Filters |
| Adobe Lightroom | Photo editor, tone and color | Price not published (page blocked) | not openable | Lightroom does not do healing of tears the way Photoshop does (do not claim, keep it as "better for tone and color", unverified, or leave out) |
| MyHeritage Photo Enhancer | Face focused AI enhancer, deep learning | Page says "Free signup is required" and photos uploaded without completing signup are deleted. A FAQ item "How much does it cost" exists but its answer did not expand for me, so price not published here. Page has a "Go Premium" link | https://www.myheritage.com/photo-enhancer | Say "needs a free MyHeritage account, price details are in their FAQ" without stating limits |
| Remini | AI photo enhancer, web app | Price not published (pricing page 404, landing page shows login only) | https://remini.ai/ (redirects to app.remini.ai) | Landing line: "AI photo and video enhancer, in one click" |
| BeFunky Old Photo Restorer | Browser editor | Per web search snippet: available to BeFunky Plus subscribers (not re-verified on the page); price not published | https://www.befunky.com/learn/restore-damaged-old-photos/ | Low confidence |
| Krea (competitor example) | AI editor with a restoration mode | Page says "Krea 3 edits need a free Krea account" | https://www.krea.ai/blog/how-to-restore-old-photos | Optional |
| AI Beauty Styling Old Photo Restoration (ours) | Repairs scratches, fade and blur in old family photos, browser | 5 credits per result; 10 free credits for a new account (2 free results); Pro $10 per month for 200 credits (40 results); yearly $60 for 2,400 credits with 3 day trial; pay as you go $0.075 per credit | web-hub/lib/pricing.ts and web-hub/app/pricing/page.tsx (read today) | Catalog entry says 1 credit, fix it. Do not claim it fixes torn or missing areas perfectly, our own existing post says it "makes a plausible guess" |
| Professional restorer | Human artist, digital or conservation level | No neutral source found. Vendor claims: MemoryCherish "from $38 per photo" and "studios charge $50 to $500" (https://memorycherish.com/how-to-restore-old-photos/); search snippets from other vendor guides gave $25 to $300 plus. No independent cost survey (Angi, HomeGuide, Consumer Reports) surfaced | Vendor pages | Write "vendors quote roughly tens to a few hundred dollars per photo, always get a written quote". Do not present a hard range as fact |
| Conservator (physical treatment) | Treats wet, stuck, moldy, many pieces | Price not published, quote based | AIC Find a Professional directory via https://www.archives.gov/preservation/family-archives/repairing.html | Required route for stuck or moldy photos |

## 5. Video transcript claims vs sources

The transcript itself was not provided to me. Evaluating the two claims you listed:
- "Scan before repair": SUPPORTED, with a nuance. FADGI (section 5 and 6 above) says the digital master should record the original as it is, with no dust removal, color restoration or infill, and enhancements go on a separate access copy. NEDCC 3.7 adds that photographing damage before and during salvage is advised. Careful wording: "scan first, keep that scan untouched, and work on a copy". Caveat: for wet or stuck photos, do not scan at all until a conservator advises, and torn pieces can be scanned separately.
- "No scrubbing or cleaners": SUPPORTED by Library of Congress (bulb blower, even soft brushes can scratch, no canned air) and NEDCC 3.7 (rinse only a wet, visibly dirty print with intact emulsion in clean water, and only as part of salvage). NEDCC 5.3 gives no cleaning methods. MemoryCherish says no water, household cleaners or damp cloth on the image side (vendor, consistent). Say "do not wet clean a dry print at home" and cite LOC.
- Unsupported by anything I read: that scanning at a particular dpi is "enough" for restoration, UV lamp drying, and "restore within 2 to 3 days" claims from vendor snippets.

## 6. People Also Ask and long tail (taken from SERP behavior and top page FAQs; I could not get Google's live PAA box because Google returned no results to the automated browser, so these come from FAQ sections of the ranking pages and search suggestions, not a captured PAA box)

| Question or phrase | Intent | Answer source |
|---|---|---|
| Can old, damaged photos be restored? (Adorama, MemoryCherish FAQs) | Reassurance, "is it worth trying" | Our decision guide and before and after example |
| What is the best way to scan an old photo at home? (MemoryCherish FAQ) | How-to with settings | FADGI numbers plus phone option |
| What dpi should I scan old photos at? | Specific number | 600 dpi rule of thumb; FADGI 4 star 600 ppi, 3 star 400 ppi |
| Should I clean an old photo before scanning? (PhotoScanRestore FAQ) | Do no harm | LOC bulb blower only |
| Can I fix a torn photo with tape? / how to fix a torn or faded photo | Do no harm, DIY | LOC and NEDCC: no tape or glue; scan pieces, repair digitally |
| How do I save water damaged photos? / are stuck photos salvageable? | Emergency | NEDCC 3.7: 48 hours, freeze, do not pull apart |
| Can AI restore a photo with missing face or piece? (Restory FAQ) | Expectation setting | Honest answer: it invents detail, compare to the original |
| What is the best free photo restoration app/tool? (Adorama FAQ) | Commercial comparison | Table in section 4 |
| How much does professional photo restoration cost? (MemoryCherish FAQ) | Price research | Vendor quoted ranges, get quotes |
| How should I store old photos after scanning? / do I keep the originals? | Preservation | LOC and NEDCC enclosures, National Archives keep originals, 3-2-1 |
| Is it safe to upload old family photos to a free online tool? | Privacy | Our privacy angle (face-blur link), MyHeritage note that photos uploaded without signup are deleted |
| old photo restoration online free no watermark; restore old photos with AI | Tool shopping | Table plus our 10 free credits (2 results) |

## 7. Information gain opportunities (what we add that top results lack)

1. A damage type decision guide: dry and faded, scratched or creased, torn in pieces, missing area, stained, wet and stuck, moldy. For each, the physical step, the scan step, the repair route, and when to stop and call a conservator. No top result has it.
2. A scanning checklist with real numbers from FADGI (600 ppi top level, 400 ppi next, 16 bit and TIFF) next to the consumer rule of thumb, so readers see why 600 dpi is common, and that FADGI is an archive standard.
3. A "what not to do" list from LOC and NEDCC (tape, glue, clips, rubber bands, self-stick pages, canned air, brushes, PVC, attics and basements, heat drying, pulling stuck photos apart).
4. The wet photo emergency box citing NEDCC 3.7 with the 48 hour mold window.
5. A neutral comparison table with honest "price not published" cells, and our own tool presented with the plain credit math (5 credits per result, 2 free results).
6. A 3-2-1 backup rule box with file naming and metadata from National Archives.
7. A "check the AI result" mini guide: compare faces with the original, expect invented detail where information is missing (our own existing post and Restory both say this), and the FADGI point that a restored image shows how it might have looked, not how the photo is, so keep the untouched scan.
8. Original visual: our own before and after pair (see section 8) as the hero evidence, with a plain description of what changed.

## 8. Images

Our own (open and described):
- `web-hub/media/img/results/old-photo-restoration.png`: side by side "Before" and "Restored" labels. Left: a sepia, cracked and creased studio portrait of a middle aged couple (woman with voluminous dark hair and floral blouse, man with glasses and a polka dot shirt), visible white crease lines across her face and chest, torn corners. Right: clean grayscale version with the cracks gone, faces and glasses sharp, soft grey background. Note the restored version is black and white, not the sepia tone of the original.
- `web-hub/media/img/tools/old-photo-restoration.png`: a creased color print of a couple (man with moustache, woman in floral blouse) lying on a wooden table, surface cracks and stained white border visible. Good for the "photograph it flat in even light" step.

Downloaded legally usable images (1,600 px wide previews, in `web-hub/media/blog/restore-an-old-family-photo/images/`, full metadata in `credits.json`):

| File | Shows | License | Author | Attribution text | Commons page |
|---|---|---|---|---|---|
| water-damaged-photographs-mnhs-01.jpg | Black and white print of St. Basil's Cathedral, gelatin dissolved and dripping, stuck to a backing | CC BY-SA 4.0 | Heritage Preservation Department, Minnesota Historical Society (photo by Bob Herskovitz) | "Water-damaged photo materials, Heritage Preservation Department, MNHS, CC BY-SA 4.0, via Wikimedia Commons" | https://commons.wikimedia.org/wiki/File:Water-damaged_photo_materials-01.jpg |
| water-damaged-photographs-mnhs-18.jpg | Album page of six small prints with mold or water spotting, held by photo corners | CC BY-SA 4.0 | same | "Water-damaged photo materials, Heritage Preservation Department, MNHS, CC BY-SA 4.0, via Wikimedia Commons" | https://commons.wikimedia.org/wiki/File:Water-damaged_photo_materials-18.jpg |
| family-photo-album-page-hungarian.jpg | Old album page with two small black and white photos and a torn out hole in the page | Public domain (per Commons, author unknown, "scanned own copy") | Unknown | "Hungarian family photo album, page 20, public domain, via Wikimedia Commons" | https://commons.wikimedia.org/wiki/File:Hungarian_family_photo_album,_page_20.jpg |
| photo-restoration-before-after-vuijlsteke.jpg | 1920s portrait of two girls, stained and yellow left, restored grayscale right | CC BY-SA 3.0 | Michel Vuijlsteke | "Anna and Germaine Sierens ca. 1924, photo restoration by Michel Vuijlsteke, CC BY-SA 3.0, via Wikimedia Commons" | https://commons.wikimedia.org/wiki/File:Photo_restoration,_before_and_after.jpg |
| epson-v850-flatbed-scanner-open.jpg | Flatbed photo scanner with lid open | CC BY-SA 4.0 | Santeri Viinamäki | "Epson V850 scanner, Santeri Viinamäki, CC BY-SA 4.0, via Wikimedia Commons" | https://commons.wikimedia.org/wiki/File:Epson_V850_scanner_open_20230920.jpg |

Licensing note: CC BY-SA requires attribution and that any adaptation (cropping is fine, edits and overlays count as adaptations) is shared under the same license. Use the files unaltered or with only resizing, with a visible credit line. The Vuijlsteke pair is a competitor free alternative to our own before and after, so prefer our own hero and use this one only if we want a second example. Images I rejected after viewing: a NYPL "torn in half" file (actually an etching, not a photo) and a framed marriage certificate. I did not find a clean public domain photo of a hand with cotton gloves or of a phone scanning a print.

## 9. Proposed outline

Working title: How to Restore an Old Family Photo: Scan It Safely, Fix It Free, Know When to Stop
Meta description idea: Torn, faded or water damaged? A step by step guide with the right scan settings, a damage by damage decision guide, free and AI tools compared, and when to call a conservator.
Target about 2,800 to 3,500 words, 3 to 4 tables, FAQ with 8 questions, schema Article plus FAQPage.

Key Takeaways draft (4 to 5 bullets):
- Triage first: if a photo is wet, stuck together or moldy, do not scan or pull it apart. Freeze it in a bag and ask a conservator (NEDCC).
- Handle by the edges, no tape, glue, clips or wet cleaning. Remove loose dust with a bulb blower, not canned air or a brush.
- Scan flat at 600 dpi if you can (FADGI's top level for prints is 600 ppi) and save a TIFF. Keep that file untouched and edit a copy.
- Free tools fix small damage, AI tools repair scratches and fade quickly, but they invent detail where the photo has none, so compare faces with the original.
- Keep the originals, store them in PAT tested enclosures at 70F or below and 30 to 50% humidity, and back up with the 3-2-1 rule.

H2 and H3 structure
1. H2 Quick answer: what to do with an old family photo today (3 to 5 sentence answer, then the Key Takeaways box)
2. H2 First, work out what kind of damage you have (decision table: damage, what it looks like, physical first step, best repair route, professional needed?). Rows: dust and light scratches, fading and yellowing, creases and cracks, torn or in pieces, missing corner or face, stains and spots, wet and stuck, mold.
   - H3 If the photo is wet or stuck: stop here (NEDCC steps, 48 hours, freezing, call box with AIC directory link)
3. H2 How to handle an old print without making it worse
   - H3 Do list (clean dry hands, edges, flat surface)
   - H3 Do not list (tape, glue, clips, rubber bands, self-stick pages, canned air, brushes, wet cleaning, forcing a curled print flat, heat drying)
4. H2 How to scan old photos: a checklist with real numbers
   - H3 Flatbed scanner settings (600 dpi, 16 bit if available, TIFF, color even for black and white, clean glass, no dust removal in the scanner, scan the border; FADGI table of star levels in a small table; consumer rule of thumb 300 to 600, 1200 for wallet size; label it as such)
   - H3 No scanner: photograph or use PhotoScan (flat, soft even light, no flash, straight down, fill the frame)
   - H3 Torn photos: scan each piece separately
   - H3 File names, metadata and the untouched master (National Archives naming)
5. H2 Which restoration route fits: free, AI, editor, or a professional (the comparison table from section 4)
   - H3 Free: phone editor and GIMP
   - H3 AI restoration (how it works, strengths, limits, privacy)
   - H3 Photoshop and manual healing
   - H3 Professional restorers and conservators (what each does, cost caveat)
6. H2 How to restore a photo with Old Photo Restoration (our tool): steps with before and after hero, credit math (5 credits per result, 10 free credits, Pro $10 for 200), then link to /ai-face-enhancer for soft faces after restoration, /face-blur to hide bystanders before sharing, /merge-portraits for combining two separate portraits of relatives (with permission)
7. H2 Check the result before you share it (compare faces, hair, clothing, text; what AI invented; keep both versions; FADGI note that a restored image is not a record of the original)
8. H2 Store and back up so you do not repeat this (LOC and NEDCC conditions, enclosures, avoid attics and basements, 3-2-1 box)
9. H2 Frequently asked questions (8 questions from section 6)
10. H2 Sources and further reading (external links list below)

Table ideas: (a) damage decision table, (b) FADGI scan levels, (c) tools comparison, (d) "do and do not" two column.

External links worth including (all verified to open today): LOC https://www.loc.gov/preservation/care/photo.html; NEDCC 5.3; NEDCC 3.7; National Archives digitizing and repairing pages; FADGI Third Edition PDF; AIC Find a Professional via the National Archives repairing page; Google PhotoScan on Google Play; GIMP.

Internal links: /old-photo-restoration (primary), /ai-face-enhancer, /face-blur, /merge-portraits, /pricing, /blog/natural-looking-portrait-retouch (keeping a retouch natural), /blog/creative-portrait-effects-responsibly.

FAQ list (final): Can old damaged photos be restored? What dpi should I scan old photos at? Should I clean an old photo before scanning? Can I fix a torn photo with tape? How do I save water damaged photos? Can AI restore a photo with a missing face? How much does professional restoration cost? Do I keep the originals?

## 10. Writer cautions

- Never state Adobe, Remini, MyHeritage, Lightroom or BeFunky prices: not verified. Use "price not published".
- Mark FADGI as an archival institution standard, 600 ppi as its top level, not a home requirement.
- Do not promise restoration of torn, missing or wet damaged areas. Wet or stuck photos: conservator.
- Credits math: 10 free credits at 5 per result equals 2 free results.
- Do not claim a free tool "removes the need for a professional"; do not use the UV lamp, distilled water rinse, or 2 to 3 day claims.
