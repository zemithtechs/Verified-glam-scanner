"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { proxyApi, ClientApiError } from "@/lib/client-api";
import type { Profile, CreditTransaction } from "@/lib/types";
import { UpgradeModal } from "./UpgradeModal";

const PAGE_SIZE = 3;

export function CreditsPanel({ profile }: { profile: Profile }) {
  const [filter, setFilter] = useState<"all" | "earned" | "used">("all");
  const [transactions, setTransactions] = useState<CreditTransaction[] | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setTransactions(null);
    setVisibleCount(PAGE_SIZE);
    const query =
      filter === "earned" ? "earnedOnly=true" : filter === "used" ? "usedOnly=true" : "";
    proxyApi
      .get<{ transactions: CreditTransaction[] }>(`/profiles/credit-transactions${query ? `?${query}` : ""}`)
      .then((res) => {
        if (!cancelled) setTransactions(res.transactions);
      })
      .catch(() => {
        if (!cancelled) setTransactions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  async function handleManageBilling() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const { portalUrl } = await proxyApi.post<{ portalUrl: string }>("/polar/portal");
      window.open(portalUrl, "_blank");
    } catch (caught) {
      // Surface why nothing happened instead of a silent no-op — a real
      // subscriber with no configured billing portal, or (in local dev)
      // POLAR_ACCESS_TOKEN simply not being set, both need to be visible
      // rather than looking like the button is broken.
      setPortalError(caught instanceof ClientApiError ? caught.message : "Couldn't open the billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-[20px] border border-(--color-border) p-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-(--color-text-muted)">Plan</p>
          <p className="text-lg font-bold text-(--color-burgundy-dark)">{profile.is_pro ? "Pro" : "Free"}</p>
        </div>
        <div>
          <p className="text-sm text-(--color-text-muted)">Credits</p>
          <p className="text-lg font-bold text-(--color-burgundy-dark)">
            {profile.credits_balance} / {profile.credits_allocated}
          </p>
        </div>
        <div>
          <p className="text-sm text-(--color-text-muted)">Analyses left</p>
          <p className="text-lg font-bold text-(--color-burgundy-dark)">{Math.floor(profile.credits_balance / 5)}</p>
        </div>
      </div>

      {profile.is_pro ? (
        <div className="mt-5">
          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="inline-flex items-center gap-2 rounded-full border border-(--color-border) text-(--color-text) font-semibold px-5 py-2.5 hover:bg-(--color-surface) disabled:opacity-60"
          >
            {portalLoading ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
            Manage billing
          </button>
          {portalError && <p className="mt-2 text-sm text-red-600">{portalError}</p>}
        </div>
      ) : (
        <button onClick={() => setUpgradeOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-(--color-burgundy) text-white font-semibold px-5 py-2.5 hover:opacity-90">
          <CreditCard size={16} />
          Upgrade to Pro
        </button>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-(--color-burgundy-dark)">Transaction history</h3>
          <div className="flex gap-1 text-sm">
            {(["all", "earned", "used"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full capitalize ${
                  filter === f ? "bg-(--color-burgundy) text-white" : "text-(--color-text-muted) hover:bg-(--color-surface)"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {transactions === null ? (
          <p className="text-sm text-(--color-text-muted)">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-(--color-text-muted)">No transactions yet.</p>
        ) : (
          <>
            <div className="divide-y divide-(--color-border)">
              {transactions.slice(0, visibleCount).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="text-(--color-text)">{tx.description}</p>
                    <p className="text-xs text-(--color-text-muted)">{new Date(tx.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-(--color-text)"}`}>
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
            {transactions.length > visibleCount && (
              <button
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="mt-3 text-sm font-semibold text-(--color-burgundy) hover:underline"
              >
                Show more
              </button>
            )}
          </>
        )}
      </div>
      <UpgradeModal profile={profile} open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
