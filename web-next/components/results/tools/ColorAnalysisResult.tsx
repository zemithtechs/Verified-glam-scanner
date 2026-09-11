import type { ColorAnalysisPayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { CalloutOverlay, CalloutPill } from "../shared/CalloutOverlay";
import { hexColor } from "../shared/overlayLayout";
import { InsightsList } from "../shared/InsightsList";

// Mirrors lib/screens/scan/results/vg_color_analysis_result.dart
// ("Try Makeup" CTA omitted — it's a navigation hook into a separate Makeup Studio feature)
function Swatch({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: hex }} />
      <span className="text-xs font-bold text-(--color-text-muted)">{label}</span>
    </div>
  );
}

export function ColorAnalysisResult({ payload, photoUrl }: { payload: ColorAnalysisPayload; photoUrl: string | null }) {
  const sample = payload.samplePoint ?? { x: 0.42, y: 0.55 };
  const palette = payload.palette ?? [];
  const paletteHex = payload.paletteHex ?? [];
  const annotations = payload.annotations ?? [];

  return (
    <div className="space-y-6">
      <PhotoHero
        photoUrl={photoUrl}
        overlay={
          <>
            <div
              className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-(--color-burgundy)/60"
              style={{ left: `${sample.x * 100}%`, top: `${sample.y * 100}%` }}
            />
            {annotations.length > 0 && (
              <CalloutOverlay
                items={annotations.map((a, i) => ({
                  key: a.spotId ?? `spot-${i}`,
                  anchor: a.anchor,
                  labelSide: a.labelSide,
                  color: hexColor(a.color),
                  render: () => <CalloutPill text={a.text} color={hexColor(a.color)} dense={annotations.length > 6} />,
                }))}
              />
            )}
          </>
        }
      />

      <div className="flex justify-center gap-6 rounded-[20px] border border-(--color-border) bg-white p-6">
        <Swatch label="Skin" hex={payload.skin} />
        <Swatch label="Hair" hex={payload.hair} />
        <Swatch label="Eyes" hex={payload.eyes} />
      </div>

      <div className="rounded-[16px] bg-(--color-surface) p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">Season</p>
        <p className="mt-1 text-lg font-extrabold text-(--color-burgundy-dark)">{payload.season}</p>
      </div>

      <div>
        <p className="text-sm font-bold text-(--color-burgundy-dark)">Your palette</p>
        <div className="mt-3 flex flex-wrap gap-4">
          {palette.map((name, i) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <div className="h-13 w-13 rounded-xl border border-white shadow-sm" style={{ backgroundColor: paletteHex[i] ?? "#c79a9a", width: 52, height: 52 }} />
              <span className="max-w-[64px] truncate text-[11px] text-(--color-text-muted)">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {(payload.avoid ?? []).length > 0 && (
        <div className="rounded-[16px] border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-amber-800">Use sparingly</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {payload.avoid.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      )}

      <InsightsList items={annotations.map((a) => a.text)} />
    </div>
  );
}
