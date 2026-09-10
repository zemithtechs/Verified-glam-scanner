import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Authenticated, per-admin data — must never be served from the full route
// cache (a stale cached response here would leak across accounts or get
// permanently stuck serving an old render).
export const dynamic = "force-dynamic";

/**
 * Access control (token presence + admin allowlist) is enforced in
 * proxy.ts, which runs before this layout and calls the same
 * /api/admin/me endpoint — that's the authoritative gate. This layout
 * only needs the admin's email to display in the sidebar.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getSessionToken();
  const me = await apiClient.get<{ isAdmin: boolean; email: string }>("/api/admin/me", token);

  return (
    <div className="flex min-h-screen bg-(--color-surface)">
      <AdminSidebar email={me.email} />
      <main className="flex-1 min-w-0 p-6 sm:p-8">{children}</main>
    </div>
  );
}
