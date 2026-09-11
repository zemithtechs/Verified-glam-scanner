"use client";

import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { ClientApiError, proxyApi } from "@/lib/client-api";
import { PRICING_COPY, type PlanId } from "@/lib/pricing-copy";
import type { Profile } from "@/lib/types";

export function UpgradeModal({ profile, open, onClose }: { profile: Profile; open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<PlanId>("annual");
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function startCheckout(planId: PlanId) {
    setLoading(planId);
    setError(null);
    try {
      const { checkoutUrl } = await proxyApi.post<{ checkoutUrl: string }>("/polar/checkout", { planId });
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } catch (caught) {
      setError(caught instanceof ClientApiError ? caught.message : "Could not start secure checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  const plans = Object.values(PRICING_COPY.plans);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#251217]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
      <button aria-label="Close upgrade options" className="absolute inset-0" onClick={onClose} />
      <section className="relative max-h-[92vh] w-full max-w-[900px] overflow-y-auto rounded-t-[28px] bg-[#fffdfd] shadow-[0_28px_80px_rgba(53,16,25,0.3)] sm:rounded-[28px]">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-(--color-border) bg-[#fffdfd]/95 px-5 py-5 backdrop-blur sm:px-7">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.13em] text-(--color-burgundy)"><Sparkles size={14} /> Verified Glam Pro</span>
            <h2 id="upgrade-title" className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-(--color-burgundy-dark)">Continue with the full experience</h2>
            <p className="mt-1 text-sm text-(--color-text-muted)">More credits, every analysis, no ads, and one secure account across your devices.</p>
          </div>
          <button onClick={onClose} className="ml-4 rounded-xl p-2 text-(--color-text-muted) transition hover:bg-(--color-surface) hover:text-(--color-burgundy-dark)" aria-label="Close"><X size={20} /></button>
        </div>

        <div className="p-5 sm:p-7">
          {profile.is_pro ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">Your account already has Pro access. Your current plan remains active.</div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {plans.map((plan) => {
                  const active = selected === plan.planId;
                  return <button key={plan.planId} onClick={() => setSelected(plan.planId)} className={`relative rounded-[20px] border p-5 text-left transition ${active ? "border-(--color-burgundy) bg-(--color-blush)/35 shadow-[0_10px_28px_rgba(82,13,28,0.1)]" : "border-(--color-border) bg-white hover:border-(--color-burgundy)/45"}`}>
                    {plan.badge && <span className="absolute -top-2.5 left-5 rounded-full bg-(--color-burgundy) px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">Best value</span>}
                    <div className="flex items-start justify-between gap-3"><div><p className="font-extrabold text-(--color-burgundy-dark)">{plan.name}</p><p className="mt-1 text-sm text-(--color-text-muted)">{plan.creditsIncluded} credits</p></div><span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? "border-(--color-burgundy) bg-(--color-burgundy)" : "border-(--color-border)"}`}>{active && <Check size={12} className="text-white" />}</span></div>
                    <p className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-(--color-burgundy-dark)">{plan.price}<span className="ml-1 text-sm font-semibold text-(--color-text-muted)">{plan.period}</span></p>
                    <p className="mt-2 text-xs leading-relaxed text-(--color-text-muted)">{plan.features[0]} &middot; {plan.features[2]}</p>
                  </button>;
                })}
              </div>

              <div className="mt-6 rounded-[18px] bg-(--color-surface) p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
                <ul className="grid gap-2 text-sm text-(--color-text-muted) sm:grid-cols-2">
                  {PRICING_COPY.sharedFeatures.slice(0, 4).map((feature) => <li key={feature} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-(--color-burgundy)" />{feature}</li>)}
                </ul>
              </div>
              {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-bold text-(--color-text-muted) hover:bg-(--color-surface)">Maybe later</button>
                <button onClick={() => startCheckout(selected)} disabled={loading !== null} className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-burgundy) px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-(--color-burgundy-dark) disabled:opacity-60">{loading === selected && <Loader2 size={17} className="animate-spin" />}{loading === selected ? "Opening secure checkout..." : `Choose ${PRICING_COPY.plans[selected].name}`}</button>
              </div>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-(--color-text-muted)">Checkout opens securely in a new tab. You can return here at any time, and you can cancel future renewals in your account.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
