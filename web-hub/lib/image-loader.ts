import { IMAGE_BASE, SAME_ORIGIN_IMAGES } from "./image-base";

/**
 * Image loader for next/image, used in dev and on the deployed site. Points at the pre-built WebP files
 * that scripts/optimize-images.mjs writes (media/_opt, uploaded to R2), so nothing is resized at request time.
 * Keep WIDTHS in sync with that script.
 */
const WIDTHS = [384, 768, 1280, 1920];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (SAME_ORIGIN_IMAGES.includes(src) || !/^\/img\/.+\.(png|jpe?g)$/i.test(src)) return src; // svg, icons and anything else pass through
  const bucket = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${IMAGE_BASE}/_opt${src.replace(/^\/img/, "").replace(/\.(png|jpe?g)$/i, "")}-${bucket}.webp`;
}
