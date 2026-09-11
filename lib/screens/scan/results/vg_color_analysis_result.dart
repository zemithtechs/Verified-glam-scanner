import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../components/vg/results/vg_face_photo_hero.dart';
import '../../../components/vg/results/vg_palette_grid.dart';
import '../../../components/vg/results/vg_result_scaffold.dart';
import '../../../components/vg/results/vg_skin_concern_overlay.dart';
import '../../../components/vg/results/vg_swatch_row.dart';
import '../../../components/vg/vg_analysis_card.dart';
import '../../../components/vg/vg_pill_button.dart';
import '../../../components/vg/vg_recommendation_card.dart';
import '../../../screens/makeup/vg_makeup_studio_screen.dart';
import '../../../models/vg_feature_model.dart';
import '../../../models/vg_scan_result.dart';
import '../../../services/vg_result_overlay_service.dart';
import '../../../utils/BMColors.dart';
import '../../../utils/vg_copy.dart';
import '../../../utils/vg_payload_lists.dart';

class VGColorAnalysisResult extends StatelessWidget {
  final VGScanResult result;
  final VGFeatureModel feature;

  const VGColorAnalysisResult({super.key, required this.result, required this.feature});

  @override
  Widget build(BuildContext context) {
    final p = result.payload;
    final sample = p['samplePoint'] as Map<String, dynamic>?;
    final sx = (sample?['x'] as num?)?.toDouble() ?? 0.42;
    final sy = (sample?['y'] as num?)?.toDouble() ?? 0.55;
    final palette = VGPayloadLists.strings(p, 'palette');
    final paletteHex = VGPayloadLists.strings(p, 'paletteHex');
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
            Align(
              alignment: Alignment(sx * 2 - 1, sy * 2 - 1),
              child: Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                  color: bmSpecialColor.withValues(alpha: 0.6),
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 18),
              ),
            ),
            VGSkinConcernOverlay(annotations: concernAnnotations),
          ],
        ),
      ),
      children: [
        16.height,
        VGSwatchRow(
          skinHex: p['skin'].toString(),
          hairHex: p['hair'].toString(),
          eyesHex: p['eyes'].toString(),
          selected: 'skin',
        ),
        16.height,
        VGAnalysisCard(title: VGCopy.resultSeason, body: p['season'].toString(), icon: Icons.wb_sunny_outlined),
        12.height,
        Text(VGCopy.resultYourPalette, style: boldTextStyle(color: bmSpecialColorDark, size: 14)),
        8.height,
        VGPaletteGrid(paletteNames: palette, paletteHex: paletteHex),
        12.height,
        VGRecommendationCard(title: VGCopy.resultUseSparingly, items: VGPayloadLists.strings(p, 'avoid')),
        if (result.photoPath != null) ...[
          16.height,
          VGPillButton(
            label: VGCopy.colorTryMakeup,
            onTap: () => VGMakeupStudioScreen(
              photoPath: result.photoPath!,
              paletteHex: paletteHex,
              seasonLabel: p['season'].toString(),
            ).launch(context),
          ),
        ],
        12.height,
        Text(
          'This color palette is an AI styling suggestion for entertainment and self-expression — not a professional color-analysis consultation.',
          style: secondaryTextStyle(size: 11, height: 1.35),
        ),
      ],
    );
  }
}
