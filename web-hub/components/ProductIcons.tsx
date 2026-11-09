import type { CategoryId } from "@/lib/catalog";

/** A restrained, original 24px icon family for the product navigation. */
const toolMarks: Record<string, string> = {
  "face-beauty-analysis": "M5 4v3M5 4h3m8 0h3v3M5 20v-3m0 3h3m8 0h3v-3M9 7c1-1 5-1 6 0 1 2 1 7-3 9-4-2-4-7-3-9Zm1.2 5h.1m3.4 0h.1M10.5 15c.9.7 2.1.7 3 0",
  "facial-symmetry": "M12 3v18M8.5 5.5C6 6.5 5 9 5 12c0 4 2 7 5 8m5.5-14.5C18 6.5 19 9 19 12c0 4-2 7-5 8M8 11h1m6 0h1M8.5 15c.5.6 1.1.9 1.5 1m5.5-1c-.5.6-1.1.9-1.5 1",
  "face-golden-ratio": "M12 3c-5 0-8 3-8 8s3 9 8 10c5-1 8-5 8-10s-3-8-8-8Zm-5 8h10M12 5v14m-4-5h8M9 8h6M9 17h6",
  "attractiveness-test": "M10 4c-3 0-5 3-5 7 0 5 3 9 7 10 4-1 7-5 7-10 0-4-2-7-5-7m-5 7h.1m5 0h.1M10 15c1.3 1 2.7 1 4 0m5-13v4m-2-2h4",
  "celebrity-look-alike": "M5 20v-2c0-2 2.5-3 5-3h4c2.5 0 5 1 5 3v2M8 8c0-3 1.5-5 4-5s4 2 4 5v2c0 2.5-1.5 4-4 4s-4-1.5-4-4V8Zm11-5 1 1.5L22 5l-2 1-1 2-1-2-2-1 2-.5L19 3Z",
  "face-comparison": "M3 6c2-1 4-1 6 0v8c0 2-1 3-3 4-2-1-3-2-3-4V6Zm12 0c2-1 4-1 6 0v8c0 2-1 3-3 4-2-1-3-2-3-4V6ZM6 10h.1m12 0h.1M10 20h4m-2-2v4",
  "beauty-score-showdown": "M3 6h7v11H3V6Zm11 0h7v11h-7V6ZM5.5 10h2m9 0h2M6.5 13h.1m11 0h.1M10.5 11h3m-1.5-1.5v3",
  "face-shape-analyzer": "M12 3 5 7v6c0 4 3 7 7 9 4-2 7-5 7-9V7l-7-4Zm-3 8h.1m5.8 0h.1M10 15c1.3 1 2.7 1 4 0",
  "skin-analysis": "M10.5 4C7 4 5 7 5 11c0 5 3 9 7 10m0-17c3.5 0 5.5 3 5.5 7m-10 2h.1m3-4h.1m2 5h.1M16 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm3 3 3 3",
  "facial-landmarks": "M12 3C8 3 5 6 5 11c0 5 3 9 7 10 4-1 7-5 7-10 0-5-3-8-7-8ZM8 10h.1m7.9 0h.1M12 13h.1M9 16h.1m5.9 0h.1M8 10l4 3 4-3m-7 6 3-3 3 3",
  "seasonal-color-palette": "M5 4h8v8H5V4Zm6 8h8v8h-8v-8ZM4 14h5v6H4v-6ZM7 7h4m3 8h3M6 17h1",
  "beauty-tips": "M8 18h8m-7 3h6M8 14c-1.3-1.2-2-2.7-2-4.5a6 6 0 1 1 12 0c0 1.8-.7 3.3-2 4.5-.7.6-1 1.4-1 2H9c0-.6-.3-1.4-1-2Zm4-8v3m-1.5 1.5L12 12l1.5-1.5",
  "beauty-routine-challenge": "M4 6h16v15H4V6Zm0 4h16M8 3v5m8-5v5M8 14l2 2 4-4m2 4h2",
  "ai-skin-enhancement": "M12 3C8 3 5 6 5 11c0 5 3 9 7 10 4-1 7-5 7-10 0-5-3-8-7-8ZM8 11h.1m8 0h.1M9 15c2 1.4 4 1.4 6 0m5-12v4m-2-2h4",
  "smart-beauty": "M12 3C8 3 5 6 5 11c0 5 3 9 7 10 4-1 7-5 7-10 0-5-3-8-7-8ZM7 11h4m4 0h3M9 9v4m7-4v4M9 16h6",
  "face-beauty-retouch": "M12 3C8 3 5 6 5 11c0 5 3 9 7 10 4-1 7-5 7-10 0-5-3-8-7-8Zm0 0v18M8 11h1m6 0h1M9 15h6",
  "ai-face-enhancer": "M4 8V4h4m8 0h4v4M4 16v4h4m8 0h4v-4M12 5c-3 0-5 2-5 6s2 7 5 8c3-1 5-4 5-8s-2-6-5-6Zm-2 5h.1m3.8 0h.1M10 14h4",
  "ai-face-slimming": "M7 4c-2 2-2 5-2 8 0 4 3 8 7 9 4-1 7-5 7-9 0-3 0-6-2-8M8 10l2 2-2 2m8-4-2 2 2 2m-6 4h4",
  "hairstyle-changer": "M4 13C3 6 6 3 12 3s9 3 8 10l-3-3-2-3c-2 3-5 4-9 4l-2 2Zm3 0c0 4 2 7 5 8 3-1 5-4 5-8M6 16l-2 4m14-4 2 4",
  "ai-hair-color": "M4 13C3 6 6 3 12 3s9 3 8 10l-3-3-2-3c-2 3-5 4-9 4l-2 2Zm3 0c0 4 2 7 5 8m5-8c0 2-1 4-2 5m5-2c0 2-1 3-2 3s-2-1-2-3l2-3 2 3Z",
  "beard-styling": "M7 4c-1 2-1 5-1 7 0 5 2 9 6 11 4-2 6-6 6-11 0-2 0-5-1-7M8 12c1 2 2 2 4 1 2 1 3 1 4-1m-7 4 3 3 3-3",
  "beard-remover": "M7 4c-1 2-1 5-1 7 0 5 2 9 6 11 4-2 6-6 6-11 0-2 0-5-1-7M8 12c1 2 2 2 4 1 2 1 3 1 4-1M4 20 20 4",
  "hair-loss-simulation": "M5 12c0-6 2-9 7-9s7 3 7 9M5 12l3-2 2-3m9 5-3-2-2-3M8 13c0 4 1 7 4 8 3-1 4-4 4-8m-4-8v3",
  "bald-filter": "M5 12c0-6 2-9 7-9s7 3 7 9c0 5-3 8-7 10-4-2-7-5-7-10Zm3 0h.1m7.9 0h.1M10 16c1.3.7 2.7.7 4 0",
  "lip-color-changer": "M3 12c3 0 4-3 7-3l2 1 2-1c3 0 4 3 7 3-2 3-5 5-9 5s-7-2-9-5Zm2 0c4 2 10 2 14 0",
  "eyeshadow-try-on": "M3 13c5-5 13-5 18 0-5 5-13 5-18 0Zm9-3v6M5 9c4-3 10-3 14 0",
  "colored-contacts": "M3 12c5-5 13-5 18 0-5 5-13 5-18 0Zm9-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  "ai-eyelashes": "M3 13c5-5 13-5 18 0-5 5-13 5-18 0Zm9-3v6M5 10 4 7m4 2V5m4 3V4m4 5V5m3 5 1-3",
  "ai-eyebrows": "M3 10c3-3 6-4 8-2m2 0c2-2 5-1 8 2M4 14c2-2 5-2 7 0m2 0c2-2 5-2 7 0M7 17h.1m10 0h.1",
  "ai-lip-enhancement": "M3 12c3 0 4-3 7-3l2 1 2-1c3 0 4 3 7 3-2 3-5 5-9 5s-7-2-9-5Zm2 0c4 2 10 2 14 0m1-9v4m-2-2h4",
  "virtual-try-on-clothes": "M8 4 4 7 2 11l4 2 1-2v9h10v-9l1 2 4-2-2-4-4-3c-1 2-2 3-4 3S9 6 8 4Z",
  "ai-tattoo-generator": "M5 17c3-1 5-5 8-8l4-4 3 3-4 4c-3 3-7 5-8 8l-3-3Zm5-2 3 3m4-14 3 3M4 5v4m-2-2h4",
  "ai-waist-slimming": "M7 3c0 4 2 4 2 7 0 2-2 3-2 5v6m10-18c0 4-2 4-2 7 0 2 2 3 2 5v6M9 11c1 1 5 1 6 0m-6 7c1-1 5-1 6 0m-11-5 3 2m13-2-3 2",
  "cartoon-yourself": "M4 4h16v16H4V4Zm8 0v16M7 10h2m6 0h2M7 15c1 1 2 1 3 0m4 0c1 1 2 1 3 0",
  "face-filters": "M4 5h16v14H4V5Zm5 3c-2 1-3 3-3 5 0 2 1 4 3 5m6-10c2 1 3 3 3 5 0 2-1 4-3 5M10 11h.1m3.8 0h.1M10 15h4m5-13v4m-2-2h4",
  "facial-expression-changer": "M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM6 8h2m8 0h2M4 16c4 4 12 4 16 0m-8-3v4",
  "age-gender-swap": "M3 18c0-3 2-5 5-5s5 2 5 5M5 8c0-2 1-4 3-4s3 2 3 4-1 4-3 4-3-2-3-4Zm8 2h7m-3-3v6m-1 5c1-2 3-3 5-3",
  "ai-face-swap": "M4 6c2-1 4-1 6 0v8c0 2-1 3-3 4-2-1-3-2-3-4V6Zm10 0c2-1 4-1 6 0v8c0 2-1 3-3 4-2-1-3-2-3-4V6ZM10 9l4-2m0 9-4-2m0-7 1 2m3 5-1 2",
  "square-face-filter": "M6 4h12v12l-6 5-6-5V4Zm3 7h.1m5.9 0h.1M10 15h4",
  "big-head-effect": "M12 3c-5 0-8 3-8 8s3 8 8 8 8-3 8-8-3-8-8-8ZM8 11h.1m7.9 0h.1M9 15c2 1 4 1 6 0m-3 4v3",
  "halloween-mask": "M3 7c6-3 12-3 18 0l-2 9-7 5-7-5-2-9Zm3 4 4 1-2 2-2-3Zm12 0-4 1 2 2 2-3ZM10 17h4",
  "pregnant-filter": "M10 3c2 0 3 1 3 3s-1 3-3 3-3-1-3-3 1-3 3-3Zm0 6c-3 0-4 3-4 6v6m4-12c4 0 7 3 7 7s-3 5-7 5m-4-6h11",
  "birthday-image-generator": "M4 11h16v10H4V11Zm2 0V8h12v3M8 8V6m4 2V5m4 3V6M7 15h10m-8 6v-6m6 6v-6",
  "ai-fortune-teller": "M12 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-4 14-2 4h12l-2-4M9 12c2-1 4-3 6-3m-3-3v2m4 3h2",
  "elf-name-generator": "M6 4c5 0 10 5 10 10 0 4-2 6-5 6s-5-2-5-6V4Zm0 1 8 9m-3 6c0-4 3-7 8-8m-2-7 2-2m-1 4h3",
  "old-photo-restoration": "M4 4h16v16H4V4Zm3 12 3-4 2 2 3-4 2 3m-6-6h.1M4 9h3m5 11v-3m8-5h-3M2 12h4",
  "face-blur": "M5 5h14v14H5V5Zm7 2c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5Zm-3 4h.1m5.9 0h.1M9 14h6m-9-8 12 12",
  "merge-portraits": "M3 5h12v14H3V5Zm6 0h12v14H9V5ZM6 10h.1m6 0h.1m5 0h.1M6 15c1 1 2 1 3 0m3 0c1 1 2 1 3 0m2 0h2",
};

const categoryMarks: Record<CategoryId, string> = {
  "face-analysis": "M12 3C8 3 5 6 5 11c0 5 3 9 7 10 4-1 7-5 7-10 0-5-3-8-7-8ZM8 11h.1m8 0h.1M10 15h4M2 7V4h3m17 3V4h-3",
  "glow-up": "M4 17V7h9v10H4Zm3-6h3m7-8v5m-2.5-2.5h5M16 13l2 2 3-3M4 21h16",
  "skin-retouch": "M12 3c4 5 7 9 7 12a7 7 0 0 1-14 0c0-3 3-7 7-12Zm-4 12h.1m4-3h.1m3 4h.1",
  "hair-beard": "M4 12C3 6 6 3 12 3s9 3 8 9l-3-3-2-2c-2 3-5 4-9 4l-2 1Zm3 1c0 4 2 7 5 9 3-2 5-5 5-9",
  "makeup-tryon": "M3 12c3 0 4-3 7-3l2 1 2-1c3 0 4 3 7 3-2 3-5 5-9 5s-7-2-9-5Zm2 0c4 2 10 2 14 0M17 3v3m-1.5-1.5h3",
  "fashion-style": "M8 4 4 7 2 11l4 2 1-2v9h10v-9l1 2 4-2-2-4-4-3c-1 2-2 3-4 3S9 6 8 4Z",
  "fun-effects": "M4 5h16v14H4V5Zm4 5h.1m7.9 0h.1M8 14c2 2 6 2 8 0m4-12v4m-2-2h4",
  "photo-tools": "M3 5h18v14H3V5Zm3 11 4-4 3 3 3-5 4 6M7 9h.1",
};

function ProductIcon({ mark, size = 20, className = "" }: { mark: string; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={mark} /></svg>;
}

export function ToolGlyph({ slug, size, className }: { slug: string; size?: number; className?: string }) {
  return <ProductIcon mark={toolMarks[slug] ?? categoryMarks["face-analysis"]} size={size} className={className} />;
}

export function CategoryGlyph({ id, size, className }: { id: CategoryId; size?: number; className?: string }) {
  return <ProductIcon mark={categoryMarks[id]} size={size} className={className} />;
}

export const PRODUCT_ICON_SLUGS = Object.keys(toolMarks);
