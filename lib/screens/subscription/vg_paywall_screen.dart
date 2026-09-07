import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../components/vg/subscription/vg_paywall_plans_section.dart';
import '../../components/vg/vg_loading_overlay.dart';
import '../../components/vg/vg_paywall_promo_sheet.dart';
import '../../screens/BMLoginScreen.dart';
import '../../services/supabase/vg_supabase_auth_service.dart';
import '../../services/vg_subscription_store.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_copy.dart';
import 'vg_subscription_success_screen.dart';

enum VGPaywallEntry { onboarding, feature, profile, promo }

class VGPaywallScreen extends StatefulWidget {
  final VGPaywallEntry entry;
  final VoidCallback? onDismiss;

  const VGPaywallScreen({super.key, this.entry = VGPaywallEntry.onboarding, this.onDismiss});

  @override
  State<VGPaywallScreen> createState() => _VGPaywallScreenState();
}

class _VGPaywallScreenState extends State<VGPaywallScreen> {
  final _plansKey = GlobalKey<VGPaywallPlansSectionState>();

  Future<void> _purchaseForPlan(String planId) async {
    if (!VGSupabaseAuthService.isSignedIn) {
      if (mounted) {
        toast('Sign in to subscribe');
        BMLoginScreen().launch(context);
      }
      return;
    }

    VGLoadingOverlay.show(context, message: VGCopy.paywallCheckoutOpening);
    try {
      final completed = await VGSubscriptionStore.purchase(planName: planId);
      if (!mounted) return;
      VGLoadingOverlay.hide(context);
      if (completed) {
        finish(context);
        VGSubscriptionSuccessScreen().launch(context);
      }
    } catch (_) {
      if (mounted) {
        VGLoadingOverlay.hide(context);
        toast(VGCopy.paywallCheckoutError);
      }
    }
  }

  Future<void> _restore() async {
    VGLoadingOverlay.show(context);
    final restored = await VGSubscriptionStore.restore();
    if (!mounted) return;
    VGLoadingOverlay.hide(context);
    toast(restored ? VGCopy.paywallRestoreSuccess : VGCopy.paywallRestoreEmpty);
    if (restored && mounted) {
      finish(context);
      widget.onDismiss?.call();
    }
  }

  Future<void> _dismiss() async {
    if (await VGSubscriptionStore.shouldShowPromoAfterDismiss()) {
      if (!mounted) return;
      await showVGPaywallPromoSheet(context);
      if (!mounted) return;
    }
    finish(context);
    widget.onDismiss?.call();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _dismiss();
      },
      child: Scaffold(
      backgroundColor: const Color(0xFF121212),
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: _dismiss,
                icon: const Icon(Icons.close, color: Colors.white70),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    Icon(Icons.workspace_premium, color: bmPrimaryColor, size: 56),
                    12.height,
                    Text(VGCopy.paywallTitle, style: boldTextStyle(color: Colors.white, size: 24), textAlign: TextAlign.center),
                    8.height,
                    Text(VGCopy.paywallSubtitle, style: primaryTextStyle(color: Colors.white70), textAlign: TextAlign.center),
                    24.height,
                    VGPaywallPlansSection(
                      key: _plansKey,
                      onPurchaseForPlan: _purchaseForPlan,
                      onRestore: _restore,
                      theme: VGPaywallTheme.dark,
                      perPlanCta: true,
                      compact: true,
                    ),
                    24.height,
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      ),
    );
  }
}
