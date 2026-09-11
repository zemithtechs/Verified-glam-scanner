import { Award, CalendarDays, Brain, Scale } from "lucide-react";
import type { FaceReadingPayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { MeshOverlay } from "../shared/MeshOverlay";
import { ScoreRing } from "../shared/ScoreRing";
import { SubscoreGrid, humanizeKey } from "../shared/SubscoreBar";
import { CircularScoreHero } from "../shared/CircularScoreHero";
import { HighlightStats } from "../shared/HighlightStats";
import { RangeGauge } from "../shared/RangeGauge";
import { OpportunityCallout } from "../shared/OpportunityCallout";
import { lowestEntry } from "../shared/scoreUtils";

// Mirrors lib/screens/scan/results/vg_attractiveness_result.dart
function ScanBoxOverlay({ faceBox, landmarks, meshConnections }: { faceBox: FaceReadingPayload["faceBox"]; landmarks?: FaceReadingPayload["landmarks"]; meshConnections?: FaceReadingPayload["meshConnections"] }) {
  const arm = Math.min(faceBox.width, faceBox.height) * 0.12 * 100;
  const x = faceBox.x * 100;
  const y = faceBox.y * 100;
  const w = faceBox.width * 100;
  const h = faceBox.height * 100;

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="white" strokeOpacity={0.28} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {[[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].map(([cx, cy, sx, sy], i) => (
        <g key={i} stroke="white" strokeOpacity={0.85} strokeWidth={1.5} vectorEffect="non-scaling-stroke">
          <line x1={cx} y1={cy} x2={cx + sx * arm} y2={cy} />
          <line x1={cx} y1={cy} x2={cx} y2={cy + sy * arm} />
        </g>
      ))}
      <g>
        <MeshOverlay landmarks={landmarks} meshConnections={meshConnections} color="#ffffff" />
      </g>
    </svg>
  );
}

export function AttractivenessResult({ payload, photoUrl }: { payload: FaceReadingPayload; photoUrl: string | null }) {
  const appearance = payload.appearanceScores ?? { beauty: 75, handsomeness: 75, cuteness: 75, faceShape: 75, facialSymmetry: 75, skinSmoothness: 75 };
  const traits = payload.traitScores ?? { funFactor: 75, intelligence: 75, confidence: 75, credibility: 75 };
  const weakest = lowestEntry({ ...appearance, ...traits });

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-(--color-border) bg-white">
        <CircularScoreHero photoUrl={photoUrl} score={payload.overallScore.toFixed(1)} scoreSuffix="/10" tierLabel={payload.tierLabel} />
        <HighlightStats
          items={[
            { icon: Award, value: `${payload.overallScore.toFixed(1)}/10`, label: "Overall score" },
            { icon: CalendarDays, value: `~${payload.facialAge}`, label: "Facial age" },
            { icon: Scale, value: `${Math.round(appearance.facialSymmetry)}`, label: "Symmetry" },
            { icon: Brain, value: `${Math.round(traits.intelligence)}`, label: "Intelligence" },
          ]}
        />
      </div>
      <PhotoHero photoUrl={photoUrl} overlay={<ScanBoxOverlay faceBox={payload.faceBox} landmarks={payload.landmarks} meshConnections={payload.meshConnections} />} />

      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <div className="flex items-center gap-5">
          <ScoreRing score={payload.overallScore} />
          <div>
            <p className="text-lg font-extrabold text-(--color-burgundy-dark)">{payload.tierLabel}</p>
            <p className="mt-1 text-sm text-(--color-text-muted)">{payload.subtitle}</p>
            <span className="mt-2 inline-block rounded-full bg-(--color-blush) px-3 py-1 text-xs font-bold text-(--color-burgundy)">Facial age ~{payload.facialAge}</span>
          </div>
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">Appearance</p>
        <div className="mt-3">
          <SubscoreGrid
            scores={[
              ["Beauty", appearance.beauty],
              ["Cuteness", appearance.cuteness],
              ["Skin smoothness", appearance.skinSmoothness],
              ["Handsomeness", appearance.handsomeness],
              ["Face shape", appearance.faceShape],
              ["Facial symmetry", appearance.facialSymmetry],
            ]}
          />
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">Traits</p>
        <div className="mt-3">
          <SubscoreGrid
            scores={[
              ["Fun factor", traits.funFactor],
              ["Intelligence", traits.intelligence],
              ["Confidence", traits.confidence],
              ["Credibility", traits.credibility],
            ]}
          />
        </div>

        <div className="mt-6">
          <RangeGauge label="Overall score" value={payload.overallPercent} />
        </div>

        {weakest && (
          <div className="mt-6">
            <OpportunityCallout label={humanizeKey(weakest.key)} value={weakest.value} />
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-(--color-text-muted)">Proportion-based harmony reading — for wellness inspiration, not a medical or scientific judgment.</p>
      </div>
    </div>
  );
}
