import 'vg_constants.dart';

/// Verified Glam user-facing copy — single source of truth.
///
/// Style guide:
/// - Warm, confident, and clear; never shame-based.
/// - Say "analysis" not "scan" in most UI (except the Scan tab name).
/// - Do not reuse competitor app names, slogans, or screenshot phrasing.
/// - Product spec defines structure; wording here must be original.
class VGCopy {
  // Splash & brand
  static const splashTagline = 'Beauty Made Perfect';

  // Walkthrough (photos locked in BMDataGenerator)
  static const walkthrough1Title = 'Pretty Up Now';
  static const walkthrough1Subtitle = 'See your features through a lens built for confidence, not comparison.';
  static const walkthrough2Title = 'Know Your Features';
  static const walkthrough2Subtitle = 'Personal insights powered by thoughtful AI — made for you alone.';
  static const walkthrough3Title = 'Guidance You Can Trust';
  static const walkthrough3Subtitle = 'Expert-informed tips that celebrate what makes you unique.';
  static const walkthroughGetStarted = 'Get Started';
  static const walkthroughSkip = 'SKIP';

  // Home
  static const homeGreeting = 'Pretty in Every Way';
  static const homeSubheading = 'Pick an analysis to begin.';
  static const homeFeaturedTitle = 'Featured for you';
  static const homeAllFeaturesTitle = 'All analyses';
  static const homeShowMore = 'Show more';
  static const homeShowLess = 'Show less';
  static const homeSeeAll = 'See all';
  static const beginAnalysis = 'Begin analysis';

  // Tab labels
  static const tabHome = 'Home';
  static const tabExplore = 'Explore';
  static const tabProfile = 'Profile';

  // Explore
  static const exploreTitle = 'Explore analyses';
  static const exploreSubtitle = 'Ten ways to understand your features — each with clear, actionable takeaways.';

  // Feature card descriptions (catalog)
  static const featureDescGlowUpGuide = 'A personalized beauty challenge based on your latest scan.';
  static const featureDescBeautyTips =
      'Portrait skin check with labeled concerns and natural, creator-style beauty ideas — not medical advice.';
  static const featureDescCelebrity = 'Playful look-alike matches based on your features.';
  static const featureDescFacialSymmetry = 'Balance insights with gentle framing tips.';
  static const featureDescShowdown =
      'Join the community challenge — see your rank and top performers.';
  static const featureDescResemblance =
      'Compare two faces in one shared photo — perfect for couples, friends, or siblings.';
  static const featureDescAttractiveness =
      'Instant AI face rating across beauty, symmetry, skin quality, and personality signals.';

  // Guide tab
  static const guideTitle = 'Your beauty guide';
  static const guideSubtitle = 'Tips and routines shaped by your profile.';
  static const guidePersonalizedSection = 'Based on your profile';
  static const guideDailyTips = 'Daily tips';
  static const guideRoutineChallenge = 'Beauty routine challenge';
  static const guideOpenRoutine = 'View full routine';
  static const guideNoActiveChallenge = 'No active challenge yet. Start an analysis to get a personalized routine.';
  static const guideStartChallenge = 'Start challenge';
  static const guideLockedUntil = 'Next day unlocks in';
  static const guideDoneToday = 'Completed for today. Come back tomorrow.';
  static const guideMarkDone = 'Mark as done';
  static const guideCompleted = 'Completed';
  static const guideChallengeDisclaimer =
      "All tips in this challenge are inspired by natural beauty habits shared by everyday creators and users in the beauty community. Everyone's skin is different. Results may vary. Always do a patch test before trying new ingredients. This app is not a medical or dermatological service.";
  static const guideDonePanelTitle = 'Day complete!';
  static const guideDonePanelBody = 'Great job! Your skin is already responding. Come back tomorrow for your next challenge.';
  static const guideShareProgress = 'Share My Progress';
  static const challengeBackToDashboard = 'Back to Dashboard';
  static const challengeShareCardTitle = 'Verified Glam';
  static const challengeShareTagline = "I'm on my skin journey — are you?";
  static const challengeReminderTimeLabel = 'Daily reminder time';
  static const challengeReminderTimeSaved = 'Reminder time saved';

  static String guideDonePanelTitleForDay(int day) => 'Amazing! You completed Day $day 🌿';

  static String guideDonePanelBodyForNextDay(int nextDay) =>
      'Come back tomorrow for Day $nextDay. Your skin is already responding.';

  static String challengeUnlockCountdownLabel(int nextDay) => 'Day $nextDay unlocks in';

  static String challengeShareDayLine(int completedDay, int durationDays) =>
      'Day $completedDay of $durationDays complete ✅';

  static String challengeShareMessage({
    required String challengeName,
    required int completedDay,
    required int durationDays,
  }) =>
      '${challengeShareDayLine(completedDay, durationDays)}\n'
      '$challengeName\n'
      '$challengeShareTagline\n'
      '— $vgAppName';
  static const guideBackDashboard = 'Back to Dashboard';
  static const guideRescanPrompt = 'Challenge complete! Want to see how your skin has changed? Scan your face now.';
  static const guideRescanCta = 'Re-scan your face';
  static const guideNextChallengeCta = 'Start next challenge';

  // Beauty Routine Challenge — 4-screen flow
  static const challengeSkinAnalysisTitle = 'Skin Analysis';
  static const challengeAiPoweredBadge = 'AI Powered';
  static const challengeAnalysisComplete = 'Analysis complete';
  static const challengeWhatWeFound = 'What we found';
  static const challengeViewMyChallenge = 'Start My Challenge';
  static const challengeNotNow = 'Not Now';
  static const challengePickIssueTitle = 'Which would you like to work on first?';
  static const challengePickIssueBody =
      'We detected two things on your skin. Pick the focus for your personalised challenge.';
  static const challengeCtaBody =
      'Based on what we found, we put together a daily routine many people in the beauty community swear by. Takes about 10–20 minutes a day.';
  static const challengeMainFocusLabel = 'Main focus';
  static const challengeSupportHabitLabel = 'Supporting habit';
  static const challengeWhyHelpsLabel = 'Why this helps';
  static const challengeDayOfLabel = 'Day';
  static const challengeProgressLabel = 'Progress';
  static const challengeStreakTitle = 'day streak';
  static const challengeStreakSubtitle = 'Keep showing up — consistency is the glow-up.';
  static String challengeBestStreakLabel(int best) => 'Best streak: $best days';
  static const challengeRewardTitle = 'You did it!';
  static const challengeRewardSubtitle =
      'You showed up for your skin every day. That consistency is what real glow is made of.';
  static const challengeBadgesTitle = 'Your badges';
  static const challengeBackToOverview = 'Back to challenge';
  static const challengeAssigning = 'Building your challenge…';
  static const challengeResultsDone = 'Back to Home';
  static const challengeLegacyRescanPrompt =
      'This scan used an older format. Run a fresh Beauty Routine Challenge scan to see labelled skin issues and get your personalised routine.';
  static const challengeNoIssuesDetected =
      'We could not map specific spots on this photo. Try a well-lit front-facing selfie.';
  static const challengeDayReadyNow = 'Your next day is ready now';
  static const challengeNextDayUnlockTitle = 'Next day unlocks in';
  static const challengeNextDayUnlockHint =
      'Take this time to rest your skin. We will remind you when Day unlocks.';

  static String challengeScanSummary(int issueCount) =>
      issueCount == 1 ? '1 concern detected on your face' : '$issueCount concerns detected on your face';

  static String challengeCtaHeadline(int days, String challengeName) =>
      'Your personalised $days-day challenge is ready!';

  static String challengeDayHeroTitle(int day, int total) => 'Day $day of $total';

  static String challengeEstMinutes(int minutes) => '~$minutes min';

  static String challengeDayProgress(int current, int total) => 'Day $current of $total';

  // Auth & welcome
  static const welcomeTitle = 'You are ready';
  static const welcomeSubtitle = 'Your profile is set. Head to Home and try your first analysis whenever you like.';
  static const welcomeCta = 'Open Home';
  static const registerTermsPrefix = 'By creating an account with Verified Glam, you agree to our';
  static const notificationsTitle = 'Helpful updates';
  static const notificationsBody = 'Optional alerts for new analyses, tips, and product suggestions tuned to you.';
  static const notificationsCta = 'Turn on notifications';
  static const notificationsSkip = 'Not now';
  static const locationTitle = 'Location is optional';
  static const locationBody = 'Verified Glam works fully without location access. You can enable it later if we add local tips.';

  // Rating (onboarding)
  static const ratingTitle = 'Enjoying Verified Glam?';
  static const ratingSubtitle = 'A quick store rating helps other people discover thoughtful beauty tools.';
  static const ratingCta = 'Rate on the store';
  static const ratingSkip = 'Skip for now';

  // Onboarding step titles
  static const onboardingAgeTitle = 'How old are you?';
  static const onboardingAgeSubtitle = 'We use age only to tailor product and routine suggestions.';
  static const onboardingGenderTitle = 'How do you identify?';
  static const onboardingGenderSubtitle = 'Some guidance differs by gender presentation — pick what fits you.';
  static const onboardingGoalsTitle = 'What matters most to you?';
  static const onboardingGoalsSubtitle = 'Choose every goal that resonates. We will prioritize these in your results.';
  static const onboardingConcernsTitle = 'Any skin priorities?';
  static const onboardingConcernsSubtitle = 'Select topics you want us to keep in mind.';
  static const onboardingProductsTitle = 'Shopping style';
  static const onboardingProductsSubtitle = 'Tell us how you usually build your routine.';
  static const onboardingSkinTypeTitle = 'Skin type today';
  static const onboardingSkinTypeSubtitle = 'Pick the option that best matches how your skin feels now.';
  static const onboardingEthnicityTitle = 'Background';
  static const onboardingEthnicitySubtitle = 'Helps color matching and product suggestions feel relevant.';
  static const onboardingAestheticTitle = 'Style direction';
  static const onboardingAestheticSubtitle = 'Choose a vibe for your personalized beauty plan.';
  static const onboardingSummaryTitle = 'Profile complete';
  static const onboardingSummarySubtitle = 'We will use these answers across every analysis.';
  static const continueLabel = 'Continue';
  static const finishLabel = 'Complete setup';

  // Onboarding options
  static const genders = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
  static const beautyGoals = [
    'Products that actually suit me',
    'A week-by-week beauty routine',
    'My best color palette',
    'Balance and proportion insights',
    'Trend-aware looks I can trust',
    'Something else',
  ];
  static const skinConcerns = [
    'Breakouts',
    'Dry patches',
    'Extra shine',
    'Dark spots',
    'Fine lines',
    'Redness',
    'Uneven texture',
    'None for now',
  ];
  static const productPrefs = [
    'Keep it minimal',
    'Budget-friendly picks',
    'Premium formulas',
    'Clean ingredients',
    'Makeup-forward',
    'Skincare-first',
  ];
  static const skinTypes = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];
  static const ethnicities = [
    'East Asian',
    'South Asian',
    'Black / African',
    'Latino / Hispanic',
    'Middle Eastern',
    'White / European',
    'Mixed / Multiracial',
    'Prefer not to say',
  ];

  // Profile dashboard
  static const profileDashboardSubtitle = 'Your beauty journey at a glance.';
  static const profileDashboardSubtitleSaaS =
      'Badges, credits, and subscription at a glance.';
  static const profileMenuProfileBadges = 'Profile & badges';
  static const profileMenuTerms = 'Terms of service';
  static const creditsMetricBalance = 'Credits balance';
  static const creditsMetricPlan = 'Plan';
  static const creditsMetricAnalysesLeft = 'Analyses left';
  static const creditsSubscribeToReceiveCredits = 'Subscribe to receive credits';
  static const creditsFreePlanKpiHint = 'Subscribe for AI credits';
  static const profileFeaturedAchievement = 'Latest achievement';
  static const profileNoAchievementYet = 'Complete a challenge to earn your first badge.';
  static const profileActiveChallenge = 'Active challenge';
  static const profileContinueChallenge = 'Continue today\'s task';
  static const profileViewRoutine = 'View full routine';
  static const profileQuickActions = 'Quick actions';
  static const profileActionExplore = 'Explore';
  static const profileActionHistory = 'History';
  static const profileActionShare = 'Share app';
  static const profileActionPro = 'Go Pro';
  static const profileAccountSection = 'Account';
  static const profileLogOut = 'Log out';
  static const profileLogOutConfirmTitle = 'Log out?';
  static const profileLogOutConfirmMessage = 'You can log back in anytime with the same email and password.';
  static const profileHistoryTitle = 'Scan history';
  static const profileHistoryEmpty = 'Your past scans will show up here once you run an analysis.';

  static String profileChallengeProgress(int completed, int total) =>
      'Day $completed of $total complete';

  static String profileBadgeEarnedOn(String date) => 'Earned $date';

  // Settings & profile
  static const settingsProfile = 'Account settings';
  static const settingsShare = 'Share Verified Glam';
  static const settingsInvite = 'Send an invite';
  static const settingsSupport = 'Get support';
  static const settingsPrivacy = 'Privacy policy';
  static const profileTitle = 'Profile & account';
  static const profileTheme = 'App theme';
  static const profileSubscription = 'Subscription';
  static const profileSubscriptionFree = 'Free plan';
  static const profileSubscriptionPro = 'Verified Glam Pro';
  static const profileAccountStatusFree = 'Free Member';
  static const profileAccountStatusPro = 'Pro Member';
  static const profileAccountStatusFreeHint = 'Tap to see pricing and go Pro';
  static const profileSubscriptionUpgradeHint =
      'Subscribe for AI credits — Yearly \$39.99/year (200 credits) or Pro \$3.99/week (30 credits weekly).';
  static const profileLegal = 'Legal';

  // Paywall — Yearly + Pro weekly (credit-based, no free trial)
  static const paywallTitle = 'Get Premium';
  static const paywallSubtitle = 'Unlock all features';
  static const paywallLimitedOffer = 'Limited-time offer';
  static const paywallDiscountBadge = 'Save 50% today';
  static const paywallExpiresIn = 'Offer ends in';
  static const paywallYearlyColumn = 'Yearly';
  static const paywallProColumn = 'Pro Weekly';
  static const paywallBestPrice = 'Best Value';

  static const paywallYearlyPlanName = 'Yearly Plan';
  static const paywallYearlyPrice = '\$39.99';
  static const paywallYearlyPeriod = '/year';
  static const paywallYearlyWasPrice = '\$80.99/year';
  static const paywallYearlySubtitle = 'Billed once per year · Cancel anytime';

  static const paywallProPlanName = 'Pro Plan';
  static const paywallProWeeklyPrice = '\$3.99';
  static const paywallProWeeklyPeriod = '/week';
  static const paywallProSubtitle = 'Billed weekly · Cancel anytime';

  static const paywallPlanIdAnnual = 'annual';
  static const paywallPlanIdProWeekly = 'pro_weekly';

  static const paywallSharedFeatures = [
    'Full access to all 10 AI Beauty Analyses',
    'Ad-free experience',
    'Instant result downloads',
    'Priority access to new AI features',
    'Secure cloud synchronization across devices',
  ];

  static const paywallYearlyFeatures = [
    '200 AI Credits per year',
    'Each AI generation costs 5 credits',
    'Up to 40 AI generations per year',
    'Credits remain available throughout your annual subscription',
  ];

  static const paywallProFeatures = [
    '30 AI Credits every week',
    'Credits automatically refresh every billing cycle',
    'Each AI generation costs 5 credits',
    'Up to 6 AI generations every week',
  ];

  static const paywallYearlyCreditBreakdown = [
    '200 credits per year',
    '5 credits per generation',
    '40 total generations per year',
    'Effective cost: \$0.20 per credit',
  ];

  static const paywallProCreditBreakdown = [
    '30 credits every week',
    '5 credits per generation',
    '6 generations every week',
    'Effective cost: \$0.133 per credit',
  ];

  static const paywallPlanFeatures = paywallSharedFeatures;

  static const paywallGetPremium = 'Get Premium';
  static const paywallSubscribeNow = 'Subscribe now';
  static const paywallCancelAnytime = 'Cancel anytime';
  static const paywallRestore = 'Restore purchases';
  static const paywallTermsPrefix = 'See';
  static const paywallTerms = 'Terms';
  static const paywallPrivacy = 'Privacy';
  static const paywallRestoreSuccess = 'Purchases restored.';
  static const paywallRestoreEmpty = 'No previous purchases found.';
  static const paywallCheckoutError = 'Could not start checkout. Try again.';
  static const paywallCheckoutOpening = 'Opening secure checkout…';
  static const profileManageSubscription = 'Manage subscription';
  static const checkoutSuccessToast = 'Welcome to Pro! Your credits are ready.';
  static const checkoutPendingToast =
      'Payment processing — your credits will appear shortly. Refresh if needed.';
  static const checkoutCancelledToast = 'Checkout cancelled. Choose a plan when you are ready.';
  static const creditsMyCreditsTitle = 'My Credits';
  static const creditsBuyCredits = 'Buy credits';
  static const creditsUsageDetailsTitle = 'Credit usage details';
  static const creditsViewEarned = 'Earned';
  static const creditsViewUsed = 'Used';
  static const creditsProgressLabel = 'Credits';
  static String creditsProgress(int balance, int allocated) => '$balance / $allocated Credits';
  static String creditsBalanceTitle(int balance) => 'Credits: $balance';
  static const creditsFreePlanHint = 'Free plan includes 0 credits. Subscribe to receive AI credits.';
  static const creditsHistoryEmptyFree = 'Subscribe to receive credits and see your usage history here.';
  static const creditsHistoryEmpty = 'No credit activity in this date range.';
  static const creditsRenewsOn = 'Renews';
  static String creditsPlanStatus(String status) => status.replaceAll('_', ' ');
  static const paywallPromoTitle = 'Special offer for you';
  static const paywallPromoSubtitle = 'Before you go — here is a flash discount just for you.';
  static const paywallPromoFlashYearlyPrice = '\$33.00';
  static const paywallPromoFlashYearlyPeriod = '/year';
  // One shared code, valid on both the Annual and Pro Weekly products in
  // Polar — a fixed dollar amount doesn't scale sensibly across a $33/year
  // and a $3.99/week price, so this is a percentage discount instead.
  static const paywallPromoCouponCode = 'GLOW15';
  static const paywallPromoCouponHint = 'Use this code at checkout for an extra 15% off';
  static const paywallPromoCodeCopied = 'Code copied — paste it at checkout';
  static const paywallPromoChooseYearly = 'Get Yearly — \$33/year';
  static const paywallPromoChooseWeekly = 'Get Weekly — \$3.99/week';

  static const paywallSubscriptionTerms =
      'Subscription Terms: Yearly plan is \$39.99 per year and renews automatically unless cancelled. Pro plan is \$3.99 per week and renews automatically unless cancelled. Credits renew each billing period.';
  static const paywallCancellationTerms =
      'Cancellation Terms: Cancel anytime in account settings to stop future renewals. Access and remaining credits continue until the end of your current billing period.';

  static const creditsHowTitle = 'How Credits Work';
  static const creditsHowIntro = 'Every AI analysis uses 5 credits.';
  static const creditsHowExamples = [
    'Face Beauty Analysis = 5 credits',
    'Golden Ratio Analysis = 5 credits',
    'Celebrity Look-Alike = 5 credits',
    'Seasonal Color Palette = 5 credits',
    'Face Comparison = 5 credits',
  ];
  static const creditsHowDeduction =
      'Each time you create a new AI result, 5 credits are deducted from your balance.';
  static const creditsHowRenewal =
      'Your credits automatically renew based on your subscription: Yearly Plan — 200 credits every year. Pro Weekly — 30 credits every week.';

  static const creditsInsufficientMessage =
      'You need 5 credits for this analysis. Credits renew with your subscription plan.';
  static const creditsRemainingLabel = 'AI credits remaining';
  static String profileCreditsRemaining(int balance) => '$balance $creditsRemainingLabel';
  static const scanErrorViewPlans = 'View plans';

  // Pricing page (SEO)
  static const pricingMetaTitle = 'Verified Glam Scanner Pricing — Credits & Plans';
  static const pricingMetaDescription =
      'Verified Glam Scanner Pro: Yearly \$39.99/year (200 AI credits) or Pro \$3.99/week (30 credits weekly). 5 credits per AI generation. Ad-free.';
  static const pricingHeroTitle = 'Choose the Right Plan';
  static const pricingHeroSubtitle =
      'Unlock all AI Beauty analyses with a flexible subscription that fits your needs. Every subscription includes full access to all AI beauty tools, ad-free results, and downloadable reports. Credits are used whenever you generate a new AI analysis.';
  static const pricingCompareTitle = 'Compare Plans';
  static const pricingCompareSubtitle = 'Everything included with Yearly and Pro subscriptions.';
  static const pricingFaqTitle = 'Pricing FAQ';
  static const pricingSignUpCta = 'Sign up';
  static const pricingWhatsIncluded = "What's Included";
  static const pricingCreditBreakdown = 'Credit Breakdown';

  // Web mega menu
  static const webNavAiTools = 'AI Tools';
  static const webNavPricing = 'Pricing';
  static const webNavAbout = 'About';
  static const webNavPlayStore = 'Get on Google Play';
  static const webMegaMenuFeaturedTitle = 'AI Beauty Analysis';
  static const webMegaMenuFeaturedBody =
      'Upload a photo and get personalized face analysis, symmetry insights, and actionable beauty tips — all in your browser.';
  static const webMegaMenuStartCta = 'Start analysis';
  static const webMegaMenuExploreAll = 'Explore all tools';
  static const webMegaMenuColFace = 'Face analysis';
  static const webMegaMenuColStyle = 'Style & match';
  static const webMegaMenuColPrograms = 'Programs & fun';

  static const pricingFaqItems = [
    (
      'What plans do you offer?',
      'Verified Glam Scanner Pro is available as a Yearly plan (\$39.99/year, 200 credits) or a Pro weekly plan (\$3.99/week, 30 credits refreshed weekly).',
    ),
    (
      'How do credits work?',
      'Each new AI analysis costs 5 credits. Yearly subscribers get 200 credits per year (up to 40 generations). Pro Weekly subscribers get 30 credits per week (up to 6 generations).',
    ),
    (
      'What is the Yearly plan?',
      'Pay \$39.99 once per year for full Pro access, 200 AI credits, no ads, and every premium feature.',
    ),
    (
      'Can I cancel anytime?',
      'Yes. Cancel in account settings anytime. Your access continues until the end of your current billing period.',
    ),
  ];

  // Subscription success
  static const subscriptionSuccessTitle = 'Welcome to Pro';
  static const subscriptionSuccessSubtitle = 'You now have full access to every analysis and an ad-free experience.';
  static const subscriptionSuccessBenefit1 = 'All eleven analyses unlocked';
  static const subscriptionSuccessBenefit2 = 'No ads between results';
  static const subscriptionSuccessBenefit3 = 'Priority updates and new features';
  static const subscriptionSuccessCta = 'Start exploring';

  // Photo guidelines
  static const guidelinesTitle = 'Photo tips';
  static const guidelinesDosTitle = 'Do';
  static const guidelinesDontsTitle = 'Avoid';
  static const guidelinesDos = [
    'Face the camera directly',
    'Use even, natural light',
    'Keep hair away from your face',
  ];
  static const guidelinesDonts = [
    'Filters or heavy editing',
    'Hats, sunglasses, or masks',
    'Shadows covering your features',
  ];
  static const guidelinesDosTwoFaces = [
    'One photo with exactly two people — twins or a couple together',
    'Both faces close together, sharp, and clearly visible',
    'Bright, even lighting on both faces',
  ];
  static const guidelinesDontsTwoFaces = [
    'Solo selfies or photos with only one person',
    'Dark photos or heavy shadows hiding facial features',
    'Face masks, blur, or anything covering the face',
  ];
  static const guidelinesContinue = 'Continue';
  static const guidelinesGoodExamplesTitle = 'Good examples';
  static const guidelinesBadExamplesTitle = 'Avoid these';

  // Photo upload
  static const uploadTitle = 'Add your photo';
  static const uploadSubtitle = 'Use a clear, recent photo of your face.';
  static const uploadSubtitleTwoFaces =
      'Upload one photo with exactly two people — twins or a couple in the same shot.';
  static const uploadTwoFacesRequired = 'We need exactly two faces in this photo. Try a closer two-person selfie.';
  static const uploadTooManyFaces = 'Too many faces detected. Use a photo with only two people.';
  static const uploadNoFaceDetected =
      'We couldn\'t detect a face. Use a clear front-facing selfie looking at the camera.';

  static const scanErrorTryAgain = 'Try Again';
  static const scanErrorCancel = 'Cancel';
  static const scanOfflineTitle = 'No Internet Connection';
  static const scanOfflineMessage = 'Please check your connection and try again.';
  static const scanImageTooLarge = 'Photo is too large (max 5 MB). Choose a smaller image or retake your photo.';
  static const uploadFaceCountOk = 'Two faces detected — ready to compare.';
  static const uploadPrivacy = 'Your photo stays private and is never shared without your permission.';
  static const webFaceComparisonHint =
      'Use a photo with two clear faces in the same shot — no cropping needed on web.';
  static const uploadAction = 'Take or choose a photo';
  static const uploadCamera = 'Take a photo';
  static const uploadGallery = 'Choose from gallery';

  // Photo crop
  static const cropTitle = 'Crop your photo';
  static const cropSubtitle = 'Frame your face in the portrait area, then tap Apply.';
  static const cropApply = 'Apply';
  static const cropChooseAnother = 'Choose another photo';

  // Camera capture
  static const cameraScanning = 'Scanning…';
  static const cameraFaceDetected = 'Face detected';
  static const cameraAlignFace = 'Center your face in the frame';
  static const cameraPerfectCapture = 'Perfect shot — continue when ready';
  static const cameraCapture = 'Capture';

  // Processing
  static const processingTitle = 'Verified Glam';
  static const processingSubtitle = 'Reviewing your photo…';
  static const rewardAdPromptTitle = 'Unlock your result';
  static const rewardAdPromptSubtitle = 'Watch a short ad to reveal your free Face Beauty Analysis.';
  static const rewardAdWatchButton = 'Watch ad & reveal';
  static const rewardAdLoading = 'Loading ad…';
  static const rewardAdNotEarned = "Watch the full ad to unlock your result — you weren't charged for this attempt.";
  static const processingDisclaimer = 'This may take a moment.';

  // Results common
  static const resultsDone = 'Done';
  static const resultsDownload = 'Download result';
  static const resultsDownloadHint =
      'Download saves your photo with analysis overlays — lines, labels, and scores on your face.';
  static const resultsDownloadSuccess = 'Labeled result download started';
  static const resultsDownloadFailed =
      'Could not download — wait for the photo to finish loading, then try again.';
  static const resultsShare = 'Share result';
  static const resultYourPhoto = 'Your photo';
  static const resultTopMatches = 'Top matches';
  static const resultCelebrityMatches = 'Celebrity matches';
  static const resultCelebrityMatchBadge = 'Celebrity Match';
  static const resultCelebrityNoMatches =
      'We couldn\'t find celebrity matches for this photo. Try again with clearer front-facing lighting.';
  static const devMockAnalysisBanner =
      'Dev: mock analysis — results are demo data. Run via scripts/run-dev.ps1 signed in for live AI.';
  static const resultMatchFeaturesLabel = 'Features:';
  static const resultOverallSymmetry = 'Overall symmetry';
  static const resultOverallSymmetryRating = 'Overall symmetry rating';
  static const resultBalanceInsight = 'Balance insight';
  static const resultSuggestedExercises = 'Suggested balance exercises';
  static const resultSymmetryAttractivenessLabel = 'Symmetry score';
  static const resultOverallScore = 'Overall score';
  static const resultFeatureScores = 'Feature scores';
  static const resultCompliments = 'Compliments';
  static const resultFaceShape = 'Face shape';
  static const resultSkinTone = 'Skin tone';
  static const resultSeason = 'Season';
  static const resultYourPalette = 'Your palette';
  static const resultUseSparingly = 'Use sparingly';
  static const resultHarmony = 'Harmony';
  static const resultAttractiveness = 'Attractiveness';
  static const resultPotential = 'Potential';
  static const resultInsight = 'Insight';
  static const resultYourScore = 'Your score';
  static const resultCommunityAverage = 'Community average';
  static const resultRank = 'Rank';
  static const resultSimilarity = 'Similarity';
  static const resultSecondPhoto = 'Second photo';
  static const resultSecondPhotoSoon = 'Coming soon';
  static const resultTipsForYou = 'Tips for you';
  static const resultPass = 'PASS';
  static const resultNote = 'NOTE';

  // Face beauty analysis result
  static const resultBeautyReportTitle = 'Your beauty profile';
  static const resultBeautyBreakdownTitle = 'Score breakdown';
  static const resultBeautyScoreLabel = 'Beauty score';
  static const subscoreSymmetry = 'Symmetry';
  static const subscoreFeatureBalance = 'Feature balance';
  static const subscoreSkinQuality = 'Skin quality';
  static const subscoreYouthfulCues = 'Youthful cues';
  static const subscoreOverallBeauty = 'Overall beauty';
  static const subscoreBeauty = 'Beauty';
  static const subscoreCuteness = 'Cuteness';
  static const subscoreSkinSmoothness = 'Skin smoothness';
  static const subscoreHandsomeness = 'Handsomeness';
  static const subscoreFacialSymmetry = 'Facial symmetry';
  static const subscoreFaceShape = 'Face shape';
  static const subscoreFunFactor = 'Fun factor';
  static const subscoreIntelligence = 'Intelligence';
  static const subscoreConfidence = 'Confidence';
  static const subscoreCredibility = 'Credibility';
  static const resultBeautyDisclaimer =
      'This result is an AI estimation based on a single photo and does not represent any scientific or medical judgment.';

  // Virtual makeup (seasonal color palette)
  static const colorTryMakeup = 'Try virtual makeup';
  static const makeupStudioTitle = 'Virtual makeup';
  static const makeupZoneLips = 'Lips';
  static const makeupZoneEyes = 'Eyes';
  static const makeupZoneBlush = 'Blush';
  static const makeupIntensity = 'Intensity';
  static const makeupClearColor = 'Clear makeup color';
  static const makeupReset = 'Reset look';

  static const proFeatureMessage = 'This analysis is part of Verified Glam Pro — coming soon.';

  // Guide tips (mock)
  static const guideTip1 = 'Hydrate before makeup for smoother blending.';
  static const guideTip2 = 'Match foundation to your neck, not just your face.';
  static const guideTip3 = 'SPF every morning protects every other step.';

  static String guideDayOf(int day, int total) => 'Day $day of $total';

  static String guideCompletionToast(int day) =>
      'Amazing! Day $day completed. Your next task unlocks in 24 hours.';

  static const resultContourComparison = 'Contour comparison';
  static const resultFaceComparisonExplanation = 'Explanation';

  // Beauty Score Showdown
  static const showdownTitle = 'Beauty Score Showdown';
  static const showdownBeautyScore = 'Beauty Score';
  static const showdownYourRank = 'Your rank';
  static const showdownEngagementTitle = 'Participation';

  static String showdownOfParticipants(int total) => 'of $total participants';

  static String showdownVsCommunity(double yours, double average) =>
      'Your score ${yours.toStringAsFixed(2)}/10 · Community avg ${average.toStringAsFixed(1)}/10';

  static String showdownShareMessage({
    required double yourScore,
    required int rankPosition,
    required int totalParticipants,
    required String referralLink,
  }) {
    return 'I scored ${yourScore.toStringAsFixed(2)}/10 and ranked #$rankPosition of $totalParticipants '
        'in the Beauty Score Showdown on Verified Glam! Join with my link: $referralLink';
  }

  // Attractiveness Test result
  static const attractivenessTitle = 'Attractiveness Test';
  static const attractivenessScoreLabel = 'Attractiveness Score';
  static const attractivenessSubtitle =
      'Based on facial symmetry, proportions, and feature harmony';
  static const attractivenessAppearanceSection = 'Face analysis';
  static const attractivenessTraitsSection = 'Personality signals';
  static const attractivenessDisclaimer =
      'This result is an AI estimation based on a single photo and does not represent any scientific or medical judgment.';

  static String attractivenessFacialAge(int age) => 'Facial Age: $age';

  static String attractivenessTierFor(double score) {
    if (score >= 9.0) return 'Exceptionally charming';
    if (score >= 8.5) return 'Very Attractive';
    if (score >= 8.0) return 'Attractive';
    if (score >= 7.0) return 'Above average';
    return 'Developing potential';
  }

  static String beautyHarmonyTierFor(int percent) {
    if (percent >= 85) return 'Stunning harmony';
    if (percent >= 70) return 'Beautiful balance';
    if (percent >= 55) return 'Natural charm';
    return 'Unique features';
  }

  static String symmetryTierFor(int percent) {
    if (percent >= 85) return 'Exceptional balance';
    if (percent >= 70) return 'Well balanced';
    if (percent >= 55) return 'Naturally balanced';
    return 'Distinct character';
  }

  static String attractivenessShareMessage({
    required double overallScore,
    required String tierLabel,
    required String referralLink,
  }) {
    final display = overallScore == overallScore.roundToDouble()
        ? overallScore.toStringAsFixed(1)
        : overallScore.toStringAsFixed(2);
    return 'I scored $display/10 on the Attractiveness Test ($tierLabel) on Verified Glam! '
        'Try it with my link: $referralLink';
  }

  // Beauty Tips result
  static const beautyTipsTitle = 'Your skin check';
  static const beautyTipsSummaryTitle = 'What we noticed';
  static const beautyTipsSeverityHigh = 'High';
  static const beautyTipsSeverityMedium = 'Medium';
  static const beautyTipsSeverityLow = 'Low';
  static const beautyTipsTipDisclaimer =
      'These are natural beauty tips shared by everyday users and content creators. '
      "Everyone's skin is different, so what works for one person may not work for another. "
      'Always do a small patch test before trying anything new on your face.';
  static const beautyTipsNotMedicalNotice = 'Not medical advice';
  static const beautyTipsGlobalDisclaimer =
      'Verified Glam does not provide medical diagnosis or treatment. '
      'Tips reflect community experiences only. Consult a licensed professional for skin conditions, '
      'allergies, or persistent concerns. Patch-test new products and discontinue use if irritation occurs.';

  static String beautyTipsSummary(int spotCount, List<String> sampleLabels) {
    final sample = sampleLabels.take(4).join(', ');
    final detail = sample.isEmpty ? '' : ' ($sample)';
    return 'We noted $spotCount areas on your portrait$detail. '
        'Below are natural beauty ideas other creators share — not medical advice.';
  }

  static String beautyTipsAreasLabel(int spotCount) => '$spotCount areas';

  static String beautyTipsShareMessage({
    required int spotCount,
    required String labelsSummary,
    required String referralLink,
  }) {
    return 'My Beauty Tips scan labeled $spotCount spots on my face ($labelsSummary) on Verified Glam — '
        'natural ideas from creators, not medical advice. Try it: $referralLink';
  }

  // Golden Ratio result
  static const featureDescGoldenRatio =
      'Instant facial proportion analysis with real ratios, phi deltas, and pass/fail indicators.';
  static const goldenRatioReportTitle = 'Golden Ratio Face Report';
  static const goldenRatioFailLabel = 'FAIL';
  static const goldenRatioDisclaimer =
      'Pure proportion data from your photo — no beautification, reshaping, or identity changes.';

  static String goldenRatioPhiExplanation(double phi) =>
      'Measures how closely your features align with the golden ratio ($phi).';

  static String goldenRatioIndexLabel(int index) => 'Golden Ratio Index: $index / 100';

  static String goldenRatioTotalScore(int index) =>
      'Total Score: $index / 100 (Weighted Average)';

  static String goldenRatioMetricScore(int score) => 'Score: $score / 20';

  static String goldenRatioDeltaLabel(double delta) {
    final sign = delta >= 0 ? '+' : '';
    return '(Δ $sign${delta.toStringAsFixed(3)})';
  }

  static String goldenRatioOverallBar(double score, String rating) {
    final display = score == score.roundToDouble()
        ? score.toStringAsFixed(1)
        : score.toStringAsFixed(2);
    return 'Overall Score: $display / 10 ($rating)';
  }

  static String goldenRatioOverallScoreHeader(double score, String rating) {
    final display = score == score.roundToDouble()
        ? score.toStringAsFixed(1)
        : score.toStringAsFixed(2);
    return 'Overall Score: $display / 10 ($rating)';
  }

  static String goldenRatioShortName(String id) {
    switch (id) {
      case 'faceLengthWidth':
        return 'Face L/W';
      case 'eyeDistanceFaceWidth':
        return 'Eye Dist/W';
      case 'noseWidthFaceWidth':
        return 'Nose W/W';
      case 'mouthWidthNoseWidth':
        return 'Mouth/Nose';
      case 'eyeWidthEyeDistance':
        return 'Eye W/Dist';
      case 'philtrumNose':
        return 'Philtrum/Nose';
      default:
        return 'Ratio';
    }
  }

  static String goldenRatioRatingFor(int index) {
    if (index >= 80) return 'Excellent';
    if (index >= 60) return 'Good';
    if (index >= 40) return 'Fair';
    return 'Poor';
  }

  static String goldenRatioShareMessage({
    required double overallScore,
    required int goldenRatioIndex,
    required String ratingLabel,
    required String referralLink,
  }) {
    final display = overallScore == overallScore.roundToDouble()
        ? overallScore.toStringAsFixed(1)
        : overallScore.toStringAsFixed(2);
    return 'My Golden Ratio score is $display/10 (Index $goldenRatioIndex/100 — $ratingLabel) '
        'on Verified Glam! Check yours: $referralLink';
  }

  static String scoreLabelForRelationship(String hint) {
    switch (hint.toLowerCase()) {
      case 'couple':
        return 'Couple Similarity Score';
      case 'friend':
        return 'Friend Similarity Score';
      case 'sibling':
      default:
        return 'Sibling Similarity Score';
    }
  }

  static String genericShareMessage({
    required String featureTitle,
    required String highlight,
    required String referralLink,
  }) {
    return 'I just tried $featureTitle on Verified Glam — $highlight '
        'Download the app with my referral link: $referralLink';
  }

  static String faceComparisonShareMessage({
    required String scoreLabel,
    required int similarity,
    required String referralLink,
  }) {
    return 'We scored $scoreLabel: $similarity/100 on Verified Glam! '
        'Take a two-person selfie and compare your faces — download with my link: $referralLink';
  }

  // Celebrity lookalike + referral share
  static const shareReferralRewardTitle = 'Share & earn bonus scans';
  static const shareReferralRedeem = 'Redeem reward';
  static const shareReferralRedeemedSuccess =
      'Reward unlocked — extra scans added to your account.';
  static const shareReferralAlreadyRedeemed = 'Referral reward already redeemed.';
  static const shareReferralMockHint = 'Long-press here to simulate a referral (+1) in dev mode.';
  static const shareReferralMockAdded = 'Mock referral registered (+1).';

  static String similarityLabel(int percent) => '$percent% Similarity';

  static String referralProgressLabel(int count, int threshold) =>
      '$count / $threshold friends joined via your link';

  static String celebrityShareMessage({
    required String matchName,
    required int matchPercent,
    required String referralLink,
  }) {
    return 'I got matched with $matchName ($matchPercent% similarity) on Verified Glam! '
        'Use my referral link to find your celebrity look-alike and download the app: $referralLink';
  }

  /// Descriptor band for symmetry overall score (0–100).
  static String symmetryDescriptorFor(double score) =>
      symmetryTierFor(score.round());
}
