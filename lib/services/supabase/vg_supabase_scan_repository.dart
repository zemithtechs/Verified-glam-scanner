import '../../models/vg_scan_result.dart';
import 'vg_api_client.dart';
import 'vg_supabase_auth_service.dart';

/// Kept the class name VGSupabaseScanRepository — see
/// vg_supabase_config.dart for why. Ported to /api/scans/* (see
/// worker-api/src/routes/scans.ts).
class VGSupabaseScanRepository {
  Future<List<VGScanResult>> loadAll() async {
    final userId = VGSupabaseAuthService.currentUser?.id;
    if (userId == null) return [];

    final data = await VGApiClient.get('/api/scans');
    final rows = (data['scans'] as List?) ?? [];
    return rows.map((row) => _fromRow(Map<String, dynamic>.from(row as Map))).toList();
  }

  Future<VGScanResult?> getById(String id) async {
    final userId = VGSupabaseAuthService.currentUser?.id;
    if (userId == null) return null;

    try {
      final row = await VGApiClient.get('/api/scans/$id');
      return _fromRow(row);
    } on VGApiException catch (e) {
      if (e.statusCode == 404) return null;
      rethrow;
    }
  }

  Future<void> save({
    required VGScanResult result,
    required String storagePath,
  }) async {
    final userId = VGSupabaseAuthService.currentUser?.id;
    if (userId == null) throw StateError('Not signed in');

    try {
      await VGApiClient.put('/api/scans/${result.id}', body: {
        'featureType': result.featureType,
        'featureTitle': result.featureTitle,
        'storagePath': storagePath,
        'payload': result.payload,
        'createdAt': result.createdAt.toIso8601String(),
      });
    } catch (e) {
      throw Exception('Could not save scan history to cloud: $e');
    }
  }

  VGScanResult _fromRow(Map<String, dynamic> row) {
    final rawPayload = row['payload'];
    final payload = rawPayload is Map ? Map<String, dynamic>.from(rawPayload) : <String, dynamic>{};
    final storagePath = row['photo_storage_path'] as String?;

    return VGScanResult(
      id: row['id'] as String,
      featureType: row['feature_type'] as String,
      featureTitle: row['feature_title'] as String? ?? '',
      createdAt: DateTime.parse(row['created_at'] as String),
      payload: payload,
      photoPath: null,
      storagePath: storagePath,
      usedMockAnalysis: payload['usedMockAnalysis'] as bool? ?? false,
    );
  }
}
