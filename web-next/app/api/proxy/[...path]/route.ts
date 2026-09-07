import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionToken } from "@/lib/session";

/**
 * Thin authenticated proxy in front of worker-api: attaches the bearer
 * token read server-side from the httpOnly session cookie, so it's never
 * exposed to client-side JS. Covers every /api/profiles, /api/scans,
 * /api/analyze, /api/guide, /api/challenges, /api/push-tokens,
 * /api/showdown, /api/ads, /api/polar/checkout, /api/polar/portal route —
 * one handler instead of ~15 near-identical ones, since they all share the
 * same "forward with bearer token" shape.
 */
const WORKER_API_URL =
  process.env.WORKER_API_URL ?? "https://verified-glam-api.komolafephilip.workers.dev";

async function forward(request: NextRequest, path: string[]) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const targetUrl = new URL(`/api/${path.join("/")}`, WORKER_API_URL);
  targetUrl.search = request.nextUrl.search;

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
  });

  const responseBody = await upstream.arrayBuffer();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: RouteContext) {
  return forward(request, (await ctx.params).path);
}
export async function POST(request: NextRequest, ctx: RouteContext) {
  return forward(request, (await ctx.params).path);
}
export async function PUT(request: NextRequest, ctx: RouteContext) {
  return forward(request, (await ctx.params).path);
}
export async function DELETE(request: NextRequest, ctx: RouteContext) {
  return forward(request, (await ctx.params).path);
}
