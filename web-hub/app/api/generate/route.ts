import { HANDOFF } from "@/lib/live-mode";

// The generator only exists for local development. On the deployed site it is switched off and never loaded.
const notAvailable = () => Response.json({ error: "Not available." }, { status: 404, headers: { "Cache-Control": "no-store" } });
const server = () => import("@/lib/generation-server");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
const privateHeaders = { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" };

async function fail(error: unknown) {
  const { GenerationError } = await server();
  if (error instanceof GenerationError) return Response.json({ error: error.message }, { status: error.status, headers: privateHeaders });
  if (error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name)) return Response.json({ error: "Generation was cancelled or timed out. OpenAI may still charge for work already started." }, { status: 504, headers: privateHeaders });
  return Response.json({ error: "The image could not be generated. Please retry with a clear photo." }, { status: 500, headers: privateHeaders });
}

export async function GET(request: Request) {
  if (HANDOFF) return notAvailable();
  try { const { assertLocalRequest, generationStatus } = await server(); assertLocalRequest(request); return Response.json(await generationStatus(), { headers: privateHeaders }); }
  catch (error) { return await fail(error); }
}

export async function POST(request: Request) {
  if (HANDOFF) return notAvailable();
  try {
    const { assertLocalRequest, generateResult, readLimitedForm } = await server();
    assertLocalRequest(request, true);
    const result = await generateResult(await readLimitedForm(request), request.signal);
    return new Response(new Uint8Array(result.bytes), { headers: {
      ...privateHeaders, "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${result.slug}-result.png"`,
    } });
  } catch (error) { return await fail(error); }
}
