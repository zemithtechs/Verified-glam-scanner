import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../services/supabase/vg_supabase_auth_service.dart';
import '../../services/supabase/vg_supabase_config.dart';
import '../../services/supabase/vg_supabase_connection.dart';
import '../../utils/vg_auth_navigation.dart';
import '../../utils/vg_constants.dart';
import '../../utils/vg_copy.dart';
import '../vg_web_auth_helpers.dart';
import '../widgets/vg_web_auth_layout.dart';

class VGWebRegisterScreen extends StatefulWidget {
  const VGWebRegisterScreen({super.key});

  @override
  State<VGWebRegisterScreen> createState() => _VGWebRegisterScreenState();
}

class _VGWebRegisterScreenState extends State<VGWebRegisterScreen> {
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

  String? get _postAuthTarget =>
      vgPostAuthTargetFromQuery(GoRouterState.of(context).uri.queryParameters);

  String? get _redirect => GoRouterState.of(context).uri.queryParameters['redirect'];

  Future<void> _register() async {
    final email = _emailController.text.trim();
    if (!vgIsValidAuthEmail(email)) {
      toast('Enter a valid email address');
      return;
    }
    if (!vgIsValidAuthPassword(_passwordController.text)) {
      toast('Password must be at least 6 characters');
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
      context.go('/onboarding');
      return;
    }
    setState(() => _loading = true);
    try {
      final response = await VGSupabaseAuthService.signUpWithEmail(
        email: email,
        password: _passwordController.text,
      );
      if (!mounted) return;
      if (response.session != null) {
        await vgNavigateAfterAuth(context, redirect: _postAuthTarget ?? _redirect);
      } else {
        final plan = vgCheckoutPlanFromQuery(GoRouterState.of(context).uri.queryParameters);
        final msg = plan != null
            ? 'Account created — check your email to confirm, then sign in to complete checkout.'
            : 'Account created — check your email to confirm, then sign in.';
        toast(msg);
        var loginPath = '/login';
        if (_postAuthTarget != null) {
          loginPath = '/login?redirect=${Uri.encodeComponent(_postAuthTarget!)}';
        } else if (_redirect != null) {
          loginPath = '/login?redirect=${Uri.encodeComponent(_redirect!)}';
        }
        context.go(loginPath);
      }
    } catch (e) {
      toast(vgAuthErrorMessage(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _google() async {
    if (!VGSupabaseConfig.hasGoogleSignIn) {
      toast('Google sign-in not configured');
      return;
    }
    setState(() => _loading = true);
    try {
      await VGSupabaseAuthService.signInWithGoogle();
      if (!mounted) return;
      await vgNavigateAfterAuth(context, redirect: _postAuthTarget ?? _redirect);
    } catch (e) {
      toast(vgAuthErrorMessage(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loginPath = _postAuthTarget != null
        ? '/login?redirect=${Uri.encodeComponent(_postAuthTarget!)}'
        : (_redirect != null
            ? '/login?redirect=${Uri.encodeComponent(_redirect!)}'
            : '/login');

    return VGWebAuthLayout(
      title: 'Create your account',
      subtitle: 'Join Verified Glam Scanner — upload a photo and start AI beauty scans in your browser.',
      footerPrompt: 'Already have an account?',
      footerActionLabel: 'Sign in',
      footerActionPath: loginPath,
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
            onSubmitted: _register,
            suffix: IconButton(
              icon: Icon(_showPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined),
              onPressed: () => setState(() => _showPassword = !_showPassword),
            ),
          ),
          const SizedBox(height: 20),
          VGWebPrimaryButton(label: 'Create account', loading: _loading, onPressed: _register),
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
          VGWebGoogleButton(loading: _loading, onPressed: _google),
          const SizedBox(height: 16),
          Text(
            VGCopy.registerTermsPrefix,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12, color: Color(0xFF5A5C5E), height: 1.5),
          ),
        ],
      ),
    );
  }
}
