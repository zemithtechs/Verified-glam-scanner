/**
 * Where the site's pictures are served from. Every picture lives in the public R2 bucket behind
 * https://images.aibeautystyling.com (keys mirror the old site paths: /img/<path> and /_opt/<path>-<width>.webp).
 * Set NEXT_PUBLIC_IMAGE_BASE to an empty string to use same-origin files from public/ instead.
 */
export const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE ?? "https://images.aibeautystyling.com";

/** Small files that stay in public/ and are always served from the site itself (icons and logo). */
export const SAME_ORIGIN_IMAGES = ["/img/favicon.png"];

/** Prefixes /img/ and /_opt/ paths with IMAGE_BASE. Absolute URLs, same-origin icons and other paths are returned unchanged. */
export function imageUrl(path: string): string {
  if (!/^\/(img|_opt)\//.test(path) || SAME_ORIGIN_IMAGES.includes(path)) return path;
  return `${IMAGE_BASE}${path}`;
}
