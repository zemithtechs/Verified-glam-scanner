// Shape of GET /api/profiles/me — only the fields the dashboard chrome
// actually reads; worker-api returns more (see worker-api/src/routes/profiles.ts).
export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  is_pro: boolean;
  subscription_plan: string | null;
  credits_balance: number;
  credits_allocated: number;
};

export type CreditTransaction = {
  id: string;
  user_id: string;
  amount: number;
  kind: "subscription_grant" | "period_refresh" | "analysis" | "subscription_revoke";
  description: string;
  feature_type: string | null;
  balance_after: number | null;
  created_at: string;
};
