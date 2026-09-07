"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { proxyApi, ClientApiError } from "@/lib/client-api";
import { isDayLocked, remainingToUnlock, formatDuration, type ChallengePlan } from "@/lib/challenge-api";
import type { ChallengeDay } from "@/lib/challenge-templates";

export function ChallengeDayView({ plan, day }: { plan: ChallengePlan; day: ChallengeDay }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCurrentDay = day.dayNumber === plan.progress.currentDay;
  const alreadyDone = day.dayNumber < plan.progress.currentDay;
  const locked = isCurrentDay && isDayLocked(plan);
  const remaining = locked ? remainingToUnlock(plan) : null;

  async function handleMarkDone() {
    setSubmitting(true);
    setError(null);
    try {
      await proxyApi.post(`/challenges/${plan.challengeId}/days/${day.dayNumber}/complete`);
      router.push("/app/profile/challenge");
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-(--max-content) mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/app/profile/challenge" className="inline-flex items-center gap-1.5 text-sm text-(--color-text-muted) mb-4">
        <ArrowLeft size={16} /> Back to challenge
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-burgundy-dark)">
        Day {day.dayNumber}: {day.title}
      </h1>

      <div className="mt-6 grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-(--color-border) p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--color-burgundy)">Main task</p>
            <p className="mt-1.5 text-(--color-text)">{day.mainTask}</p>
          </div>
          <div className="bg-white rounded-2xl border border-(--color-border) p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--color-burgundy)">Support task</p>
            <p className="mt-1.5 text-(--color-text)">{day.supportTask}</p>
          </div>
          <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">Why this helps</p>
            <p className="mt-1.5 text-(--color-text-muted)">{day.whyLine}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-(--color-border) p-5 flex items-center gap-2 text-sm text-(--color-text-muted)">
            <Clock size={16} /> About {day.estMinutes} min today
          </div>

          {alreadyDone ? (
            <div className="flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
              <CheckCircle2 size={18} /> Completed
            </div>
          ) : locked ? (
            <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 py-3 text-sm text-(--color-text-muted)">
              Unlocks in {remaining ? formatDuration(remaining) : "a moment"}
            </div>
          ) : (
            <>
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
              )}
              <button
                onClick={handleMarkDone}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-(--color-burgundy) text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting && <Loader2 className="animate-spin" size={18} />}
                {submitting ? "Saving…" : "Mark day complete"}
              </button>
            </>
          )}

          {plan.disclaimer && <p className="text-xs text-(--color-text-muted)">{plan.disclaimer}</p>}
        </div>
      </div>
    </div>
  );
}
