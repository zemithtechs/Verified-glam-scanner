"use client";

import { useState } from "react";

// A curated, on-brand palette (not a generic rainbow) so a colored-initials
// fallback still looks intentional rather than like a placeholder.
const PALETTE = ["#872B3F", "#5B8DEF", "#4CAF7A", "#C79A9A", "#E8A04C", "#7B6FD6", "#E07A9A", "#3B8F8C"];

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function initialsFor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return trimmed.slice(0, 2).toUpperCase();
}

// Circular avatar used everywhere a user's identity appears (nav, account
// settings, their own Showdown podium slot): real photo when one exists,
// otherwise a deterministic colored-initials avatar instead of a generic
// stock image or placeholder icon.
export function Avatar({ src, name, size = 40 }: { src?: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full font-extrabold text-white"
        style={{ width: size, height: size, fontSize: size * 0.38, backgroundColor: colorFor(name || "?") }}
      >
        {initialsFor(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
