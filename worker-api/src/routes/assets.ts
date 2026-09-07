import { Hono } from "hono";
import type { Env } from "../env";

// Public proxy for ASSETS_BUCKET (celebrity portraits, showdown avatars —
// was Supabase's public storage bucket). No session guard: these are public
// images by design, matching the original bucket's public=true policy.
export const assets = new Hono<{ Bindings: Env }>();

assets.get("/:key{.+}", async (c) => {
  const key = c.req.param("key");
  const obj = await c.env.ASSETS_BUCKET.get(key);
  if (!obj) return c.notFound();

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", obj.httpEtag);
  return new Response(obj.body, { headers });
});
