import 'vg_api_client.dart';
import 'vg_auth_service.dart';

/// Calls /api/push-tokens (see worker-api/src/routes/push-tokens.ts).
class VGPushTokenRepository {
  Future<void> upsertToken({
    required String token,
    required String platform,
  }) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null || token.isEmpty) return;
    await VGApiClient.post('/api/push-tokens', body: {
      'token': token,
      'platform': platform,
    });
  }

  Future<void> deactivateToken(String token) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null || token.isEmpty) return;
    await VGApiClient.post('/api/push-tokens/deactivate', body: {
      'token': token,
    });
  }
}
