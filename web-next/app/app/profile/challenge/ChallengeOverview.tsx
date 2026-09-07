"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Flame, Clock, ChevronRight } from "lucide-react";
import { proxyApi } from "@/lib/client-api";
import { isDayLocked, remainingToUnlock, formatDuration, type ChallengePlan } from "@/lib/challenge-api";

export function ChallengeOverview({ plan }: { plan: ChallengePlan }) {
  const [prefTime, setPrefTime] = useState(plan.progress.notificationPrefTime ?? "18:00");
  const [saved, setSaved] = useState(false);
  const locked = isDayLocked(plan);
  const remaining = remainingToUnlock(plan);

  async function handleTimeChange(value: string) {
    setPrefTime(value);
    setSaved(false);
    await proxyApi.put(`/challenges/${plan.challengeId}/notification-pref-time`, { prefTime: value });
    setSaved(true);
  }

  return (
    <div className="max-w-(--max-content) mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-burgundy-dark)">{plan.title}</h1>
      <p className="mt-2 text-(--color-text-muted) max-w-2xl">{plan.introMessage}</p>

      <div className="mt-6 flex gap-1.5 flex-wrap">
        {plan.days.map((day) => {
          const done = day.dayNumber < plan.progress.currentDay;
          const isCurrent = day.dayNumber === plan.progress.currentDay;
          return (
            <div
              key={day.dayNumber}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                done
                  ? "bg-(--color-burgundy) text-white"
                  : isCurrent
                    ? "bg-(--color-rose) text-white"
                    : "bg-(--color-surface) text-(--color-text-muted) border border-(--color-border)"
              }`}
            >
              {done ? <CheckCircle2 size={16} /> : day.dayNumber}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-(--color-border) p-5 flex items-center gap-3">
          <Flame className="text-(--color-burgundy)" size={28} />
          <div>
            <p className="text-sm text-(--color-text-muted)">Current streak</p>
            <p className="text-xl font-extrabold text-(--color-burgundy-dark)">
              {plan.progress.streakCount} day{plan.progress.streakCount === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-(--color-text-muted)">Best: {plan.progress.bestStreak}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-(--color-border) p-5">
          <p className="text-sm text-(--color-text-muted) mb-2">Daily reminder time</p>
          <input
            type="time"
            value={prefTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="rounded-lg border border-(--color-border) px-3 py-1.5 text-(--color-text)"
          />
          {saved && <span className="ml-2 text-xs text-green-600">Saved</span>}
        </div>
      </div>

      {locked && remaining && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-(--color-surface) border border-(--color-border) px-4 py-3 text-sm text-(--color-text-muted)">
          <Clock size={16} />
          Day {plan.progress.currentDay} unlocks in {formatDuration(remaining)}
        </div>
      )}

      <div className="mt-6 bg-white rounded-[20px] border border-(--color-border) divide-y divide-(--color-border)">
        {plan.days.map((day) => {
          const done = day.dayNumber < plan.progress.currentDay;
          const isCurrent = day.dayNumber === plan.progress.currentDay;
          const clickable = done || isCurrent;
          const row = (
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="shrink-0">
                {done ? (
                  <CheckCircle2 className="text-(--color-burgundy)" size={22} />
                ) : clickable ? (
                  <span className="w-6 h-6 rounded-full bg-(--color-rose) text-white text-xs font-bold flex items-center justify-center">
                    {day.dayNumber}
                  </span>
                ) : (
                  <Lock className="text-(--color-text-muted)" size={18} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${clickable ? "text-(--color-text)" : "text-(--color-text-muted)"}`}>
                  Day {day.dayNumber}: {day.title}
                </p>
                <p className="text-xs text-(--color-text-muted)">{day.estMinutes} min</p>
              </div>
              {clickable && <ChevronRight className="text-(--color-text-muted)" size={18} />}
            </div>
          );
          return clickable ? (
            <Link key={day.dayNumber} href={`/app/profile/challenge/day/${day.dayNumber}`}>
              {row}
            </Link>
          ) : (
            <div key={day.dayNumber} className="opacity-60">
              {row}
            </div>
          );
        })}
      </div>

      {plan.disclaimer && <p className="mt-4 text-xs text-(--color-text-muted)">{plan.disclaimer}</p>}
    </div>
  );
}
