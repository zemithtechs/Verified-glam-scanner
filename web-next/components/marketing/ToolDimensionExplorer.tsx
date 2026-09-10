"use client";

import Image from "next/image";
import { useState } from "react";
import type { ToolDefinition } from "@/lib/tools";

const DETAIL_COPY: Record<string, string> = {
  Matches: "Explore the match list and the visible traits that contributed to each entertainment-focused resemblance estimate.",
  Eyes: "See how the eye area contributes to the visual match, including shape, spacing, and the overall expression in the portrait.",
  Jawline: "This view focuses on face outline, chin, and jawline cues that can make two portraits feel visually similar.",
  Smile: "Compare the mouth area and smile expression as one part of the visual resemblance, never as an identity check.",
  Style: "Use style notes as inspiration for hair, makeup, colors, or photo direction that you may want to try for yourself.",
  Similarity: "The similarity view brings the visible cues together into one easy-to-read, entertainment-focused estimate.",
};

function detailFor(dimension: string, fallback: string) {
  return DETAIL_COPY[dimension] ?? fallback;
}

export function ToolDimensionExplorer({
  tool,
  dimensions,
  score,
  scoreLabel,
  description,
}: {
  tool: ToolDefinition;
  dimensions: string[];
  score: string;
  scoreLabel: string;
  description: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dimension = dimensions[selectedIndex];
  const imageNumber = (selectedIndex % 4) + 1;
  const objectPosition = ["50% 38%", "50% 26%", "50% 74%", "50% 54%", "50% 60%", "50% 45%"][selectedIndex] ?? "50% 50%";

  return (
    <div className="vg-reveal">
      <div role="tablist" aria-label={`${tool.title} dimensions`} className="mb-7 flex flex-wrap justify-center gap-2">
        {dimensions.map((item, index) => {
          const active = index === selectedIndex;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedIndex(index)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-burgundy) ${
                active ? "bg-(--color-burgundy) text-white shadow-[0_8px_20px_rgba(82,13,28,0.18)]" : "bg-(--color-surface) text-(--color-burgundy-dark) hover:bg-(--color-blush)"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="grid overflow-hidden rounded-[22px] border border-(--color-border) bg-white shadow-[0_16px_38px_rgba(82,13,28,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[310px] bg-(--color-surface) sm:min-h-[380px]">
          <Image
            key={`${tool.slug}-${dimension}`}
            src={`/images/landings/${tool.slug}/showcase-${imageNumber}.jpg`}
            alt={`${tool.title}: ${dimension}`}
            fill
            className="object-cover transition-opacity duration-300"
            style={{ objectPosition }}
            sizes="(min-width: 1024px) 500px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-(--color-burgundy-dark)/35 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-[14px] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(82,13,28,0.18)]">
            <p className="text-xs font-bold text-(--color-text-muted)">{scoreLabel}</p>
            <p className="mt-1 text-3xl font-extrabold leading-none tracking-[-0.05em] text-(--color-burgundy)">{score}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-burgundy)">Report dimension</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-(--color-burgundy-dark)">{dimension}</h2>
          <p className="mt-4 text-base leading-7 text-(--color-text-muted)">{detailFor(dimension, description)}</p>
          <p className="mt-4 border-l-2 border-(--color-burgundy) pl-4 text-sm leading-6 text-(--color-text-muted)">{description}</p>
          <p className="mt-6 text-sm font-bold text-(--color-burgundy-dark)">Select another dimension to update this preview.</p>
        </div>
      </div>
    </div>
  );
}
