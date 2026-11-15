/**
 * Conversion + SEO/AEO copy for one tool landing page.
 * Each tool's copy lives in lib/copy/<group>.ts and is merged over the generic
 * template in lib/tool-page-content.ts. Copy only. Layout is not driven from here.
 * Rules live in docs/copy/STYLE_GUIDE.md. Run `npm run copy:check` after editing.
 */
export type UseCase = { title: string; body: string };

export type ToolCopy = {
  /** <title>, max 60 chars, primary keyword first. No dashes. */
  metaTitle: string;
  /** Meta description, 120-155 chars, includes primary keyword + a benefit + soft CTA. No dashes. */
  metaDescription: string;
  /** The single bottom-of-funnel phrase this page targets, e.g. "attractiveness test". */
  primaryKeyword: string;
  /** 4-8 supporting phrases that also appear naturally on the page. */
  secondaryKeywords: string[];
  /** Page H1. Keyword-led, sentence case, one clear promise. The only heading allowed to skip the full stop. */
  h1: string;
  /** Sub-heading under the H1: 2-3 sentences, 35-55 words. Benefit, effort, first result free, primary keyword. */
  heroLead: string;
  /** H2 above the 3 steps. One sentence ending in a full stop, e.g. "Get your result in three steps." */
  howToHeading: string;
  /** One sentence under howToHeading. Replaces the hard-coded subline when present. */
  howToIntro?: string;
  /** Exactly 3 steps. Titles are short complete sentences ending in a full stop. Bodies are 1 to 2 sentences. */
  steps: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  /** H2 above the feature rows. One sentence, 6 to 12 words, ends with a full stop. No keyword lists. */
  featuresHeading: string;
  /** One sentence intro under featuresHeading, 15 to 25 words. */
  featuresIntro: string;
  /**
   * Feature rows. MUST be the same length and order as the existing feature images
   * (3 for every tool, 4 for face-beauty-analysis). Each row describes what its image shows.
   * title: one sentence, 6 to 12 words, ends with a full stop, states a benefit.
   * body: 2 to 3 sentences that finish the title's thought.
   * points: three proof tokens of 2 to 5 words, no full stop.
   * cta: optional button label for this row. Falls back to "Try {tool name}".
   */
  stories: Array<{ title: string; body: string; points?: [string, string, string]; cta?: string }>;
  /** H2 for the "ideas" section. A sentence. Falls back to a generic sentence. */
  ideasHeading?: string;
  /** Short intro beside the ideas H2. Falls back to a generic sentence. */
  ideasIntro?: string;
  /** The two use-case cards. When present, lib/tool-use-cases.ts prefers these. */
  useCases?: [UseCase, UseCase];
  /** H2 for the photo guidance block. A sentence. Falls back to a generic sentence. */
  guidanceHeading?: string;
  /** Title and body for the pricing banner under the FAQ. Title is a sentence, body states credit math. */
  downloadBanner: { title: string; body: string };
  /** H2 above the FAQ, a sentence containing the primary keyword, e.g. "Your attractiveness test questions, answered." */
  faqHeading: string;
  /** 8 Q&As. First question uses the primary keyword. Answer-first, 35-80 words each, wording varies per tool. */
  faqs: Array<[string, string]>;
};

export type CopyMap = Record<string, ToolCopy>;
