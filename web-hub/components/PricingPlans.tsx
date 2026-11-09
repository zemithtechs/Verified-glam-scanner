"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import { PRICING, generationsFor, money, num, paygCredits, perCredit, yearlyPerMonth, yearlySavingsPercent, yearOfMonthly } from "@/lib/pricing";

const card = "relative flex flex-col rounded-3xl border bg-white p-7 sm:p-8";
const bullet = "flex items-start gap-2.5 text-[15px] leading-6 text-ink";

function Bullets({ items }: { items: string[] }) {
  return <ul className="mt-6 flex-1 space-y-3">{items.map((t) => <li key={t} className={bullet}><Check size={18} className="mt-[3px] shrink-0 text-berry" aria-hidden="true" />{t}</li>)}</ul>;
}

function StarterCard() {
  return (
    <section className={`${card} border-line`} aria-labelledby="plan-starter">
      <h2 id="plan-starter" className="font-display text-2xl font-semibold text-ink">Starter</h2>
      <p className="mt-1 text-sm text-muted">Try the tools before you commit.</p>
      <p className="mt-6 flex items-baseline gap-2"><span className="font-display text-5xl font-semibold text-ink">$0</span><span className="text-sm text-muted">free</span></p>
      <Bullets items={[`${PRICING.starter.credits} free credits to start`, `About ${generationsFor(PRICING.starter.credits)} AI results (${PRICING.creditsPerGeneration} credits each)`, "Free-to-try tools", "Download your results", "Supported by ads"]} />
      <Link href="/register" className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-plum/25 bg-white px-6 text-[15px] font-semibold text-plum transition-colors hover:bg-blush">Start free</Link>
    </section>
  );
}

function ProCard() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const yearly = billing === "yearly";
  const credits = yearly ? PRICING.yearly.credits : PRICING.monthly.credits;
  return (
    <section className={`${card} border-berry shadow-[0_24px_60px_rgba(184,50,95,0.16)]`} aria-labelledby="plan-pro">
      <span className="absolute -top-3 left-7 rounded-full bg-plum px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Most popular</span>
      <h2 id="plan-pro" className="font-display text-2xl font-semibold text-ink">Pro</h2>
      <p className="mt-1 text-sm text-muted">Every tool, no ads, more credits.</p>

      <div role="group" aria-label="Billing period" className="mt-5 grid grid-cols-2 rounded-xl bg-blush p-1">
        {(["monthly", "yearly"] as const).map((b) => (
          <button key={b} type="button" aria-pressed={billing === b} onClick={() => setBilling(b)} className={`flex h-10 items-center justify-center gap-2 rounded-lg text-[14px] font-semibold transition-colors ${billing === b ? "bg-white text-plum shadow-sm" : "text-muted hover:text-ink"}`}>
            {b === "monthly" ? "Monthly" : "Yearly"}
            {b === "yearly" && <span className="rounded-full bg-plum px-2 py-0.5 text-[11px] font-semibold text-white">Save {yearlySavingsPercent}%</span>}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[88px]">
        {yearly ? (
          <>
            <p className="flex items-baseline gap-2"><span className="font-display text-5xl font-semibold text-ink">{money(PRICING.yearly.price)}</span><span className="text-sm text-muted">/ year</span><span className="ml-1 text-base text-muted line-through" aria-label={`Instead of ${money(yearOfMonthly)}`}>{money(yearOfMonthly)}</span></p>
            <p className="mt-1.5 text-sm text-muted">Just {money(yearlyPerMonth)} a month, billed once a year.</p>
          </>
        ) : (
          <>
            <p className="flex items-baseline gap-2"><span className="font-display text-5xl font-semibold text-ink">{money(PRICING.monthly.price)}</span><span className="text-sm text-muted">/ month</span></p>
            <p className="mt-1.5 text-sm text-muted">Billed monthly. Cancel anytime.</p>
          </>
        )}
      </div>

      {yearly && (
        <div className="mt-4 rounded-xl border border-berry/25 bg-blush/60 px-4 py-3 text-[14px] leading-5 text-ink">
          <p className="font-semibold text-plum">Start with a {PRICING.yearly.trialDays}-day free trial</p>
          <p className="mt-0.5 text-muted">$0 due today, and {PRICING.yearly.trialCredits} credits to try it. After {PRICING.yearly.trialDays} days you are charged {money(PRICING.yearly.price)} for the year and your {num(PRICING.yearly.credits)} credits arrive. Cancel before then and you pay nothing.</p>
        </div>
      )}

      <Bullets items={[
        yearly ? `${num(credits)} credits per year` : `${num(credits)} credits every month`,
        `${money(yearly ? perCredit.yearly : perCredit.monthly, 3)} per credit`,
        `About ${num(generationsFor(credits))} AI results ${yearly ? "per year" : "each month"}`,
        "Access to every tool, including Pro tools",
        "Ad-free browsing and results",
        "Priority access to new tools",
        "Full result history",
        "Cancel anytime",
      ]} />

      <CheckoutButton planId={yearly ? "annual" : "pro_monthly"} className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-plum px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60">
        {yearly ? `Start ${PRICING.yearly.trialDays}-day free trial` : `Subscribe for ${money(PRICING.monthly.price)} / month`}<ArrowRight size={17} aria-hidden="true" />
      </CheckoutButton>
      <p className="mt-3 text-center text-xs text-muted">{yearly ? `Then ${money(PRICING.yearly.price)} per year. No payment today.` : "Secure checkout. Renews monthly until cancelled."}</p>
    </section>
  );
}

function PaygCard() {
  const { min, max, step } = PRICING.payg;
  const [amount, setAmount] = useState<number>(PRICING.payg.defaultAmount);
  const credits = paygCredits(amount);
  const pct = ((amount - min) / (max - min)) * 100;
  return (
    <section className={`${card} border-line`} aria-labelledby="plan-payg">
      <h2 id="plan-payg" className="font-display text-2xl font-semibold text-ink">Pay as you go</h2>
      <p className="mt-1 text-sm text-muted">One-time purchase. No subscription.</p>
      <p className="mt-6 flex items-baseline gap-2"><span className="font-display text-5xl font-semibold text-ink">{money(amount)}</span><span className="text-sm text-muted">one time</span></p>

      <label className="mt-5 block">
        <span className="sr-only">Amount to spend</span>
        <input type="range" min={min} max={max} step={step} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="price-slider w-full" style={{ ["--fill" as string]: `${pct}%` }} aria-valuetext={`${money(amount)} for ${credits} credits`} />
        <span className="mt-1 flex justify-between text-xs text-muted"><span>{money(min)}</span><span>{money(max)}</span></span>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRICING.payg.quick.map((q) => (
          <button key={q} type="button" onClick={() => setAmount(q)} aria-pressed={amount === q} className={`h-8 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${amount === q ? "border-plum bg-plum text-white" : "border-line text-ink hover:bg-blush"}`}>{money(q)}</button>
        ))}
      </div>

      <Bullets items={[
        `${num(credits)} credits`,
        `${money(perCredit.payg, 3)} per credit`,
        `About ${num(generationsFor(credits))} AI results`,
        "Credits never expire",
        "Access to every tool",
        "No subscription, no renewal",
      ]} />

      <CheckoutButton planId="payg" amount={amount} className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-plum/25 bg-white px-6 text-[15px] font-semibold text-plum transition-colors hover:bg-blush disabled:opacity-60">
        Buy {num(credits)} credits for {money(amount)}<ArrowRight size={17} aria-hidden="true" />
      </CheckoutButton>
      <p className="mt-3 text-center text-xs text-muted">Pay once at checkout. No subscription.</p>
    </section>
  );
}

export function PricingPlans() {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-3">
      <StarterCard />
      <ProCard />
      <PaygCard />
    </div>
  );
}
