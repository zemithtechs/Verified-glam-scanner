import type { FeatureType } from "@/lib/tools";
import { FaceBeautyResult } from "./tools/FaceBeautyResult";
import { FacialSymmetryResult } from "./tools/FacialSymmetryResult";
import { CelebrityResult } from "./tools/CelebrityResult";
import { ShowdownResult } from "./tools/ShowdownResult";
import { AttractivenessResult } from "./tools/AttractivenessResult";
import { GoldenRatioResult } from "./tools/GoldenRatioResult";
import { FaceComparisonResult } from "./tools/FaceComparisonResult";
import { BeautyTipsResult } from "./tools/BeautyTipsResult";
import { GlowUpResult } from "./tools/GlowUpResult";
import { ColorAnalysisResult } from "./tools/ColorAnalysisResult";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Payload = any;

export function ResultView({ featureType, payload, photoUrl }: { featureType: FeatureType; payload: Payload; photoUrl: string | null }) {
  switch (featureType) {
    case "FACE_BEAUTY_ANALYSIS":
      return <FaceBeautyResult payload={payload} photoUrl={photoUrl} />;
    case "FACIAL_SYMMETRY":
      return <FacialSymmetryResult payload={payload} photoUrl={photoUrl} />;
    case "CELEBRITY_LOOKALIKE":
      return <CelebrityResult payload={payload} photoUrl={photoUrl} />;
    case "BEAUTY_SCORE_SHOWDOWN":
      return <ShowdownResult payload={payload} photoUrl={photoUrl} />;
    case "FACE_READING":
      return <AttractivenessResult payload={payload} photoUrl={photoUrl} />;
    case "GOLDEN_RATIO":
      return <GoldenRatioResult payload={payload} photoUrl={photoUrl} />;
    case "FACIAL_RESEMBLANCE":
      return <FaceComparisonResult payload={payload} photoUrl={photoUrl} />;
    case "BEAUTY_TIPS":
      return <BeautyTipsResult payload={payload} photoUrl={photoUrl} />;
    case "GLOW_UP_GUIDE":
      return <GlowUpResult payload={payload} photoUrl={photoUrl} />;
    case "COLOR_ANALYSIS":
      return <ColorAnalysisResult payload={payload} photoUrl={photoUrl} />;
    default:
      return <FallbackSummary payload={payload} />;
  }
}

function FallbackSummary({ payload }: { payload: Record<string, unknown> }) {
  const entries = Object.entries(payload)
    .filter(([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    .slice(0, 6)
    .map(([key, value]) => [key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()), String(value)] as [string, string]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([label, value]) => (
        <div key={label} className="rounded-[16px] bg-(--color-surface) p-4">
          <p className="text-xs font-bold text-(--color-text-muted)">{label}</p>
          <p className="mt-2 text-lg font-extrabold text-(--color-burgundy-dark)">{value}</p>
        </div>
      ))}
    </div>
  );
}
