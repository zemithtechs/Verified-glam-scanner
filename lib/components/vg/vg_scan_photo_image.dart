import 'package:flutter/material.dart';

import '../../utils/BMColors.dart';
import '../../utils/vg_local_photo_io.dart' if (dart.library.html) '../../utils/vg_local_photo_web.dart' as local;
import '../../utils/vg_platform_file.dart';

/// Displays a scan photo from a local file path or remote signed URL.
class VGScanPhotoImage extends StatelessWidget {
  final String? photoPath;
  final BoxFit fit;
  final Alignment alignment;
  final Widget? placeholder;

  const VGScanPhotoImage({
    super.key,
    required this.photoPath,
    this.fit = BoxFit.cover,
    this.alignment = Alignment.center,
    this.placeholder,
  });

  static bool isRemoteUrl(String? path) {
    if (path == null || path.isEmpty) return false;
    return path.startsWith('http://') || path.startsWith('https://');
  }

  static bool isLocalFile(String? path) => vgLocalPathExists(path);

  @override
  Widget build(BuildContext context) {
    final path = photoPath;
    if (path != null && path.isNotEmpty) {
      if (isLocalFile(path)) {
        return local.vgLocalPhotoImage(
          path,
          fit: fit,
          alignment: alignment,
        );
      }
      if (isRemoteUrl(path)) {
        return Image.network(
          path,
          fit: fit,
          alignment: alignment,
          loadingBuilder: (context, child, progress) {
            if (progress == null) return child;
            return _defaultPlaceholder(showProgress: true);
          },
          errorBuilder: (_, __, ___) => _defaultPlaceholder(),
        );
      }
    }
    return _defaultPlaceholder();
  }

  Widget _defaultPlaceholder({bool showProgress = false}) {
    if (placeholder != null) return placeholder!;
    return Container(
      color: bmPrimaryColor.withValues(alpha: 0.2),
      alignment: Alignment.center,
      child: showProgress
          ? const SizedBox(
              width: 28,
              height: 28,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Icon(Icons.face_outlined, size: 80, color: bmSpecialColor.withValues(alpha: 0.5)),
    );
  }
}
