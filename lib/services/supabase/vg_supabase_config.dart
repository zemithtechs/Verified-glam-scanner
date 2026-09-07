/// Cloudflare Worker API + Google OAuth configuration via --dart-define.
///
/// Kept the class name VGSupabaseConfig (not VGApiConfig) even though the
/// backend moved off Supabase — renaming would touch every call site across
/// the app; see docs/CLOUDFLARE_MIGRATION_PLAN.md for why this migration
/// preserves class names and only rewrites internals.
class VGSupabaseConfig {
  static const url = String.fromEnvironment(
    'VG_API_URL',
    defaultValue: '',
  );

  static const googleWebClientId = String.fromEnvironment(
    'GOOGLE_WEB_CLIENT_ID',
    defaultValue: '',
  );

  static bool get hasValidUrl {
    final u = url.trim();
    return u.startsWith('https://') && u.contains('.');
  }

  static bool get isConfigured => hasValidUrl;

  static bool get hasGoogleSignIn => googleWebClientId.isNotEmpty;
}
