import 'vg_api_client.dart';
import 'vg_supabase_auth_service.dart';

/// Kept the class name VGSupabasePushTokenRepository — see
/// vg_supabase_config.dart for why. Ported to /api/push-tokens (see
/// worker-api/src/routes/push-tokens.ts).
class VGSupabasePushTokenRepository {
  Future<void> upsertToken({
    required String token,
    required String platform,
  }) async {
    final userId = VGSupabaseAuthService.currentUser?.id;
    if (userId == null || token.isEmpty) return;
    await VGApiClient.post('/api/push-tokens', body: {
      'token': token,
      'platform': platform,
    });
  }

  Future<void> deactivateToken(String token) async {
    final userId = VGSupabaseAuthService.currentUser?.id;
    if (userId == null || token.isEmpty) return;
    await VGApiClient.post('/api/push-tokens/deactivate', body: {
      'token': token,
    });
  }
}
