import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { apiClient, ApiError } from "@/lib/api-client";
import { DEFAULT_TOOL_SLUG } from "@/lib/tools";
import type { Profile } from "@/lib/types";

/**
 * Runs on the server before any HTML is sent — this is the actual fix for
 * the Flutter-web login redirect-loop bug. That bug existed because the
 * "is the user signed in" check happened client-side, after the page had
 * already started rendering, racing against an async session restore. Here
 * the check happens before rendering starts at all, so there is no
 * flash-then-bounce: either the redirect happens before anything is sent,
 * or it doesn't happen.
 *
 * This is also the *authoritative* check (not just cookie presence) — it
 * actually calls worker-api to validate the token, because Server
 * Components (e.g. app/app/layout.tsx) are not allowed to set/delete
 * cookies during render, so an invalid/expired cookie must be cleared
 * here, in Proxy, or it would otherwise linger and cause exactly the
 * redirect loop this rewrite exists to eliminate.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? null;

  if (pathname.startsWith("/app")) {
    if (!token) return redirectToLogin(request, pathname);

    try {
      await apiClient.get<Profile>("/api/profiles/me", token);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 404)) {
        const response = redirectToLogin(request, pathname);
        response.cookies.delete(SESSION_COOKIE);
        return response;
      }
      throw err;
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!token) return redirectToLogin(request, pathname);

    try {
      await apiClient.get<{ isAdmin: boolean; email: string }>("/api/admin/me", token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        // Signed in but not on the admin allowlist — a plain 404 (not a
        // "forbidden" page) so /admin's existence isn't revealed.
        return new NextResponse("Not Found", { status: 404 });
      }
      if (err instanceof ApiError && (err.status === 401 || err.status === 404)) {
        const response = redirectToLogin(request, pathname);
        response.cookies.delete(SESSION_COOKIE);
        return response;
      }
      throw err;
    }
    return NextResponse.next();
  }

  const authPages = ["/login", "/register", "/forgot-password"];
  if (authPages.includes(pathname) && token) {
    return NextResponse.redirect(new URL(`/app/${DEFAULT_TOOL_SLUG}`, request.url));
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, redirectPath: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", redirectPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/login", "/register", "/forgot-password"],
};
