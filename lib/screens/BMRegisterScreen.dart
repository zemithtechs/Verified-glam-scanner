import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';
import 'package:url_launcher/url_launcher.dart';

import '../components/BMSocialIconsLoginComponents.dart';
import '../main.dart';
import '../services/backend/vg_auth_service.dart';
import '../services/backend/vg_backend_config.dart';
import '../services/backend/vg_backend_connection.dart';
import '../utils/BMColors.dart';
import '../utils/BMWidgets.dart';
import '../utils/vg_auth_navigation.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_error_utils.dart';
import 'BMLoginScreen.dart';
import 'onboarding/vg_onboarding_flow.dart';

class BMRegisterScreen extends StatefulWidget {
  const BMRegisterScreen({Key? key}) : super(key: key);

  @override
  State<BMRegisterScreen> createState() => _BMRegisterScreenState();
}

class _BMRegisterScreenState extends State<BMRegisterScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _passwordFocus = FocusNode();
  bool _loading = false;
  bool _ageConfirmed = false;

  @override
  void initState() {
    if (!kIsWeb) setStatusBarColor(bmSpecialColor);
    super.initState();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _passwordFocus.dispose();
    if (!kIsWeb) setStatusBarColor(Colors.transparent);
    super.dispose();
  }

  Future<void> _register() async {
    if (kVGUseCloudBackend && vgBackendConnectionBlocked()) {
      toast(
        VGBackendConfig.isConfigured
            ? 'Could not connect to the server. Check your network and try again.'
            : 'Server not configured. Run with scripts/run-dev.ps1 or launch config.',
      );
      return;
    }
    if (!kVGUseCloudBackend) {
      VGOnboardingFlow().launch(context);
      return;
    }
    setState(() => _loading = true);
    try {
      await VGAuthService.signUpWithEmail(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      if (!mounted) return;
      finish(context);
      VGOnboardingFlow().launch(context);
    } catch (e) {
      toast(vgFriendlyAuthError(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _google() async {
    if (!_ageConfirmed) {
      toast('Please confirm you are 18+ and agree to the Terms and Privacy Policy first.');
      return;
    }
    if (!VGBackendConfig.hasGoogleSignIn) {
      toast('Google sign-in not configured');
      return;
    }
    setState(() => _loading = true);
    try {
      await VGAuthService.signInWithGoogle();
      if (!mounted) return;
      finish(context);
      await vgNavigateAfterAuth(context);
    } catch (e) {
      toast(vgFriendlyAuthError(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appStore.isDarkModeOn ? appStore.scaffoldBackground! : bmLightScaffoldBackgroundColor,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          upperContainer(
            screenContext: context,
            child: headerText(title: 'Register'),
          ),
          lowerContainer(
            screenContext: context,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  16.height,
                  Row(
                    children: [
                      Text('Are you a member?', style: boldTextStyle(color: appStore.isDarkModeOn ? Colors.white : bmSpecialColorDark)),
                      TextButton(
                        onPressed: () => BMLoginScreen().launch(context),
                        child: Text('Login Now', style: boldTextStyle(color: appStore.isDarkModeOn ? bmPrimaryColor : Colors.grey)),
                      )
                    ],
                  ),
                  30.height,
                  Text('Enter your email', style: primaryTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColor, size: 14)),
                  AppTextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    nextFocus: _passwordFocus,
                    textFieldType: TextFieldType.EMAIL,
                    cursorColor: bmPrimaryColor,
                    textStyle: boldTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor),
                    decoration: InputDecoration(
                      border: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor)),
                      focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor)),
                      enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor)),
                    ),
                  ),
                  20.height,
                  Text('Password', style: primaryTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColor, size: 14)),
                  AppTextField(
                    controller: _passwordController,
                    focus: _passwordFocus,
                    textFieldType: TextFieldType.PASSWORD,
                    cursorColor: bmPrimaryColor,
                    textStyle: boldTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor),
                    suffixIconColor: bmPrimaryColor,
                    decoration: InputDecoration(
                      border: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor)),
                      focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor)),
                      enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmPrimaryColor)),
                    ),
                  ),
                  20.height,
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Checkbox(
                        value: _ageConfirmed,
                        activeColor: bmPrimaryColor,
                        onChanged: (v) => setState(() => _ageConfirmed = v ?? false),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(top: 12),
                          child: RichText(
                            text: TextSpan(
                              style: secondaryTextStyle(color: appStore.isDarkModeOn ? Colors.white : bmSpecialColorDark, size: 12),
                              children: [
                                const TextSpan(text: 'I confirm I am at least 18 years old and agree to the '),
                                TextSpan(
                                  text: 'Terms of Use',
                                  style: boldTextStyle(color: bmPrimaryColor, size: 12),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () => launchUrl(Uri.parse('$vgMarketingSiteUrl/terms'), mode: LaunchMode.externalApplication),
                                ),
                                const TextSpan(text: ' and '),
                                TextSpan(
                                  text: 'Privacy Policy',
                                  style: boldTextStyle(color: bmPrimaryColor, size: 12),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () => launchUrl(Uri.parse('$vgMarketingSiteUrl/privacy'), mode: LaunchMode.externalApplication),
                                ),
                                const TextSpan(text: '.'),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  10.height,
                  AppButton(
                    width: context.width() - 32,
                    shapeBorder: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                    child: _loading
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text('Join Now', style: boldTextStyle(color: Colors.white)),
                    padding: const EdgeInsets.all(16),
                    color: _ageConfirmed ? bmPrimaryColor : bmPrimaryColor.withValues(alpha: 0.4),
                    onTap: (_loading || !_ageConfirmed) ? null : _register,
                  ),
                  30.height,
                  Text(
                    'or register with',
                    style: secondaryTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColorDark),
                  ).center(),
                  30.height,
                  BMSocialIconsLoginComponents(onGoogleSignIn: _google).center(),
                ],
              ).paddingSymmetric(horizontal: 16),
            ),
          ).expand()
        ],
      ),
    );
  }
}
