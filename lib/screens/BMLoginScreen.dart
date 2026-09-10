import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

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
import 'BMForgetPasswordScreen.dart';
import 'BMRegisterScreen.dart';

class BMLoginScreen extends StatefulWidget {
  const BMLoginScreen({Key? key}) : super(key: key);

  @override
  State<BMLoginScreen> createState() => _BMLoginScreenState();
}

class _BMLoginScreenState extends State<BMLoginScreen> {
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

  Future<void> _signInEmail() async {
    if (kVGUseCloudBackend && vgBackendConnectionBlocked()) {
      toast(
        VGBackendConfig.isConfigured
            ? 'Could not connect to the server. Check your network and try again.'
            : 'Server not configured. Run with scripts/run-dev.ps1 or launch config.',
      );
      return;
    }
    if (!kVGUseCloudBackend) {
      await vgNavigateAfterAuth(context);
      return;
    }
    setState(() => _loading = true);
    try {
      await VGAuthService.signInWithEmail(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      if (!mounted) return;
      finish(context);
      await vgNavigateAfterAuth(context);
    } catch (e) {
      toast(vgFriendlyAuthError(e));
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
            child: headerText(title: 'Login'),
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
                      Text('Not a member yet?', style: boldTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColorDark)),
                      TextButton(
                        onPressed: () => BMRegisterScreen().launch(context),
                        child: Text(
                          'Register Now',
                          style: boldTextStyle(color: appStore.isDarkModeOn ? bmPrimaryColor : bmGreyColor),
                        ),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Password', style: primaryTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColor, size: 14)),
                      TextButton(
                        onPressed: () => BMForgetPasswordScreen().launch(context),
                        child: Text('Forgot Password', style: boldTextStyle(color: appStore.isDarkModeOn ? bmPrimaryColor : bmGreyColor, size: 14)),
                      )
                    ],
                  ),
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
                        : Text('Login', style: boldTextStyle(color: Colors.white)),
                    padding: const EdgeInsets.all(16),
                    color: bmPrimaryColor,
                    onTap: _loading ? null : _signInEmail,
                  ),
                  30.height,
                  Text(
                    'or login with',
                    style: secondaryTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColorDark),
                  ).center(),
                  30.height,
                  BMSocialIconsLoginComponents(onGoogleSignIn: _signInGoogle).center(),
                ],
              ).paddingSymmetric(horizontal: 16),
            ),
          ).expand()
        ],
      ),
    );
  }
}
