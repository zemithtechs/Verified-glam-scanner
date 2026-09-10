import 'package:flutter/foundation.dart';
import 'package:nb_utils/nb_utils.dart';

import '../utils/vg_constants.dart';
import '../utils/vg_credit_constants.dart';
import 'vg_credits_service.dart';
import 'vg_polar_checkout_service.dart';

/// Mock subscription state before RevenueCat integration (Phase 7).
class VGSubscriptionStore {
  static Future<bool> isPro() async {
    return getBoolAsync(vgSubscriptionIsProKey, defaultValue: false);
  }

  static Future<String> plan() async {
    return getStringAsync(vgSubscriptionPlanKey, defaultValue: 'free');
  }

  static Future<void> setPro(
      {required bool value, String planName = 'pro'}) async {
    await setValue(vgSubscriptionIsProKey, value);
    await setValue(vgSubscriptionPlanKey, value ? planName : 'free');
  }

  static Future<int> freeScanCount() async {
    return getIntAsync(vgSubscriptionFreeScanCountKey, defaultValue: 0);
  }

  static Future<void> incrementFreeScanCount() async {
    final count = await freeScanCount();
    await setValue(vgSubscriptionFreeScanCountKey, count + 1);
  }

  static Future<void> resetSessionCounters() async {
    await setValue(vgSubscriptionFreeScanCountKey, 0);
  }

  static Future<bool> purchase({required String planName}) async {
    if (kVGLocalDevMode) {
      return purchaseMock(planName: planName);
    }
    if (!kIsWeb) {
      debugPrint(
        'VGSubscriptionStore.purchase blocked: native Android is consumption-only; '
        'do not open external checkout from the Play Store app.',
      );
      return false;
    }
    final plan = planName == kSubscriptionPlanProWeekly
        ? kSubscriptionPlanProWeekly
        : kSubscriptionPlanAnnual;
    await VGPolarCheckoutService.openCheckout(plan);
    return false;
  }

  static Future<bool> purchaseMock({String planName = 'annual'}) async {
    final plan = planName == kSubscriptionPlanProWeekly
        ? kSubscriptionPlanProWeekly
        : kSubscriptionPlanAnnual;
    await setPro(value: true, planName: plan);
    await VGCreditsService.grantOnMockPurchase(plan);
    return true;
  }

  static Future<bool> restore() async {
    if (kVGLocalDevMode) {
      return restoreMock();
    }
    return VGPolarCheckoutService.refreshSubscriptionFromServer();
  }

  static Future<bool> restoreMock() async {
    final pro = await isPro();
    if (pro) {
      await VGCreditsService.fetchBalance();
    }
    return pro;
  }

  static Future<bool> shouldShowPostOnboardingPaywall() async {
    if (await isPro()) return false;
    return !getBoolAsync(vgSubscriptionPostOnboardingPaywallShownKey,
        defaultValue: false);
  }

  static Future<void> markPostOnboardingPaywallShown() async {
    await setValue(vgSubscriptionPostOnboardingPaywallShownKey, true);
  }

  static Future<bool> shouldBlockProFeature() async {
    if (kVGLocalDevMode) return false;
    return !(await isPro());
  }

  /// Gates the once-per-calendar-day "you're on the Free plan" reminder —
  /// compares calendar days (not a rolling 24h window) so it can only fire
  /// once per day regardless of what time it's first shown.
  static Future<bool> shouldShowFreeReminderToday() async {
    final raw = getStringAsync(vgSubscriptionLastDailyPromptKey);
    if (raw.isEmpty) return true;
    final last = DateTime.tryParse(raw);
    if (last == null) return true;
    final now = DateTime.now();
    return last.year != now.year ||
        last.month != now.month ||
        last.day != now.day;
  }

  static Future<void> markFreeReminderShownToday() async {
    await setValue(
        vgSubscriptionLastDailyPromptKey, DateTime.now().toIso8601String());
  }
}
