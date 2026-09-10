import 'package:google_sign_in/google_sign_in.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../utils/vg_constants.dart';
import '../vg_profile_cache.dart';
import '../vg_push_service.dart';
import '../vg_session_scan_cache.dart';
import 'vg_api_client.dart';
import 'vg_supabase_config.dart';

/// Lightweight stand-in for supabase_flutter's User — call sites only ever
/// read .id and .email.
class VGApiUser {
  final String id;
  final String? email;

  const VGApiUser({required this.id, this.email});
}

/// Lightweight stand-in for supabase_flutter's AuthResponse — call sites
/// only check `.session != null` to know whether sign-up produced an
/// immediately-usable session (vs. requiring email confirmation first).
/// Better Auth doesn't require email verification here (no email-sending
/// configured yet — see docs/CLOUDFLARE_MIGRATION_PLAN.md), so session is
/// always present after a successful sign-up.
class VGApiAuthResponse {
  final VGApiUser? user;
  final String? session;

  const VGApiAuthResponse({this.user, this.session});
}

/// Kept the class name VGSupabaseAuthService — see vg_supabase_config.dart
/// for why. Internals now call the Worker's Better Auth endpoints
/// (email/password + native Google ID-token) instead of supabase_flutter.
class VGSupabaseAuthService {
  VGSupabaseAuthService._();

  static VGApiUser? get currentUser {
    final id = VGApiClient.currentUserId;
    if (id == null) return null;
    return VGApiUser(id: id, email: VGApiClient.currentUserEmail);
  }

  static bool get isSignedIn => VGApiClient.isSignedIn;

  static Stream<void> get onAuthStateChange => VGApiClient.onAuthStateChange;

  static Future<VGApiAuthResponse> signUpWithEmail({
    required String email,
    required String password,
  }) async {
    final data = await VGApiClient.post('/api/auth/sign-up/email', body: {
      'email': email,
      'password': password,
      'name': email.split('@').first,
    });
    return _handleAuthResponse(data);
  }

  static Future<VGApiAuthResponse> signInWithEmail({
    required String email,
    required String password,
  }) async {
    final data = await VGApiClient.post('/api/auth/sign-in/email', body: {
      'email': email,
      'password': password,
    });
    return _handleAuthResponse(data);
  }

  static Future<void> signInWithGoogle() async {
    if (!VGSupabaseConfig.hasGoogleSignIn) {
      throw StateError('GOOGLE_WEB_CLIENT_ID dart-define is not set');
    }

    final google = GoogleSignIn(
      serverClientId: VGSupabaseConfig.googleWebClientId,
    );
    final account = await google.signIn();
    if (account == null) {
      throw StateError('Google sign-in cancelled');
    }
    final auth = await account.authentication;
    final idToken = auth.idToken;
    if (idToken == null) {
      throw StateError('Google idToken missing');
    }

    final data = await VGApiClient.post('/api/auth-native/google', body: {
      'idToken': idToken,
    });
    final token = data['token'] as String?;
    final userId = data['userId'] as String?;
    if (token == null || userId == null) {
      throw StateError('Invalid Google sign-in response');
    }
    await VGApiClient.setSession(
      token: token,
      userId: userId,
      userEmail: account.email,
    );
  }

  static Future<void> resetPassword(String email) {
    return VGApiClient.post('/api/auth/forget-password', body: {
      'email': email,
      'redirectTo': '',
    });
  }

  static Future<void> signOut() async {
    try {
      await VGPushService.deactivateCurrentToken();
    } catch (_) {}
    if (VGSupabaseConfig.hasGoogleSignIn) {
      try {
        await GoogleSignIn(serverClientId: VGSupabaseConfig.googleWebClientId)
            .signOut();
      } catch (_) {}
    }
    try {
      await VGApiClient.post('/api/auth/sign-out');
    } catch (_) {}
    await _clearLocalAccountState();
    await VGApiClient.clearSession();
  }

  static Future<void> deleteAccount() async {
    await VGApiClient.delete(
      '/api/profiles/me',
      body: const {'confirmation': 'DELETE'},
    );
    VGSessionScanCache.clear();
    if (VGSupabaseConfig.hasGoogleSignIn) {
      try {
        await GoogleSignIn(serverClientId: VGSupabaseConfig.googleWebClientId)
            .disconnect();
      } catch (_) {}
    }
    await _clearLocalAccountState(clearOnboarding: true);
    await VGApiClient.clearSession();
  }

  static Future<void> _clearLocalAccountState({
    bool clearOnboarding = false,
  }) async {
    VGSessionScanCache.clear();
    await Future.wait([
      if (clearOnboarding) removeKey(vgOnboardingCompleteKey),
      if (clearOnboarding) removeKey(vgOnboardingProfileKey),
      removeKey(vgGuideTipsCacheKey),
      removeKey(vgSubscriptionIsProKey),
      removeKey(vgSubscriptionPlanKey),
      removeKey(vgSubscriptionFreeScanCountKey),
      removeKey(vgSubscriptionLastDailyPromptKey),
      removeKey(vgReferralCodeKey),
      removeKey(vgReferralDownloadCountKey),
      removeKey(vgReferralBonusRedeemedKey),
      removeKey(vgReferralBonusScansKey),
      VGProfileCache.clear(),
    ]);
  }

  static Future<VGApiAuthResponse> _handleAuthResponse(
      Map<String, dynamic> data) async {
    final token = data['token'] as String?;
    final userJson = data['user'] as Map<String, dynamic>?;
    if (token == null || userJson == null) {
      // Better Auth's response shape when email verification is required
      // (no session yet) — kept for forward-compat if that's ever enabled.
      return const VGApiAuthResponse();
    }
    final userId = userJson['id'] as String;
    final email = userJson['email'] as String?;
    await VGApiClient.setSession(
        token: token, userId: userId, userEmail: email);
    return VGApiAuthResponse(
      user: VGApiUser(id: userId, email: email),
      session: token,
    );
  }
}
