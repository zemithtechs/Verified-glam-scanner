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
  created_at: string;
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
