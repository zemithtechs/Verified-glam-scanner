"use client";

import Link from "next/link";
import { useState } from "react";
import { FormMessage, inputClass } from "@/components/AuthCard";
import { accountApi, ClientApiError } from "@/lib/client-api";

export function DeleteAccountPanel({ signedIn, email }: { signedIn: boolean; email: string | null }) {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  async function remove() {
    setError(null); setLoading(true);
    try { await accountApi.remove(confirmation); setDeleted(true); }
    catch (e) { setError(e instanceof ClientApiError ? e.message : "Account deletion failed. Please try again."); }
    finally { setLoading(false); }
  }

  if (deleted) {
    return (
      <div className="mt-3">
        <FormMessage kind="success">Your account was deleted. Your profile, saved results, stored photos and sign-in access were permanently removed.</FormMessage>
        <Link href="/" className="mt-4 inline-block font-semibold text-plum underline underline-offset-4">Return to the home page</Link>
      </div>
    );
  }
  if (!signedIn) {
    return (
      <div className="mt-2">
        <p className="text-muted">Log in to your account to delete it. This confirms the request is really from you.</p>
        <Link href="/login?redirect=/delete-account" className="mt-4 inline-flex h-12 items-center rounded-xl bg-plum px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink">Log in to continue</Link>
      </div>
    );
  }
  return (
    <div className="mt-2 space-y-4">
      <p className="text-muted">You are signed in as <strong className="text-ink">{email}</strong>. Type <strong className="text-ink">DELETE</strong> to confirm.</p>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder="DELETE" aria-label="Type DELETE to confirm" className={inputClass} />
      <button type="button" onClick={remove} disabled={loading || confirmation !== "DELETE"} className="inline-flex h-12 items-center rounded-xl bg-red-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50">{loading ? "Deleting…" : "Permanently delete my account"}</button>
    </div>
  );
}
