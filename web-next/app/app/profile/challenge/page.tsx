import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { ChallengePlan } from "@/lib/challenge-api";
import { ChallengeOverview } from "./ChallengeOverview";

export default async function ChallengePage() {
  const token = await getSessionToken();
  const { plan } = await apiClient.get<{ plan: ChallengePlan | null }>("/api/challenges/active", token);

  if (!plan) redirect("/app/beauty-routine-challenge");
  if (plan.progress.isCompleted) redirect("/app/profile/reward");

  return <ChallengeOverview plan={plan} />;
}
