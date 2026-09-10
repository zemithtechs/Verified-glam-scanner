import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../models/vg_feature_model.dart';
import '../screens/BMDashboardScreen.dart';
import '../screens/onboarding/vg_onboarding_flow.dart';
import '../screens/scan/vg_photo_guidelines_screen.dart';
import '../screens/subscription/vg_paywall_screen.dart';
import '../screens/BMLoginScreen.dart';
import '../services/ads/vg_ads_config.dart';
import '../services/ads/vg_ads_manager.dart';
import '../services/supabase/vg_supabase_auth_service.dart';
import '../services/supabase/vg_supabase_config.dart';
import '../services/supabase/vg_supabase_init.dart';
import '../services/vg_onboarding_store.dart';
import '../services/vg_referral_bonus_store.dart';
import '../services/vg_subscription_store.dart';
import '../utils/vg_constants.dart';
import '../web/screens/subscription/vg_web_paywall_dialog.dart';
import '../web/vg_feature_slugs.dart';
import '../web/vg_web_app_prefs.dart';
import '../web/vg_web_breakpoints.dart';
import '../web/vg_web_page_nav_stub.dart'
    if (dart.library.html) '../web/vg_web_page_nav_web.dart' as page_nav;

Future<void> vgNavigateAfterWalkthrough(BuildContext context) async {
  final complete = await VGOnboardingStore.isComplete();
  if (!context.mounted) return;
  if (!complete) {
    VGOnboardingFlow().launch(context, isNewTask: true);
  } else {
    BMDashboardScreen(flag: false).launch(context, isNewTask: true);
  }
}

void vgShowPricingOrPaywall(BuildContext context) {
  if (kIsWeb) {
    context.go('/pricing');
    return;
  }
  vgShowPaywall(context, entry: VGPaywallEntry.feature);
}

Future<void> vgShowPaywall(
  BuildContext context, {
  VGPaywallEntry entry = VGPaywallEntry.feature,
  VoidCallback? onDismiss,
}) async {
  if (kIsWeb && VGWebBreakpoints.isDesktop(context)) {
    await showVGWebPaywallDialog(context, onDismiss: onDismiss);
    return;
  }
  await VGPaywallScreen(entry: entry, onDismiss: onDismiss).launch(context);
}

Future<void> vgStartAnalysis(BuildContext context, VGFeatureModel feature) async {
  if (!context.mounted) return;

  if (kIsWeb && VGWebBreakpoints.isDesktop(context)) {
    if (kVGUseSupabase &&
        VGSupabaseConfig.isConfigured &&
        VGSupabaseInit.isReady &&
        !VGSupabaseAuthService.isSignedIn) {
      toast('Sign in to run analyses');
      final slug = slugForFeatureType(feature.featureType);
      page_nav.vgWebGoLogin(redirectPath: '/app/$slug');
      return;
    }
    if (feature.isPro && await VGSubscriptionStore.shouldBlockProFeature()) {
      await vgShowPaywall(context, entry: VGPaywallEntry.feature);
      if (!context.mounted) return;
      if (await VGSubscriptionStore.shouldBlockProFeature()) return;
    }
    if (!context.mounted) return;
    context.go('/app/${slugForFeatureType(feature.featureType)}');
    return;
  }

  if (kVGUseSupabase &&
      VGSupabaseConfig.isConfigured &&
      VGSupabaseInit.isReady &&
      !VGSupabaseAuthService.isSignedIn) {
    toast('Sign in to run analyses');
    if (kIsWeb) {
      final path = GoRouterState.of(context).uri.path;
      page_nav.vgWebGoLogin(redirectPath: path);
    } else {
      BMLoginScreen().launch(context);
    }
    return;
  }
  if (feature.isPro && await VGSubscriptionStore.shouldBlockProFeature()) {
    await vgShowPaywall(context, entry: VGPaywallEntry.feature);
    if (!context.mounted) return;
    if (await VGSubscriptionStore.shouldBlockProFeature()) return;
  }
  if (!context.mounted) return;
  VGPhotoGuidelinesScreen(feature: feature).launch(context);
}

Future<void> vgShowPostOnboardingPaywallIfNeeded(BuildContext context) async {
  void goHome() {
    if (kIsWeb) {
      context.go(vgWebDefaultAppPath());
    } else {
      BMDashboardScreen(flag: true).launch(context, isNewTask: true);
    }
  }

  if (!await VGSubscriptionStore.shouldShowPostOnboardingPaywall()) {
    goHome();
    return;
  }
  await VGSubscriptionStore.markPostOnboardingPaywallShown();
  if (!context.mounted) return;
  await vgShowPaywall(
    context,
    entry: VGPaywallEntry.onboarding,
    onDismiss: () {
      if (context.mounted) goHome();
    },
  );
}

Future<void> vgMaybeShowAdBeforeResults(BuildContext context) async {
  if (kVGLocalDevMode) return;
  if (await VGSubscriptionStore.isPro() && !VGAdsConfig.forceShowForTesting) return;
  // A referral bonus scan skips the ad entirely; otherwise show one. Never a
  // purchase nudge mid-task — Google Play consumption-only compliance.
  if (!await VGReferralBonusStore.consumeBonusScan()) {
    await VGAdsManager.instance.maybeShowInterstitial();
  }
  await VGSubscriptionStore.incrementFreeScanCount();
}

/// Once-per-calendar-day "you're on the Free plan" reminder for free users
/// who already finished onboarding — shown at a natural app-open moment
/// (dashboard load), never mid-task. Same compliant info screen as
/// [vgShowPaywall]; no prices, no purchase buttons, no clickable links.
Future<void> vgMaybeShowFreeReminder(BuildContext context) async {
  if (kVGLocalDevMode) return;
  if (await VGSubscriptionStore.isPro()) return;
  if (!await VGSubscriptionStore.shouldShowFreeReminderToday()) return;
  await VGSubscriptionStore.markFreeReminderShownToday();
  if (!context.mounted) return;
  await vgShowPaywall(context, entry: VGPaywallEntry.dailyReminder);
}
