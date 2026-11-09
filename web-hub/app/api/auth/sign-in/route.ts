import { NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api-client";
import { setSessionCookie } from "@/lib/session";

type SignInResponse = { token: string; user: { id: string; email: string } };

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const data = await apiClient.post<SignInResponse>("/api/auth/sign-in/email", { email, password });
    if (!data.token) {
      return NextResponse.json({ error: "Sign in did not return a session." }, { status: 502 });
    }
    await setSessionCookie(data.token);
    return NextResponse.json({ user: data.user });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message, errorCode: err.errorCode }, { status: err.status });
    }
    console.error("Sign-in service unavailable:", err);
    return NextResponse.json(
      { error: "Unable to reach the sign-in service. Check your connection and try again.", errorCode: "AUTH_SERVICE_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
