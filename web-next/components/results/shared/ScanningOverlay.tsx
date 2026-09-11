"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Mapping facial landmarks…",
  "Measuring proportions…",
  "Analyzing symmetry…",
  "Reading skin texture…",
  "Calibrating your score…",
];

const POINTS = [
  { x: 32, y: 30 }, { x: 66, y: 34 }, { x: 50, y: 46 },
  { x: 40, y: 62 }, { x: 60, y: 64 }, { x: 50, y: 78 },
];

// Decorative "live scan" effect shown over the uploaded photo while an
// analysis request is in flight — a moving scan line, pulsing landmark dots,
// and a cycling caption, so the wait itself feels like real-time measurement.
export function ScanningOverlay() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setPhraseIndex((i) => (i + 1) % PHRASES.length), 1400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[14px]">
      <div className="absolute inset-0 bg-black/15" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[20, 40, 60, 80].map((y) => <line key={`h-${y}`} x1={0} y1={y} x2={100} y2={y} stroke="white" strokeOpacity={0.18} strokeWidth={0.4} />)}
        {[25, 50, 75].map((x) => <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={100} stroke="white" strokeOpacity={0.18} strokeWidth={0.4} />)}
        {POINTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.4} fill="#C5FF6B" style={{ animation: `vg-scan-pulse 1.6s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </svg>
      <div className="vg-scan-sweep absolute inset-x-0 h-[18%] bg-gradient-to-b from-transparent via-white/35 to-transparent" />
      <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Scanning
      </span>
      <p className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-1.5 text-center text-[11px] font-semibold text-white">{PHRASES[phraseIndex]}</p>
    </div>
  );
}
