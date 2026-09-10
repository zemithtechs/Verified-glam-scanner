"use client";

import { useState } from "react";
import Link from "next/link";

export function DeleteAccountPanel({ isSignedIn }: { isSignedIn: boolean }) {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  async function deleteAccount() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error ?? "Account deletion failed. Please try again.");
      setDeleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Account deletion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (deleted) {
    return (
      <div className="rounded-[20px] border border-green-200 bg-green-50 p-6">
        <h2 className="text-xl font-bold text-green-900">Your account was deleted</h2>
        <p className="mt-2 text-green-800">Your profile, scan history, stored photos, and sign-in access were permanently removed.</p>
        <Link href="/" className="mt-5 inline-flex rounded-full bg-(--color-burgundy) px-5 py-3 font-semibold text-white">
          Return to Verified Glam
        </Link>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-[20px] border border-(--color-border) bg-white p-6">
        <h2 className="text-xl font-bold text-(--color-burgundy-dark)">Delete online</h2>
        <p className="mt-2 text-(--color-text-muted)">Sign in to verify ownership and permanently delete your account.</p>
        <Link
          href="/login?redirect=%2Fdelete-account"
          className="mt-5 inline-flex rounded-full bg-(--color-burgundy) px-5 py-3 font-semibold text-white"
        >
          Sign in to delete account
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-red-200 bg-white p-6">
      <h2 className="text-xl font-bold text-red-800">Permanently delete this account</h2>
      <p className="mt-2 text-(--color-text-muted)">
        This removes your profile, scan photos, analysis history, challenges, and sign-in access. It does not cancel an active subscription; manage that first.
      </p>
      <label className="mt-5 block text-sm font-semibold text-(--color-text)" htmlFor="delete-confirmation">
        Type DELETE to confirm
      </label>
      <input
        id="delete-confirmation"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        autoComplete="off"
        className="mt-2 w-full rounded-xl border border-(--color-border) px-4 py-3 outline-none focus:border-red-500"
      />
      {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      <button
        type="button"
        disabled={confirmation !== "DELETE" || loading}
        onClick={deleteAccount}
        className="mt-5 rounded-full bg-red-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Deleting…" : "Delete account permanently"}
      </button>
    </div>
  );
}
