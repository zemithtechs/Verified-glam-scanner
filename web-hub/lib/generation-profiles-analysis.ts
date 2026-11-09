/**
 * Task-specific additions to buildGenerationPrompt for newly added analysis
 * and retouch tools. The shared prompt supplies the layout, identity and
 * label rules; these additions specify what the visible result must show.
 * They are instructions to an image editor, not calibrated measurements.
 */
export const ANALYSIS_GENERATION_PROFILES: Record<string, string> = {
  "face-shape-analyzer": [
    "Use the first uploaded adult portrait as the report subject. Keep a large, unaltered headshot with the full hairline and chin visible.",
    "Draw one thin approximate contour around the visible face boundary, taking care not to outline hair as jaw. Show one tentative label from Oval, Round, Square, Heart or Diamond, two short observations tied to visible outline or jaw features, and exactly two practical hair or eyewear ideas.",
    "If pose, hair or crop hides the outline, label the shape Unclear and explain that a straighter portrait would help. Do not imply a measured classification, an ideal face shape or a change to the person's appearance.",
  ].join(" "),
  "skin-analysis": [
    "Make the original close portrait the largest element. Keep its real pores, freckles, marks, skin tone and lighting unchanged.",
    "Use up to four small circular source-photo crops, each connected to the actual cheek, nose or under-eye area it depicts. Label only visibly supportable observations: Texture, Visible pores, Fine lines and Tone variation. A region with no clear detail should be omitted rather than invented.",
    "The circles must reflect the uploaded person's own image, never the layout reference or a newly generated generic skin close-up. Do not diagnose acne, dehydration or other conditions; do not estimate hydration, severity, skin age or treatment needs.",
  ].join(" "),
  "facial-landmarks": [
    "Keep a large unedited front-facing portrait and place a sparse set of small, clearly illustrative points on visible eye corners, brow line, nose tip, lip corners and jaw outline. Use short labels Eyes, Brows, Nose, Lips and Jaw only.",
    "Points should follow features actually visible in this photo and should not be placed on hair, background or an occluded feature. If a feature is hidden or the photo is angled, omit those points rather than inventing them.",
    "This is an illustrated visual guide, not a calibrated detector export. Do not show coordinate values, a dense mesh, numerical distances or claims about identity, ethnicity or beauty.",
  ].join(" "),
  "ai-skin-enhancement": [
    "In the Before panel reproduce the uploaded portrait faithfully. In the After panel make only a restrained skin-tone and temporary-blemish edit on that same face, with the same crop, pose, expression, hair, clothing, background and lighting.",
    "Keep natural complexion, freckles, moles, birthmarks, pores and fine lines visible. Do not enlarge eyes, change jaw or nose, whiten skin, remove permanent marks or create plastic-looking skin.",
    "For Subtle use the lightest change; Balanced may be slightly more visible but must still retain skin texture. No extra cards or text beyond the shared comparison labels.",
  ].join(" "),
  "smart-beauty": [
    "In the Before panel preserve the source photograph exactly in appearance. In the After panel gently reduce distracting shine and uneven exposure on the same portrait and soften only temporary blemishes.",
    "Match crop, pose, expression, hair, clothing and background across both panels. Preserve natural highlights, freckles, pores, age cues and true complexion. Do not reshape features, whiten skin or add makeup.",
    "Subtle should be barely perceptible; Balanced may correct more distracting photo issues without looking retouched. Use only the comparison labels required by the shared prompt.",
  ].join(" "),
  "face-beauty-retouch": [
    "Show the original portrait faithfully in Before and a texture-preserving edit in After. Preserve the same identity, face geometry, expression, hair, clothing, background and crop in both panels.",
    "Subtle: minimal shine and blemish adjustment. Balanced: moderate exposure and shine balancing with pores and marks still visible. Polished: a cleaner photographic finish, still with real skin texture, freckles, moles, fine lines and natural complexion.",
    "Do not change eye size, jaw, nose, lips, age or skin color. Avoid airbrushing, glamour lighting, fake eyelashes or cosmetic additions. Only the shared comparison labels may appear.",
  ].join(" "),
  "ai-face-enhancer": [
    "Use Before for the same supplied photograph, including its actual softness or noise. After should improve only mild blur, noise and edge clarity in the face while retaining the same person, expression, skin detail, lighting, crop and background.",
    "If source detail is missing or very low resolution, make a conservative improvement rather than inventing exact irises, teeth, freckles or identifying marks. Do not turn the portrait into a new studio photograph or claim factual recovery of unseen detail.",
    "Keep both panels the same size so users can judge the real change. No text beyond the shared comparison labels.",
  ].join(" "),
  "ai-face-slimming": [
    "Keep the supplied portrait as Before and make one subtle, visibly fictional jaw or cheek-contour preview as After. Use exactly the same crop, camera angle, pose, expression, hair, clothing, background and complexion.",
    "Maintain recognizable eye, nose, mouth and jaw features. Do not change body size, suggest weight loss, erase skin texture or present the edited contour as a healthier or better face.",
    "The effect should be restrained enough that comparison is informative rather than an extreme transformation. No text beyond the shared comparison labels.",
  ].join(" "),
};
