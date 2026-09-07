import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

import '../utils/vg_constants.dart';
import '../utils/vg_credit_constants.dart';
import 'supabase/vg_api_client.dart';
import 'supabase/vg_supabase_auth_service.dart';
import 'vg_credits_service.dart';
import 'vg_subscription_store.dart';

/// Polar.sh checkout via Supabase Edge Functions (no Polar API key in app).
class VGPolarCheckoutService {
  VGPolarCheckoutService._();

  static String? publicCheckoutUrlForPlan(String planId) {
    if (planId == kSubscriptionPlanAnnual) {
      return vgPolarCheckoutLinkAnnual.isNotEmpty ? vgPolarCheckoutLinkAnnual : null;
    }
    if (planId == kSubscriptionPlanProWeekly) {
      return vgPolarCheckoutLinkProWeekly.isNotEmpty ? vgPolarCheckoutLinkProWeekly : null;
    }
    return null;
  }

  static Future<String> createCheckoutUrl(String planId) async {
    Map<String, dynamic> data;
    try {
      data = await VGApiClient.post('/api/polar/checkout', body: {'planId': planId});
    } on VGApiException catch (e) {
      throw StateError(e.message);
    }

    if (data['checkoutUrl'] is! String) {
      throw StateError('Invalid checkout response');
    }
    return data['checkoutUrl'] as String;
  }

  static Future<void> _launchCheckoutUrl(String url) async {
    final uri = Uri.parse(url);
    final launched = await launchUrl(
      uri,
      mode: kIsWeb ? LaunchMode.platformDefault : LaunchMode.externalApplication,
      webOnlyWindowName: kIsWeb ? '_self' : null,
    );
    if (!launched) {
      throw StateError('Could not open checkout');
    }
  }

  /// Opens Polar checkout — signed-in users get account linking; guests use public checkout link.
  static Future<void> openCheckout(String planId) async {
    if (VGSupabaseAuthService.isSignedIn) {
      final url = await createCheckoutUrl(planId);
      await _launchCheckoutUrl(url);
      return;
    }

    final guestUrl = publicCheckoutUrlForPlan(planId);
    if (guestUrl == null) {
      throw StateError('Checkout not configured for plan $planId');
    }
    await _launchCheckoutUrl(guestUrl);
  }

  static Future<String> createPortalUrl() async {
    Map<String, dynamic> data;
    try {
      data = await VGApiClient.post('/api/polar/portal');
    } on VGApiException catch (e) {
      throw StateError(e.message);
    }

    if (data['portalUrl'] is! String) {
      throw StateError('Invalid portal response');
    }
    return data['portalUrl'] as String;
  }

  static Future<void> openCustomerPortal() async {
    final url = await createPortalUrl();
    final uri = Uri.parse(url);
    final launched = await launchUrl(
      uri,
      mode: kIsWeb ? LaunchMode.platformDefault : LaunchMode.externalApplication,
      webOnlyWindowName: kIsWeb ? '_blank' : null,
    );
    if (!launched) {
      throw StateError('Could not open subscription portal');
    }
  }

  /// Poll until webhook marks the user Pro (post-checkout).
  static Future<bool> pollSubscriptionFromServer({
    int maxAttempts = 15,
    Duration delay = const Duration(seconds: 2),
  }) async {
    for (var attempt = 0; attempt < maxAttempts; attempt++) {
      final isPro = await refreshSubscriptionFromServer();
      if (isPro) return true;
      if (attempt < maxAttempts - 1) {
        await Future.delayed(delay);
      }
    }
    return false;
  }

  /// Webhook is source of truth — refresh profile credits and local Pro cache.
  static Future<bool> refreshSubscriptionFromServer() async {
    if (!VGSupabaseAuthService.isSignedIn) {
      await VGSubscriptionStore.setPro(value: false);
      return false;
    }

    try {
      final row = await VGApiClient.get('/api/profiles/me');
      final isPro = row['is_pro'] == true;
      final plan = row['subscription_plan'] as String? ?? 'free';
      await VGSubscriptionStore.setPro(value: isPro, planName: isPro ? plan : 'free');
      await VGCreditsService.fetchBalance();
      return isPro;
    } catch (e) {
      debugPrint('VGPolarCheckoutService.refreshSubscriptionFromServer: $e');
      return VGSubscriptionStore.isPro();
    }
  }
}
