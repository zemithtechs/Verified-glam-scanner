import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { PricingPlans } from "@/components/PricingPlans";
import { PlanCompare } from "@/components/PlanCompare";
import { Container } from "@/components/ui";
import { PRICING, generationsFor, money, num, yearOfMonthly, yearlySavingsPercent } from "@/lib/pricing";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, pricingSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo-meta";
import { titleCase } from "@/lib/title-case";

export const metadata: Metadata = buildMetadata({
  title: "Pricing: Free, Pro and Pay As You Go",
  description: `Start free with ${PRICING.starter.credits} credits. Pro is ${money(PRICING.monthly.price)} a month or yearly with a ${PRICING.yearly.trialDays}-day trial, or buy credits once. Compare plans.`,
  path: "/pricing",
});

const FAQ: [string, string][] = [
  ["What is a credit?", `A credit is what you spend to make a result. One AI result costs ${PRICING.creditsPerGeneration} credits, so ${PRICING.starter.credits} free credits cover ${generationsFor(PRICING.starter.credits)} results and ${num(PRICING.monthly.credits)} monthly credits cover ${generationsFor(PRICING.monthly.credits)}. You see how many credits a purchase gives you before you pay.`],
  ["How does the yearly free trial work?", `You start the yearly plan with ${PRICING.yearly.trialDays} days free and pay $0 today. You get ${PRICING.yearly.trialCredits} credits to try, which is ${generationsFor(PRICING.yearly.trialCredits)} results. After ${PRICING.yearly.trialDays} days the yearly price shown on the plan card is charged for the year. If you cancel before the trial ends, you are not charged.`],
  ["Can I cancel anytime?", "Yes. Cancel from your account settings to stop future renewals. You keep access until the end of the period you have paid for."],
  ["Do credits expire?", "Credits bought with pay as you go never expire. Monthly credits refresh each month, and yearly credits last for your whole year."],
  ["Is pay as you go a subscription?", "No. It is a single payment for the credits you choose. Nothing renews and nothing is charged again."],
  ["How do I pay?", "Checkout is handled securely by our payment provider, Polar. We never see or store your card details."],
  ["Is this medical or professional advice?", "No. Results are styling ideas and entertainment, not medical or professional advice. Tools are for adults aged 18 and older."],
];

export default function PricingPage() {
  return <MarketingShell>
    <JsonLd data={pricingSchema()} />
    <JsonLd data={faqSchema(FAQ)} />
    <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
    <section className="border-b border-line bg-cream">
      <Container className="pb-10 pt-12 sm:pb-12 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-plum">Pricing</p>
          <h1 className="mt-3 font-sans text-[38px] font-extrabold leading-[1.06] tracking-[-0.055em] text-ink sm:text-[58px]">{titleCase("Start free and pay only when you want more results.")}</h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-muted sm:text-lg">A new account starts with {PRICING.starter.credits} free credits, enough for {generationsFor(PRICING.starter.credits)} results. Choose Pro if you create often, or buy credits once when you need them. One result uses {PRICING.creditsPerGeneration} credits, and you see your balance before you create.</p>
        </div>
        <div className="relative mt-10 grid overflow-hidden rounded-[26px] bg-plum text-white shadow-[0_20px_54px_rgba(109,26,70,0.16)] md:grid-cols-[1fr_280px]">
          <div className="relative z-10 p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Yearly Pro plan</p>
            <h2 className="mt-3 max-w-xl text-[28px] font-extrabold leading-[1.1] tracking-[-0.045em] sm:text-[38px]">{titleCase(`Yearly Pro gives you ${num(PRICING.yearly.credits)} credits for a full year.`)}</h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/80">That covers about {num(generationsFor(PRICING.yearly.credits))} results, and the plan card shows the yearly price next to the monthly one. Start with a {PRICING.yearly.trialDays}-day free trial and pay nothing if you cancel before it ends.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-semibold"><span className="rounded-full border border-white/25 px-3 py-1.5">{num(PRICING.yearly.credits)} yearly credits</span><span className="rounded-full border border-white/25 px-3 py-1.5">All tools</span><span className="rounded-full border border-white/25 px-3 py-1.5">{PRICING.creditsPerGeneration} credits per result</span></div>
          </div>
          <div className="relative flex flex-col justify-center border-t border-white/15 bg-white/10 px-8 py-7 md:border-l md:border-t-0"><span className="text-[72px] font-extrabold leading-none tracking-[-0.075em] sm:text-[80px]">{yearlySavingsPercent}%</span><span className="mt-1 text-[14px] font-semibold text-white/90">less than paying monthly</span><Link href="#plans" className="mt-5 inline-flex w-fit items-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-plum transition hover:bg-blush">See Pro yearly <span aria-hidden="true" className="ml-2">↗</span></Link></div>
        </div>
      </Container>
    </section>

    <Container className="scroll-mt-24 py-12 sm:py-16">
      <div id="plans" className="mb-8 scroll-mt-24 text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-plum">Choose your plan</p><h2 className="mt-2 text-[30px] font-extrabold tracking-[-0.045em] text-ink sm:text-[38px]">{titleCase("Pick the plan that matches how often you create.")}</h2></div>
      <PricingPlans />
      <p className="mt-6 text-center text-xs leading-5 text-muted">Prices in USD. Checkout is handled by Polar.</p>
    </Container>

    <Container className="pb-6"><section id="compare" className="scroll-mt-24">
      <div className="mx-auto mb-8 max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-plum">Plan details</p><h2 className="mt-2 text-[30px] font-extrabold tracking-[-0.045em] text-ink sm:text-[38px]">{titleCase("See exactly what each plan includes before you pay.")}</h2><p className="mt-3 text-[16px] leading-7 text-muted">The table lists credits, tool access and billing terms for Starter, Pro and Pay as you go. Every plan opens every tool, and the only differences are how many credits you get, how often they arrive and how you pay for them.</p></div>
      <PlanCompare />
    </section></Container>

    <Container className="mb-20 mt-16 max-w-3xl">
      <div className="mb-7 text-center"><h2 className="text-[30px] font-extrabold tracking-[-0.045em] text-ink sm:text-[38px]">{titleCase("Check these answers to common questions before you pay.")}</h2><p className="mt-2 text-muted">These short answers cover credits, the free trial, cancelling and how your payment is handled. If your question is not here, email us and we will answer it.</p></div>
      <div className="space-y-3">{FAQ.map(([q, a]) => <details key={q} className="group rounded-xl border border-line bg-white p-5 [&_summary::-webkit-details-marker]:hidden sm:px-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold tracking-[-0.025em]"><span>{q}</span><span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush text-plum transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-2xl leading-7 text-muted">{a}</p></details>)}</div>
      <p className="mt-8 text-center text-sm text-muted">Ready to see your first result? <Link href="/register" className="font-semibold text-plum underline underline-offset-4">Create a free account</Link>.</p>
    </Container>
  </MarketingShell>;
}
