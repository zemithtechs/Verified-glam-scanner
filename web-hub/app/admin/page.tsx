import Link from "next/link";
import { Users, Zap, Coins, Crown, UserCog, Sparkles } from "lucide-react";
import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { AdminStats, AdminActivityItem } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

function StatCard({ icon: Icon, label, value, tint }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string | number; tint: string }) {
  return (
    <div className="bg-white rounded-2xl border border-(--color-border) p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tint}`}>
          <Icon size={16} />
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted)">{label}</p>
      </div>
      <p className="text-3xl font-extrabold text-(--color-burgundy-dark)">{value}</p>
    </div>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return `${hours}h ago`;
  const minutes = Math.floor(ms / 60_000);
  return `${Math.max(minutes, 0)}m ago`;
}

export default async function AdminOverviewPage() {
  const token = await getSessionToken();
  const [stats, activityRes] = await Promise.all([
    apiClient.get<AdminStats>("/api/admin/stats", token),
    apiClient.get<{ activity: AdminActivityItem[] }>("/api/admin/activity?limit=20", token),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-(--color-burgundy-dark)">Dashboard Overview</h1>
          <p className="text-sm text-(--color-text-muted)">Central control panel for platform operations</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} tint="bg-blue-100 text-blue-600" />
        <StatCard icon={Crown} label="Pro Subscribers" value={stats.proSubscribers} tint="bg-amber-100 text-amber-600" />
        <StatCard icon={Zap} label="Total Scans" value={stats.totalScans} tint="bg-purple-100 text-purple-600" />
        <StatCard icon={Coins} label="Credits Used" value={stats.creditsUsed.toLocaleString()} tint="bg-green-100 text-green-600" />
      </div>

      <div className="bg-white rounded-2xl border border-(--color-border) p-5 mb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted) mb-3">Quick actions</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link href="/admin/users" className="flex items-center gap-2.5 rounded-xl border border-(--color-border) px-4 py-3 hover:border-(--color-burgundy)">
            <UserCog size={18} className="text-(--color-burgundy)" />
            <span className="font-semibold text-sm text-(--color-text)">Manage Users</span>
          </Link>
          <Link href="/admin/subscriptions" className="flex items-center gap-2.5 rounded-xl border border-(--color-border) px-4 py-3 hover:border-(--color-burgundy)">
            <Crown size={18} className="text-(--color-burgundy)" />
            <span className="font-semibold text-sm text-(--color-text)">Subscriptions</span>
          </Link>
          <Link href="/app/face-beauty-analysis" className="flex items-center gap-2.5 rounded-xl border border-(--color-border) px-4 py-3 hover:border-(--color-burgundy)">
            <Sparkles size={18} className="text-(--color-burgundy)" />
            <span className="font-semibold text-sm text-(--color-text)">Open App</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-(--color-border) p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted) mb-3">Recent platform activity</p>
        {activityRes.activity.length === 0 ? (
          <p className="text-sm text-(--color-text-muted)">No scans yet.</p>
        ) : (
          <div className="divide-y divide-(--color-border)">
            {activityRes.activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Zap size={14} className="text-(--color-burgundy) shrink-0" />
                  <span className="font-medium text-(--color-text) truncate">{item.feature_title}</span>
                  <span className="text-(--color-text-muted) truncate hidden sm:inline">{item.email}</span>
                </div>
                <span className="text-(--color-text-muted) shrink-0 ml-3">{timeAgo(item.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
