import { HANDOFF } from "@/lib/live-mode";

// Two implementations behind one URL, so the page works the same everywhere:
//  - local development: lib/generation-server.ts (your computer only, uses your local key)
//  - deployed site:     lib/generation-live.ts (Cloudflare, with free-result limits)
// Each is loaded only where it is used.
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
    if (HANDOFF) {
      const result = await (await live()).generateLive(request);
      return new Response(new Uint8Array(result.bytes), { headers: { ...privateHeaders, "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${result.slug}-result.png"` } });
    }
    const { assertLocalRequest, generateResult, readLimitedForm } = await server();
    assertLocalRequest(request, true);
    const result = await generateResult(await readLimitedForm(request), request.signal);
    return new Response(new Uint8Array(result.bytes), { headers: {
      ...privateHeaders, "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${result.slug}-result.png"`,
    } });
  } catch (error) { return await fail(error); }
}
