import type { CelebrityLookalikePayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { MeshOverlay } from "../shared/MeshOverlay";
import { AvatarImage } from "../shared/AvatarImage";

// Mirrors lib/screens/scan/results/vg_celebrity_result.dart
export function CelebrityResult({ payload, photoUrl }: { payload: CelebrityLookalikePayload; photoUrl: string | null }) {
  const matches = payload.matches ?? [];

  return (
    <div className="space-y-6">
      <PhotoHero photoUrl={photoUrl} overlay={<MeshOverlay landmarks={payload.landmarks} meshConnections={payload.meshConnections} color="#7DFF9A" />} />

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-(--color-burgundy-dark)">Celebrity matches</h3>
          <span className="rounded-full bg-(--color-blush) px-3 py-1 text-xs font-bold text-(--color-burgundy)">{matches.length} found</span>
        </div>

        {matches.length === 0 ? (
          <p className="mt-4 rounded-[16px] bg-(--color-surface) p-4 text-sm text-(--color-text-muted)">No strong celebrity matches were found for this photo.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {matches.map((m, i) => (
              <div key={`${m.name}-${i}`} className="flex items-center gap-4 rounded-[16px] border border-(--color-border) bg-white p-4">
                <div className="relative shrink-0">
                  <AvatarImage src={m.imageUrl} name={m.name} size={64} />
                  {m.imageSource === "generated" && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-(--color-burgundy-dark) px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white">
                      AI impression
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-(--color-burgundy-dark)">{m.name}</p>
                  <p className="text-sm font-bold text-(--color-burgundy)">{Math.round(m.percent)}% similar</p>
                  <p className="mt-1 text-xs leading-relaxed text-(--color-text-muted)">
                    Matching features: {m.why || m.traits?.join(", ") || "similar facial proportions"}
                  </p>
                  {m.imageSource === "generated" && (
                    <p className="mt-1 text-[11px] italic text-(--color-text-muted)">Photo is an AI-generated impression, not an actual picture of {m.name}.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {payload.disclaimer && <p className="mt-4 text-xs leading-relaxed text-(--color-text-muted)">{payload.disclaimer}</p>}
        <p className="mt-2 text-[11px] leading-relaxed text-(--color-text-muted)">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </div>
  );
}
