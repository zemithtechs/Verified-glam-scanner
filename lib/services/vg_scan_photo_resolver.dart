import '../models/vg_scan_result.dart';
import '../utils/vg_platform_file.dart';
import 'backend/vg_auth_service.dart';
import 'backend/vg_storage_service.dart';

/// Refreshes signed URLs for cloud-stored scan photos (local paths expire / are device-only).
class VGScanPhotoResolver {
  VGScanPhotoResolver._();

  static Future<VGScanResult> hydrate(VGScanResult result) async {
    if (!VGAuthService.isSignedIn) return result;
    final storagePath = result.storagePath;
    if (storagePath == null || storagePath.isEmpty) return result;

    if (VGScanPhotoImagePath.isLocalAndExists(result.photoPath)) {
      return result;
    }

    try {
      final url = await VGStorageService.signedUrl(storagePath);
      if (url == null || url.isEmpty) return result;
      return result.copyWith(photoPath: url);
    } catch (_) {
      return result;
    }
  }

  static Future<List<VGScanResult>> hydrateAll(List<VGScanResult> items) async {
    if (items.isEmpty) return items;
    return Future.wait(items.map(hydrate));
  }
}

/// Path helpers shared with [VGScanPhotoImage].
class VGScanPhotoImagePath {
  VGScanPhotoImagePath._();

  static bool isLocalAndExists(String? path) => vgLocalPathExists(path);
}
