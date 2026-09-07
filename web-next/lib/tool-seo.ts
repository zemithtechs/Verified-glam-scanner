import type { FeatureType } from "./tools";

// Ported from lib/web/content/vg_tool_landing_content.dart's pageTitle/metaDescription.
export const TOOL_SEO: Record<FeatureType, { pageTitle: string; metaDescription: string }> = {
  FACE_BEAUTY_ANALYSIS: {
    pageTitle: "AI Face Beauty Analysis | Free Online Beauty Score",
    metaDescription:
      "Upload a photo for instant AI face beauty analysis. Get feature scores, highlights, and personalized beauty insights with Verified Glam Scanner.",
  },
  COLOR_ANALYSIS: {
    pageTitle: "AI Seasonal Color Palette | Find Your Best Colors",
    metaDescription:
      "Discover your seasonal color palette with AI. Upload a selfie to find makeup, hair, and wardrobe colors that complement your skin tone.",
  },
  GLOW_UP_GUIDE: {
    pageTitle: "Beauty Routine Challenge | AI Glow-Up Guide",
    metaDescription:
      "Start a personalized beauty routine challenge with AI. Upload a photo and get a structured glow-up plan from Verified Glam Scanner.",
  },
  BEAUTY_TIPS: {
    pageTitle: "AI Beauty Tips | Personalized Makeup & Skincare Advice",
    metaDescription: "Get personalized AI beauty tips from your selfie. Upload a photo for tailored makeup, skincare, and grooming suggestions.",
  },
  CELEBRITY_LOOKALIKE: {
    pageTitle: "Celebrity Look Alike Finder | AI Face Match",
    metaDescription: "Find which celebrity you look like with AI. Upload your photo for look-alike matches and resemblance insights.",
  },
  FACIAL_SYMMETRY: {
    pageTitle: "AI Facial Symmetry Analyzer | Free Online Face Symmetry Test",
    metaDescription: "Measure facial symmetry with AI. Upload a photo for a symmetry score, visual overlays, and balanced-beauty insights.",
  },
  BEAUTY_SCORE_SHOWDOWN: {
    pageTitle: "Beauty Score Showdown | Compare Beauty Scores",
    metaDescription: "Run a beauty score showdown with AI. Upload photos and compare scores, features, and highlights side by side.",
  },
  FACIAL_RESEMBLANCE: {
    pageTitle: "AI Face Comparison | Compare Two Faces Online",
    metaDescription: "Compare two faces with AI. Upload photos to measure resemblance, shared traits, and side-by-side feature analysis.",
  },
  FACE_READING: {
    pageTitle: "AI Attractiveness Test | Free Online Face Rating",
    metaDescription: "Take an AI attractiveness test online. Upload your photo for feature-based ratings, overlays, and constructive style insights.",
  },
  GOLDEN_RATIO: {
    pageTitle: "Face Golden Ratio Calculator | AI Phi Beauty Analysis",
    metaDescription: "Measure golden ratio proportions in your face with AI. Upload a photo for phi-based analysis and classical harmony insights.",
  },
};
