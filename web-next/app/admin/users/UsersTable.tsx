"use client";

import { useEffect, useState } from "react";
import { Search, Crown } from "lucide-react";
import { proxyApi } from "@/lib/client-api";
import type { AdminUser } from "@/lib/admin-api";

const PAGE_SIZE = 25;

export function UsersTable({
  initialUsers,
  initialTotal,
  proOnly = false,
  searchPlaceholder = "Search by email…",
}: {
  initialUsers: AdminUser[];
  initialTotal: number;
  proOnly?: boolean;
  searchPlaceholder?: string;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), cursor: String(page * PAGE_SIZE) });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (proOnly) params.set("proOnly", "true");
    proxyApi
      .get<{ users: AdminUser[]; total: number }>(`/admin/users?${params}`)
      .then((res) => {
        setUsers(res.users);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, page, proOnly]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="bg-white rounded-2xl border border-(--color-border) overflow-hidden">
      <div className="p-4 border-b border-(--color-border)">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-(--color-border) pl-9 pr-3 py-2 text-sm outline-none focus:border-(--color-burgundy)"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wide text-(--color-text-muted) border-b border-(--color-border)">
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Plan</th>
              <th className="px-4 py-2.5">Credits</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Joined</th>
            </tr>
          </thead>
          <tbody className={loading ? "opacity-50" : ""}>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-(--color-border) last:border-0">
                <td className="px-4 py-2.5 font-medium text-(--color-text)">{user.email}</td>
                <td className="px-4 py-2.5">
                  {user.is_pro ? (
                    <span className="inline-flex items-center gap-1 text-(--color-burgundy) font-semibold">
                      <Crown size={13} /> {user.subscription_plan ?? "Pro"}
                    </span>
                  ) : (
                    <span className="text-(--color-text-muted)">Free</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-(--color-text-muted)">
                  {user.credits_balance} / {user.credits_allocated}
                </td>
                <td className="px-4 py-2.5 text-(--color-text-muted)">{user.subscription_status ?? "—"}</td>
                <td className="px-4 py-2.5 text-(--color-text-muted)">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-(--color-text-muted)">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-(--color-border) text-sm">
        <span className="text-(--color-text-muted)">
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg border border-(--color-border) px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-(--color-border) px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
