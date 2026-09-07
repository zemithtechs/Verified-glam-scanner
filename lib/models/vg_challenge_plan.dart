import 'vg_challenge_day.dart';
import 'vg_challenge_progress.dart';

class VGChallengePlan {
  final String challengeId;
  final String userId;
  final String? sourceScanId;
  final String issueTag;
  final String severity;
  final int durationDays;
  final String title;
  final String introMessage;
  final String disclaimer;
  final List<VGChallengeDay> days;
  final VGChallengeProgress progress;
  final DateTime createdAt;
  final DateTime updatedAt;

  const VGChallengePlan({
    required this.challengeId,
    required this.userId,
    this.sourceScanId,
    required this.issueTag,
    required this.severity,
    required this.durationDays,
    required this.title,
    required this.introMessage,
    required this.disclaimer,
    required this.days,
    required this.progress,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
        'challengeId': challengeId,
        'userId': userId,
        'sourceScanId': sourceScanId,
        'issueTag': issueTag,
        'severity': severity,
        'durationDays': durationDays,
        'title': title,
        'introMessage': introMessage,
        'disclaimer': disclaimer,
        'days': days.map((e) => e.toJson()).toList(),
        'progress': progress.toJson(),
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };

  factory VGChallengePlan.fromJson(Map<String, dynamic> json) {
    return VGChallengePlan(
      challengeId: json['challengeId'] as String,
      userId: json['userId'] as String,
      sourceScanId: json['sourceScanId'] as String?,
      issueTag: (json['issueTag'] as String?) ?? 'glow',
      severity: (json['severity'] as String?) ?? 'low',
      durationDays: (json['durationDays'] as num?)?.toInt() ?? 0,
      title: (json['title'] as String?) ?? 'Beauty Routine Challenge',
      introMessage: (json['introMessage'] as String?) ?? '',
      disclaimer: (json['disclaimer'] as String?) ?? '',
      days: ((json['days'] as List?) ?? [])
          .map((e) => VGChallengeDay.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList(),
      progress: VGChallengeProgress.fromJson(
        Map<String, dynamic>.from((json['progress'] as Map?) ?? {}),
      ),
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? '') ?? DateTime.now(),
    );
  }
}
