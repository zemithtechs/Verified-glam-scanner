import { isSignedIn } from "@/lib/is-signed-in";
import { MarketingHeader } from "./MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";

export async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isSignedIn();
  return (
    <div className="flex flex-col min-h-screen bg-(--color-blush)">
      <MarketingHeader isSignedIn={signedIn} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
