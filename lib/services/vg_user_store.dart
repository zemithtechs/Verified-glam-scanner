import '../models/vg_onboarding_profile.dart';
import '../utils/vg_constants.dart';
import 'backend/vg_auth_service.dart';
import 'backend/vg_backend_config.dart';
import 'backend/vg_backend_init.dart';
import 'backend/vg_profile_repository.dart';
import 'vg_onboarding_store.dart';

/// User profile facade — local onboarding + Cloudflare backend when configured.
class VGUserStore {
  static Future<VGOnboardingProfile> profile() async {
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      final remote = await VGProfileRepository.fetchProfile();
      if (remote != null) return remote;
    }
    return VGOnboardingStore.loadProfile();
  }

  static Future<String> displayName() async {
    final user = VGAuthService.currentUser;
    if (user?.email != null && user!.email!.isNotEmpty) {
      return user.email!.split('@').first;
    }
    final p = await profile();
    if (p.gender != null && p.gender!.isNotEmpty) return 'Verified Glam member';
    return 'Guest';
  }

  static Future<String> email() async {
    return VGAuthService.currentUser?.email ?? 'guest@verifiedglam.com';
  }
}
