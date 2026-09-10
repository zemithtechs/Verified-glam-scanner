import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../screens/BMDashboardScreen.dart';
import '../screens/BMLoginScreen.dart';
import '../screens/onboarding/vg_onboarding_flow.dart';
import '../services/backend/vg_auth_service.dart';
import '../services/backend/vg_backend_config.dart';
import '../services/backend/vg_backend_init.dart';
import '../services/backend/vg_profile_repository.dart';
import '../services/vg_onboarding_store.dart';
import '../services/vg_push_service.dart';
import '../web/vg_web_app_prefs.dart';
import '../web/vg_web_auth_helpers.dart';
import 'vg_constants.dart';
import 'vg_navigation.dart';

/// Post-auth routing: onboarding vs home (optional deep-link return path on web).
Future<void> vgNavigateAfterAuth(BuildContext context, {String? redirect}) async {
  if (!context.mounted) return;

  if (vgIsSafeRedirectPath(redirect)) {
    await vgSavePostAuthRedirect(redirect);
  }

  final onboardingDone = await VGOnboardingStore.isComplete();
  if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
    final remoteDone = await VGProfileRepository.isOnboardingCompleteRemote();
    if (remoteDone) {
      if (kIsWeb) {
        final target = await vgTakePostAuthRedirect();
        context.go(target ?? vgWebDefaultAppPath());
      } else {
        BMDashboardScreen(flag: false).launch(context, isNewTask: true);
      }
      WidgetsBinding.instance.addPostFrameCallback((_) {
        VGPushService.consumePendingDeepLinkIfReady();
      });
      return;
    }
  }

  if (!onboardingDone) {
    if (kIsWeb) {
      context.go('/onboarding');
    } else {
      VGOnboardingFlow().launch(context, isNewTask: true);
    }
  } else {
    if (kIsWeb) {
      final target = await vgTakePostAuthRedirect();
      context.go(target ?? vgWebDefaultAppPath());
    } else {
      BMDashboardScreen(flag: false).launch(context, isNewTask: true);
    }
    WidgetsBinding.instance.addPostFrameCallback((_) {
      VGPushService.consumePendingDeepLinkIfReady();
    });
  }
}

/// Walkthrough complete → login (if cloud backend configured) → onboarding or home.
Future<void> vgNavigateAfterWalkthroughWithAuth(BuildContext context) async {
  if (kIsWeb) {
    await setValue(vgWalkthroughCompleteKey, true);
    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      if (!VGAuthService.isSignedIn) {
        context.go('/login');
        return;
      }
      await vgNavigateAfterAuth(context);
      return;
    }
    await vgNavigateAfterWalkthrough(context);
    return;
  }

  if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
    if (!VGAuthService.isSignedIn) {
      if (kIsWeb) {
        context.go('/login');
      } else {
        BMLoginScreen().launch(context, isNewTask: true);
      }
      return;
    }
    await vgNavigateAfterAuth(context);
    return;
  }
  await vgNavigateAfterWalkthrough(context);
}
