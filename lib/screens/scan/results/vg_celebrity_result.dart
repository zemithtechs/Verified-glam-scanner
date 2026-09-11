import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../components/vg/results/vg_celebrity_face_mesh_overlay.dart';
import '../../../components/vg/results/vg_celebrity_match_card.dart';
import '../../../components/vg/results/vg_face_photo_hero.dart';
import '../../../components/vg/results/vg_result_scaffold.dart';
import '../../../components/vg/results/vg_skin_concern_overlay.dart';
import '../../../models/vg_feature_model.dart';
import '../../../models/vg_scan_result.dart';
import '../../../services/vg_result_overlay_service.dart';
import '../../../utils/BMColors.dart';
import '../../../utils/vg_copy.dart';
import '../../../utils/vg_payload_lists.dart';
import '../../../utils/vg_payload_values.dart';

class VGCelebrityResult extends StatelessWidget {
  final VGScanResult result;
  final VGFeatureModel feature;

  const VGCelebrityResult({super.key, required this.result, required this.feature});

  static int _percentFromMatch(Map<String, dynamic> m) {
    final raw = m['percent'] ?? m['similarity'];
    return VGPayloadValues.asIntOr(raw, 0).clamp(62, 98);
  }

  @override
  Widget build(BuildContext context) {
    final p = result.payload;
    final matches = VGPayloadLists.maps(p, 'matches');
    final landmarks = VGPayloadLists.maps(p, 'landmarks');
    final meshConnections = VGPayloadLists.intPairs(p, 'meshConnections');
    final concernAnnotations = VGResultOverlayService.concernAnnotations(p);
    final disclaimer = p['disclaimer'] as String?;

    return VGResultScaffold(
      result: result,
      feature: feature,
      hero: VGFacePhotoHero(
        photoPath: result.photoPath,
        passport: true,
        overlay: Stack(
          fit: StackFit.expand,
          children: [
            if (landmarks.isNotEmpty && meshConnections.isNotEmpty)
              VGCelebrityFaceMeshOverlay(
                landmarks: landmarks,
                meshConnections: meshConnections,
              ),
            VGSkinConcernOverlay(annotations: concernAnnotations),
          ],
        ),
      ),
      children: [
        Text(VGCopy.resultYourPhoto, style: boldTextStyle(size: 15, color: bmSpecialColorDark)),
        10.height,
        Row(
          children: [
            Expanded(
              child: Text(
                VGCopy.resultCelebrityMatches,
                style: boldTextStyle(size: 15, color: bmSpecialColorDark),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: bmSpecialColorDark,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                VGCopy.resultCelebrityMatchBadge,
                style: boldTextStyle(color: Colors.white, size: 10),
              ),
            ),
          ],
        ),
        12.height,
        if (matches.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.3)),
            ),
            child: Text(
              VGCopy.resultCelebrityNoMatches,
              style: secondaryTextStyle(size: 13, height: 1.45),
            ),
          )
        else
          ...matches.map((m) {
            return VGCelebrityMatchCard(
              name: m['name']?.toString() ?? 'Celebrity',
              percent: _percentFromMatch(m),
              traits: (m['traits'] as List?)?.cast<String>() ?? [],
              why: m['why']?.toString(),
              imageAsset: m['imageAsset']?.toString(),
              imageUrl: m['imageUrl']?.toString(),
              isGenerated: m['imageSource']?.toString() == 'generated',
            );
          }),
        if (disclaimer != null && disclaimer.isNotEmpty) ...[
          12.height,
          Text(disclaimer, style: secondaryTextStyle(size: 11, height: 1.35)),
        ],
        6.height,
        Text(
          'This product uses the TMDB API but is not endorsed or certified by TMDB.',
          style: secondaryTextStyle(size: 10, height: 1.3),
        ),
      ],
    );
  }
}
