import { LEGACY_APP_URL } from "./site-info";

/**
 * "Handoff" mode is switched on only in the deployed build (NEXT_PUBLIC_APP_MODE=handoff).
 * The public pages (home, tools, pricing, blog, legal) work as designed, while anything that needs a real
 * account or image processing is handed to the existing app until the two are merged.
 * Local development leaves it off, so the full preview keeps working.
 */
export const HANDOFF = process.env.NEXT_PUBLIC_APP_MODE === "handoff";

/** Tools that already run in the existing app, at /app/<slug>. */
export const RUNNABLE_IN_APP = new Set([
  "face-beauty-analysis", "seasonal-color-palette", "beauty-routine-challenge", "beauty-tips", "facial-symmetry",
  "beauty-score-showdown", "face-comparison", "attractiveness-test", "face-golden-ratio",
]);

export const appToolUrl = (slug: string) => `${LEGACY_APP_URL}/app/${slug}`;
export const appSignUpUrl = `${LEGACY_APP_URL}/register`;
export const appLoginUrl = `${LEGACY_APP_URL}/login`;
