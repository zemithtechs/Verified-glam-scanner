import Image from "next/image";

export function HomeHeroVisuals() {
  return <div className="relative mx-auto w-full max-w-[660px]"><Image src="/images/hero-phones-v2.png" alt="Verified Glam - Beauty Scanner mobile app with beauty analysis, symmetry, and glow-up screens" width={1456} height={1088} priority className="h-auto w-full" sizes="(min-width: 1024px) 660px, 100vw" /></div>;
}
