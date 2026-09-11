"use client";

// Generalized port of lib/components/vg/results/vg_skin_concern_overlay.dart
// (also covers vg_beauty_annotation_overlay.dart / vg_symmetry_callout_overlay.dart,
// which share the same anchor-pill-collision pattern, just with different pill content
// and an optional hotspot dot at the anchor).

import { useMemo } from "react";
import { balanceVerticalSides, resolveHorizontalCollisions, resolveVerticalCollisions } from "./overlayLayout";
import { useElementSize } from "./useElementSize";

export type CalloutItem = {
  key: string;
  anchor: { x: number; y: number };
  labelSide: "left" | "right" | "top" | "bottom";
  color: string;
  dot?: boolean;
  render: () => React.ReactNode;
};

type Layout = {
  item: CalloutItem;
  featureX: number;
  featureY: number;
  lineStartX: number;
  lineStartY: number;
  labelLeft: number;
  labelTop: number;
  side: string;
};

function layoutFor(item: CalloutItem, side: string, size: { width: number; height: number }, pillWidth: number, pillHeight: number, edgeInset: number): Layout {
  const ax = item.anchor.x * size.width;
  const ay = item.anchor.y * size.height;
  let top: number;
  let left: number;
  let lineStartX: number;
  let lineStartY: number;

  if (side === "left") {
    top = clamp(ay - pillHeight / 2, edgeInset, size.height - edgeInset - pillHeight);
    left = edgeInset;
    lineStartX = edgeInset + pillWidth;
    lineStartY = top + pillHeight / 2;
  } else if (side === "top") {
    top = edgeInset;
    left = clamp(ax - pillWidth / 2, edgeInset, size.width - edgeInset - pillWidth);
    lineStartX = left + pillWidth / 2;
    lineStartY = edgeInset + pillHeight;
  } else if (side === "bottom") {
    top = size.height - edgeInset - pillHeight;
    left = clamp(ax - pillWidth / 2, edgeInset, size.width - edgeInset - pillWidth);
    lineStartX = left + pillWidth / 2;
    lineStartY = top;
  } else {
    top = clamp(ay - pillHeight / 2, edgeInset, size.height - edgeInset - pillHeight);
    left = size.width - edgeInset - pillWidth;
    lineStartX = size.width - edgeInset - pillWidth;
    lineStartY = top + pillHeight / 2;
  }

  return { item, featureX: ax, featureY: ay, lineStartX, lineStartY, labelLeft: left, labelTop: top, side };
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, Math.min(min, max)), Math.max(min, max));
}

function buildLayouts(items: CalloutItem[], size: { width: number; height: number }, pillWidth: number, pillHeight: number, edgeInset: number): Layout[] {
  let layouts = items.map((item) => layoutFor(item, item.labelSide, size, pillWidth, pillHeight, edgeInset));

  // Balance: flip vertically-close same-side (left/right) labels apart.
  const sides = layouts.map((l) => l.side);
  const tops = layouts.map((l) => l.labelTop);
  balanceVerticalSides(sides, tops, pillHeight);
  layouts = layouts.map((l, i) => (sides[i] !== l.side ? layoutFor(l.item, sides[i], size, pillWidth, pillHeight, edgeInset) : l));

  for (const side of ["left", "right"]) {
    const indices = layouts.map((l, i) => (l.side === side ? i : -1)).filter((i) => i >= 0);
    if (indices.length < 2) continue;
    const sideTops = indices.map((i) => layouts[i].labelTop);
    resolveVerticalCollisions(sideTops, pillHeight, edgeInset, size.height - edgeInset - pillHeight);
    indices.forEach((idx, k) => {
      const l = layouts[idx];
      layouts[idx] = { ...l, labelTop: sideTops[k], lineStartY: sideTops[k] + pillHeight / 2 };
    });
  }

  for (const side of ["top", "bottom"]) {
    const indices = layouts.map((l, i) => (l.side === side ? i : -1)).filter((i) => i >= 0);
    if (indices.length < 2) continue;
    const lefts = indices.map((i) => layouts[i].labelLeft);
    resolveHorizontalCollisions(lefts, pillWidth, edgeInset, size.width - edgeInset - pillWidth);
    indices.forEach((idx, k) => {
      const l = layouts[idx];
      layouts[idx] = { ...l, labelLeft: lefts[k], lineStartX: lefts[k] + pillWidth / 2 };
    });
  }

  return layouts;
}

export function CalloutOverlay({ items, pillWidth = 88 }: { items: CalloutItem[]; pillWidth?: number }) {
  const { ref, size } = useElementSize<HTMLDivElement>({ width: 360, height: 480 });
  const dense = items.length > 6;
  const pillHeight = dense ? 22 : 26;
  const edgeInset = 6;

  const layouts = useMemo(() => buildLayouts(items, size, pillWidth, pillHeight, edgeInset), [items, size, pillWidth, pillHeight]);

  return (
    <div ref={ref} className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none">
        {layouts.map((l) => (
          <g key={l.item.key}>
            {l.item.dot !== false && <circle cx={l.featureX} cy={l.featureY} r={dense ? 12 : 16} fill={l.item.color} opacity={0.1} />}
            {l.item.dot !== false && <circle cx={l.featureX} cy={l.featureY} r={3.5} fill={l.item.color} />}
            {l.item.dot !== false && <circle cx={l.featureX} cy={l.featureY} r={3.5} fill="none" stroke="white" strokeWidth={1.2} opacity={0.92} />}
            <line x1={l.lineStartX} y1={l.lineStartY} x2={l.featureX} y2={l.featureY} stroke={l.item.color} strokeOpacity={0.8} strokeWidth={1} />
          </g>
        ))}
      </svg>
      {layouts.map((l) => (
        <div key={l.item.key} className="absolute" style={{ left: l.labelLeft, top: l.labelTop, width: pillWidth }}>
          {l.item.render()}
        </div>
      ))}
    </div>
  );
}

export function CalloutPill({ text, color, dense }: { text: string; color: string; dense?: boolean }) {
  return (
    <div
      className="rounded-[5px] border bg-white/95 text-center font-bold leading-tight text-(--color-burgundy-dark)"
      style={{ borderColor: color, padding: dense ? "3px 6px" : "4px 7px", fontSize: dense ? 7 : 8 }}
    >
      {text}
    </div>
  );
}
