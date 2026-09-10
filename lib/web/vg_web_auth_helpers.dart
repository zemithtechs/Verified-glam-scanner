import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';

import '../services/backend/vg_api_client.dart';
import '../utils/vg_constants.dart';

const _emailPattern = r'^[^@\s]+@[^@\s]+\.[^@\s]+$';

bool vgIsValidAuthEmail(String email) => RegExp(_emailPattern).hasMatch(email);

bool vgIsValidAuthPassword(String password) => password.length >= 6;

String vgAuthErrorMessage(Object error) {
  if (error is VGApiException) return error.message;
  final text = error.toString();
  if (text.contains('FormatException') || text.contains('Unexpected character')) {
    return 'Login failed — app cannot reach the server. Rebuild with .\\scripts\\build-web.ps1, then hard-refresh (Ctrl+Shift+R).';
  }
  if (text.startsWith('Exception: ')) return text.substring(11);
  return text;
}

/// Safe in-app path only (no open redirects).
bool vgIsSafeRedirectPath(String? path) {
  if (path == null || path.isEmpty) return false;
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  const blocked = {'/login', '/register', '/forgot-password', '/walkthrough', '/splash', '/dashboard'};
  return !blocked.contains(path);
}

const _validCheckoutPlans = {'annual', 'pro_weekly'};

/// Plan id from `/register?plan=` or `/pricing?plan=` (annual | pro_weekly).
String? vgCheckoutPlanFromQuery(Map<String, String> query) {
  final plan = query['plan'];
  if (plan != null && _validCheckoutPlans.contains(plan)) return plan;
  return null;
}

/// Post-auth destination: explicit redirect, or pricing with plan for checkout resume.
String? vgPostAuthTargetFromQuery(Map<String, String> query) {
  final redirect = query['redirect'];
  if (vgIsSafeRedirectPath(redirect)) return redirect;
  final plan = vgCheckoutPlanFromQuery(query);
  if (plan != null) return '/pricing?plan=$plan';
  return null;
}

Future<void> vgSavePostAuthRedirect(String? path) async {
  if (vgIsSafeRedirectPath(path)) {
    await setValue(vgPostAuthRedirectKey, path!);
  }
}

Future<String?> vgTakePostAuthRedirect() async {
  final path = getStringAsync(vgPostAuthRedirectKey);
  if (path.isEmpty) return null;
  await removeKey(vgPostAuthRedirectKey);
  return vgIsSafeRedirectPath(path) ? path : null;
}

void vgCaptureRedirectFromUri(BuildContext context) {
  final query = GoRouterState.of(context).uri.queryParameters;
  final target = vgPostAuthTargetFromQuery(query);
  if (target != null) {
    setValue(vgPostAuthRedirectKey, target);
  }
}
