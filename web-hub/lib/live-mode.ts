import { LEGACY_APP_URL } from "./site-info";

/**
 * "Handoff" mode is switched on only in the deployed build (NEXT_PUBLIC_APP_MODE=handoff).
 * The public pages (home, tools, pricing, blog, legal) work as designed, while anything that needs a real
 * account or image processing is handed to the existing app until the two are merged.
 * Local development leaves it off, so the full preview keeps working.
 */
export const HANDOFF = process.env.NEXT_PUBLIC_APP_MODE === "handoff";

/** Dashboard and account links: on the deployed site they go straight to the existing app (a plain external link, nothing to prefetch). */
export const appHref = (path: string) => path;
export const appToolUrl = (slug: string) => `${LEGACY_APP_URL}/app/${slug}`;
export const appSignUpUrl = `${LEGACY_APP_URL}/register`;
export const appLoginUrl = `${LEGACY_APP_URL}/login`;
