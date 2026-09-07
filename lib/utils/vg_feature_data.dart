import 'package:flutter/material.dart';

import '../models/vg_feature_model.dart';
import 'vg_assets.dart';
import 'vg_constants.dart';
import 'vg_copy.dart';

List<VGFeatureModel> getVerifiedGlamFeatures() {
  return const [
    VGFeatureModel(
      featureType: VGFeatureTypes.faceBeautyAnalysis,
      title: 'Face Beauty Analysis',
      description: 'Discover your beauty score with an instant facial feature analysis.',
      icon: Icons.face_retouching_natural,
      thumbnailAsset: vgFeatureThumbFaceBeautyAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.colorAnalysis,
      title: 'Seasonal Color Palette',
      description: 'Get your personalized color palette in under 60 seconds.',
      icon: Icons.palette_outlined,
      badge: 'NEW',
      isPro: true,
      thumbnailAsset: vgFeatureThumbColorAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.glowUpGuide,
      title: 'Beauty Routine Challenge',
      description: VGCopy.featureDescGlowUpGuide,
      icon: Icons.calendar_month_outlined,
      isPro: true,
      thumbnailAsset: vgFeatureThumbGlowUpAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.beautyTips,
      title: 'Beauty Tips',
      description: VGCopy.featureDescBeautyTips,
      icon: Icons.lightbulb_outline,
      isPro: true,
      thumbnailAsset: vgFeatureThumbBeautyTipsAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.celebrityLookalike,
      title: 'Celebrity Look Alike',
      description: VGCopy.featureDescCelebrity,
      icon: Icons.movie_filter_outlined,
      badge: 'HOT',
      isPro: true,
      thumbnailAsset: vgFeatureThumbCelebrityAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.facialSymmetry,
      title: 'Facial Symmetry',
      description: VGCopy.featureDescFacialSymmetry,
      icon: Icons.compare_arrows,
      badge: 'NEW',
      isPro: true,
      thumbnailAsset: vgFeatureThumbSymmetryAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.beautyScoreShowdown,
      title: 'Beauty Score Showdown',
      description: VGCopy.featureDescShowdown,
      icon: Icons.emoji_events_outlined,
      badge: 'HOT',
      isPro: true,
      thumbnailAsset: vgFeatureThumbShowdownAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.facialResemblance,
      title: 'Face Comparison',
      description: VGCopy.featureDescResemblance,
      icon: Icons.people_outline,
      isPro: true,
      thumbnailAsset: vgFeatureThumbResemblanceAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.faceReading,
      title: 'Attractiveness Test',
      description: VGCopy.featureDescAttractiveness,
      icon: Icons.speed_outlined,
      isPro: true,
      thumbnailAsset: vgFeatureThumbAttractivenessAsset,
    ),
    VGFeatureModel(
      featureType: VGFeatureTypes.goldenRatio,
      title: 'Face Golden Ratio',
      description: VGCopy.featureDescGoldenRatio,
      icon: Icons.architecture_outlined,
      isPro: true,
      thumbnailAsset: vgFeatureThumbGoldenRatioAsset,
    ),
  ];
}

List<VGFeatureModel> getFeaturedGlamFeatures() {
  final all = getVerifiedGlamFeatures();
  return [
    all.firstWhere((f) => f.featureType == VGFeatureTypes.faceBeautyAnalysis),
    all.firstWhere((f) => f.featureType == VGFeatureTypes.colorAnalysis),
    all.firstWhere((f) => f.featureType == VGFeatureTypes.facialSymmetry),
  ];
}
