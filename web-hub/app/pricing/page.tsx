import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { PricingPlans } from "@/components/PricingPlans";
import { PlanCompare } from "@/components/PlanCompare";
import { Container, SectionHead } from "@/components/ui";
import { PRICING, money } from "@/lib/pricing";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, pricingSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = buildMetadata({
  title: "Pricing: Free, Pro and Pay As You Go",
  description: `Start free with ${PRICING.starter.credits} credits. Pro is ${money(PRICING.monthly.price)} a month or ${money(PRICING.yearly.price)} a year with a ${PRICING.yearly.trialDays}-day trial, or buy credits once. Compare plans.`,
  path: "/pricing",
});

const FAQ: [string, string][] = [
  ["What is a credit?", `A credit pays for AI results. One AI result costs ${PRICING.creditsPerGeneration} credits. You can see exactly how many credits a purchase gives you before you pay.`],
  ["How does the yearly free trial work?", `You start the yearly plan with ${PRICING.yearly.trialDays} days free and pay $0 today. After ${PRICING.yearly.trialDays} days you are charged ${money(PRICING.yearly.price)} for the year. If you cancel before the trial ends, you are not charged.`],
  ["Can I cancel anytime?", "Yes. Cancel from your account settings to stop future renewals. You keep access until the end of the period you have paid for."],
  ["Do credits expire?", "Credits bought with pay as you go never expire. Monthly credits refresh each month, and yearly credits last for your whole year."],
  ["Is pay as you go a subscription?", "No. It is a single payment for the credits you choose. Nothing renews and nothing is charged again."],
  ["How do I pay?", "Checkout is handled securely by our payment provider, Polar. We never see or store your card details."],
  ["Is this medical or professional advice?", "No. Results are for entertainment and beauty self-discovery. Tools are for adults aged 18 and older."],
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <JsonLd data={pricingSchema()} />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
      <section className="hero-glow border-b border-line">
        <Container className="py-14 text-center sm:py-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Simple pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted">Start free. Go Pro when you want more tools and no ads, or just buy credits when you need them.</p>
          <p className="mt-5"><Link href="#compare" className="text-[15px] font-semibold text-plum underline-offset-4 hover:underline">Compare all plans ↓</Link></p>
        </Container>
      </section>

      <Container className="py-12 sm:py-14">
        <PricingPlans />
        <p className="mt-6 text-center text-xs text-muted">Prices in USD. Payments are processed securely by Polar.</p>
      </Container>

      <Container className="pb-6" >
        <section id="compare" className="scroll-mt-24">
          <SectionHead center eyebrow="Compare" title="Every plan, side by side" sub="See what is included before you choose." />
          <PlanCompare />
        </section>
      </Container>

      <Container className="mt-20 max-w-3xl">
        <SectionHead center title="Pricing questions, answered" />
        <div className="divide-y divide-line rounded-3xl border border-line bg-white">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[16px] font-semibold">{q}<span className="text-berry transition group-open:rotate-45" aria-hidden="true">+</span></summary>
              <p className="mt-3 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </MarketingShell>
  );
}
