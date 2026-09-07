import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../main.dart';
import '../services/supabase/vg_supabase_auth_service.dart';
import '../services/supabase/vg_supabase_config.dart';
import '../services/supabase/vg_supabase_connection.dart';
import '../services/supabase/vg_supabase_init.dart';
import '../utils/BMColors.dart';
import '../utils/BMWidgets.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_error_utils.dart';

class BMForgetPasswordScreen extends StatefulWidget {
  const BMForgetPasswordScreen({Key? key}) : super(key: key);

  @override
  State<BMForgetPasswordScreen> createState() => _BMForgetPasswordScreenState();
}

class _BMForgetPasswordScreenState extends State<BMForgetPasswordScreen> {
  final _emailController = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _emailController.text.trim();
    if (email.isEmpty) {
      toast('Enter your email');
      return;
    }
    if (kVGUseSupabase && vgSupabaseConnectionBlocked()) {
      toast(
        VGSupabaseConfig.isConfigured
            ? 'Could not connect to the server. Check your network and try again.'
            : 'Server not configured. Run with scripts/run-dev.ps1 or launch config.',
      );
      return;
    }
    if (kVGUseSupabase && VGSupabaseInit.isReady) {
      setState(() => _loading = true);
      try {
        await VGSupabaseAuthService.resetPassword(email);
        toast('Check your email for reset instructions');
        if (mounted) finish(context);
      } catch (e) {
        toast(vgFriendlyAuthError(e));
      } finally {
        if (mounted) setState(() => _loading = false);
      }
      return;
    }
    toast('Password reset requires server configuration');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: appStore.isDarkModeOn ? appStore.scaffoldBackground! : bmLightScaffoldBackgroundColor,
      body: Column(
        children: [
          upperContainer(
            screenContext: context,
            child: headerText(title: 'Forget Password'),
          ),
          lowerContainer(
            screenContext: context,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  16.height,
                  Text(
                    'Please enter your email below to receive your password reset instructions.',
                    style: primaryTextStyle(color: appStore.isDarkModeOn ? Colors.white : bmSpecialColorDark, size: 14),
                  ),
                  30.height,
                  Text('Email', style: primaryTextStyle(color: appStore.isDarkModeOn ? bmTextColorDarkMode : bmSpecialColor, size: 14)),
                  AppTextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    textFieldType: TextFieldType.EMAIL,
                    cursorColor: bmPrimaryColor,
                    textStyle: boldTextStyle(color: appStore.isDarkModeOn ? Colors.white : bmSpecialColorDark),
                    decoration: InputDecoration(
                      border: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmPrimaryColor : context.iconColor)),
                      focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmPrimaryColor : context.iconColor)),
                      enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: appStore.isDarkModeOn ? bmPrimaryColor : context.iconColor)),
                    ),
                  ),
                  40.height,
                  AppButton(
                    width: context.width() - 32,
                    color: bmPrimaryColor,
                    onTap: _loading ? null : _submit,
                    child: _loading
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text('Send reset link', style: boldTextStyle(color: Colors.white)),
                  ),
                  24.height,
                  IconButton(
                    icon: Icon(Icons.arrow_back, color: appStore.isDarkModeOn ? Colors.white : bmPrimaryColor),
                    onPressed: () => finish(context),
                  ),
                ],
              ).paddingSymmetric(horizontal: 16),
            ),
          ).expand()
        ],
      ),
    );
  }
}
