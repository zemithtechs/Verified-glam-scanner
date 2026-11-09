import { NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api-client";
import { clearSessionCookie, getSessionToken } from "@/lib/session";

export async function DELETE(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Sign in before deleting your account." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (body?.confirmation !== "DELETE") {
    return NextResponse.json({ error: "Type DELETE to confirm permanent account deletion." }, { status: 400 });
  }

  try {
    await apiClient.delete("/api/profiles/me", { confirmation: "DELETE" }, token);
    await clearSessionCookie();
    return NextResponse.json({ ok: true, deleted: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Account deletion failed. Please try again." }, { status: 500 });
  }
}
