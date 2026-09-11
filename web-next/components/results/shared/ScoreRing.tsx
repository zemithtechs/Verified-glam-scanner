// Mirrors lib/components/vg/results/vg_score_out_of_10_ring.dart
export function ScoreRing({ score, size = 84 }: { score: number; size?: number }) {
  const clamped = Math.min(Math.max(score, 0), 10);
  const radius = (size - 5) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 10);
  // Always one decimal — a fixed-width value keeps the ring's text from
  // outgrowing the circle regardless of score (previously "8.20" vs "8.2"
  // shifted width unpredictably and could clip past the stroke).
  const display = clamped.toFixed(1);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-blush)" strokeWidth={5} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-burgundy)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {/* Value and suffix stack vertically (rather than share one baseline row)
          so the suffix never competes with the value for horizontal space. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-extrabold text-(--color-burgundy-dark)" style={{ fontSize: size * 0.24 }}>{display}</span>
        <span className="mt-0.5 text-(--color-text-muted)" style={{ fontSize: size * 0.13 }}>/10</span>
      </div>
    </div>
  );
}
