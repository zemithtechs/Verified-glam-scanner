import type { CategoryId } from "./catalog";

/** Sidebar sections, in the order a user thinks about a task: understand, fix, try on, play. */
export const NAV_GROUPS: { label: string; categories: CategoryId[] }[] = [
  { label: "Analyze", categories: ["face-analysis", "glow-up"] },
  { label: "Edit & retouch", categories: ["skin-retouch", "photo-tools"] },
  { label: "Try on", categories: ["hair-beard", "makeup-tryon", "fashion-style"] },
  { label: "Play", categories: ["fun-effects"] },
];

/** Mega-menu column order (two rows of four). */
export const MEGA_ORDER: CategoryId[] = ["face-analysis", "glow-up", "skin-retouch", "photo-tools", "hair-beard", "makeup-tryon", "fashion-style", "fun-effects"];
