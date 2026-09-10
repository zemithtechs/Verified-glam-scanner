import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";

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
      `select id, email, display_name, is_pro, subscription_plan, subscription_status, credits_balance, credits_allocated, created_at
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
