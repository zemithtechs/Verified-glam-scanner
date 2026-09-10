import 'package:verified_glam/fragments/vg_explore_fragment.dart';
import 'package:verified_glam/fragments/vg_profile_fragment.dart';
import 'package:verified_glam/utils/vg_dashboard_nav.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../components/vg/vg_ad_banner.dart';
import '../fragments/BMHomeFragment.dart';
import '../main.dart';
import '../utils/BMColors.dart';
import '../services/vg_push_service.dart';
import '../utils/vg_copy.dart';
import '../utils/vg_navigation.dart';
import '../web/vg_web_app_prefs.dart';
import '../web/vg_web_breakpoints.dart';

class BMDashboardScreen extends StatefulWidget {
  final bool flag;

  BMDashboardScreen({required this.flag});

  @override
  _BMDashboardScreenState createState() => _BMDashboardScreenState();
}

class _BMDashboardScreenState extends State<BMDashboardScreen> {
  int selectedTab = 0;

  Widget getFragment() {
    switch (selectedTab) {
      case 0:
        return const BMHomeFragment();
      case 1:
        return const VGExploreFragment();
      case 2:
        return const VGProfileFragment();
      default:
        return const BMHomeFragment();
    }
  }

  @override
  void initState() {
    if (!kIsWeb) {
      setStatusBarColor(appStore.isDarkModeOn ? appStore.scaffoldBackground! : bmLightScaffoldBackgroundColor);
    }
    super.initState();
    vgDashboardTabRequest.addListener(_onTabRequest);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      VGPushService.consumePendingDeepLinkIfReady();
      if (!kIsWeb && mounted) vgMaybeShowFreeReminder(context);
    });
  }

  void _onTabRequest() {
    final index = vgDashboardTabRequest.value;
    if (index == null || !mounted) return;
    setState(() => selectedTab = index);
    vgDashboardTabRequest.value = null;
  }

  @override
  void dispose() {
    vgDashboardTabRequest.removeListener(_onTabRequest);
    if (!kIsWeb) {
      if (widget.flag) {
        setStatusBarColor(appStore.isDarkModeOn ? appStore.scaffoldBackground! : bmLightScaffoldBackgroundColor);
      } else {
        setStatusBarColor(Colors.transparent);
      }
    }
    super.dispose();
  }

  Color getDashboardColor() {
    if (!appStore.isDarkModeOn) {
      return selectedTab == 0 ? bmLightScaffoldBackgroundColor : bmSecondBackgroundColorLight;
    }
    return selectedTab == 0 ? appStore.scaffoldBackground! : bmSecondBackgroundColorDark;
  }

  @override
  Widget build(BuildContext context) {
    if (kIsWeb && VGWebBreakpoints.isDesktop(context)) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) context.go(vgWebDefaultAppPath());
      });
      return const Scaffold(
        backgroundColor: bmLightScaffoldBackgroundColor,
        body: Center(child: CircularProgressIndicator(color: bmSpecialColor)),
      );
    }

    final body = getFragment();
    return Scaffold(
      backgroundColor: getDashboardColor(),
      body: body,
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          BottomNavigationBar(
            onTap: (int index) => setState(() => selectedTab = index),
            type: BottomNavigationBarType.fixed,
            backgroundColor: context.cardColor,
            selectedItemColor: bmSpecialColor,
            unselectedItemColor: bmPrimaryColor,
            currentIndex: selectedTab,
            items: const [
              BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: VGCopy.tabHome),
              BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), activeIcon: Icon(Icons.explore), label: VGCopy.tabExplore),
              BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: VGCopy.tabProfile),
            ],
          ).cornerRadiusWithClipRRectOnly(topLeft: 32, topRight: 32),
          // Persistent across Home/Explore/Profile — a `const` widget here
          // keeps the same VGBannerAdContainer State (and loaded ad) alive
          // across tab switches instead of reloading on every rebuild.
          SafeArea(top: false, child: const VGAdBanner()),
        ],
      ),
    );
  }
}
