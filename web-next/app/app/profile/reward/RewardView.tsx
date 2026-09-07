"use client";

import Link from "next/link";
import { Trophy, Share2, RotateCcw } from "lucide-react";
import { BadgeGrid } from "@/components/BadgeGrid";
import type { Badge, RewardCard } from "@/lib/challenge-api";

export function RewardView({ rewardCard, badges }: { rewardCard: RewardCard | null; badges: Badge[] }) {
  async function handleShare() {
    const text = rewardCard
      ? `I just completed my ${rewardCard.challenge_title} on Verified Glam!`
      : "I just completed a Beauty Routine Challenge on Verified Glam!";
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  return (
    <div className="max-w-(--max-content) mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-[20px] border border-(--color-border) p-8 sm:p-12 flex flex-col items-center text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: "linear-gradient(135deg, #872B3F 0%, #C79A9A 100%)" }}
        >
          <Trophy className="text-white" size={36} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-burgundy-dark)">
          {rewardCard ? rewardCard.challenge_title : "Challenge Complete!"}
        </h1>
        <p className="mt-3 text-(--color-text-muted) max-w-md">
          {rewardCard?.message ?? "You showed up for your skin every day. That is what glow is made of."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-(--color-burgundy) text-white font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
          >
            <Share2 size={18} /> Share
          </button>
          <Link
            href="/app/beauty-routine-challenge"
            className="inline-flex items-center gap-2 rounded-full border border-(--color-border) text-(--color-text) font-semibold px-6 py-3 hover:bg-(--color-surface)"
          >
            <RotateCcw size={18} /> Start another challenge
          </Link>
          <Link
            href="/app/profile"
            className="inline-flex items-center gap-2 rounded-full text-(--color-text-muted) font-semibold px-6 py-3 hover:bg-(--color-surface)"
          >
            Back to profile
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-[20px] border border-(--color-border) p-6">
        <h2 className="text-lg font-bold text-(--color-burgundy-dark) mb-4">Your badges</h2>
        <BadgeGrid badges={badges} />
      </div>
    </div>
  );
}
