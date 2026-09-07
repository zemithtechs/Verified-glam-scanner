import { NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api-client";
import { setSessionCookie } from "@/lib/session";

type SignUpResponse = { token: string; user: { id: string; email: string } };

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const data = await apiClient.post<SignUpResponse>("/api/auth/sign-up/email", {
      email,
      password,
      name: email.split("@")[0],
    });
    if (!data.token) {
      return NextResponse.json({ error: "Sign up did not return a session." }, { status: 502 });
    }
    await setSessionCookie(data.token);
    return NextResponse.json({ user: data.user });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message, errorCode: err.errorCode }, { status: err.status });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
