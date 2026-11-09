"use client";

import Link from "next/link";
import { useState } from "react";
import { openBillingPortal } from "@/lib/client-api";

export function AccountActions({ isPro }: { isPro: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function portal() {
    setBusy(true); setError(null);
    try { window.location.href = await openBillingPortal(); }
    catch (e) { setError(e instanceof Error ? e.message : "Billing is not available right now."); setBusy(false); }
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {isPro && <button type="button" onClick={portal} disabled={busy} className="rounded-full bg-gradient-to-r from-gold to-rose px-6 py-3 text-sm font-bold text-ink disabled:opacity-60">{busy ? "Opening…" : "Manage billing"}</button>}
      <Link href="/pricing" className={isPro ? "rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white" : "rounded-full bg-gradient-to-r from-gold to-rose px-6 py-3 text-sm font-bold text-ink"}>{isPro ? "See plans" : "See plans & credit packs"}</Link>
      {error && <p role="alert" className="w-full text-sm text-rose">{error}</p>}
    </div>
  );
}
