/**
 * Regression test for Polar plans and credits. Runs against a THROWAWAY local D1 copy
 * (.wrangler/test-state), never the real database.
 *
 *   node scripts/test-polar-credits.mjs
 */
import { getPlatformProxy } from "wrangler";
import { Webhook } from "standardwebhooks";
import { polarWebhook } from "../src/routes/polar/webhook";
import {
  POLAR_PRODUCT_ID_ANNUAL_DEFAULT,
  POLAR_PRODUCT_ID_PAYG_DEFAULT,
  POLAR_PRODUCT_ID_PRO_MONTHLY_DEFAULT,
  POLAR_PRODUCT_ID_PRO_WEEKLY_DEFAULT,
  checkAnalysisAccess,
  deductCredits,
  grantPurchasedCredits,
  chargeWebGeneration,
  getGenerationBalance,
} from "../src/lib/credits";

const SECRET = "polar_whs_localtestsecret_0123456789abcdef";
const proxy = await getPlatformProxy({ persist: { path: ".wrangler/test-state/v3" } });
const DB = proxy.env.DB as D1Database;
const env = { DB, POLAR_WEBHOOK_SECRET: SECRET } as never;
const signer = new Webhook(btoa(SECRET));

let passed = 0, failed = 0, seq = 0;
const run = Date.now().toString(36);
function check(name: string, ok: boolean, detail = "") {
  if (ok) { passed++; console.log(`  PASS  ${name}`); } else { failed++; console.log(`  FAIL  ${name}  ${detail}`); }
}

async function send(type: string, data: Record<string, unknown>, id = `evt_${run}_${++seq}`, secret = SECRET) {
  const body = JSON.stringify({ type, data });
  const ts = new Date();
  const sig = (secret === SECRET ? signer : new Webhook(btoa(secret))).sign(id, ts, body);
  const res = await polarWebhook.fetch(new Request("http://test/", {
    method: "POST",
    headers: { "content-type": "application/json", "webhook-id": id, "webhook-timestamp": String(Math.floor(ts.getTime() / 1000)), "webhook-signature": sig },
    body,
  }), env);
  return res.status;
}

async function newUser(tag: string) {
  const id = `u_${run}_${tag}`;
  const now = new Date().toISOString();
  await DB.prepare('insert into "user" (id, name, email, emailVerified, createdAt, updatedAt) values (?, ?, ?, 0, ?, ?)').bind(id, tag, `${id}@test.local`, now, now).run();
  await DB.prepare("insert into profiles (id, email) values (?, ?)").bind(id, `${id}@test.local`).run();
  return id;
}
const profile = (id: string) => DB.prepare("select is_pro, subscription_plan, subscription_status, credits_balance, purchased_credits from profiles where id = ?").bind(id).first<{ is_pro: number; subscription_plan: string; subscription_status: string; credits_balance: number; purchased_credits: number }>();
const sub = (userId: string, product: string, status: string, extra: Record<string, unknown> = {}) => ({
  id: `sub_${userId}`, status, product: { id: product }, customer: { id: `cus_${userId}`, external_id: userId, email: `${userId}@test.local` }, current_period_end: "2099-01-01T00:00:00Z", ...extra,
});
const order = (userId: string, orderId: string, product: string, reason: string, extra: Record<string, unknown> = {}) => ({
  id: orderId, billing_reason: reason, product: { id: product }, customer: { id: `cus_${userId}`, external_id: userId, email: `${userId}@test.local` }, ...extra,
});

console.log("\nSignature checks");
{
  const u = await newUser("sig");
  const bad = await send("subscription.active", sub(u, POLAR_PRODUCT_ID_PRO_MONTHLY_DEFAULT, "active"), undefined, "polar_whs_someOTHERsecret_0123456789abcdef");
  check("wrong signature is rejected (403)", bad === 403, `got ${bad}`);
  check("rejected event changed nothing", (await profile(u))!.is_pro === 0);
}

console.log("\nPro Monthly");
{
  const u = await newUser("monthly");
  const st = await send("subscription.active", sub(u, POLAR_PRODUCT_ID_PRO_MONTHLY_DEFAULT, "active"));
  const p = (await profile(u))!;
  check("webhook accepted (202)", st === 202, `got ${st}`);
  check("becomes Pro on the monthly plan", p.is_pro === 1 && p.subscription_plan === "pro_monthly", JSON.stringify(p));
  check("gets 200 credits", p.credits_balance === 200, `got ${p.credits_balance}`);
  await DB.prepare("update profiles set credits_balance = 40 where id = ?").bind(u).run();
  await send("order.created", order(u, `ord_${run}_renew`, POLAR_PRODUCT_ID_PRO_MONTHLY_DEFAULT, "subscription_cycle", { subscription: sub(u, POLAR_PRODUCT_ID_PRO_MONTHLY_DEFAULT, "active") }));
  check("renewal refills to 200", (await profile(u))!.credits_balance === 200);
}

console.log("\nPro Yearly with 3-day free trial");
{
  const u = await newUser("trial");
  await send("subscription.created", sub(u, POLAR_PRODUCT_ID_ANNUAL_DEFAULT, "trialing"));
  let p = (await profile(u))!;
  check("trial user gets Pro access", p.is_pro === 1 && p.subscription_plan === "annual" && p.subscription_status === "trialing", JSON.stringify(p));
  check("trial grants only 20 credits (not 2,400)", p.credits_balance === 20, `got ${p.credits_balance}`);
  await DB.prepare("update profiles set credits_balance = 5 where id = ?").bind(u).run();
  await checkAnalysisAccess(DB, u, "HAIR", undefined).catch(() => {});
  check("using the app during the trial does not refill to the full amount", (await profile(u))!.credits_balance === 5, `got ${(await profile(u))!.credits_balance}`);
  await send("subscription.updated", sub(u, POLAR_PRODUCT_ID_ANNUAL_DEFAULT, "active"));
  p = (await profile(u))!;
  check("when the trial converts, full 2,400 credits arrive", p.credits_balance === 2400 && p.subscription_status === "active", JSON.stringify(p));
}

console.log("\nLegacy plans still work");
{
  const u = await newUser("weekly");
  await send("subscription.active", sub(u, POLAR_PRODUCT_ID_PRO_WEEKLY_DEFAULT, "active"));
  const p = (await profile(u))!;
  check("existing weekly subscribers still get 30 credits", p.subscription_plan === "pro_weekly" && p.credits_balance === 30, JSON.stringify(p));
}

console.log("\nPay as you go");
{
  const u = await newUser("payg");
  await send("order.paid", order(u, `ord_${run}_a`, POLAR_PRODUCT_ID_PAYG_DEFAULT, "purchase", { net_amount: 1500, status: "paid", paid: true }));
  check("$15 buys 200 credits", (await profile(u))!.purchased_credits === 200, `got ${(await profile(u))!.purchased_credits}`);
  await send("order.paid", order(u, `ord_${run}_a`, POLAR_PRODUCT_ID_PAYG_DEFAULT, "purchase", { net_amount: 1500, status: "paid", paid: true }));
  await send("order.created", order(u, `ord_${run}_a`, POLAR_PRODUCT_ID_PAYG_DEFAULT, "purchase", { net_amount: 1500, status: "paid", paid: true }));
  check("same order delivered again (different event ids) is not credited twice", (await profile(u))!.purchased_credits === 200, `got ${(await profile(u))!.purchased_credits}`);
  await send("order.created", order(u, `ord_${run}_pending`, POLAR_PRODUCT_ID_PAYG_DEFAULT, "purchase", { net_amount: 1500, status: "pending", paid: false }));
  check("an unpaid order credits nothing", (await profile(u))!.purchased_credits === 200);
  await send("order.paid", order(u, `ord_${run}_b`, POLAR_PRODUCT_ID_PAYG_DEFAULT, "purchase", { net_amount: 500, status: "paid", paid: true }));
  check("$5 adds 67 credits (matches the pricing page)", (await profile(u))!.purchased_credits === 267, `got ${(await profile(u))!.purchased_credits}`);
  await send("order.paid", order(u, `ord_${run}_other`, "00000000-0000-0000-0000-000000000000", "purchase", { net_amount: 9900, status: "paid", paid: true }));
  check("an order for a different product credits nothing", (await profile(u))!.purchased_credits === 267);
  const direct = await grantPurchasedCredits(DB, u, { orderId: `ord_${run}_b`, amountCents: 500 });
  check("granting the same order id directly is flagged duplicate", direct.duplicate === true);
}

console.log("\nSpending credits");
{
  const u = await newUser("spend");
  await DB.prepare("update profiles set is_pro = 1, subscription_plan = 'pro_monthly', subscription_status = 'active', credits_balance = 3, credits_allocated = 200, credits_period_key = ?, purchased_credits = 100 where id = ?")
    .bind(`${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, "0")}`, u).run();
  const left = await deductCredits(DB, u, "HAIR");
  const p = (await profile(u))!;
  check("a Pro user spends plan credits first, then bought credits", p.credits_balance === 0 && p.purchased_credits === 98, JSON.stringify(p));
  check("remaining balance reported is the total", left === 98, `got ${left}`);

  const buyer = await newUser("buyer");
  await DB.prepare("update profiles set purchased_credits = 10 where id = ?").bind(buyer).run();
  let ok = true; try { await checkAnalysisAccess(DB, buyer, "HAIR", undefined); } catch { ok = false; }
  check("someone with only bought credits can use any tool, no ad gate", ok);
  await deductCredits(DB, buyer, "HAIR");
  const b = (await profile(buyer))!;
  check("bought credits are used and the free credits are left alone", b.purchased_credits === 5 && b.credits_balance === 10, JSON.stringify(b));

  const free = await newUser("free");
  let blocked = false; try { await checkAnalysisAccess(DB, free, "HAIR", undefined); } catch (e) { blocked = (e as { code?: string }).code === "NOT_SUBSCRIBED" || /subscription|credit pack/i.test(String((e as Error).message)); }
  check("a free user with no purchase is still blocked from paid tools", blocked);

  const racer = await newUser("race");
  await DB.prepare("update profiles set purchased_credits = 5 where id = ?").bind(racer).run();
  const results = await Promise.allSettled([deductCredits(DB, racer, "HAIR"), deductCredits(DB, racer, "HAIR")]);
  const okCount = results.filter((r) => r.status === "fulfilled").length;
  check("two simultaneous analyses cannot spend the same 5 credits twice", okCount === 1 && (await profile(racer))!.purchased_credits === 0, `succeeded: ${okCount}`);
}

console.log("\nCancelling");
{
  const u = await newUser("cancel");
  await send("subscription.active", sub(u, POLAR_PRODUCT_ID_PRO_MONTHLY_DEFAULT, "active"));
  await send("order.paid", order(u, `ord_${run}_c`, POLAR_PRODUCT_ID_PAYG_DEFAULT, "purchase", { net_amount: 1500, status: "paid", paid: true }));
  await send("subscription.revoked", sub(u, POLAR_PRODUCT_ID_PRO_MONTHLY_DEFAULT, "revoked"));
  const p = (await profile(u))!;
  check("ending a subscription removes Pro and plan credits", p.is_pro === 0 && p.credits_balance === 0, JSON.stringify(p));
  check("but credits they bought are kept", p.purchased_credits === 200, `got ${p.purchased_credits}`);
}

console.log("\nCharging a tool run on the new site");
{
  const u = await newUser("webfree");
  const b0 = await getGenerationBalance(DB, u);
  check("a new free account has 10 credits", b0.total === 10, JSON.stringify(b0));
  const r1 = await chargeWebGeneration(DB, u, "Hairstyle Changer");
  const r2 = await chargeWebGeneration(DB, u, "Hairstyle Changer");
  check("free credits pay for 2 results on any tool", r1 === 5 && r2 === 0, `${r1}, ${r2}`);
  let blocked = false; try { await chargeWebGeneration(DB, u, "Hairstyle Changer"); } catch { blocked = true; }
  check("a third result is refused when credits run out", blocked);

  const mix = await newUser("webmix");
  await DB.prepare("update profiles set credits_balance = 3, purchased_credits = 10 where id = ?").bind(mix).run();
  const left = await chargeWebGeneration(DB, mix, "Cartoon Yourself");
  const m = (await profile(mix))!;
  check("plan credits are used first, then bought credits", m.credits_balance === 0 && m.purchased_credits === 8 && left === 8, JSON.stringify(m));

  const racer2 = await newUser("webrace");
  await DB.prepare("update profiles set credits_balance = 5 where id = ?").bind(racer2).run();
  const res = await Promise.allSettled([chargeWebGeneration(DB, racer2, "x"), chargeWebGeneration(DB, racer2, "x")]);
  check("two simultaneous results cannot spend the same 5 credits", res.filter((r) => r.status === "fulfilled").length === 1);
}

console.log(`\n${passed} passed, ${failed} failed`);
await proxy.dispose();
process.exit(failed ? 1 : 0);
