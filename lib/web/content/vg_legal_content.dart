/// Legal page copy — ported from website/about.html, privacy.html, terms.html.
class VGLegalPageContent {
  final String pageTitle;
  final String metaDescription;
  final String canonicalPath;
  final String h1;
  final String? metaLine;
  final List<VGLegalBlock> blocks;

  const VGLegalPageContent({
    required this.pageTitle,
    required this.metaDescription,
    required this.canonicalPath,
    required this.h1,
    this.metaLine,
    required this.blocks,
  });
}

sealed class VGLegalBlock {}

class VGLegalParagraph extends VGLegalBlock {
  final String text;

  VGLegalParagraph(this.text);
}

class VGLegalHeading extends VGLegalBlock {
  final String text;

  VGLegalHeading(this.text);
}

class VGLegalBulletList extends VGLegalBlock {
  final List<String> items;

  VGLegalBulletList(this.items);
}

class VGLegalNumberedList extends VGLegalBlock {
  final List<String> items;

  VGLegalNumberedList(this.items);
}

class VGLegalPages {
  static final about = VGLegalPageContent(
    pageTitle: 'About Us — Verified Glam Scanner',
    metaDescription:
        'About Verified Glam Scanner — AI beauty analysis from your selfie on Android and web. Personalized scores, symmetry insights, and glow-up tips.',
    canonicalPath: '/about',
    h1: 'About Verified Glam Scanner',
    metaLine: 'Beauty made perfect — on Android and the web',
    blocks: [
      VGLegalParagraph(
        'Verified Glam Scanner is the AI-powered beauty scanning product from Verified Glam. It turns a single selfie into personalized insights — overall beauty scores, facial symmetry breakdowns, color palette suggestions, celebrity look-alike matches, and practical glow-up tips. Our tagline is Pretty in Every Way: we help you understand your features with confidence, not judgment.',
      ),
      VGLegalHeading('What we offer'),
      VGLegalParagraph(
        'Verified Glam Scanner includes 11 scan types — from core face beauty analysis to seasonal color palettes, attractiveness tests, golden-ratio guides, and fun challenges. Every result is built around your photo: scores and overlays appear directly on your selfie so you can see what the AI detected.',
      ),
      VGLegalBulletList([
        'Free tier — explore scans with optional ads',
        'Pro — full reports, premium features, and an ad-free experience',
        'Web app — log in at scanner.verifiedglam.com to run scans in your browser',
        'Android app — download on Google Play (com.verifiedglam.beauty_scanner)',
      ]),
      VGLegalHeading('How it works'),
      VGLegalNumberedList([
        'Choose a scan type (for example Face Beauty Analysis or Facial Symmetry)',
        'Upload or capture a clear, front-facing selfie',
        'Your photo is sent securely to our servers for AI processing — API keys never live in the app',
        'View personalized scores, text insights, and face overlays on your photo',
        'Save results to your scan history and revisit them anytime',
      ]),
      VGLegalHeading('Our approach'),
      VGLegalParagraph(
        'Verified Glam Scanner is designed for self-discovery and entertainment. AI outputs are generated automatically and may not always be perfectly accurate. They are not medical, dermatological, or professional advice. Features like Celebrity Look-Alike are for fun — they do not verify identity.',
      ),
      VGLegalParagraph(
        'We take privacy seriously. Photos are stored in secure cloud storage, processed server-side, and protected by account authentication. Read our Privacy Policy for full details on data collection, retention, and your choices.',
      ),
      VGLegalHeading('Who we serve'),
      VGLegalParagraph(
        'Verified Glam Scanner is built for beauty-conscious users who want actionable, confidence-oriented feedback — whether you are exploring symmetry, finding your seasonal colors, or following a glow-up routine challenge. We serve users on Android today and on the web for the same core scan experience.',
      ),
      VGLegalHeading('Contact us'),
      VGLegalParagraph(
        'Questions, feedback, or partnership inquiries?\nEmail: support@verifiedglam.com\nGet Verified Glam Scanner on Google Play',
      ),
    ],
  );

  static final privacy = VGLegalPageContent(
    pageTitle: 'Privacy Policy — Verified Glam Scanner',
    metaDescription:
        'Privacy Policy for Verified Glam Scanner. How we collect, use, and protect your photos and account data.',
    canonicalPath: '/privacy',
    h1: 'Privacy Policy',
    metaLine: 'Last updated: September 9, 2026',
    blocks: [
      VGLegalParagraph(
        'Verified Glam (“we,” “us,” or “our”) operates the Verified Glam Scanner website and the Verified Glam mobile application for Android (package com.verifiedglam.beauty_scanner). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app or contact us.',
      ),
      VGLegalHeading('1. Information we collect'),
      VGLegalParagraph(
        'Photos and scan data. When you run a beauty scan, you upload or capture a selfie. We store your photo (and any second photo for two-photo features) in secure cloud storage and process it to generate analysis results.',
      ),
      VGLegalParagraph(
        'Account and profile information. If you create an account, we collect identifiers such as your email address and profile details you provide during onboarding.',
      ),
      VGLegalParagraph(
        'Device and usage data. We may collect standard app analytics such as device type, operating system version, app version, and feature usage to improve stability and performance.',
      ),
      VGLegalParagraph(
        'Advertising and subscriptions. Free users may see ads served by Google AdMob. If you subscribe to Pro, purchase and subscription status are processed through Polar.sh (hosted checkout). Your account is linked via your user ID for cross-platform access on web and Android.',
      ),
      VGLegalParagraph(
        'Support communications. If you email us at support@verifiedglam.com, we retain the content of your message and your email address to respond to you.',
      ),
      VGLegalHeading('2. How we use your information'),
      VGLegalBulletList([
        'Provide AI-powered beauty analysis and display results in the app',
        'Store scan history and thumbnails associated with your account',
        'Authenticate you and maintain your profile and preferences',
        'Deliver ads to free-tier users and manage Pro subscriptions',
        'Send push notifications if you opt in',
        'Improve the app, fix bugs, and prevent abuse or fraud',
        'Comply with legal obligations',
      ]),
      VGLegalHeading('3. AI processing'),
      VGLegalParagraph(
        'Facial analysis is performed on our servers using third-party AI services (including OpenAI). Your photos are sent to these services only for the purpose of generating your requested scan results. API keys and AI credentials are kept on the server — they are never embedded in the mobile app.',
      ),
      VGLegalParagraph(
        'AI outputs are generated automatically and may not always be accurate. They are intended for entertainment and self-discovery, not medical or professional advice.',
      ),
      VGLegalHeading('4. How we store and protect data'),
      VGLegalParagraph(
        'We use Cloudflare (Workers, D1 database, and R2 storage) for authentication, database records, and private storage of scan photos. Access to your data is protected by account authentication and server-side access controls.',
      ),
      VGLegalHeading('5. Sharing with third parties'),
      VGLegalBulletList([
        'Cloudflare — hosting, auth, database, and file storage',
        'OpenAI — server-side image analysis for scan results',
        'Google (AdMob) — advertising on the free tier',
        'Polar.sh — subscription checkout and billing management',
        'TMDB — celebrity portrait metadata for Celebrity Look-Alike features',
      ]),
      VGLegalParagraph(
        'We do not sell your personal information. We may disclose information if required by law or to protect our rights, users, or safety.',
      ),
      VGLegalHeading('6. Data retention'),
      VGLegalParagraph(
        'Scan photos and results remain associated with your account while you use the app. You can delete individual scans from your history or permanently delete your account and associated personal data immediately from the app or at scanner.verifiedglam.com/delete-account.',
      ),
      VGLegalHeading('7. Your choices and rights'),
      VGLegalBulletList([
        'Decline optional permissions — some features may not work without them',
        'Delete scans from history in the app',
        'Delete your account in the app under Profile → Account → Delete account, or online at scanner.verifiedglam.com/delete-account',
        'Review available AdMob privacy choices from the app’s Settings menu',
      ]),
      VGLegalHeading('8. Children’s privacy'),
      VGLegalParagraph(
        'Verified Glam Scanner is not directed at children or teens. We do not knowingly collect personal information from anyone under 18. If you believe a minor has provided us information, contact support@verifiedglam.com and we will delete it.',
      ),
      VGLegalHeading('9. International users'),
      VGLegalParagraph(
        'Your information may be processed in countries where our service providers operate. By using the app, you consent to such transfers subject to applicable safeguards.',
      ),
      VGLegalHeading('10. Changes to this policy'),
      VGLegalParagraph(
        'We may update this Privacy Policy from time to time. We will post the revised policy on this page and update the “Last updated” date.',
      ),
      VGLegalHeading('11. Contact us'),
      VGLegalParagraph(
        'Verified Glam\nEmail: support@verifiedglam.com\nWebsite: scanner.verifiedglam.com',
      ),
    ],
  );

  static final terms = VGLegalPageContent(
    pageTitle: 'Terms of Use — Verified Glam Scanner',
    metaDescription:
        'Terms of Use for Verified Glam Scanner. Entertainment disclaimer, subscriptions, and acceptable use.',
    canonicalPath: '/terms',
    h1: 'Terms of Use',
    metaLine: 'Last updated: June 2, 2026',
    blocks: [
      VGLegalParagraph(
        'These Terms of Use (“Terms”) govern your access to and use of the Verified Glam Scanner website, the Verified Glam mobile application for Android (package com.verifiedglam.beauty_scanner), and related services (collectively, the “Service”) operated by Verified Glam (“we,” “us,” or “our”). By downloading, installing, or using the Service, you agree to these Terms.',
      ),
      VGLegalHeading('1. Eligibility'),
      VGLegalParagraph(
        'You must be at least 18 years old to use Verified Glam Scanner, create an account, or purchase a Pro subscription. By using the Service, you represent that you meet this age requirement. The Service is not intended for minors.',
      ),
      VGLegalHeading('2. Entertainment and disclaimer — not medical advice'),
      VGLegalParagraph(
        'Verified Glam Scanner provides AI-generated beauty analysis, scores, symmetry readings, celebrity look-alike matches, face reading, attractiveness tests, and similar features for entertainment and self-discovery only.',
      ),
      VGLegalBulletList([
        'Results are not medical, dermatological, psychological, or professional advice',
        'Scores and rankings are subjective algorithmic outputs, not objective measures of worth or health',
        'Celebrity matches are approximate and for fun — they do not verify identity or endorsement',
        'Face reading and personality-style traits are illustrative, not diagnostic',
      ]),
      VGLegalParagraph(
        'Always consult qualified professionals for health, skin, or mental-health concerns.',
      ),
      VGLegalHeading('3. Your account and content'),
      VGLegalParagraph(
        'You are responsible for maintaining the confidentiality of your account credentials. You retain ownership of photos you upload. By uploading content, you grant us a limited license to store, process, and display that content solely to provide the Service.',
      ),
      VGLegalHeading('4. Free tier, ads, and Pro subscription'),
      VGLegalParagraph(
        'Free users may access a limited set of features and will see advertisements. Pro unlocks additional scan types, removes ads, and includes subscription credits for AI analyses. Subscriptions are billed through Polar.sh; the same Pro status applies on web and Android when signed in to the same account.',
      ),
      VGLegalHeading('5. Acceptable use'),
      VGLegalBulletList([
        'Do not reverse engineer, scrape, or attempt to extract source code or AI models',
        'Do not use automated means to access the Service except as allowed by us',
        'Do not misrepresent AI results as professional certifications or medical diagnoses',
        'Do not harass others or use the Service for unlawful purposes',
      ]),
      VGLegalHeading('6. Intellectual property'),
      VGLegalParagraph(
        'The Verified Glam name, logo, app design, and original content are owned by us or our licensors. You receive a limited, non-exclusive, non-transferable license to use the app for personal, non-commercial purposes.',
      ),
      VGLegalHeading('7. Privacy'),
      VGLegalParagraph(
        'Our collection and use of personal information is described in our Privacy Policy, which is incorporated into these Terms by reference.',
      ),
      VGLegalHeading('8. Disclaimers'),
      VGLegalParagraph(
        'THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.',
      ),
      VGLegalHeading('9. Limitation of liability'),
      VGLegalParagraph(
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.',
      ),
      VGLegalHeading('10. Termination'),
      VGLegalParagraph(
        'You may stop using the Service at any time. We may suspend or terminate your access if you breach these Terms or if we discontinue the Service.',
      ),
      VGLegalHeading('11. Changes'),
      VGLegalParagraph(
        'We may modify these Terms or the Service. Material changes will be posted on this page with an updated date.',
      ),
      VGLegalHeading('12. Governing law'),
      VGLegalParagraph(
        'These Terms are governed by the laws applicable in our principal place of business, without regard to conflict-of-law rules, except where mandatory consumer protections in your country apply.',
      ),
      VGLegalHeading('13. Contact'),
      VGLegalParagraph(
          'Questions about these Terms:\nEmail: support@verifiedglam.com'),
    ],
  );
}
