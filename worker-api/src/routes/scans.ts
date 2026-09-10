import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";

// Port of vg_scan_repository.dart + vg_storage_service.dart.
// Photo upload/delete move from direct client-side Supabase Storage calls
// (RLS-scoped) to Worker-mediated R2 reads/writes, since R2 has no
// client-facing auth layer of its own — matches the "no signed URLs
// needed" design in docs/CLOUDFLARE_MIGRATION_PLAN.md.
export const scans = new Hono<{ Bindings: Env; Variables: SessionVars }>();

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function fromRow(row: Record<string, unknown>) {
  return { ...row, payload: JSON.parse((row.payload as string) ?? "{}") };
}

scans.get("/", async (c) => {
  const rows = await c.env.DB.prepare("select * from scans where user_id = ? order by created_at desc")
    .bind(c.get("userId"))
    .all<Record<string, unknown>>();
  return c.json({ scans: (rows.results ?? []).map(fromRow) });
});

scans.get("/:id", async (c) => {
  const row = await c.env.DB.prepare("select * from scans where id = ? and user_id = ?")
    .bind(c.req.param("id"), c.get("userId"))
    .first<Record<string, unknown>>();
  if (!row) return c.json({ error: "not_found" }, 404);
  return c.json(fromRow(row));
});

scans.put("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = await c.req.json<{ featureType?: string; featureTitle?: string; storagePath?: string; payload?: unknown; createdAt?: string }>().catch(
    () => ({}) as Record<string, unknown>,
  );

  await c.env.DB.prepare(
    `insert into scans (id, user_id, feature_type, feature_title, photo_storage_path, photo_public_url, payload, created_at)
     values (?, ?, ?, ?, ?, null, ?, ?)
     on conflict (id) do update set
       feature_type = excluded.feature_type, feature_title = excluded.feature_title,
       photo_storage_path = excluded.photo_storage_path, payload = excluded.payload, created_at = excluded.created_at`,
  )
    .bind(
      id,
      userId,
      body.featureType ?? "",
      body.featureTitle ?? "",
      body.storagePath ?? null,
      JSON.stringify(body.payload ?? {}),
      body.createdAt ?? new Date().toISOString(),
    )
    .run();

  return c.json({ ok: true });
});

scans.post("/:id/photo", async (c) => {
  const userId = c.get("userId");
  const scanId = c.req.param("id");
  const bytes = new Uint8Array(await c.req.arrayBuffer());
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    return c.json({ error: "Image too large — please choose a photo under 5MB." }, 413);
  }

  const storagePath = `${userId}/${scanId}.jpg`;
  await c.env.SCANS_BUCKET.put(storagePath, bytes, { httpMetadata: { contentType: "image/jpeg" } });
  return c.json({ storagePath });
});

scans.delete("/:id/photo", async (c) => {
  const userId = c.get("userId");
  const scanId = c.req.param("id");
  await c.env.SCANS_BUCKET.delete(`${userId}/${scanId}.jpg`);
  return c.json({ ok: true });
});

// SCANS_BUCKET is private (see docs/CLOUDFLARE_MIGRATION_PLAN.md), so
// there's no public R2 URL to hand out the way Supabase's signed URLs
// worked. This mimics that pattern instead: a short-lived HMAC-signed URL
// that the un-authenticated proxy route below verifies, rather than
// requiring the viewer to attach a Bearer header (Image.network callers
// can't easily do that without a UI-layer change).
async function signPhotoToken(env: Env, storagePath: string, expiresAt: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.BETTER_AUTH_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${storagePath}:${expiresAt}`));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

scans.get("/:id/photo-url", async (c) => {
  const userId = c.get("userId");
  const scanId = c.req.param("id");
  const storagePath = `${userId}/${scanId}.jpg`;
  const expiresAt = Date.now() + 5 * 60 * 1000;
  const token = await signPhotoToken(c.env, storagePath, expiresAt);
  const url = `${c.env.BETTER_AUTH_URL}/api/photo-signed/${userId}/${scanId}.jpg?expires=${expiresAt}&token=${token}`;
  return c.json({ url });
});

export const scanPhotoSigned = new Hono<{ Bindings: Env }>();

scanPhotoSigned.get("/:userId/:filename", async (c) => {
  const { userId, filename } = c.req.param();
  const storagePath = `${userId}/${filename}`;
  const expires = Number(c.req.query("expires"));
  const token = c.req.query("token") ?? "";
  if (!expires || Date.now() > expires) return c.json({ error: "expired" }, 403);

  const expected = await signPhotoToken(c.env, storagePath, expires);
  if (expected !== token) return c.json({ error: "invalid_token" }, 403);

  const obj = await c.env.SCANS_BUCKET.get(storagePath);
  if (!obj) return c.notFound();
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  return new Response(obj.body, { headers });
});
