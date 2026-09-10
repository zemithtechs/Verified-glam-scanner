import 'dart:html' as html;

import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:nb_utils/nb_utils.dart';
import 'package:verified_glam/services/backend/vg_api_client.dart';
import 'package:verified_glam/services/backend/vg_backend_init.dart';
import 'package:verified_glam/services/vg_scan_history_store.dart';
import 'package:verified_glam/store/AppStore.dart';
import 'package:verified_glam/utils/AppTheme.dart';
import 'package:verified_glam/utils/BMConstants.dart';
import 'package:verified_glam/utils/BMDataGenerator.dart';
import 'package:verified_glam/utils/vg_constants.dart';
import 'package:verified_glam/web/vg_web_router.dart';

AppStore appStore = AppStore();

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  usePathUrlStrategy();
  runApp(const VGWebBootApp());
}

/// Web-only boot — app routes (/app/*) only; marketing is static HTML.
class VGWebBootApp extends StatefulWidget {
  const VGWebBootApp({super.key});

  @override
  State<VGWebBootApp> createState() => _VGWebBootAppState();
}

class _VGWebBootAppState extends State<VGWebBootApp> {
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
      await _consumeHandoffSession();
      await setValue(vgWalkthroughCompleteKey, true);
      await VGScanHistoryStore.clearLegacyLocalHistoryOnce();
      appStore.toggleDarkMode(value: getBoolAsync(isDarkModeOnPref));
      defaultRadius = 10;
      defaultToastGravityGlobal = ToastGravity.BOTTOM;
      if (!mounted) return;
      setState(() => _ready = true);
    } catch (e, st) {
      debugPrint('VGWebBootApp failed: $e\n$st');
      if (!mounted) return;
      setState(() => _error = e.toString());
    }
  }

  /// Picks up a session minted by the static site's login/register page
  /// (website/js/auth.js) and handed off via URL query params — that page
  /// and this Flutter bundle are separate apps with no shared storage, so
  /// this is how logging in there becomes a real session here. Strips the
  /// params from the address bar afterward so the token doesn't linger
  /// visibly or get bookmarked/shared.
  Future<void> _consumeHandoffSession() async {
    final uri = Uri.base;
    final token = uri.queryParameters['vg_token'];
    final userId = uri.queryParameters['vg_uid'];
    debugPrint('VG handoff: uri=$uri token=${token != null} userId=$userId');
    if (token == null || token.isEmpty || userId == null || userId.isEmpty) {
      // On-screen (not just console) so this is visible from a phone
      // screenshot without opening DevTools — temporary until the web
      // login redirect-loop bug is confirmed fixed. Only fires for a
      // /app/* entry with no handoff params, i.e. exactly the bounce case.
      if (uri.path.startsWith('/app/')) {
        html.window.alert('VG DEBUG: no handoff token in URL\npath=${uri.path}\nfull=$uri');
      }
      return;
    }

    await VGApiClient.setSession(
      token: token,
      userId: userId,
      userEmail: uri.queryParameters['vg_email'],
    );
    debugPrint('VG handoff: session set, isSignedIn=${VGApiClient.isSignedIn}');

    final cleanParams = Map<String, String>.from(uri.queryParameters)
      ..remove('vg_token')
      ..remove('vg_uid')
      ..remove('vg_email');
    final cleanUri = uri.replace(queryParameters: cleanParams.isEmpty ? null : cleanParams);
    html.window.history.replaceState(null, '', cleanUri.toString());
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return MaterialApp(
        home: Scaffold(
          body: Center(child: Text('Could not start app: $_error')),
        ),
      );
    }
    if (!_ready) {
      return const MaterialApp(
        home: Scaffold(
          backgroundColor: Color(0xFFF6E3E3),
          body: Center(
            child: CircularProgressIndicator(color: Color(0xFF872B3F)),
          ),
        ),
      );
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
}
