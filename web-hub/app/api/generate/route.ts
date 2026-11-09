import { HANDOFF } from "@/lib/live-mode";
import { ApiError } from "@/lib/api-client";
import { chargeResult, generationAccount, saveCreation } from "@/lib/generation-account";

// Two implementations behind one URL, so the page works the same everywhere:
//  - local development: lib/generation-server.ts (your computer only, uses your local key)
//  - deployed site:     lib/generation-live.ts (Cloudflare, with free-result limits)
// Each is loaded only where it is used.
//
// Accounts: a signed-in visitor spends account credits (checked before, charged after a successful result, so a
// failed run never costs credits) and the result is saved to My creations. A logged-out visitor gets the small
// free daily allowance on the deployed site.
const live = () => import("@/lib/generation-live");
const server = () => import("@/lib/generation-server");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
const privateHeaders = { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" };

async function fail(error: unknown) {
  const { GenerationError } = HANDOFF ? { GenerationError: null } : await server();
  const { LiveError } = HANDOFF ? await live() : { LiveError: null };
  if ((GenerationError && error instanceof GenerationError) || (LiveError && error instanceof LiveError)) {
    const e = error as { message: string; status: number };
    return Response.json({ error: e.message }, { status: e.status, headers: privateHeaders });
  }
  if (error instanceof ApiError && error.status === 429) return Response.json({ error: "You are out of credits. Get more on the pricing page to keep going." }, { status: 402, headers: privateHeaders });
  if (error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name)) return Response.json({ error: "Generation was cancelled or timed out. Please try again." }, { status: 504, headers: privateHeaders });
  return Response.json({ error: "The image could not be generated. Please retry with a clear photo." }, { status: 500, headers: privateHeaders });
}

export async function GET(request: Request) {
  try {
    if (HANDOFF) return Response.json((await live()).liveStatus(), { headers: privateHeaders });
    const { assertLocalRequest, generationStatus } = await server();
    assertLocalRequest(request);
    return Response.json(await generationStatus(), { headers: privateHeaders });
  } catch (error) { return await fail(error); }
}

export async function POST(request: Request) {
  try {
    const account = await generationAccount();
    if (account && !account.canGenerate) {
      return Response.json({ error: "You are out of credits. Get more on the pricing page to keep going." }, { status: 402, headers: privateHeaders });
    }

    let bytes: Uint8Array; let slug: string;
    if (HANDOFF) {
      const result = await (await live()).generateLive(request, { skipVisitorLimit: Boolean(account) });
      bytes = result.bytes; slug = result.slug;
    } else {
      const { assertLocalRequest, generateResult, readLimitedForm } = await server();
      assertLocalRequest(request, true);
      const result = await generateResult(await readLimitedForm(request), request.signal);
      bytes = result.bytes; slug = result.slug;
    }

    const headers: Record<string, string> = { ...privateHeaders, "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${slug}-result.png"` };
    if (account) {
      // Charge only now that there is a finished image. If the credits vanished in the meantime, the image is withheld.
      headers["X-Credits-Remaining"] = String(await chargeResult(account.token, slug));
      await saveCreation(account.token, slug, bytes);
    }
    return new Response(new Uint8Array(bytes), { headers });
  } catch (error) { return await fail(error); }
}
