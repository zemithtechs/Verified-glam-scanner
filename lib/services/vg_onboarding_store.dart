import 'package:nb_utils/nb_utils.dart';

import '../models/vg_onboarding_profile.dart';
import '../utils/vg_constants.dart';
import 'backend/vg_backend_config.dart';
import 'backend/vg_backend_init.dart';
import 'backend/vg_profile_repository.dart';
import 'vg_analytics_service.dart';
import 'vg_profile_cache.dart';

class VGOnboardingStore {
  static Future<bool> isComplete() async {
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      final remoteDone = await VGProfileRepository.isOnboardingCompleteRemote();
      if (remoteDone) {
        await setComplete(true);
        return true;
      }
    }
    return getBoolAsync(vgOnboardingCompleteKey, defaultValue: false);
  }

  static Future<void> setComplete(bool value) async {
    await setValue(vgOnboardingCompleteKey, value);
  }

  static Future<VGOnboardingProfile> loadProfile() async {
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      final remote = await VGProfileRepository.fetchProfile();
      if (remote != null) {
        await saveProfile(remote);
        return remote;
      }
    }
    final raw = getStringAsync(vgOnboardingProfileKey);
    if (raw.isEmpty) return VGOnboardingProfile();
    return VGOnboardingProfile.fromJsonString(raw);
  }

  static Future<void> saveProfile(VGOnboardingProfile profile) async {
    await setValue(vgOnboardingProfileKey, profile.toJsonString());
    await VGProfileCache.save(profile);
  }

  static Future<void> markComplete(VGOnboardingProfile profile) async {
    await saveProfile(profile);
    await setComplete(true);
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      await VGProfileRepository.upsertFromOnboarding(profile);
    }
    await VGAnalyticsService.logOnboardingCompleted();
  }
}
