import type { GlowUpGuidePayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { CalloutOverlay, CalloutPill } from "../shared/CalloutOverlay";
import { hexColor } from "../shared/overlayLayout";

// Mirrors lib/screens/scan/results/vg_glow_up_result.dart (result display only —
// the mobile app's multi-day "challenge" tracking flow is a separate feature, out of scope here)
const SEVERITY_COLOR: Record<string, string> = { high: "#C62828", medium: "#E65100", low: "#2E7D32" };

export function GlowUpResult({ payload, photoUrl }: { payload: GlowUpGuidePayload; photoUrl: string | null }) {
  const issues = payload.detectedIssues ?? [];
  const annotations = payload.annotations ?? [];

  return (
    <div className="space-y-6">
      <PhotoHero
        photoUrl={photoUrl}
        overlay={
          annotations.length > 0 ? (
            <CalloutOverlay
              items={annotations.map((a, i) => ({
                key: a.spotId ?? `spot-${i}`,
                anchor: a.anchor,
                labelSide: a.labelSide,
                color: hexColor(a.color),
                render: () => <CalloutPill text={a.text} color={hexColor(a.color)} dense={annotations.length > 6} />,
              }))}
            />
          ) : undefined
        }
      />

      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">What we found</p>
        {payload.summary && <p className="mt-2 text-sm leading-relaxed text-(--color-text)">{payload.summary}</p>}

        {issues.length === 0 ? (
          <p className="mt-4 text-sm text-(--color-text-muted)">No notable concerns were detected — keep up your routine.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {issues.map((issue) => (
              <div key={issue.issueId} className="flex items-center gap-3 rounded-[14px] bg-(--color-surface) p-4">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: SEVERITY_COLOR[issue.severity] ?? "#2E7D32" }} />
                <div>
                  <p className="font-bold text-(--color-burgundy-dark)">{issue.label}</p>
                  <p className="text-xs text-(--color-text-muted)">{issue.anchors?.length > 1 ? "Visible on multiple areas" : "Visible on your portrait"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {payload.globalDisclaimer && (
          <div className="mt-6 rounded-[14px] border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">{payload.globalDisclaimer}</div>
        )}
      </div>
    </div>
  );
}
