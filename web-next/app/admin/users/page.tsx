import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { AdminUser } from "@/lib/admin-api";
import { UsersTable } from "./UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const token = await getSessionToken();
  const data = await apiClient.get<{ users: AdminUser[]; total: number }>("/api/admin/users?limit=25", token);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-(--color-burgundy-dark) mb-1">Users</h1>
      <p className="text-sm text-(--color-text-muted) mb-6">{data.total} total accounts</p>
      <UsersTable initialUsers={data.users} initialTotal={data.total} />
    </div>
  );
}
