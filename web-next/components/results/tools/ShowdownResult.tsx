import type { BeautyScoreShowdownPayload } from "@/lib/analysisTypes";
import { PhotoHero } from "../shared/PhotoHero";
import { MeshOverlay } from "../shared/MeshOverlay";
import { AvatarImage } from "../shared/AvatarImage";
import { ScoreRing } from "../shared/ScoreRing";

// Mirrors lib/screens/scan/results/vg_showdown_result.dart
const CROWN_COLOR: Record<number, string> = { 1: "#D4AF37", 2: "#B8BEC7", 3: "#B08D57" };

function PodiumSlot({ entry, photoUrl }: { entry: BeautyScoreShowdownPayload["podium"][number]; photoUrl: string | null }) {
  const height = entry.rank === 1 ? "h-28" : entry.rank === 2 ? "h-20" : "h-16";
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span className="text-lg" style={{ color: CROWN_COLOR[entry.rank] ?? "#fff" }}>♛</span>
      <AvatarImage src={entry.isCurrentUser ? photoUrl : entry.avatarUrl} name={entry.displayName || entry.name} size={entry.rank === 1 ? 56 : 44} />
      <p className="max-w-[80px] truncate text-xs font-bold text-white">{entry.displayName || entry.name}</p>
      <p className="text-xs font-extrabold text-white/90">{entry.score.toFixed(1)}</p>
      <div className={`flex w-full items-end justify-center rounded-t-lg bg-white/15 ${height}`}>
        <span className="mb-1 text-sm font-extrabold text-white">#{entry.rank}</span>
      </div>
    </div>
  );
}

export function ShowdownResult({ payload, photoUrl }: { payload: BeautyScoreShowdownPayload; photoUrl: string | null }) {
  const podium = [...(payload.podium ?? [])].sort((a, b) => a.rank - b.rank).slice(0, 3);
  const ordered = [podium.find((p) => p.rank === 2), podium.find((p) => p.rank === 1), podium.find((p) => p.rank === 3)].filter(Boolean) as typeof podium;

  return (
    <div className="space-y-6">
      <PhotoHero
        photoUrl={photoUrl}
        overlay={
          <>
            <MeshOverlay landmarks={payload.landmarks} meshConnections={payload.meshConnections} color="#ffffff" />
            <div className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5 shadow-md">
              <ScoreRing score={payload.yourScore} size={72} />
            </div>
          </>
        }
      />

      {ordered.length > 0 && (
        <div className="flex items-end gap-3 rounded-[20px] bg-gradient-to-br from-(--color-burgundy) to-(--color-burgundy-dark) p-6">
          {ordered.map((entry) => <PodiumSlot key={entry.rank} entry={entry} photoUrl={photoUrl} />)}
        </div>
      )}

      <div className="flex items-center gap-4 rounded-[20px] border border-(--color-border) bg-white p-5">
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="You" className="h-18 w-18 shrink-0 rounded-full object-cover" style={{ width: 72, height: 72 }} />
        )}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-text-muted)">Your rank</p>
          <p className="mt-1 text-3xl font-extrabold text-(--color-burgundy-dark)">#{payload.rankPosition} <span className="text-sm font-bold text-(--color-text-muted)">of {payload.totalParticipants}</span></p>
          <span className="mt-1 inline-block rounded-full bg-(--color-blush) px-3 py-1 text-xs font-bold text-(--color-burgundy)">{payload.rankLabel}</span>
        </div>
      </div>

      <div className="rounded-[16px] bg-(--color-surface) p-4 text-sm text-(--color-text)">
        <p>{payload.engagementNote}</p>
        <p className="mt-2 font-bold text-(--color-burgundy-dark)">Your score: {payload.yourScore.toFixed(1)}/10 vs community average {payload.averageScore.toFixed(1)}/10</p>
      </div>
    </div>
  );
}
