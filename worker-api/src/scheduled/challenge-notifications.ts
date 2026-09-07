import type { Env } from "../env";
import { loadServiceAccount, sendChallengePushToUser } from "../lib/fcm";

// Port of supabase/functions/dispatch-challenge-notifications, merged with
// send-challenge-push's per-user fan-out. The two were separate Deno Edge
// Functions talking over HTTP; here the Cron Trigger (wrangler.toml) calls
// this directly in-process, so the internal fetch() hop is gone (see
// docs/CLOUDFLARE_MIGRATION_PLAN.md rewrite order).

const BATCH_SIZE = 50;
const DAILY_CAP = 2;

const KIND_PRIORITY: Record<string, number> = {
  completion: 4,
  unlock: 3,
  streak: 2,
  evening: 2,
  reminder: 1,
};

type NotificationJob = {
  id: string;
  user_id: string;
  challenge_id: string;
  day_number: number;
  kind: string;
  payload: string | null;
};

function kindPriority(kind: string): number {
  return KIND_PRIORITY[kind] ?? 0;
}

async function markJob(db: D1Database, jobId: string, status: "sent" | "failed" | "cancelled"): Promise<void> {
  const now = new Date().toISOString();
  if (status === "sent") {
    await db
      .prepare("update challenge_notification_jobs set status = ?, sent_at = ?, updated_at = ? where id = ?")
      .bind(status, now, now, jobId)
      .run();
  } else {
    await db
      .prepare("update challenge_notification_jobs set status = ?, updated_at = ? where id = ?")
      .bind(status, now, jobId)
      .run();
  }
}

async function deferJob(db: D1Database, jobId: string): Promise<void> {
  const deferUntil = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
  await db
    .prepare("update challenge_notification_jobs set scheduled_for = ?, updated_at = ? where id = ?")
    .bind(deferUntil, new Date().toISOString(), jobId)
    .run();
}

async function recordNotifiedAt(db: D1Database, challengeId: string, dayNumber: number, kind: string): Promise<void> {
  const now = new Date().toISOString();
  if (kind === "unlock") {
    await db
      .prepare("update challenge_progress set unlock_notified_at = ? where challenge_id = ? and day_number = ?")
      .bind(now, challengeId, dayNumber)
      .run();
  } else if (kind === "reminder" || kind === "streak" || kind === "evening") {
    await db
      .prepare("update challenge_progress set reminder_sent_at = ? where challenge_id = ? and day_number = ?")
      .bind(now, challengeId, dayNumber)
      .run();
  } else if (kind === "completion") {
    await db.prepare("update challenge_plans set completion_notified_at = ? where id = ?").bind(now, challengeId).run();
  }
}

export async function dispatchChallengeNotifications(env: Env): Promise<void> {
  const db = env.DB;
  const serviceAccount = loadServiceAccount(env);
  if (!serviceAccount) {
    console.error(
      "FCM_SERVICE_ACCOUNT_JSON not configured — set the Firebase Admin SDK JSON as a Worker secret.",
    );
    return;
  }

  let totalProcessed = 0;
  let totalSent = 0;
  let totalCancelled = 0;
  let totalFailed = 0;
  let totalDeferred = 0;

  const nowIso = new Date().toISOString();
  const jobsResult = await db
    .prepare(
      `select id, user_id, challenge_id, day_number, kind, payload
       from challenge_notification_jobs
       where status = 'pending' and scheduled_for <= ?
       order by scheduled_for asc
       limit ?`,
    )
    .bind(nowIso, BATCH_SIZE)
    .all<NotificationJob>();

  const jobs = jobsResult.results ?? [];
  if (jobs.length === 0) return;

  const sorted = [...jobs].sort((a, b) => kindPriority(b.kind) - kindPriority(a.kind));

  for (const job of sorted) {
    totalProcessed++;
    const { kind, challenge_id: challengeId, day_number: dayNumber, user_id: userId } = job;

    const progressRow = await db
      .prepare("select status from challenge_progress where challenge_id = ? and day_number = ?")
      .bind(challengeId, dayNumber)
      .first<{ status: string }>();

    if (progressRow?.status === "done" && kind !== "completion") {
      await markJob(db, job.id, "cancelled");
      totalCancelled++;
      continue;
    }

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const sentTodayRow = await db
      .prepare(
        `select count(*) as n from challenge_notification_jobs
         where user_id = ? and challenge_id = ? and status = 'sent' and sent_at >= ?`,
      )
      .bind(userId, challengeId, todayStart.toISOString())
      .first<{ n: number }>();

    if ((sentTodayRow?.n ?? 0) >= DAILY_CAP && kind !== "completion") {
      await deferJob(db, job.id);
      totalDeferred++;
      continue;
    }

    const payload = job.payload ? (JSON.parse(job.payload) as Record<string, unknown>) : {};
    const title = String(payload.title ?? `Day ${dayNumber} is ready!`);
    const body = String(payload.body ?? "Open app to continue your challenge.");
    const deepLink = String(payload.deepLink ?? `/challenge/day${dayNumber}`);

    const result = await sendChallengePushToUser(db, serviceAccount, {
      userId,
      title,
      body,
      data: { deepLink, day: String(dayNumber), kind, challengeId },
    });

    if (result.sent < 1) {
      console.error("challenge push sent=0", { jobId: job.id, userId, result });
      await markJob(db, job.id, "failed");
      totalFailed++;
      continue;
    }

    await markJob(db, job.id, "sent");
    await recordNotifiedAt(db, challengeId, dayNumber, kind);
    totalSent++;
  }

  console.log("dispatchChallengeNotifications", {
    processed: totalProcessed,
    sent: totalSent,
    cancelled: totalCancelled,
    failed: totalFailed,
    deferred: totalDeferred,
  });
}
