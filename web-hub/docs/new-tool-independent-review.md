# Independent review of the 38 newly added tools

Reviewed 8 November 2026 against local generation outputs in `.local-test-results/new-tools/`. All 38 tool routes, templates and sample inputs passed preflight. The local API accepted uploads and returned 15 valid PNGs before OpenAI returned HTTP 429 for three consecutive tools. A later single retry identified an account credit/spend-limit condition, so no further paid generations were attempted. A valid PNG proves the route ran; the visual verdict below also compares each saved result to the uploaded sample and selected option. A pass is limited to **one fixture and one option**, not arbitrary user photos or all styles.

## Live visual verdicts

| Tool | Verdict | Evidence from the saved output |
| --- | --- | --- |
| Face Shape Analyzer | Pass on sample | Recognizable headshot; approximate contour, shape label, two observations and two styling ideas. Shape is illustrative, not calibrated. |
| AI Skin Analysis | **Fail** | Four labelled circles appear, but zoomed skin details do not faithfully match source-photo crops and introduce stronger marks/pores than the uploaded face supports. |
| Facial Landmarks Map | **Fail against profile** | Same person and labelled points, but nose point is off the tip, one jaw point is near hair, and unnecessary aesthetic judgments appear. This is not detector-quality landmarks. |
| AI Skin Enhancement | Pass on sample | Subtle blemish/shine adjustment with natural texture and identity retained. |
| Smart Beauty Retouch | Pass on sample | Subtle exposure/shine adjustment; same face and scene. |
| Face Beauty Editor | Pass on sample | Polished finish is visible while complexion, skin texture and recognizable features remain. |
| AI Face Enhancer | **Fail** | The uploaded sample is sharp, but the output fabricates a blurred “Before” panel to make “After” appear enhanced. Needs a genuinely blurred input and faithful source panel. |
| AI Face Slimming | **Inconclusive** | Identity and scene are retained; contour change is too slight to establish the promised preview at normal viewing size. |
| Hairstyle Changer | Pass on sample | Selected curly bob is distinct and plausible; face and scene retained. |
| AI Hair Color Changer | Pass on sample | Selected copper hair follows existing curls; face, brows, skin and clothing remain. |
| AI Beard Styling | Pass on sample | Selected light stubble is visible and follows facial contours. |
| AI Beard Removal | **Fail** | Input sample is clean-shaven; output invents a full beard in “Before” before removing it. Requires a truly bearded fixture and faithful source panel. |
| Hair Loss Simulation | Pass on sample | Mild fictional hairline recession with same face and remaining hair. |
| AI Bald Filter | Pass on sample | Plausible shaved scalp; same recognizable face, brows and clothing. |
| Lip Color Changer | Pass on sample | Selected peach gloss stays on lips; other facial details remain. |

## No verified visual result yet

The following tools have generation specifications and route wiring, but **must not be reported as working as promised** without a successful live result and visual check:

| Attempted, returned HTTP 429 | Not reached before the audit stopped |
| --- | --- |
| Eyeshadow Try-On; Colored Contacts Try-On; AI Eyelashes | AI Eyebrows; AI Lip Enhancement; Virtual Try-On: Clothes; AI Tattoo Generator; Silhouette Preview; Cartoon Yourself; AI Face Filters; Facial Expression Changer; Age & Gender Swap; AI Face Swap; Square Face Filter; Big Head Effect; AI Halloween Mask; Pregnancy Joke Filter; Birthday Image Generator; AI Fortune Teller; Elf Name Generator; Old Photo Restoration; Face Blur; Merge Portraits |

## Remaining correctness gates

- `face-blur` cannot be called a privacy tool based on a generative PNG alone. Every visible face, reflection, poster and small background face needs an output check or deterministic obscuring step that fails closed.
- `ai-face-swap`, `virtual-try-on-clothes`, and `merge-portraits` need both-upload role checks: source identity versus target scene, supplied garment versus invented garment, and both people visibly retained.
- `skin-analysis` zooms should be composed from actual uploaded pixels if presented as source-photo crops. The observed generated crops are not trustworthy evidence of skin detail.
- The API currently checks image format, not whether the pixels satisfy the selected tool. A successful HTTP response cannot replace this visual review.
- Previously observed feature-image assets are absent for 16 individual landing pages; this does not block generation, but the pages need their promised examples restored.
- The local API rejects missing consent, malformed images, unsupported styles, missing required second uploads, unknown tools, invalid local sessions and external origins. `npm run build` completed successfully; neither check establishes visual correctness.

This report is intentionally limited to the local sample fixtures. It does not assert behavior in a deployed environment or with arbitrary user images.
