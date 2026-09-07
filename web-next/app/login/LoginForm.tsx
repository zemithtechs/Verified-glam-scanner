"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, friendlyAuthError } from "@/lib/client-api";

const inputClass =
  "w-full rounded-xl border border-(--color-border) bg-white px-4 py-3 text-(--color-text) outline-none focus:border-(--color-burgundy) transition-colors";

export function LoginForm({ redirectPath }: { redirectPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.signIn(email.trim(), password);
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-(--color-text) mb-1.5">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-(--color-text)">Password</label>
          <Link href="/forgot-password" className="text-sm text-(--color-burgundy) font-medium">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-(--color-burgundy) text-white font-semibold py-3.5 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-(--color-text-muted)">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-(--color-burgundy) font-semibold">
          Sign up
        </Link>
      </p>
    </form>
  );
}
