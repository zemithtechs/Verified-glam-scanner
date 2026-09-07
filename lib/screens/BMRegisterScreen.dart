import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../components/BMSocialIconsLoginComponents.dart';
import '../main.dart';
import '../services/supabase/vg_supabase_auth_service.dart';
import '../services/supabase/vg_supabase_config.dart';
import '../services/supabase/vg_supabase_connection.dart';
import '../utils/BMColors.dart';
import '../utils/BMWidgets.dart';
import '../utils/vg_auth_navigation.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_copy.dart';
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
    if (kVGUseSupabase && vgSupabaseConnectionBlocked()) {
      toast(
        VGSupabaseConfig.isConfigured
            ? 'Could not connect to the server. Check your network and try again.'
            : 'Server not configured. Run with scripts/run-dev.ps1 or launch config.',
      );
      return;
    }
    if (!kVGUseSupabase) {
      VGOnboardingFlow().launch(context);
      return;
    }
    setState(() => _loading = true);
    try {
      await VGSupabaseAuthService.signUpWithEmail(
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
    if (!VGSupabaseConfig.hasGoogleSignIn) {
      toast('Google sign-in not configured');
      return;
    }
    setState(() => _loading = true);
    try {
      await VGSupabaseAuthService.signInWithGoogle();
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
                  30.height,
                  AppButton(
                    width: context.width() - 32,
                    shapeBorder: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                    child: _loading
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text('Join Now', style: boldTextStyle(color: Colors.white)),
                    padding: const EdgeInsets.all(16),
                    color: bmPrimaryColor,
                    onTap: _loading ? null : _register,
                  ),
                  30.height,
                  Text(
                    'or register with',
                    style: secondaryTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColorDark),
                  ).center(),
                  30.height,
                  BMSocialIconsLoginComponents(onGoogleSignIn: _google).center(),
                  30.height,
                  Text(
                    '${VGCopy.registerTermsPrefix} ',
                    style: secondaryTextStyle(color: appStore.isDarkModeOn ? Colors.white : bmSpecialColorDark, size: 12),
                  ).center(),
                ],
              ).paddingSymmetric(horizontal: 16),
            ),
          ).expand()
        ],
      ),
    );
  }
}
