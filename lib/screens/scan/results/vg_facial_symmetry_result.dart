import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../components/vg/results/vg_face_photo_hero.dart';
import '../../../components/vg/results/vg_overall_score_bar.dart';
import '../../../components/vg/results/vg_region_outline_painter.dart';
import '../../../components/vg/results/vg_result_scaffold.dart';
import '../../../components/vg/results/vg_symmetry_callout_overlay.dart';
import '../../../components/vg/results/vg_symmetry_grid_overlay.dart';
import '../../../components/vg/results/vg_symmetry_metrics_card.dart';
import '../../../models/vg_feature_model.dart';
import '../../../models/vg_scan_result.dart';
import '../../../utils/vg_copy.dart';
import '../../../utils/vg_payload_lists.dart';
import '../../../utils/vg_payload_values.dart';

class VGFacialSymmetryResult extends StatelessWidget {
  final VGScanResult result;
  final VGFeatureModel feature;

  const VGFacialSymmetryResult({super.key, required this.result, required this.feature});

  @override
  Widget build(BuildContext context) {
    final p = result.payload;
    final regions = VGPayloadLists.maps(p, 'regions');
    final guides = VGPayloadValues.asMap(p['guides']);
    final subscores = VGPayloadValues.asMap(p['subscores']);
    final overallScore = VGPayloadValues.displayPercent(
      p,
      p['overallSymmetryScore'] ?? p['overallPercent'],
      fallback: 82,
    ).toDouble();

    return VGResultScaffold(
      result: result,
      feature: feature,
      hero: VGFacePhotoHero(
        photoPath: result.photoPath,
        passport: true,
        overlay: Stack(
          fit: StackFit.expand,
          children: [
            VGSymmetryGridOverlay(guides: guides),
            CustomPaint(
              painter: VGRegionOutlinePainter(regions: regions),
              size: Size.infinite,
            ),
            VGSymmetryCalloutOverlay(regions: regions),
          ],
        ),
      ),
      children: [
        16.height,
        VGOverallScoreBar(
          label: VGCopy.resultOverallSymmetryRating,
          score: overallScore,
        ),
        12.height,
        VGSymmetryMetricsCard(
          overallScore: overallScore,
          subscores: subscores,
          photoPath: result.photoPath,
        ),
        12.height,
        Text(
          'This symmetry reading is an AI estimation from a single photo, for entertainment and self-reflection — not a medical or scientific assessment.',
          style: secondaryTextStyle(size: 11, height: 1.35),
        ),
      ],
    );
  }
}
