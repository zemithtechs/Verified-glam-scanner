// Pure port of lib/components/vg/results/vg_overlay_label_layout.dart —
// collision-avoidance math shared by the mobile skin-concern / beauty-annotation /
// symmetry-callout overlays. Operates on plain arrays so both the pixel-space
// (CalloutOverlay) and percentage-space callers can reuse it.

export function collisionGap(pillHeight: number, extra = 8): number {
  return pillHeight + extra;
}

/** Flip vertically-close labels from one side to the other (left/right only). Mutates `sides`. */
export function balanceVerticalSides(sides: string[], tops: number[], pillHeight: number, proximity = 12): void {
  for (let i = 0; i < sides.length; i++) {
    for (let j = i + 1; j < sides.length; j++) {
      const a = sides[i];
      const b = sides[j];
      if (a !== b || a === "top" || a === "bottom") continue;
      if (Math.abs(tops[i] - tops[j]) > pillHeight + proximity) continue;
      sides[j] = a === "left" ? "right" : "left";
    }
  }
}

/** Multi-pass vertical separation for a left/right column. Mutates `tops`. */
export function resolveVerticalCollisions(tops: number[], pillHeight: number, minTop: number, maxTop: number, maxPasses = 6, extraGap = 8): void {
  if (tops.length === 0) return;
  const gap = collisionGap(pillHeight, extraGap);
  const indices = tops.map((_, i) => i).sort((a, b) => tops[a] - tops[b]);

  for (let pass = 0; pass < maxPasses; pass++) {
    let moved = false;
    for (let i = 1; i < indices.length; i++) {
      const prev = indices[i - 1];
      const curr = indices[i];
      if (tops[curr] - tops[prev] < gap) {
        tops[curr] = tops[prev] + gap;
        moved = true;
      }
    }
    for (const idx of indices) {
      const clamped = Math.min(Math.max(tops[idx], minTop), maxTop);
      if (clamped !== tops[idx]) moved = true;
      tops[idx] = clamped;
    }
    if (!moved) break;
  }
}

/** Horizontal separation for a top/bottom band. Mutates `lefts`. */
export function resolveHorizontalCollisions(lefts: number[], pillWidth: number, minLeft: number, maxLeft: number, maxPasses = 6): void {
  if (lefts.length === 0) return;
  const gap = 6;
  const indices = lefts.map((_, i) => i).sort((a, b) => lefts[a] - lefts[b]);

  for (let pass = 0; pass < maxPasses; pass++) {
    let moved = false;
    for (let i = 1; i < indices.length; i++) {
      const prev = indices[i - 1];
      const curr = indices[i];
      if (lefts[curr] - lefts[prev] < pillWidth + gap) {
        lefts[curr] = lefts[prev] + pillWidth + gap;
        moved = true;
      }
    }
    for (const idx of indices) {
      const clamped = Math.min(Math.max(lefts[idx], minLeft), maxLeft);
      if (clamped !== lefts[idx]) moved = true;
      lefts[idx] = clamped;
    }
    if (!moved) break;
  }
}

export function hexColor(intColor: number | undefined, fallback = "#e07a9a"): string {
  if (intColor == null || !Number.isFinite(intColor)) return fallback;
  const rgb = intColor & 0xffffff;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}
