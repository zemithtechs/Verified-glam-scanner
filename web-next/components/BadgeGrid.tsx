"use client";

import { useState } from "react";
import { Award, ChevronDown, ChevronUp } from "lucide-react";
import type { Badge } from "@/lib/challenge-api";

const COLLAPSED_COUNT = 3;

/**
 * `collapsible` defaults to false — the reward screen always shows the full
 * list; only the profile page's badge section collapses to 3 + "Show more"
 * (this was a specific, previously-corrected placement: it belongs on the
 * profile grid, not the home/reward screens).
 */
export function BadgeGrid({ badges, collapsible = false }: { badges: Badge[]; collapsible?: boolean }) {
  const [showAll, setShowAll] = useState(false);

  if (badges.length === 0) {
    return <p className="text-sm text-(--color-text-muted)">No badges earned yet — complete a challenge day to start.</p>;
  }

  const collapsed = collapsible && !showAll;
  const visible = collapsed ? badges.slice(0, COLLAPSED_COUNT) : badges;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visible.map((badge) => (
          <div
            key={badge.badge_code}
            className="flex flex-col items-center text-center gap-2 rounded-2xl border border-(--color-border) bg-white p-4"
          >
            <div className="w-12 h-12 rounded-full bg-(--color-blush) flex items-center justify-center">
              <Award className="text-(--color-burgundy)" size={22} />
            </div>
            <p className="text-sm font-semibold text-(--color-text)">{badge.badge_title}</p>
            <p className="text-xs text-(--color-text-muted)">
              {new Date(badge.earned_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {collapsible && badges.length > COLLAPSED_COUNT && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-(--color-burgundy)"
        >
          {showAll ? (
            <>
              Show less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Show more <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
