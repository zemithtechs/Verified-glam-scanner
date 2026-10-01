import type { Env } from "../env";

// Port of supabase/functions/_shared/credits.ts onto D1. Business logic is
// unchanged; only the storage calls move from the Supabase JS client to D1
// prepared statements (see docs/CLOUDFLARE_MIGRATION_PLAN.md — credits.ts row).

export const CREDITS_PER_GENERATION = 5;
export const FREE_CREDITS_ALLOCATION = 10;
export const YEARLY_CREDITS_ALLOCATION = 200;
export const PRO_WEEKLY_CREDITS_ALLOCATION = 30;

export const POLAR_PRODUCT_ID_ANNUAL_DEFAULT = "9e185286-cf2b-41b8-a728-e7154d144722";
export const POLAR_PRODUCT_ID_PRO_WEEKLY_DEFAULT = "8c9fddc9-1001-4143-8a27-31ce929ae5e6";

export type SubscriptionPlan = "free" | "annual" | "pro_weekly";

export function polarProductIds(env: Env): { annual: string; proWeekly: string } {
  return {
    annual: env.POLAR_PRODUCT_ID_ANNUAL || POLAR_PRODUCT_ID_ANNUAL_DEFAULT,
    proWeekly: env.POLAR_PRODUCT_ID_PRO_WEEKLY || POLAR_PRODUCT_ID_PRO_WEEKLY_DEFAULT,
  };
}

export function planForPolarProductId(env: Env, productId: string): SubscriptionPlan | null {
  const ids = polarProductIds(env);
  if (productId === ids.annual) return "annual";
  if (productId === ids.proWeekly) return "pro_weekly";
  return null;
}

export function currentPeriodKey(plan: SubscriptionPlan): string {
  const now = new Date();
  if (plan === "pro_weekly") {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }
  if (plan === "annual") {
    return String(now.getUTCFullYear());
  }
  return "free-lifetime";
}

export function allocationForPlan(plan: SubscriptionPlan): number {
  if (plan === "pro_weekly") return PRO_WEEKLY_CREDITS_ALLOCATION;
  if (plan === "annual") return YEARLY_CREDITS_ALLOCATION;
  return FREE_CREDITS_ALLOCATION;
}

async function configuredAllocation(db: D1Database, plan: SubscriptionPlan): Promise<number> {
  const key = plan === "annual" ? "admin.annual_credits" : plan === "pro_weekly" ? "admin.weekly_credits" : "admin.free_credits";
  const row = await db.prepare("select value from app_content where key = ?").bind(key).first<{ value: string }>();
  const value = Number(row?.value);
  return Number.isInteger(value) && value >= 0 ? value : allocationForPlan(plan);
}

export type CreditTransactionKind =
  | "subscription_grant"
  | "period_refresh"
  | "analysis"
  | "subscription_revoke";

export async function logCreditTransaction(
  db: D1Database,
  userId: string,
  opts: {
    amount: number;
    kind: CreditTransactionKind;
    description: string;
    featureType?: string | null;
    balanceAfter?: number | null;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `insert into credit_transactions (id, user_id, amount, kind, description, feature_type, balance_after)
         values (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        userId,
        opts.amount,
        opts.kind,
        opts.description,
        opts.featureType ?? null,
        opts.balanceAfter ?? null,
      )
      .run();
  } catch (e) {
    console.error("logCreditTransaction failed:", e);
  }
}

function planCreditLabel(plan: SubscriptionPlan): string {
  if (plan === "annual") return "Yearly subscription";
  if (plan === "pro_weekly") return "Pro weekly subscription";
  return "Subscription";
}

type ProfileCreditsRow = {
  credits_period_key: string | null;
  credits_allocated: number | null;
  credits_balance: number | null;
};

export async function grantSubscriptionCredits(
  db: D1Database,
  userId: string,
  plan: SubscriptionPlan,
  opts: {
    polarCustomerId?: string | null;
    polarSubscriptionId?: string | null;
    subscriptionStatus?: string;
    periodEnd?: string | null;
    forceRefresh?: boolean;
  } = {},
): Promise<void> {
  const allocated = await configuredAllocation(db, plan);
  const periodKey = currentPeriodKey(plan);
  const now = new Date().toISOString();

  const existing = await db
    .prepare(
      "select credits_period_key, credits_allocated, credits_balance from profiles where id = ?",
    )
    .bind(userId)
    .first<ProfileCreditsRow>();

  const samePeriod =
    existing?.credits_period_key === periodKey && (existing?.credits_allocated ?? 0) === allocated;
  const previousBalance = existing?.credits_balance ?? 0;
  const balance = opts.forceRefresh || !samePeriod ? allocated : existing?.credits_balance ?? allocated;

  await db
    .prepare(
      `update profiles set
         is_pro = 1,
         subscription_plan = ?,
         subscription_status = ?,
         credits_balance = ?,
         credits_allocated = ?,
         credits_period_key = ?,
         updated_at = ?,
         polar_customer_id = coalesce(?, polar_customer_id),
         polar_subscription_id = coalesce(?, polar_subscription_id),
         subscription_current_period_end = coalesce(?, subscription_current_period_end)
       where id = ?`,
    )
    .bind(
      plan,
      opts.subscriptionStatus ?? "active",
      balance,
      allocated,
      periodKey,
      now,
      opts.polarCustomerId ?? null,
      opts.polarSubscriptionId ?? null,
      opts.periodEnd ?? null,
      userId,
    )
    .run();

  if (opts.forceRefresh || !samePeriod) {
    const amountGranted = balance - previousBalance;
    if (amountGranted > 0) {
      const hadPriorPeriod = Boolean(existing?.credits_period_key);
      const kind: CreditTransactionKind = hadPriorPeriod && !samePeriod ? "period_refresh" : "subscription_grant";
      await logCreditTransaction(db, userId, {
        amount: amountGranted,
        kind,
        description:
          kind === "period_refresh"
            ? `${planCreditLabel(plan)} credits renewed`
            : `${planCreditLabel(plan)} credits granted`,
        balanceAfter: balance,
      });
    }
  }
}

export async function revokeSubscription(
  db: D1Database,
  userId: string,
  opts: {
    subscriptionStatus: string;
    periodEnd?: string | null;
    retainAccessUntilPeriodEnd?: boolean;
  },
): Promise<void> {
  const now = new Date();
  const periodEnd = opts.periodEnd ? new Date(opts.periodEnd) : null;
  const retain = Boolean(opts.retainAccessUntilPeriodEnd && periodEnd && periodEnd > now);

  const existing = await db
    .prepare("select credits_balance from profiles where id = ?")
    .bind(userId)
    .first<{ credits_balance: number | null }>();
  const previousBalance = existing?.credits_balance ?? 0;

  if (retain) {
    await db
      .prepare(
        `update profiles set is_pro = 1, subscription_status = ?, subscription_current_period_end = ?, updated_at = ?
         where id = ?`,
      )
      .bind(opts.subscriptionStatus, opts.periodEnd ?? null, now.toISOString(), userId)
      .run();
  } else {
    await db
      .prepare(
        `update profiles set
           is_pro = 0,
           subscription_plan = 'free',
           subscription_status = ?,
           subscription_current_period_end = ?,
           credits_balance = 0,
           credits_allocated = 0,
           credits_period_key = null,
           polar_subscription_id = null,
           updated_at = ?
         where id = ?`,
      )
      .bind(opts.subscriptionStatus, opts.periodEnd ?? null, now.toISOString(), userId)
      .run();
  }

  if (!retain && previousBalance > 0) {
    await logCreditTransaction(db, userId, {
      amount: -previousBalance,
      kind: "subscription_revoke",
      description: "Subscription ended — credits cleared",
      balanceAfter: 0,
    });
  }
}

export function extractUserIdFromCustomer(customer: Record<string, unknown> | null | undefined): string | null {
  if (!customer) return null;
  const externalId =
    customer.external_id ?? customer.externalId ?? customer.external_customer_id ?? customer.externalCustomerId;
  if (typeof externalId === "string" && externalId.length > 0) return externalId;
  return null;
}

/** Match a Worker user from Polar customer external_id or email (guest checkout). */
export async function resolveUserIdFromPolarCustomer(
  db: D1Database,
  customer: Record<string, unknown> | null | undefined,
): Promise<string | null> {
  const fromExternal = extractUserIdFromCustomer(customer);
  if (fromExternal) return fromExternal;

  const email = customer?.email;
  if (typeof email !== "string" || email.trim().length === 0) return null;

  const row = await db
    .prepare("select id from profiles where lower(email) = lower(?)")
    .bind(email.trim())
    .first<{ id: string }>();
  return row?.id ?? null;
}

export function extractProductId(subscription: Record<string, unknown>): string | null {
  const product = subscription.product as Record<string, unknown> | undefined;
  if (product?.id && typeof product.id === "string") return product.id;
  const productId = subscription.product_id ?? subscription.productId;
  if (typeof productId === "string") return productId;
  return null;
}

// --- analyze-scan's own credit-check/deduct pair (distinct from the grant/
// revoke pair above, which the Polar webhook uses) — port of analyze-scan's
// checkCredits/deductCredits/loadProfileCredits/refreshCreditsIfNeeded.

import { AnalysisError } from "./analyze-errors";
import { featureLabelForCredits } from "./analyze-types";
import { consumeRewardToken } from "./reward-tokens";

type ProfileCredits = {
  is_pro: number | null;
  subscription_plan: string | null;
  credits_balance: number | null;
  credits_period_key: string | null;
  credits_allocated: number | null;
};

async function loadProfileCredits(db: D1Database, userId: string): Promise<ProfileCredits> {
  const row = await db
    .prepare("select is_pro, subscription_plan, credits_balance, credits_period_key, credits_allocated from profiles where id = ?")
    .bind(userId)
    .first<ProfileCredits>();
  if (!row) {
    throw new AnalysisError(403, "NOT_SUBSCRIBED", "Profile not found.");
  }
  return row;
}

async function refreshCreditsIfNeeded(db: D1Database, userId: string, profile: ProfileCredits): Promise<ProfileCredits> {
  const plan = (profile.subscription_plan ?? "free") as SubscriptionPlan;
  const periodKey = currentPeriodKey(plan);
  const allocated = await configuredAllocation(db, plan);
  if (profile.credits_period_key === periodKey && (profile.credits_allocated ?? 0) === allocated) {
    return profile;
  }

  // Free credits are lifetime credits. If the configured allowance changes,
  // preserve credits already used instead of refilling the account.
  if (!profile.is_pro || plan === "free") {
    const previousAllocated = profile.credits_allocated ?? 0;
    const previousBalance = profile.credits_balance ?? 0;
    const used = Math.max(0, previousAllocated - previousBalance);
    const balance = Math.max(0, allocated - used);
    await db.prepare(
      "update profiles set credits_balance = ?, credits_allocated = ?, credits_period_key = ?, updated_at = ? where id = ?",
    ).bind(balance, allocated, periodKey, new Date().toISOString(), userId).run();
    return { ...profile, credits_balance: balance, credits_allocated: allocated, credits_period_key: periodKey };
  }

  const now = new Date().toISOString();
  await db
    .prepare(
      `update profiles set credits_balance = ?, credits_allocated = ?, credits_period_key = ?, subscription_plan = ?, is_pro = 1, updated_at = ?
       where id = ?`,
    )
    .bind(allocated, allocated, periodKey, plan, now, userId)
    .run();

  return { ...profile, credits_balance: allocated, credits_allocated: allocated, credits_period_key: periodKey, subscription_plan: plan, is_pro: 1 };
}

export async function checkCredits(db: D1Database, userId: string): Promise<void> {
  let profile = await loadProfileCredits(db, userId);
  profile = await refreshCreditsIfNeeded(db, userId, profile);
  const balance = profile.credits_balance ?? 0;
  if (balance < CREDITS_PER_GENERATION) {
    throw new AnalysisError(429, "INSUFFICIENT_CREDITS", "You need 5 credits for this analysis. Credits renew with your subscription plan.");
  }
}

export async function deductCredits(db: D1Database, userId: string, featureType: string): Promise<number> {
  const updated = await db
    .prepare(
      `update profiles set credits_balance = credits_balance - ?, updated_at = ?
       where id = ? and credits_balance >= ? returning credits_balance`,
    )
    .bind(CREDITS_PER_GENERATION, new Date().toISOString(), userId, CREDITS_PER_GENERATION)
    .first<{ credits_balance: number }>();
  if (!updated) {
    throw new AnalysisError(429, "INSUFFICIENT_CREDITS", "You need 5 credits for this analysis.");
  }
  const remaining = updated.credits_balance;

  await logCreditTransaction(db, userId, {
    amount: -CREDITS_PER_GENERATION,
    kind: "analysis",
    description: featureLabelForCredits(featureType),
    featureType,
    balanceAfter: remaining,
  });

  return remaining;
}

// --- Free tier: FACE_BEAUTY_ANALYSIS only, gated per-scan by a watched
// rewarded ad (see lib/reward-tokens.ts) rather than a lifetime counter.
// Every other feature type still requires is_pro via checkCredits() above —
// this is the one carve-out, not a parallel gating system.

const FREE_FEATURE_TYPE = "FACE_BEAUTY_ANALYSIS";

/** Replaces a bare checkCredits() call at the top of the analyze route. */
export async function checkAnalysisAccess(
  db: D1Database,
  userId: string,
  featureType: string,
  rewardToken: string | undefined,
): Promise<void> {
  const profile = await loadProfileCredits(db, userId);

  const toolSetting = await db.prepare("select value from app_content where key = ?")
    .bind(`admin.tool.${featureType}`)
    .first<{ value: string }>();
  if (toolSetting?.value === "false") {
    throw new AnalysisError(503, "TOOL_DISABLED", "This analysis is temporarily unavailable.");
  }

  const maintenance = await db.prepare("select value from app_content where key = 'admin.maintenance_enabled'")
    .first<{ value: string }>();
  if (maintenance?.value === "true") {
    const message = await db.prepare("select value from app_content where key = 'admin.maintenance_message'")
      .first<{ value: string }>();
    throw new AnalysisError(503, "MAINTENANCE", message?.value || "The analysis service is temporarily under maintenance.");
  }

  if (profile.is_pro) {
    await checkCredits(db, userId);
    return;
  }

  if (featureType !== FREE_FEATURE_TYPE) {
    throw new AnalysisError(403, "NOT_SUBSCRIBED", "Pro subscription required to run AI analysis.");
  }

  await checkCredits(db, userId);
  await consumeRewardToken(db, userId, featureType, rewardToken);
}
