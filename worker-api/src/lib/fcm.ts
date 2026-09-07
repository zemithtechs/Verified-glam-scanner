import { importPKCS8, SignJWT } from "jose";
import type { Env } from "../env";

// Port of supabase/functions/send-challenge-push's FCM v1 sender. JWT
// signing moves from Deno's djwt to jose (see docs/CLOUDFLARE_MIGRATION_PLAN.md
// — dispatch-challenge-notifications + send-challenge-push row); the HTTP
// call between the two original Edge Functions is gone since the Worker's
// scheduled handler now calls this directly, in-process.

export type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
  type?: string;
};

export type SendResult = { ok: boolean; invalidToken: boolean; error?: string };

export function loadServiceAccount(env: Env): ServiceAccount | null {
  const raw = env.FCM_SERVICE_ACCOUNT_JSON?.trim() ?? "";
  if (!raw || !raw.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (parsed.type && parsed.type !== "service_account") return null;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) return null;
    parsed.private_key = normalizePrivateKey(parsed.private_key);
    return parsed;
  } catch {
    return null;
  }
}

function normalizePrivateKey(pem: string): string {
  if (pem.includes("\\n")) return pem.replace(/\\n/g, "\n");
  return pem;
}

export function stringifyData(data: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    out[key] = value == null ? "" : String(value);
  }
  return out;
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const key = await importPKCS8(sa.private_key, "RS256");
  const jwt = await new SignJWT({ scope: "https://www.googleapis.com/auth/firebase.messaging" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth token failed: ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? "";
}

export async function sendFcmV1(
  sa: ServiceAccount,
  token: string,
  title: string,
  message: string,
  data: Record<string, string>,
): Promise<SendResult> {
  try {
    const accessToken = await getAccessToken(sa);
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body: message },
          data,
          android: {
            priority: "HIGH",
            notification: { channel_id: "beauty_routine_challenge", sound: "default" },
          },
        },
      }),
    });
    const text = await response.text();
    if (response.ok) return { ok: true, invalidToken: false };
    console.error("FCM v1 error", text);
    const invalidToken =
      text.includes("NOT_FOUND") || text.includes("UNREGISTERED") || text.includes("InvalidRegistration");
    let errorMsg = `FCM v1 ${response.status}: ${text.slice(0, 240)}`;
    if (text.includes("PERMISSION_DENIED") || text.includes("403")) {
      errorMsg += " — Enable Firebase Cloud Messaging API in Google Cloud Console for project verified-glam.";
    }
    return { ok: false, invalidToken, error: errorMsg };
  } catch (e) {
    const msg = String(e);
    console.error("FCM v1 exception", msg);
    return { ok: false, invalidToken: false, error: msg };
  }
}

/** Fan out to every active device for a user; deactivates tokens FCM reports invalid. */
export async function sendChallengePushToUser(
  db: D1Database,
  sa: ServiceAccount,
  opts: { userId: string; title: string; body: string; data: Record<string, unknown> },
): Promise<{ sent: number; total: number; errors: string[] }> {
  const rows = await db
    .prepare("select fcm_token from device_push_tokens where user_id = ? and is_active = 1")
    .bind(opts.userId)
    .all<{ fcm_token: string }>();
  const tokens = (rows.results ?? []).map((t) => t.fcm_token).filter(Boolean);

  const errors: string[] = [];
  if (tokens.length === 0) {
    errors.push(`No active FCM tokens in device_push_tokens for user ${opts.userId}. Sign in on device and allow notifications.`);
  }

  const data = stringifyData(opts.data);
  let sent = 0;
  for (const token of tokens) {
    const result = await sendFcmV1(sa, token, opts.title, opts.body, data);
    if (result.ok) {
      sent++;
    } else {
      if (result.error) errors.push(result.error);
      if (result.invalidToken) {
        await db.prepare("update device_push_tokens set is_active = 0 where fcm_token = ?").bind(token).run();
      }
    }
  }

  return { sent, total: tokens.length, errors };
}
