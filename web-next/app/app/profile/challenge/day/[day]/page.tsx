import { redirect, notFound } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { ChallengePlan } from "@/lib/challenge-api";
import { ChallengeDayView } from "./ChallengeDayView";

export default async function ChallengeDayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const dayNumber = Number(day);
  if (!Number.isInteger(dayNumber) || dayNumber < 1) notFound();

  const token = await getSessionToken();
  const { plan } = await apiClient.get<{ plan: ChallengePlan | null }>("/api/challenges/active", token);
  if (!plan) redirect("/app/beauty-routine-challenge");

  // Only the current day (actionable) or a completed past day (viewable) are reachable.
  if (dayNumber > plan.progress.currentDay) redirect("/app/profile/challenge");

  const dayData = plan.days.find((d) => d.dayNumber === dayNumber);
  if (!dayData) notFound();

  return <ChallengeDayView plan={plan} day={dayData} />;
}
