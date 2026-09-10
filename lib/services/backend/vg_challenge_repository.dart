import '../../models/vg_challenge_plan.dart';
import 'vg_api_client.dart';
import 'vg_auth_service.dart';

/// Badge awarding/streak math/day-unlock logic all lives server-side in
/// worker-api/src/routes/challenges.ts — this repository is genuinely thin,
/// calling that route and deserializing its response.
class VGChallengeRepository {
  Future<void> enqueueNotificationJob({
    required String challengeId,
    required int dayNumber,
    required String kind,
    required DateTime scheduledFor,
    required Map<String, dynamic> payload,
  }) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return;
    try {
      await VGApiClient.post('/api/challenges/notification-jobs', body: {
        'challengeId': challengeId,
        'dayNumber': dayNumber,
        'kind': kind,
        'scheduledFor': scheduledFor.toIso8601String(),
        'payload': payload,
      });
    } catch (_) {
      // Ignore duplicate notification jobs, matching the original's
      // silent-ignore on a dedupe_key conflict.
    }
  }

  Future<void> cancelPendingJobs({
    required String challengeId,
    required int dayNumber,
    List<String>? kinds,
  }) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return;
    await VGApiClient.post('/api/challenges/notification-jobs/cancel', body: {
      'challengeId': challengeId,
      'dayNumber': dayNumber,
      if (kinds != null && kinds.isNotEmpty) 'kinds': kinds,
    });
  }

  Future<void> updateNotificationPrefTime({
    required String challengeId,
    required String prefTime,
  }) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return;
    await VGApiClient.put('/api/challenges/$challengeId/notification-pref-time', body: {
      'prefTime': prefTime,
    });
  }

  Future<VGChallengePlan?> fetchActivePlan() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return null;

    final data = await VGApiClient.get('/api/challenges/active');
    final planJson = data['plan'] as Map?;
    if (planJson == null) return null;
    return VGChallengePlan.fromJson(Map<String, dynamic>.from(planJson));
  }

  Future<void> createPlan(VGChallengePlan plan) async {
    await VGApiClient.post('/api/challenges', body: {
      'challengeId': plan.challengeId,
      'sourceScanId': plan.sourceScanId,
      'issueTag': plan.issueTag,
      'severity': plan.severity,
      'durationDays': plan.durationDays,
      'title': plan.title,
      'introMessage': plan.introMessage,
      'disclaimer': plan.disclaimer,
      'notificationPrefTime': plan.progress.notificationPrefTime ?? '18:00',
      'days': plan.days.map((d) => d.toJson()).toList(),
    });
  }

  Future<void> markDayComplete({
    required VGChallengePlan plan,
    required int dayNumber,
    required DateTime completedAt,
  }) async {
    await VGApiClient.post('/api/challenges/${plan.challengeId}/days/$dayNumber/complete');
  }

  Future<void> archiveActivePlans() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return;
    await VGApiClient.post('/api/challenges/archive');
  }

  Future<List<Map<String, dynamic>>> fetchUserBadges() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return const [];
    final data = await VGApiClient.get('/api/challenges/badges');
    final rows = (data['badges'] as List?) ?? [];
    return rows.map((e) => Map<String, dynamic>.from(e as Map)).toList();
  }

  Future<Map<String, dynamic>?> latestRewardCard() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return null;
    final data = await VGApiClient.get('/api/challenges/reward-card/latest');
    final row = data['rewardCard'] as Map?;
    return row == null ? null : Map<String, dynamic>.from(row);
  }
}
