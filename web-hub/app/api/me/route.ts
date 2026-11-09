import { NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api-client";
import { getSessionToken } from "@/lib/session";
import type { Profile } from "@/lib/account";

/** Small summary for the site header: is someone signed in, and who. Never returns the token. */
export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ signedIn: false }, { headers: { "Cache-Control": "no-store" } });
  try {
    const p = await apiClient.get<Profile>("/api/profiles/me", token);
    return NextResponse.json({ signedIn: true, name: p.display_name || p.email.split("@")[0], credits: p.credits_balance, isPro: p.is_pro }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) return NextResponse.json({ signedIn: false }, { headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ signedIn: false, unavailable: true }, { headers: { "Cache-Control": "no-store" } });
  }
}
