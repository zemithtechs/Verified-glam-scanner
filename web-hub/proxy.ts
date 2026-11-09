import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { apiClient, ApiError } from "@/lib/api-client";

/**
 * Runs before any page is sent. Signed-out visitors cannot open /app (they are sent to sign in and brought back),
 * an expired session is cleared here (pages are not allowed to delete cookies while rendering), and people who are
 * already signed in are sent from the sign-in pages straight to their dashboard.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? null;

  if (pathname.startsWith("/app")) {
    if (!token) return redirectToLogin(request, pathname);
    try {
      await apiClient.get("/api/profiles/me", token);
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
      await apiClient.get("/api/admin/me", token);
    } catch (err) {
      // Signed in but not on the admin list: a plain 404, so the admin area's existence is not revealed.
      if (err instanceof ApiError && err.status === 403) return new NextResponse("Not Found", { status: 404 });
      if (err instanceof ApiError && (err.status === 401 || err.status === 404)) {
        const response = redirectToLogin(request, pathname);
        response.cookies.delete(SESSION_COOKIE);
        return response;
      }
      throw err;
    }
    return NextResponse.next();
  }

  if (["/login", "/register", "/forgot-password"].includes(pathname) && token) {
    return NextResponse.redirect(new URL("/app", request.url));
  }
  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, redirectPath: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("redirect", redirectPath);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/app/:path*", "/admin/:path*", "/login", "/register", "/forgot-password"] };
