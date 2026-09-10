import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

/// Google UMP consent orchestration. No ad request is allowed until the
/// current consent information has been refreshed and canRequestAds() is true.
class VGConsentService {
  VGConsentService._();

  static Future<bool> requestConsentAndCheckAds() async {
    final update = Completer<void>();
    ConsentInformation.instance.requestConsentInfoUpdate(
      ConsentRequestParameters(tagForUnderAgeOfConsent: false),
      () {
        ConsentForm.loadAndShowConsentFormIfRequired((formError) {
          if (formError != null) {
            debugPrint(
                'VGConsentService: consent form error: ${formError.message}');
          }
          if (!update.isCompleted) update.complete();
        });
      },
      (error) {
        debugPrint('VGConsentService: consent update error: ${error.message}');
        if (!update.isCompleted) update.complete();
      },
    );

    await update.future.timeout(
      const Duration(seconds: 15),
      onTimeout: () => debugPrint('VGConsentService: consent update timed out'),
    );
    return _canRequestAds();
  }

  static Future<bool> privacyOptionsRequired() async {
    try {
      final status = await ConsentInformation.instance
          .getPrivacyOptionsRequirementStatus();
      return status == PrivacyOptionsRequirementStatus.required;
    } catch (error) {
      debugPrint('VGConsentService: privacy option status failed: $error');
      return false;
    }
  }

  static Future<bool> showPrivacyOptions() async {
    final dismissed = Completer<void>();
    await ConsentForm.showPrivacyOptionsForm((formError) {
      if (formError != null) {
        debugPrint(
            'VGConsentService: privacy options error: ${formError.message}');
      }
      if (!dismissed.isCompleted) dismissed.complete();
    });
    await dismissed.future;
    return _canRequestAds();
  }

  static Future<bool> _canRequestAds() async {
    try {
      return await ConsentInformation.instance.canRequestAds();
    } catch (error) {
      debugPrint('VGConsentService: canRequestAds failed: $error');
      return false;
    }
  }
}
