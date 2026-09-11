import { Award, Ratio, Target, TrendingUp } from "lucide-react";
import type { GoldenRatioPayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { ScoreRing } from "../shared/ScoreRing";
import { useElementSize } from "../shared/useElementSize";
import { CircularScoreHero } from "../shared/CircularScoreHero";
import { HighlightStats } from "../shared/HighlightStats";
import { RangeGauge } from "../shared/RangeGauge";
import { OpportunityCallout } from "../shared/OpportunityCallout";
import { lowestEntry } from "../shared/scoreUtils";

// Mirrors lib/components/vg/results/vg_golden_ratio_measurement_overlay.dart
const LEFT_SLOT_Y: Record<string, number> = { eyeWidthEyeDistance: 0.2, faceLengthWidth: 0.42, noseWidthFaceWidth: 0.64 };
const RIGHT_SLOT_Y: Record<string, number> = { eyeDistanceFaceWidth: 0.2, philtrumNose: 0.44, mouthWidthNoseWidth: 0.68 };
const CALLOUT_WIDTH = 96;
const CALLOUT_HEIGHT = 46;

function MeasurementOverlay({ landmarks, measurements, overallScore, ratingLabel }: {
  landmarks: GoldenRatioPayload["landmarks"];
  measurements: GoldenRatioPayload["measurements"];
  overallScore: number;
  ratingLabel: string;
}) {
  const { ref, size } = useElementSize<HTMLDivElement>({ width: 360, height: 480 });

  return (
    <div ref={ref} className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1={50} y1={0} x2={50} y2={100} stroke="white" strokeOpacity={0.35} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        {[38, 52, 64].map((y) => (
          <line key={y} x1={0} y1={y} x2={100} y2={y} stroke="white" strokeOpacity={0.35} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
        {Object.values(landmarks).map((p, i) => (
          <circle key={i} cx={p.x * 100} cy={p.y * 100} r={0.8} fill="white" opacity={0.92} />
        ))}
        {measurements.map((m) => (
          <line key={m.id} x1={m.from.x * 100} y1={m.from.y * 100} x2={m.to.x * 100} y2={m.to.y * 100} stroke="#E53935" strokeOpacity={0.88} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
        ))}
        {measurements.map((m) => {
          const side = m.labelSide === "left" ? "left" : "right";
          const slotY = (side === "left" ? LEFT_SLOT_Y[m.id] : RIGHT_SLOT_Y[m.id]) ?? 0.45;
          const featureX = ((m.from.x + m.to.x) / 2) * size.width;
          const featureY = ((m.from.y + m.to.y) / 2) * size.height;
          const top = Math.min(Math.max(slotY * size.height - CALLOUT_HEIGHT / 2, 42), size.height - CALLOUT_HEIGHT - 44);
          const labelX = side === "left" ? 6 + CALLOUT_WIDTH : size.width - 6 - CALLOUT_WIDTH;
          return <line key={`leader-${m.id}`} x1={labelX} y1={top + CALLOUT_HEIGHT / 2} x2={featureX} y2={featureY} stroke="white" strokeOpacity={0.65} strokeWidth={1} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>

      {measurements.map((m) => {
        const side = m.labelSide === "left" ? "left" : "right";
        const slotY = (side === "left" ? LEFT_SLOT_Y[m.id] : RIGHT_SLOT_Y[m.id]) ?? 0.45;
        const top = Math.min(Math.max(slotY * size.height - CALLOUT_HEIGHT / 2, 42), size.height - CALLOUT_HEIGHT - 44);
        const statusColor = m.pass ? "#2E7D32" : "#E53935";
        return (
          <div
            key={m.id}
            className="absolute rounded-md border bg-white/95 px-1.5 py-1"
            style={{ [side]: 6, top, width: CALLOUT_WIDTH, borderColor: `${statusColor}73` }}
          >
            <p className="truncate text-[8px] font-extrabold text-(--color-burgundy-dark)">{m.name}: {m.ratio.toFixed(3)}</p>
            <p className="text-[7px] text-(--color-text-muted)">{m.delta >= 0 ? "+" : ""}{m.delta.toFixed(3)}</p>
            <p className="text-[7px] font-extrabold" style={{ color: statusColor }}>{m.pass ? "Pass" : "Off target"}</p>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-center text-[11px] font-bold text-white">
        {overallScore.toFixed(1)}/10 · {ratingLabel}
      </div>
    </div>
  );
}

export function GoldenRatioResult({ payload, photoUrl }: { payload: GoldenRatioPayload; photoUrl: string | null }) {
  const measurements = payload.measurements ?? [];
  const passCount = measurements.filter((m) => m.pass).length;
  const weakest = lowestEntry(Object.fromEntries(measurements.map((m) => [m.id, m.scoreOutOf20 * 5])));
  const weakestName = measurements.find((m) => m.id === weakest?.key)?.name ?? weakest?.key ?? "";

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-(--color-border) bg-white">
        <CircularScoreHero photoUrl={photoUrl} score={payload.overallScore.toFixed(1)} scoreSuffix="/10" tierLabel={payload.ratingLabel} />
        <HighlightStats
          items={[
            { icon: Award, value: `${payload.overallScore.toFixed(1)}/10`, label: "Overall score" },
            { icon: Ratio, value: `φ ${payload.idealPhi.toFixed(2)}`, label: "Ideal ratio" },
            { icon: TrendingUp, value: `${Math.round(payload.goldenRatioIndex)}`, label: "Harmony index" },
            { icon: Target, value: `${passCount}/${measurements.length}`, label: "On target" },
          ]}
        />
      </div>
      <PhotoHero
        photoUrl={photoUrl}
        overlay={<MeasurementOverlay landmarks={payload.landmarks} measurements={measurements} overallScore={payload.overallScore} ratingLabel={payload.ratingLabel} />}
      />

      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <p className="text-sm text-(--color-text-muted)">Compared against the ideal golden ratio (φ ≈ {payload.idealPhi.toFixed(3)}).</p>
        <div className="mt-4 flex items-center gap-5">
          <ScoreRing score={payload.overallScore} />
          <span className="rounded-full bg-(--color-blush) px-3 py-1.5 text-sm font-bold text-(--color-burgundy)">Harmony index {Math.round(payload.goldenRatioIndex)}</span>
        </div>

        <div className="mt-6 space-y-3">
          {measurements.map((m) => (
            <div key={m.id} className="flex items-center gap-3 border-l-4 pl-3" style={{ borderColor: m.pass ? "#2E7D32" : "#E53935" }}>
              <div className="flex-1">
                <p className="text-sm font-bold text-(--color-text)">{m.name}</p>
                <p className="text-xs text-(--color-text-muted)">{m.ratio.toFixed(3)} ({m.delta >= 0 ? "+" : ""}{m.delta.toFixed(3)})</p>
              </div>
              <span className="text-sm font-extrabold text-(--color-burgundy-dark)">{m.scoreOutOf20}/20</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <RangeGauge label="Harmony index" value={payload.goldenRatioIndex} />
        </div>

        {weakest && (
          <div className="mt-6">
            <OpportunityCallout label={weakestName} value={weakest.value} />
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-(--color-text-muted)">Golden-ratio comparisons are a playful proportion reading, not a scientific measure of beauty.</p>
      </div>
    </div>
  );
}
