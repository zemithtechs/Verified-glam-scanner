import 'package:flutter/material.dart';
import 'package:nb_utils/nb_utils.dart';

import '../utils/BMColors.dart';
import '../utils/BMWidgets.dart';
import '../utils/vg_constants.dart';
import '../utils/vg_copy.dart';
import 'vg/vg_settings_sheet.dart';

class HomeFragmentHeadComponent extends StatelessWidget {
  const HomeFragmentHeadComponent({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return upperContainer(
      screenContext: context,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          40.height,
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(vgAppName, style: boldTextStyle(color: Colors.white, size: 18), maxLines: 1, overflow: TextOverflow.ellipsis),
                    4.height,
                    Text(VGCopy.homeGreeting, style: primaryTextStyle(color: Colors.white70, size: 14)),
                  ],
                ),
              ),
              8.width,
              Container(
                decoration: BoxDecoration(color: Colors.white, borderRadius: radius(100)),
                padding: const EdgeInsets.all(8),
                child: Icon(Icons.settings_outlined, color: bmSpecialColorDark, size: 28),
              ).onTap(() => showVGSettingsSheet(context)),
            ],
          ),
          12.height,
          Text(VGCopy.homeSubheading, style: secondaryTextStyle(color: Colors.white70, size: 13)),
          16.height,
        ],
      ),
    );
  }
}
