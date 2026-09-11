import type { FacialResemblancePayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { hexColor } from "../shared/overlayLayout";

// Mirrors lib/screens/scan/results/vg_resemblance_result.dart
function ComparisonOverlay({ faces }: { faces: FacialResemblancePayload["faces"] }) {
  return (
    <>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {faces.slice(0, 2).map((face) => (
          <polygon
            key={face.id}
            points={face.contourPoints.map(([x, y]) => `${x * 100},${y * 100}`).join(" ")}
            fill="none"
            stroke={hexColor(face.color)}
            strokeWidth={2.5}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {faces.slice(0, 2).map((face) => (
        <div
          key={face.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white"
          style={{ left: `${face.center.x * 100}%`, top: `${face.center.y * 100}%` }}
        >
          {face.label}
        </div>
      ))}
    </>
  );
}

export function FaceComparisonResult({ payload, photoUrl }: { payload: FacialResemblancePayload; photoUrl: string | null }) {
  return (
    <div className="space-y-6">
      <PhotoHero photoUrl={photoUrl} overlay={<ComparisonOverlay faces={payload.faces ?? []} />} />

      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <h3 className="text-lg font-extrabold text-(--color-burgundy-dark)">Contour comparison</h3>
        <p className="mt-2 text-sm leading-relaxed text-(--color-text)">{payload.contourComparison}</p>

        <div className="mt-5 rounded-[14px] bg-[#4CAF7A] px-4 py-3 text-center font-extrabold text-white">
          {payload.scoreLabel}: {payload.similarity}/100
        </div>

        <h3 className="mt-6 text-lg font-extrabold text-(--color-burgundy-dark)">Explanation</h3>
        <p className="mt-2 text-sm leading-relaxed text-(--color-text)">{payload.explanation}</p>

        {payload.sharedTraits?.length > 0 && (
          <div className="mt-6 space-y-2">
            {payload.sharedTraits.map((trait, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-(--color-text)">
                <span className="text-(--color-burgundy)">✓</span>{trait}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
