"use client";

import { useState } from "react";
import { FormMessage, inputClass, primaryBtn } from "@/components/AuthCard";
import { authApi, friendlyAuthError } from "@/lib/client-api";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try { await authApi.forgotPassword(email.trim()); setSent(true); }
    catch (err) { setError(friendlyAuthError(err)); }
    finally { setLoading(false); }
  }

  if (sent) return <FormMessage kind="success">If an account exists for {email}, a reset link is on its way. Check your inbox.</FormMessage>;
  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Email</span>
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></label>
      <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Sending…" : "Send reset link"}</button>
    </form>
  );
}
