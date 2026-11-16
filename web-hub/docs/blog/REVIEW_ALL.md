# Review of eight new blog posts

Reviewed 2026-11-16 against the local site (localhost:3100). Screenshots at 1440 and 390 are in media/blog/_template-checks/ (files named review-<slug>-<width>.png). Checks run: rendered HTML (title, description, one H1, canonical, og:image, JSON-LD BlogPosting, FAQPage, BreadcrumbList, dash scan), every internal link (no 4xx), every picture on images.aibeautystyling.com (no 404, no broken images at either width, no horizontal page scroll at 390), FAQ answer lengths (all 40 to 80 words), banned vocabulary scan, `npx tsc --noEmit` (clean), `npm run copy:check` (passed), U+2014 and U+2013 scan (none).

All titles are 53 to 58 characters once HTML entities are decoded. All descriptions are 131 to 146 characters. Headings render in Title Case through the site's titleCase helper, so source casing does not matter.

## Scores and changes

Scores are an overall judgement (facts, SEO, voice, duplication, UX), not the blog-analyze rubric.

| Post | Before | After | What changed |
|---|---|---|---|
| find-your-face-shape-from-a-photo | 86 | 90 | Heading "Not a Feeling" and "Honest Limits" rewritten. Price paragraph and FAQ cost answer reworded so they no longer match the other posts. App CTA headline and text made specific. |
| what-facial-symmetry-really-shows | 89 | 91 | Healthline claims (age, smoking, stomach sleeping, ruler method, apps, exercises) and the PLOS ONE close-up finding checked against the sources. Last H2 rewritten. FAQ cost answer now states 5 credits (it only said "check the tool page"). App CTA headline changed. |
| seasonal-color-palette-photo-guide | 88 | 90 | i-Perception study detail corrected: 96 and 75 observers saw 12 faces in the first experiment and 8 in the second. FAQ cost answer reworded. Healthline undertone claims and the "personal preference" line verified. |
| natural-looking-portrait-retouch | 87 | 90 | Norway brightness and contrast exception hedged to match the guideline ("usually", "can in some cases"). H2 "not for rebuilding a face" rewritten. Price paragraph and FAQ reworded. Photography Icon numbers, ASA cases and Norway dates verified. |
| plan-a-hair-change-with-a-preview | 84 | 90 | Removed "salons included" (the FDA page does not say it) and pointed the patch-test sentence at the FDA Q&A page, which does give the two-day test and the elbow or ear location. Opener rewritten (seven posts began "You ..."). Three H2s rewritten (Not a Prediction, Not the Steps, Honest Limits). App CTA made specific. Price paragraph and FAQ reworded. |
| virtual-makeup-try-on-lighting | 90 | 91 | Times LIVE and Ulta claims all verified. Final H2 rewritten. Price paragraph and FAQ reworded. |
| virtual-outfit-preview-limits | 88 | 91 | Cornell and NRF numbers verified. Opener rewritten. Two H2s rewritten (Not How It Fits, Honest Limits). Price paragraph, FAQ and app CTA reworded. |
| creative-portrait-effects-responsibly | 86 | 90 | Removed an unverified product claim ("AI Face Swap asks for permission from both people"). Opener rewritten. TikTok, arXiv (420 apps, 155 tested, 70%) and FTC 48-hour claims verified. App CTA made specific. Price FAQ reworded. |

## Cross-post duplication fixed

- The sentence "Each result costs 5 credits. A new account starts with 10 free credits, which covers two results, and the monthly plan is $10 for 200 credits, which is 40 results (see pricing)" appeared word for word in five posts. Each post now words it differently, and the eight cost FAQ answers are distinct (all still 40 to 80 words, same facts).
- Five posts ended on an H2 of the form "X Is a Y With Honest Limits". Now varied.
- Seven of eight intros opened "You ...". Three were rewritten.
- Eight app CTAs read "... on your phone" with identical body text. Five now have their own headline, and three of them new body text.
- Hero images are all different. Some heroes are reused as inline pictures in other posts (for example the Soft Autumn result in the outfit post), which is acceptable.

## Facts spot-checked against the source (opened this session)

Verified: Healthline (asymmetry), Healthline (undertones), PLOS ONE abstract and introduction, i-Perception (PMC8597069), Norwegian Consumer Authority, UK ASA, Photography Icon, FDA hair dye Q&A and hair-dyes page, Perfect Corp hair guide, Birnbaum et al. hair density (PMC6219221), Times LIVE review, Ulta undertones, Cornell Chronicle, NRF release, TikTok AI content page (read with a browser), arXiv 2605.24735, FTC Take It Down alert.

Product facts used everywhere: 5 credits per result, 10 free credits on a new account (two results), $10 monthly plan for 200 credits (40 results). No yearly price anywhere.

## Remaining known gaps

- Length: the model post and these eight all run about 3,500 to 4,200 words by a rough count of the content fields (the rendered-page word count of 3,900 to 4,500 includes navigation and footer). The retouch (about 4,100) and seasonal (about 4,000) posts are the longest. I did not cut them, because every section carries a table, steps or a sourced claim, but they are the first candidates if you want shorter.
- The inline picture in the creative-effects post ("Choose the Source Photo...") repeats that post's hero image. Left as is.
- Several lists still use a three-item rhythm ("Shoot from 5 feet, mark four lines, pick one definition"). They are mostly steps or checklists, so I kept them.
- Writing quality is a judgement call. A human read-through of the openers and closers is still worth ten minutes.

## Could not verify

- External pages that return 403 to a script (MasterClass, Warby Parker, Hair.com, doi.org, St Andrews news, Rangefinder, Norwegian Consumer Authority, Taylor and Francis): they load in a normal browser. I read the Norwegian page through WebFetch, but not MasterClass, Warby Parker, Hair.com, Glam or All About Vision claims directly (the face shape table's per-shape hairstyle, frame and earring pairings rest on the research brief, not a fresh read).
- Kleemans et al. 2018 (144 girls, filters noticed, reshaping barely noticed): PubMed and Taylor and Francis were blocked, so the figures come from the research brief.
- Rangefinder quotes (Barykina), Marie Claire and L'Oreal Paris quotes, Cleveland Clinic and AAD hair pages, Live Science growth rate, Glow Vault, PhotoWorkout temperatures, the Woman and Home shade families, the YouTube and Meta label rules, CEOP Education and the C2PA explainer quotes: not re-opened this session.
- Product claims (age limit of 18 and over, three finish levels in the Face Beauty Editor, tool behavior) were not checked against the app.
- No Lighthouse or Search Console data was available.
