/// Every AdMob ad-unit ID lives here, never inlined anywhere else — swapping
/// test IDs for real ones before a Play Console submission is a change of
/// exactly one line per ad format.
class VGAdsConfig {
  VGAdsConfig._();

  /// Global kill switch — flip to false to disable all ads app-wide without
  /// touching any other code.
  /// TEMPORARILY OFF for the Play Store submission/review period — AdMob
  /// policy requires test ad units only be shown to registered test devices,
  /// not real end users (which includes Google's own reviewers). Flip back
  /// to true once the app is approved and the real ad unit IDs below are in.
  static const bool adStatus = false;

  // Google's public test ad unit IDs (same for every developer, safe to tap
  // freely). Do NOT replace these with real IDs except immediately before a
  // Play Console submission, on a machine no one will tap-test afterward.
  static const String bannerAdUnitId = 'ca-app-pub-3940256099942544/6300978111';
  static const String interstitialAdUnitId = 'ca-app-pub-3940256099942544/1033173712';
  static const String nativeAdUnitId = 'ca-app-pub-3940256099942544/2247696110';
  static const String appOpenAdUnitId = 'ca-app-pub-3940256099942544/3419835294';
  // Gates each free Face Beauty Analysis scan (see VGAdsManager.showRewardedInterstitialForReward
  // and worker-api/src/lib/reward-tokens.ts). A plain Rewarded ad unit can
  // replace this later — kept as its own constant for that swap.
  static const String rewardedInterstitialAdUnitId = 'ca-app-pub-3940256099942544/5354046379';

  /// Show roughly 1-in-N interstitial opportunities (see VGAdsManager.maybeShowInterstitial).
  static const int interstitialInterval = 3;

  /// TEMPORARY test override — shows ads to Pro accounts too, so ad
  /// placement can be previewed without downgrading a real Pro account.
  /// Must be false before shipping; ad-free is a paid Pro benefit.
  static const bool forceShowForTesting = false;
}
