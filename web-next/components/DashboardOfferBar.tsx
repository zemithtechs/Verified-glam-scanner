"use client";

import { useState } from "react";
import { Gift, Sparkles, X } from "lucide-react";
import type { Profile } from "@/lib/types";
import { UpgradeModal } from "./UpgradeModal";

export function DashboardOfferBar({ profile }: { profile: Profile }) {
  const [visible, setVisible] = useState(!profile.is_pro);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  if (!visible) return null;
  return <><div className="flex min-h-11 items-center justify-center gap-2 border-b border-[#eadadd] bg-[#fffafa] px-4 text-center text-xs font-semibold text-(--color-burgundy-dark) sm:text-sm"><Gift size={16} className="shrink-0 text-(--color-burgundy)" /><span>Unlock every analysis, ad-free results, and more credits with Pro.</span><button onClick={() => setUpgradeOpen(true)} className="ml-1 inline-flex items-center gap-1 font-extrabold text-(--color-burgundy) underline underline-offset-4"><Sparkles size={14} /> View plans</button><button onClick={() => setVisible(false)} className="ml-2 rounded-md p-1 text-(--color-text-muted) hover:bg-(--color-surface)" aria-label="Dismiss offer"><X size={15} /></button></div><UpgradeModal profile={profile} open={upgradeOpen} onClose={() => setUpgradeOpen(false)} /></>;
}
