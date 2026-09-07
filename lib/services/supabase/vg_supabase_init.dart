import '../../utils/vg_constants.dart';
import 'vg_api_client.dart';
import 'vg_supabase_config.dart';
import 'vg_supabase_connection.dart';

/// Kept the class name VGSupabaseInit — see vg_supabase_config.dart for why.
class VGSupabaseInit {
  VGSupabaseInit._();

  static bool _initialized = false;

  static bool get isReady => _initialized && VGSupabaseConfig.isConfigured;

  static Future<void> initialize() async {
    vgWarnIfSupabaseMisconfigured();
    if (!kVGUseSupabase || !VGSupabaseConfig.isConfigured) return;
    if (_initialized) return;

    await VGApiClient.restoreSession();
    _initialized = true;
  }
}
