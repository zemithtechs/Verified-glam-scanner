import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../main.dart';
import '../services/backend/vg_auth_service.dart';
import '../services/backend/vg_backend_config.dart';
import '../services/backend/vg_backend_init.dart';
import '../services/backend/vg_profile_repository.dart';
import '../services/vg_onboarding_store.dart';
import '../utils/BMColors.dart';
import '../utils/vg_auth_navigation.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_navigation.dart';
import '../utils/vg_copy.dart';
import 'BMDashboardScreen.dart';
import 'BMWalkThroughScreen.dart';

class BMSplashScreen extends StatefulWidget {
  const BMSplashScreen({Key? key}) : super(key: key);

  @override
  _BMSplashScreenState createState() => _BMSplashScreenState();
}

class _BMSplashScreenState extends State<BMSplashScreen> {
  @override
  void initState() {
    super.initState();
    init();
  }

  Future<void> init() async {
    if (!kIsWeb) {
      setStatusBarColor(appStore.isDarkModeOn ? appStore.scaffoldBackground! : bmLightScaffoldBackgroundColor);
    }
    await 3.seconds.delay;
    if (!mounted) return;
    finish(context);

    final walkthroughDone = getBoolAsync(vgWalkthroughCompleteKey, defaultValue: false);

    if (kVGUseCloudBackend && VGBackendConfig.isConfigured && VGBackendInit.isReady) {
      if (VGAuthService.isSignedIn) {
        final localDone = await VGOnboardingStore.isComplete();
        final remoteDone = localDone && await VGProfileRepository.isOnboardingCompleteRemote();
        if (remoteDone || localDone) {
          BMDashboardScreen(flag: false).launch(context, isNewTask: true);
          return;
        }
      }
      if (walkthroughDone) {
        await vgNavigateAfterWalkthroughWithAuth(context);
        return;
      }
    } else if (walkthroughDone) {
      await vgNavigateAfterWalkthrough(context);
      return;
    }

    BMWalkThroughScreen().launch(context, isNewTask: true);
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appStore.isDarkModeOn ? appStore.scaffoldBackground! : bmLightScaffoldBackgroundColor,
      body: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset('images/verified_glam_logo.png', height: 200),
          Text(vgAppName, style: boldTextStyle(size: 20, color: appStore.isDarkModeOn ? Colors.white : bmSpecialColorDark)),
          8.height,
          Text(VGCopy.splashTagline, style: secondaryTextStyle(color: appStore.isDarkModeOn ? Colors.white70 : bmGreyColor)),
        ],
      ).center(),
    );
  }
}
