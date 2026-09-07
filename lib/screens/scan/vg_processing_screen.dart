import 'dart:async';

import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../components/vg/scan/vg_face_tracking_overlay.dart';
import '../../components/vg/scan/vg_scan_error_dialog.dart';
import '../../components/vg/vg_passport_photo_frame.dart';
import '../../components/vg/vg_pill_button.dart';
import '../../models/vg_feature_model.dart';
import '../../models/vg_scan_result.dart';
import '../../services/ads/vg_reward_service.dart';
import '../../services/vg_analysis_mode.dart';
import '../../services/vg_analysis_service.dart';
import '../../services/vg_analytics_service.dart';
import '../../services/vg_connectivity_service.dart';
import '../../services/vg_subscription_store.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_constants.dart';
import '../../utils/vg_copy.dart';
import '../../utils/vg_error_utils.dart';
import '../../utils/vg_navigation.dart';
import 'vg_results_screen.dart';

class VGProcessingScreen extends StatefulWidget {
  final VGFeatureModel feature;
  final String photoPath;

  const VGProcessingScreen({super.key, required this.feature, required this.photoPath});

  @override
  State<VGProcessingScreen> createState() => _VGProcessingScreenState();
}

class _VGProcessingScreenState extends State<VGProcessingScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  double _progress = 0;

  // Free Face Beauty Analysis is gated per-scan by a watched rewarded ad
  // (see VGRewardService) — every other feature is Pro-only and already
  // blocked before reaching this screen (see vgStartAnalysis), so it never
  // needs this prompt.
  bool _showRewardPrompt = false;
  bool _rewardAdLoading = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1800))..repeat(reverse: true);
    VGAnalyticsService.logScanStarted(widget.feature.featureType);
    _checkRewardGate();
  }

  Future<void> _checkRewardGate() async {
    final needsAd = widget.feature.featureType == VGFeatureTypes.faceBeautyAnalysis &&
        VGAnalysisMode.isLiveAnalysis &&
        !(await VGSubscriptionStore.isPro());
    if (!mounted) return;
    if (needsAd) {
      setState(() => _showRewardPrompt = true);
      return;
    }
    _run();
  }

  Future<void> _watchAdAndUnlock() async {
    setState(() => _rewardAdLoading = true);
    final token = await VGRewardService.earnRewardToken(widget.feature.featureType);
    if (!mounted) return;
    if (token == null) {
      setState(() => _rewardAdLoading = false);
      toast(VGCopy.rewardAdNotEarned);
      return;
    }
    setState(() {
      _showRewardPrompt = false;
      _rewardAdLoading = false;
    });
    _run(rewardToken: token);
  }

  Future<void> _run({String? rewardToken}) async {
    final blockReason = VGAnalysisMode.blockReason;
    if (blockReason != null) {
      if (!mounted) return;
      await _showFailure(VGAnalysisFailure(message: blockReason));
      return;
    }

    if (VGAnalysisMode.isLiveAnalysis) {
      final online = await VGConnectivityService.isOnline();
      if (!online) {
        if (!mounted) return;
        await _showFailure(
          const VGAnalysisFailure(
            message: VGCopy.scanOfflineMessage,
            errorCode: 'NETWORK_ERROR',
          ),
        );
        return;
      }
    }

    for (var i = 1; i <= 20; i++) {
      await Future.delayed(const Duration(milliseconds: 120));
      if (!mounted) return;
      setState(() => _progress = i / 20);
    }
    VGScanResult result;
    try {
      result = await VGAnalysisService.runAnalysis(
        feature: widget.feature,
        photoPath: widget.photoPath,
        rewardToken: rewardToken,
      );
    } catch (e) {
      if (!mounted) return;
      await _showFailure(vgParseAnalysisError(e));
      return;
    }
    if (!mounted) return;
    try {
      await vgMaybeShowAdBeforeResults(context);
    } catch (_) {
      // Ad/network failures should never block result navigation.
    }
    if (!mounted) return;
    VGAnalyticsService.logScanCompleted(widget.feature.featureType, result.payload);
    await VGResultsScreen(result: result, feature: widget.feature).launch(context);
    if (mounted) finish(context);
  }

  Future<void> _showFailure(VGAnalysisFailure failure) async {
    VGAnalyticsService.logScanFailed(widget.feature.featureType, failure.errorCode);
    final retry = await showVGScanErrorDialog(context, failure: failure);
    if (!mounted) return;
    if (retry == true) {
      finish(context);
    } else {
      finish(context);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1216),
      body: SafeArea(
        child: _showRewardPrompt ? _rewardPromptBody() : _processingBody(),
      ),
    );
  }

  Widget _rewardPromptBody() {
    return Column(
      children: [
        24.height,
        Text(
          VGCopy.rewardAdPromptTitle,
          style: boldTextStyle(color: Colors.white, size: 20),
          textAlign: TextAlign.center,
        ),
        8.height,
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Text(
            VGCopy.rewardAdPromptSubtitle,
            style: secondaryTextStyle(color: Colors.white70, size: 13),
            textAlign: TextAlign.center,
          ),
        ),
        const Spacer(),
        SizedBox(
          width: 220,
          height: 280,
          child: VGPassportPhotoFrame(
            photoPath: widget.photoPath,
            size: 220,
            overlay: const VGPhotoCaptureReviewOverlay(
              faceBounds: null,
              previewSize: Size(220, 280),
              scanning: false,
              ready: false,
              faceDetected: true,
            ),
          ),
        ),
        const Spacer(flex: 2),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: VGPillButton(
            label: _rewardAdLoading ? VGCopy.rewardAdLoading : VGCopy.rewardAdWatchButton,
            enabled: !_rewardAdLoading,
            onTap: _watchAdAndUnlock,
          ),
        ),
        24.height,
      ],
    );
  }

  Widget _processingBody() {
    return Column(
      children: [
        24.height,
        Text(
          VGCopy.processingTitle,
          style: boldTextStyle(color: Colors.white, size: 20),
          textAlign: TextAlign.center,
        ),
        8.height,
        Text(
          VGCopy.processingSubtitle,
          style: secondaryTextStyle(color: Colors.white70, size: 13),
          textAlign: TextAlign.center,
        ),
        const Spacer(),
        SizedBox(
          width: 220,
          height: 280,
          child: VGPassportPhotoFrame(
            photoPath: widget.photoPath,
            size: 220,
            overlay: VGPhotoCaptureReviewOverlay(
              faceBounds: null,
              previewSize: const Size(220, 280),
              scanning: true,
              ready: false,
              faceDetected: true,
            ),
          ),
        ),
        24.height,
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: LinearProgressIndicator(
            value: _progress,
            backgroundColor: Colors.white24,
            color: bmPrimaryColor,
            minHeight: 6,
            borderRadius: BorderRadius.circular(999),
          ),
        ),
        const Spacer(flex: 2),
      ],
    );
  }
}
