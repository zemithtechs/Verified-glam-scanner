import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../components/vg/results/vg_face_photo_hero.dart';
import '../../../components/vg/results/vg_result_scaffold.dart';
import '../../../components/vg/results/vg_showdown_face_mesh_overlay.dart';
import '../../../components/vg/results/vg_showdown_podium.dart';
import '../../../components/vg/results/vg_showdown_rank_card.dart';
import '../../../components/vg/results/vg_showdown_score_badge.dart';
import '../../../models/vg_feature_model.dart';
import '../../../models/vg_scan_result.dart';
import '../../../utils/vg_payload_lists.dart';
import '../../../utils/vg_payload_values.dart';

class VGShowdownResult extends StatelessWidget {
  final VGScanResult result;
  final VGFeatureModel feature;

  const VGShowdownResult({super.key, required this.result, required this.feature});

  @override
  Widget build(BuildContext context) {
    final p = result.payload;
    final yourScore = VGPayloadValues.normalizeOutOf10(p['yourScore'], fallback: 8.0);
    final averageScore = VGPayloadValues.normalizeOutOf10(p['averageScore'], fallback: 7.2);
    final rankPosition = (p['rankPosition'] as num?)?.round() ?? 0;
    final totalParticipants = (p['totalParticipants'] as num?)?.round() ?? 0;
    final rankLabel = p['rankLabel'] as String? ?? p['rank']?.toString() ?? '';
    final engagementNote = p['engagementNote'] as String? ?? '';
    final podium = VGPayloadLists.maps(p, 'podium');
    final landmarks = VGPayloadLists.maps(p, 'landmarks');
    final meshConnections = VGPayloadLists.intPairs(p, 'meshConnections');
    return VGResultScaffold(
      result: result,
      feature: feature,
      hero: VGFacePhotoHero(
        photoPath: result.photoPath,
        passport: true,
        overlay: Stack(
          fit: StackFit.expand,
          clipBehavior: Clip.none,
          children: [
            VGShowdownFaceMeshOverlay(
              landmarks: landmarks,
              meshConnections: meshConnections,
            ),
            VGShowdownScoreBadge(score: yourScore),
          ],
        ),
      ),
      children: [
        16.height,
        VGShowdownPodium(podium: podium),
        12.height,
        VGShowdownRankCard(
          photoPath: result.photoPath,
          rankPosition: rankPosition,
          totalParticipants: totalParticipants,
          rankLabel: rankLabel,
          yourScore: yourScore,
          averageScore: averageScore,
          engagementNote: engagementNote,
        ),
        12.height,
        Text(
          'This is an entertainment ranking, not a scientific or medical assessment. Entries marked "Simulated" are computer-generated placeholders shown while the community leaderboard is still filling in — they are not real people.',
          style: secondaryTextStyle(size: 11, height: 1.35),
        ),
      ],
    );
  }
}
