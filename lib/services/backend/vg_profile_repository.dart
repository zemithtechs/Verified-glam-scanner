import '../../models/vg_onboarding_profile.dart';
import 'vg_api_client.dart';
import 'vg_auth_service.dart';

/// Calls the Worker's /api/profiles/* routes (see
/// worker-api/src/routes/profiles.ts).
class VGProfileRepository {
  static Future<void> upsertFromOnboarding(VGOnboardingProfile profile) async {
    final user = VGAuthService.currentUser;
    if (user == null) return;

    await VGApiClient.put('/api/profiles/onboarding', body: {
      'age': profile.age,
      'gender': profile.gender,
      'beautyGoals': profile.beautyGoals,
      'skinConcerns': profile.skinConcerns,
      'productPreferences': profile.productPreferences,
      'skinType': profile.skinType,
      'ethnicity': profile.ethnicity,
      'aesthetic': profile.aesthetic,
    });
  }

  static Future<VGOnboardingProfile?> fetchProfile() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return null;

    final row = await VGApiClient.get('/api/profiles/me');
    if (row.isEmpty) return null;

    return VGOnboardingProfile(
      age: (row['age'] as num?)?.toInt(),
      gender: row['gender'] as String?,
      beautyGoals: List<String>.from(row['beauty_goals'] as List? ?? []),
      skinConcerns: List<String>.from(row['skin_concerns'] as List? ?? []),
      productPreferences: List<String>.from(row['product_preferences'] as List? ?? []),
      skinType: row['skin_type'] as String?,
      ethnicity: row['ethnicity'] as String?,
      aesthetic: row['aesthetic'] as String?,
    );
  }

  static Future<bool> isOnboardingCompleteRemote() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return false;

    final row = await VGApiClient.get('/api/profiles/me');
    return row['onboarding_complete'] == true;
  }

  static Future<String?> referralCode() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return null;

    final row = await VGApiClient.post('/api/profiles/referral-code');
    return row['referralCode'] as String?;
  }

  static Future<int> referralDownloadCount() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return 0;

    final row = await VGApiClient.get('/api/profiles/me');
    return (row['referral_download_count'] as num?)?.toInt() ?? 0;
  }

  static Future<int> incrementReferralDownloadCount() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return 0;

    final row = await VGApiClient.post('/api/profiles/referral-download-count/increment');
    return (row['count'] as num?)?.toInt() ?? 0;
  }

  static Future<bool> isReferralBonusRedeemedRemote() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return false;

    final row = await VGApiClient.get('/api/profiles/me');
    return row['referral_bonus_redeemed'] == true;
  }

  static Future<void> setReferralBonusRedeemed({required int bonusScans}) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return;

    await VGApiClient.post('/api/profiles/referral-bonus/redeem', body: {
      'bonusScans': bonusScans,
    });
  }
}
