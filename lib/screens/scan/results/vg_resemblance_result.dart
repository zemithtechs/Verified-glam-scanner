import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../components/vg/results/vg_face_comparison_overlay.dart';
import '../../../components/vg/results/vg_face_comparison_score_badge.dart';
import '../../../components/vg/results/vg_face_photo_hero.dart';
import '../../../components/vg/results/vg_result_scaffold.dart';
import '../../../components/vg/results/vg_skin_concern_overlay.dart';
import '../../../models/vg_feature_model.dart';
import '../../../models/vg_scan_result.dart';
import '../../../services/vg_result_overlay_service.dart';
import '../../../utils/BMColors.dart';
import '../../../utils/vg_copy.dart';
import '../../../utils/vg_payload_values.dart';

class VGResemblanceResult extends StatelessWidget {
  final VGScanResult result;
  final VGFeatureModel feature;

  const VGResemblanceResult({super.key, required this.result, required this.feature});

  @override
  Widget build(BuildContext context) {
    final p = result.payload;
    final similarity = VGPayloadValues.asIntOr(p['similarity'], 0);
    final scoreLabel =
        p['scoreLabel'] as String? ?? VGCopy.scoreLabelForRelationship('sibling');
    final faces = VGPayloadValues.asMapList(p['faces']);
    final contourComparison =
        p['contourComparison'] as String? ?? p['note']?.toString() ?? '';
    final explanation = p['explanation'] as String? ?? '';
    final sharedTraits = VGPayloadValues.asStringList(p['sharedTraits']);
    final concernAnnotations = VGResultOverlayService.concernAnnotations(p);

    return VGResultScaffold(
      result: result,
      feature: feature,
      hero: VGFacePhotoHero(
        photoPath: result.photoPath,
        passport: true,
        overlay: Stack(
          fit: StackFit.expand,
          children: [
            VGFaceComparisonOverlay(faces: faces),
            VGSkinConcernOverlay(annotations: concernAnnotations),
          ],
        ),
      ),
      children: [
        Text(
          VGCopy.resultContourComparison,
          style: boldTextStyle(size: 13, color: bmSpecialColorDark),
        ),
        6.height,
        Text(
          contourComparison,
          style: primaryTextStyle(size: 13, height: 1.45),
        ),
        16.height,
        VGFaceComparisonScoreBadge(scoreLabel: scoreLabel, similarity: similarity),
        16.height,
        Text(
          VGCopy.resultFaceComparisonExplanation,
          style: boldTextStyle(size: 13, color: bmSpecialColorDark),
        ),
        6.height,
        Text(
          explanation,
          style: primaryTextStyle(size: 13, height: 1.45),
        ),
        if (sharedTraits.isNotEmpty) ...[
          12.height,
          ...sharedTraits.map(
            (t) => Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.check_circle_outline, size: 16, color: bmSpecialColor),
                  6.width,
                  Expanded(child: Text(t, style: primaryTextStyle(size: 12))),
                ],
              ),
            ),
          ),
        ],
        12.height,
        Text(
          'This comparison is a playful, AI-estimated similarity reading — not a biometric, forensic, or scientific identity match.',
          style: secondaryTextStyle(size: 11, height: 1.35),
        ),
      ],
    );
  }
}
