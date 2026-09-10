import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../components/vg/challenge/vg_challenge_badge_grid.dart';
import '../components/vg/vg_main_app_bar.dart';
import '../components/vg/vg_pill_button.dart';
import '../main.dart';
import '../models/vg_challenge_plan.dart';
import '../models/vg_feature_model.dart';
import '../screens/BMLoginScreen.dart';
import '../screens/guide/vg_challenge_reward_screen.dart';
import '../screens/guide/vg_routine_challenge_screen.dart';
import '../screens/scan/vg_scan_history_screen.dart';
import '../services/backend/vg_auth_service.dart';
import '../services/vg_challenge_service.dart';
import '../services/vg_credits_service.dart';
import '../utils/BMColors.dart';
import '../utils/vg_challenge_badges.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_copy.dart';
import '../utils/vg_dashboard_nav.dart';
import '../utils/vg_feature_data.dart';
import '../utils/vg_navigation.dart';
import '../web/vg_web_breakpoints.dart';
import '../web/vg_web_navigation.dart';
import '../screens/subscription/vg_paywall_screen.dart';

class VGProfileFragment extends StatefulWidget {
  const VGProfileFragment({super.key});

  @override
  State<VGProfileFragment> createState() => _VGProfileFragmentState();
}

class _VGProfileFragmentState extends State<VGProfileFragment> {
  List<Map<String, dynamic>> _badges = const [];
  Map<String, dynamic>? _reward;
  VGChallengePlan? _plan;
  bool _loading = true;
  bool _deletingAccount = false;

  VGFeatureModel get _routineFeature => getVerifiedGlamFeatures()
      .firstWhere((f) => f.featureType == VGFeatureTypes.glowUpGuide);

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final badges = await VGChallengeService.fetchUserBadges();
      final reward = await VGChallengeService.latestRewardCard();
      final plan = await VGChallengeService.loadOrAssign();
      if (!mounted) return;
      setState(() {
        _badges = badges;
        _reward = reward;
        _plan = plan;
        _loading = false;
      });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _openRoutine() {
    if (kIsWeb && VGWebBreakpoints.isDesktop(context)) {
      vgWebOpenChallenge(context);
      return;
    }
    VGRoutineChallengeScreen(feature: _routineFeature)
        .launch(context)
        .then((_) => _load());
  }

  void _openReward() {
    final reward = _reward;
    if (reward == null) return;
    if (kIsWeb && VGWebBreakpoints.isDesktop(context)) {
      vgWebOpenReward(context, reward: reward, feature: _routineFeature);
      return;
    }
    VGChallengeRewardScreen(reward: reward, feature: _routineFeature)
        .launch(context)
        .then((_) => _load());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appStore.isDarkModeOn
          ? appStore.scaffoldBackground!
          : bmLightScaffoldBackgroundColor,
      appBar: VGMainAppBar(title: VGCopy.tabProfile, showSettings: true),
      body: RefreshIndicator(
        color: bmSpecialColor,
        onRefresh: _load,
        child: _loading
            ? ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(height: context.height() * 0.3),
                  const Center(
                      child: CircularProgressIndicator(color: bmSpecialColor)),
                ],
              )
            : ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                children: [
                  Text(VGCopy.profileDashboardSubtitle,
                      style: secondaryTextStyle(color: appTextColorSecondary)),
                  20.height,
                  _featuredCard(),
                  20.height,
                  _activeChallengeCard(),
                  24.height,
                  Text(VGCopy.challengeBadgesTitle,
                      style:
                          boldTextStyle(color: bmSpecialColorDark, size: 18)),
                  12.height,
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                          color: bmPrimaryColor.withValues(alpha: 0.25)),
                    ),
                    child: VGChallengeBadgeGrid(
                        earnedBadges: _badges,
                        loading: false,
                        collapsible: true),
                  ),
                  24.height,
                  Text(VGCopy.profileQuickActions,
                      style:
                          boldTextStyle(color: bmSpecialColorDark, size: 18)),
                  12.height,
                  _quickActionsGrid(),
                  24.height,
                  Text(VGCopy.profileAccountSection,
                      style:
                          boldTextStyle(color: bmSpecialColorDark, size: 18)),
                  12.height,
                  _accountSection(),
                ],
              ),
      ),
    );
  }

  Widget _featuredCard() {
    final reward = _reward;
    final topBadge = _badges.isNotEmpty ? _badges.first : null;

    if (reward == null && topBadge == null) {
      return _cardShell(
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: bmLightScaffoldBackgroundColor,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(Icons.emoji_events_outlined,
                  color: bmPrimaryColor, size: 28),
            ),
            14.width,
            Expanded(
              child: Text(
                VGCopy.profileNoAchievementYet,
                style: primaryTextStyle(
                    color: appTextColorSecondary, size: 13, height: 1.4),
              ),
            ),
          ],
        ),
      );
    }

    if (reward != null) {
      final title =
          reward['challenge_title']?.toString() ?? VGCopy.guideRoutineChallenge;
      final completedOn = reward['completed_on']?.toString() ?? '';
      return _cardShell(
        onTap: _openReward,
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                    colors: [const Color(0xFFF59E0B), bmSpecialColor]),
                borderRadius: BorderRadius.circular(14),
              ),
              child:
                  const Icon(Icons.emoji_events, color: Colors.white, size: 28),
            ),
            14.width,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(VGCopy.profileFeaturedAchievement,
                      style:
                          boldTextStyle(color: bmSpecialColorDark, size: 12)),
                  4.height,
                  Text(title,
                      style:
                          boldTextStyle(color: bmSpecialColorDark, size: 16)),
                  if (completedOn.isNotEmpty)
                    Text(VGCopy.profileBadgeEarnedOn(completedOn),
                        style: secondaryTextStyle(size: 11)),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: bmPrimaryColor),
          ],
        ),
      );
    }

    final code = topBadge!['badge_code']?.toString() ?? '';
    final def = VGChallengeBadges.byCode(code);
    final earnedAt = topBadge['earned_at']?.toString() ?? '';
    return _cardShell(
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: const Color(0xFFFEF3C7),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFF59E0B), width: 2),
            ),
            alignment: Alignment.center,
            child:
                Text(def?.emoji ?? '🏅', style: const TextStyle(fontSize: 24)),
          ),
          14.width,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(VGCopy.profileFeaturedAchievement,
                    style: boldTextStyle(color: bmSpecialColorDark, size: 12)),
                4.height,
                Text(def?.title ?? code,
                    style: boldTextStyle(color: bmSpecialColorDark, size: 16)),
                if (earnedAt.isNotEmpty)
                  Text(VGCopy.profileBadgeEarnedOn(earnedAt.split('T').first),
                      style: secondaryTextStyle(size: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _activeChallengeCard() {
    final plan = _plan;
    if (plan == null) {
      return _cardShell(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(VGCopy.profileActiveChallenge,
                style: boldTextStyle(color: bmSpecialColorDark, size: 15)),
            8.height,
            Text(VGCopy.guideNoActiveChallenge,
                style: secondaryTextStyle(size: 13, height: 1.4)),
            14.height,
            VGPillButton(
              label: VGCopy.guideStartChallenge,
              width: double.infinity,
              onTap: () => vgStartAnalysis(context, _routineFeature),
            ),
          ],
        ),
      );
    }

    final completed = plan.progress.completedDays;
    final total = plan.durationDays;
    final isDone = plan.progress.isCompleted;

    return _cardShell(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(VGCopy.profileActiveChallenge,
              style: boldTextStyle(color: bmSpecialColorDark, size: 15)),
          6.height,
          Text(plan.title,
              style: boldTextStyle(color: bmSpecialColor, size: 17)),
          8.height,
          Text(
            isDone
                ? VGCopy.guideCompleted
                : VGCopy.profileChallengeProgress(completed, total),
            style: secondaryTextStyle(size: 13),
          ),
          14.height,
          VGPillButton(
            label: isDone
                ? VGCopy.profileViewRoutine
                : VGCopy.profileContinueChallenge,
            width: double.infinity,
            onTap: _openRoutine,
          ),
        ],
      ),
    );
  }

  Widget _quickActionsGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 1.6,
      children: [
        _actionTile(Icons.explore_outlined, VGCopy.profileActionExplore,
            () => vgRequestDashboardTab(1)),
        _actionTile(Icons.history, VGCopy.profileActionHistory, () {
          VGScanHistoryScreen().launch(context);
        }),
        _actionTile(Icons.share_outlined, VGCopy.profileActionShare, () {
          Share.share('${VGCopy.splashTagline} — $vgAppName');
        }),
        _actionTile(Icons.workspace_premium_outlined, VGCopy.profileActionPro,
            () {
          vgShowPaywall(context, entry: VGPaywallEntry.profile);
        }),
      ],
    );
  }

  Widget _actionTile(IconData icon, String label, VoidCallback onTap) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.25)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: bmSpecialColor, size: 26),
              8.height,
              Text(label,
                  style: boldTextStyle(color: bmSpecialColorDark, size: 12)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _accountSection() {
    return FutureBuilder<VGCreditSnapshot?>(
      // Fresh server fetch, not the cached local flag — a stale cache would
      // show "Free" for a user whose subscription changed server-side
      // (e.g. right after a webhook grant) until something else happened to
      // refresh it.
      future: VGCreditsService.fetchSnapshot(),
      builder: (context, snapshot) {
        final data = snapshot.data;
        final isPro = data?.isPro == true;
        final statusLabel = isPro
            ? VGCopy.profileAccountStatusPro
            : VGCopy.profileAccountStatusFree;
        final subtitle = isPro
            ? '${data!.planDisplayName} · ${VGCopy.profileCreditsRemaining(data.balance)}'
            : VGCopy.profileAccountStatusFreeHint;
        return Column(
          children: [
            _accountTile(
              isPro ? Icons.workspace_premium : Icons.person_outline,
              statusLabel,
              subtitle: subtitle,
              onTap: isPro ? null : () => vgShowPaywall(context, entry: VGPaywallEntry.profile),
            ),
            if (isPro)
              _accountTile(
                Icons.language_outlined,
                VGCopy.profileManageOnWebsite,
                onTap: null,
              ),
            _accountTile(
              Icons.privacy_tip_outlined,
              VGCopy.settingsPrivacy,
              onTap: () => launchUrl(Uri.parse('$vgMarketingSiteUrl/privacy'),
                  mode: LaunchMode.externalApplication),
            ),
            _accountTile(
              Icons.mail_outline,
              VGCopy.settingsSupport,
              subtitle: vgSupportEmail,
              onTap: () => launchUrl(Uri.parse('mailto:$vgSupportEmail')),
            ),
            _accountTile(Icons.logout, VGCopy.profileLogOut,
                onTap: _confirmLogOut),
            _accountTile(
              Icons.delete_forever_outlined,
              VGCopy.profileDeleteAccount,
              subtitle: _deletingAccount
                  ? 'Deleting…'
                  : VGCopy.profileDeleteAccountHint,
              color: Colors.red.shade700,
              onTap: _deletingAccount ? null : _confirmDeleteAccount,
            ),
          ],
        );
      },
    );
  }

  Future<void> _confirmLogOut() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(VGCopy.profileLogOutConfirmTitle),
        content: Text(VGCopy.profileLogOutConfirmMessage),
        actions: [
          TextButton(
              onPressed: () => Navigator.of(ctx).pop(false),
              child: Text(VGCopy.scanErrorCancel)),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(VGCopy.profileLogOut,
                style: const TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirmed != true) return;

    await VGAuthService.signOut();
    if (!mounted) return;
    BMLoginScreen().launch(context, isNewTask: true);
  }

  Future<void> _confirmDeleteAccount() async {
    final confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => const _DeleteAccountDialog(),
    );
    if (confirmed != true || !mounted) return;

    setState(() => _deletingAccount = true);
    try {
      await VGAuthService.deleteAccount();
      VGCreditsService.clearCache();
      if (!mounted) return;
      BMLoginScreen().launch(context, isNewTask: true);
    } catch (error) {
      debugPrint('Account deletion failed: $error');
      if (!mounted) return;
      setState(() => _deletingAccount = false);
      toast(VGCopy.profileDeleteFailed);
    }
  }

  Widget _accountTile(
    IconData icon,
    String title, {
    String? subtitle,
    Widget? trailing,
    VoidCallback? onTap,
    Color? color,
  }) {
    // Material wraps the ListTile so its ink splash actually renders —
    // a bare Container+ListTile (the previous shape) hides the ripple
    // behind the Container's own background paint (Flutter framework
    // assertion: "ListTile background color or ink splashes may be
    // invisible").
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.2)),
      ),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        child: ListTile(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          leading: Icon(icon, color: color ?? bmSpecialColor),
          title: Text(title,
              style:
                  boldTextStyle(color: color ?? appTextColorPrimary, size: 15)),
          subtitle: subtitle != null
              ? Text(subtitle, style: secondaryTextStyle(size: 12))
              : null,
          trailing: trailing ??
              (onTap != null
                  ? Icon(Icons.chevron_right, color: color ?? bmPrimaryColor)
                  : null),
          onTap: onTap,
        ),
      ),
    );
  }

  Widget _cardShell({required Widget child, VoidCallback? onTap}) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.3)),
          ),
          child: child,
        ),
      ),
    );
  }
}

/// Owns its TextEditingController's lifecycle via State.dispose(), which
/// only runs once the widget is truly gone — unlike disposing a
/// showDialog-local controller right after the Future resolves, which races
/// the dialog's still-animating exit transition and crashes with "used
/// after being disposed".
class _DeleteAccountDialog extends StatefulWidget {
  const _DeleteAccountDialog();

  @override
  State<_DeleteAccountDialog> createState() => _DeleteAccountDialogState();
}

class _DeleteAccountDialogState extends State<_DeleteAccountDialog> {
  final _controller = TextEditingController();
  bool _confirmationMatches = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(VGCopy.profileDeleteConfirmTitle),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(VGCopy.profileDeleteConfirmMessage),
          16.height,
          TextField(
            controller: _controller,
            autofocus: true,
            textCapitalization: TextCapitalization.characters,
            decoration: InputDecoration(
              labelText: VGCopy.profileDeleteConfirmationLabel,
              border: const OutlineInputBorder(),
            ),
            onChanged: (value) {
              setState(() => _confirmationMatches = value.trim() == 'DELETE');
            },
          ),
        ],
      ),
      actions: [
        TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text(VGCopy.scanErrorCancel)),
        TextButton(
          onPressed: _confirmationMatches ? () => Navigator.of(context).pop(true) : null,
          child: Text(VGCopy.profileDeleteAccount, style: const TextStyle(color: Colors.red)),
        ),
      ],
    );
  }
}
