import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";

/**
 * Saved results for the AI Beauty Styling site ("My creations"). Session-gated in index.ts.
 * Images are stored in the private scans bucket under "<user id>/creations/", which account deletion already wipes.
 */
export const creations = new Hono<{ Bindings: Env; Variables: SessionVars }>();

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_PER_USER = 100;

creations.get("/", async (c) => {
  const userId = c.get("userId");
  const rows = await c.env.DB.prepare(
    "select id, tool_slug, tool_name, created_at from creations where user_id = ? order by created_at desc limit ?",
  ).bind(userId, MAX_PER_USER).all<{ id: string; tool_slug: string; tool_name: string; created_at: string }>();
  return c.json({ creations: rows.results ?? [] });
});

creations.post("/", async (c) => {
  const userId = c.get("userId");
  const toolSlug = (c.req.header("x-tool-slug") ?? "").slice(0, 80);
  const toolName = (c.req.header("x-tool-name") ?? toolSlug).slice(0, 120);
  if (!/^[a-z0-9-]+$/.test(toolSlug)) return c.json({ error: "Invalid tool." }, 400);

  const bytes = new Uint8Array(await c.req.arrayBuffer());
  if (bytes.byteLength === 0) return c.json({ error: "No image received." }, 400);
  if (bytes.byteLength > MAX_IMAGE_BYTES) return c.json({ error: "Image too large." }, 413);
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (!isPng) return c.json({ error: "Only PNG results can be saved." }, 415);

  const id = crypto.randomUUID();
  const key = `${userId}/creations/${id}.png`;
  await c.env.SCANS_BUCKET.put(key, bytes, { httpMetadata: { contentType: "image/png" } });
  await c.env.DB.prepare("insert into creations (id, user_id, tool_slug, tool_name, storage_path) values (?, ?, ?, ?, ?)")
    .bind(id, userId, toolSlug, toolName, key).run();

  // Keep each account to its most recent results so storage stays bounded.
  const old = await c.env.DB.prepare(
    "select id, storage_path from creations where user_id = ? order by created_at desc limit -1 offset ?",
  ).bind(userId, MAX_PER_USER).all<{ id: string; storage_path: string }>();
  for (const row of old.results ?? []) {
    await c.env.SCANS_BUCKET.delete(row.storage_path);
    await c.env.DB.prepare("delete from creations where id = ? and user_id = ?").bind(row.id, userId).run();
  }
  return c.json({ id });
});

creations.get("/:id/image", async (c) => {
  const row = await c.env.DB.prepare("select storage_path from creations where id = ? and user_id = ?")
    .bind(c.req.param("id"), c.get("userId")).first<{ storage_path: string }>();
  if (!row) return c.json({ error: "not_found" }, 404);
  const object = await c.env.SCANS_BUCKET.get(row.storage_path);
  if (!object) return c.json({ error: "not_found" }, 404);
  return new Response(object.body, { headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=3600" } });
});

creations.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const row = await c.env.DB.prepare("select storage_path from creations where id = ? and user_id = ?")
    .bind(c.req.param("id"), userId).first<{ storage_path: string }>();
  if (!row) return c.json({ error: "not_found" }, 404);
  await c.env.SCANS_BUCKET.delete(row.storage_path);
  await c.env.DB.prepare("delete from creations where id = ? and user_id = ?").bind(c.req.param("id"), userId).run();
  return c.json({ ok: true });
});
