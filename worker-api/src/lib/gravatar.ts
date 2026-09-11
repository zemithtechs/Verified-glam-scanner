// Gravatar accepts either an MD5 or a SHA-256 hash of the trimmed, lowercased
// email — SHA-256 is used here since Web Crypto (available in Workers)
// supports it natively, avoiding a userland MD5 dependency.
async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Returns a Gravatar URL for this email if one is actually set (checked via
 * `d=404`, which makes Gravatar respond 404 instead of a generic placeholder
 * when the account has no custom photo) — or null, so callers can fall back
 * to something else instead of persisting a generic stock image.
 */
export async function gravatarUrlFor(email: string): Promise<string | null> {
  const hash = await sha256Hex(email.trim().toLowerCase());
  const url = `https://www.gravatar.com/avatar/${hash}?d=404&s=256`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok ? url : null;
  } catch {
    return null;
  }
}
