import 'package:flutter/foundation.dart';

import '../models/vg_challenge_plan.dart';
import '../models/vg_challenge_progress.dart';
import '../models/vg_scan_result.dart';
import '../utils/vg_challenge_push_copy.dart';
import '../utils/vg_constants.dart';
import 'backend/vg_auth_service.dart';
import 'backend/vg_challenge_repository.dart';
import 'vg_challenge_templates.dart';
import 'vg_detected_issues_builder.dart';
import 'vg_session_scan_cache.dart';

class VGChallengePreview {
  final String challengeName;
  final int durationDays;
  final String issueLabel;
  final String introMessage;

  const VGChallengePreview({
    required this.challengeName,
    required this.durationDays,
    required this.issueLabel,
    required this.introMessage,
  });
}

class VGChallengeService {
  VGChallengeService._();

  static final VGChallengeRepository _repo = VGChallengeRepository();

  static Future<VGChallengePlan?> loadOrAssign() async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return null;

    try {
      final active = await _repo.fetchActivePlan();
      if (active != null) return _refreshLocks(active);
    } catch (e) {
      debugPrint('VGChallengeService: fetchActivePlan failed: $e');
    }

    final source = await _resolveSourceScan();
    if (source == null) return null;
    return _createPlanFromScan(source, userId);
  }

  static Future<VGChallengePlan?> markCurrentDayDone(VGChallengePlan plan) async {
    if (plan.progress.isCompleted) return plan;
    if (isCurrentDayLocked(plan)) return plan;

    final completedDay = plan.progress.currentDay;
    final completedAt = DateTime.now();
    try {
      await _repo.markDayComplete(
        plan: plan,
        dayNumber: completedDay,
        completedAt: completedAt,
      );
    } catch (e) {
      debugPrint('VGChallengeService: markDayComplete failed: $e');
      rethrow;
    }
    try {
      await _scheduleNotificationsAfterDayComplete(plan, completedDay, completedAt);
    } catch (e) {
      debugPrint('VGChallengeService: schedule notifications failed: $e');
    }
    return loadOrAssign();
  }

  static Future<Map<String, dynamic>?> latestRewardCard() {
    return _repo.latestRewardCard();
  }

  static Future<List<Map<String, dynamic>>> fetchUserBadges() {
    return _repo.fetchUserBadges();
  }

  static Future<VGChallengePreview> previewTemplateForScan(
    VGScanResult scan, {
    String? issueCodeOverride,
  }) async {
    final issue = issueCodeOverride != null
        ? _issueByCode(scan.payload, issueCodeOverride)
        : _resolvePrimaryIssue(scan.payload);
    final template = await VGChallengeTemplates.resolve(
      issueCode: issue.code,
      issueLabel: issue.label,
      severity: issue.severity,
    );
    return VGChallengePreview(
      challengeName: template.challengeName,
      durationDays: template.durationDays,
      issueLabel: template.issueLabel,
      introMessage: _introForIssue(template.issueLabel, template.durationDays),
    );
  }

  /// Top two issues when severity/confidence tie (spec §1.2 choice flow).
  static List<VGChallengeIssueChoice> tiedTopIssuesForScan(VGScanResult scan) {
    final ranked = _rankIssues(scan.payload);
    if (ranked.length < 2) return const [];
    final first = ranked[0];
    final second = ranked[1];
    if (_severityWeight(first.severity) != _severityWeight(second.severity)) {
      return const [];
    }
    if ((first.count - second.count).abs() > 15) return const [];
    return [
      VGChallengeIssueChoice(code: first.code, label: first.label, severity: first.severity),
      VGChallengeIssueChoice(code: second.code, label: second.label, severity: second.severity),
    ];
  }

  static Future<VGChallengePlan?> assignFromScan(
    VGScanResult scan, {
    String? issueCodeOverride,
  }) async {
    final userId = VGAuthService.currentUser?.id;
    if (userId == null) return null;

    try {
      final active = await _repo.fetchActivePlan();
      if (active != null && active.sourceScanId == scan.id) {
        return _refreshLocks(active);
      }
      if (active != null) {
        await _repo.archiveActivePlans();
      }
    } catch (e) {
      debugPrint('VGChallengeService: assignFromScan prefetch failed: $e');
    }

    return _createPlanFromScan(scan, userId, issueCodeOverride: issueCodeOverride);
  }

  static Future<VGChallengePlan?> _createPlanFromScan(
    VGScanResult scan,
    String userId, {
    String? issueCodeOverride,
  }) async {
    final issue = issueCodeOverride != null
        ? _issueByCode(scan.payload, issueCodeOverride)
        : _resolvePrimaryIssue(scan.payload);
    final template = await VGChallengeTemplates.resolve(
      issueCode: issue.code,
      issueLabel: issue.label,
      severity: issue.severity,
    );
    final now = DateTime.now();
    final plan = VGChallengePlan(
      challengeId: '${userId}_${now.millisecondsSinceEpoch}',
      userId: userId,
      sourceScanId: scan.id,
      issueTag: template.issueLabel,
      severity: issue.severity,
      durationDays: template.durationDays,
      title: template.challengeName,
      introMessage: _introForIssue(template.issueLabel, template.durationDays),
      disclaimer: VGChallengeTemplates.disclaimer,
      days: template.days,
      progress: const VGChallengeProgress(
        completedDays: 0,
        currentDay: 1,
        isCompleted: false,
        notificationPrefTime: '18:00',
        bestStreak: 0,
      ),
      createdAt: now,
      updatedAt: now,
    );

    try {
      await _repo.createPlan(plan);
    } catch (e) {
      debugPrint('VGChallengeService: assignFromScan createPlan failed: $e');
    }
    return plan;
  }

  static bool isCurrentDayLocked(VGChallengePlan plan) {
    final now = DateTime.now();
    final nextUnlockAt = plan.progress.nextUnlockAt;
    if (nextUnlockAt == null) return false;
    return now.isBefore(nextUnlockAt);
  }

  static Duration? remainingToUnlock(VGChallengePlan plan) {
    final nextUnlockAt = plan.progress.nextUnlockAt;
    if (nextUnlockAt == null) return null;
    final now = DateTime.now();
    if (now.isAfter(nextUnlockAt)) return null;
    return nextUnlockAt.difference(now);
  }

  static Future<void> updateNotificationPrefTime(
    VGChallengePlan plan,
    String prefTime,
  ) async {
    await _repo.updateNotificationPrefTime(
      challengeId: plan.challengeId,
      prefTime: prefTime,
    );
    final updatedProgress = VGChallengeProgress(
      completedDays: plan.progress.completedDays,
      currentDay: plan.progress.currentDay,
      isCompleted: plan.progress.isCompleted,
      lastCompletedAt: plan.progress.lastCompletedAt,
      nextUnlockAt: plan.progress.nextUnlockAt,
      streakCount: plan.progress.streakCount,
      bestStreak: plan.progress.bestStreak,
      notificationPrefTime: prefTime,
    );
    final updatedPlan = VGChallengePlan(
      challengeId: plan.challengeId,
      userId: plan.userId,
      sourceScanId: plan.sourceScanId,
      issueTag: plan.issueTag,
      severity: plan.severity,
      durationDays: plan.durationDays,
      title: plan.title,
      introMessage: plan.introMessage,
      disclaimer: plan.disclaimer,
      days: plan.days,
      progress: updatedProgress,
      createdAt: plan.createdAt,
      updatedAt: DateTime.now(),
    );
    await _reschedulePendingReminders(updatedPlan);
  }

  static Future<void> _reschedulePendingReminders(VGChallengePlan plan) async {
    if (plan.progress.isCompleted) return;
    final dayNumber = plan.progress.currentDay;
    final unlockAt = plan.progress.nextUnlockAt;
    if (unlockAt == null || dayNumber < 1) return;

    await _repo.cancelPendingJobs(
      challengeId: plan.challengeId,
      dayNumber: dayNumber,
      kinds: const ['streak', 'evening', 'reminder'],
    );
    await scheduleStreakReminder(
      plan: plan,
      dayNumber: dayNumber,
      reminderAt: _streakReminderAt(plan, unlockAt),
    );
    await scheduleEveningStreakReminder(
      plan: plan,
      dayNumber: dayNumber,
      reminderAt: _eveningReminderAt(unlockAt),
    );
    await scheduleMissedDayReminder(
      plan: plan,
      dayNumber: dayNumber,
      reminderAt: unlockAt.add(const Duration(hours: 48)),
    );
  }

  static Future<void> _scheduleNotificationsAfterDayComplete(
    VGChallengePlan plan,
    int completedDay,
    DateTime completedAt,
  ) async {
    if (completedDay > 0) {
      await _repo.cancelPendingJobs(
        challengeId: plan.challengeId,
        dayNumber: completedDay,
        kinds: const ['streak', 'evening', 'reminder'],
      );
    }

    if (completedDay >= plan.durationDays) {
      await scheduleCompletionCelebration(
        plan: plan,
        dayNumber: completedDay,
        fireAt: completedAt.add(const Duration(minutes: 1)),
      );
      return;
    }

    final nextDay = completedDay + 1;
    await _repo.cancelPendingJobs(
      challengeId: plan.challengeId,
      dayNumber: nextDay,
    );

    final unlockAt = completedAt.add(const Duration(hours: 24));
    await scheduleDayUnlockNotification(
      plan: plan,
      dayNumber: nextDay,
      unlockAt: unlockAt,
    );
    await scheduleStreakReminder(
      plan: plan,
      dayNumber: nextDay,
      reminderAt: _streakReminderAt(plan, unlockAt),
    );
    await scheduleEveningStreakReminder(
      plan: plan,
      dayNumber: nextDay,
      reminderAt: _eveningReminderAt(unlockAt),
    );
    await scheduleMissedDayReminder(
      plan: plan,
      dayNumber: nextDay,
      reminderAt: unlockAt.add(const Duration(hours: 48)),
    );
  }

  static Future<void> scheduleDayUnlockNotification({
    required VGChallengePlan plan,
    required int dayNumber,
    required DateTime unlockAt,
  }) async {
    if (dayNumber < 1) return;
    await _repo.enqueueNotificationJob(
      challengeId: plan.challengeId,
      dayNumber: dayNumber,
      kind: 'unlock',
      scheduledFor: unlockAt,
      payload: VGChallengePushCopy.payload(
        kind: 'unlock',
        dayNumber: dayNumber,
        challengeName: plan.title,
        challengeId: plan.challengeId,
      ),
    );
  }

  static Future<void> scheduleMissedDayReminder({
    required VGChallengePlan plan,
    required int dayNumber,
    required DateTime reminderAt,
  }) async {
    if (dayNumber < 1) return;
    await _repo.enqueueNotificationJob(
      challengeId: plan.challengeId,
      dayNumber: dayNumber,
      kind: 'reminder',
      scheduledFor: reminderAt,
      payload: VGChallengePushCopy.payload(
        kind: 'reminder',
        dayNumber: dayNumber,
        challengeName: plan.title,
        challengeId: plan.challengeId,
      ),
    );
  }

  static Future<void> scheduleStreakReminder({
    required VGChallengePlan plan,
    required int dayNumber,
    required DateTime reminderAt,
  }) async {
    if (dayNumber < 1) return;
    await _repo.enqueueNotificationJob(
      challengeId: plan.challengeId,
      dayNumber: dayNumber,
      kind: 'streak',
      scheduledFor: reminderAt,
      payload: VGChallengePushCopy.payload(
        kind: 'streak',
        dayNumber: dayNumber,
        challengeName: plan.title,
        challengeId: plan.challengeId,
      ),
    );
  }

  static Future<void> scheduleEveningStreakReminder({
    required VGChallengePlan plan,
    required int dayNumber,
    required DateTime reminderAt,
  }) async {
    if (dayNumber < 1) return;
    await _repo.enqueueNotificationJob(
      challengeId: plan.challengeId,
      dayNumber: dayNumber,
      kind: 'evening',
      scheduledFor: reminderAt,
      payload: VGChallengePushCopy.payload(
        kind: 'evening',
        dayNumber: dayNumber,
        challengeName: plan.title,
        challengeId: plan.challengeId,
      ),
    );
  }

  static Future<void> scheduleCompletionCelebration({
    required VGChallengePlan plan,
    required int dayNumber,
    required DateTime fireAt,
  }) async {
    await _repo.enqueueNotificationJob(
      challengeId: plan.challengeId,
      dayNumber: dayNumber,
      kind: 'completion',
      scheduledFor: fireAt,
      payload: VGChallengePushCopy.payload(
        kind: 'completion',
        dayNumber: dayNumber,
        challengeName: plan.title,
        challengeId: plan.challengeId,
      ),
    );
  }

  static DateTime _streakReminderAt(VGChallengePlan plan, DateTime unlockAt) {
    final parts = (plan.progress.notificationPrefTime ?? '18:00').split(':');
    final hour = int.tryParse(parts.first) ?? 18;
    final minute = parts.length > 1 ? (int.tryParse(parts[1]) ?? 0) : 0;
    var reminder = DateTime(
      unlockAt.year,
      unlockAt.month,
      unlockAt.day,
      hour,
      minute,
    );
    if (reminder.isBefore(unlockAt)) {
      reminder = unlockAt.add(const Duration(hours: 4));
    }
    return reminder;
  }

  /// Spec §4.3 evening fallback at 7 PM on the unlock calendar day.
  static DateTime _eveningReminderAt(DateTime unlockAt) {
    var evening = DateTime(unlockAt.year, unlockAt.month, unlockAt.day, 19, 0);
    if (evening.isBefore(unlockAt)) {
      evening = unlockAt.add(const Duration(hours: 5));
    }
    return evening;
  }

  static Future<VGScanResult?> _resolveSourceScan() async {
    return VGSessionScanCache.resolveForChallenge();
  }

  static List<Map<String, dynamic>> detectedIssuesForPayload(Map<String, dynamic> payload) {
    final raw = (payload['detectedIssues'] as List?)?.cast<Map<String, dynamic>>();
    if (raw != null && raw.isNotEmpty) return raw.take(5).toList();
    return VGDetectedIssuesBuilder.fromPayload(payload);
  }

  static _Issue _resolvePrimaryIssue(Map<String, dynamic> payload) {
    final ranked = _rankIssues(payload);
    if (ranked.isNotEmpty) return ranked.first;
    final concern = payload['concern'] as String?;
    final severity = (payload['severity'] as String? ?? 'low').toLowerCase();
    final code = _normalizeIssueCode(concern ?? '');
    return _Issue(
      code: code,
      label: _humanIssueLabel(code),
      severity: severity,
      count: 1,
    );
  }

  static _Issue _issueByCode(Map<String, dynamic> payload, String issueCode) {
    final normalized = _normalizeIssueCode(issueCode);
    for (final issue in _rankIssues(payload)) {
      if (issue.code == normalized) return issue;
    }
    return _Issue(
      code: normalized,
      label: _humanIssueLabel(normalized),
      severity: (payload['severity'] as String? ?? 'medium').toLowerCase(),
      count: 1,
    );
  }

  static List<_Issue> _rankIssues(Map<String, dynamic> payload) {
    final detected = (payload['detectedIssues'] as List?)?.cast<Map<String, dynamic>>() ?? const [];
    if (detected.isNotEmpty) {
      final ranked = detected
          .map((d) {
            final issueId = (d['issueId'] as String?) ?? '';
            final severity = (d['severity'] as String? ?? 'low').toLowerCase();
            final confidence = (d['confidence'] as num?)?.toDouble() ?? 0.7;
            final code = _normalizeIssueCode(issueId);
            final label = (d['label'] as String?) ?? _humanIssueLabel(code);
            return _Issue(
              code: code,
              label: label,
              severity: severity,
              count: (confidence * 100).round(),
            );
          })
          .toList();
      ranked.sort((a, b) {
        final sevCompare = _severityWeight(b.severity).compareTo(_severityWeight(a.severity));
        if (sevCompare != 0) return sevCompare;
        return b.count.compareTo(a.count);
      });
      return ranked;
    }

    final findings = payload['findings'];
    if (findings is List && findings.isNotEmpty) {
      final normalized = findings
          .whereType<Map>()
          .map((e) => Map<String, dynamic>.from(e))
          .map((entry) {
            final severity = (entry['severity'] as String? ?? 'low').toLowerCase();
            final count = (entry['spotCount'] as num?)?.toInt() ?? 0;
            final categoryName = (entry['categoryName'] as String?) ?? '';
            final categoryId = (entry['categoryId'] as String?) ?? '';
            final code = _normalizeIssueCode('$categoryName $categoryId');
            final label = categoryName.isNotEmpty ? categoryName : _humanIssueLabel(code);
            return _Issue(code: code, label: label, severity: severity, count: count);
          })
          .toList();
      normalized.sort((a, b) {
        final sevCompare = _severityWeight(b.severity).compareTo(_severityWeight(a.severity));
        if (sevCompare != 0) return sevCompare;
        return b.count.compareTo(a.count);
      });
      if (normalized.isNotEmpty) return normalized;
    }
    return const [];
  }

  static int _severityWeight(String severity) {
    switch (severity) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      default:
        return 1;
    }
  }

  static String _introForIssue(String issueTag, int durationDays) {
    return "We've analysed your skin. We noticed $issueTag and built a $durationDays-day challenge with simple daily habits that many creators say may help when done consistently.";
  }

  static String _normalizeIssueCode(String raw) {
    final v = raw.toLowerCase();
    if (v.contains('acne') || v.contains('pimple') || v.contains('breakout')) return 'acne';
    if (v.contains('pigment') || v.contains('dark') || v.contains('spot')) return 'pigmentation';
    if (v.contains('texture') || v.contains('scar')) return 'texture';
    if (v.contains('aging') || v.contains('sag') || v.contains('firm')) return 'aging';
    if (v.contains('sensitive') || v.contains('redness')) return 'sensitivity';
    if (v.contains('oily') || v.contains('pore') || v.contains('sebum')) return 'oily';
    if (v.contains('dry') || v.contains('dehydrat') || v.contains('flaky')) return 'dryness';
    if (v.contains('uneven') || v.contains('tone') || v.contains('rosacea')) return 'uneven_tone';
    return 'acne';
  }

  static String _humanIssueLabel(String code) {
    switch (code) {
      case 'pigmentation':
        return 'Hyperpigmentation & Dark Spots';
      case 'texture':
        return 'Texture & Acne Scars';
      case 'aging':
        return 'Aging & Sagging Skin';
      case 'sensitivity':
        return 'Sensitivity & Redness';
      case 'oily':
        return 'Oily Skin & Enlarged Pores';
      case 'dryness':
        return 'Dry & Dehydrated Skin';
      case 'uneven_tone':
        return 'Uneven Skin Tone & Rosacea';
      default:
        return 'Acne & Breakouts';
    }
  }

  static VGChallengePlan _refreshLocks(VGChallengePlan plan) {
    final unlockAt = plan.progress.nextUnlockAt;
    if (unlockAt == null || DateTime.now().isBefore(unlockAt)) return plan;
    final updated = VGChallengeProgress(
      completedDays: plan.progress.completedDays,
      currentDay: (plan.progress.completedDays + 1).clamp(1, plan.durationDays).toInt(),
      isCompleted: plan.progress.isCompleted,
      lastCompletedAt: plan.progress.lastCompletedAt,
      nextUnlockAt: null,
      streakCount: plan.progress.streakCount,
      bestStreak: plan.progress.bestStreak,
      notificationPrefTime: plan.progress.notificationPrefTime,
    );
    return VGChallengePlan(
      challengeId: plan.challengeId,
      userId: plan.userId,
      sourceScanId: plan.sourceScanId,
      issueTag: plan.issueTag,
      severity: plan.severity,
      durationDays: plan.durationDays,
      title: plan.title,
      introMessage: plan.introMessage,
      disclaimer: plan.disclaimer,
      days: plan.days,
      progress: updated,
      createdAt: plan.createdAt,
      updatedAt: DateTime.now(),
    );
  }
}

class _Issue {
  final String code;
  final String label;
  final String severity;
  final int count;

  _Issue({required this.code, required this.label, required this.severity, required this.count});
}

class VGChallengeIssueChoice {
  final String code;
  final String label;
  final String severity;

  const VGChallengeIssueChoice({
    required this.code,
    required this.label,
    required this.severity,
  });
}
