import { ImageResponse } from "next/og";
import { SITE } from "@/lib/catalog";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image for every page without its own (plum and blush brand colours). */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", background: "linear-gradient(135deg, #6d1a46 0%, #8c2a5c 100%)", color: "#ffffff" }}>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, textTransform: "uppercase", color: "#f9dce8" }}>AI beauty tools for your photo</div>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>{SITE.name}</div>
        <div style={{ display: "flex", fontSize: 40, lineHeight: 1.3, marginTop: 28, color: "#fdeef4", maxWidth: 900 }}>{SITE.tagline}</div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 30, color: "#f9dce8" }}>{SITE.domain}</div>
      </div>
    ),
    { ...size },
  );
}
