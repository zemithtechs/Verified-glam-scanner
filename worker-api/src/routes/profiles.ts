import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";

// Port of vg_supabase_profile_repository.dart. Consolidated into fewer,
// more RESTful endpoints than the original per-field Supabase queries,
// since D1 has no auto-generated table REST layer to mirror 1:1 — this is
// the "genuinely new work" the migration plan called out.
export const profiles = new Hono<{ Bindings: Env; Variables: SessionVars }>();

function sanitize(value: unknown, maxLen = 120): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function sanitizeList(values: unknown, maxLen = 80): string[] {
  if (!Array.isArray(values)) return [];
  return values.map((v) => sanitize(v, maxLen)).filter((v): v is string => v != null);
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const r = Date.now();
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[(r + i * 17) % chars.length];
  return out;
}

profiles.get("/me", async (c) => {
  const row = await c.env.DB.prepare("select * from profiles where id = ?").bind(c.get("userId")).first();
  if (!row) return c.json({ error: "not_found" }, 404);
  return c.json({
    ...row,
    beauty_goals: JSON.parse((row.beauty_goals as string) ?? "[]"),
    skin_concerns: JSON.parse((row.skin_concerns as string) ?? "[]"),
    product_preferences: JSON.parse((row.product_preferences as string) ?? "[]"),
    onboarding_complete: row.onboarding_complete === 1,
    is_pro: row.is_pro === 1,
    referral_bonus_redeemed: row.referral_bonus_redeemed === 1,
  });
});

profiles.put("/onboarding", async (c) => {
  const userId = c.get("userId");
  const userEmail = c.get("userEmail");
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}) as Record<string, unknown>);

  await c.env.DB.prepare(
    `insert into profiles (id, email, age, gender, beauty_goals, skin_concerns, product_preferences, skin_type, ethnicity, aesthetic, onboarding_complete, updated_at)
     values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
     on conflict (id) do update set
       email = excluded.email, age = excluded.age, gender = excluded.gender,
       beauty_goals = excluded.beauty_goals, skin_concerns = excluded.skin_concerns,
       product_preferences = excluded.product_preferences, skin_type = excluded.skin_type,
       ethnicity = excluded.ethnicity, aesthetic = excluded.aesthetic,
       onboarding_complete = 1, updated_at = excluded.updated_at`,
  )
    .bind(
      userId,
      sanitize(userEmail, 254),
      typeof body.age === "number" ? body.age : null,
      sanitize(body.gender),
      JSON.stringify(sanitizeList(body.beautyGoals)),
      JSON.stringify(sanitizeList(body.skinConcerns)),
      JSON.stringify(sanitizeList(body.productPreferences)),
      sanitize(body.skinType),
      sanitize(body.ethnicity),
      sanitize(body.aesthetic),
      new Date().toISOString(),
    )
    .run();

  return c.json({ ok: true });
});

profiles.post("/referral-code", async (c) => {
  const userId = c.get("userId");
  const db = c.env.DB;
  const row = await db.prepare("select referral_code from profiles where id = ?").bind(userId).first<{ referral_code: string | null }>();
  if (row?.referral_code) return c.json({ referralCode: row.referral_code });

  const code = generateReferralCode();
  await db.prepare("update profiles set referral_code = ? where id = ?").bind(code, userId).run();
  return c.json({ referralCode: code });
});

profiles.post("/referral-download-count/increment", async (c) => {
  const userId = c.get("userId");
  const db = c.env.DB;
  const row = await db
    .prepare("select referral_download_count from profiles where id = ?")
    .bind(userId)
    .first<{ referral_download_count: number | null }>();
  const next = (row?.referral_download_count ?? 0) + 1;
  await db.prepare("update profiles set referral_download_count = ? where id = ?").bind(next, userId).run();
  return c.json({ count: next });
});

profiles.get("/credit-transactions", async (c) => {
  const userId = c.get("userId");
  const url = new URL(c.req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const earnedOnly = url.searchParams.get("earnedOnly") === "true";
  const usedOnly = url.searchParams.get("usedOnly") === "true";
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);

  const clauses = ["user_id = ?"];
  const params: unknown[] = [userId];
  if (from) {
    clauses.push("created_at >= ?");
    params.push(from);
  }
  if (to) {
    clauses.push("created_at <= ?");
    params.push(to);
  }
  if (earnedOnly) clauses.push("amount > 0");
  else if (usedOnly) clauses.push("amount < 0");

  const rows = await c.env.DB.prepare(
    `select * from credit_transactions where ${clauses.join(" and ")} order by created_at desc limit ?`,
  )
    .bind(...params, limit)
    .all();

  return c.json({ transactions: rows.results ?? [] });
});

profiles.post("/referral-bonus/redeem", async (c) => {
  const userId = c.get("userId");
  const db = c.env.DB;
  const body = await c.req.json<{ bonusScans?: number }>().catch(() => ({}) as { bonusScans?: number });
  const bonusScans = typeof body.bonusScans === "number" ? body.bonusScans : 0;

  const row = await db.prepare("select bonus_scans from profiles where id = ?").bind(userId).first<{ bonus_scans: number | null }>();
  const currentBonus = row?.bonus_scans ?? 0;

  await db
    .prepare("update profiles set referral_bonus_redeemed = 1, bonus_scans = ? where id = ?")
    .bind(currentBonus + bonusScans, userId)
    .run();
  return c.json({ ok: true });
});
