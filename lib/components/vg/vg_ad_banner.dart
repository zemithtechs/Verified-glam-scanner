import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../../services/ads/vg_ads_config.dart';
import '../../services/vg_subscription_store.dart';
import 'vg_banner_ad_container.dart';

/// Ad-free is a Pro benefit, so nothing renders for subscribers. AdMob's
/// Flutter SDK doesn't support web, so this also stays empty there — the
/// real ad only ever loads on Android/iOS (see VGBannerAdContainer).
class VGAdBanner extends StatelessWidget {
  const VGAdBanner({super.key});

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) return const SizedBox.shrink();
    return FutureBuilder<bool>(
      future: VGSubscriptionStore.isPro(),
      builder: (context, snapshot) {
        if (snapshot.data == true && !VGAdsConfig.forceShowForTesting) return const SizedBox.shrink();
        return const VGBannerAdContainer();
      },
    );
  }
}
