import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../utils/BMColors.dart';
import '../../../utils/vg_copy.dart';

class VGShowdownPodium extends StatelessWidget {
  final List<Map<String, dynamic>> podium;

  const VGShowdownPodium({super.key, required this.podium});

  @override
  Widget build(BuildContext context) {
    final sorted = List<Map<String, dynamic>>.from(podium)
      ..sort((a, b) => (a['rank'] as num).compareTo(b['rank'] as num));
    final first = sorted.isNotEmpty ? sorted[0] : null;
    final second = sorted.length > 1 ? sorted[1] : null;
    final third = sorted.length > 2 ? sorted[2] : null;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
          colors: [
            bmSpecialColor,
            bmPrimaryColor,
            bmSpecialColorDark,
          ],
        ),
      ),
      child: Column(
        children: [
          Text(
            VGCopy.showdownTitle,
            style: boldTextStyle(color: Colors.white, size: 18),
          ),
          20.height,
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(child: _PodiumSlot(entry: second, size: 64, crownColor: const Color(0xFFC0C0C0))),
              Expanded(child: _PodiumSlot(entry: first, size: 82, crownColor: const Color(0xFFFFD700))),
              Expanded(child: _PodiumSlot(entry: third, size: 58, crownColor: const Color(0xFFCD7F32))),
            ],
          ),
        ],
      ),
    );
  }
}

class _PodiumSlot extends StatelessWidget {
  final Map<String, dynamic>? entry;
  final double size;
  final Color crownColor;

  const _PodiumSlot({required this.entry, required this.size, required this.crownColor});

  @override
  Widget build(BuildContext context) {
    if (entry == null) return const SizedBox.shrink();

    final name = entry!['displayName'] as String? ??
        entry!['name'] as String? ??
        'Member';
    final score = (entry!['score'] as num?)?.toDouble() ?? 0;
    final rank = (entry!['rank'] as num?)?.round() ?? 0;
    final asset = entry!['avatarAsset'] as String?;
    final avatarUrl = entry!['avatarUrl'] as String?;
    final isSimulated = entry!['isSimulated'] == true;

    return Column(
      children: [
        Icon(Icons.workspace_premium, color: crownColor, size: 22),
        4.height,
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: crownColor, width: 3),
          ),
          child: ClipOval(child: _avatar(name, asset, avatarUrl)),
        ),
        6.height,
        Container(
          width: 22,
          height: 22,
          decoration: BoxDecoration(color: crownColor, shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Text('$rank', style: boldTextStyle(color: Colors.white, size: 11)),
        ),
        4.height,
        Text(name, style: boldTextStyle(color: Colors.white, size: 11), maxLines: 1),
        Text(
          score.toStringAsFixed(2),
          style: secondaryTextStyle(color: Colors.white70, size: 11),
        ),
        if (isSimulated) ...[
          2.height,
          Text('SIMULATED', style: boldTextStyle(color: Colors.white54, size: 7)),
        ],
      ],
    );
  }

  Widget _avatar(String name, String? asset, String? avatarUrl) {
    if (avatarUrl != null && avatarUrl.isNotEmpty) {
      return Image.network(
        avatarUrl,
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
        errorBuilder: (_, __, ___) => _initials(name),
        loadingBuilder: (context, child, progress) {
          if (progress == null) return child;
          return _initials(name);
        },
      );
    }
    if (asset != null && asset.isNotEmpty) {
      return Image.asset(
        asset,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _initials(name),
      );
    }
    return _initials(name);
  }

  Widget _initials(String name) {
    return ColoredBox(
      color: Colors.white24,
      child: Center(
        child: Text(
          name.isNotEmpty ? name[0] : '?',
          style: boldTextStyle(color: Colors.white, size: 20),
        ),
      ),
    );
  }
}
