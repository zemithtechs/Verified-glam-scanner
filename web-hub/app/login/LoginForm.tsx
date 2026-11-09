"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormMessage, inputClass, primaryBtn } from "@/components/AuthCard";
import { GooglePlaceholder } from "@/components/GooglePlaceholder";
import { authApi, friendlyAuthError } from "@/lib/client-api";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authApi.signIn(email.trim(), password);
      router.push(next); router.refresh();
    } catch (err) { setError(friendlyAuthError(err)); setLoading(false); }
  }

  return (
    <div>
    <GooglePlaceholder />
    <form onSubmit={submit} className="space-y-4">
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Email</span>
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></label>
      <label className="block">
        <span className="mb-1.5 flex items-center justify-between text-sm font-medium">Password <Link href="/forgot-password" className="font-semibold text-plum underline underline-offset-4">Forgot it?</Link></span>
        <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} /></label>
      <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Logging in…" : "Log in"}</button>
    </form>
    </div>
  );
}
