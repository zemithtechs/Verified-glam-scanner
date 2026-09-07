"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2 } from "lucide-react";
import { proxyApi } from "@/lib/client-api";
import type { Profile, CreditTransaction } from "@/lib/types";

export function CreditsPanel({ profile }: { profile: Profile }) {
  const [filter, setFilter] = useState<"all" | "earned" | "used">("all");
  const [transactions, setTransactions] = useState<CreditTransaction[] | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setTransactions(null);
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
    try {
      const { portalUrl } = await proxyApi.post<{ portalUrl: string }>("/polar/portal");
      window.open(portalUrl, "_blank");
    } catch {
      // No active subscription yet, or portal unavailable — silently no-op;
      // the "Upgrade to Pro" path (Phase 4) is where a free user would go instead.
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
        <button
          onClick={handleManageBilling}
          disabled={portalLoading}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--color-border) text-(--color-text) font-semibold px-5 py-2.5 hover:bg-(--color-surface) disabled:opacity-60"
        >
          {portalLoading ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
          Manage billing
        </button>
      ) : (
        <Link
          href="/pricing"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--color-burgundy) text-white font-semibold px-5 py-2.5 hover:opacity-90"
        >
          <CreditCard size={16} />
          Upgrade to Pro
        </Link>
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
          <div className="divide-y divide-(--color-border)">
            {transactions.map((tx) => (
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
        )}
      </div>
    </div>
  );
}
