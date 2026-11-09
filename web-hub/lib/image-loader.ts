/**
 * Image loader for the deployed site. Points next/image at the pre-built WebP files that
 * scripts/optimize-images.mjs writes to public/_opt, so nothing is resized at request time.
 * Keep WIDTHS in sync with that script.
 */
const WIDTHS = [384, 768, 1280, 1920];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!/^\/img\/.+\.(png|jpe?g)$/i.test(src)) return src; // svg, favicon-sized files and anything else pass through
  const bucket = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/_opt${src.replace(/^\/img/, "").replace(/\.(png|jpe?g)$/i, "")}-${bucket}.webp`;
}
