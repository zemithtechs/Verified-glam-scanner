import 'package:flutter/material.dart';

import '../../services/backend/vg_auth_service.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_constants.dart';
import '../vg_web_breakpoints.dart';
import '../vg_web_page_nav_stub.dart'
    if (dart.library.html) '../vg_web_page_nav_web.dart' as page_nav;
import 'vg_web_credits_chip.dart';
import 'vg_web_profile_menu.dart';
import 'vg_web_tool_sidebar.dart';

/// Web SaaS chrome — top bar + sidebar or drawer + main workspace.
class VGWebAppShell extends StatefulWidget {
  final String? activeSlug;
  final VGWebAppSection section;
  final Widget child;

  const VGWebAppShell({
    super.key,
    this.activeSlug,
    this.section = VGWebAppSection.tool,
    required this.child,
  });

  @override
  State<VGWebAppShell> createState() => _VGWebAppShellState();
}

class _VGWebAppShellState extends State<VGWebAppShell> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  Future<void> _signOut(BuildContext context) async {
    await VGAuthService.signOut();
    if (context.mounted) page_nav.vgWebGoLogin();
  }

  @override
  Widget build(BuildContext context) {
    final signedIn = VGAuthService.isSignedIn;
    final drawerNav = VGWebBreakpoints.useDrawerNav(context);
    final pad = VGWebBreakpoints.contentPadding(context);
    final phone = VGWebBreakpoints.isPhone(context);
    final compactTitle = phone ? 'Verified Glam' : vgAppName;

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: bmLightScaffoldBackgroundColor,
      drawer: drawerNav
          ? Drawer(
              width: phone ? 300 : 280,
              child: VGWebToolNav(
                activeSlug: widget.activeSlug,
                section: widget.section,
                onNavigate: () => _scaffoldKey.currentState?.closeDrawer(),
              ),
            )
          : null,
      body: Column(
        children: [
          Material(
            color: Colors.white,
            child: DecoratedBox(
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: bmPrimaryColor.withValues(alpha: 0.22))),
              ),
              child: SafeArea(
                bottom: false,
                child: SizedBox(
                  height: phone ? 52 : 56,
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: phone ? 8 : pad),
                    child: Row(
                      children: [
                        if (drawerNav)
                          IconButton(
                            onPressed: () => _scaffoldKey.currentState?.openDrawer(),
                            icon: const Icon(Icons.menu, color: bmSpecialColor),
                            tooltip: 'Menu',
                            visualDensity: phone ? VisualDensity.compact : VisualDensity.standard,
                          ),
                        if (!drawerNav)
                          Text(
                            compactTitle,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 17,
                              color: bmSpecialColorDark,
                            ),
                          )
                        else
                          Expanded(
                            child: Text(
                              compactTitle,
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: phone ? 15 : 17,
                                color: bmSpecialColorDark,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        if (!drawerNav) const Spacer(),
                        if (signedIn) ...[
                          VGWebCreditsChip(compact: phone),
                          VGWebProfileMenu(
                            section: widget.section,
                            onSignOut: phone ? () => _signOut(context) : null,
                          ),
                          if (!phone) ...[
                            const SizedBox(width: 4),
                            TextButton(
                              onPressed: () => _signOut(context),
                              child: const Text('Sign out', style: TextStyle(color: bmSpecialColor)),
                            ),
                          ],
                        ] else if (phone)
                          TextButton(
                            onPressed: () => page_nav.vgWebGoLogin(),
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 10),
                              minimumSize: const Size(0, 36),
                            ),
                            child: const Text('Log in', style: TextStyle(color: bmSpecialColor, fontWeight: FontWeight.w600)),
                          )
                        else
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              TextButton(
                                onPressed: () => page_nav.vgWebGoLogin(),
                                child: const Text('Log in', style: TextStyle(color: bmSpecialColor)),
                              ),
                              const SizedBox(width: 4),
                              FilledButton(
                                onPressed: () => page_nav.vgWebHardRedirect('/register'),
                                style: FilledButton.styleFrom(
                                  backgroundColor: bmSpecialColor,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                ),
                                child: const Text('Sign up'),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (!drawerNav)
                  VGWebToolSidebar(activeSlug: widget.activeSlug, section: widget.section),
                Expanded(
                  child: ColoredBox(
                    color: bmLightScaffoldBackgroundColor,
                    child: widget.child,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
