import 'dart:ui';

/// When true: bypass paywall / ads before results. Does not affect the cloud backend.
const bool kVGLocalDevMode = false;

/// When true: use the Cloudflare Worker for auth, storage, scans, and analysis.
const bool kVGUseCloudBackend =
    bool.fromEnvironment('VG_USE_CLOUD_BACKEND', defaultValue: true);

/// When true: use local mock payloads instead of OpenAI Edge Function (offline dev).
const bool kVGUseMockAnalysis =
    bool.fromEnvironment('VG_USE_MOCK_ANALYSIS', defaultValue: false);

/// Portrait photo frames: width : height = 3 : 4 (Flutter [AspectRatio] width/height).
const double vgPortraitAspectRatio = 3 / 4;

Size vgPortraitSizeForWidth(double width) =>
    Size(width, width / vgPortraitAspectRatio);

const String vgAppName = 'Verified Glam - Beauty Scanner';
const String vgTagline = 'Beauty Made Perfect';
const String vgTaglineAlt = 'Pretty in Every Way';
const String vgSupportEmail = 'support@verifiedglam.com';
const String vgGooglePlayUrl =
    'https://play.google.com/store/apps/details?id=com.verifiedglam.beauty_scanner';
const String vgWebProductName = 'Verified Glam - Beauty Scanner';
const String vgWebAuthTagline = 'AI beauty analysis from your selfie';
const String vgMarketingSiteUrl = 'https://scanner.verifiedglam.com';
const String vgAccountDeletionUrl = '$vgMarketingSiteUrl/delete-account';
const String vgParentCompanyUrl = 'https://verifiedglam.com';
const String vgLegalSupportEmail = 'support@verifiedglam.com';
const String vgMarketingAssetsPrefix = 'images/vg/marketing/';

/// Public Polar checkout links (guest checkout — user enters email on Polar).
const String vgPolarCheckoutLinkAnnual = String.fromEnvironment(
  'POLAR_CHECKOUT_LINK_ANNUAL',
  defaultValue:
      'https://buy.polar.sh/polar_cl_dlK0Tq44DzEmuJh3i5AFkQdkfFQd4L8910MJT3YsdT1',
);
const String vgPolarCheckoutLinkProWeekly = String.fromEnvironment(
  'POLAR_CHECKOUT_LINK_PRO_WEEKLY',
  defaultValue:
      'https://buy.polar.sh/polar_cl_xBMQgfvP21DLP6lsJtMqBPCho8XZIg9QQS6D52jTWRv',
);

const String vgWalkthroughCompleteKey = 'vg_walkthrough_complete';
const String vgPostAuthRedirectKey = 'vg_post_auth_redirect';
const String vgOnboardingCompleteKey = 'vg_onboarding_complete';
const String vgOnboardingProfileKey = 'vg_onboarding_profile';
const String vgGuideTipsCacheKey = 'vg_guide_tips_cache';

const String vgSubscriptionIsProKey = 'vg_subscription_is_pro';
const String vgSubscriptionPlanKey = 'vg_subscription_plan';
const String vgSubscriptionFreeScanCountKey = 'vg_subscription_free_scan_count';
const String vgSubscriptionPostOnboardingPaywallShownKey =
    'vg_subscription_post_onboarding_paywall_shown';
const String vgSubscriptionLastDailyPromptKey =
    'vg_subscription_last_daily_prompt';

const String vgReferralCodeKey = 'vg_referral_code';
const String vgReferralDownloadCountKey = 'vg_referral_download_count';
const String vgReferralBonusRedeemedKey = 'vg_referral_bonus_redeemed';
const String vgReferralBonusScansKey = 'vg_referral_bonus_scans';
const String vgUnilinkBaseUrl =
    'https://YOUR-UNILINK-SUBDOMAIN.unilink.io/verifiedglam';
const int vgReferralRewardThreshold = 3;
const int vgReferralBonusScanAmount = 5;

class VGFeatureTypes {
  static const faceBeautyAnalysis = 'FACE_BEAUTY_ANALYSIS';
  static const bestFacePart = 'BEST_FACE_PART';
  static const beautyTips = 'BEAUTY_TIPS';
  static const celebrityLookalike = 'CELEBRITY_LOOKALIKE';
  static const facialSymmetry = 'FACIAL_SYMMETRY';
  static const beautyScoreShowdown = 'BEAUTY_SCORE_SHOWDOWN';
  static const facialResemblance = 'FACIAL_RESEMBLANCE';
  static const faceReading = 'FACE_READING';
  static const goldenRatio = 'GOLDEN_RATIO';
  static const colorAnalysis = 'COLOR_ANALYSIS';
  static const glowUpGuide = 'GLOW_UP_GUIDE';
}
