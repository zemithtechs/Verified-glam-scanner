// Browser-side helpers — call this app's own Route Handlers, never
// worker-api directly, so the bearer token never has to live in
// client-side JS/localStorage.

export class ClientApiError extends Error {
  status: number;
  errorCode?: string;

  constructor(status: number, message: string, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: res.ok ? "The server returned an invalid response." : `Request failed (${res.status}).` };
    }
  }
  if (!res.ok) {
    throw new ClientApiError(res.status, data?.error ?? `Request failed (${res.status})`, data?.errorCode);
  }
  return data as T;
}

export function friendlyAuthError(err: unknown): string {
  if (err instanceof ClientApiError) {
    if (err.message && !err.message.startsWith("Request failed")) return err.message;
    switch (err.status) {
      case 401:
        return "Incorrect email or password. Please try again.";
      case 404:
        return "We could not find an account with that email.";
      case 409:
        return "An account with this email already exists.";
      case 429:
        return "Too many attempts. Please wait a moment and try again.";
      case 503:
        return "The sign-in service is unavailable right now. Please check your connection and try again.";
      default:
        return "Something went wrong. Please check your connection and try again.";
    }
  }
  return "Something went wrong. Please check your connection and try again.";
}

export const authApi = {
  signIn: (email: string, password: string) =>
    fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => handle<{ user: { id: string; email: string } }>(r)),

  signUp: (email: string, password: string) =>
    fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => handle<{ user: { id: string; email: string } }>(r)),

  signOut: () => fetch("/api/auth/sign-out", { method: "POST" }).then((r) => handle<{ ok: true }>(r)),

  forgotPassword: (email: string) =>
    fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then((r) => handle<{ ok: true }>(r)),
};

export const proxyApi = {
  get: <T>(path: string) => fetch(`/api/proxy${path}`, { cache: "no-store" }).then((r) => handle<T>(r)),
  post: <T>(path: string, body?: unknown) =>
    fetch(`/api/proxy${path}`, {
      method: "POST",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handle<T>(r)),
  put: <T>(path: string, body?: unknown) =>
    fetch(`/api/proxy${path}`, {
      method: "PUT",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handle<T>(r)),
  postBinary: <T>(path: string, bytes: Blob | ArrayBuffer, contentType: string) =>
    fetch(`/api/proxy${path}`, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: bytes,
    }).then((r) => handle<T>(r)),
};
