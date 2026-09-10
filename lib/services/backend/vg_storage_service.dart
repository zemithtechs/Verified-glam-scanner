import '../../utils/vg_copy.dart';
import '../../utils/vg_platform_file.dart';
import 'vg_api_client.dart';
import 'vg_auth_service.dart';

/// Photo upload/delete go through the Worker's /api/scans/:id/photo route,
/// which writes to R2 (see worker-api/src/routes/scans.ts — no signed URLs
/// needed).
class VGStorageService {
  static const _maxUploadBytes = 5 * 1024 * 1024;

  /// Uploads [localPath] as the photo for scan [scanId]. Returns the
  /// storage path (`{userId}/{scanId}.jpg`), same shape as before.
  static Future<String> uploadScanPhoto({
    required String localPath,
    required String scanId,
  }) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) throw StateError('Not signed in');

    final bytes = await vgReadFileBytes(localPath);
    if (bytes.length > _maxUploadBytes) {
      throw StateError(VGCopy.scanImageTooLarge);
    }

    final data = await VGApiClient.postBytes('/api/scans/$scanId/photo', bytes);
    return data['storagePath'] as String? ?? '$userId/$scanId.jpg';
  }

  /// Short-lived signed URL for a private scan photo — R2 has no public
  /// URL for SCANS_BUCKET, so the Worker issues an HMAC-signed proxy link
  /// instead (see worker-api/src/routes/scans.ts's /photo-url endpoint).
  static Future<String?> signedUrl(String storagePath, {int expiresIn = 3600}) async {
    final scanId = storagePath.split('/').last.replaceAll('.jpg', '');
    try {
      final data = await VGApiClient.get('/api/scans/$scanId/photo-url');
      return data['url'] as String?;
    } catch (_) {
      return null;
    }
  }

  /// Removes a temporary analysis upload after the analyze call completes.
  static Future<void> deleteScanPhoto(String storagePath) async {
    if (storagePath.isEmpty) return;
    final scanId = storagePath.split('/').last.replaceAll('.jpg', '');
    await VGApiClient.delete('/api/scans/$scanId/photo');
  }
}
