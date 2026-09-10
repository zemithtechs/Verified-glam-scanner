import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../services/backend/vg_auth_service.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_constants.dart';
import '../../utils/vg_copy.dart';
import '../vg_web_breakpoints.dart';
import '../vg_web_page_nav_stub.dart'
    if (dart.library.html) '../vg_web_page_nav_web.dart' as page_nav;
import 'vg_web_tools_mega_menu.dart';

class VGWebHeader extends StatelessWidget implements PreferredSizeWidget {
  final String? activeSlug;
  final bool toolsIndexActive;
  final bool pricingActive;

  const VGWebHeader({
    super.key,
    this.activeSlug,
    this.toolsIndexActive = false,
    this.pricingActive = false,
  });

  @override
  Size get preferredSize => const Size.fromHeight(72);

  Future<void> _openPlayStore() async {
    final uri = Uri.parse(vgGooglePlayUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _goMarketing(BuildContext context, String path) {
    if (path.startsWith('/app') || path == '/dashboard') {
      context.go(path);
    } else {
      page_nav.vgOpenMarketingPage(path);
    }
  }

  void _openAbout(BuildContext context) => _goMarketing(context, '/about');

  @override
  Widget build(BuildContext context) {
    final signedIn = VGAuthService.isSignedIn;
    final desktop = VGWebBreakpoints.isDesktop(context);
    final phone = VGWebBreakpoints.isPhone(context);
    final padding = VGWebBreakpoints.contentPadding(context);
    final showWordmark = !phone;

    return Material(
      color: Colors.white,
      elevation: 0,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(bottom: BorderSide(color: bmPrimaryColor.withValues(alpha: 0.22))),
        ),
        child: SafeArea(
          bottom: false,
          child: SizedBox(
            height: 72,
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: padding),
              child: Row(
                children: [
                  _LogoLink(showWordmark: showWordmark),
                  if (desktop) ...[
                    const SizedBox(width: 32),
                    VGWebToolsMegaMenu(
                      activeSlug: activeSlug,
                      toolsIndexActive: toolsIndexActive,
                    ),
                    _NavLink(
                      label: VGCopy.webNavPricing,
                      path: '/pricing',
                      active: pricingActive,
                    ),
                    _NavLink(
                      label: VGCopy.webNavAbout,
                      onTap: () => _openAbout(context),
                    ),
                  ],
                  const Spacer(),
                  if (!desktop)
                    VGWebToolsMegaMenu(
                      activeSlug: activeSlug,
                      toolsIndexActive: toolsIndexActive,
                    ),
                  if (!desktop && !pricingActive)
                    IconButton(
                      onPressed: () => _goMarketing(context, '/pricing'),
                      icon: const Icon(Icons.payments_outlined, color: bmSpecialColor),
                      tooltip: VGCopy.webNavPricing,
                    ),
                  if (!desktop)
                    IconButton(
                      onPressed: () => _openAbout(context),
                      icon: const Icon(Icons.info_outline, color: bmSpecialColor),
                      tooltip: VGCopy.webNavAbout,
                    ),
                  if (desktop)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: _HeaderButton(
                        label: VGCopy.webNavPlayStore,
                        filled: false,
                        compact: true,
                        onTap: _openPlayStore,
                      ),
                    )
                  else
                    IconButton(
                      onPressed: _openPlayStore,
                      icon: const Icon(Icons.shop_outlined, color: bmSpecialColor),
                      tooltip: VGCopy.webNavPlayStore,
                    ),
                  if (signedIn)
                    Flexible(
                      child: _HeaderButton(
                        label: phone ? 'App' : 'Dashboard',
                        filled: true,
                        compact: phone,
                        onTap: () => context.go('/dashboard'),
                      ),
                    )
                  else ...[
                    if (desktop)
                      _HeaderButton(
                        label: 'Log in',
                        filled: false,
                        compact: false,
                        onTap: () => _goMarketing(context, '/login'),
                      ),
                    if (desktop) const SizedBox(width: 8),
                    Flexible(
                      child: _HeaderButton(
                        label: desktop ? 'Sign up' : (phone ? 'Join' : 'Get started'),
                        filled: true,
                        compact: phone,
                        onTap: () => _goMarketing(context, '/register'),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LogoLink extends StatelessWidget {
  final bool showWordmark;

  const _LogoLink({required this.showWordmark});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => page_nav.vgOpenMarketingPage('/'),
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset('images/verified_glam_logo.png', height: 36),
            if (showWordmark) ...[
              const SizedBox(width: 10),
              Text(
                vgWebProductName,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                  color: bmSpecialColorDark,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _NavLink extends StatelessWidget {
  final String label;
  final String? path;
  final VoidCallback? onTap;
  final bool active;

  const _NavLink({
    required this.label,
    this.path,
    this.onTap,
    this.active = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: InkWell(
        onTap: onTap ??
            (path != null
                ? () {
                    if (path!.startsWith('/app')) {
                      context.go(path!);
                    } else {
                      page_nav.vgOpenMarketingPage(path!);
                    }
                  }
                : null),
        borderRadius: BorderRadius.circular(8),
        hoverColor: bmLightScaffoldBackgroundColor,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 15,
              fontWeight: active ? FontWeight.w700 : FontWeight.w500,
              color: active ? bmSpecialColor : appTextColorSecondary,
            ),
          ),
        ),
      ),
    );
  }
}

class _HeaderButton extends StatelessWidget {
  final String label;
  final bool filled;
  final bool compact;
  final VoidCallback onTap;

  const _HeaderButton({
    required this.label,
    required this.filled,
    this.compact = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: filled ? bmSpecialColor : Colors.transparent,
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(999),
        child: Container(
          constraints: BoxConstraints(minHeight: compact ? 40 : 44),
          padding: EdgeInsets.symmetric(horizontal: compact ? 12 : 20, vertical: compact ? 8 : 10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            border: filled ? null : Border.all(color: bmSpecialColor),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: compact ? 12 : 14,
              color: filled ? Colors.white : bmSpecialColor,
            ),
          ),
        ),
      ),
    );
  }
}
