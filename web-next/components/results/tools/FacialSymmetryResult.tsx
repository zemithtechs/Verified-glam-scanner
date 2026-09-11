import { Award, Scale, Shapes, Smile } from "lucide-react";
import type { FacialSymmetryPayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { CalloutOverlay } from "../shared/CalloutOverlay";
import { hexColor } from "../shared/overlayLayout";
import { OverallScoreBar } from "../shared/OverallScoreBar";
import { SubscoreGrid } from "../shared/SubscoreBar";
import { InsightsList } from "../shared/InsightsList";
import { CircularScoreHero } from "../shared/CircularScoreHero";
import { HighlightStats } from "../shared/HighlightStats";
import { RangeGauge } from "../shared/RangeGauge";
import { OpportunityCallout } from "../shared/OpportunityCallout";
import { lowestEntry } from "../shared/scoreUtils";

// Mirrors lib/screens/scan/results/vg_facial_symmetry_result.dart
const ICONS: Record<string, string> = { star: "★", heart: "♥", check: "✓", circle: "●" };

function regionTier(percent: number): string {
  if (percent >= 85) return "excellent balance";
  if (percent >= 70) return "good balance";
  return "room to explore";
}

function GridOverlay({ guides }: { guides: FacialSymmetryPayload["guides"] }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1={guides.verticalCenter * 100} y1={0} x2={guides.verticalCenter * 100} y2={100} stroke="white" strokeOpacity={0.4} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {guides.verticalSideLines.map((x, i) => (
        <line key={`v-${i}`} x1={x * 100} y1={0} x2={x * 100} y2={100} stroke="white" strokeOpacity={0.4} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
      {guides.horizontalLines.map((y, i) => (
        <line key={`h-${i}`} x1={0} y1={y * 100} x2={100} y2={y * 100} stroke="white" strokeOpacity={0.4} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export function FacialSymmetryResult({ payload, photoUrl }: { payload: FacialSymmetryPayload; photoUrl: string | null }) {
  const overallScore = payload.overallSymmetryScore ?? payload.overallPercent ?? 82;
  const subscores = payload.subscores ?? { beauty: 75, cuteness: 75, skinSmoothness: 75, handsomeness: 75, faceShape: 75, facialSymmetry: 75 };
  const regions = payload.regions ?? [];
  const weakestRegion = lowestEntry(Object.fromEntries(regions.map((r) => [r.id, r.percent])));
  const weakestRegionLabel = regions.find((r) => r.id === weakestRegion?.key)?.label ?? weakestRegion?.key ?? "";

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-(--color-border) bg-white">
        <CircularScoreHero photoUrl={photoUrl} score={String(Math.round(overallScore))} scoreSuffix="%" tierLabel={payload.tierLabel} />
        <HighlightStats
          items={[
            { icon: Award, value: `${Math.round(overallScore)}%`, label: "Overall symmetry" },
            { icon: Scale, value: `${Math.round(subscores.facialSymmetry)}`, label: "Facial symmetry" },
            { icon: Shapes, value: `${Math.round(subscores.faceShape)}`, label: "Face shape" },
            { icon: Smile, value: `${Math.round(subscores.beauty)}`, label: "Beauty" },
          ]}
        />
      </div>
      <PhotoHero
        photoUrl={photoUrl}
        overlay={
          <>
            <GridOverlay guides={payload.guides} />
            <CalloutOverlay
              items={regions.map((r) => ({
                key: r.id,
                anchor: r.anchor,
                labelSide: r.labelSide,
                color: hexColor(r.color),
                dot: false,
                render: () => (
                  <div
                    className="rounded-[5px] border bg-white/95 px-1.5 py-1 text-center text-[8px] font-extrabold uppercase leading-tight text-(--color-burgundy-dark)"
                    style={{ borderColor: hexColor(r.color) }}
                  >
                    {ICONS[r.icon] ?? ""} {r.label}: {Math.round(r.percent)}%
                  </div>
                ),
              }))}
            />
          </>
        }
      />
      <OverallScoreBar label="Overall symmetry rating" percent={overallScore} />
      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <p className="text-4xl font-extrabold text-(--color-burgundy-dark)">{Math.round(overallScore)}%</p>
        <p className="mt-1 text-sm font-bold text-(--color-text-muted)">{payload.tierLabel}</p>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">Symmetry &amp; attractiveness</p>
        <div className="mt-4">
          <RangeGauge label="Overall symmetry" value={overallScore} />
        </div>
        <div className="mt-6">
          <SubscoreGrid
            scores={[
              ["Beauty", subscores.beauty],
              ["Cuteness", subscores.cuteness],
              ["Skin smoothness", subscores.skinSmoothness],
              ["Handsomeness", subscores.handsomeness],
              ["Face shape", subscores.faceShape],
              ["Facial symmetry", subscores.facialSymmetry],
            ]}
          />
        </div>
        {weakestRegion && (
          <div className="mt-6">
            <OpportunityCallout label={weakestRegionLabel} value={weakestRegion.value} suffix="%" />
          </div>
        )}
        <InsightsList
          title="Region breakdown"
          items={regions.map((r) => `${r.label}: ${Math.round(r.percent)}% — ${regionTier(r.percent)}.`)}
        />
      </div>
    </div>
  );
}
