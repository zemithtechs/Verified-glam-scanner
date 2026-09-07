import '../supabase/vg_api_client.dart';
import 'vg_ads_manager.dart';

/// Bridges "watched a rewarded interstitial" (VGAdsManager) to "the server
/// will actually accept one free analysis" (worker-api's reward_tokens
/// table) — a client-side earned-reward flag alone can't gate a paid API
/// call, since a modified client could just claim it earned one.
class VGRewardService {
  VGRewardService._();

  /// Shows the rewarded interstitial; only on a real earned reward does it
  /// exchange that for a single-use server token. Returns null if the user
  /// closed the ad early, it failed to show, or the token mint failed —
  /// callers must not proceed to analyze() in that case.
  static Future<String?> earnRewardToken(String featureType) async {
    final earned = await VGAdsManager.instance.showRewardedInterstitialForReward();
    if (!earned) return null;

    try {
      final data = await VGApiClient.post('/api/ads/reward', body: {'featureType': featureType});
      return data['rewardToken'] as String?;
    } catch (_) {
      return null;
    }
  }
}
