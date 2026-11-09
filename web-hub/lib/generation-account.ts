import "server-only";
import { apiClient, ApiError } from "./api-client";
import { getSessionToken } from "./session";
import { toolBySlug } from "./catalog";

export type GenerationAccount = { token: string; canGenerate: boolean; total: number };

/** The signed-in visitor's credit balance, or null for a logged-out visitor (who gets the small free daily allowance instead). */
export async function generationAccount(): Promise<GenerationAccount | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const balance = await apiClient.get<{ total: number; canGenerate: boolean }>("/api/generation/balance", token);
    return { token, canGenerate: balance.canGenerate, total: balance.total };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) return null;
    throw error;
  }
}

/** Charges the account for one finished result. Throws ApiError (429) when the credits are gone. */
export async function chargeResult(token: string, slug: string): Promise<number> {
  const name = toolBySlug(slug)?.name ?? slug;
  const data = await apiClient.post<{ remaining: number }>("/api/generation/charge", { tool: name }, token);
  return data.remaining;
}

/** Saves the finished image to the account's "My creations". Never fails the request: a missed save must not lose the result. */
export async function saveCreation(token: string, slug: string, bytes: Uint8Array): Promise<void> {
  const name = toolBySlug(slug)?.name ?? slug;
  await apiClient.postBinary("/api/creations", bytes, "image/png", token, { "x-tool-slug": slug, "x-tool-name": name }).catch((error) => {
    console.error("could not save creation", error instanceof Error ? error.message : "");
  });
}
