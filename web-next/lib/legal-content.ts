// Ported verbatim from lib/web/content/vg_legal_content.dart.
export type LegalBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] };

export type LegalPageContent = {
  pageTitle: string;
  metaDescription: string;
  h1: string;
  metaLine: string;
  blocks: LegalBlock[];
};

const p = (...lines: string[]): LegalBlock => ({ type: "paragraph", lines });
const h = (text: string): LegalBlock => ({ type: "heading", text });
const ul = (...items: string[]): LegalBlock => ({ type: "bullets", items });
const ol = (...items: string[]): LegalBlock => ({ type: "numbered", items });

export const ABOUT_CONTENT: LegalPageContent = {
  pageTitle: "About Us — Verified Glam Scanner",
  metaDescription:
    "About Verified Glam Scanner — AI beauty analysis from your selfie on Android and web. Personalized scores, symmetry insights, and glow-up tips.",
  h1: "About Verified Glam Scanner",
  metaLine: "Beauty made perfect — on Android and the web",
  blocks: [
    p(
      "Verified Glam Scanner is the AI-powered beauty scanning product from Verified Glam. It turns a single selfie into personalized insights — overall beauty scores, facial symmetry breakdowns, color palette suggestions, celebrity look-alike matches, and practical glow-up tips. Our tagline is Pretty in Every Way: we help you understand your features with confidence, not judgment.",
    ),
    h("What we offer"),
    p(
      "Verified Glam Scanner includes 10 scan types — from core face beauty analysis to seasonal color palettes, attractiveness tests, golden-ratio guides, and fun challenges. Every result is built around your photo: scores and overlays appear directly on your selfie so you can see what the AI detected.",
    ),
    ul(
      "Free tier — explore scans with optional ads",
      "Pro — full reports, premium features, and an ad-free experience",
      "Web app — log in at scanner.verifiedglam.com to run scans in your browser",
      "Android app — download on Google Play (com.verifiedglam.beauty_scanner)",
    ),
    h("How it works"),
    ol(
      "Choose a scan type (for example Face Beauty Analysis or Facial Symmetry)",
      "Upload or capture a clear, front-facing selfie",
      "Your photo is sent securely to our servers for AI processing — API keys never live in the app",
      "View personalized scores, text insights, and face overlays on your photo",
      "Save results to your scan history and revisit them anytime",
    ),
    h("Our approach"),
    p(
      "Verified Glam Scanner is designed for self-discovery and entertainment. AI outputs are generated automatically and may not always be perfectly accurate. They are not medical, dermatological, or professional advice. Features like Celebrity Look-Alike are for fun — they do not verify identity.",
    ),
    p(
      "We take privacy seriously. Photos are stored in secure cloud storage, processed server-side, and protected by account authentication. Read our Privacy Policy for full details on data collection, retention, and your choices.",
    ),
    h("Who we serve"),
    p(
      "Verified Glam Scanner is built for beauty-conscious users who want actionable, confidence-oriented feedback — whether you are exploring symmetry, finding your seasonal colors, or following a glow-up routine challenge. We serve users on Android today and on the web for the same core scan experience.",
    ),
    h("Contact us"),
    p("Questions, feedback, or partnership inquiries?", "Email: support@verifiedglam.com", "Get Verified Glam Scanner on Google Play"),
  ],
};

export const PRIVACY_CONTENT: LegalPageContent = {
  pageTitle: "Privacy Policy — Verified Glam Scanner",
  metaDescription: "Privacy Policy for Verified Glam Scanner. How we collect, use, and protect your photos and account data.",
  h1: "Privacy Policy",
  metaLine: "Last updated: June 2, 2026",
  blocks: [
    p(
      'Verified Glam ("we," "us," or "our") operates the Verified Glam Scanner website and the Verified Glam mobile application for Android (package com.verifiedglam.beauty_scanner). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app or contact us.',
    ),
    h("1. Information we collect"),
    p(
      "Photos and scan data. When you run a beauty scan, you upload or capture a selfie. We store your photo (and any second photo for two-photo features) in secure cloud storage and process it to generate analysis results.",
    ),
    p("Account and profile information. If you create an account, we collect identifiers such as your email address and profile details you provide during onboarding."),
    p("Device and usage data. We may collect standard app analytics such as device type, operating system version, app version, and feature usage to improve stability and performance."),
    p(
      "Advertising and subscriptions. Free users may see ads served by Google AdMob. If you subscribe to Pro, purchase and subscription status are processed through Polar.sh (hosted checkout). Your account is linked via your user ID for cross-platform access on web and Android.",
    ),
    p("Support communications. If you email us at support@verifiedglam.com, we retain the content of your message and your email address to respond to you."),
    h("2. How we use your information"),
    ul(
      "Provide AI-powered beauty analysis and display results in the app",
      "Store scan history and thumbnails associated with your account",
      "Authenticate you and maintain your profile and preferences",
      "Deliver ads to free-tier users and manage Pro subscriptions",
      "Send push notifications if you opt in",
      "Improve the app, fix bugs, and prevent abuse or fraud",
      "Comply with legal obligations",
    ),
    h("3. AI processing"),
    p(
      "Facial analysis is performed on our servers using third-party AI services (including OpenAI). Your photos are sent to these services only for the purpose of generating your requested scan results. API keys and AI credentials are kept on the server — they are never embedded in the mobile app.",
    ),
    p("AI outputs are generated automatically and may not always be accurate. They are intended for entertainment and self-discovery, not medical or professional advice."),
    h("4. How we store and protect data"),
    p(
      "We use Cloudflare (Workers, D1 database, and R2 storage) for authentication, database records, and private storage of scan photos. Access to your data is protected by account authentication and server-side access controls.",
    ),
    h("5. Sharing with third parties"),
    ul(
      "Cloudflare — hosting, auth, database, and file storage",
      "OpenAI — server-side image analysis for scan results",
      "Google (AdMob) — advertising on the free tier",
      "Polar.sh — subscription checkout and billing management",
      "TMDB — celebrity portrait metadata for Celebrity Look-Alike features",
    ),
    p("We do not sell your personal information. We may disclose information if required by law or to protect our rights, users, or safety."),
    h("6. Data retention"),
    p(
      "Scan photos and results remain associated with your account while you use the app. You can delete individual scans from your history in the app. If you delete your account or request deletion by contacting support@verifiedglam.com, we will delete or anonymize your personal data within a reasonable period.",
    ),
    h("7. Your choices and rights"),
    ul(
      "Decline optional permissions — some features may not work without them",
      "Delete scans from history in the app",
      "Request account or data deletion by emailing support@verifiedglam.com",
      "Manage ad personalization through your device's Google account and ad settings",
    ),
    h("8. Children's privacy"),
    p(
      "Verified Glam Scanner is not directed at children or teens. We do not knowingly collect personal information from anyone under 18. If you believe a minor has provided us information, contact support@verifiedglam.com and we will delete it.",
    ),
    h("9. International users"),
    p("Your information may be processed in countries where our service providers operate. By using the app, you consent to such transfers subject to applicable safeguards."),
    h("10. Changes to this policy"),
    p('We may update this Privacy Policy from time to time. We will post the revised policy on this page and update the "Last updated" date.'),
    h("11. Contact us"),
    p("Verified Glam", "Email: support@verifiedglam.com", "Website: scanner.verifiedglam.com"),
  ],
};

export const TERMS_CONTENT: LegalPageContent = {
  pageTitle: "Terms of Use — Verified Glam Scanner",
  metaDescription: "Terms of Use for Verified Glam Scanner. Entertainment disclaimer, subscriptions, and acceptable use.",
  h1: "Terms of Use",
  metaLine: "Last updated: June 2, 2026",
  blocks: [
    p(
      'These Terms of Use ("Terms") govern your access to and use of the Verified Glam Scanner website, the Verified Glam mobile application for Android (package com.verifiedglam.beauty_scanner), and related services (collectively, the "Service") operated by Verified Glam ("we," "us," or "our"). By downloading, installing, or using the Service, you agree to these Terms.',
    ),
    h("1. Eligibility"),
    p(
      "You must be at least 18 years old to use Verified Glam Scanner, create an account, or purchase a Pro subscription. By using the Service, you represent that you meet this age requirement. The Service is not intended for minors.",
    ),
    h("2. Entertainment and disclaimer — not medical advice"),
    p(
      "Verified Glam Scanner provides AI-generated beauty analysis, scores, symmetry readings, celebrity look-alike matches, face reading, attractiveness tests, and similar features for entertainment and self-discovery only.",
    ),
    ul(
      "Results are not medical, dermatological, psychological, or professional advice",
      "Scores and rankings are subjective algorithmic outputs, not objective measures of worth or health",
      "Celebrity matches are approximate and for fun — they do not verify identity or endorsement",
      "Face reading and personality-style traits are illustrative, not diagnostic",
    ),
    p("Always consult qualified professionals for health, skin, or mental-health concerns."),
    h("3. Your account and content"),
    p(
      "You are responsible for maintaining the confidentiality of your account credentials. You retain ownership of photos you upload. By uploading content, you grant us a limited license to store, process, and display that content solely to provide the Service.",
    ),
    h("4. Free tier, ads, and Pro subscription"),
    p(
      "Free users may access a limited set of features and will see advertisements. Pro unlocks additional scan types, removes ads, and includes subscription credits for AI analyses. Subscriptions are billed through Polar.sh; the same Pro status applies on web and Android when signed in to the same account.",
    ),
    h("5. Acceptable use"),
    ul(
      "Do not reverse engineer, scrape, or attempt to extract source code or AI models",
      "Do not use automated means to access the Service except as allowed by us",
      "Do not misrepresent AI results as professional certifications or medical diagnoses",
      "Do not harass others or use the Service for unlawful purposes",
    ),
    h("6. Intellectual property"),
    p(
      "The Verified Glam name, logo, app design, and original content are owned by us or our licensors. You receive a limited, non-exclusive, non-transferable license to use the app for personal, non-commercial purposes.",
    ),
    h("7. Privacy"),
    p("Our collection and use of personal information is described in our Privacy Policy, which is incorporated into these Terms by reference."),
    h("8. Disclaimers"),
    p('THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.'),
    h("9. Limitation of liability"),
    p("TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE."),
    h("10. Termination"),
    p("You may stop using the Service at any time. We may suspend or terminate your access if you breach these Terms or if we discontinue the Service."),
    h("11. Changes"),
    p("We may modify these Terms or the Service. Material changes will be posted on this page with an updated date."),
    h("12. Governing law"),
    p(
      "These Terms are governed by the laws applicable in our principal place of business, without regard to conflict-of-law rules, except where mandatory consumer protections in your country apply.",
    ),
    h("13. Contact"),
    p("Questions about these Terms:", "Email: support@verifiedglam.com"),
  ],
};
