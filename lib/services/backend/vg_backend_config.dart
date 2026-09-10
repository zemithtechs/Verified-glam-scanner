/// Cloudflare Worker API + Google OAuth configuration via --dart-define.
class VGBackendConfig {
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
