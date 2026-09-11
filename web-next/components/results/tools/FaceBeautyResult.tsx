import { Award, Scale, Sparkles, Smile } from "lucide-react";
import type { FaceBeautyPayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { CalloutOverlay, CalloutPill } from "../shared/CalloutOverlay";
import { SubscoreGrid, humanizeKey } from "../shared/SubscoreBar";
import { InsightsList } from "../shared/InsightsList";
import { CircularScoreHero } from "../shared/CircularScoreHero";
import { HighlightStats } from "../shared/HighlightStats";
import { RangeGauge } from "../shared/RangeGauge";
import { OpportunityCallout } from "../shared/OpportunityCallout";
import { lowestEntry } from "../shared/scoreUtils";

// Mirrors lib/screens/scan/results/vg_face_beauty_result.dart
function GuideOverlay({ guides }: { guides?: FaceBeautyPayload["guides"] }) {
  const verticalCenter = guides?.verticalCenter ?? 0.5;
  const eyeLineY = guides?.eyeLineY ?? 0.38;
  const lipLineY = guides?.lipLineY ?? 0.62;
  const curves: [string, { x: number; y: number }[] | undefined][] = [
    ["brow", guides?.browCurve],
    ["nose", guides?.noseBridge],
    ["jaw", guides?.jawCurve],
  ];

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1={verticalCenter * 100} y1={0} x2={verticalCenter * 100} y2={100} stroke="white" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="4 3.5" vectorEffect="non-scaling-stroke" />
      <line x1={0} y1={eyeLineY * 100} x2={100} y2={eyeLineY * 100} stroke="white" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="4 3.5" vectorEffect="non-scaling-stroke" />
      <line x1={0} y1={lipLineY * 100} x2={100} y2={lipLineY * 100} stroke="white" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="4 3.5" vectorEffect="non-scaling-stroke" />
      {curves.map(([key, points]) =>
        points && points.length > 1 ? (
          <polyline
            key={key}
            points={points.map((p) => `${p.x * 100},${p.y * 100}`).join(" ")}
            fill="none"
            stroke="#C5A373"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        ) : null,
      )}
    </svg>
  );
}

export function FaceBeautyResult({ payload, photoUrl }: { payload: FaceBeautyPayload; photoUrl: string | null }) {
  const subscores = payload.subscores ?? { symmetry: 75, featureBalance: 75, skinQuality: 75, youthfulCues: 75, overallBeauty: 75 };
  const annotations = payload.annotations ?? [];
  const weakest = lowestEntry(subscores);

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-(--color-border) bg-white">
        <CircularScoreHero photoUrl={photoUrl} score={String(Math.round(payload.beautyScore))} scoreSuffix="/100" tierLabel={payload.ratingLabel} />
        <HighlightStats
          items={[
            { icon: Award, value: `${Math.round(payload.beautyScore)}`, label: "Beauty score" },
            { icon: Scale, value: `${Math.round(subscores.symmetry)}`, label: "Symmetry" },
            { icon: Sparkles, value: `${Math.round(subscores.skinQuality)}`, label: "Skin quality" },
            { icon: Smile, value: `${Math.round(subscores.youthfulCues)}`, label: "Youthful cues" },
          ]}
        />
      </div>
      <PhotoHero
        photoUrl={photoUrl}
        overlay={
          <>
            <GuideOverlay guides={payload.guides} />
            <CalloutOverlay
              items={annotations.map((a, i) => ({
                key: `beauty-${i}`,
                anchor: a.anchor,
                labelSide: a.labelSide,
                color: "#C5A373",
                dot: false,
                render: () => <CalloutPill text={a.text} color="#C5A373" />,
              }))}
            />
          </>
        }
      />
      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-(--color-burgundy-dark)">{Math.round(payload.beautyScore)}<span className="text-lg text-(--color-text-muted)">/100</span></p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">AI Beauty Score</p>
            <p className="mt-1 text-lg font-extrabold text-(--color-burgundy-dark)">{payload.ratingLabel}</p>
          </div>
        </div>
        <div className="mt-6">
          <RangeGauge label="Overall beauty score" value={payload.beautyScore} />
        </div>
        <div className="mt-6">
          <SubscoreGrid
            scores={[
              ["Symmetry", subscores.symmetry],
              ["Feature balance", subscores.featureBalance],
              ["Skin quality", subscores.skinQuality],
              ["Youthful cues", subscores.youthfulCues],
              ["Overall beauty", subscores.overallBeauty],
            ]}
          />
        </div>
        {weakest && (
          <div className="mt-6">
            <OpportunityCallout label={humanizeKey(weakest.key)} value={weakest.value} />
          </div>
        )}
        <InsightsList items={annotations.map((a) => a.text)} />
        <p className="mt-6 text-xs leading-relaxed text-(--color-text-muted)">Beauty is subjective and this AI reading is for entertainment and self-reflection — not a medical or professional judgment.</p>
      </div>
    </div>
  );
}
