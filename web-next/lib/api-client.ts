import "server-only";

/**
 * Server-only client for worker-api. Every call happens on the server
 * (Route Handlers, Server Components) — never in the browser — so the
 * bearer token stays out of client-side JS entirely, and worker-api's
 * browser CORS allowlist doesn't even come into play for these calls.
 */
const WORKER_API_URL =
  process.env.WORKER_API_URL ?? "https://verified-glam-api.komolafephilip.workers.dev";

// Better Auth's own CSRF protection rejects any request with no Origin
// header at all, even server-to-server ones — it must be a value in
// worker-api's trustedOrigins (see worker-api/src/auth.ts). This app's
// own origin is added there.
const SELF_ORIGIN = process.env.NEXT_PUBLIC_SELF_ORIGIN ?? "http://localhost:3100";

export class ApiError extends Error {
  status: number;
  errorCode?: string;

  constructor(status: number, message: string, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

type RequestOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
  binary?: { bytes: ArrayBuffer | Uint8Array; contentType: string };
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Origin: SELF_ORIGIN };
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;

  let body: BodyInit | undefined;
  if (options.binary) {
    body = options.binary.bytes as BodyInit;
    headers["Content-Type"] = options.binary.contentType;
  } else if (options.body !== undefined) {
    body = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${WORKER_API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
    cache: "no-store",
  });

  const text = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Cloudflare/other upstreams can return plain text or HTML for a 404,
      // outage, or routing error. Never let that become a JSON.parse crash
      // that replaces the application's own error handling with a dev overlay.
      data = null;
    }
  }

  if (!res.ok) {
    // worker-api's own routes return {error, errorCode}; Better Auth's
    // /api/auth/* routes return {message, code} instead — handle both
    // (mirrors lib/services/backend/vg_api_client.dart on mobile).
    const plainTextMessage = text && !text.trimStart().startsWith("<") ? text.trim().slice(0, 240) : null;
    const message = data?.error ?? data?.message ?? plainTextMessage ?? `Request failed (${res.status})`;
    const errorCode = data?.errorCode ?? data?.code;
    throw new ApiError(res.status, message, errorCode);
  }

  if (text && data == null) {
    throw new ApiError(502, "The server returned an invalid response.", "INVALID_UPSTREAM_RESPONSE");
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: "GET", token }),
  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", token, body }),
  put: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", token, body }),
  delete: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "DELETE", token, body }),
  postBinary: <T>(
    path: string,
    bytes: ArrayBuffer | Uint8Array,
    contentType: string,
    token?: string | null,
  ) => request<T>(path, { method: "POST", token, binary: { bytes, contentType } }),
};
