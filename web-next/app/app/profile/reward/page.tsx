import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { Badge, RewardCard } from "@/lib/challenge-api";
import { RewardView } from "./RewardView";

export default async function RewardPage() {
  const token = await getSessionToken();
  const [{ rewardCard }, { badges }] = await Promise.all([
    apiClient.get<{ rewardCard: RewardCard | null }>("/api/challenges/reward-card/latest", token),
    apiClient.get<{ badges: Badge[] }>("/api/challenges/badges", token),
  ]);

  return <RewardView rewardCard={rewardCard} badges={badges} />;
}
