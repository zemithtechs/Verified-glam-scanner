import Link from "next/link";
import { myCreations, requireProfile } from "@/lib/account";
import { toolBySlug } from "@/lib/catalog";
import { CreationActions } from "./CreationActions";

export const dynamic = "force-dynamic";

const when = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function Creations() {
  await requireProfile("/app/creations");
  const items = await myCreations();
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">My creations</h1>
      <p className="mt-1 text-muted">Results you make while logged in are saved here. We keep your latest 100. Delete any item at any time.</p>
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-10 text-center"><p className="font-semibold">Nothing saved yet</p><p className="mt-1 text-sm text-muted">Make a result with any tool and it will appear here.</p><Link href="/tools" className="mt-4 inline-block rounded-full bg-plum px-5 py-2.5 text-sm font-bold text-white">Browse tools</Link></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-line bg-white">
              <a href={`/api/proxy/creations/${c.id}/image`} target="_blank" rel="noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/proxy/creations/${c.id}/image`} alt={`${c.tool_name} result`} loading="lazy" className="aspect-video w-full bg-[#faf9f8] object-contain" />
              </a>
              <div className="p-3 text-center"><Link href={`/${c.tool_slug}`} className="text-sm font-semibold hover:text-plum">{toolBySlug(c.tool_slug)?.name ?? c.tool_name}</Link><p className="mt-1 text-xs text-muted">{when(c.created_at)}</p></div>
              <CreationActions id={c.id} slug={c.tool_slug} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
