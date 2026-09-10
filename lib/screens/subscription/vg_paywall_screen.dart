import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../components/vg/subscription/vg_paywall_plans_section.dart';
import '../../components/vg/vg_loading_overlay.dart';
import '../../services/vg_subscription_store.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_copy.dart';

enum VGPaywallEntry { onboarding, feature, profile, dailyReminder }

/// Informational "what's included in Premium" screen — no prices, no
/// purchase buttons, no clickable checkout links. Google Play's
/// consumption-only policy requires this for a Play-distributed app that
/// can't use Play Billing; the only permitted mention of purchasing is
/// non-linked text pointing to the website. "Refresh Access" only checks
/// server-side entitlement (VGSubscriptionStore.restore), it never buys
/// anything.
class VGPaywallScreen extends StatefulWidget {
  final VGPaywallEntry entry;
  final VoidCallback? onDismiss;

  const VGPaywallScreen({super.key, this.entry = VGPaywallEntry.onboarding, this.onDismiss});

  @override
  State<VGPaywallScreen> createState() => _VGPaywallScreenState();
}

class _VGPaywallScreenState extends State<VGPaywallScreen> {
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

  void _dismiss() {
    finish(context);
    widget.onDismiss?.call();
  }

  String get _title => switch (widget.entry) {
        VGPaywallEntry.onboarding => VGCopy.paywallOnboardingTitle,
        VGPaywallEntry.dailyReminder => VGCopy.dailyReminderTitle,
        _ => VGCopy.paywallTitle,
      };

  String get _subtitle => switch (widget.entry) {
        VGPaywallEntry.onboarding => VGCopy.paywallOnboardingSubtitle,
        VGPaywallEntry.dailyReminder => VGCopy.dailyReminderSubtitle,
        _ => VGCopy.paywallSubtitle,
      };

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
                    Text(
                      _title,
                      style: boldTextStyle(color: Colors.white, size: 24),
                      textAlign: TextAlign.center,
                    ),
                    8.height,
                    Text(
                      _subtitle,
                      style: primaryTextStyle(color: Colors.white70),
                      textAlign: TextAlign.center,
                    ),
                    24.height,
                    VGPaywallPlansSection(
                      onRestore: _restore,
                      theme: VGPaywallTheme.dark,
                      compact: true,
                      showPlanCards: false,
                      showCta: false,
                      showTerms: false,
                      showCreditPricingRows: false,
                    ),
                    16.height,
                    Text(
                      VGCopy.paywallWebsiteNotice,
                      style: primaryTextStyle(color: Colors.white, size: 13),
                      textAlign: TextAlign.center,
                    ),
                    6.height,
                    Text(
                      VGCopy.paywallAlreadyMemberHint,
                      style: secondaryTextStyle(color: Colors.white54, size: 12),
                      textAlign: TextAlign.center,
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
