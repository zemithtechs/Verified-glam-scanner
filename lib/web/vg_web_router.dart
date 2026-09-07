import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../screens/onboarding/vg_onboarding_flow.dart';
import '../services/supabase/vg_supabase_auth_service.dart';
import '../services/supabase/vg_supabase_config.dart';
import '../services/supabase/vg_supabase_init.dart';
import '../utils/vg_constants.dart';
import 'screens/vg_web_app_screen.dart';
import 'screens/vg_web_forgot_password_screen.dart';
import 'vg_feature_slugs.dart';
import 'vg_web_app_prefs.dart';
import 'vg_web_page_nav_stub.dart'
    if (dart.library.html) 'package:verified_glam/web/vg_web_page_nav_web.dart' as page_nav;
import 'widgets/vg_web_tool_sidebar.dart';

String vgWebEntryLocation() {
  final path = Uri.base.path;
  if (path.isEmpty) return '/';
  return path;
}

/// Maps legacy /marketing/* paths to clean static URLs (one-time hard redirect).
String? _legacyMarketingRedirect(String path) {
  if (path == '/marketing' || path == '/marketing/' || path == '/marketing/index.html') {
    return '/';
  }
  const map = {
    '/marketing/about.html': '/about',
    '/marketing/privacy.html': '/privacy',
    '/marketing/terms.html': '/terms',
  };
  return map[path];
}

const _staticMarketingExact = {
  '/login',
  '/register',
  '/pricing',
  '/tools',
  '/about',
  '/privacy',
  '/terms',
};

bool _uriHasAuthCallbackParams(Uri uri) {
  if (uri.queryParameters.containsKey('code')) return true;
  final fragment = uri.fragment;
  if (fragment.isEmpty) return false;
  return fragment.contains('access_token') ||
      fragment.contains('error_description') ||
      fragment.contains('error=');
}

void _redirectToStaticMarketing(String pathAndQuery) {
  page_nav.vgWebHardRedirect(pathAndQuery);
}

final GoRouter vgWebRouter = GoRouter(
  navigatorKey: navigatorKey,
  initialLocation: vgWebEntryLocation(),
  overridePlatformDefaultLocation: true,
  redirect: (context, state) {
    final uri = state.uri;
    final path = uri.path;

    if (path == '/walkthrough' || path == '/splash') {
      _redirectToStaticMarketing('/');
      return path;
    }

    if (path.startsWith('/marketing')) {
      final legacy = _legacyMarketingRedirect(path);
      _redirectToStaticMarketing(legacy ?? '/');
      return path;
    }

    // Static Tier 1 pages — served as HTML, not Flutter routes.
    if (_staticMarketingExact.contains(path)) {
      _redirectToStaticMarketing(uri.path + (uri.hasQuery ? '?${uri.query}' : ''));
      return path;
    }

    final slug = path.startsWith('/') ? path.substring(1) : path;
    if (slug.isNotEmpty && isToolSlug(slug)) {
      _redirectToStaticMarketing(uri.path + (uri.hasQuery ? '?${uri.query}' : ''));
      return path;
    }

    final signedIn = kVGUseSupabase &&
        VGSupabaseConfig.isConfigured &&
        VGSupabaseInit.isReady &&
        VGSupabaseAuthService.isSignedIn;
    debugPrint('VG router redirect: path=$path signedIn=$signedIn '
        'useSupabase=$kVGUseSupabase configured=${VGSupabaseConfig.isConfigured} '
        'ready=${VGSupabaseInit.isReady} authSignedIn=${VGSupabaseAuthService.isSignedIn}');

    if (path == '/' || path.isEmpty) {
      if (_uriHasAuthCallbackParams(uri) || signedIn) {
        return vgWebDefaultAppPath();
      }
      _redirectToStaticMarketing('/login');
      return path;
    }

    if (!signedIn && path.startsWith('/app')) {
      // Blocking (not just console) so this is guaranteed visible — and
      // screenshottable — before vgWebGoLogin's navigation unloads the
      // page. Temporary until the web login redirect-loop bug is confirmed
      // fixed.
      page_nav.vgWebDebugAlert('VG DEBUG: bounced from $path — signedIn=false\n'
          'configured=${VGSupabaseConfig.isConfigured}\nready=${VGSupabaseInit.isReady}\n'
          'apiSignedIn=${VGSupabaseAuthService.isSignedIn}');
      page_nav.vgWebGoLogin(redirectPath: path);
      return path;
    }

    if (signedIn && path == '/forgot-password') {
      return vgWebDefaultAppPath();
    }

    if (path == '/dashboard') {
      return vgWebDefaultAppPath();
    }

    if (path == '/app/scans' || path.startsWith('/app/scans/')) {
      return vgWebDefaultAppPath();
    }

    // Deep app paths not yet in GoRouter (e.g. /app/foo/guidelines).
    if (path.startsWith('/app/') && path.split('/').length > 3) {
      final segments = path.split('/');
      if (segments.length >= 3 && isToolSlug(segments[2])) {
        return '/app/${segments[2]}';
      }
    }

    return null;
  },
  routes: [
    GoRoute(
      path: '/dashboard',
      redirect: (_, __) => vgWebDefaultAppPath(),
    ),
    GoRoute(path: '/onboarding', builder: (_, __) => const VGOnboardingFlow()),
    GoRoute(path: '/forgot-password', builder: (_, __) => const VGWebForgotPasswordScreen()),
    GoRoute(
      path: '/app/profile/challenge/day/:day',
      builder: (_, state) {
        final day = int.tryParse(state.pathParameters['day'] ?? '1') ?? 1;
        return VGWebAppScreen(
          section: VGWebAppSection.profile,
          profileSubview: VGWebProfileSubview.challengeDay,
          challengeDay: day,
        );
      },
    ),
    GoRoute(
      path: '/app/profile/challenge',
      builder: (_, __) => const VGWebAppScreen(
        section: VGWebAppSection.profile,
        profileSubview: VGWebProfileSubview.challenge,
      ),
    ),
    GoRoute(
      path: '/app/profile/reward',
      builder: (_, __) => const VGWebAppScreen(
        section: VGWebAppSection.profile,
        profileSubview: VGWebProfileSubview.reward,
      ),
    ),
    GoRoute(
      path: '/app/profile',
      builder: (_, __) => const VGWebAppScreen(section: VGWebAppSection.profile),
    ),
    GoRoute(
      path: '/app/:slug',
      builder: (_, state) {
        final slug = state.pathParameters['slug'] ?? vgDefaultWebToolSlug;
        return VGWebAppScreen(slug: slug, section: VGWebAppSection.tool);
      },
    ),
  ],
  errorBuilder: (_, state) {
    final path = state.uri.path;
    if (_staticMarketingExact.contains(path) || isToolSlug(path.replaceFirst('/', ''))) {
      _redirectToStaticMarketing(state.uri.path + (state.uri.hasQuery ? '?${state.uri.query}' : ''));
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (path == '/' || path.isEmpty) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      body: Center(child: Text('Page not found: ${state.uri}')),
    );
  },
);
