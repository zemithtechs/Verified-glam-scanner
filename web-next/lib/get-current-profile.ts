import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { Profile } from "@/lib/types";

/**
 * `cache()` dedupes this within a single request — the dashboard layout and
 * a page (e.g. /app/profile) can both call this without triggering two
 * network round-trips to worker-api.
 *
 * No error handling for an invalid/expired token here: Server Components
 * are not allowed to clear cookies during render (Next.js constraint), so
 * that check — and clearing the cookie when it fails — lives in proxy.ts,
 * which runs before this ever does. By the time this runs, proxy.ts has
 * already guaranteed the token is valid.
 */
export const getCurrentProfile = cache(async (): Promise<Profile> => {
  const token = await getSessionToken();
  if (!token) redirect("/login");
  return apiClient.get<Profile>("/api/profiles/me", token);
});
