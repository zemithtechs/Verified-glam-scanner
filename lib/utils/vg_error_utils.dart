import '../services/backend/vg_api_client.dart';
import 'vg_copy.dart';

/// Typed analysis failure from edge function or client preflight.
class VGAnalysisFailure implements Exception {
  final String message;
  final String errorCode;
  final int? status;

  const VGAnalysisFailure({
    required this.message,
    this.errorCode = 'ANALYSIS_FAILED',
    this.status,
  });

  @override
  String toString() => message;
}

/// Parses edge-function and client errors into [VGAnalysisFailure].
VGAnalysisFailure vgParseAnalysisError(Object error) {
  if (error is VGAnalysisFailure) return error;

  if (error is VGApiException) {
    final body = error.body;
    final code = error.errorCode ?? body?['errorCode']?.toString() ?? _codeFromStatus(error.statusCode);
    final message = body?['error']?.toString() ??
        (error.message.isNotEmpty ? error.message : _defaultMessageForCode(code));
    return VGAnalysisFailure(
      message: message,
      errorCode: code,
      status: error.statusCode,
    );
  }

  final text = error.toString();
  const prefix = 'Exception: ';
  final message = text.startsWith(prefix) ? text.substring(prefix.length) : text;

  if (message.contains('Insufficient credits') || message.contains('INSUFFICIENT_CREDITS')) {
    return const VGAnalysisFailure(
      message: VGCopy.creditsInsufficientMessage,
      errorCode: 'INSUFFICIENT_CREDITS',
      status: 429,
    );
  }
  if (message.contains('Pro subscription required') || message.contains('NOT_SUBSCRIBED')) {
    return const VGAnalysisFailure(
      message: "This analysis isn't included in your free plan.",
      errorCode: 'NOT_SUBSCRIBED',
      status: 403,
    );
  }
  if (message.contains('Daily scan limit')) {
    return VGAnalysisFailure(message: message, errorCode: 'DAILY_LIMIT', status: 429);
  }
  if (message.contains('Not signed in')) {
    return VGAnalysisFailure(message: message, errorCode: 'UNAUTHORIZED', status: 401);
  }
  if (message.toLowerCase().contains('network') ||
      message.toLowerCase().contains('socket') ||
      message.toLowerCase().contains('connection')) {
    return VGAnalysisFailure(
      message: 'Please check your connection and try again.',
      errorCode: 'NETWORK_ERROR',
    );
  }

  return VGAnalysisFailure(message: message);
}

String vgFormatAnalysisError(Object error) => vgParseAnalysisError(error).message;

/// Clean, human-readable message for sign-in/sign-up/reset-password errors —
/// never the raw "VGApiException(401, ...)" toString a bare `toast(e)` would
/// show. Falls back to a generic message for anything unrecognized rather
/// than a technical string.
String vgFriendlyAuthError(Object error) {
  if (error is VGApiException) {
    if (error.message.isNotEmpty && !error.message.startsWith('Request failed')) {
      return error.message;
    }
    switch (error.statusCode) {
      case 401:
        return 'Incorrect email or password. Please try again.';
      case 404:
        return 'We could not find an account with that email.';
      case 409:
        return 'An account with this email already exists.';
      case 429:
        return 'Too many attempts. Please wait a moment and try again.';
      default:
        return 'Something went wrong. Please check your connection and try again.';
    }
  }
  return 'Something went wrong. Please check your connection and try again.';
}

String vgAnalysisErrorTitle(String errorCode) {
  switch (errorCode) {
    case 'NO_FACE_DETECTED':
      return 'No Face Detected';
    case 'NETWORK_ERROR':
      return 'No Internet Connection';
    case 'DAILY_LIMIT':
      return 'Daily Limit Reached';
    case 'INSUFFICIENT_CREDITS':
      return 'Not Enough Credits';
    case 'NOT_SUBSCRIBED':
      return 'Subscription Required';
    case 'FREE_LIMIT_REACHED':
      return 'Free Scans Used Up';
    case 'REWARD_REQUIRED':
      return 'Ad Not Completed';
    case 'RATE_LIMITED':
      return 'Service Busy';
    case 'ANALYSIS_TIMEOUT':
      return 'Analysis Timed Out';
    case 'CONTENT_POLICY':
      return 'Photo Not Accepted';
    case 'INVALID_IMAGE':
      return 'Invalid Photo';
    default:
      return 'Analysis Failed';
  }
}

String _defaultMessageForCode(String code) {
  switch (code) {
    case 'NO_FACE_DETECTED':
      return 'We couldn\'t detect a face in this photo. Please try again with a clearer photo.';
    case 'CONTENT_POLICY':
      return 'Analysis blocked by content policy. Try a clearer front-facing photo.';
    case 'INVALID_IMAGE':
      return 'Could not process this image. Please use a clearer selfie.';
    case 'RATE_LIMITED':
      return 'Service is busy. Please wait a moment and try again.';
    case 'ANALYSIS_TIMEOUT':
      return 'Analysis took too long. Please try with a clearer photo.';
    case 'DAILY_LIMIT':
      return 'Daily scan limit reached. Try again tomorrow.';
    case 'INSUFFICIENT_CREDITS':
      return VGCopy.creditsInsufficientMessage;
    case 'NOT_SUBSCRIBED':
      return "This analysis isn't included in your free plan.";
    case 'FREE_LIMIT_REACHED':
      return "You've used all your free scans for now.";
    case 'REWARD_REQUIRED':
      return 'Watch an ad to unlock this scan.';
    case 'NETWORK_ERROR':
      return 'Please check your connection and try again.';
    case 'SERVICE_UNAVAILABLE':
      return 'Service temporarily unavailable. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

String _codeFromStatus(int status) {
  switch (status) {
    case 401:
      return 'UNAUTHORIZED';
    case 422:
      return 'NO_FACE_DETECTED';
    case 403:
      return 'NOT_SUBSCRIBED';
    case 429:
      return 'RATE_LIMITED';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    case 504:
      return 'ANALYSIS_TIMEOUT';
    default:
      return 'ANALYSIS_FAILED';
  }
}
