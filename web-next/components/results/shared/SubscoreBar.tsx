// Mirrors lib/components/vg/results/vg_subscore_row.dart
export function SubscoreBar({ label, percent }: { label: string; percent: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] text-(--color-text)">{label}</span>
        <span className="text-sm font-bold text-(--color-burgundy-dark)">{Math.round(clamped)}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-(--color-blush)">
        <div className="h-full rounded-full bg-[#C5A373]" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export function SubscoreGrid({ scores }: { scores: Array<[string, number]> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {scores.map(([label, percent]) => <SubscoreBar key={label} label={label} percent={percent} />)}
    </div>
  );
}

export function humanizeKey(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}
