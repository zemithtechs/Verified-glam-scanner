/// AI credit costs and subscription allocations (mirrored in analyze-scan Edge Function).
const int kCreditsPerGeneration = 5;
const int kFreeCreditsAllocation = 10;
const int kYearlyCreditsAllocation = 200;
const int kProWeeklyCreditsAllocation = 30;

const String kSubscriptionPlanFree = 'free';
const String kSubscriptionPlanAnnual = 'annual';
const String kSubscriptionPlanProWeekly = 'pro_weekly';

int creditsAllocationForPlan(String plan) {
  switch (plan) {
    case kSubscriptionPlanProWeekly:
      return kProWeeklyCreditsAllocation;
    case kSubscriptionPlanAnnual:
      return kYearlyCreditsAllocation;
    default:
      return kFreeCreditsAllocation;
  }
}

int generationsForPlan(String plan) {
  final allocation = creditsAllocationForPlan(plan);
  if (allocation == 0) return 0;
  return allocation ~/ kCreditsPerGeneration;
}

String currentCreditsPeriodKey(String plan) {
  final now = DateTime.now().toUtc();
  if (plan == kSubscriptionPlanProWeekly) {
    final day = DateTime.utc(now.year, now.month, now.day);
    final weekday = day.weekday;
    final thursday = day.add(Duration(days: 4 - weekday));
    final yearStart = DateTime.utc(thursday.year, 1, 1);
    final weekNo = ((thursday.difference(yearStart).inDays + 1) / 7).ceil();
    return '${thursday.year}-W${weekNo.toString().padLeft(2, '0')}';
  }
  return '${now.year}';
}
