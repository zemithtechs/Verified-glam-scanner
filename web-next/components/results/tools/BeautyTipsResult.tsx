import type { BeautyTipsPayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { CalloutOverlay, CalloutPill } from "../shared/CalloutOverlay";
import { hexColor } from "../shared/overlayLayout";

// Mirrors lib/screens/scan/results/vg_beauty_tips_result.dart
const SEVERITY_COLOR: Record<string, string> = { high: "#C62828", medium: "#E65100", low: "#2E7D32" };

export function BeautyTipsResult({ payload, photoUrl }: { payload: BeautyTipsPayload; photoUrl: string | null }) {
  const findings = payload.findings ?? [];
  const tips = payload.tips ?? [];
  const annotations = payload.annotations ?? [];

  return (
    <div className="space-y-6">
      <PhotoHero
        photoUrl={photoUrl}
        overlay={
          <CalloutOverlay
            items={annotations.map((a, i) => ({
              key: a.spotId ?? `spot-${i}`,
              anchor: a.anchor,
              labelSide: a.labelSide,
              color: hexColor(a.color),
              render: () => <CalloutPill text={a.text} color={hexColor(a.color)} dense={annotations.length > 6} />,
            }))}
          />
        }
      />

      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">Beauty tips</p>
        {payload.summary && <p className="mt-2 text-sm leading-relaxed text-(--color-text)">{payload.summary}</p>}

        <div className="mt-6 space-y-6">
          {findings.map((f) => (
            <div key={f.categoryId}>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-(--color-burgundy-dark)">{f.categoryName}{f.spotCount > 1 ? ` · ${f.spotCount} areas` : ""}</h4>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-white" style={{ backgroundColor: SEVERITY_COLOR[f.severity] ?? "#2E7D32" }}>{f.severity}</span>
              </div>
              <div className="mt-3 space-y-3">
                {tips.filter((t) => t.categoryId === f.categoryId).map((t, i) => (
                  <div key={i} className="rounded-[14px] bg-(--color-surface) p-4">
                    <p className="font-bold text-(--color-burgundy-dark)">{t.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-(--color-text)">{t.body}</p>
                    <p className="mt-2 text-[11px] italic text-(--color-text-muted)">{t.disclaimer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {payload.globalDisclaimer && (
          <div className="mt-6 rounded-[14px] border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">{payload.globalDisclaimer}</div>
        )}
      </div>
    </div>
  );
}
