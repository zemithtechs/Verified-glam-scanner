const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.verifiedglam.beauty_scanner";

export function GooglePlayBadge({ className = "h-[46px]" }: { className?: string }) {
  return (
    <a href={GOOGLE_PLAY_URL} rel="noopener noreferrer" className="inline-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/google-play-badge.svg" alt="Get it on Google Play" className={`w-auto ${className}`} />
    </a>
  );
}
