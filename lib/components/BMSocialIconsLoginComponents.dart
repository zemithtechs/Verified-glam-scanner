import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

/// Only Google sign-in is wired up (see docs/CLOUDFLARE_MIGRATION_PLAN.md —
/// email/password + native Google ID-token are the only supported methods).
/// Facebook/Twitter/Apple icons were decorative only, with no real sign-in
/// behind them, and were removed rather than left as dead UI.
class BMSocialIconsLoginComponents extends StatelessWidget {
  final VoidCallback? onGoogleSignIn;

  const BMSocialIconsLoginComponents({super.key, this.onGoogleSignIn});

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'images/google_logo.png',
      height: 50,
      width: 50,
      fit: BoxFit.cover,
    ).cornerRadiusWithClipRRect(100).onTap(onGoogleSignIn ?? () {});
  }
}
