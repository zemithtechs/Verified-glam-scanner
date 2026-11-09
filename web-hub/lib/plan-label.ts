export function planLabel(plan: string | null, isPro: boolean) {
  if (!isPro) return "Free";
  if (plan === "annual") return "Pro Yearly";
  if (plan === "pro_monthly") return "Pro Monthly";
  if (plan === "pro_weekly") return "Pro Weekly";
  return "Pro";
}
