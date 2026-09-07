import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../../services/ads/vg_ads_config.dart';
import '../../services/ads/vg_ads_manager.dart';

/// Dedicated bottom-of-screen ad slot — never place over tappable content,
/// navigation, or the camera/scan viewport. Renders nothing while loading
/// or if ads are off. Caller (VGAdBanner) decides Pro-gating and platform.
class VGBannerAdContainer extends StatefulWidget {
  const VGBannerAdContainer({super.key});

  @override
  State<VGBannerAdContainer> createState() => _VGBannerAdContainerState();
}

class _VGBannerAdContainerState extends State<VGBannerAdContainer> {
  BannerAd? _bannerAd;
  bool _loadStarted = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loadStarted || !VGAdsConfig.adStatus) return;
    _loadStarted = true;
    final width = MediaQuery.of(context).size.width.truncate();
    debugPrint('VGBannerAdContainer: starting load, width=$width');
    _load(width);
  }

  Future<void> _load(int adWidthDp) async {
    final ad = await VGAdsManager.instance.loadBannerAd(adWidthDp);
    if (!mounted || ad == null) {
      ad?.dispose();
      return;
    }
    setState(() => _bannerAd = ad);
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ad = _bannerAd;
    if (!VGAdsConfig.adStatus || ad == null) return const SizedBox.shrink();
    // Full device width, compact adaptive height — no reserved space,
    // no side margin.
    return SizedBox(
      width: double.infinity,
      height: ad.size.height.toDouble(),
      child: AdWidget(ad: ad),
    );
  }
}
