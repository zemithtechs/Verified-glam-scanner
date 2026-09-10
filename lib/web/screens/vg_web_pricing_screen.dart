import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../components/vg/subscription/vg_paywall_plans_section.dart';
import '../../components/vg/vg_loading_overlay.dart';
import '../../components/vg/vg_pill_button.dart';
import '../../services/backend/vg_auth_service.dart';
import '../../services/vg_polar_checkout_service.dart';
import '../../services/vg_subscription_store.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_copy.dart';
import '../content/vg_tool_landing_content.dart';
import '../vg_web_breakpoints.dart';
import '../vg_web_seo.dart';
import '../vg_web_seo_schema.dart';
import '../widgets/vg_web_faq_section.dart';
import '../widgets/vg_web_footer.dart';
import '../widgets/vg_web_header.dart';

/// Public SEO pricing page at `/pricing` — SaaS-style layout.
class VGWebPricingScreen extends StatefulWidget {
  const VGWebPricingScreen({super.key});

  @override
  State<VGWebPricingScreen> createState() => _VGWebPricingScreenState();
}

class _VGWebPricingScreenState extends State<VGWebPricingScreen> {
  @override
  void initState() {
    super.initState();
    vgWebSetPageMeta(
      title: VGCopy.pricingMetaTitle,
      description: VGCopy.pricingMetaDescription,
      canonicalPath: '/pricing',
      jsonLd: vgSeoPricingJsonLd(),
    );
    _handleCheckoutQuery();
  }

  Future<void> _handleCheckoutQuery() async {
    final checkout = Uri.base.queryParameters['checkout'];
    if (checkout == null || checkout.isEmpty) return;
    if (!mounted) return;

    if (checkout == 'cancelled') {
      toast(VGCopy.checkoutCancelledToast);
      return;
    }
    if (checkout == 'pending') {
      toast(VGCopy.checkoutPendingToast);
      return;
    }
    if (checkout != 'success') return;

    final restored = await VGPolarCheckoutService.pollSubscriptionFromServer();
    if (!mounted) return;
    if (restored) {
      toast(VGCopy.checkoutSuccessToast);
      context.go('/app/face-beauty-analysis');
    } else {
      toast(VGCopy.checkoutPendingToast);
    }
  }

  Future<void> _purchaseForPlan(String planId) async {
    VGLoadingOverlay.show(context, message: VGCopy.paywallCheckoutOpening);
    try {
      final completed = await VGSubscriptionStore.purchase(planName: planId);
      if (!mounted) return;
      VGLoadingOverlay.hide(context);
      if (completed) {
        toast(VGCopy.subscriptionSuccessTitle);
      }
    } catch (e) {
      if (mounted) {
        VGLoadingOverlay.hide(context);
        toast(VGCopy.paywallCheckoutError);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final desktop = VGWebBreakpoints.isDesktop(context);
    final signedIn = VGAuthService.isSignedIn;
    final padding = VGWebBreakpoints.contentPadding(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const VGWebHeader(pricingActive: true),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              color: bmLightScaffoldBackgroundColor,
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: VGWebBreakpoints.maxContent),
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(padding, 56, padding, 48),
                    child: Column(
                      children: [
                        Text(
                          VGCopy.pricingHeroTitle,
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: desktop ? 40 : 30,
                            color: bmSpecialColorDark,
                            letterSpacing: -0.5,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          VGCopy.pricingHeroSubtitle,
                          style: TextStyle(
                            fontSize: desktop ? 17 : 15,
                            height: 1.55,
                            color: appTextColorSecondary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 960),
                child: Padding(
                  padding: EdgeInsets.fromLTRB(padding, 40, padding, 48),
                  child: VGPaywallPlansSection(
                    onPurchaseForPlan: _purchaseForPlan,
                    theme: VGPaywallTheme.light,
                    perPlanCta: true,
                    showCta: false,
                  ),
                ),
              ),
            ),
            if (!signedIn)
              ColoredBox(
                color: bmSecondBackgroundColorLight,
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 960),
                    child: Padding(
                      padding: EdgeInsets.fromLTRB(padding, 32, padding, 40),
                      child: Column(
                        children: [
                          VGPillButton(
                            label: VGCopy.pricingSignUpCta,
                            onTap: () => context.go('/register'),
                            width: desktop ? 360 : double.infinity,
                          ),
                          const SizedBox(height: 12),
                          TextButton(
                            onPressed: () => context.go('/login'),
                            child: const Text(
                              'Already have an account? Log in',
                              style: TextStyle(color: bmSpecialColor),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            VGWebFaqSection(
              items: VGCopy.pricingFaqItems
                  .map((e) => VGFaqItem(question: e.$1, answer: e.$2))
                  .toList(),
            ),
            const VGWebFooter(),
          ],
        ),
      ),
    );
  }
}