"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import { PRICING, generationsFor, money, num, paygCredits, perCredit, yearlyPerMonth, yearlySavingsPercent, yearOfMonthly } from "@/lib/pricing";
import { titleCase } from "@/lib/title-case";

const card = "relative flex flex-col rounded-[22px] border bg-white p-7 transition-shadow sm:p-8";
const bullet = "flex items-start gap-2.5 text-[15px] leading-6 text-ink";

function Bullets({ items }: { items: string[] }) {
  return <ul className="mt-6 flex-1 space-y-3">{items.map((t) => <li key={t} className={bullet}><span className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blush text-plum"><Check size={13} strokeWidth={2.5} aria-hidden="true" /></span>{t}</li>)}</ul>;
}

function StarterCard() {
  return (
    <section className={`${card} border-line`} aria-labelledby="plan-starter">
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-muted">Start here</p>
      <h2 id="plan-starter" className="mt-3 text-[27px] font-extrabold tracking-[-0.04em] text-ink">{titleCase("Starter lets you try it free.")}</h2>
      <p className="mt-1 text-sm text-muted">Make your first {generationsFor(PRICING.starter.credits)} results free and see if it fits.</p>
      <p className="mt-6 flex items-baseline gap-2"><span className="text-5xl font-extrabold tracking-[-0.06em] text-ink">$0</span><span className="text-sm text-muted">to begin</span></p>
      <Bullets items={[`${PRICING.starter.credits} free credits to start`, `About ${generationsFor(PRICING.starter.credits)} AI results (${PRICING.creditsPerGeneration} credits each)`, "Browse every example for free", "Download your results", "Results saved to My creations (latest 100)"]} />
      <Link href="/register" className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-plum/25 bg-white px-6 text-[15px] font-semibold text-plum transition-colors hover:bg-blush">Start free</Link>
    </section>
  );
}

function ProCard() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const yearly = billing === "yearly";
  const credits = yearly ? PRICING.yearly.credits : PRICING.monthly.credits;
  return (
    <section className={`${card} border-2 border-plum bg-[#fffdfd] shadow-[0_24px_60px_rgba(109,26,70,0.16)] lg:-translate-y-2`} aria-labelledby="plan-pro">
      <span className="absolute -top-3 left-7 rounded-full bg-plum px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white">Most popular</span>
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-plum">For regular creating</p>
      <h2 id="plan-pro" className="mt-3 text-[27px] font-extrabold tracking-[-0.04em] text-ink">{titleCase(`Pro gives you ${num(PRICING.monthly.credits)} credits a month or ${num(PRICING.yearly.credits)} a year.`)}</h2>
      <p className="mt-1 text-sm text-muted">About {generationsFor(PRICING.monthly.credits)} results a month and every tool.</p>

      <div role="group" aria-label="Billing period" className="mt-5 grid grid-cols-2 rounded-xl border border-plum/10 bg-blush/70 p-1">
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
            <p className="flex items-baseline gap-2"><span className="text-5xl font-extrabold tracking-[-0.06em] text-ink">{money(PRICING.yearly.price)}</span><span className="text-sm text-muted">/ year</span><span className="ml-1 text-base text-muted line-through" aria-label={`Instead of ${money(yearOfMonthly)}`}>{money(yearOfMonthly)}</span></p>
            <p className="mt-1.5 text-sm text-muted">{money(yearlyPerMonth, 2)} a month equivalent, billed yearly.</p>
          </>
        ) : (
          <>
            <p className="flex items-baseline gap-2"><span className="text-5xl font-extrabold tracking-[-0.06em] text-ink">{money(PRICING.monthly.price)}</span><span className="text-sm text-muted">/ month</span></p>
            <p className="mt-1.5 text-sm text-muted">Billed monthly. Cancel anytime.</p>
          </>
        )}
      </div>

      {yearly && (
        <div className="mt-4 rounded-xl border border-plum/15 bg-blush/50 px-4 py-3 text-[14px] leading-5 text-ink">
          <p className="font-semibold text-plum">Start with a {PRICING.yearly.trialDays}-day free trial</p>
          <p className="mt-0.5 text-muted">$0 due today, and {PRICING.yearly.trialCredits} credits to try it. After {PRICING.yearly.trialDays} days the yearly price is charged and your {num(PRICING.yearly.credits)} credits arrive. Cancel before then and you pay nothing.</p>
        </div>
      )}

      <Bullets items={[
        yearly ? `${num(credits)} credits per year` : `${num(credits)} credits every month`,
        `${money(yearly ? perCredit.yearly : perCredit.monthly, 3)} per credit`,
        `About ${num(generationsFor(credits))} AI results ${yearly ? "per year" : "each month"}`,
        "Access to every tool",

        "Priority access to new tools",
        "Results saved to My creations (latest 100)",
        "Cancel anytime",
      ]} />

      <CheckoutButton planId={yearly ? "annual" : "pro_monthly"} className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-plum px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60">
        {yearly ? `Start ${PRICING.yearly.trialDays}-day free trial` : `Subscribe for ${money(PRICING.monthly.price)} / month`}<ArrowRight size={17} aria-hidden="true" />
      </CheckoutButton>
      <p className="mt-3 text-center text-xs text-muted">{yearly ? "Then billed yearly. No payment today." : "Secure checkout. Renews monthly until cancelled."}</p>
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
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-muted">Use it as you need it</p>
      <h2 id="plan-payg" className="mt-3 text-[27px] font-extrabold tracking-[-0.04em] text-ink">{titleCase("Pay as you go and buy credits once.")}</h2>
      <p className="mt-1 text-sm text-muted">Buy credits once and use them whenever you like.</p>
      <p className="mt-6 flex items-baseline gap-2"><span className="text-5xl font-extrabold tracking-[-0.06em] text-ink">{money(amount)}</span><span className="text-sm text-muted">one time</span></p>

      <label className="mt-5 block">
        <span className="sr-only">Amount to spend</span>
        <input type="range" min={min} max={max} step={step} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="price-slider w-full" style={{ ["--fill" as string]: `${pct}%` }} aria-valuetext={`${money(amount)} for ${credits} credits`} />
        <span className="mt-1 flex justify-between text-xs text-muted"><span>{money(min)}</span><span>{money(max)}</span></span>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRICING.payg.quick.map((q) => (
          <button key={q} type="button" onClick={() => setAmount(q)} aria-pressed={amount === q} className={`h-10 min-w-14 rounded-full border px-3.5 text-[14px] font-semibold transition-colors ${amount === q ? "border-plum bg-plum text-white" : "border-line text-ink hover:bg-blush"}`}>{money(q)}</button>
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
