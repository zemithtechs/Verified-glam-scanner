import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";
import { VALID_FEATURES, featureLabelForCredits } from "../lib/analyze-types";
import { loadServiceAccount, sendChallengePushToUser } from "../lib/fcm";

export const admin = new Hono<{ Bindings: Env; Variables: SessionVars }>();

admin.get("/me", async (c) => {
  return c.json({ isAdmin: true, email: c.get("userEmail") });
});

admin.get("/stats", async (c) => {
  const db = c.env.DB;

  const [users, pro, scans, credits] = await Promise.all([
    db.prepare("select count(*) as n from profiles").first<{ n: number }>(),
    db.prepare("select count(*) as n from profiles where is_pro = 1").first<{ n: number }>(),
    db.prepare("select count(*) as n from scans").first<{ n: number }>(),
    db.prepare("select coalesce(sum(-amount), 0) as n from credit_transactions where amount < 0").first<{ n: number }>(),
  ]);

  return c.json({
    totalUsers: users?.n ?? 0,
    proSubscribers: pro?.n ?? 0,
    totalScans: scans?.n ?? 0,
    creditsUsed: credits?.n ?? 0,
  });
});

admin.get("/users", async (c) => {
  const db = c.env.DB;
  const url = new URL(c.req.url);
  const search = url.searchParams.get("search")?.trim();
  const proOnly = url.searchParams.get("proOnly") === "true";
  const limit = Math.min(Number(url.searchParams.get("limit")) || 25, 100);
  const cursor = Number(url.searchParams.get("cursor")) || 0;

  const clauses: string[] = [];
  const bindings: unknown[] = [];
  if (search) {
    clauses.push("email like ?");
    bindings.push(`%${search}%`);
  }
  if (proOnly) clauses.push("is_pro = 1");
  const where = clauses.length ? `where ${clauses.join(" and ")}` : "";

  const rows = await db
    .prepare(
      `select id, email, display_name, is_pro, subscription_plan, subscription_status,
              credits_balance, credits_allocated,
              max(0, credits_allocated - credits_balance) as credits_used,
              created_at
       from profiles ${where} order by created_at desc limit ? offset ?`,
    )
    .bind(...bindings, limit, cursor)
    .all();

  const total = await db
    .prepare(`select count(*) as n from profiles ${where}`)
    .bind(...bindings)
    .first<{ n: number }>();

  return c.json({ users: rows.results ?? [], total: total?.n ?? 0, limit, cursor });
});

admin.get("/subscriptions-summary", async (c) => {
  const db = c.env.DB;
  const rows = await db
    .prepare("select subscription_plan as plan, count(*) as n from profiles where is_pro = 1 group by subscription_plan")
    .all<{ plan: string | null; n: number }>();
  return c.json({ byPlan: rows.results ?? [] });
});

admin.get("/activity", async (c) => {
  const db = c.env.DB;
  const limit = Math.min(Number(new URL(c.req.url).searchParams.get("limit")) || 20, 100);

  const rows = await db
    .prepare(
      `select scans.id, scans.feature_type, scans.feature_title, scans.created_at, profiles.email
       from scans join profiles on profiles.id = scans.user_id
       order by scans.created_at desc limit ?`,
    )
    .bind(limit)
    .all();

  return c.json({ activity: rows.results ?? [] });
});

admin.get("/usage", async (c) => {
  const db = c.env.DB;
  const [logs, credits, tools] = await Promise.all([
    db.prepare("select count(*) as n from credit_transactions where kind = 'analysis'").first<{ n: number }>(),
    db.prepare("select coalesce(sum(-amount), 0) as n from credit_transactions where amount < 0").first<{ n: number }>(),
    db.prepare("select count(distinct feature_type) as n from credit_transactions where kind = 'analysis'").first<{ n: number }>(),
  ]);
  const breakdown = await db.prepare(
    `select coalesce(feature_type, 'UNKNOWN') as feature_type, count(*) as uses, coalesce(sum(-amount), 0) as credits
     from credit_transactions where kind = 'analysis'
     group by feature_type order by uses desc`,
  ).all();
  return c.json({ totalLogs: logs?.n ?? 0, creditsConsumed: credits?.n ?? 0, uniqueTools: tools?.n ?? 0, breakdown: breakdown.results ?? [] });
});

admin.get("/logs", async (c) => {
  const limit = Math.min(Number(new URL(c.req.url).searchParams.get("limit")) || 100, 500);
  const rows = await c.env.DB.prepare(
    `select t.id, t.created_at, t.description as tool, t.feature_type, t.kind, t.amount,
            abs(t.amount) as credits, t.balance_after, t.user_id, p.email
     from credit_transactions t left join profiles p on p.id = t.user_id
     order by t.created_at desc limit ?`,
  ).bind(limit).all();
  return c.json({ logs: rows.results ?? [] });
});

admin.get("/revenue", async (c) => {
  const rows = await c.env.DB.prepare(
    `select subscription_plan as plan, count(*) as subscribers
     from profiles where is_pro = 1 group by subscription_plan`,
  ).all<{ plan: string; subscribers: number }>();
  const byPlan = (rows.results ?? []).map((row) => ({
    ...row,
    estimatedMonthlyRevenue: row.subscribers * (row.plan === "annual" ? 39.99 / 12 : row.plan === "pro_weekly" ? 3.99 * 52 / 12 : 0),
  }));
  return c.json({
    paidUsers: byPlan.reduce((sum, row) => sum + row.subscribers, 0),
    estimatedMonthlyRevenue: byPlan.reduce((sum, row) => sum + row.estimatedMonthlyRevenue, 0),
    byPlan,
  });
});

admin.get("/tools", async (c) => {
  const rows = await c.env.DB.prepare("select key, value from app_content where key like 'admin.tool.%'").all<{ key: string; value: string }>();
  const settings = new Map((rows.results ?? []).map((row) => [row.key.slice("admin.tool.".length), row.value !== "false"]));
  return c.json({ tools: VALID_FEATURES.map((featureType) => ({ featureType, name: featureLabelForCredits(featureType), enabled: settings.get(featureType) ?? true })) });
});

admin.put("/tools/:featureType", async (c) => {
  const featureType = c.req.param("featureType");
  if (!VALID_FEATURES.includes(featureType as (typeof VALID_FEATURES)[number])) return c.json({ error: "Unknown tool" }, 404);
  const body = await c.req.json<{ enabled?: boolean }>().catch(() => ({} as { enabled?: boolean }));
  if (typeof body.enabled !== "boolean") return c.json({ error: "enabled must be a boolean" }, 400);
  await c.env.DB.prepare(
    "insert into app_content (key, value) values (?, ?) on conflict (key) do update set value = excluded.value",
  ).bind(`admin.tool.${featureType}`, String(body.enabled)).run();
  return c.json({ ok: true, featureType, enabled: body.enabled });
});

const WORKFLOWS = [
  { id: "scan-to-guide", name: "Face scan to Glow Up Guide", source: "FACE_BEAUTY_ANALYSIS", destination: "GLOW_UP_GUIDE" },
  { id: "scan-to-tips", name: "Face scan to Beauty Tips", source: "FACE_BEAUTY_ANALYSIS", destination: "BEAUTY_TIPS" },
  { id: "score-to-showdown", name: "Beauty score to Showdown", source: "FACE_BEAUTY_ANALYSIS", destination: "BEAUTY_SCORE_SHOWDOWN" },
];

admin.get("/workflows", async (c) => {
  const rows = await c.env.DB.prepare("select key, value from app_content where key like 'admin.workflow.%'").all<{ key: string; value: string }>();
  const settings = new Map((rows.results ?? []).map((row) => [row.key.slice("admin.workflow.".length), row.value !== "false"]));
  return c.json({ workflows: WORKFLOWS.map((workflow) => ({ ...workflow, enabled: settings.get(workflow.id) ?? true })) });
});

admin.put("/workflows/:id", async (c) => {
  const id = c.req.param("id");
  if (!WORKFLOWS.some((workflow) => workflow.id === id)) return c.json({ error: "Unknown workflow" }, 404);
  const body = await c.req.json<{ enabled?: boolean }>().catch(() => ({} as { enabled?: boolean }));
  if (typeof body.enabled !== "boolean") return c.json({ error: "enabled must be a boolean" }, 400);
  await c.env.DB.prepare(
    "insert into app_content (key, value) values (?, ?) on conflict (key) do update set value = excluded.value",
  ).bind(`admin.workflow.${id}`, String(body.enabled)).run();
  return c.json({ ok: true, id, enabled: body.enabled });
});

const SETTING_KEYS = [
  "free_credits", "annual_credits", "weekly_credits", "maintenance_enabled", "maintenance_message",
  "announcement_enabled", "announcement_text", "announcement_type", "platform_name", "support_email",
] as const;

admin.get("/settings", async (c) => {
  const rows = await c.env.DB.prepare("select key, value from app_content where key like 'admin.%'").all<{ key: string; value: string }>();
  const settings: Record<string, string> = {};
  for (const row of rows.results ?? []) settings[row.key.slice("admin.".length)] = row.value;
  return c.json({ settings });
});

admin.put("/settings", async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({} as Record<string, unknown>));
  const statements: D1PreparedStatement[] = [];
  for (const key of SETTING_KEYS) {
    if (!(key in body)) continue;
    let value = String(body[key] ?? "").trim();
    if (key.endsWith("_credits")) {
      const number = Number(value);
      if (!Number.isInteger(number) || number < 0 || number > 100000) return c.json({ error: `${key} must be a positive whole number` }, 400);
      value = String(number);
    }
    if (key.endsWith("_enabled") && value !== "true" && value !== "false") return c.json({ error: `${key} must be a boolean` }, 400);
    statements.push(c.env.DB.prepare(
      "insert into app_content (key, value) values (?, ?) on conflict (key) do update set value = excluded.value",
    ).bind(`admin.${key}`, value));
  }
  if (statements.length) await c.env.DB.batch(statements);
  if ("free_credits" in body) {
    const nextAllocation = Number(body.free_credits);
    await c.env.DB.prepare(
      `update profiles
       set credits_balance = max(0, ? - max(0, credits_allocated - credits_balance)),
           credits_allocated = ?, credits_period_key = 'free-lifetime', updated_at = ?
       where is_pro = 0 and subscription_plan = 'free'`,
    ).bind(nextAllocation, nextAllocation, new Date().toISOString()).run();
  }
  return c.json({ ok: true });
});

admin.get("/notifications", async (c) => {
  const rows = await c.env.DB.prepare("select * from admin_notifications order by created_at desc limit 50").all();
  return c.json({ notifications: rows.results ?? [] });
});

admin.post("/notifications", async (c) => {
  const body = await c.req.json<{ title?: string; message?: string; type?: string; audience?: string; targetUserId?: string }>().catch(() => ({} as { title?: string; message?: string; type?: string; audience?: string; targetUserId?: string }));
  const title = body.title?.trim().slice(0, 100);
  const message = body.message?.trim().slice(0, 500);
  if (!title || !message) return c.json({ error: "Title and message are required" }, 400);
  const audience = body.audience === "user" ? "user" : body.audience === "pro" ? "pro" : body.audience === "free" ? "free" : "all";
  if (audience === "user" && !body.targetUserId) return c.json({ error: "Select a user" }, 400);
  const serviceAccount = loadServiceAccount(c.env);
  if (!serviceAccount) return c.json({ error: "Firebase messaging is not configured" }, 503);

  const query = audience === "user"
    ? c.env.DB.prepare("select id from profiles where id = ?").bind(body.targetUserId)
    : audience === "pro"
      ? c.env.DB.prepare("select id from profiles where is_pro = 1")
      : audience === "free"
        ? c.env.DB.prepare("select id from profiles where is_pro = 0")
        : c.env.DB.prepare("select id from profiles");
  const users = await query.all<{ id: string }>();
  let sent = 0;
  let failed = 0;
  for (const user of users.results ?? []) {
    const result = await sendChallengePushToUser(c.env.DB, serviceAccount, {
      userId: user.id, title, body: message, data: { type: body.type ?? "info", source: "admin" },
    });
    sent += result.sent;
    failed += result.total === 0 ? 1 : Math.max(0, result.total - result.sent);
  }
  await c.env.DB.prepare(
    `insert into admin_notifications (id, title, message, notification_type, audience, target_user_id, sent_count, failed_count, created_by)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(crypto.randomUUID(), title, message, body.type ?? "info", audience, body.targetUserId ?? null, sent, failed, c.get("userEmail")).run();
  return c.json({ ok: true, sent, failed });
});
