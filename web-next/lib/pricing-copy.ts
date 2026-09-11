import { TOOLS } from "./tools";

// Ported verbatim from the live pricing page
// (website/generated/pricing/index.html) and lib/utils/vg_copy.dart.
export const PRICING_COPY = {
  heroTitle: "Choose the Right Plan",
  heroSubtitle:
    "Unlock all AI Beauty analyses with a flexible subscription that fits your needs. Every subscription includes full access to all AI beauty tools, ad-free results, and downloadable reports. Credits are used whenever you generate a new AI analysis.",
  sharedFeatures: [
    "Full access to all 10 AI Beauty Analyses",
    "Ad-free experience",
    "Instant result downloads",
    "Priority access to new AI features",
    "Secure cloud synchronization across devices",
  ],
  plans: {
    annual: {
      planId: "annual" as const,
      name: "Yearly Plan",
      price: "$39.99",
      period: "/year",
      wasPrice: "$80.99/year",
      subtitle: "Billed once per year · Cancel anytime",
      badge: "Best Value",
      features: [
        "200 AI Credits per year",
        "Each AI generation costs 5 credits",
        "Up to 40 AI generations per year",
        "Credits remain available throughout your annual subscription",
      ],
      creditBreakdown: ["200 credits per year", "5 credits per generation", "Up to 40 generations per year", "About $1.00 per generation"],
      creditsIncluded: "200/year",
      costPerGeneration: "About $1.00",
      creditRenewal: "Annual",
    },
    pro_weekly: {
      planId: "pro_weekly" as const,
      name: "Pro Plan",
      price: "$3.99",
      period: "/week",
      wasPrice: null,
      subtitle: "Billed weekly · Cancel anytime",
      badge: null,
      features: [
        "30 AI Credits every week",
        "Credits automatically refresh every billing cycle",
        "Each AI generation costs 5 credits",
        "Up to 6 AI generations every week",
      ],
      creditBreakdown: ["30 credits every week", "5 credits per generation", "Up to 6 generations every week", "About $0.67 per generation"],
      creditsIncluded: "30/week",
      costPerGeneration: "About $0.67",
      creditRenewal: "Weekly",
    },
  },
  terms: [
    "Subscription Terms: Yearly plan is $39.99 per year and renews automatically unless cancelled. Pro plan is $3.99 per week and renews automatically unless cancelled. Credits renew each billing period.",
    "Cancellation Terms: Cancel anytime in account settings to stop future renewals. Access and remaining credits continue until the end of your current billing period.",
  ],
  faq: [
    {
      question: "What plans do you offer?",
      answer:
        "Verified Glam - Beauty Scanner Pro is available as a Yearly plan ($39.99/year, 200 credits) or a Pro weekly plan ($3.99/week, 30 credits refreshed weekly).",
    },
    {
      question: "How do credits work?",
      answer:
        "Each new AI analysis costs 5 credits. Yearly subscribers get 200 credits per year (up to 40 generations). Pro Weekly subscribers get 30 credits per week (up to 6 generations).",
    },
    {
      question: "What is the Yearly plan?",
      answer: "Pay $39.99 once per year for full Pro access, 200 AI credits, no ads, and every premium feature.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel in account settings anytime. Your access continues until the end of your current billing period.",
    },
  ],
};

export type PlanId = keyof typeof PRICING_COPY.plans;

export const COMPARE_ROWS = [...TOOLS.map((t) => t.title), "Ad-Free Experience", "Download Results"];

export const RESUME_CHECKOUT_KEY = "vg_resume_checkout";
