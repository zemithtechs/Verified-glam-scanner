import { notFound } from "next/navigation";
import { GLYPHS, Glyph, IconTile } from "@/components/icons";
import { HANDOFF } from "@/lib/live-mode";
export const metadata = { title: "Icon sheet", robots: { index: false, follow: false } };
export default function Sheet() {
  if (HANDOFF) notFound(); // design-review page, not part of the public site
  return <div style={{ padding: 24, background: "#fff" }}><div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 16 }}>
    {Object.keys(GLYPHS).map((k) => <div key={k} style={{ textAlign: "center", fontSize: 10 }}><IconTile size={56}><Glyph name={k} size={32} /></IconTile><div style={{ marginTop: 4 }}><Glyph name={k} size={20} /></div>{k}</div>)}
  </div></div>;
}
