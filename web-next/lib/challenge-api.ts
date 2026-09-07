import type { ChallengeDay } from "./challenge-templates";

// Matches worker-api's toPlanJson() response shape exactly
// (worker-api/src/routes/challenges.ts).
export type ChallengeProgress = {
  completedDays: number;
  currentDay: number;
  isCompleted: boolean;
  lastCompletedAt: string | null;
  nextUnlockAt: string | null;
  streakCount: number;
  bestStreak: number;
  notificationPrefTime: string | null;
};

export type ChallengePlan = {
  challengeId: string;
  userId: string;
  sourceScanId: string | null;
  issueTag: string;
  severity: string;
  durationDays: number;
  title: string;
  introMessage: string;
  disclaimer: string;
  days: ChallengeDay[];
  progress: ChallengeProgress;
  createdAt: string;
  updatedAt: string;
};

export type Badge = { badge_code: string; badge_title: string; earned_at: string };

export type RewardCard = {
  id: string;
  user_id: string;
  challenge_id: string;
  challenge_title: string;
  issue_tag: string;
  completed_on: string;
  message: string;
};

export function isDayLocked(plan: ChallengePlan): boolean {
  const unlockAt = plan.progress.nextUnlockAt;
  if (!unlockAt) return false;
  return new Date() < new Date(unlockAt);
}

export function remainingToUnlock(plan: ChallengePlan): number | null {
  const unlockAt = plan.progress.nextUnlockAt;
  if (!unlockAt) return null;
  const ms = new Date(unlockAt).getTime() - Date.now();
  return ms > 0 ? ms : null;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
