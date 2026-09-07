import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../../../utils/BMColors.dart';
import '../../../utils/vg_copy.dart';
import '../../../utils/vg_error_utils.dart';
import '../../../utils/vg_navigation.dart';

/// Dialog for scan/analysis failures with optional retry.
Future<bool?> showVGScanErrorDialog(
  BuildContext context, {
  required VGAnalysisFailure failure,
}) {
  final needsPlans = failure.errorCode == 'INSUFFICIENT_CREDITS' ||
      failure.errorCode == 'NOT_SUBSCRIBED' ||
      failure.errorCode == 'FREE_LIMIT_REACHED';

  return showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text(
        vgAnalysisErrorTitle(failure.errorCode),
        style: boldTextStyle(color: bmSpecialColorDark, size: 18),
      ),
      content: Text(
        failure.message,
        style: primaryTextStyle(size: 14, height: 1.45),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(ctx).pop(false),
          child: Text(VGCopy.scanErrorCancel, style: primaryTextStyle(color: appTextColorSecondary)),
        ),
        if (needsPlans)
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop(false);
              vgShowPricingOrPaywall(context);
            },
            child: Text(VGCopy.scanErrorViewPlans, style: boldTextStyle(color: bmSpecialColor)),
          )
        else
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(VGCopy.scanErrorTryAgain, style: boldTextStyle(color: bmSpecialColor)),
          ),
      ],
    ),
  );
}
