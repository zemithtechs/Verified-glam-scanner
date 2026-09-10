import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:nb_utils/nb_utils.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../main.dart';
import '../../services/backend/vg_auth_service.dart';
import '../../utils/BMConstants.dart';
import '../../utils/BMColors.dart';
import '../../utils/vg_constants.dart';
import '../../utils/vg_copy.dart';
import '../vg_web_page_nav_stub.dart'
    if (dart.library.html) '../vg_web_page_nav_web.dart' as page_nav;
import 'vg_web_tool_sidebar.dart';

/// Avatar + account settings menu for the web app top bar.
class VGWebProfileMenu extends StatelessWidget {
  final VGWebAppSection section;
  final VoidCallback? onSignOut;

  const VGWebProfileMenu({
    super.key,
    this.section = VGWebAppSection.tool,
    this.onSignOut,
  });

  @override
  Widget build(BuildContext context) {
    final email = VGAuthService.currentUser?.email ?? '';
    final initial = email.isNotEmpty ? email[0].toUpperCase() : '?';
    final onProfile = section == VGWebAppSection.profile;

    return MenuAnchor(
      style: MenuStyle(
        backgroundColor: WidgetStateProperty.all(Colors.white),
        elevation: WidgetStateProperty.all(8),
        shape: WidgetStateProperty.all(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      builder: (context, controller, child) {
        return IconButton(
          onPressed: () {
            if (controller.isOpen) {
              controller.close();
            } else {
              controller.open();
            }
          },
          tooltip: VGCopy.settingsProfile,
          icon: CircleAvatar(
            radius: 16,
            backgroundColor: bmSecondBackgroundColorLight,
            child: Text(
              initial,
              style: boldTextStyle(size: 14, color: bmSpecialColorDark),
            ),
          ),
        );
      },
      menuChildren: [
        if (email.isNotEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 260),
              child: Text(
                email,
                style: secondaryTextStyle(size: 12),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
        if (email.isNotEmpty) const Divider(height: 1),
        _ThemeMenuRow(),
        _menuItem(
          icon: Icons.mail_outline,
          label: VGCopy.settingsSupport,
          subtitle: vgSupportEmail,
          onTap: () async {
            final uri = Uri.parse('mailto:$vgSupportEmail');
            await launchUrl(uri);
          },
        ),
        _menuItem(
          icon: Icons.privacy_tip_outlined,
          label: VGCopy.settingsPrivacy,
          onTap: () => page_nav.vgWebHardRedirect('/privacy'),
        ),
        _menuItem(
          icon: Icons.description_outlined,
          label: VGCopy.profileMenuTerms,
          onTap: () => page_nav.vgWebHardRedirect('/terms'),
        ),
        _menuItem(
          icon: Icons.share_outlined,
          label: VGCopy.settingsShare,
          onTap: () => Share.share('${VGCopy.splashTagline} — $vgAppName'),
        ),
        const Divider(height: 1),
        if (!onProfile)
          _menuItem(
            icon: Icons.person_outline,
            label: VGCopy.profileMenuProfileBadges,
            onTap: () => context.go('/app/profile'),
          ),
        if (onSignOut != null) ...[
          const Divider(height: 1),
          _menuItem(
            icon: Icons.logout,
            label: 'Sign out',
            onTap: onSignOut!,
          ),
        ],
      ],
    );
  }

  Widget _menuItem({
    required IconData icon,
    required String label,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return MenuItemButton(
      onPressed: onTap,
      child: Row(
        children: [
          Icon(icon, color: bmSpecialColor, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: primaryTextStyle(size: 13)),
                if (subtitle != null)
                  Text(subtitle, style: secondaryTextStyle(size: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ThemeMenuRow extends StatefulWidget {
  @override
  State<_ThemeMenuRow> createState() => _ThemeMenuRowState();
}

class _ThemeMenuRowState extends State<_ThemeMenuRow> {
  @override
  Widget build(BuildContext context) {
    return MenuItemButton(
      onPressed: () async {
        final next = !appStore.isDarkModeOn;
        appStore.toggleDarkMode(value: next);
        await setValue(isDarkModeOnPref, next);
        setState(() {});
      },
      child: Row(
        children: [
          const Icon(Icons.brightness_6_outlined, color: bmSpecialColor, size: 20),
          const SizedBox(width: 12),
          Expanded(child: Text(VGCopy.profileTheme, style: primaryTextStyle(size: 13))),
          Switch(
            value: appStore.isDarkModeOn,
            activeTrackColor: bmSpecialColor,
            onChanged: (val) async {
              appStore.toggleDarkMode(value: val);
              await setValue(isDarkModeOnPref, val);
              setState(() {});
            },
          ),
        ],
      ),
    );
  }
}
