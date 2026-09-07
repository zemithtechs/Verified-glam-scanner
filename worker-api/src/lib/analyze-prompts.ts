import { FACE_SCORING_RUBRIC } from "./scoring";
import { BEAUTY_CATEGORY_IDS, type BeautyCatalog, type FeatureType } from "./analyze-types";

// Verbatim port of analyze-scan's buildSystemPrompt/buildUserPrompt.
export function buildSystemPrompt(featureType: FeatureType, catalog: BeautyCatalog | null): string {
  const base =
    "You are a facial analysis assistant for Verified Glam. Output ONLY valid JSON. " +
    "Focus on neutral visual observations: proportions, symmetry, color harmony, and wellness-style suggestions. " +
    "Never provide medical diagnosis, prescriptions, or cure claims. " +
    "Use 'may help', 'some people say', 'creators share' — not 'will cure' or 'treats'. " +
    "Do not rank people as more or less attractive — describe proportions and harmony objectively. " +
    "For normalized face coordinates use 0-1 (x left-right, y top-bottom).";

  const schemas: Record<FeatureType, string> = {
    FACE_BEAUTY_ANALYSIS:
      'Return: { "beautyScore": number (0-100, must equal weighted avg of subscores), "ratingLabel": string, "subscores": { "symmetry", "featureBalance", "skinQuality", "youthfulCues", "overallBeauty" } (each integer 0-100, all different), "annotations": [{ "text", "anchor": {x,y}, "labelSide" }] }',
    COLOR_ANALYSIS: 'Return: { "season": string, "skin": hex, "palette": [hex...], "description": string }',
    GLOW_UP_GUIDE:
      'Return: { "spots": [{ "id", "categoryId", "label", "anchor": {x,y}, "severity": "high"|"medium"|"low", "confidence", "labelSide", "color" (ARGB int) }], "findings": [...], "summary", "globalDisclaimer" }. Up to 10 visible spots only. Do NOT include tips[] or days[].',
    BEAUTY_TIPS:
      'Return: { "spots": [{ "id", "categoryId", "label", "anchor": {x,y}, "severity": "high"|"medium"|"low", "confidence", "labelSide", "color" (ARGB int) }], "findings": [...], "summary", "globalDisclaimer" }. Up to 10 visible spots only. Do NOT include tips[].',
    CELEBRITY_LOOKALIKE:
      'Return: { "detectedGender": "female"|"male"|"unknown", "matches": [{ "name", "percent" (integer 60-95, descending with 6-12 pt gaps), "traits": [string], "why": string }] } — exactly 3 to 5 well-known public figures. Style resemblance only.',
    FACIAL_SYMMETRY:
      'Return: { "overallSymmetryScore": number (0-100), "overallPercent": number (same as overallSymmetryScore), "tierLabel": string, "guides": { "verticalCenter", "verticalSideLines": [number], "horizontalLines": [number] }, "regions": [{ "id": "eyebrow"|"eyes"|"nose"|"mouth"|"cheeks", "label", "percent" (integer 0-100, each unique), "anchor": {x,y}, "labelSide" }], "subscores": { "beauty", "cuteness", "skinSmoothness", "handsomeness", "faceShape", "facialSymmetry" } (integers 0-100, all different), "annotations": [{ "text", "anchor", "labelSide" }] }',
    BEAUTY_SCORE_SHOWDOWN:
      'Return: { "yourScore": number (0-10 harmony), "rankPosition", "totalParticipants", "averageScore": number (0-10), "rankLabel", "engagementNote", "podium": [{ "name", "displayName", "score" (0-10), "rank" }] }',
    FACIAL_RESEMBLANCE:
      'Return: { "faceCount": number (2 for two-person photos), "similarity": number (0-100), "scoreLabel", "relationship"|"relationshipHint", "sharedTraits": [string], "contourComparison", "explanation" }',
    FACE_READING:
      'Return: { "overallScore": number (0-10, derived from appearanceScores avg), "tierLabel": string, "facialAge", "appearanceScores": { "beauty", "handsomeness", "cuteness", "faceShape", "facialSymmetry", "skinSmoothness" } (integers 0-100, all different), "traitScores": { "funFactor", "intelligence", "confidence", "credibility" } (integers 0-100, all different), "faceBox", "landmarks", "meshConnections" }',
    GOLDEN_RATIO:
      'Return: { "overallScore": number, "goldenRatioIndex": number (0-100), "ratingLabel", "idealPhi": 1.618, "measurements": [{ "id", "name", "ratio", "ideal", "delta", "scoreOutOf20", "pass", "from": {x,y}, "to": {x,y}, "labelSide" }], "landmarks": { "hairline", "chin", "eyeInnerL", ... }, "deviations": [string], "harmonyPercent" }',
  };

  let prompt = `${base}\n\nFeature: ${featureType}\nSchema: ${schemas[featureType]}`;

  const faceScoringFeatures: FeatureType[] = [
    "FACE_BEAUTY_ANALYSIS",
    "FACIAL_SYMMETRY",
    "FACE_READING",
    "CELEBRITY_LOOKALIKE",
  ];
  if (faceScoringFeatures.includes(featureType)) {
    prompt += FACE_SCORING_RUBRIC;
  }

  if (featureType === "CELEBRITY_LOOKALIKE") {
    prompt +=
      "\n\nCELEBRITY LOOK-ALIKE RULES:\n" +
      "- Analyze THIS specific portrait only — face shape, eyes, nose, lips, jaw, cheekbones, hair.\n" +
      "- Return 3–5 matches sorted by percent descending. Never return an empty matches array.\n" +
      "- Each match needs 2–4 trait strings and a one-sentence why referencing visible features.\n" +
      "- Use real, recognizable celebrity names only. Percent is playful style resemblance (60–95).\n" +
      "- Match percents must descend with 6–12 point gaps; highest match = strongest trait overlap.\n" +
      "- This is entertainment — not biometric identification.";
  }

  if (featureType === "FACIAL_SYMMETRY") {
    prompt +=
      "\n\nFACIAL SYMMETRY RULES:\n" +
      "- Return exactly 5 regions: eyebrow, eyes, nose, mouth, cheeks — each with its own percent.\n" +
      "- Region percents must differ; score left/right balance per region from THIS photo.";
  }

  if (featureType === "FACIAL_RESEMBLANCE") {
    prompt +=
      "\n\nFACE COMPARISON RULES:\n" +
      "- Photo must show exactly two clear faces. Always set faceCount to 2.\n" +
      "- Score outer contour and feature alignment between both faces only.";
  }

  if (featureType === "FACE_BEAUTY_ANALYSIS") {
    prompt += "\n\nFACE BEAUTY WEIGHTS: symmetry 1.2, featureBalance 1.1, skinQuality 1.0, youthfulCues 0.9, overallBeauty 1.0.";
  }

  if (featureType === "FACE_READING") {
    prompt +=
      "\n\nATTRACTIVENESS WEIGHTS (appearance): beauty 1.2, facialSymmetry 1.1, skinSmoothness 1.0, faceShape 1.0, handsomeness 0.9, cuteness 0.8.";
  }

  const photoSpecificFeatures: FeatureType[] = [
    "FACE_BEAUTY_ANALYSIS",
    "COLOR_ANALYSIS",
    "FACIAL_SYMMETRY",
    "FACE_READING",
    "GOLDEN_RATIO",
    "FACIAL_RESEMBLANCE",
    "BEAUTY_SCORE_SHOWDOWN",
  ];
  if (photoSpecificFeatures.includes(featureType)) {
    prompt += "\n\nAnalyze THIS portrait only. Scores, colors, and findings must reflect visible features in this photo — not generic templates.";
  }

  const skinScan = featureType === "BEAUTY_TIPS" || featureType === "GLOW_UP_GUIDE";
  if (skinScan && catalog) {
    const slimCategories = catalog.categories.map((c) => ({
      id: c.id,
      name: c.name,
      short_label: c.short_label,
      color: c.color,
      label_side: c.label_side,
    }));

    prompt +=
      "\n\nBEAUTY TIPS RULES:\n" +
      "- Only mark spots that are VISIBLY present in this photo. Do NOT invent acne, pimples, redness, or texture issues.\n" +
      "- Each spot must include confidence (0–1). Skip anything below 0.55 confidence.\n" +
      "- Detect up to 10 distinct visible spots with accurate normalized anchors.\n" +
      "- Keep anchors at least 0.05 apart (normalized). Balance labelSide left/right by anchor x position.\n" +
      "- Summary must describe what is visible in THIS portrait.\n" +
      `- categoryId must be one of: ${BEAUTY_CATEGORY_IDS.join(", ")}.\n` +
      "- Use spotLabels and category metadata for overlay labels and colors.\n" +
      "- Set globalDisclaimer exactly from the knowledge base.\n" +
      (featureType === "GLOW_UP_GUIDE"
        ? "- Do not generate tips[] or days[] — only spots, findings, summary, globalDisclaimer.\n"
        : "- Do not generate tips[] — only spots, findings, summary, globalDisclaimer.\n") +
      `\nKNOWLEDGE BASE (metadata only):\n${JSON.stringify({
        globalDisclaimer: catalog.globalDisclaimer,
        categories: slimCategories,
        spotLabels: catalog.spotLabels,
      })}`;
  }

  return prompt;
}

export function buildUserPrompt(
  featureType: FeatureType,
  detectedFaces: unknown,
  profile: Record<string, unknown>,
  catalog: BeautyCatalog | null,
): string {
  let text =
    `Analyze this portrait for ${featureType}. ` +
    `User profile context: ${JSON.stringify(profile)}. ` +
    `On-device face hints (optional): ${JSON.stringify(detectedFaces)}. ` +
    `Return the JSON payload only.`;

  if ((featureType === "BEAUTY_TIPS" || featureType === "GLOW_UP_GUIDE") && catalog) {
    text += " Only label visibly present skin concerns. Place anchors on visible areas with min 0.05 separation. Group findings by categoryId with spotCount.";
  }

  if (featureType === "CELEBRITY_LOOKALIKE") {
    text += " Return 3–5 celebrity matches with traits and why for this specific face.";
  }

  return text;
}
