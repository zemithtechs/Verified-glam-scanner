import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { Badge } from "@/lib/challenge-api";
import type { ChallengePlan } from "@/lib/challenge-api";
import { BadgeGrid } from "@/components/BadgeGrid";
import { CreditsPanel } from "@/components/CreditsPanel";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  const token = await getSessionToken();

  const [{ badges }, { plan }] = await Promise.all([
    apiClient.get<{ badges: Badge[] }>("/api/challenges/badges", token),
    apiClient.get<{ plan: ChallengePlan | null }>("/api/challenges/active", token),
  ]);

  return (
    <div className="max-w-(--max-content) mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-burgundy-dark)">Profile</h1>
        <p className="mt-1 text-(--color-text-muted)">{profile.email}</p>
      </div>

      {plan && !plan.progress.isCompleted && (
        <Link
          href="/app/profile/challenge"
          className="flex items-center gap-4 bg-white rounded-[20px] border border-(--color-border) p-5 hover:border-(--color-burgundy) transition-colors"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #872B3F 0%, #C79A9A 100%)" }}
          >
            <Sparkles className="text-white" size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-(--color-text) truncate">{plan.title}</p>
            <p className="text-sm text-(--color-text-muted)">
              Day {plan.progress.currentDay} of {plan.durationDays} &middot; {plan.progress.streakCount} day streak
            </p>
          </div>
          <ChevronRight className="text-(--color-text-muted) shrink-0" size={20} />
        </Link>
      )}

      <div className="bg-white rounded-[20px] border border-(--color-border) p-6">
        <h2 className="font-bold text-(--color-burgundy-dark) mb-4">Badges</h2>
        <BadgeGrid badges={badges} collapsible />
      </div>

      <CreditsPanel profile={profile} />

      <div className="rounded-[20px] border border-red-200 bg-white p-6">
        <h2 className="font-bold text-red-800">Account deletion</h2>
        <p className="mt-2 text-sm text-(--color-text-muted)">Permanently remove your account, stored photos, and analysis history.</p>
        <Link href="/delete-account" className="mt-4 inline-flex font-semibold text-red-700 hover:underline">
          Delete account
        </Link>
      </div>
    </div>
  );
}
