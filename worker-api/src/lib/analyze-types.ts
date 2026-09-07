// Shared types/constants for the analyze-scan port (see analyze.ts route).
export const VALID_FEATURES = [
  "FACE_BEAUTY_ANALYSIS",
  "COLOR_ANALYSIS",
  "GLOW_UP_GUIDE",
  "BEAUTY_TIPS",
  "CELEBRITY_LOOKALIKE",
  "FACIAL_SYMMETRY",
  "BEAUTY_SCORE_SHOWDOWN",
  "FACIAL_RESEMBLANCE",
  "FACE_READING",
  "GOLDEN_RATIO",
] as const;

export type FeatureType = (typeof VALID_FEATURES)[number];

export const HIGH_DETAIL_FEATURES = new Set<FeatureType>([
  "BEAUTY_TIPS",
  "GLOW_UP_GUIDE",
  "CELEBRITY_LOOKALIKE",
  "FACE_BEAUTY_ANALYSIS",
  "COLOR_ANALYSIS",
  "FACIAL_SYMMETRY",
  "FACE_READING",
  "GOLDEN_RATIO",
]);

export const FACE_REQUIRED_FEATURES = new Set<FeatureType>([
  "FACE_BEAUTY_ANALYSIS",
  "COLOR_ANALYSIS",
  "BEAUTY_TIPS",
  "GLOW_UP_GUIDE",
  "CELEBRITY_LOOKALIKE",
  "FACIAL_SYMMETRY",
  "BEAUTY_SCORE_SHOWDOWN",
  "FACIAL_RESEMBLANCE",
  "FACE_READING",
  "GOLDEN_RATIO",
]);

export const BEAUTY_CATEGORY_IDS = [
  "acne",
  "hyperpigmentation",
  "texture_scars",
  "aging",
  "sensitivity",
  "oily_pores",
  "dryness",
  "uneven_tone",
] as const;

export type BeautyCatalog = {
  globalDisclaimer: string;
  categories: Record<string, unknown>[];
  tipsByCategory: Record<string, Record<string, unknown[]>>;
  spotLabels: Record<string, string>;
};

export function featureLabelForCredits(featureType: string): string {
  const labels: Record<string, string> = {
    FACE_BEAUTY_ANALYSIS: "Face Beauty Analysis",
    GOLDEN_RATIO: "Golden Ratio Analysis",
    CELEBRITY_LOOKALIKE: "Celebrity Look-Alike",
    FACIAL_SYMMETRY: "Facial Symmetry Analysis",
    BEAUTY_TIPS: "Beauty Tips Analysis",
    GLOW_UP_GUIDE: "Glow Up Guide",
    FACIAL_RESEMBLANCE: "Face Comparison",
    FACE_READING: "Face Reading",
    BEAUTY_SCORE_SHOWDOWN: "Beauty Score Showdown",
    COLOR_ANALYSIS: "Seasonal Color Palette",
    APPEARANCE_ANALYSIS: "Appearance Analysis",
  };
  return labels[featureType] ?? featureType.replace(/_/g, " ");
}
