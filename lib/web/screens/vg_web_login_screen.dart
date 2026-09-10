import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../services/backend/vg_auth_service.dart';
import '../../services/backend/vg_backend_config.dart';
import '../../services/backend/vg_backend_connection.dart';
import '../../utils/vg_auth_navigation.dart';
import '../../utils/vg_constants.dart';
import '../vg_web_auth_helpers.dart';
import '../widgets/vg_web_auth_layout.dart';

class VGWebLoginScreen extends StatefulWidget {
  const VGWebLoginScreen({super.key});

  @override
  State<VGWebLoginScreen> createState() => _VGWebLoginScreenState();
}

class _VGWebLoginScreenState extends State<VGWebLoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _passwordFocus = FocusNode();
  bool _loading = false;
  bool _showPassword = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) vgCaptureRedirectFromUri(context);
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  String? get _redirect => GoRouterState.of(context).uri.queryParameters['redirect'];

  Future<void> _signInEmail() async {
    final email = _emailController.text.trim();
    if (!vgIsValidAuthEmail(email)) {
      toast('Enter a valid email address');
      return;
    }
    if (!vgIsValidAuthPassword(_passwordController.text)) {
      toast('Password must be at least 6 characters');
      return;
    }
    if (kVGUseCloudBackend && vgBackendConnectionBlocked()) {
      final blocked = VGBackendConfig.url.isNotEmpty && !VGBackendConfig.hasValidUrl
          ? 'Server URL is invalid in this build. Run .\\scripts\\build-web.ps1 and hard-refresh.'
          : VGBackendConfig.isConfigured
              ? 'Could not connect to the server. Check your network and try again.'
              : 'Server not configured.';
      toast(blocked);
      return;
    }
    if (!kVGUseCloudBackend) {
      await vgNavigateAfterAuth(context, redirect: _redirect);
      return;
    }
    setState(() => _loading = true);
    try {
      await VGAuthService.signInWithEmail(
        email: email,
        password: _passwordController.text,
      );
      if (!mounted) return;
      await vgNavigateAfterAuth(context, redirect: _redirect);
    } catch (e) {
      toast(vgAuthErrorMessage(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _signInGoogle() async {
    if (!VGBackendConfig.hasGoogleSignIn) {
      toast('Google sign-in not configured (GOOGLE_WEB_CLIENT_ID)');
      return;
    }
    setState(() => _loading = true);
    try {
      await VGAuthService.signInWithGoogle();
      if (!mounted) return;
      await vgNavigateAfterAuth(context, redirect: _redirect);
    } catch (e) {
      toast(vgAuthErrorMessage(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return VGWebAuthLayout(
      title: 'Welcome back',
      subtitle: 'Sign in to Verified Glam Scanner to run analyses, save scans, and sync across devices.',
      footerPrompt: 'New to Verified Glam Scanner?',
      footerActionLabel: 'Create account',
      footerActionPath: _redirect != null ? '/register?redirect=${Uri.encodeComponent(_redirect!)}' : '/register',
      form: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          VGWebAuthField(
            label: 'Email',
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            onSubmitted: () => _passwordFocus.requestFocus(),
          ),
          const SizedBox(height: 16),
          VGWebAuthField(
            label: 'Password',
            controller: _passwordController,
            focusNode: _passwordFocus,
            obscure: !_showPassword,
            textInputAction: TextInputAction.done,
            onSubmitted: _signInEmail,
            suffix: IconButton(
              icon: Icon(_showPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined),
              onPressed: () => setState(() => _showPassword = !_showPassword),
            ),
          ),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () => context.go('/forgot-password'),
              child: const Text('Forgot password?', style: TextStyle(color: Color(0xFF872B3F))),
            ),
          ),
          const SizedBox(height: 8),
          VGWebPrimaryButton(label: 'Sign in', loading: _loading, onPressed: _signInEmail),
          const SizedBox(height: 20),
          const Row(
            children: [
              Expanded(child: Divider()),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 12),
                child: Text('or', style: TextStyle(color: Color(0xFF5A5C5E))),
              ),
              Expanded(child: Divider()),
            ],
          ),
          const SizedBox(height: 20),
          VGWebGoogleButton(loading: _loading, onPressed: _signInGoogle),
        ],
      ),
    );
  }
}
