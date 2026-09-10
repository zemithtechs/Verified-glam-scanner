import 'dart:convert';

import 'package:nb_utils/nb_utils.dart';

import '../../models/vg_onboarding_profile.dart';

const _profileCacheKey = 'vg_profile_cache_json';

/// Local cache for onboarding profile to reduce repeated backend reads.
class VGProfileCache {
  VGProfileCache._();

  static Future<VGOnboardingProfile?> load() async {
    final raw = getStringAsync(_profileCacheKey);
    if (raw.isEmpty) return null;
    try {
      return VGOnboardingProfile.fromJson(
        Map<String, dynamic>.from(jsonDecode(raw) as Map),
      );
    } catch (_) {
      return null;
    }
  }

  static Future<void> save(VGOnboardingProfile profile) async {
    await setValue(_profileCacheKey, jsonEncode(profile.toJson()));
  }

  static Future<void> clear() async {
    await removeKey(_profileCacheKey);
  }
}
