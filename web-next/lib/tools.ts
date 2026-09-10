/**
 * Tool catalog ported from the Flutter app feature data.
 * `featureType` values match worker-api/src/lib/analyze-types.ts.
 */
export type FeatureType =
  | "FACE_BEAUTY_ANALYSIS"
  | "COLOR_ANALYSIS"
  | "GLOW_UP_GUIDE"
  | "BEAUTY_TIPS"
  | "CELEBRITY_LOOKALIKE"
  | "FACIAL_SYMMETRY"
  | "BEAUTY_SCORE_SHOWDOWN"
  | "FACIAL_RESEMBLANCE"
  | "FACE_READING"
  | "GOLDEN_RATIO";

export type ToolDefinition = {
  featureType: FeatureType;
  slug: string;
  title: string;
  isPro: boolean;
  badge?: "NEW" | "HOT";
  photoGuidance: string;
  gridDescription: string;
  featured?: boolean;
  comingSoon?: boolean;
};

export const TOOLS: ToolDefinition[] = [
  {
    featureType: "FACE_BEAUTY_ANALYSIS",
    slug: "face-beauty-analysis",
    title: "Face Beauty Analysis",
    isPro: false,
    photoGuidance: "Face the camera directly, in good lighting, with no glasses or filters.",
    gridDescription: "Discover your beauty score with an instant facial feature analysis.",
    featured: true,
  },
  {
    featureType: "COLOR_ANALYSIS",
    slug: "seasonal-color-palette",
    title: "Seasonal Color Palette",
    isPro: true,
    badge: "NEW",
    photoGuidance: "Natural daylight works best. Avoid strong color casts from indoor lighting.",
    gridDescription: "Get your personalized color palette in under 60 seconds.",
    featured: true,
  },
  {
    featureType: "GLOW_UP_GUIDE",
    slug: "beauty-routine-challenge",
    title: "Beauty Routine Challenge",
    isPro: true,
    photoGuidance: "A clear, front-facing skin photo lets us tailor your daily plan to what we see.",
    gridDescription: "A personalized beauty challenge based on your latest scan.",
  },
  {
    featureType: "BEAUTY_TIPS",
    slug: "beauty-tips",
    title: "Beauty Tips",
    isPro: true,
    photoGuidance: "A clear, front-facing photo helps us tailor tips to your skin and features.",
    gridDescription: "Personalized beauty tips based on your facial analysis.",
  },
  {
    featureType: "CELEBRITY_LOOKALIKE",
    slug: "celebrity-look-alike",
    title: "Celebrity Look Alike",
    isPro: true,
    badge: "HOT",
    photoGuidance: "Face the camera directly. This works best with a clear, unobstructed view of your face.",
    gridDescription: "Find which celebrity you resemble with AI face matching.",
  },
  {
    featureType: "FACIAL_SYMMETRY",
    slug: "facial-symmetry",
    title: "Facial Symmetry",
    isPro: true,
    badge: "NEW",
    photoGuidance: "Keep your head level and face the camera straight-on for accurate left/right scoring.",
    gridDescription: "Measure facial symmetry and balance with AI precision.",
    featured: true,
  },
  {
    featureType: "BEAUTY_SCORE_SHOWDOWN",
    slug: "beauty-score-showdown",
    title: "Beauty Score Showdown",
    isPro: true,
    badge: "HOT",
    photoGuidance: "Face the camera directly. Your score joins the leaderboard once analyzed.",
    gridDescription: "Compare beauty scores and challenge friends.",
  },
  {
    featureType: "FACIAL_RESEMBLANCE",
    slug: "face-comparison",
    title: "Face Comparison",
    isPro: true,
    photoGuidance: "Upload one photo showing two clear faces side by side, such as you and a friend.",
    gridDescription: "Compare two faces and see resemblance scores.",
  },
  {
    featureType: "FACE_READING",
    slug: "attractiveness-test",
    title: "Attractiveness Test",
    isPro: true,
    photoGuidance: "Face the camera directly, in good lighting, with no glasses or filters.",
    gridDescription: "Get an AI attractiveness score with detailed breakdown.",
  },
  {
    featureType: "GOLDEN_RATIO",
    slug: "face-golden-ratio",
    title: "Face Golden Ratio",
    isPro: true,
    photoGuidance: "Keep your head level and face the camera straight-on for accurate proportion measurements.",
    gridDescription: "Analyze facial proportions against the golden ratio.",
  },
];

export const DEFAULT_TOOL_SLUG = "face-beauty-analysis";

export function toolForSlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function isToolSlug(slug: string): boolean {
  return TOOLS.some((t) => t.slug === slug);
}
