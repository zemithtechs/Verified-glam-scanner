// "Where you stand" gauge inspired by percentile-band visualizations, but
// honestly labeled: the shaded band is our own typical-range framing, not a
// claimed real-population percentile we don't have data to back.
export function RangeGauge({ label, value, typicalFrom = 45, typicalTo = 78 }: { label: string; value: number; typicalFrom?: number; typicalTo?: number }) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-(--color-text-muted)">{label}</p>
        <p className="text-xs font-bold text-(--color-burgundy-dark)">{Math.round(clamped)}/100</p>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-(--color-blush)">
        <div className="absolute h-full rounded-full bg-(--color-rose)/60" style={{ left: `${typicalFrom}%`, width: `${typicalTo - typicalFrom}%` }} />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-(--color-burgundy) shadow"
          style={{ left: `${clamped}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-(--color-text-muted)">Shaded band shows the typical range for this metric.</p>
    </div>
  );
}
