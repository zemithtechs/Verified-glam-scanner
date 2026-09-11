import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../utils/BMColors.dart';
import '../../../utils/vg_copy.dart';

class VGCelebrityMatchCard extends StatelessWidget {
  final String name;
  final int percent;
  final List<String> traits;
  final String? why;
  final String? imageAsset;
  final String? imageUrl;
  final bool isGenerated;

  const VGCelebrityMatchCard({
    super.key,
    required this.name,
    required this.percent,
    required this.traits,
    this.why,
    this.imageAsset,
    this.imageUrl,
    this.isGenerated = false,
  });

  @override
  Widget build(BuildContext context) {
    final featureText = (why != null && why!.isNotEmpty)
        ? why!
        : traits.join(', ');

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: bmPrimaryColor.withValues(alpha: 0.25)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              _Thumbnail(name: name, imageAsset: imageAsset, imageUrl: imageUrl),
              if (isGenerated) ...[
                4.height,
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                  decoration: BoxDecoration(color: bmSpecialColorDark, borderRadius: BorderRadius.circular(6)),
                  child: Text('AI IMPRESSION', style: boldTextStyle(color: Colors.white, size: 7)),
                ),
              ],
            ],
          ),
          14.width,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: boldTextStyle(size: 16, color: bmSpecialColorDark)),
                4.height,
                Text(
                  VGCopy.similarityLabel(percent),
                  style: boldTextStyle(size: 13, color: bmSpecialColor),
                ),
                8.height,
                RichText(
                  text: TextSpan(
                    style: secondaryTextStyle(size: 12, height: 1.4),
                    children: [
                      TextSpan(
                        text: '${VGCopy.resultMatchFeaturesLabel} ',
                        style: boldTextStyle(size: 12, color: bmSpecialColorDark),
                      ),
                      TextSpan(text: featureText),
                    ],
                  ),
                  maxLines: 4,
                  overflow: TextOverflow.ellipsis,
                ),
                if (isGenerated) ...[
                  6.height,
                  Text(
                    'Photo is an AI-generated impression, not an actual picture of $name.',
                    style: secondaryTextStyle(size: 10, height: 1.3),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Thumbnail extends StatelessWidget {
  final String name;
  final String? imageAsset;
  final String? imageUrl;

  const _Thumbnail({
    required this.name,
    this.imageAsset,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    const size = 64.0;

    Widget child;
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      child = Image.network(
        imageUrl!,
        width: size,
        height: size,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _letterFallback(size),
        loadingBuilder: (context, child, progress) {
          if (progress == null) return child;
          return SizedBox(
            width: size,
            height: size,
            child: Center(
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: bmSpecialColor.withValues(alpha: 0.6),
                  value: progress.expectedTotalBytes != null
                      ? progress.cumulativeBytesLoaded / progress.expectedTotalBytes!
                      : null,
                ),
              ),
            ),
          );
        },
      );
    } else if (imageAsset != null && imageAsset!.isNotEmpty) {
      child = Image.asset(
        imageAsset!,
        width: size,
        height: size,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _letterFallback(size),
      );
    } else {
      child = _letterFallback(size);
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: SizedBox(width: size, height: size, child: child),
    );
  }

  Widget _letterFallback(double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [bmLightScaffoldBackgroundColor, bmPrimaryColor.withValues(alpha: 0.35)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      alignment: Alignment.center,
      child: Icon(Icons.person_outline, color: bmSpecialColor, size: size * 0.45),
    );
  }
}
