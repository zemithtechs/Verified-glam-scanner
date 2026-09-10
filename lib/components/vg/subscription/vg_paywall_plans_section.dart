import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../models/vg_feature_model.dart';
import '../../../utils/BMColors.dart';
import '../../../utils/vg_copy.dart';
import '../../../utils/vg_feature_data.dart';
import '../vg_pill_button.dart';

enum VGPaywallTheme { dark, light }

/// Shared paywall — Yearly + Pro weekly plan cards, compare table, per-plan CTAs.
class VGPaywallPlansSection extends StatefulWidget {
  final void Function(String planId)? onPurchaseForPlan;
  final VoidCallback? onPurchase;
  final VoidCallback? onRestore;
  final VGPaywallTheme theme;
  final bool showCompareTable;
  final bool showPlanCards;
  final bool showTerms;
  final bool showCta;
  final bool perPlanCta;
  final bool compact;
  final bool showCreditPricingRows;

  const VGPaywallPlansSection({
    super.key,
    this.onPurchaseForPlan,
    this.onPurchase,
    this.onRestore,
    this.theme = VGPaywallTheme.light,
    this.showCompareTable = true,
    this.showPlanCards = true,
    this.showTerms = true,
    this.showCta = true,
    this.perPlanCta = false,
    this.compact = false,
    this.showCreditPricingRows = true,
  });

  @override
  State<VGPaywallPlansSection> createState() => VGPaywallPlansSectionState();
}

class VGPaywallPlansSectionState extends State<VGPaywallPlansSection> {
  /// 0 = Yearly, 1 = Pro weekly
  int selectedPlan = VGPaywallPlansSectionState.planYearly;

  static const planYearly = 0;
  static const planProWeekly = 1;

  static String planIdForSelection(int index) =>
      index == planProWeekly ? VGCopy.paywallPlanIdProWeekly : VGCopy.paywallPlanIdAnnual;

  bool get isProSelected => selectedPlan == planProWeekly;

  bool get _dark => widget.theme == VGPaywallTheme.dark;

  void _subscribePlan(int index) {
    setState(() => selectedPlan = index);
    final planId = planIdForSelection(index);
    if (widget.onPurchaseForPlan != null) {
      widget.onPurchaseForPlan!(planId);
    } else {
      widget.onPurchase?.call();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (widget.showPlanCards) ...[
          _planCardsRow(context),
        ],
        if (widget.showCompareTable) ...[
          if (widget.showPlanCards) (widget.compact ? 20.height : 28.height),
          _compareTable(),
        ],
        if (widget.showCta && !widget.perPlanCta) ...[
          widget.compact ? 18.height : 24.height,
          VGPillButton(
            label: VGCopy.paywallSubscribeNow,
            onTap: () => _subscribePlan(selectedPlan),
          ),
          8.height,
          Text(
            VGCopy.paywallCancelAnytime,
            style: secondaryTextStyle(color: _dark ? Colors.white54 : appTextColorSecondary, size: 12),
            textAlign: TextAlign.center,
          ),
        ],
        if (widget.onRestore != null) ...[
          8.height,
          TextButton(
            onPressed: widget.onRestore,
            child: Text(
              VGCopy.paywallRestore,
              style: boldTextStyle(color: _dark ? bmPrimaryColor : bmSpecialColor),
            ),
          ),
        ],
        if (widget.showTerms) ...[
          12.height,
          _termsBlock(),
        ],
      ],
    );
  }

  Widget _planCardsRow(BuildContext context) {
    final sideBySide = MediaQuery.sizeOf(context).width >= 520;
    if (sideBySide) {
      return IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(child: _yearlyCard()),
            const SizedBox(width: 16),
            Expanded(child: _proWeeklyCard()),
          ],
        ),
      );
    }
    return Column(
      children: [
        _yearlyCard(),
        12.height,
        _proWeeklyCard(),
      ],
    );
  }

  Widget _yearlyCard() {
    return _selectablePlanCard(
      index: planYearly,
      badge: VGCopy.paywallBestPrice,
      title: VGCopy.paywallYearlyPlanName,
      price: VGCopy.paywallYearlyPrice,
      period: VGCopy.paywallYearlyPeriod,
      wasPrice: VGCopy.paywallYearlyWasPrice,
      subtitle: VGCopy.paywallYearlySubtitle,
      includedFeatures: [
        ...VGCopy.paywallSharedFeatures,
        ...VGCopy.paywallYearlyFeatures,
      ],
      creditBreakdown: VGCopy.paywallYearlyCreditBreakdown,
    );
  }

  Widget _proWeeklyCard() {
    return _selectablePlanCard(
      index: planProWeekly,
      title: VGCopy.paywallProPlanName,
      price: VGCopy.paywallProWeeklyPrice,
      period: VGCopy.paywallProWeeklyPeriod,
      subtitle: VGCopy.paywallProSubtitle,
      includedFeatures: [
        ...VGCopy.paywallSharedFeatures,
        ...VGCopy.paywallProFeatures,
      ],
      creditBreakdown: VGCopy.paywallProCreditBreakdown,
    );
  }

  Widget _selectablePlanCard({
    required int index,
    required String title,
    required String price,
    required String period,
    required List<String> includedFeatures,
    required List<String> creditBreakdown,
    String? badge,
    String? wasPrice,
    String? subtitle,
  }) {
    final selected = selectedPlan == index;
    final borderColor = selected
        ? (_dark ? bmPrimaryColor : bmSpecialColor)
        : (_dark ? Colors.white24 : bmPrimaryColor.withValues(alpha: 0.25));
    final fill = selected
        ? (_dark ? bmSpecialColor.withValues(alpha: 0.2) : bmSecondBackgroundColorLight)
        : (_dark ? Colors.white10 : Colors.white);

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => setState(() => selectedPlan = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: fill,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: borderColor, width: selected ? 2 : 1),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Icon(
                    selected ? Icons.radio_button_checked : Icons.radio_button_off,
                    size: 20,
                    color: selected ? (_dark ? bmPrimaryColor : bmSpecialColor) : (_dark ? Colors.white54 : bmGreyColor),
                  ),
                  8.width,
                  if (badge != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: _dark ? bmPrimaryColor : bmSpecialColor,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(badge, style: boldTextStyle(color: Colors.white, size: 10)),
                    ),
                ],
              ),
              12.height,
              Text(title, style: boldTextStyle(color: _dark ? Colors.white : bmSpecialColorDark, size: 16)),
              12.height,
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    price,
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w800,
                      color: _dark ? Colors.white : bmSpecialColorDark,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 6, left: 2),
                    child: Text(
                      period,
                      style: secondaryTextStyle(color: _dark ? Colors.white70 : appTextColorSecondary, size: 14),
                    ),
                  ),
                ],
              ),
              if (wasPrice != null) ...[
                4.height,
                Text(
                  wasPrice,
                  style: secondaryTextStyle(
                    color: _dark ? Colors.white38 : appTextColorSecondary,
                    size: 12,
                    decoration: TextDecoration.lineThrough,
                  ),
                ),
              ],
              if (subtitle != null) ...[
                8.height,
                Text(
                  subtitle,
                  style: secondaryTextStyle(color: _dark ? Colors.white60 : appTextColorSecondary, size: 12, height: 1.4),
                ),
              ],
              16.height,
              Text(
                VGCopy.pricingWhatsIncluded,
                style: boldTextStyle(color: _dark ? Colors.white : bmSpecialColorDark, size: 13),
              ),
              8.height,
              ...includedFeatures.map((f) => _featureRow(f)),
              14.height,
              Text(
                VGCopy.pricingCreditBreakdown,
                style: boldTextStyle(color: _dark ? Colors.white : bmSpecialColorDark, size: 13),
              ),
              8.height,
              ...creditBreakdown.map((f) => _featureRow(f, muted: true)),
              if (widget.perPlanCta) ...[
                18.height,
                VGPillButton(
                  label: VGCopy.paywallSubscribeNow,
                  onTap: () => _subscribePlan(index),
                ),
                6.height,
                Text(
                  VGCopy.paywallCancelAnytime,
                  style: secondaryTextStyle(color: _dark ? Colors.white54 : appTextColorSecondary, size: 11),
                  textAlign: TextAlign.center,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _featureRow(String text, {bool muted = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.check, size: 16, color: muted ? (_dark ? Colors.white38 : bmGreyColor) : (_dark ? bmPrimaryColor : bmSpecialColor)),
          8.width,
          Expanded(
            child: Text(
              text,
              style: primaryTextStyle(
                color: muted
                    ? (_dark ? Colors.white60 : appTextColorSecondary)
                    : (_dark ? Colors.white : appTextColorPrimary),
                size: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _compareTable() {
    final features = getVerifiedGlamFeatures();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!widget.compact) ...[
          Text(
            VGCopy.pricingCompareTitle,
            style: boldTextStyle(color: _dark ? Colors.white : bmSpecialColorDark, size: 18),
          ),
          6.height,
          Text(
            VGCopy.pricingCompareSubtitle,
            style: secondaryTextStyle(color: _dark ? Colors.white54 : appTextColorSecondary, size: 13),
          ),
          16.height,
        ],
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: _dark ? Colors.white24 : bmPrimaryColor.withValues(alpha: 0.2)),
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            children: [
              _compareHeader(),
              ...features.map(_compareRow),
              _compareTextRow('Ad-Free Experience', '✓', '✓'),
              _compareTextRow('Download Results', '✓', '✓'),
              if (widget.showCreditPricingRows) ...[
                _compareTextRow('Credits Included', '200/year', '30/week'),
                _compareTextRow('Cost per Generation', 'About \$0.20', 'About \$0.133'),
              ],
              _compareTextRow('Credit Renewal', 'Annual', 'Weekly'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _compareHeader() {
    return Container(
      color: _dark ? Colors.white10 : bmLightScaffoldBackgroundColor,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text('Feature', style: boldTextStyle(color: _dark ? Colors.white70 : appTextColorSecondary, size: 12)),
          ),
          Expanded(
            child: Text(VGCopy.paywallYearlyColumn, style: boldTextStyle(color: _dark ? Colors.white70 : appTextColorSecondary, size: 12), textAlign: TextAlign.center),
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 4),
              decoration: BoxDecoration(
                color: bmSpecialColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(VGCopy.paywallProColumn, style: boldTextStyle(color: bmSpecialColor, size: 12), textAlign: TextAlign.center),
            ),
          ),
        ],
      ),
    );
  }

  Widget _compareRow(VGFeatureModel feature) {
    return _compareTextRow(feature.title, '✓', '✓');
  }

  Widget _compareTextRow(String label, String yearly, String pro) {
    return Container(
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: _dark ? Colors.white12 : bmPrimaryColor.withValues(alpha: 0.12))),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Expanded(flex: 3, child: Text(label, style: primaryTextStyle(color: _dark ? Colors.white : appTextColorPrimary, size: 12))),
          Expanded(child: Center(child: Text(yearly, style: boldTextStyle(color: bmSpecialColor, size: 12)))),
          Expanded(child: Center(child: Text(pro, style: boldTextStyle(color: bmSpecialColor, size: 12)))),
        ],
      ),
    );
  }

  Widget _termsBlock() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(VGCopy.paywallSubscriptionTerms, style: secondaryTextStyle(color: _dark ? Colors.white38 : appTextColorSecondary, size: 10, height: 1.4)),
        8.height,
        Text(VGCopy.paywallCancellationTerms, style: secondaryTextStyle(color: _dark ? Colors.white38 : appTextColorSecondary, size: 10, height: 1.4)),
        8.height,
        Text(
          '${VGCopy.paywallTermsPrefix} ${VGCopy.paywallTerms} · ${VGCopy.paywallPrivacy}',
          style: secondaryTextStyle(color: _dark ? Colors.white38 : appTextColorSecondary, size: 10),
        ),
      ],
    );
  }
}

String vgPaywallPlanIdFromSection(GlobalKey<VGPaywallPlansSectionState> key) {
  final state = key.currentState;
  return VGPaywallPlansSectionState.planIdForSelection(state?.selectedPlan ?? VGPaywallPlansSectionState.planYearly);
}
