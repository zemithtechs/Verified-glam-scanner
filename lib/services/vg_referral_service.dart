import 'dart:math';

import 'package:nb_utils/nb_utils.dart';

import '../models/vg_feature_model.dart';
import '../models/vg_scan_result.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_copy.dart';
import '../utils/vg_payload_values.dart';
import 'backend/vg_backend_config.dart';
import 'backend/vg_backend_init.dart';
import 'backend/vg_profile_repository.dart';
import 'vg_referral_bonus_store.dart';

class VGReferralService {
  static Future<String> referralCode() async {
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      final remote = await VGProfileRepository.referralCode();
      if (remote != null && remote.isNotEmpty) return remote;
    }

    var code = getStringAsync(vgReferralCodeKey);
    if (code.isNotEmpty) return code;

    code = _generateCode();
    await setValue(vgReferralCodeKey, code);
    return code;
  }

  static Future<String> referralLink() async {
    final code = await referralCode();
    return '$vgUnilinkBaseUrl?ref=$code';
  }

  static Future<int> downloadCount() async {
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      return VGProfileRepository.referralDownloadCount();
    }
    return getIntAsync(vgReferralDownloadCountKey, defaultValue: 0);
  }

  static Future<int> incrementDownloadCount() async {
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      final count = await VGProfileRepository.incrementReferralDownloadCount();
      await setValue(vgReferralDownloadCountKey, count);
      return count;
    }
    final count = await downloadCount() + 1;
    await setValue(vgReferralDownloadCountKey, count);
    return count;
  }

  static Future<bool> isRedeemed() async {
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      final remote = await VGProfileRepository.isReferralBonusRedeemedRemote();
      if (remote) {
        await setValue(vgReferralBonusRedeemedKey, true);
        return true;
      }
    }
    return getBoolAsync(vgReferralBonusRedeemedKey, defaultValue: false);
  }

  static Future<bool> canRedeem() async {
    if (await isRedeemed()) return false;
    final count = await downloadCount();
    return count >= vgReferralRewardThreshold;
  }

  static Future<bool> redeemReward() async {
    if (!await canRedeem()) return false;
    await setValue(vgReferralBonusRedeemedKey, true);
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      await VGProfileRepository.setReferralBonusRedeemed(
        bonusScans: vgReferralBonusScanAmount,
      );
    }
    await VGReferralBonusStore.addBonusScans(vgReferralBonusScanAmount);
    return true;
  }

  static Future<String> celebrityShareMessage({
    required String topMatchName,
    required int topMatchPercent,
  }) async {
    final link = await referralLink();
    return VGCopy.celebrityShareMessage(
      matchName: topMatchName,
      matchPercent: topMatchPercent,
      referralLink: link,
    );
  }

  static Future<String> shareMessageForResult(VGScanResult result, VGFeatureModel feature) async {
    final p = result.payload;
    final link = await referralLink();

    if (feature.featureType == VGFeatureTypes.celebrityLookalike) {
      final matches = (p['matches'] as List?)?.cast<Map<String, dynamic>>() ?? [];
      final top = matches.isNotEmpty ? matches.first : null;
      return await celebrityShareMessage(
        topMatchName: top?['name']?.toString() ?? 'a celebrity',
        topMatchPercent: (top?['percent'] as num?)?.round() ?? 0,
      );
    }

    if (feature.featureType == VGFeatureTypes.facialResemblance) {
      return VGCopy.faceComparisonShareMessage(
        scoreLabel: p['scoreLabel'] as String? ?? VGCopy.scoreLabelForRelationship('sibling'),
        similarity: VGPayloadValues.asIntOr(p['similarity'], 0),
        referralLink: link,
      );
    }

    if (feature.featureType == VGFeatureTypes.beautyScoreShowdown) {
      return VGCopy.showdownShareMessage(
        yourScore: (p['yourScore'] as num?)?.toDouble() ?? 0,
        rankPosition: (p['rankPosition'] as num?)?.round() ?? 0,
        totalParticipants: (p['totalParticipants'] as num?)?.round() ?? 0,
        referralLink: link,
      );
    }

    if (feature.featureType == VGFeatureTypes.faceReading) {
      return VGCopy.attractivenessShareMessage(
        overallScore: (p['overallScore'] as num?)?.toDouble() ?? 0,
        tierLabel: p['tierLabel'] as String? ??
            VGCopy.attractivenessTierFor((p['overallScore'] as num?)?.toDouble() ?? 0),
        referralLink: link,
      );
    }

    if (feature.featureType == VGFeatureTypes.goldenRatio) {
      final goldenRatioIndex = VGPayloadValues.asIntOr(
        p['goldenRatioIndex'] ?? p['harmonyPercent'],
        0,
      );
      return VGCopy.goldenRatioShareMessage(
        overallScore: VGPayloadValues.asDoubleOr(p['overallScore'], 0),
        goldenRatioIndex: goldenRatioIndex,
        ratingLabel: p['ratingLabel'] as String? ??
            VGCopy.goldenRatioRatingFor(goldenRatioIndex),
        referralLink: link,
      );
    }

    if (feature.featureType == VGFeatureTypes.beautyTips) {
      final spots = (p['spots'] as List?)?.cast<Map<String, dynamic>>() ?? [];
      final labels = spots.map((s) => s['label']?.toString() ?? '').where((l) => l.isNotEmpty);
      final spotCount = spots.isNotEmpty ? spots.length : (p['findings'] as List?)?.length ?? 0;
      return VGCopy.beautyTipsShareMessage(
        spotCount: spotCount,
        labelsSummary: labels.toSet().take(3).join(', '),
        referralLink: link,
      );
    }

    final highlight = _highlightForPayload(feature.featureType, p);
    return VGCopy.genericShareMessage(
      featureTitle: feature.title,
      highlight: highlight,
      referralLink: link,
    );
  }

  static String _highlightForPayload(String featureType, Map<String, dynamic> p) {
    switch (featureType) {
      case VGFeatureTypes.faceBeautyAnalysis:
        return 'Beauty score ${(p['beautyScore'] as num?)?.round() ?? 0}/100.';
      case VGFeatureTypes.facialSymmetry:
        final score = VGPayloadValues.asDoubleOr(
          p['overallSymmetryScore'] ?? p['overallPercent'],
          0,
        );
        return 'Symmetry score ${score.toStringAsFixed(0)}%.';
      case VGFeatureTypes.colorAnalysis:
        return 'My season is ${p['season'] ?? 'personalized'}.';
      case VGFeatureTypes.goldenRatio:
        final score = VGPayloadValues.asDoubleOr(p['overallScore'], 0);
        final index = VGPayloadValues.asIntOr(
          p['goldenRatioIndex'] ?? p['harmonyPercent'],
          0,
        );
        final display = score == score.roundToDouble()
            ? score.toStringAsFixed(1)
            : score.toStringAsFixed(2);
        return '$display/10 · Golden Ratio Index $index/100';
      case VGFeatureTypes.beautyScoreShowdown:
        final rank = (p['rankPosition'] as num?)?.round() ?? 0;
        final total = (p['totalParticipants'] as num?)?.round() ?? 0;
        final score = (p['yourScore'] as num?)?.toDouble() ?? 0;
        return 'Ranked #$rank of $total with ${score.toStringAsFixed(2)}/10.';
      case VGFeatureTypes.faceReading:
        final score = (p['overallScore'] as num?)?.toDouble() ?? 0;
        final tier = p['tierLabel'] as String? ?? VGCopy.attractivenessTierFor(score);
        final display = score == score.roundToDouble()
            ? score.toStringAsFixed(1)
            : score.toStringAsFixed(2);
        return '$display/10 · $tier';
      case VGFeatureTypes.beautyTips:
        final spots = (p['spots'] as List?)?.length ?? 0;
        final count = spots > 0 ? spots : (p['findings'] as List?)?.length ?? 0;
        return '$count labeled spots · natural beauty tips';
      default:
        return 'Check out my results!';
    }
  }

  /// Local dev only — simulates a friend installing via referral link.
  static Future<int> mockRegisterDownload() async {
    if (!kVGLocalDevMode) return await downloadCount();
    return incrementDownloadCount();
  }

  static String _generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final random = Random();
    return List.generate(8, (_) => chars[random.nextInt(chars.length)]).join();
  }
}
