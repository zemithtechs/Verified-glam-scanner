import type { MetadataRoute } from "next";
import { SITE } from "@/lib/catalog";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Beauty Styling",
    description: SITE.tagline,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#6d1a46",
    icons: [{ src: "/img/favicon.png", sizes: "144x144", type: "image/png" }],
  };
}
