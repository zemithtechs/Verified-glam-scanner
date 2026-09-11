// Mirrors lib/components/vg/results/vg_overall_score_bar.dart
export function OverallScoreBar({ label, percent }: { label: string; percent: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div className="rounded-[16px] border border-(--color-border) bg-white p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-text-muted)">{label}</p>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-(--color-blush)">
        <div className="h-full rounded-full bg-(--color-burgundy)" style={{ width: `${clamped}%` }} />
      </div>
      <p className="mt-3 text-2xl font-extrabold text-(--color-burgundy-dark)">{Math.round(clamped)}%</p>
    </div>
  );
}
