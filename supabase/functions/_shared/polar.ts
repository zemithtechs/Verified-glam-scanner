import { Polar } from "npm:@polar-sh/sdk@0.48.1";
import {
  Webhook,
  WebhookVerificationError as StandardWebhookVerificationError,
} from "npm:standardwebhooks@1.0.0";

const POLAR_SDK_VERSION = "0.48.1";

export function polarServer(): "sandbox" | "production" {
  return Deno.env.get("POLAR_ENV") === "production" ? "production" : "sandbox";
}

export function polarAccessToken(): string | null {
  const token = Deno.env.get("POLAR_ACCESS_TOKEN")?.trim();
  return token || null;
}

/** UUID from Polar → Settings → Organization → "Unique identifier for your organization". */
export function polarOrganizationId(): string | null {
  const id = Deno.env.get("POLAR_ORGANIZATION_ID")?.trim();
  return id || null;
}

/** Slug used in polar.sh/{slug}/portal and checkout branding. */
export function polarOrganizationSlug(): string | null {
  const slug = Deno.env.get("POLAR_ORGANIZATION_SLUG")?.trim();
  return slug || null;
}

export function createPolarClient(): Polar | null {
  const accessToken = polarAccessToken();
  if (!accessToken) return null;
  return new Polar({ accessToken, server: polarServer() });
}

export function defaultPortalUrl(): string | null {
  const slug = polarOrganizationSlug();
  if (!slug) return null;
  const host = polarServer() === "production" ? "https://polar.sh" : "https://sandbox.polar.sh";
  return `${host}/${slug}/portal`;
}

/** Reject webhook payloads from another Polar org when POLAR_ORGANIZATION_ID is set. */
export function eventOrganizationId(data: Record<string, unknown>): string | null {
  const direct = data.organization_id ?? data.organizationId;
  if (typeof direct === "string" && direct.length > 0) return direct;

  const org = data.organization as Record<string, unknown> | undefined;
  if (org && typeof org.id === "string") return org.id;

  return null;
}

export function assertEventOrganization(data: Record<string, unknown>): string | null {
  const expected = polarOrganizationId();
  if (!expected) return null;

  const actual = eventOrganizationId(data);
  if (actual && actual !== expected) {
    return `Webhook organization_id mismatch (expected ${expected}, got ${actual})`;
  }
  return null;
}

/** Strip accidental whsec_ prefix; Polar secrets are polar_whs_… from the dashboard. */
export function normalizePolarWebhookSecret(raw: string): { secret: string; strippedWhsec: boolean } {
  let secret = raw.trim();
  let strippedWhsec = false;
  if (secret.startsWith("whsec_polar_whs_")) {
    secret = secret.slice("whsec_".length);
    strippedWhsec = true;
  } else if (secret.startsWith("whsec_") && secret.includes("polar_whs_")) {
    secret = secret.slice("whsec_".length);
    strippedWhsec = true;
  }
  return { secret, strippedWhsec };
}

/** Returns an error message when the secret format is wrong; null when OK. */
export function validatePolarWebhookSecretFormat(secret: string): string | null {
  if (!secret.startsWith("polar_whs_")) {
    return "POLAR_WEBHOOK_SECRET must start with polar_whs_ (paste exactly from Polar dashboard — do not add whsec_)";
  }
  if (secret.length < 20) {
    return "POLAR_WEBHOOK_SECRET looks too short";
  }
  return null;
}

export function polarWebhookSecret(): string | null {
  const raw = Deno.env.get("POLAR_WEBHOOK_SECRET")?.trim();
  if (!raw) return null;
  const { secret, strippedWhsec } = normalizePolarWebhookSecret(raw);
  if (strippedWhsec) {
    console.warn("POLAR_WEBHOOK_SECRET had accidental whsec_ prefix — using polar_whs_… value");
  }
  return secret;
}

export type PolarWebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

function webhookSecretBase64(secret: string): string {
  const bytes = new TextEncoder().encode(secret);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Lowercase header names for Standard Webhooks verification. */
export function normalizeWebhookHeaders(headers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    out[key.toLowerCase()] = value;
  }
  return out;
}

/**
 * Verify Polar webhook signature and parse JSON without strict SDK Zod schemas.
 * Strict validateEvent() rejects newer Polar payloads (e.g. checkout.created → HTTP 400).
 */
export function parsePolarWebhookEvent(
  rawBody: string,
  headers: Record<string, string>,
  secret: string,
): PolarWebhookEvent {
  const webhook = new Webhook(webhookSecretBase64(secret));
  const verified = webhook.verify(rawBody, normalizeWebhookHeaders(headers));

  if (!verified || typeof verified !== "object" || Array.isArray(verified)) {
    throw new Error("Invalid webhook payload shape");
  }

  const payload = verified as Record<string, unknown>;
  const type = typeof payload.type === "string" ? payload.type : "";
  const data = payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
    ? payload.data as Record<string, unknown>
    : {};

  if (!type) {
    throw new Error("Missing webhook event type");
  }

  return { type, data };
}

export { POLAR_SDK_VERSION, StandardWebhookVerificationError };

const DEFAULT_APP_ORIGIN = "https://scanner.verifiedglam.com";
const DEFAULT_SUCCESS_PATH = "/app/face-beauty-analysis?checkout=success";
const DEFAULT_CANCEL_PATH = "/pricing?checkout=cancelled";

/** Where Polar sends the customer after successful payment. */
export function polarSuccessUrl(): string {
  const configured = Deno.env.get("POLAR_SUCCESS_URL")?.trim();
  if (configured) return configured;

  const origin = Deno.env.get("POLAR_APP_BASE_URL")?.trim()?.replace(/\/$/, "") ??
    DEFAULT_APP_ORIGIN;
  return `${origin}${DEFAULT_SUCCESS_PATH}`;
}

/** Where Polar sends the customer when checkout is cancelled or abandoned. */
export function polarCancelUrl(): string {
  const configured = Deno.env.get("POLAR_CANCEL_URL")?.trim();
  if (configured) return configured;

  const origin = Deno.env.get("POLAR_APP_BASE_URL")?.trim()?.replace(/\/$/, "") ??
    DEFAULT_APP_ORIGIN;
  return `${origin}${DEFAULT_CANCEL_PATH}`;
}

export function polarCheckoutLinkForPlan(planId: string): string | null {
  if (planId === "annual") {
    return Deno.env.get("POLAR_CHECKOUT_LINK_ANNUAL")?.trim() || null;
  }
  if (planId === "pro_weekly") {
    return Deno.env.get("POLAR_CHECKOUT_LINK_PRO_WEEKLY")?.trim() || null;
  }
  return null;
}

/** Static Polar checkout link with customer binding (see Polar Checkout Links query params). */
export function buildCheckoutLinkUrl(
  baseLink: string,
  userId: string,
  email?: string | null,
): string {
  const url = new URL(baseLink);
  url.searchParams.set("customerExternalId", userId);
  if (email) url.searchParams.set("customerEmail", email);
  return url.toString();
}
