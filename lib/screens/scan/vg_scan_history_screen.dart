import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../components/vg/vg_scan_photo_image.dart';
import '../../main.dart';
import '../../models/vg_feature_model.dart';
import '../../models/vg_scan_result.dart';
import '../../services/backend/vg_scan_repository.dart';
import '../../services/vg_scan_photo_resolver.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_copy.dart';
import '../../utils/vg_feature_data.dart';
import 'vg_results_screen.dart';

/// Past scans — photo + result, tap to reopen the same result screen the
/// analysis originally showed.
class VGScanHistoryScreen extends StatefulWidget {
  const VGScanHistoryScreen({super.key});

  @override
  State<VGScanHistoryScreen> createState() => _VGScanHistoryScreenState();
}

class _VGScanHistoryScreenState extends State<VGScanHistoryScreen> {
  final _repo = VGScanRepository();
  List<VGScanResult> _scans = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final scans = await _repo.loadAll();
      final hydrated = await VGScanPhotoResolver.hydrateAll(scans);
      if (!mounted) return;
      setState(() {
        _scans = hydrated;
        _loading = false;
      });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  VGFeatureModel _featureFor(String featureType) {
    final all = getVerifiedGlamFeatures();
    return all.firstWhere(
      (f) => f.featureType == featureType,
      orElse: () => all.first,
    );
  }

  void _openResult(VGScanResult result) {
    VGResultsScreen(result: result, feature: _featureFor(result.featureType)).launch(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appStore.isDarkModeOn ? appStore.scaffoldBackground! : bmLightScaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: bmSpecialColor,
        foregroundColor: Colors.white,
        title: Text(VGCopy.profileHistoryTitle, style: boldTextStyle(color: Colors.white, size: 18)),
      ),
      body: RefreshIndicator(
        color: bmSpecialColor,
        onRefresh: _load,
        child: _loading
            ? ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(height: context.height() * 0.3),
                  const Center(child: CircularProgressIndicator(color: bmSpecialColor)),
                ],
              )
            : _scans.isEmpty
                ? ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    children: [
                      SizedBox(height: context.height() * 0.25),
                      Icon(Icons.history, size: 64, color: bmPrimaryColor.withValues(alpha: 0.4)),
                      16.height,
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          VGCopy.profileHistoryEmpty,
                          textAlign: TextAlign.center,
                          style: secondaryTextStyle(color: appTextColorSecondary),
                        ),
                      ),
                    ],
                  )
                : ListView.separated(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    itemCount: _scans.length,
                    separatorBuilder: (_, __) => 10.height,
                    itemBuilder: (context, index) => _scanTile(_scans[index]),
                  ),
      ),
    );
  }

  Widget _scanTile(VGScanResult result) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => _openResult(result),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.2)),
          ),
          padding: const EdgeInsets.all(10),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: SizedBox(
                  width: 56,
                  height: 56,
                  child: VGScanPhotoImage(photoPath: result.photoPath),
                ),
              ),
              14.width,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      result.featureTitle,
                      style: boldTextStyle(color: appTextColorPrimary, size: 15),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    4.height,
                    Text(_formatDate(result.createdAt), style: secondaryTextStyle(size: 12)),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: bmPrimaryColor),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime dt) {
    final local = dt.toLocal();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[local.month - 1]} ${local.day}, ${local.year}';
  }
}
