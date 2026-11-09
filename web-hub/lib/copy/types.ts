/**
 * Conversion + SEO/AEO copy for one tool landing page.
 * Each tool's copy lives in lib/copy/<group>.ts and is merged over the generic
 * template in lib/tool-page-content.ts. Copy only — layout is not driven from here.
 */
export type ToolCopy = {
  /** <title>, max 60 chars, primary keyword first. */
  metaTitle: string;
  /** Meta description, 120-155 chars, includes primary keyword + a benefit + soft CTA. */
  metaDescription: string;
  /** The single bottom-of-funnel phrase this page targets, e.g. "attractiveness test". */
  primaryKeyword: string;
  /** 4-8 supporting phrases that also appear naturally on the page. */
  secondaryKeywords: string[];
  /** Page H1. Contains the primary keyword. */
  h1: string;
  /** Sub-heading under the H1: 2-3 sentences, 35-60 words, benefit + feeling + primary keyword. */
  heroLead: string;
  /** H2 above the 3 steps, contains primary keyword. */
  howToHeading: string;
  /** Exactly 3 steps. Titles are short action phrases (keyword where natural). */
  steps: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  /** H2 above the feature rows, keyword-rich, names the tool + 2-3 related terms (like a competitor's "AI Face Rater For Beauty Score, Face Shape, And Symmetry"). */
  featuresHeading: string;
  /** One-sentence intro under featuresHeading. */
  featuresIntro: string;
  /**
   * Feature rows. MUST be the same length and order as the existing feature images
   * (3 for every tool, 4 for face-beauty-analysis). Each row describes what its image shows.
   */
  stories: Array<{ title: string; body: string; points?: [string, string, string] }>;
  /** Heading + body for the "download" banner under the features. */
  downloadBanner: { title: string; body: string };
  /** H2 above the FAQ, contains primary keyword. */
  faqHeading: string;
  /** 8-10 Q&As. Answer-first (first sentence answers directly), 35-80 words each. */
  faqs: Array<[string, string]>;
};

export type CopyMap = Record<string, ToolCopy>;
