"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormMessage, inputClass, primaryBtn } from "@/components/AuthCard";
import { authApi, friendlyAuthError } from "@/lib/client-api";

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adult, setAdult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Choose a password with at least 8 characters."); return; }
    if (!adult) { setError("Please confirm that you are 18 or older and agree to the terms."); return; }
    setLoading(true);
    try {
      await authApi.signUp(email.trim(), password);
      router.push(next); router.refresh();
    } catch (err) { setError(friendlyAuthError(err)); setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Email</span>
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Password</span>
        <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="At least 8 characters" /></label>
      <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-muted">
        <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#6d1a46]" />
        <span>I am 18 or older and agree to the <Link href="/terms" className="font-semibold text-plum underline underline-offset-4">Terms</Link> and <Link href="/privacy" className="font-semibold text-plum underline underline-offset-4">Privacy Policy</Link>.</span>
      </label>
      <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Creating your account…" : "Create free account"}</button>
    </form>
  );
}
