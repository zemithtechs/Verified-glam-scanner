import 'package:flutter/foundation.dart';

import '../../utils/vg_constants.dart';
import 'vg_backend_config.dart';
import 'vg_backend_init.dart';

/// Returns true when the Worker API is required but not configured/ready.
bool vgBackendConnectionBlocked() {
  return kVGUseCloudBackend && !VGBackendInit.isReady;
}

/// Warn in debug when the app will run in local-only mode unintentionally.
void vgWarnIfBackendMisconfigured() {
  if (!kVGUseCloudBackend) return;
  if (VGBackendConfig.isConfigured) return;
  final msg = VGBackendConfig.url.isNotEmpty && !VGBackendConfig.hasValidUrl
      ? '[Verified Glam] VG_API_URL must be a full https:// URL (rebuild with .\\scripts\\build-web.ps1).'
      : '[Verified Glam] VG_API_URL missing. '
          'Run with scripts/run-dev.ps1 or .vscode/launch.json dart-defines. '
          'Cloud auth, scans, and AI analysis are disabled.';
  if (kReleaseMode) {
    debugPrint(msg);
    return;
  }
  debugPrint(msg);
}
