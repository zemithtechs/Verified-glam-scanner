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
                <AvatarImage src={m.imageUrl} name={m.name} size={64} />
                <div className="flex-1">
                  <p className="font-extrabold text-(--color-burgundy-dark)">{m.name}</p>
                  <p className="text-sm font-bold text-(--color-burgundy)">{Math.round(m.percent)}% similar</p>
                  <p className="mt-1 text-xs leading-relaxed text-(--color-text-muted)">
                    Matching features: {m.why || m.traits?.join(", ") || "similar facial proportions"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {payload.disclaimer && <p className="mt-4 text-xs leading-relaxed text-(--color-text-muted)">{payload.disclaimer}</p>}
      </div>
    </div>
  );
}
