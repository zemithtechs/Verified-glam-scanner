import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:nb_utils/nb_utils.dart';
import 'package:verified_glam/screens/BMSplashScreen.dart';
import 'package:verified_glam/services/ads/vg_ads_manager.dart';
import 'package:verified_glam/services/backend/vg_auth_service.dart';
import 'package:verified_glam/services/backend/vg_backend_init.dart';
import 'package:verified_glam/services/vg_push_service.dart';
import 'package:verified_glam/services/vg_scan_history_store.dart';
import 'package:verified_glam/store/AppStore.dart';
import 'package:verified_glam/utils/AppTheme.dart';
import 'package:verified_glam/utils/BMConstants.dart';
import 'package:verified_glam/utils/BMDataGenerator.dart';
import 'package:verified_glam/utils/vg_constants.dart';
import 'package:verified_glam/web/vg_web_router.dart';

AppStore appStore = AppStore();

int currentIndex = 0;

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  if (kIsWeb) {
    usePathUrlStrategy();
  }
  runApp(const VGBootApp());
}

/// Boots plugins then hands off to [MyApp]. Surfaces init errors instead of a blank page.
class VGBootApp extends StatefulWidget {
  const VGBootApp({super.key});

  @override
  State<VGBootApp> createState() => _VGBootAppState();
}

class _VGBootAppState extends State<VGBootApp> {
  String? _error;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    _start();
  }

  Future<void> _start() async {
    const timeout = Duration(seconds: 45);
    try {
      await initialize(aLocaleLanguageList: languageList()).timeout(timeout);
      await VGBackendInit.initialize().timeout(timeout);
      if (!kIsWeb) {
        try {
          await Firebase.initializeApp();
          await VGPushService.initialize();
          VGAuthService.onAuthStateChange.listen((_) {
            VGPushService.syncTokenIfSignedIn();
          });
        } catch (e) {
          debugPrint('Firebase init skipped: $e');
        }
        try {
          await VGAdsManager.instance.initialize();
        } catch (e) {
          debugPrint('AdMob init skipped: $e');
        }
      }

      if (kIsWeb) {
        // Mobile walkthrough ("Pretty Up Now" slides) is not shown on web.
        await setValue(vgWalkthroughCompleteKey, true);
      }

      await VGScanHistoryStore.clearLegacyLocalHistoryOnce();

      appStore.toggleDarkMode(value: getBoolAsync(isDarkModeOnPref));
      defaultRadius = 10;
      defaultToastGravityGlobal = ToastGravity.BOTTOM;

      if (!mounted) return;
      setState(() => _ready = true);
    } catch (e, st) {
      debugPrint('VGBootApp failed: $e\n$st');
      if (!mounted) return;
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      if (_error != null) {
        return MaterialApp(home: _BootErrorScreen(message: _error!));
      }
      if (!_ready) {
        return const MaterialApp(home: _BootLoadingScreen());
      }
      return Observer(
        builder: (_) {
          final theme = !appStore.isDarkModeOn ? AppThemeData.lightTheme : AppThemeData.darkTheme;
          return MaterialApp.router(
            debugShowCheckedModeBanner: false,
            title: vgAppName,
            theme: theme,
            routerConfig: vgWebRouter,
            scrollBehavior: SBehavior(),
            supportedLocales: LanguageDataModel.languageLocales(),
            localeResolutionCallback: (locale, supportedLocales) => locale,
          );
        },
      );
    }

    if (_error != null) {
      return MaterialApp(
        home: _BootErrorScreen(message: _error!),
      );
    }

    if (!_ready) {
      return const MaterialApp(
        home: _BootLoadingScreen(),
      );
    }

    return const MyApp();
  }
}

class _BootLoadingScreen extends StatelessWidget {
  const _BootLoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFFF6E3E3),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(color: Color(0xFF872B3F)),
            SizedBox(height: 16),
            Text('Starting Verified Glam…', style: TextStyle(color: Color(0xFF872B3F))),
          ],
        ),
      ),
    );
  }
}

class _BootErrorScreen extends StatelessWidget {
  final String message;

  const _BootErrorScreen({required this.message});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6E3E3),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Verified Glam could not start',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF872B3F)),
              ),
              const SizedBox(height: 12),
              Text(message, style: const TextStyle(fontSize: 14)),
              const SizedBox(height: 16),
              const Text(
                'Try: hard refresh (Ctrl+Shift+R), clear site data for localhost, then run .\\scripts\\serve-web.ps1 again.',
                style: TextStyle(fontSize: 13, color: Color(0xFF6B4A52)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        final theme = !appStore.isDarkModeOn ? AppThemeData.lightTheme : AppThemeData.darkTheme;
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: '$appName${!isMobile ? ' ${platformName()}' : ''}',
          home: BMSplashScreen(),
          theme: theme,
          navigatorKey: navigatorKey,
          scrollBehavior: SBehavior(),
          supportedLocales: LanguageDataModel.languageLocales(),
          localeResolutionCallback: (locale, supportedLocales) => locale,
        );
      },
    );
  }
}
