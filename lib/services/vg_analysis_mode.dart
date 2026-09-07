import '../utils/vg_constants.dart';
import 'supabase/vg_supabase_auth_service.dart';
import 'supabase/vg_supabase_config.dart';
import 'supabase/vg_supabase_init.dart';

/// Whether scans use live OpenAI via Supabase or local mock payloads.
class VGAnalysisMode {
  VGAnalysisMode._();

  static bool get useCloud =>
      kVGUseSupabase && VGSupabaseConfig.isConfigured && VGSupabaseInit.isReady;

  /// Signed-in user on cloud path with mock disabled.
  static bool get isLiveAnalysis =>
      useCloud && !kVGUseMockAnalysis && VGSupabaseAuthService.isSignedIn;

  /// Explicit offline dev only (local mock launch config).
  static bool get allowMockAnalysis => kVGLocalDevMode && kVGUseMockAnalysis;

  static bool get willUseMock => !isLiveAnalysis && allowMockAnalysis;

  static String? get blockReason {
    if (isLiveAnalysis || allowMockAnalysis) return null;
    if (!useCloud) {
      return 'Sign in and run via the live server to analyze your photo. '
          'Use scripts/run-dev.ps1 with .env configured.';
    }
    if (!VGSupabaseAuthService.isSignedIn) {
      return 'Sign in to run live AI analysis on your photo.';
    }
    if (kVGUseMockAnalysis) {
      return 'Mock analysis is disabled for normal use. Use the Cloudflare launch config.';
    }
    return 'Live analysis is unavailable. Check your connection and try again.';
  }
}
