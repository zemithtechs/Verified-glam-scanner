import '../../utils/vg_constants.dart';
import 'vg_api_client.dart';
import 'vg_backend_config.dart';
import 'vg_backend_connection.dart';

class VGBackendInit {
  VGBackendInit._();

  static bool _initialized = false;

  static bool get isReady => _initialized && VGBackendConfig.isConfigured;

  static Future<void> initialize() async {
    vgWarnIfBackendMisconfigured();
    if (!kVGUseCloudBackend || !VGBackendConfig.isConfigured) return;
    if (_initialized) return;

    await VGApiClient.restoreSession();
    _initialized = true;
  }
}
