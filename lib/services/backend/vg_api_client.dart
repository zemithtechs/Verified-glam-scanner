import 'dart:async';
import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import 'vg_backend_config.dart';

/// Thrown for any non-2xx response from the Worker API. Carries the parsed
/// error body when the response was JSON, so callers can branch on
/// `errorCode`.
class VGApiException implements Exception {
  final int statusCode;
  final String message;
  final String? errorCode;
  final Map<String, dynamic>? body;

  VGApiException({
    required this.statusCode,
    required this.message,
    this.errorCode,
    this.body,
  });

  @override
  String toString() => 'VGApiException($statusCode, $errorCode): $message';
}

/// Thin REST client for the Cloudflare Worker backend. Owns the Better
/// Auth bearer session token — persisted via flutter_secure_storage so
/// the app doesn't have to sign back in on every cold start.
class VGApiClient {
  VGApiClient._();

  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'vg_api_bearer_token';
  static const _userIdKey = 'vg_api_user_id';
  static const _userEmailKey = 'vg_api_user_email';

  static String? _token;
  static String? _userId;
  static String? _userEmail;
  static bool _restored = false;

  static final _authStateController = StreamController<void>.broadcast();

  /// Fires whenever sign-in/sign-out state changes. Callers only need to
  /// know "something changed," not a payload shape, so this is a plain
  /// notification stream.
  static Stream<void> get onAuthStateChange => _authStateController.stream;

  static String get baseUrl => VGBackendConfig.url;

  static String? get currentUserId => _userId;

  static String? get currentUserEmail => _userEmail;

  static bool get isSignedIn => _token != null;

  /// Must be called once at startup before any other VGApiClient use —
  /// restores a persisted session, if any, from secure storage.
  static Future<void> restoreSession() async {
    if (_restored) return;
    _restored = true;
    try {
      _token = await _storage.read(key: _tokenKey);
      _userId = await _storage.read(key: _userIdKey);
      _userEmail = await _storage.read(key: _userEmailKey);
    } catch (_) {
      // Secure storage unavailable (e.g. first run without a keychain yet) —
      // treat as signed out rather than crashing startup.
    }
  }

  static Future<void> setSession({
    required String token,
    required String userId,
    String? userEmail,
  }) async {
    _token = token;
    _userId = userId;
    _userEmail = userEmail;
    try {
      await _storage.write(key: _tokenKey, value: token);
      await _storage.write(key: _userIdKey, value: userId);
      if (userEmail != null) {
        await _storage.write(key: _userEmailKey, value: userEmail);
      }
    } catch (_) {}
    _authStateController.add(null);
  }

  static Future<void> clearSession() async {
    _token = null;
    _userId = null;
    _userEmail = null;
    try {
      await _storage.delete(key: _tokenKey);
      await _storage.delete(key: _userIdKey);
      await _storage.delete(key: _userEmailKey);
    } catch (_) {}
    _authStateController.add(null);
  }

  static Map<String, String> _headers({bool json = true}) {
    final headers = <String, String>{};
    if (json) headers['Content-Type'] = 'application/json';
    if (_token != null) headers['Authorization'] = 'Bearer $_token';
    return headers;
  }

  static Uri _uri(String path, [Map<String, dynamic>? query]) {
    final full = '$baseUrl$path';
    if (query == null || query.isEmpty) return Uri.parse(full);
    return Uri.parse(full).replace(
      queryParameters: query.map((k, v) => MapEntry(k, v.toString())),
    );
  }

  static dynamic _decodeOrNull(http.Response res) {
    if (res.body.isEmpty) return null;
    try {
      return jsonDecode(res.body);
    } catch (_) {
      return null;
    }
  }

  static Never _throwForResponse(http.Response res) {
    final decoded = _decodeOrNull(res);
    final map = decoded is Map<String, dynamic> ? decoded : null;
    // Worker routes return {error, errorCode}; Better Auth's own /api/auth/*
    // endpoints return {message, code} instead — read both shapes so a real
    // message (e.g. "Invalid email or password") always surfaces, never a
    // bare "Request failed (401)".
    final message = map?['error']?.toString() ??
        map?['message']?.toString() ??
        'Request failed (${res.statusCode})';
    final errorCode = map?['errorCode']?.toString() ?? map?['code']?.toString();
    throw VGApiException(
      statusCode: res.statusCode,
      message: message,
      errorCode: errorCode,
      body: map,
    );
  }

  /// Response bodies come back as either a JSON object or empty; callers
  /// cast to the shape they expect.
  static Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? query,
  }) async {
    final res = await http.get(_uri(path, query), headers: _headers());
    if (res.statusCode < 200 || res.statusCode >= 300) _throwForResponse(res);
    final decoded = _decodeOrNull(res);
    return decoded is Map<String, dynamic> ? decoded : <String, dynamic>{};
  }

  static Future<Map<String, dynamic>> post(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final res = await http.post(
      _uri(path),
      headers: _headers(),
      body: jsonEncode(body ?? {}),
    );
    if (res.statusCode < 200 || res.statusCode >= 300) _throwForResponse(res);
    final decoded = _decodeOrNull(res);
    return decoded is Map<String, dynamic> ? decoded : <String, dynamic>{};
  }

  static Future<Map<String, dynamic>> put(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final res = await http.put(
      _uri(path),
      headers: _headers(),
      body: jsonEncode(body ?? {}),
    );
    if (res.statusCode < 200 || res.statusCode >= 300) _throwForResponse(res);
    final decoded = _decodeOrNull(res);
    return decoded is Map<String, dynamic> ? decoded : <String, dynamic>{};
  }

  static Future<void> delete(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final res = await http.delete(
      _uri(path),
      headers: _headers(),
      body: body == null ? null : jsonEncode(body),
    );
    if (res.statusCode < 200 || res.statusCode >= 300) _throwForResponse(res);
  }

  /// Raw-bytes upload (scan photos) — server reads the body directly, no
  /// multipart/JSON wrapping, matching the Worker's scans.ts route.
  static Future<Map<String, dynamic>> postBytes(
    String path,
    List<int> bytes, {
    String contentType = 'image/jpeg',
  }) async {
    final res = await http.post(
      _uri(path),
      headers: {..._headers(json: false), 'Content-Type': contentType},
      body: bytes,
    );
    if (res.statusCode < 200 || res.statusCode >= 300) _throwForResponse(res);
    final decoded = _decodeOrNull(res);
    return decoded is Map<String, dynamic> ? decoded : <String, dynamic>{};
  }
}
