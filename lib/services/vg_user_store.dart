import '../models/vg_onboarding_profile.dart';
import '../utils/vg_constants.dart';
import 'supabase/vg_supabase_auth_service.dart';
import 'supabase/vg_supabase_config.dart';
import 'supabase/vg_supabase_init.dart';
import 'supabase/vg_supabase_profile_repository.dart';
import 'vg_onboarding_store.dart';

/// User profile facade — local onboarding + Supabase when configured.
class VGUserStore {
  static Future<VGOnboardingProfile> profile() async {
    if (kVGUseSupabase && VGSupabaseConfig.isConfigured && VGSupabaseInit.isReady) {
      final remote = await VGSupabaseProfileRepository.fetchProfile();
      if (remote != null) return remote;
    }
    return VGOnboardingStore.loadProfile();
  }

  static Future<String> displayName() async {
    final user = VGSupabaseAuthService.currentUser;
    if (user?.email != null && user!.email!.isNotEmpty) {
      return user.email!.split('@').first;
    }
    final p = await profile();
    if (p.gender != null && p.gender!.isNotEmpty) return 'Verified Glam member';
    return 'Guest';
  }

  static Future<String> email() async {
    return VGSupabaseAuthService.currentUser?.email ?? 'guest@verifiedglam.com';
  }
}
