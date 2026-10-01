// Types matching worker-api's src/routes/admin.ts response shapes.
export type AdminStats = {
  totalUsers: number;
  proSubscribers: number;
  totalScans: number;
  creditsUsed: number;
};

export type AdminUser = {
  id: string;
  email: string;
  display_name: string | null;
  is_pro: boolean;
  subscription_plan: string | null;
  subscription_status: string | null;
  credits_balance: number;
  credits_allocated: number;
  credits_used: number;
  created_at: string;
};

export type AdminTool = { featureType: string; name: string; enabled: boolean };
export type AdminWorkflow = { id: string; name: string; source: string; destination: string; enabled: boolean };
export type AdminUsage = {
  totalLogs: number;
  creditsConsumed: number;
  uniqueTools: number;
  breakdown: { feature_type: string; uses: number; credits: number }[];
};
export type AdminLog = {
  id: string; created_at: string; tool: string; feature_type: string | null; kind: string;
  amount: number; credits: number; balance_after: number | null; user_id: string; email: string | null;
};

export type AdminSubscriptionsSummary = {
  byPlan: { plan: string | null; n: number }[];
};

export type AdminActivityItem = {
  id: string;
  feature_type: string;
  feature_title: string;
  created_at: string;
  email: string;
};
