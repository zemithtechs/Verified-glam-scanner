import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../services/supabase/vg_supabase_auth_service.dart';
import '../../services/supabase/vg_supabase_config.dart';
import '../../services/supabase/vg_supabase_connection.dart';
import '../../utils/vg_constants.dart';
import '../vg_web_auth_helpers.dart';
import '../widgets/vg_web_auth_layout.dart';

class VGWebForgotPasswordScreen extends StatefulWidget {
  const VGWebForgotPasswordScreen({super.key});

  @override
  State<VGWebForgotPasswordScreen> createState() => _VGWebForgotPasswordScreenState();
}

class _VGWebForgotPasswordScreenState extends State<VGWebForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _loading = false;
  bool _sent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _emailController.text.trim();
    if (!vgIsValidAuthEmail(email)) {
      toast('Enter a valid email address');
      return;
    }
    if (kVGUseSupabase && vgSupabaseConnectionBlocked()) {
      toast(
        VGSupabaseConfig.isConfigured
            ? 'Could not connect to the server. Check your network and try again.'
            : 'Server not configured.',
      );
      return;
    }
    if (!kVGUseSupabase) {
      toast('Password reset requires server configuration');
      return;
    }
    setState(() => _loading = true);
    try {
      await VGSupabaseAuthService.resetPassword(email);
      if (!mounted) return;
      setState(() => _sent = true);
    } catch (e) {
      toast(vgAuthErrorMessage(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return VGWebAuthLayout(
      title: 'Reset your password',
      subtitle: _sent
          ? 'If an account exists for that email, we sent reset instructions. Check your inbox.'
          : 'Enter your email and we will send a link to reset your password.',
      footerPrompt: 'Remember your password?',
      footerActionLabel: 'Back to sign in',
      footerActionPath: '/login',
      form: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (!_sent) ...[
            VGWebAuthField(
              label: 'Email',
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.done,
              onSubmitted: _submit,
            ),
            const SizedBox(height: 24),
            VGWebPrimaryButton(label: 'Send reset link', loading: _loading, onPressed: _submit),
          ] else ...[
            VGWebPrimaryButton(
              label: 'Return to sign in',
              onPressed: () => context.go('/login'),
            ),
          ],
        ],
      ),
    );
  }
}
