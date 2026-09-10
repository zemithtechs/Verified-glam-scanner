import { Crown } from "lucide-react";
import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { AdminUser, AdminSubscriptionsSummary } from "@/lib/admin-api";
import { UsersTable } from "../users/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const token = await getSessionToken();
  const [users, summary] = await Promise.all([
    apiClient.get<{ users: AdminUser[]; total: number }>("/api/admin/users?limit=25&proOnly=true", token),
    apiClient.get<AdminSubscriptionsSummary>("/api/admin/subscriptions-summary", token),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-(--color-burgundy-dark) mb-1">Subscriptions</h1>
      <p className="text-sm text-(--color-text-muted) mb-6">{users.total} active Pro subscribers</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summary.byPlan.map((row) => (
          <div key={row.plan ?? "unknown"} className="bg-white rounded-2xl border border-(--color-border) p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
                <Crown size={16} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted)">{row.plan ?? "Unknown plan"}</p>
            </div>
            <p className="text-3xl font-extrabold text-(--color-burgundy-dark)">{row.n}</p>
          </div>
        ))}
        {summary.byPlan.length === 0 && (
          <div className="bg-white rounded-2xl border border-(--color-border) p-5 sm:col-span-2 lg:col-span-4">
            <p className="text-sm text-(--color-text-muted)">No active subscriptions yet.</p>
          </div>
        )}
      </div>

      <UsersTable initialUsers={users.users} initialTotal={users.total} proOnly searchPlaceholder="Search Pro subscribers by email…" />
    </div>
  );
}
