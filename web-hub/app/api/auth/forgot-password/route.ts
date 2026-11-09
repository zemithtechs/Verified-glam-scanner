import { NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api-client";

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({}));
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    await apiClient.post("/api/auth/forget-password", { email, redirectTo: "" });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message, errorCode: err.errorCode }, { status: err.status });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
