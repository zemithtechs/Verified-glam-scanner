import type { Env } from "../env";
import { generatePortraitImage } from "./analyze-openai";
import { celebrityPortraitSlug } from "./celebrity";
import { pickShowdownNames, upliftOutOf10 } from "./analyze-normalize";
import { publicAssetUrl } from "./r2";
import { normalizeShowdown } from "./analyze-normalize";

// Port of get_showdown_leaderboard() (supabase/migrations/013), deliberately
// NOT a single SQL port — per docs/CLOUDFLARE_MIGRATION_PLAN.md, this is
// worker-side JS aggregation over a few simple parameterized D1 queries,
// which is easier to test and diff against the live Postgres RPC's output
// during migration rehearsal than a hand-translated multi-join SQL function.

export type ShowdownLeaderRow = {
  user_id: string;
  display_name: string;
  showdown_avatar_url: string | null;
  engagement_score: number;
  beauty_score_avg: number;
};

export async function fetchShowdownLeaderboard(db: D1Database, limit = 200): Promise<ShowdownLeaderRow[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const scanAgg = await db
    .prepare(
      `select user_id, count(*) as scan_count,
              sum(case when created_at > ? then 1 else 0 end) as recent_scans
       from scans group by user_id having count(*) > 0`,
    )
    .bind(sevenDaysAgo)
    .all<{ user_id: string; scan_count: number; recent_scans: number }>();

  const scanners = scanAgg.results ?? [];
  if (scanners.length === 0) return [];

  const userIds = scanners.map((s) => s.user_id);
  const placeholders = userIds.map(() => "?").join(",");

  const [doneDaysResult, showdownScansResult, profilesResult] = await Promise.all([
    db
      .prepare(`select user_id, count(*) as done_days from challenge_progress where status = 'done' and user_id in (${placeholders}) group by user_id`)
      .bind(...userIds)
      .all<{ user_id: string; done_days: number }>(),
    db
      .prepare(`select user_id, payload from scans where feature_type = 'BEAUTY_SCORE_SHOWDOWN' and user_id in (${placeholders})`)
      .bind(...userIds)
      .all<{ user_id: string; payload: string }>(),
    db
      .prepare(`select id, display_name, email, showdown_avatar_url from profiles where id in (${placeholders})`)
      .bind(...userIds)
      .all<{ id: string; display_name: string | null; email: string | null; showdown_avatar_url: string | null }>(),
  ]);

  const doneDaysByUser = new Map(doneDaysResult.results?.map((r) => [r.user_id, r.done_days]) ?? []);
  const profileByUser = new Map(profilesResult.results?.map((r) => [r.id, r]) ?? []);

  const scoresByUser = new Map<string, number[]>();
  for (const row of showdownScansResult.results ?? []) {
    try {
      const payload = JSON.parse(row.payload) as Record<string, unknown>;
      const score = Number(payload.yourScore);
      if (Number.isFinite(score)) {
        const list = scoresByUser.get(row.user_id) ?? [];
        list.push(score);
        scoresByUser.set(row.user_id, list);
      }
    } catch {
      // malformed payload — skip, matches Postgres nullif(...)::numeric silently excluding non-numeric values
    }
  }

  const rows: ShowdownLeaderRow[] = scanners.map((s) => {
    const profile = profileByUser.get(s.user_id);
    const displayName = profile?.display_name?.trim() || profile?.email?.split("@")[0]?.trim() || "Member";
    const doneDays = doneDaysByUser.get(s.user_id) ?? 0;
    const scores = scoresByUser.get(s.user_id) ?? [];
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 7.5;
    const engagementScore = s.scan_count * 2 + doneDays * 5 + s.recent_scans * 3;

    return {
      user_id: s.user_id,
      display_name: displayName,
      showdown_avatar_url: profile?.showdown_avatar_url ?? null,
      engagement_score: engagementScore,
      beauty_score_avg: avgScore,
    };
  });

  rows.sort((a, b) => b.engagement_score - a.engagement_score || b.beauty_score_avg - a.beauty_score_avg);
  return rows.slice(0, Math.max(limit, 1));
}

async function resolveShowdownAvatarUrl(seed: string, env: Env, promptName: string): Promise<string | null> {
  const slug = celebrityPortraitSlug(`showdown-${seed}`);
  if (!slug) return null;
  const key = `showdown-avatars/${slug}.png`;

  const existing = await env.ASSETS_BUCKET.head(key);
  if (existing) return publicAssetUrl(env, key);

  const prompt = `Friendly beauty app member portrait of ${promptName}, soft neutral background, photorealistic headshot, facing camera, warm smile, no text`;
  let imageBytes = await generatePortraitImage(env.OPENAI_API_KEY, prompt);
  if (!imageBytes) imageBytes = await generatePortraitImage(env.OPENAI_API_KEY, prompt);
  if (!imageBytes) return null;

  await env.ASSETS_BUCKET.put(key, imageBytes, { httpMetadata: { contentType: "image/png" } });
  return publicAssetUrl(env, key);
}

async function enrichPodiumAvatars(podium: Record<string, unknown>[], env: Env): Promise<Record<string, unknown>[]> {
  return await Promise.all(
    podium.map(async (entry) => {
      if (entry.avatarUrl || entry.isCurrentUser) return entry;
      const name = String(entry.displayName ?? entry.name ?? "Member");
      const avatarUrl = await resolveShowdownAvatarUrl(name, env, name);
      return avatarUrl ? { ...entry, avatarUrl, imageSource: "generated" } : entry;
    }),
  );
}

async function buildSimulatedShowdownPodium(parsed: Record<string, unknown>, env: Env): Promise<Record<string, unknown>> {
  const yourScore = Number(parsed.yourScore) || 8;
  const names = pickShowdownNames(3);
  const totalParticipants = Math.max(Number(parsed.totalParticipants) || 100, 50);

  const podium: Record<string, unknown>[] = [
    { rank: 1, displayName: names[0], name: names[0], score: upliftOutOf10(yourScore + 0.35), isSimulated: true },
    { rank: 2, displayName: names[1], name: names[1], score: upliftOutOf10(yourScore + 0.12), isSimulated: true },
    { rank: 3, displayName: names[2], name: names[2], score: upliftOutOf10(yourScore - 0.08), isSimulated: true },
  ];

  parsed.podium = await enrichPodiumAvatars(podium, env);
  parsed.rankPosition = Math.max(2, Number(parsed.rankPosition) || 2);
  parsed.totalParticipants = totalParticipants;
  const topPercent = Math.max(5, Math.ceil((Number(parsed.rankPosition) / totalParticipants) * 100));
  parsed.rankLabel = `Top ${topPercent}%`;
  parsed.engagementNote = "You're climbing the board — keep scanning and finishing challenge days to pass more members.";
  return parsed;
}

async function buildRealShowdownPodium(
  parsed: Record<string, unknown>,
  leaderboard: ShowdownLeaderRow[],
  userId: string,
  env: Env,
): Promise<Record<string, unknown>> {
  const yourScore = Number(parsed.yourScore) || 8;
  const sorted = [...leaderboard].sort((a, b) => b.engagement_score - a.engagement_score || b.beauty_score_avg - a.beauty_score_avg);

  let rankPosition = sorted.findIndex((row) => row.user_id === userId) + 1;
  if (rankPosition <= 0) {
    rankPosition = Math.min(sorted.length + 1, Math.max(2, Number(parsed.rankPosition) || 2));
  }

  const topThree = sorted.slice(0, 3);
  const podium: Record<string, unknown>[] = await Promise.all(
    topThree.map(async (row, i) => {
      let avatarUrl = row.showdown_avatar_url;
      if (!avatarUrl && row.user_id !== userId) {
        avatarUrl = await resolveShowdownAvatarUrl(row.user_id, env, row.display_name);
        if (avatarUrl) {
          await env.DB.prepare("update profiles set showdown_avatar_url = ? where id = ?").bind(avatarUrl, row.user_id).run();
        }
      }
      return {
        rank: i + 1,
        displayName: row.display_name,
        name: row.display_name,
        score: upliftOutOf10(Number(row.beauty_score_avg) || yourScore + 0.2 - i * 0.1),
        avatarUrl,
        isSimulated: false,
        isCurrentUser: row.user_id === userId,
      };
    }),
  );

  parsed.podium = podium;
  parsed.rankPosition = rankPosition;
  parsed.totalParticipants = Math.max(sorted.length, 5);
  const topPercent = Math.max(5, Math.ceil((rankPosition / Number(parsed.totalParticipants)) * 100));
  parsed.rankLabel = `Top ${topPercent}%`;
  parsed.engagementNote = "Rankings reflect scans plus challenge activity across the Verified Glam community.";
  return parsed;
}

export async function enrichShowdown(parsed: Record<string, unknown>, env: Env, userId: string): Promise<Record<string, unknown>> {
  const normalized = normalizeShowdown(parsed);
  const leaderboard = await fetchShowdownLeaderboard(env.DB);

  if (leaderboard.length >= 5) {
    return await buildRealShowdownPodium(normalized, leaderboard, userId, env);
  }
  return await buildSimulatedShowdownPodium(normalized, env);
}
