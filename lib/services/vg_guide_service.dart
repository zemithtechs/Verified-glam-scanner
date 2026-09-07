import 'dart:convert';

import 'package:nb_utils/nb_utils.dart';

import '../utils/vg_constants.dart';
import '../utils/vg_copy.dart';
import 'supabase/vg_api_client.dart';
import 'supabase/vg_supabase_auth_service.dart';
import 'supabase/vg_supabase_config.dart';
import 'supabase/vg_supabase_init.dart';
import 'supabase/vg_supabase_profile_repository.dart';
import 'vg_onboarding_store.dart';

class VGGuideTip {
  final String title;
  final String body;

  const VGGuideTip({required this.title, required this.body});

  factory VGGuideTip.fromJson(Map<String, dynamic> json) {
    return VGGuideTip(
      title: (json['title'] as String?) ?? 'Tip',
      body: (json['body'] as String?) ?? '',
    );
  }

  Map<String, dynamic> toJson() => {'title': title, 'body': body};

  String get displayText => body.isNotEmpty ? '$title — $body' : title;
}

class VGGuideRecommendations {
  final List<VGGuideTip> tips;
  final String summary;

  const VGGuideRecommendations({required this.tips, required this.summary});
}

class VGGuideService {
  VGGuideService._();

  static bool get _useCloud =>
      kVGUseSupabase && VGSupabaseConfig.isConfigured && VGSupabaseInit.isReady;

  static List<String> get staticFallbackTips => [
        VGCopy.guideTip1,
        VGCopy.guideTip2,
        VGCopy.guideTip3,
      ];

  static Future<VGGuideRecommendations> loadRecommendations({
    bool forceRefresh = false,
  }) async {
    if (!forceRefresh) {
      final cached = _readCache();
      if (cached != null && cached.tips.isNotEmpty) return cached;
    }

    if (_useCloud && VGSupabaseAuthService.isSignedIn && !kVGUseMockAnalysis) {
      try {
        final result = await _fetchFromCloud();
        await _writeCache(result);
        return result;
      } catch (_) {
        final cached = _readCache();
        if (cached != null && cached.tips.isNotEmpty) return cached;
      }
    }

    return VGGuideRecommendations(
      tips: staticFallbackTips
          .map((t) => VGGuideTip(title: 'Tip', body: t))
          .toList(),
      summary: 'General beauty tips while we personalize yours.',
    );
  }

  static Future<VGGuideRecommendations> _fetchFromCloud() async {
    final profile = await _profilePayload();

    final data = await VGApiClient.post('/api/guide/recommendations', body: {'profile': profile});
    final tipsRaw = (data['tips'] as List?) ?? [];
    final tips = tipsRaw
        .whereType<Map>()
        .map((e) => VGGuideTip.fromJson(Map<String, dynamic>.from(e)))
        .where((t) => t.body.isNotEmpty || t.title.isNotEmpty)
        .toList();

    if (tips.isEmpty) {
      throw Exception('No tips returned');
    }

    return VGGuideRecommendations(
      tips: tips,
      summary: (data['summary'] as String?) ?? 'Personalized tips based on your profile.',
    );
  }

  static Future<Map<String, dynamic>> _profilePayload() async {
    var profile = await VGOnboardingStore.loadProfile();
    if (_useCloud) {
      final remote = await VGSupabaseProfileRepository.fetchProfile();
      if (remote != null) profile = remote;
    }
    return profile.toJson();
  }

  static VGGuideRecommendations? _readCache() {
    final raw = getStringAsync(vgGuideTipsCacheKey);
    if (raw.isEmpty) return null;
    try {
      final json = jsonDecode(raw) as Map<String, dynamic>;
      final tipsRaw = (json['tips'] as List?) ?? [];
      final tips = tipsRaw
          .whereType<Map>()
          .map((e) => VGGuideTip.fromJson(Map<String, dynamic>.from(e)))
          .toList();
      if (tips.isEmpty) return null;
      return VGGuideRecommendations(
        tips: tips,
        summary: (json['summary'] as String?) ?? '',
      );
    } catch (_) {
      return null;
    }
  }

  static Future<void> _writeCache(VGGuideRecommendations rec) async {
    await setValue(
      vgGuideTipsCacheKey,
      jsonEncode({
        'tips': rec.tips.map((t) => t.toJson()).toList(),
        'summary': rec.summary,
      }),
    );
  }
}
