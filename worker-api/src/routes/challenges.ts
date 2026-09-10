import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";

// Port of vg_challenge_repository.dart. Unlike scans/profiles,
// this one had real business logic living CLIENT-SIDE in Dart (badge
// awarding, streak math, day-unlock checks), guarded only by Supabase RLS —
// D1 has no RLS equivalent, so all of it moves server-side here, staying
// behind the same session guard the RLS policies used to enforce.
export const challenges = new Hono<{ Bindings: Env; Variables: SessionVars }>();

type DayRow = { day_number: number; title: string; main_task: string; support_task: string; why_line: string; est_minutes: number };
type ProgressRow = {
  id: string;
  day_number: number;
  status: string;
  unlocked_at: string | null;
  completed_at: string | null;
};
type PlanRow = Record<string, unknown> & {
  id: string;
  user_id: string;
  source_scan_id: string | null;
  issue_tag: string;
  severity: string;
  duration_days: number;
  title: string;
  intro_message: string;
  disclaimer: string;
  is_completed: number;
  streak_count: number;
  current_streak: number | null;
  best_streak: number | null;
  last_completed_at: string | null;
  next_unlock_at: string | null;
  notification_pref_time: string | null;
  created_at: string;
  updated_at: string;
};

async function unlockReadyDays(db: D1Database, challengeId: string, progressRows: ProgressRow[]): Promise<void> {
  const now = new Date();
  for (const row of progressRows) {
    if (row.status !== "locked" || !row.unlocked_at) continue;
    const unlockedAt = new Date(row.unlocked_at);
    if (unlockedAt <= now) {
      await db
        .prepare("update challenge_progress set status = 'unlocked', updated_at = ? where id = ?")
        .bind(now.toISOString(), row.id)
        .run();
      row.status = "unlocked";
    }
  }
}

function toPlanJson(planRow: PlanRow, dayRows: DayRow[], progressRows: ProgressRow[]) {
  const days = dayRows.map((d) => ({
    dayNumber: d.day_number,
    title: d.title,
    mainTask: d.main_task,
    supportTask: d.support_task,
    whyLine: d.why_line,
    estMinutes: d.est_minutes,
  }));

  let completedDays = 0;
  let nextUnlockAt: string | null = planRow.next_unlock_at ?? null;
  for (const p of progressRows) {
    if (p.status === "done") completedDays++;
    if (!nextUnlockAt && p.status === "locked" && p.unlocked_at) nextUnlockAt = p.unlocked_at;
  }
  const duration = planRow.duration_days ?? days.length;
  const currentDay = Math.min(Math.max(completedDays + 1, 1), duration);
  const bestStreak = planRow.best_streak ?? planRow.streak_count ?? 0;

  return {
    challengeId: planRow.id,
    userId: planRow.user_id,
    sourceScanId: planRow.source_scan_id,
    issueTag: planRow.issue_tag ?? "glow",
    severity: planRow.severity ?? "low",
    durationDays: duration,
    title: planRow.title ?? "Beauty Routine Challenge",
    introMessage: planRow.intro_message ?? "",
    disclaimer: planRow.disclaimer ?? "",
    days,
    progress: {
      completedDays,
      currentDay,
      isCompleted: planRow.is_completed === 1 || completedDays >= duration,
      lastCompletedAt: planRow.last_completed_at,
      nextUnlockAt,
      streakCount: planRow.streak_count ?? completedDays,
      bestStreak,
      notificationPrefTime: planRow.notification_pref_time,
    },
    createdAt: planRow.created_at,
    updatedAt: planRow.updated_at,
  };
}

challenges.get("/active", async (c) => {
  const userId = c.get("userId");
  const db = c.env.DB;

  const planRow = await db
    .prepare("select * from challenge_plans where user_id = ? and is_completed = 0 order by created_at desc limit 1")
    .bind(userId)
    .first<PlanRow>();
  if (!planRow) return c.json({ plan: null });

  const dayRows = await db.prepare("select * from challenge_days where challenge_id = ? order by day_number").bind(planRow.id).all<DayRow>();
  const progressRows = await db
    .prepare("select * from challenge_progress where challenge_id = ? order by day_number")
    .bind(planRow.id)
    .all<ProgressRow>();

  await unlockReadyDays(db, planRow.id, progressRows.results ?? []);
  const refreshed = await db
    .prepare("select * from challenge_progress where challenge_id = ? order by day_number")
    .bind(planRow.id)
    .all<ProgressRow>();

  return c.json({ plan: toPlanJson(planRow, dayRows.results ?? [], refreshed.results ?? []) });
});

challenges.post("/", async (c) => {
  const db = c.env.DB;
  const userId = c.get("userId");
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}) as Record<string, unknown>);
  const challengeId = String(body.challengeId ?? crypto.randomUUID());
  const days = Array.isArray(body.days) ? (body.days as Record<string, unknown>[]) : [];
  const now = new Date().toISOString();

  await db
    .prepare(
      `insert into challenge_plans (id, user_id, source_scan_id, issue_tag, severity, duration_days, title, intro_message, disclaimer,
         completed_days, last_completed_at, next_unlock_at, is_completed, streak_count, notification_pref_time, created_at, updated_at)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, null, null, 0, 0, ?, ?, ?)`,
    )
    .bind(
      challengeId,
      userId,
      body.sourceScanId ?? null,
      body.issueTag ?? "glow",
      body.severity ?? "low",
      body.durationDays ?? days.length,
      body.title ?? "Beauty Routine Challenge",
      body.introMessage ?? "",
      body.disclaimer ?? "",
      body.notificationPrefTime ?? "18:00",
      now,
      now,
    )
    .run();

  const dayWrites = days.map((d) =>
    db
      .prepare(
        `insert into challenge_days (id, challenge_id, user_id, day_number, title, main_task, support_task, why_line, est_minutes)
         values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(crypto.randomUUID(), challengeId, userId, d.dayNumber, d.title ?? "", d.mainTask ?? "", d.supportTask ?? "", d.whyLine ?? "", d.estMinutes ?? 10),
  );
  const progressWrites = days.map((d) => {
    const isFirst = d.dayNumber === 1;
    return db
      .prepare(`insert into challenge_progress (id, challenge_id, user_id, day_number, status, unlocked_at) values (?, ?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), challengeId, userId, d.dayNumber, isFirst ? "unlocked" : "locked", isFirst ? now : null);
  });

  if (dayWrites.length > 0) await db.batch([...dayWrites, ...progressWrites]);

  return c.json({ challengeId });
});

async function insertBadgeIfNew(db: D1Database, userId: string, badgeCode: string, badgeTitle: string, challengeId: string, earnedAt: string): Promise<void> {
  const existing = await db.prepare("select id from challenge_badges where user_id = ? and badge_code = ?").bind(userId, badgeCode).first();
  if (existing) return;
  await db
    .prepare("insert into challenge_badges (id, user_id, badge_code, badge_title, challenge_id, earned_at) values (?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), userId, badgeCode, badgeTitle, challengeId, earnedAt)
    .run();
}

function normalizeIssueCode(raw: string): string {
  const v = raw.toLowerCase();
  if (v.includes("acne") || v.includes("pimple") || v.includes("breakout")) return "acne";
  if (v.includes("pigment") || v.includes("dark") || v.includes("spot") || v.includes("glow")) return "pigmentation";
  if (v.includes("texture") || v.includes("scar")) return "texture";
  if (v.includes("aging") || v.includes("sag") || v.includes("firm")) return "aging";
  if (v.includes("sensitive") || v.includes("redness") || v.includes("calm")) return "sensitivity";
  if (v.includes("oily") || v.includes("pore") || v.includes("sebum")) return "oily";
  if (v.includes("dry") || v.includes("dehydrat") || v.includes("flaky") || v.includes("hydration")) return "dryness";
  if (v.includes("uneven") || v.includes("tone") || v.includes("rosacea")) return "uneven_tone";
  return "acne";
}

async function awardCompletionArtifacts(
  db: D1Database,
  plan: PlanRow,
  completedAt: string,
): Promise<void> {
  const issueCode = normalizeIssueCode(plan.issue_tag ?? "");
  const completedCountRow = await db
    .prepare("select count(*) as n from challenge_plans where user_id = ? and is_completed = 1")
    .bind(plan.user_id)
    .first<{ n: number }>();
  const completedCount = completedCountRow?.n ?? 0;

  const recentCompleted = await db
    .prepare(
      "select is_completed, completed_days, duration_days from challenge_plans where user_id = ? and is_completed = 1 order by last_completed_at desc limit 10",
    )
    .bind(plan.user_id)
    .all<{ is_completed: number; completed_days: number; duration_days: number }>();
  let consecutiveCount = 0;
  for (const row of recentCompleted.results ?? []) {
    if (row.is_completed !== 1 || row.completed_days < row.duration_days) break;
    consecutiveCount++;
  }

  const titleLower = (plan.title ?? "").toLowerCase();

  await insertBadgeIfNew(db, plan.user_id, "skin_starter", "Skin Starter", plan.id, completedAt);

  if (plan.duration_days >= 7) {
    await insertBadgeIfNew(db, plan.user_id, "seven_day_champion", "7-Day Champion", plan.id, completedAt);
  } else if (plan.duration_days >= 5) {
    await insertBadgeIfNew(db, plan.user_id, "five_day_finisher", "5-Day Finisher", plan.id, completedAt);
  } else {
    await insertBadgeIfNew(db, plan.user_id, "three_day_warrior", "3-Day Warrior", plan.id, completedAt);
  }

  if (issueCode === "dryness" || titleLower.includes("hydration")) {
    await insertBadgeIfNew(db, plan.user_id, "hydration_hero", "Hydration Hero", plan.id, completedAt);
  }
  if (issueCode === "pigmentation" || titleLower.includes("glow") || titleLower.includes("bright")) {
    await insertBadgeIfNew(db, plan.user_id, "glow_getter", "Glow Getter", plan.id, completedAt);
  }
  if (issueCode === "sensitivity" || titleLower.includes("calm")) {
    await insertBadgeIfNew(db, plan.user_id, "zen_skin", "Zen Skin", plan.id, completedAt);
  }
  if (consecutiveCount >= 3) {
    await insertBadgeIfNew(db, plan.user_id, "streak_master", "Streak Master", plan.id, completedAt);
  }
  if (completedCount >= 5) {
    await insertBadgeIfNew(db, plan.user_id, "skin_royalty", "Skin Royalty", plan.id, completedAt);
  }

  await db
    .prepare(
      "insert into challenge_reward_cards (id, user_id, challenge_id, challenge_title, issue_tag, completed_on, message) values (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      crypto.randomUUID(),
      plan.user_id,
      plan.id,
      plan.title,
      plan.issue_tag,
      completedAt,
      "You showed up for your skin every day. That is what glow is made of.",
    )
    .run();
}

challenges.post("/:id/days/:dayNumber/complete", async (c) => {
  const db = c.env.DB;
  const userId = c.get("userId");
  const challengeId = c.req.param("id");
  const dayNumber = Number(c.req.param("dayNumber"));
  const completedAt = new Date().toISOString();

  const plan = await db.prepare("select * from challenge_plans where id = ? and user_id = ?").bind(challengeId, userId).first<PlanRow>();
  if (!plan) return c.json({ error: "not_found" }, 404);

  await db
    .prepare("update challenge_progress set status = 'done', completed_at = ?, updated_at = ? where challenge_id = ? and day_number = ? and status = 'unlocked'")
    .bind(completedAt, completedAt, challengeId, dayNumber)
    .run();

  const nextDay = dayNumber + 1;
  const nextUnlockAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  if (nextDay <= plan.duration_days) {
    await db
      .prepare(
        "update challenge_progress set status = 'locked', unlocked_at = ?, unlock_notified_at = null, reminder_sent_at = null, updated_at = ? where challenge_id = ? and day_number = ?",
      )
      .bind(nextUnlockAt, completedAt, challengeId, nextDay)
      .run();
  }

  const completedDays = dayNumber;
  const today = completedAt.slice(0, 10);
  const lastDoneDate = plan.last_completed_at ? plan.last_completed_at.slice(0, 10) : null;
  let streak = plan.streak_count ?? 0;
  if (!lastDoneDate) {
    streak = 1;
  } else {
    const gapDays = Math.round((new Date(today).getTime() - new Date(lastDoneDate).getTime()) / 86400000);
    streak = gapDays <= 1 ? streak + 1 : 1;
  }
  const bestStreak = Math.max(streak, plan.best_streak ?? 0);
  const isCompleted = completedDays >= plan.duration_days;

  await db
    .prepare(
      `update challenge_plans set completed_days = ?, last_completed_at = ?, last_done_date = ?, next_unlock_at = ?, is_completed = ?,
         streak_count = ?, current_streak = ?, best_streak = ?, updated_at = ? where id = ?`,
    )
    .bind(
      completedDays,
      completedAt,
      today,
      isCompleted ? null : nextUnlockAt,
      isCompleted ? 1 : 0,
      streak,
      streak,
      bestStreak,
      completedAt,
      challengeId,
    )
    .run();

  if (isCompleted) {
    await awardCompletionArtifacts(db, { ...plan, is_completed: 1 }, completedAt);
  }

  return c.json({ ok: true, isCompleted, streak, bestStreak });
});

challenges.post("/archive", async (c) => {
  const userId = c.get("userId");
  await c.env.DB.prepare("update challenge_plans set is_completed = 1, updated_at = ? where user_id = ? and is_completed = 0")
    .bind(new Date().toISOString(), userId)
    .run();
  return c.json({ ok: true });
});

challenges.get("/badges", async (c) => {
  const rows = await c.env.DB.prepare("select badge_code, badge_title, earned_at from challenge_badges where user_id = ? order by earned_at desc")
    .bind(c.get("userId"))
    .all();
  return c.json({ badges: rows.results ?? [] });
});

challenges.get("/reward-card/latest", async (c) => {
  const row = await c.env.DB.prepare("select * from challenge_reward_cards where user_id = ? order by completed_on desc limit 1")
    .bind(c.get("userId"))
    .first();
  return c.json({ rewardCard: row ?? null });
});

challenges.put("/:id/notification-pref-time", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ prefTime?: string }>().catch(() => ({}) as { prefTime?: string });
  await c.env.DB.prepare("update challenge_plans set notification_pref_time = ?, updated_at = ? where id = ? and user_id = ?")
    .bind(body.prefTime ?? null, new Date().toISOString(), c.req.param("id"), userId)
    .run();
  return c.json({ ok: true });
});

challenges.post("/notification-jobs", async (c) => {
  const userId = c.get("userId");
  const body = await c.req
    .json<{ challengeId?: string; dayNumber?: number; kind?: string; scheduledFor?: string; payload?: unknown }>()
    .catch(() => ({}) as Record<string, unknown>);
  const dedupeKey = `${body.challengeId}:${body.dayNumber}:${body.kind}:${body.scheduledFor}`;
  try {
    await c.env.DB.prepare(
      `insert into challenge_notification_jobs (id, user_id, challenge_id, day_number, kind, scheduled_for, payload, status, dedupe_key, updated_at)
       values (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    )
      .bind(crypto.randomUUID(), userId, body.challengeId, body.dayNumber, body.kind, body.scheduledFor, JSON.stringify(body.payload ?? {}), dedupeKey, new Date().toISOString())
      .run();
  } catch {
    // Duplicate dedupe_key — same as the Dart repository's silent ignore.
  }
  return c.json({ ok: true });
});

challenges.post("/notification-jobs/cancel", async (c) => {
  const userId = c.get("userId");
  const body = await c.req
    .json<{ challengeId?: string; dayNumber?: number; kinds?: string[] }>()
    .catch(() => ({}) as { challengeId?: string; dayNumber?: number; kinds?: string[] });
  const db = c.env.DB;
  const now = new Date().toISOString();

  if (body.kinds && body.kinds.length > 0) {
    const placeholders = body.kinds.map(() => "?").join(",");
    await db
      .prepare(
        `update challenge_notification_jobs set status = 'cancelled', updated_at = ?
         where user_id = ? and challenge_id = ? and day_number = ? and status = 'pending' and kind in (${placeholders})`,
      )
      .bind(now, userId, body.challengeId, body.dayNumber, ...body.kinds)
      .run();
  } else {
    await db
      .prepare(
        "update challenge_notification_jobs set status = 'cancelled', updated_at = ? where user_id = ? and challenge_id = ? and day_number = ? and status = 'pending'",
      )
      .bind(now, userId, body.challengeId, body.dayNumber)
      .run();
  }
  return c.json({ ok: true });
});
