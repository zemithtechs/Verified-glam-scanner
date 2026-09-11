import { Target } from "lucide-react";

// Surfaces the single lowest-scoring metric already in the payload as an
// actionable "focus here first" callout — real data, not a fabricated claim.
export function OpportunityCallout({ label, value, suffix = "/100" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="flex gap-3 rounded-[16px] border border-amber-200 bg-amber-50 p-4">
      <Target size={20} className="mt-0.5 shrink-0 text-amber-700" />
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-amber-700">Biggest opportunity</p>
        <p className="mt-1 text-base font-extrabold text-amber-900">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-800">
          Scored {Math.round(value)}{suffix} — the lowest of your measured metrics, and the one most likely to lift your overall score if you focus there first.
        </p>
      </div>
    </div>
  );
}
