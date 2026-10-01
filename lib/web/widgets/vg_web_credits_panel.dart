import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../components/vg/vg_pill_button.dart';
import '../../services/vg_credits_service.dart';
import '../../services/vg_polar_checkout_service.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_copy.dart';
import '../vg_web_breakpoints.dart';
import 'vg_web_page_scaffold.dart';

enum _CreditHistoryView { earned, used }

/// SaaS-style credits dashboard: KPI row, subscription card, usage table.
class VGWebCreditsPanel extends StatefulWidget {
  const VGWebCreditsPanel({super.key});

  @override
  State<VGWebCreditsPanel> createState() => _VGWebCreditsPanelState();
}

class _VGWebCreditsPanelState extends State<VGWebCreditsPanel> {
  VGCreditSnapshot? _snapshot;
  List<VGCreditTransaction> _transactions = const [];
  _CreditHistoryView _historyView = _CreditHistoryView.earned;
  DateTime _rangeFrom = DateTime.now().subtract(const Duration(days: 6));
  DateTime _rangeTo = DateTime.now();
  bool _howExpanded = false;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final snapshot = await VGCreditsService.fetchSnapshot();
    final transactions = await VGCreditsService.fetchTransactions(
      from: _rangeFrom,
      to: _rangeTo,
      earnedOnly: _historyView == _CreditHistoryView.earned,
      usedOnly: _historyView == _CreditHistoryView.used,
    );
    if (!mounted) return;
    setState(() {
      _snapshot = snapshot ?? VGCreditSnapshot.empty;
      _transactions = transactions;
      _loading = false;
    });
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final initial = isFrom ? _rangeFrom : _rangeTo;
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2024),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked == null || !mounted) return;
    setState(() {
      if (isFrom) {
        _rangeFrom = picked;
        if (_rangeFrom.isAfter(_rangeTo)) _rangeTo = _rangeFrom;
      } else {
        _rangeTo = picked;
        if (_rangeTo.isBefore(_rangeFrom)) _rangeFrom = _rangeTo;
      }
    });
    await _load();
  }

  String _formatDate(DateTime dt) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
  }

  @override
  Widget build(BuildContext context) {
    if (_loading && _snapshot == null) {
      return const VGWebDesktopCard(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Center(child: CircularProgressIndicator(color: bmSpecialColor)),
        ),
      );
    }

    final snapshot = _snapshot ?? VGCreditSnapshot.empty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _kpiRow(snapshot),
        const SizedBox(height: 16),
        _subscriptionCard(snapshot),
        const SizedBox(height: 16),
        _usageTableCard(snapshot),
      ],
    );
  }

  Widget _kpiRow(VGCreditSnapshot snapshot) {
    final analysesLeft = snapshot.isPro ? snapshot.balance ~/ 5 : 0;
    final balanceCard = _kpiCard(
      label: VGCopy.creditsMetricBalance,
      value: '${snapshot.balance}',
      hint: !snapshot.isPro ? VGCopy.creditsFreePlanKpiHint : null,
    );
    final planCard = _kpiCard(
      label: VGCopy.creditsMetricPlan,
      value: snapshot.isPro ? snapshot.planDisplayName : VGCopy.profileSubscriptionFree,
      statusPill: snapshot.isPro ? VGCopy.creditsPlanStatus(snapshot.subscriptionStatus) : null,
    );
    final analysesCard = _kpiCard(
      label: VGCopy.creditsMetricAnalysesLeft,
      value: '$analysesLeft',
      hint: !snapshot.isPro ? VGCopy.creditsFreePlanKpiHint : null,
    );

    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 640) {
          return Column(
            children: [
              balanceCard,
              const SizedBox(height: 12),
              planCard,
              const SizedBox(height: 12),
              analysesCard,
            ],
          );
        }
        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: balanceCard),
            const SizedBox(width: 12),
            Expanded(child: planCard),
            const SizedBox(width: 12),
            Expanded(child: analysesCard),
          ],
        );
      },
    );
  }

  Widget _kpiCard({
    required String label,
    required String value,
    String? hint,
    String? statusPill,
  }) {
    final phone = VGWebBreakpoints.isPhone(context);
    return VGWebDesktopCard(
      padding: EdgeInsets.all(phone ? 14 : 16),
      child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: secondaryTextStyle(size: 12)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                Text(value, style: boldTextStyle(color: bmSpecialColorDark, size: 22)),
                if (statusPill != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: bmSecondBackgroundColorLight,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(statusPill, style: secondaryTextStyle(size: 11)),
                  ),
              ],
            ),
            if (hint != null) ...[
              const SizedBox(height: 6),
              Text(hint, style: secondaryTextStyle(size: 11, height: 1.35)),
            ],
          ],
      ),
    );
  }

  Widget _subscriptionCard(VGCreditSnapshot snapshot) {
    final phone = VGWebBreakpoints.isPhone(context);
    return VGWebDesktopCard(
      padding: EdgeInsets.all(phone ? 16 : 20),
      child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(VGCopy.creditsMyCreditsTitle, style: boldTextStyle(color: bmSpecialColorDark, size: 16)),
            const SizedBox(height: 16),
            if (snapshot.allocated > 0) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: LinearProgressIndicator(
                  value: snapshot.progressFraction,
                  minHeight: 8,
                  backgroundColor: bmSecondBackgroundColorLight,
                  color: bmSpecialColor,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                VGCopy.creditsProgress(snapshot.balance, snapshot.allocated),
                style: secondaryTextStyle(size: 12),
              ),
            ] else ...[
              Text(
                VGCopy.creditsSubscribeToReceiveCredits,
                style: secondaryTextStyle(size: 13, height: 1.45),
              ),
            ],
            if (snapshot.isPro && snapshot.periodEnd != null) ...[
              const SizedBox(height: 8),
              Text(
                '${VGCopy.creditsRenewsOn} ${_formatDate(snapshot.periodEnd!.toLocal())}',
                style: secondaryTextStyle(size: 12),
              ),
            ],
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerLeft,
              child: VGPillButton(
                label: snapshot.isPro ? VGCopy.profileManageSubscription : VGCopy.creditsBuyCredits,
                onTap: () async {
                  if (snapshot.isPro) {
                    try {
                      await VGPolarCheckoutService.openCustomerPortal();
                    } catch (_) {
                      if (mounted) toast(VGCopy.paywallCheckoutError);
                    }
                  } else {
                    context.go('/pricing');
                  }
                },
              ),
            ),
            const SizedBox(height: 12),
            InkWell(
              onTap: () => setState(() => _howExpanded = !_howExpanded),
              borderRadius: BorderRadius.circular(8),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(
                  children: [
                    Icon(
                      _howExpanded ? Icons.expand_less : Icons.expand_more,
                      color: bmSpecialColor,
                      size: 20,
                    ),
                    const SizedBox(width: 6),
                    Text(VGCopy.creditsHowTitle, style: boldTextStyle(size: 13, color: bmSpecialColor)),
                  ],
                ),
              ),
            ),
            if (_howExpanded) ...[
              const SizedBox(height: 8),
              Text(VGCopy.creditsHowIntro, style: secondaryTextStyle(size: 13, height: 1.45)),
              const SizedBox(height: 8),
              ...VGCopy.creditsHowExamples.map(
                (line) => Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Text('• $line', style: secondaryTextStyle(size: 12, height: 1.4)),
                ),
              ),
              const SizedBox(height: 8),
              Text(VGCopy.creditsHowDeduction, style: secondaryTextStyle(size: 12, height: 1.4)),
              const SizedBox(height: 4),
              Text(VGCopy.creditsHowRenewal, style: secondaryTextStyle(size: 12, height: 1.4)),
            ],
          ],
      ),
    );
  }

  Widget _usageTableCard(VGCreditSnapshot snapshot) {
    final phone = VGWebBreakpoints.isPhone(context);

    return VGWebDesktopCard(
      padding: EdgeInsets.all(phone ? 16 : 20),
      child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(VGCopy.creditsUsageDetailsTitle, style: boldTextStyle(color: bmSpecialColorDark, size: 16)),
            const SizedBox(height: 16),
            phone
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _viewToggle(VGCopy.creditsViewEarned, _CreditHistoryView.earned),
                          _viewToggle(VGCopy.creditsViewUsed, _CreditHistoryView.used),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _dateField('From', _rangeFrom, true),
                          _dateField('To', _rangeTo, false),
                        ],
                      ),
                    ],
                  )
                : Row(
                    children: [
                      _viewToggle(VGCopy.creditsViewEarned, _CreditHistoryView.earned),
                      const SizedBox(width: 8),
                      _viewToggle(VGCopy.creditsViewUsed, _CreditHistoryView.used),
                      const Spacer(),
                      _dateField('From', _rangeFrom, true),
                      const SizedBox(width: 8),
                      _dateField('To', _rangeTo, false),
                    ],
                  ),
            const SizedBox(height: 16),
            if (_transactions.isEmpty)
              Text(
                snapshot.isPro ? VGCopy.creditsHistoryEmpty : VGCopy.creditsHistoryEmptyFree,
                style: secondaryTextStyle(size: 13, height: 1.45),
              )
            else if (phone)
              Column(
                children: _transactions.map(_transactionCard).toList(),
              )
            else
              Column(
                children: [
                  Container(
                    color: bmSecondBackgroundColorLight.withValues(alpha: 0.5),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    child: Row(
                      children: [
                        Expanded(flex: 2, child: Text('Date', style: boldTextStyle(size: 12, color: bmSpecialColorDark))),
                        Expanded(flex: 4, child: Text('Description', style: boldTextStyle(size: 12, color: bmSpecialColorDark))),
                        Expanded(child: Text('Amount', style: boldTextStyle(size: 12, color: bmSpecialColorDark), textAlign: TextAlign.end)),
                      ],
                    ),
                  ),
                  ..._transactions.asMap().entries.map((entry) {
                    final zebra = entry.key.isEven ? Colors.white : bmSecondBackgroundColorLight.withValues(alpha: 0.35);
                    return ColoredBox(
                      color: zebra,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        child: _transactionRow(entry.value),
                      ),
                    );
                  }),
                ],
              ),
          ],
      ),
    );
  }

  Widget _viewToggle(String label, _CreditHistoryView view) {
    final selected = _historyView == view;
    return TextButton(
      onPressed: () async {
        setState(() => _historyView = view);
        await _load();
      },
      style: TextButton.styleFrom(
        foregroundColor: selected ? Colors.white : bmSpecialColor,
        backgroundColor: selected ? bmSpecialColor : bmSecondBackgroundColorLight,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
      ),
      child: Text(label, style: boldTextStyle(size: 12, color: selected ? Colors.white : bmSpecialColor)),
    );
  }

  Widget _dateField(String label, DateTime value, bool isFrom) {
    return InkWell(
      onTap: () => _pickDate(isFrom: isFrom),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.25)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('$label: ', style: secondaryTextStyle(size: 12)),
            Text(_formatDate(value), style: boldTextStyle(size: 12, color: bmSpecialColorDark)),
            const SizedBox(width: 4),
            const Icon(Icons.calendar_today, size: 14, color: bmSpecialColor),
          ],
        ),
      ),
    );
  }

  Widget _transactionCard(VGCreditTransaction tx) {
    final amountColor = tx.amount >= 0 ? const Color(0xFF059669) : bmSpecialColorDark;
    final amountText = tx.amount >= 0 ? '+${tx.amount}' : '${tx.amount}';
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bmSecondBackgroundColorLight.withValues(alpha: 0.35),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.12)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(_formatDate(tx.createdAt.toLocal()), style: secondaryTextStyle(size: 11)),
              ),
              Text(amountText, style: boldTextStyle(size: 14, color: amountColor)),
            ],
          ),
          const SizedBox(height: 6),
          Text(tx.description, style: primaryTextStyle(size: 13, height: 1.35)),
        ],
      ),
    );
  }

  Widget _transactionRow(VGCreditTransaction tx) {
    final amountColor = tx.amount >= 0 ? const Color(0xFF059669) : bmSpecialColorDark;
    final amountText = tx.amount >= 0 ? '+${tx.amount}' : '${tx.amount}';
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 2,
          child: Text(_formatDate(tx.createdAt.toLocal()), style: secondaryTextStyle(size: 12)),
        ),
        Expanded(
          flex: 4,
          child: Text(tx.description, style: primaryTextStyle(size: 13)),
        ),
        Expanded(
          child: Text(
            amountText,
            style: boldTextStyle(size: 13, color: amountColor),
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
  }
}
