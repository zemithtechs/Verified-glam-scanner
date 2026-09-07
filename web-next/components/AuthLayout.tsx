import Link from "next/link";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
        style={{ background: "linear-gradient(135deg, #872B3F 0%, #C79A9A 100%)" }}
      >
        <Link href="/" className="text-2xl font-bold">
          Verified Glam
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            AI beauty analysis from your selfie
          </h1>
          <p className="text-white/85 text-lg leading-relaxed max-w-md">
            10 AI beauty scans, symmetry scoring, celebrity look-alikes, and a personalized
            glow-up plan — saved and synced across devices with Pro.
          </p>
        </div>
        <p className="text-white/60 text-sm">&copy; {new Date().getFullYear()} Verified Glam</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-2xl font-bold text-(--color-burgundy-dark)">
              Verified Glam
            </Link>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--color-burgundy-dark)">{title}</h2>
          <p className="mt-2 text-(--color-text-muted)">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
