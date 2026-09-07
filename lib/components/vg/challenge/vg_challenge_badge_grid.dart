import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../utils/BMColors.dart';
import '../../../utils/vg_challenge_badges.dart';
import '../../../utils/vg_copy.dart';

/// Badge grid for profile and reward screens. On the profile screen
/// (collapsible: true) shows the first 3 badges with a Show more toggle for
/// the rest; reward/celebration screens keep collapsible false (default) so
/// a freshly-earned badge is never hidden behind a tap right after unlocking it.
class VGChallengeBadgeGrid extends StatefulWidget {
  final List<Map<String, dynamic>> earnedBadges;
  final bool loading;
  final bool compact;
  final bool collapsible;

  const VGChallengeBadgeGrid({
    super.key,
    required this.earnedBadges,
    this.loading = false,
    this.compact = false,
    this.collapsible = false,
  });

  @override
  State<VGChallengeBadgeGrid> createState() => _VGChallengeBadgeGridState();
}

class _VGChallengeBadgeGridState extends State<VGChallengeBadgeGrid> {
  static const _collapsedCount = 3;
  bool _showAll = false;

  bool _isEarned(String code) {
    return widget.earnedBadges.any((b) => b['badge_code'] == code);
  }

  @override
  Widget build(BuildContext context) {
    if (widget.loading) {
      return const Center(child: CircularProgressIndicator());
    }

    final catalog = VGChallengeBadges.catalog;
    final collapsed = widget.collapsible && !_showAll;
    final visible = collapsed ? catalog.take(_collapsedCount).toList() : catalog;

    return Column(
      children: [
        Wrap(
          alignment: WrapAlignment.center,
          spacing: widget.compact ? 12 : 16,
          runSpacing: widget.compact ? 10 : 12,
          children: visible.map((badge) {
            final earned = _isEarned(badge.code);
            return _BadgeItem(
              emoji: badge.emoji,
              name: badge.title,
              earned: earned,
              compact: widget.compact,
            );
          }).toList(),
        ),
        if (widget.collapsible && catalog.length > _collapsedCount)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: TextButton.icon(
              onPressed: () => setState(() => _showAll = !_showAll),
              icon: Icon(_showAll ? Icons.expand_less : Icons.expand_more, color: bmSpecialColor, size: 18),
              label: Text(
                _showAll ? VGCopy.homeShowLess : VGCopy.homeShowMore,
                style: boldTextStyle(color: bmSpecialColor, size: 13),
              ),
            ),
          ),
      ],
    );
  }
}

class _BadgeItem extends StatelessWidget {
  final String emoji;
  final String name;
  final bool earned;
  final bool compact;

  const _BadgeItem({
    required this.emoji,
    required this.name,
    required this.earned,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final size = compact ? 40.0 : 48.0;
    return SizedBox(
      width: compact ? 64 : 72,
      child: Column(
        children: [
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: earned ? const Color(0xFFFEF3C7) : bmLightScaffoldBackgroundColor,
              border: Border.all(
                color: earned ? const Color(0xFFF59E0B) : bmPrimaryColor.withValues(alpha: 0.3),
                width: 2,
              ),
            ),
            alignment: Alignment.center,
            child: Opacity(
              opacity: earned ? 1 : 0.45,
              child: Text(emoji, style: TextStyle(fontSize: compact ? 18 : 22)),
            ),
          ),
          6.height,
          Text(
            name,
            style: boldTextStyle(size: compact ? 9 : 10, color: appTextColorSecondary),
            textAlign: TextAlign.center,
            maxLines: 2,
          ),
        ],
      ),
    );
  }
}
