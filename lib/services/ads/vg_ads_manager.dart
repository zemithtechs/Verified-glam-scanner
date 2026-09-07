import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:nb_utils/nb_utils.dart';

import 'vg_ads_config.dart';

const _interstitialCounterKey = 'vg_ads_interstitial_counter';

/// The only place in the codebase that talks to the AdMob SDK directly.
/// Every screen that wants an ad calls into this instance instead of
/// touching google_mobile_ads itself — keeps ad-unit IDs and load/show
/// logic in one swappable place (see VGAdsConfig).
class VGAdsManager {
  VGAdsManager._();
  static final VGAdsManager instance = VGAdsManager._();

  bool _sdkInitialized = false;
  InterstitialAd? _interstitialAd;
  bool _loadingInterstitial = false;
  RewardedInterstitialAd? _rewardedInterstitialAd;
  bool _loadingRewardedInterstitial = false;

  Future<void> initialize() async {
    if (_sdkInitialized || !VGAdsConfig.adStatus) return;
    _sdkInitialized = true;
    try {
      final status = await MobileAds.instance.initialize();
      debugPrint('VGAdsManager: SDK initialized — adapter statuses: '
          '${status.adapterStatuses.map((k, v) => MapEntry(k, v.description))}');
      _loadInterstitialAd();
      _loadRewardedInterstitialAd();
    } catch (e) {
      debugPrint('VGAdsManager: init failed: $e');
    }
  }

  void _loadInterstitialAd() {
    if (!VGAdsConfig.adStatus || _loadingInterstitial) return;
    _loadingInterstitial = true;
    debugPrint('VGAdsManager: requesting interstitial (${VGAdsConfig.interstitialAdUnitId})');
    InterstitialAd.load(
      adUnitId: VGAdsConfig.interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          debugPrint('VGAdsManager: interstitial loaded');
          _loadingInterstitial = false;
          _interstitialAd = ad;
          ad.fullScreenContentCallback = FullScreenContentCallback(
            // Preload the next interstitial immediately so one is always
            // ready by the next natural breakpoint, instead of loading
            // on-demand and making the user wait.
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              _interstitialAd = null;
              _loadInterstitialAd();
            },
            onAdFailedToShowFullScreenContent: (ad, error) {
              debugPrint('VGAdsManager: interstitial failed to show: $error');
              ad.dispose();
              _interstitialAd = null;
              _loadInterstitialAd();
            },
          );
        },
        onAdFailedToLoad: (error) {
          debugPrint('VGAdsManager: interstitial failed to load: $error');
          _loadingInterstitial = false;
          _interstitialAd = null;
        },
      ),
    );
  }

  /// Call from a natural breakpoint only (finishing a scan, leaving a heavy
  /// screen) — never mid-task. Shows roughly 1-in-[VGAdsConfig.interstitialInterval];
  /// silently loads a fresh ad instead of showing/crashing if none is ready.
  Future<void> maybeShowInterstitial() async {
    if (!VGAdsConfig.adStatus) return;

    final counter = getIntAsync(_interstitialCounterKey, defaultValue: 1);
    debugPrint('VGAdsManager: maybeShowInterstitial counter=$counter/${VGAdsConfig.interstitialInterval}');
    if (counter < VGAdsConfig.interstitialInterval) {
      await setValue(_interstitialCounterKey, counter + 1);
      return;
    }
    await setValue(_interstitialCounterKey, 1);

    final ad = _interstitialAd;
    if (ad == null) {
      debugPrint('VGAdsManager: interstitial not ready yet, reloading for next time');
      _loadInterstitialAd();
      return;
    }
    debugPrint('VGAdsManager: showing interstitial');
    _interstitialAd = null;
    await ad.show();
  }

  void _loadRewardedInterstitialAd() {
    if (!VGAdsConfig.adStatus || _loadingRewardedInterstitial) return;
    _loadingRewardedInterstitial = true;
    debugPrint('VGAdsManager: requesting rewarded interstitial (${VGAdsConfig.rewardedInterstitialAdUnitId})');
    RewardedInterstitialAd.load(
      adUnitId: VGAdsConfig.rewardedInterstitialAdUnitId,
      request: const AdRequest(),
      rewardedInterstitialAdLoadCallback: RewardedInterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          debugPrint('VGAdsManager: rewarded interstitial loaded');
          _loadingRewardedInterstitial = false;
          _rewardedInterstitialAd = ad;
        },
        onAdFailedToLoad: (error) {
          debugPrint('VGAdsManager: rewarded interstitial failed to load: $error');
          _loadingRewardedInterstitial = false;
          _rewardedInterstitialAd = null;
        },
      ),
    );
  }

  /// Shows the rewarded interstitial and waits for the outcome. Returns
  /// true only if onUserEarnedReward actually fired (closing early or a
  /// show failure both return false) — callers must treat false as "stay
  /// locked, do not call the paid API", per AdMob's own reward contract.
  /// Always preloads the next ad afterward so one is ready next time.
  Future<bool> showRewardedInterstitialForReward() async {
    if (!VGAdsConfig.adStatus) return false;

    final ad = _rewardedInterstitialAd;
    if (ad == null) {
      debugPrint('VGAdsManager: rewarded interstitial not ready — loading for next time');
      _loadRewardedInterstitialAd();
      return false;
    }
    _rewardedInterstitialAd = null;

    final completer = Completer<bool>();
    var earned = false;

    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _loadRewardedInterstitialAd();
        if (!completer.isCompleted) completer.complete(earned);
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        debugPrint('VGAdsManager: rewarded interstitial failed to show: $error');
        ad.dispose();
        _loadRewardedInterstitialAd();
        if (!completer.isCompleted) completer.complete(false);
      },
    );

    await ad.show(
      onUserEarnedReward: (adWithoutView, reward) {
        debugPrint('VGAdsManager: reward earned (${reward.amount} ${reward.type})');
        earned = true;
      },
    );

    return completer.future;
  }

  /// Loads a banner sized to the full device width at the compact
  /// (non-"large") adaptive height — spans edge to edge with no side
  /// margin, and stays close to the classic 50dp banner height instead of
  /// the taller "large" adaptive variant, which reserves more vertical
  /// space than a simple creative fills. Returns null on failure (caller
  /// should render nothing rather than a placeholder box).
  Future<BannerAd?> loadBannerAd(int adWidthDp) async {
    if (!VGAdsConfig.adStatus) {
      debugPrint('VGAdsManager: banner skipped — adStatus is off');
      return null;
    }
    // ignore: deprecated_member_use
    final size = await AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(adWidthDp);
    if (size == null) {
      debugPrint('VGAdsManager: banner skipped — no adaptive size for width $adWidthDp');
      return null;
    }
    debugPrint('VGAdsManager: requesting banner ${size.width}x${size.height} (${VGAdsConfig.bannerAdUnitId})');

    final completer = Completer<BannerAd?>();
    final ad = BannerAd(
      adUnitId: VGAdsConfig.bannerAdUnitId,
      size: size,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (loadedAd) {
          debugPrint('VGAdsManager: banner loaded');
          completer.complete(loadedAd as BannerAd);
        },
        onAdFailedToLoad: (loadedAd, error) {
          debugPrint('VGAdsManager: banner failed to load: $error');
          loadedAd.dispose();
          completer.complete(null);
        },
      ),
    );
    ad.load();
    return completer.future;
  }
}
