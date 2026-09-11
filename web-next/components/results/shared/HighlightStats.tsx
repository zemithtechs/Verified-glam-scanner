import type { LucideIcon } from "lucide-react";

export type HighlightStat = { icon: LucideIcon; value: string; label: string };

// A quick-scan strip of headline numbers with icons — the "at a glance" row
// premium beauty-score apps lead with, before the detailed breakdown below.
export function HighlightStats({ items }: { items: HighlightStat[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 border-y border-(--color-border) py-4">
      {items.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex min-w-[84px] flex-1 flex-col items-center gap-1 px-2 text-center">
          <Icon size={18} className="text-(--color-burgundy)" />
          <span className="text-base font-extrabold text-(--color-burgundy-dark)">{value}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-(--color-text-muted)">{label}</span>
        </div>
      ))}
    </div>
  );
}
