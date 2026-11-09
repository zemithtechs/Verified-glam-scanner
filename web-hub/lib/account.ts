import "server-only";
import { redirect } from "next/navigation";
import { apiClient, ApiError } from "./api-client";
import { getSessionToken } from "./session";

/** Shape of GET /api/profiles/me (only the fields this site reads). */
export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  is_pro: boolean;
  subscription_plan: string | null;
  subscription_status?: string | null;
  credits_balance: number; // plan credits + bought credits
  credits_allocated: number;
  subscription_credits?: number;
  purchased_credits?: number;
};

export type Creation = { id: string; tool_slug: string; tool_name: string; created_at: string };

export async function currentProfile(): Promise<Profile | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await apiClient.get<Profile>("/api/profiles/me", token);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) return null;
    throw error;
  }
}

/** For pages inside /app: the signed-in profile, or a redirect to sign-in (and back afterwards). */
export async function requireProfile(returnTo = "/app"): Promise<Profile> {
  const profile = await currentProfile();
  if (!profile) redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  return profile;
}

export async function myCreations(): Promise<Creation[]> {
  const token = await getSessionToken();
  if (!token) return [];
  try {
    const data = await apiClient.get<{ creations: Creation[] }>("/api/creations", token);
    return data.creations ?? [];
  } catch {
    return [];
  }
}

export async function platformAnnouncement(): Promise<{ enabled: boolean; text: string; type: string } | null> {
  const token = await getSessionToken();
  try {
    const data = await apiClient.get<{ announcement: { enabled: boolean; text: string; type: string } }>("/api/profiles/platform-config", token);
    return data.announcement?.enabled && data.announcement.text ? data.announcement : null;
  } catch {
    return null;
  }
}

/** Only same-site paths are honoured after sign-in, never an external address. */
export function safeNext(path: string | undefined): string {
  return path && /^\/(app|pricing|tools|[a-z0-9-]+)(\/|$|\?)/.test(path) && !path.startsWith("//") ? path : "/app";
}
