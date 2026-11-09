/** Browser-side helpers for the site's own /api routes (the login token itself never reaches the browser). */
export class ClientApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init.headers ?? {}) }, cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ClientApiError(response.status, (data && (data.error || data.message)) || `Request failed (${response.status})`);
  return data as T;
}

export function friendlyAuthError(error: unknown): string {
  if (error instanceof ClientApiError) {
    if (error.message && !error.message.startsWith("Request failed")) return error.message;
    switch (error.status) {
      case 401: return "Incorrect email or password. Please try again.";
      case 404: return "We could not find an account with that email.";
      case 409: return "An account with this email already exists.";
      case 429: return "Too many attempts. Please wait a moment and try again.";
      case 503: return "The sign-in service is unavailable right now. Please try again in a moment.";
    }
  }
  return "Something went wrong. Please check your connection and try again.";
}

export const authApi = {
  signIn: (email: string, password: string) => call("/api/auth/sign-in", { method: "POST", body: JSON.stringify({ email, password }) }),
  signUp: (email: string, password: string) => call("/api/auth/sign-up", { method: "POST", body: JSON.stringify({ email, password }) }),
  signOut: () => call("/api/auth/sign-out", { method: "POST" }),
  forgotPassword: (email: string) => call("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
};

/** Starts a Polar checkout for a plan and returns the address to send the buyer to. */
export async function startCheckout(planId: "annual" | "pro_monthly" | "payg", amount?: number): Promise<string> {
  const successUrl = `${window.location.origin}/app/account?checkout=success`;
  const data = await call<{ checkoutUrl?: string }>("/api/proxy/polar/checkout", { method: "POST", body: JSON.stringify({ planId, amount, successUrl }) });
  if (!data.checkoutUrl) throw new ClientApiError(502, "Checkout is not available right now. Please try again.");
  return data.checkoutUrl;
}

export async function openBillingPortal(): Promise<string> {
  const data = await call<{ portalUrl?: string; url?: string }>("/api/proxy/polar/portal", { method: "POST" });
  const url = data.portalUrl ?? data.url;
  if (!url) throw new ClientApiError(502, "Billing is not available right now.");
  return url;
}

export const creationsApi = {
  remove: (id: string) => call(`/api/proxy/creations/${id}`, { method: "DELETE" }),
};

export const accountApi = {
  remove: (confirmation: string) => call("/api/account/delete", { method: "DELETE", body: JSON.stringify({ confirmation }) }),
};
