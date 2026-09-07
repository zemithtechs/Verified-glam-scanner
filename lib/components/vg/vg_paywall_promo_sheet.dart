import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../components/vg/vg_pill_button.dart';
import '../../screens/BMLoginScreen.dart';
import '../../screens/subscription/vg_subscription_success_screen.dart';
import '../../services/supabase/vg_supabase_auth_service.dart';
import '../../services/vg_subscription_store.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_copy.dart';
import '../../utils/vg_credit_constants.dart';

Future<void> showVGPaywallPromoSheet(BuildContext context) async {
  await VGSubscriptionStore.startPromoTimer();
  if (!context.mounted) return;
  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => const VGPaywallPromoSheet(),
  );
}

class VGPaywallPromoSheet extends StatefulWidget {
  const VGPaywallPromoSheet({super.key});

  @override
  State<VGPaywallPromoSheet> createState() => _VGPaywallPromoSheetState();
}

class _VGPaywallPromoSheetState extends State<VGPaywallPromoSheet> {
  Timer? _timer;
  Duration _remaining = Duration.zero;

  @override
  void initState() {
    super.initState();
    _loadTimer();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _loadTimer());
  }

  Future<void> _loadTimer() async {
    final expiry = await VGSubscriptionStore.promoExpiry();
    if (expiry == null) {
      await VGSubscriptionStore.startPromoTimer();
      if (mounted) setState(() => _remaining = const Duration(minutes: 30));
      return;
    }
    final diff = expiry.difference(DateTime.now());
    if (mounted) setState(() => _remaining = diff.isNegative ? Duration.zero : diff);
  }

  String _format(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '00 : 00 : $m : $s';
  }

  Future<void> _purchase(String planName) async {
    if (!VGSupabaseAuthService.isSignedIn) {
      if (mounted) {
        finish(context);
        BMLoginScreen().launch(context);
      }
      return;
    }
    try {
      final completed = await VGSubscriptionStore.purchase(planName: planName);
      await VGSubscriptionStore.markPromoShownThisSession();
      if (!mounted) return;
      finish(context);
      if (completed) {
        VGSubscriptionSuccessScreen().launch(context);
      }
    } catch (_) {
      if (mounted) toast(VGCopy.paywallCheckoutError);
    }
  }

  Future<void> _copyCode(String code) async {
    await Clipboard.setData(ClipboardData(text: code));
    if (mounted) toast(VGCopy.paywallPromoCodeCopied);
  }

  Widget _couponChip(String code, String hint) {
    return InkWell(
      onTap: () => _copyCode(code),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: Colors.white38),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(code, style: boldTextStyle(color: Colors.white, size: 14, letterSpacing: 1)),
            8.width,
            const Icon(Icons.copy, color: Colors.white70, size: 14),
            8.width,
            Flexible(child: Text(hint, style: secondaryTextStyle(color: Colors.white70, size: 11))),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [bmSpecialColor, bmSpecialColorDark]),
        borderRadius: BorderRadius.circular(24),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () async {
                  await VGSubscriptionStore.markPromoShownThisSession();
                  if (!mounted) return;
                  finish(context);
                },
                icon: const Icon(Icons.close, color: Colors.white70),
              ),
            ),
            Text(VGCopy.paywallPromoTitle, style: boldTextStyle(color: Colors.white, size: 22), textAlign: TextAlign.center),
            8.height,
            Text(VGCopy.paywallPromoSubtitle, style: primaryTextStyle(color: Colors.white70), textAlign: TextAlign.center),
            16.height,
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: Colors.amber.shade700, borderRadius: BorderRadius.circular(8)),
              child: Text('${VGCopy.paywallPromoFlashYearlyPrice}${VGCopy.paywallPromoFlashYearlyPeriod} · ${VGCopy.paywallDiscountBadge}', style: boldTextStyle(color: Colors.white, size: 14)),
            ),
            10.height,
            Text(VGCopy.paywallExpiresIn, style: secondaryTextStyle(color: Colors.white70, size: 12)),
            Text(_format(_remaining), style: boldTextStyle(color: Colors.white, size: 18)),
            16.height,
            // One code works at checkout for either plan below.
            _couponChip(VGCopy.paywallPromoCouponCode, VGCopy.paywallPromoCouponHint),
            20.height,
            VGPillButton(label: VGCopy.paywallPromoChooseYearly, onTap: () => _purchase(kSubscriptionPlanAnnual)),
            10.height,
            VGPillButton(label: VGCopy.paywallPromoChooseWeekly, outline: true, onTap: () => _purchase(kSubscriptionPlanProWeekly)),
          ],
        ),
      ),
    );
  }
}
