"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { proxyApi, ClientApiError } from "@/lib/client-api";
import { PRICING_COPY, COMPARE_ROWS, RESUME_CHECKOUT_KEY, type PlanId } from "@/lib/pricing-copy";

export function PricingView({ isSignedIn, isPro }: { isSignedIn: boolean; isPro: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<PlanId>("annual");
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const cancelled = searchParams.get("checkout") === "cancelled";
  const autoResumed = useRef(false);

  async function startCheckout(planId: PlanId) {
    setLoadingPlan(planId);
    setError(null);
    try {
      const { checkoutUrl } = await proxyApi.post<{ checkoutUrl: string }>("/polar/checkout", { planId });
      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Could not start checkout. Please try again.");
      setLoadingPlan(null);
    }
  }

  function handleSubscribe(planId: PlanId) {
    if (!isSignedIn) {
      try {
        sessionStorage.setItem(RESUME_CHECKOUT_KEY, planId);
      } catch {
        // ignore — the ?plan= query param on the redirect back still lets auto-resume work
      }
      router.push(`/login?redirect=${encodeURIComponent(`/pricing?plan=${planId}`)}`);
      return;
    }
    startCheckout(planId);
  }

  useEffect(() => {
    if (autoResumed.current || !isSignedIn) return;
    const fromQuery = searchParams.get("plan");
    let fromStorage: string | null = null;
    try {
      fromStorage = sessionStorage.getItem(RESUME_CHECKOUT_KEY);
    } catch {
      // ignore
    }
    const planId = (fromQuery ?? fromStorage) as PlanId | null;
    if (planId && planId in PRICING_COPY.plans) {
      autoResumed.current = true;
      try {
        sessionStorage.removeItem(RESUME_CHECKOUT_KEY);
      } catch {
        // ignore
      }
      startCheckout(planId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  async function handleManageBilling() {
    setLoadingPlan(selected);
    try {
      const { portalUrl } = await proxyApi.post<{ portalUrl: string }>("/polar/portal");
      window.open(portalUrl, "_blank");
    } catch {
      // no-op — matches CreditsPanel's handling
    } finally {
      setLoadingPlan(null);
    }
  }

  const plans = Object.values(PRICING_COPY.plans);

  return (
    <div className="bg-[#fbf7f7]">
      <section className="bg-white px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="max-w-(--max-content) mx-auto">
          <span className="inline-flex rounded-full bg-(--color-surface) px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.13em] text-(--color-burgundy)">Plans and credits</span>
          <h1 className="mt-4 text-[34px] sm:text-[48px] font-extrabold text-(--color-burgundy-dark) tracking-[-0.045em]">
            {PRICING_COPY.heroTitle}
          </h1>
          <p className="mt-4 text-(--color-text-muted) max-w-2xl mx-auto leading-relaxed">{PRICING_COPY.heroSubtitle}</p>
        </div>
      </section>

      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-12">
        {cancelled && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 text-center">
            Checkout was cancelled — no charge was made.
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-center">{error}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {plans.map((plan) => {
            const isSelected = selected === plan.planId;
            return (
              <div
                key={plan.planId}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => setSelected(plan.planId)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(plan.planId)}
                className={`relative rounded-[22px] p-6 bg-white border cursor-pointer transition-all ${
                  isSelected ? "border-2 border-(--color-burgundy) shadow-[0_18px_42px_rgba(82,13,28,0.12)]" : "border-(--color-border) hover:border-(--color-burgundy)/45 hover:shadow-[0_12px_30px_rgba(82,13,28,0.07)]"
                }`}
              >
                {plan.badge && <span className="absolute -top-3 left-6 rounded-full bg-(--color-burgundy) px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm">Recommended</span>}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                      isSelected ? "border-(--color-burgundy) bg-(--color-burgundy)" : "border-gray-400"
                    }`}
                  />
                </div>
                <h3 className="text-base font-bold text-(--color-burgundy-dark)">{plan.name}</h3>
                <div className="mt-1">
                  <span className="text-3xl font-extrabold text-(--color-burgundy-dark)">{plan.price}</span>
                  <span className="text-sm text-(--color-text-muted)">{plan.period}</span>
                </div>
                {plan.wasPrice && <p className="text-xs text-(--color-text-muted) line-through mt-1">{plan.wasPrice}</p>}
                <p className="text-xs text-(--color-text-muted) mt-2">{plan.subtitle}</p>

                <p className="text-sm font-bold text-(--color-burgundy-dark) mt-4 mb-2">What&apos;s Included</p>
                <ul className="space-y-1.5">
                  {[...plan.features, ...PRICING_COPY.sharedFeatures].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-(--color-text)">
                      <Check size={14} className="text-(--color-burgundy) shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-bold text-(--color-burgundy-dark) mt-5 mb-2">Credit Breakdown</p>
                <ul className="space-y-1.5">
                  {plan.creditBreakdown.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-(--color-text-muted)">
                      <Check size={14} className="text-(--color-text-muted) shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(plan.planId);
                    }}
                    disabled={loadingPlan !== null || isPro}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[13px] bg-(--color-burgundy) text-white font-extrabold py-3.5 hover:bg-(--color-burgundy-dark) transition-colors disabled:opacity-50"
                  >
                    {loadingPlan === plan.planId && <Loader2 className="animate-spin" size={16} />}
                    {isPro ? "Current plan" : loadingPlan === plan.planId ? "Redirecting…" : "Subscribe now"}
                  </button>
                  <p className="text-[11px] text-(--color-text-muted) mt-2">Secure checkout. Cancel before your next renewal.</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compare table */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-(--color-burgundy-dark)">Compare Plans</h2>
          <p className="text-sm text-(--color-text-muted) mb-4">Everything included with Yearly and Pro subscriptions.</p>
          <div className="rounded-xl border border-(--color-border) overflow-hidden text-sm">
            <div className="grid grid-cols-[3fr_1fr_1fr] bg-(--color-blush) px-4 py-3 font-bold">
              <span>Feature</span>
              <span className="text-center rounded bg-(--color-burgundy)/10 text-(--color-burgundy) py-0.5">Yearly</span>
              <span className="text-center rounded bg-(--color-burgundy)/10 text-(--color-burgundy) py-0.5">Pro Weekly</span>
            </div>
            {COMPARE_ROWS.map((row) => (
              <div key={row} className="grid grid-cols-[3fr_1fr_1fr] px-4 py-2.5 border-t border-(--color-border)">
                <span>{row}</span>
                <span className="text-center text-(--color-burgundy) font-bold">✓</span>
                <span className="text-center text-(--color-burgundy) font-bold">✓</span>
              </div>
            ))}
            <div className="grid grid-cols-[3fr_1fr_1fr] px-4 py-2.5 border-t border-(--color-border)">
              <span>Credits Included</span>
              <span className="text-center text-(--color-burgundy) font-bold">{PRICING_COPY.plans.annual.creditsIncluded}</span>
              <span className="text-center text-(--color-burgundy) font-bold">{PRICING_COPY.plans.pro_weekly.creditsIncluded}</span>
            </div>
            <div className="grid grid-cols-[3fr_1fr_1fr] px-4 py-2.5 border-t border-(--color-border)">
              <span>Cost per Generation</span>
              <span className="text-center text-(--color-burgundy) font-bold">{PRICING_COPY.plans.annual.costPerGeneration}</span>
              <span className="text-center text-(--color-burgundy) font-bold">{PRICING_COPY.plans.pro_weekly.costPerGeneration}</span>
            </div>
            <div className="grid grid-cols-[3fr_1fr_1fr] px-4 py-2.5 border-t border-(--color-border)">
              <span>Credit Renewal</span>
              <span className="text-center text-(--color-burgundy) font-bold">{PRICING_COPY.plans.annual.creditRenewal}</span>
              <span className="text-center text-(--color-burgundy) font-bold">{PRICING_COPY.plans.pro_weekly.creditRenewal}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-[11px] text-(--color-text-muted) leading-relaxed space-y-1.5">
          {PRICING_COPY.terms.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p>
            See{" "}
            <Link href="/terms" className="text-(--color-burgundy) font-semibold">
              Terms
            </Link>{" "}
            &middot;{" "}
            <Link href="/privacy" className="text-(--color-burgundy) font-semibold">
              Privacy
            </Link>
          </p>
        </div>
      </div>

      {isPro ? (
        <section className="text-center py-8 px-4 max-w-md mx-auto">
          <p className="text-(--color-text-muted) mb-4">You have an active Pro subscription</p>
          <button
            onClick={handleManageBilling}
            disabled={loadingPlan !== null}
            className="rounded-full bg-white border border-(--color-border) font-semibold px-6 py-3 hover:bg-(--color-surface) disabled:opacity-60"
          >
            Manage subscription
          </button>
        </section>
      ) : (
        !isSignedIn && (
          <section className="text-center py-8 px-4" style={{ background: "#FDF8F8" }}>
            <Link href="/register" className="inline-block rounded-full bg-(--color-burgundy) text-white font-semibold px-8 py-3.5 hover:opacity-90">
              Sign up
            </Link>
            <p className="mt-3 text-sm text-(--color-text)">
              Already have an account?{" "}
              <Link href="/login" className="text-(--color-burgundy) font-semibold">
                Log in
              </Link>
            </p>
          </section>
        )
      )}

      <section className="py-14 px-4 sm:px-6 bg-(--color-surface)">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold text-(--color-burgundy-dark) text-center mb-8">Pricing FAQ</h2>
          <div className="divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-white">
            {PRICING_COPY.faq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.question}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-semibold text-(--color-text)">{item.question}</span>
                    <ChevronDown size={18} className={`text-(--color-text-muted) shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="px-5 pb-4 text-sm text-(--color-text-muted) leading-relaxed">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
