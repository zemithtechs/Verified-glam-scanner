import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";
import { clearSessionCookie, getSessionToken } from "@/lib/session";

export async function POST() {
  const token = await getSessionToken();
  if (token) {
    // Best-effort — the local cookie is what actually matters here, so a
    // failed upstream sign-out shouldn't block the user from being signed
    // out locally.
    await apiClient.post("/api/auth/sign-out", undefined, token).catch(() => {});
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
