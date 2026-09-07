import { PhotonImage, resize, SamplingFilter } from "@cf-wasm/photon";

// Port of analyze-scan's prepareImageBytes() — the only image operation
// analyze-scan actually needs (see docs/CLOUDFLARE_MIGRATION_PLAN.md's
// @cf-wasm/photon spike): decode, downscale proportionally if over maxEdge,
// re-encode as JPEG. Deno's `imagescript` (Image.decode/.resize/.encodeJPEG)
// is replaced 1:1 by Photon's workerd-native WASM build.
export async function prepareImageBytes(
  bytes: Uint8Array,
  mime: string,
  maxEdge = 1280,
): Promise<{ bytes: Uint8Array; mime: string }> {
  try {
    const img = PhotonImage.new_from_byteslice(bytes);
    const width = img.get_width();
    const height = img.get_height();

    let out = img;
    if (Math.max(width, height) > maxEdge) {
      const scale = maxEdge / Math.max(width, height);
      const newWidth = Math.max(1, Math.round(width * scale));
      const newHeight = Math.max(1, Math.round(height * scale));
      // Triangle (bilinear) instead of CatmullRom — meaningfully cheaper in
      // CPU time with no real quality loss for AI vision input; matters a
      // lot on the Workers free plan's 10ms-per-request CPU cap, which this
      // resize step (run on every analyze call, regardless of feature) eats
      // a large share of.
      out = resize(img, newWidth, newHeight, SamplingFilter.Triangle);
    }

    const jpegBytes = out.get_bytes_jpeg(85);
    return { bytes: jpegBytes, mime: "image/jpeg" };
  } catch (e) {
    console.warn("prepareImageBytes: decode/resize failed, using original", e);
    return { bytes, mime: mime || "image/jpeg" };
  }
}
