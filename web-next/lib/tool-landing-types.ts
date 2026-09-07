// Mirrors lib/web/content/vg_tool_landing_content.dart's data shapes
// (VGToolLandingContent + its item types) — filled in per-tool in
// lib/tool-landing-content.ts.
export type WhyChooseItem = { title: string; description: string };
export type ShowcaseItem = { title: string; description: string };
export type HowToStep = { title: string; description: string };
export type ReviewItem = { name: string; text: string; rating: number };
export type FaqItem = { question: string; answer: string };

export type ToolLandingContent = {
  headline: string;
  subheadline: string;
  whyChoose: WhyChooseItem[];
  showcase: ShowcaseItem[];
  howTo: HowToStep[];
  reviews: ReviewItem[];
  faq: FaqItem[];
};
