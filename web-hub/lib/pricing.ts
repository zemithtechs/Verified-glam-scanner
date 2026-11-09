/**
 * Single source of truth for the pricing page.
 * Change a number here and every card, label, comparison row and percentage updates.
 *
 * Anchors that match the live backend (worker-api/src/lib/credits.ts):
 *   - one AI generation costs 5 credits
 *   - a new account gets 10 free credits
 * Everything else is a PROPOSED value for the design preview and must be checked against
 * the real cost of one generation before launch.
 */
export const PRICING = {
  creditsPerGeneration: 5,
  starter: { credits: 10 },
  monthly: { price: 10, credits: 200 },
  yearly: { price: 60, credits: 2400, trialDays: 3, trialCredits: 20 },
  payg: { min: 5, max: 100, step: 5, defaultAmount: 15, pricePerCredit: 0.075, quick: [15, 25, 50, 100] },
} as const;

export const money = (n: number, digits = 0) => `$${n.toFixed(digits)}`;
export const num = (n: number) => n.toLocaleString("en-US");
export const generationsFor = (credits: number) => Math.floor(credits / PRICING.creditsPerGeneration);
export const paygCredits = (amount: number) => Math.round(amount / PRICING.payg.pricePerCredit);

/** What twelve months of the monthly plan would cost. This is a real price, so it is a fair comparison. */
export const yearOfMonthly = PRICING.monthly.price * 12;
/** Honest saving: yearly price vs paying monthly for 12 months. */
export const yearlySavingsPercent = Math.round((1 - PRICING.yearly.price / yearOfMonthly) * 100);
export const yearlyPerMonth = PRICING.yearly.price / 12;

export const perCredit = {
  monthly: PRICING.monthly.price / PRICING.monthly.credits,
  yearly: PRICING.yearly.price / PRICING.yearly.credits,
  payg: PRICING.payg.pricePerCredit,
};
