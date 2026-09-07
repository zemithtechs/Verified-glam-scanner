import type { Env } from "../env";
import { generatePortraitImage } from "./analyze-openai";
import { publicAssetUrl } from "./r2";

// Port of analyze-scan's celebrity portrait resolution + TMDB enrichment.
// Supabase Storage (download/upload to the "celebrity-match-portraits"
// bucket) becomes R2 reads/writes against ASSETS_BUCKET.

export function celebrityPortraitSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function resolveCelebrityPortraitUrl(name: string, env: Env): Promise<string | null> {
  const slug = celebrityPortraitSlug(name);
  if (!slug) return null;
  const key = `celebrity-match-portraits/${slug}.png`;

  const existing = await env.ASSETS_BUCKET.head(key);
  if (existing) return publicAssetUrl(env, key);

  const prompt = `Professional studio headshot portrait photograph resembling ${name}, neutral soft background, photorealistic, facing camera, no text, no watermark`;
  let imageBytes = await generatePortraitImage(env.OPENAI_API_KEY, prompt);
  if (!imageBytes) imageBytes = await generatePortraitImage(env.OPENAI_API_KEY, prompt);
  if (!imageBytes) return null;

  await env.ASSETS_BUCKET.put(key, imageBytes, { httpMetadata: { contentType: "image/png" } });
  return publicAssetUrl(env, key);
}

export async function enrichCelebrityMatchesWithGeneratedPortraits(
  parsed: Record<string, unknown>,
  env: Env,
): Promise<Record<string, unknown>> {
  const matches = (parsed.matches as Record<string, unknown>[]) ?? [];
  if (matches.length === 0) return parsed;

  const enriched = await Promise.all(
    matches.map(async (match) => {
      if (match.imageUrl) return match;
      const name = String(match.name ?? "").trim();
      if (!name) return match;
      try {
        let imageUrl = await resolveCelebrityPortraitUrl(name, env);
        if (!imageUrl) imageUrl = await resolveCelebrityPortraitUrl(name, env);
        if (!imageUrl) {
          console.warn(`Celebrity portrait missing after retries for ${name}`);
          return match;
        }
        return { ...match, imageUrl, imageSource: "generated" };
      } catch (e) {
        console.warn(`Portrait fallback failed for ${name}`, e);
        return match;
      }
    }),
  );

  parsed.matches = enriched;
  return parsed;
}

export async function enrichCelebrityMatchesWithTmdb(parsed: Record<string, unknown>, env: Env): Promise<Record<string, unknown>> {
  const apiKey = env.TMDB_API_KEY?.trim();
  const matches = (parsed.matches as Record<string, unknown>[]) ?? [];
  if (!apiKey || matches.length === 0) return parsed;

  const enriched = await Promise.all(
    matches.map(async (match) => {
      if (match.imageUrl) return match;
      const name = String(match.name ?? "");
      if (!name) return match;
      try {
        const url = `https://api.themoviedb.org/3/search/person?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(name)}&include_adult=false`;
        const res = await fetch(url);
        if (!res.ok) return match;
        const data = (await res.json()) as { results?: Array<{ id?: number; profile_path?: string }> };
        const person = data.results?.[0];
        const profilePath = person?.profile_path;
        if (!profilePath) return match;
        return { ...match, imageUrl: `https://image.tmdb.org/t/p/w185${profilePath}`, tmdbId: person.id };
      } catch (e) {
        console.warn(`TMDB lookup failed for ${name}`, e);
        return match;
      }
    }),
  );

  parsed.matches = enriched;
  return parsed;
}

export async function enrichCelebrityMatches(parsed: Record<string, unknown>, env: Env): Promise<Record<string, unknown>> {
  const withTmdb = await enrichCelebrityMatchesWithTmdb(parsed, env);
  return await enrichCelebrityMatchesWithGeneratedPortraits(withTmdb, env);
}
