import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../utils/BMColors.dart';

enum VGLineArtMotif {
  face,
  palette,
  calendar,
  star,
  lightbulb,
  movie,
  symmetry,
  trophy,
  people,
  book,
  ratio,
  spa,
  diamond,
  brush,
  droplet,
  mirror,
  magic,
}

class VGViewfinderPainter extends CustomPainter {
  final Color color;

  VGViewfinderPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    const len = 14.0;
    const inset = 8.0;
    canvas.drawLine(Offset(inset, inset), Offset(inset + len, inset), paint);
    canvas.drawLine(Offset(inset, inset), Offset(inset, inset + len), paint);
    canvas.drawLine(Offset(size.width - inset, inset), Offset(size.width - inset - len, inset), paint);
    canvas.drawLine(Offset(size.width - inset, inset), Offset(size.width - inset, inset + len), paint);
    canvas.drawLine(Offset(inset, size.height - inset), Offset(inset + len, size.height - inset), paint);
    canvas.drawLine(Offset(inset, size.height - inset), Offset(inset, size.height - inset - len), paint);
    canvas.drawLine(Offset(size.width - inset, size.height - inset), Offset(size.width - inset - len, size.height - inset), paint);
    canvas.drawLine(Offset(size.width - inset, size.height - inset), Offset(size.width - inset, size.height - inset - len), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class VGLineArtPainter extends CustomPainter {
  final VGLineArtMotif motif;
  final Color color;

  VGLineArtPainter({required this.motif, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.8
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final cx = size.width / 2;
    final cy = size.height / 2;

    switch (motif) {
      case VGLineArtMotif.face:
        canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy), width: size.width * 0.55, height: size.height * 0.68), paint);
        canvas.drawOval(Rect.fromCenter(center: Offset(cx - 14, cy - 8), width: 10, height: 6), paint);
        canvas.drawOval(Rect.fromCenter(center: Offset(cx + 14, cy - 8), width: 10, height: 6), paint);
        canvas.drawArc(Rect.fromCenter(center: Offset(cx, cy + 8), width: 24, height: 12), 0.1, 3.0, false, paint);
      case VGLineArtMotif.palette:
        canvas.drawCircle(Offset(cx, cy), size.width * 0.28, paint);
        for (var i = 0; i < 5; i++) {
          final angle = i * 1.25;
          canvas.drawCircle(Offset(cx + 18 * math.cos(angle), cy + 18 * math.sin(angle)), 5, paint);
        }
      case VGLineArtMotif.calendar:
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy), width: 44, height: 40), const Radius.circular(4)), paint);
        canvas.drawLine(Offset(cx - 22, cy - 8), Offset(cx + 22, cy - 8), paint);
        canvas.drawLine(Offset(cx - 10, cy - 20), Offset(cx - 10, cy - 12), paint);
        canvas.drawLine(Offset(cx + 10, cy - 20), Offset(cx + 10, cy - 12), paint);
      case VGLineArtMotif.star:
        _drawStar(canvas, Offset(cx, cy), 20, paint);
      case VGLineArtMotif.lightbulb:
        canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy - 4), width: 26, height: 30), paint);
        canvas.drawLine(Offset(cx - 8, cy + 14), Offset(cx + 8, cy + 14), paint);
        canvas.drawLine(Offset(cx - 6, cy + 18), Offset(cx + 6, cy + 18), paint);
      case VGLineArtMotif.movie:
        canvas.drawRect(Rect.fromCenter(center: Offset(cx, cy), width: 40, height: 28), paint);
        canvas.drawLine(Offset(cx - 12, cy - 14), Offset(cx - 12, cy + 14), paint);
        canvas.drawLine(Offset(cx + 12, cy - 14), Offset(cx + 12, cy + 14), paint);
      case VGLineArtMotif.symmetry:
        canvas.drawLine(Offset(cx, cy - 24), Offset(cx, cy + 24), paint);
        canvas.drawOval(Rect.fromCenter(center: Offset(cx - 16, cy), width: 22, height: 30), paint);
        canvas.drawOval(Rect.fromCenter(center: Offset(cx + 16, cy), width: 22, height: 30), paint);
      case VGLineArtMotif.trophy:
        canvas.drawPath(Path()..moveTo(cx - 16, cy + 16)..lineTo(cx + 16, cy + 16)..lineTo(cx + 10, cy - 4)..lineTo(cx - 10, cy - 4)..close(), paint);
        canvas.drawArc(Rect.fromCenter(center: Offset(cx - 18, cy - 2), width: 14, height: 18), -1.2, 1.2, false, paint);
        canvas.drawArc(Rect.fromCenter(center: Offset(cx + 18, cy - 2), width: 14, height: 18), 2.0, 1.2, false, paint);
      case VGLineArtMotif.people:
        canvas.drawCircle(Offset(cx - 12, cy - 10), 8, paint);
        canvas.drawArc(Rect.fromCenter(center: Offset(cx - 12, cy + 12), width: 24, height: 20), 3.4, 2.8, false, paint);
        canvas.drawCircle(Offset(cx + 12, cy - 8), 7, paint);
        canvas.drawArc(Rect.fromCenter(center: Offset(cx + 12, cy + 14), width: 20, height: 18), 3.4, 2.8, false, paint);
      case VGLineArtMotif.book:
        canvas.drawRect(Rect.fromCenter(center: Offset(cx, cy), width: 34, height: 42), paint);
        canvas.drawLine(Offset(cx, cy - 21), Offset(cx, cy + 21), paint);
      case VGLineArtMotif.ratio:
        canvas.drawRect(Rect.fromCenter(center: Offset(cx, cy), width: 36, height: 36), paint);
        canvas.drawLine(Offset(cx - 18, cy + 18), Offset(cx + 18, cy - 18), paint);
        canvas.drawCircle(Offset(cx - 6, cy - 6), 4, paint);
        canvas.drawCircle(Offset(cx + 8, cy + 8), 4, paint);
      case VGLineArtMotif.spa:
        // Lotus: a center petal plus two symmetric side petals on a calm base line.
        canvas.drawPath(Path()..moveTo(cx, cy + 12)..quadraticBezierTo(cx - 7, cy - 6, cx, cy - 20)..quadraticBezierTo(cx + 7, cy - 6, cx, cy + 12), paint);
        canvas.drawPath(Path()..moveTo(cx, cy + 10)..quadraticBezierTo(cx - 20, cy - 2, cx - 22, cy - 16)..quadraticBezierTo(cx - 6, cy - 12, cx, cy + 10), paint..strokeWidth = 1.5);
        canvas.drawPath(Path()..moveTo(cx, cy + 10)..quadraticBezierTo(cx + 20, cy - 2, cx + 22, cy - 16)..quadraticBezierTo(cx + 6, cy - 12, cx, cy + 10), paint..strokeWidth = 1.5);
        canvas.drawArc(Rect.fromCenter(center: Offset(cx, cy + 12), width: 34, height: 10), 0.15, 2.85, false, paint..strokeWidth = 1.8);
      case VGLineArtMotif.diamond:
        // Faceted gem cut: table top, girdle, and pavilion facet lines.
        final top = Offset(cx, cy - 20);
        final left = Offset(cx - 18, cy - 4);
        final right = Offset(cx + 18, cy - 4);
        final bottom = Offset(cx, cy + 20);
        canvas.drawPath(Path()..moveTo(top.dx, top.dy)..lineTo(left.dx, left.dy)..lineTo(bottom.dx, bottom.dy)..lineTo(right.dx, right.dy)..close(), paint);
        canvas.drawLine(left, right, paint..strokeWidth = 1.4);
        canvas.drawLine(Offset(cx, cy - 4), bottom, paint..strokeWidth = 1.2);
        canvas.drawLine(Offset(cx - 9, cy - 4), Offset(cx, top.dy), paint..strokeWidth = 1.0);
        canvas.drawLine(Offset(cx + 9, cy - 4), Offset(cx, top.dy), paint..strokeWidth = 1.0);
        _drawStar(canvas, Offset(cx + 14, cy - 20), 3.5, paint..strokeWidth = 1.4);
      case VGLineArtMotif.brush:
        // Angled makeup brush: fanned bristle head, ferrule band, handle.
        canvas.save();
        canvas.translate(cx, cy);
        canvas.rotate(-0.6);
        final bristles = Path()
          ..moveTo(-11, -20)
          ..quadraticBezierTo(0, -30, 11, -20)
          ..quadraticBezierTo(9, -8, 0, -4)
          ..quadraticBezierTo(-9, -8, -11, -20)
          ..close();
        canvas.drawPath(bristles, paint..strokeWidth = 1.6);
        canvas.drawLine(const Offset(-6, -4), const Offset(-6, 3), paint..strokeWidth = 3);
        canvas.drawLine(const Offset(6, -4), const Offset(6, 3), paint..strokeWidth = 3);
        canvas.drawLine(const Offset(-3, 3), const Offset(-1, 20), paint..strokeWidth = 2.2);
        canvas.drawLine(const Offset(3, 3), const Offset(1, 20), paint..strokeWidth = 2.2);
        canvas.restore();
      case VGLineArtMotif.droplet:
        // Water drop with a glossy highlight arc.
        canvas.drawPath(Path()..moveTo(cx, cy - 18)..quadraticBezierTo(cx + 16, cy + 4, cx, cy + 18)..quadraticBezierTo(cx - 16, cy + 4, cx, cy - 18), paint);
        canvas.drawArc(Rect.fromCenter(center: Offset(cx - 4, cy + 2), width: 10, height: 14), 3.6, 1.6, false, paint..strokeWidth = 1.3);
      case VGLineArtMotif.mirror:
        // Hand mirror: double-ring frame, neck, base, and a corner shine mark.
        canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy - 6), width: 30, height: 36), paint);
        canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy - 6), width: 24, height: 29), paint..strokeWidth = 1.1);
        canvas.drawLine(Offset(cx, cy + 12), Offset(cx, cy + 24), paint..strokeWidth = 2.2);
        canvas.drawLine(Offset(cx - 9, cy + 24), Offset(cx + 9, cy + 24), paint..strokeWidth = 2.2);
        canvas.drawLine(Offset(cx - 6, cy - 16), Offset(cx - 3, cy - 11), paint..strokeWidth = 1.4);
      case VGLineArtMotif.magic:
        // Wand with a star tip and two accent sparkles trailing its arc.
        canvas.drawLine(Offset(cx - 13, cy + 15), Offset(cx + 9, cy - 9), paint..strokeWidth = 2.6);
        _drawStar(canvas, Offset(cx + 13, cy - 15), 7, paint..strokeWidth = 1.6);
        _drawStar(canvas, Offset(cx - 15, cy - 4), 4, paint..strokeWidth = 1.3);
        _drawStar(canvas, Offset(cx + 2, cy + 14), 3, paint..strokeWidth = 1.2);
    }
  }

  void _drawStar(Canvas canvas, Offset center, double radius, Paint paint) {
    final path = Path();
    for (var i = 0; i < 5; i++) {
      final angle = (i * 4 * math.pi / 5) - math.pi / 2;
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant VGLineArtPainter oldDelegate) => oldDelegate.motif != motif;
}

VGLineArtMotif motifForAestheticId(String id) {
  switch (id) {
    case 'effortless':
      return VGLineArtMotif.spa;
    case 'luminous':
      return VGLineArtMotif.diamond;
    case 'vivid':
      return VGLineArtMotif.brush;
    case 'bare':
      return VGLineArtMotif.droplet;
    case 'polished':
      return VGLineArtMotif.mirror;
    case 'surprise':
      return VGLineArtMotif.magic;
    default:
      return VGLineArtMotif.face;
  }
}

VGLineArtMotif motifForFeatureType(String featureType) {
  switch (featureType) {
    case 'FACE_BEAUTY_ANALYSIS':
      return VGLineArtMotif.face;
    case 'COLOR_ANALYSIS':
      return VGLineArtMotif.palette;
    case 'GLOW_UP_GUIDE':
      return VGLineArtMotif.calendar;
    case 'BEST_FACE_PART':
      return VGLineArtMotif.star;
    case 'BEAUTY_TIPS':
      return VGLineArtMotif.lightbulb;
    case 'CELEBRITY_LOOKALIKE':
      return VGLineArtMotif.movie;
    case 'FACIAL_SYMMETRY':
      return VGLineArtMotif.symmetry;
    case 'BEAUTY_SCORE_SHOWDOWN':
      return VGLineArtMotif.trophy;
    case 'FACIAL_RESEMBLANCE':
      return VGLineArtMotif.people;
    case 'FACE_READING':
      return VGLineArtMotif.book;
    case 'GOLDEN_RATIO':
      return VGLineArtMotif.ratio;
    default:
      return VGLineArtMotif.face;
  }
}

class VGLineArtIllustration extends StatelessWidget {
  final VGLineArtMotif motif;
  final double size;
  final bool showViewfinder;

  const VGLineArtIllustration({
    super.key,
    required this.motif,
    this.size = 88,
    this.showViewfinder = true,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: size,
      width: size,
      child: showViewfinder
          ? CustomPaint(
              painter: VGViewfinderPainter(color: bmPrimaryColor.withValues(alpha: 0.5)),
              child: _circleArt(),
            )
          : _circleArt(),
    );
  }

  Widget _circleArt() {
    return Center(
      child: Container(
        height: size * 0.72,
        width: size * 0.72,
        decoration: BoxDecoration(color: bmLightScaffoldBackgroundColor, shape: BoxShape.circle),
        child: CustomPaint(
          painter: VGLineArtPainter(motif: motif, color: bmSpecialColor),
        ),
      ),
    );
  }
}
