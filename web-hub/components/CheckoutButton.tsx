"use client";

import { useState } from "react";
import { ClientApiError, startCheckout } from "@/lib/client-api";

/** Starts a Polar checkout. Logged-out visitors are sent to create an account first, then brought back here. */
export function CheckoutButton({ planId, amount, className, children }: { planId: "annual" | "pro_monthly" | "payg"; amount?: number; className: string; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setBusy(true); setError(null);
    try {
      window.location.href = await startCheckout(planId, amount);
    } catch (e) {
      if (e instanceof ClientApiError && e.status === 401) { window.location.href = "/register?redirect=/pricing"; return; }
      setError(e instanceof Error ? e.message : "Checkout is not available right now. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" onClick={go} disabled={busy} className={className}>{busy ? "Opening checkout…" : children}</button>
      {error && <p role="alert" className="mt-3 text-center text-sm text-red-700">{error}</p>}
    </>
  );
}
