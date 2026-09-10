import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../models/vg_challenge_plan.dart';
import '../models/vg_feature_model.dart';
import '../screens/guide/vg_challenge_day_task_screen.dart';
import '../screens/guide/vg_challenge_reward_screen.dart';
import '../screens/guide/vg_routine_challenge_screen.dart';
import '../services/backend/vg_backend_config.dart';
import '../services/backend/vg_backend_init.dart';
import '../services/backend/vg_profile_repository.dart';
import '../services/vg_onboarding_store.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_feature_data.dart';
import 'vg_analytics_service.dart';
import 'vg_challenge_service.dart';
import 'backend/vg_auth_service.dart';
import 'backend/vg_push_token_repository.dart';

@pragma('vm:entry-point')
Future<void> vgFirebaseBackgroundHandler(RemoteMessage message) async {
  try {
    await Firebase.initializeApp();
  } catch (_) {}
}

class VGPushService {
  VGPushService._();

  static final _tokens = VGPushTokenRepository();
  static bool _initialized = false;
  static String? _pendingDeepLink;
  static String _pendingKind = '';

  static Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;

    FirebaseMessaging.onBackgroundMessage(vgFirebaseBackgroundHandler);
    final messaging = FirebaseMessaging.instance;

    if (Platform.isAndroid) {
      await messaging.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );
    }

    await messaging.requestPermission(alert: true, badge: true, sound: true, provisional: false);
    await _syncToken();
    FirebaseMessaging.instance.onTokenRefresh.listen((_) => _syncToken());

    FirebaseMessaging.onMessageOpenedApp.listen(_openFromMessage);
    FirebaseMessaging.onMessage.listen((message) {
      debugPrint('VGPushService foreground: ${message.notification?.title}');
      final ctx = navigatorKey.currentContext;
      if (ctx == null || message.notification?.title == null) return;
      final deepLink = message.data['deepLink']?.toString() ?? '';
      final kind = message.data['kind']?.toString() ?? '';
      ScaffoldMessenger.of(ctx).showSnackBar(
        SnackBar(
          content: Text(message.notification!.title!),
          duration: const Duration(seconds: 5),
          action: SnackBarAction(
            label: 'Open',
            onPressed: () => openDeepLink(deepLink, kind: kind),
          ),
        ),
      );
    });
    final initial = await messaging.getInitialMessage();
    if (initial != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _openFromMessage(initial));
    }
  }

  static Future<void> requestPermissionAndSync() async {
    await FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );
    await _syncToken();
  }

  static Future<void> deactivateCurrentToken() async {
    try {
      final token = await FirebaseMessaging.instance.getToken();
      if (token != null) {
        await _tokens.deactivateToken(token);
      }
    } catch (e) {
      debugPrint('VGPushService.deactivateCurrentToken failed: $e');
    }
  }

  static Future<void> _syncToken() async {
    try {
      if (!VGAuthService.isSignedIn) return;
      final token = await FirebaseMessaging.instance.getToken();
      if (token != null) {
        await _tokens.upsertToken(
          token: token,
          platform: Platform.isAndroid ? 'android' : 'ios',
        );
        debugPrint('VGPushService: FCM token synced (${token.substring(0, 12)}...)');
      }
    } catch (e) {
      debugPrint('VGPushService._syncToken failed: $e');
    }
  }

  static void _openFromMessage(RemoteMessage message) {
    final data = message.data;
    final deepLink = data['deepLink']?.toString() ?? '';
    final kind = data['kind']?.toString() ?? '';
    VGAnalyticsService.logPushOpened(kind, deepLink: deepLink);
    openDeepLink(deepLink, kind: kind);
  }

  static void setPendingDeepLink(String deepLink, {String kind = ''}) {
    if (deepLink.isEmpty && kind != 'completion') return;
    _pendingDeepLink = deepLink.isEmpty ? '/challenge/reward' : deepLink;
    _pendingKind = kind;
  }

  static Future<bool> isReadyForDeepLink() async {
    if (!VGAuthService.isSignedIn) return false;
    final localDone = await VGOnboardingStore.isComplete();
    if (!localDone) return false;
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      final remoteDone = await VGProfileRepository.isOnboardingCompleteRemote();
      if (!remoteDone) return false;
    }
    return true;
  }

  static Future<void> openDeepLink(String deepLink, {String kind = ''}) async {
    if (deepLink.isEmpty && kind != 'completion') return;
    if (!await isReadyForDeepLink()) {
      setPendingDeepLink(deepLink, kind: kind);
      return;
    }
    await _executeDeepLink(deepLink, kind: kind);
  }

  static Future<void> consumePendingDeepLinkIfReady() async {
    if (_pendingDeepLink == null && _pendingKind != 'completion') return;
    if (!await isReadyForDeepLink()) return;
    final link = _pendingDeepLink ?? '/challenge/reward';
    final kind = _pendingKind;
    _pendingDeepLink = null;
    _pendingKind = '';
    await _executeDeepLink(link, kind: kind);
  }

  static Future<void> _executeDeepLink(String deepLink, {String kind = ''}) async {
    final ctx = navigatorKey.currentContext;
    if (ctx == null) {
      setPendingDeepLink(deepLink, kind: kind);
      return;
    }

    final feature = getVerifiedGlamFeatures().firstWhere(
      (f) => f.featureType == VGFeatureTypes.glowUpGuide,
    );

    if (deepLink == '/challenge/reward' || kind == 'completion') {
      final reward = await VGChallengeService.latestRewardCard();
      if (!ctx.mounted) return;
      if (reward != null) {
        await VGChallengeRewardScreen(reward: reward, feature: feature).launch(ctx);
      } else {
        await VGRoutineChallengeScreen(feature: feature).launch(ctx);
      }
      return;
    }

    if (deepLink.startsWith('/challenge/day')) {
      final day = int.tryParse(deepLink.replaceAll('/challenge/day', '')) ?? 1;
      await _openChallengeDay(ctx, feature, day);
    }
  }

  static Future<void> _openChallengeDay(
    BuildContext ctx,
    VGFeatureModel feature,
    int day,
  ) async {
    final plan = await VGChallengeService.loadOrAssign();
    if (!ctx.mounted) return;
    if (plan == null) {
      await VGRoutineChallengeScreen(feature: feature, initialDay: day).launch(ctx);
      return;
    }

    if (_canOpenDayTask(plan, day)) {
      await VGChallengeDayTaskScreen(
        feature: feature,
        plan: plan,
        dayNumber: day,
      ).launch(ctx);
      return;
    }

    await VGRoutineChallengeScreen(feature: feature, initialDay: day).launch(ctx);
  }

  static bool _canOpenDayTask(VGChallengePlan plan, int day) {
    if (day <= plan.progress.completedDays) return true;
    if (day == plan.progress.currentDay && !VGChallengeService.isCurrentDayLocked(plan)) {
      return true;
    }
    return false;
  }

  static Future<void> syncTokenIfSignedIn() async {
    if (!VGAuthService.isSignedIn) return;
    await _syncToken();
  }
}
