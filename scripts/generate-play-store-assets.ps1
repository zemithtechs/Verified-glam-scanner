Set-StrictMode -Version Latest

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $repoRoot 'images\vg\play-store'
$featureDir = Join-Path $repoRoot 'images\vg\features'
$appIconDir = Join-Path $outDir 'app-icon'
$featureUploadDir = Join-Path $outDir 'feature-graphic'
$phoneUploadDir = Join-Path $outDir 'phone-screenshots'
$tablet7Dir = Join-Path $outDir '7-inch-tablet-screenshots'
$tablet10Dir = Join-Path $outDir '10-inch-tablet-screenshots'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $appIconDir | Out-Null
New-Item -ItemType Directory -Force -Path $featureUploadDir | Out-Null
New-Item -ItemType Directory -Force -Path $phoneUploadDir | Out-Null
New-Item -ItemType Directory -Force -Path $tablet7Dir | Out-Null
New-Item -ItemType Directory -Force -Path $tablet10Dir | Out-Null

$W = 1080
$H = 1920
$brandDark = [System.Drawing.Color]::FromArgb(0x52, 0x0D, 0x1C)
$brand = [System.Drawing.Color]::FromArgb(0x87, 0x2B, 0x3F)
$rose = [System.Drawing.Color]::FromArgb(0xC7, 0x9A, 0x9A)
$blush = [System.Drawing.Color]::FromArgb(0xF6, 0xE3, 0xE3)
$paper = [System.Drawing.Color]::FromArgb(0xFF, 0xF7, 0xF7)
$ink = [System.Drawing.Color]::FromArgb(0x21, 0x21, 0x21)
$muted = [System.Drawing.Color]::FromArgb(0x6B, 0x4A, 0x52)
$cyan = [System.Drawing.Color]::FromArgb(0x00, 0xE5, 0xFF)
$green = [System.Drawing.Color]::FromArgb(0x4A, 0xDE, 0x80)

function ColorA([int]$a, [System.Drawing.Color]$c) {
    [System.Drawing.Color]::FromArgb($a, $c.R, $c.G, $c.B)
}

function New-RoundRectPath([System.Drawing.RectangleF]$rect, [float]$radius) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $d = $radius * 2
    $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
    $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
    $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-Canvas([int]$width, [int]$height) {
    $bmp = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    return @{ Bitmap = $bmp; Graphics = $g }
}

function Draw-Background($g, [int]$width, [int]$height) {
    $rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $blush, $paper, 40)
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    $penWhite = [System.Drawing.Pen]::new((ColorA 95 ([System.Drawing.Color]::White)), 3)
    $penRose = [System.Drawing.Pen]::new((ColorA 42 $rose), 2)
    for ($i = 0; $i -lt 14; $i++) {
        $offset = $i * 28
        $g.DrawArc($penWhite, -320 + $offset, 230 + $offset, 840, 540, 198, 128)
        $g.DrawArc($penRose, $width - 620 + $offset, $height - 620 + $offset, 820, 520, 25, 135)
    }
    $penWhite.Dispose()
    $penRose.Dispose()
}

function Draw-Text($g, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size, [bool]$bold, [System.Drawing.Color]$color, [string]$align = 'Near') {
    $style = if ($bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
    $font = [System.Drawing.Font]::new('Segoe UI', $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::$align
    $format.LineAlignment = [System.Drawing.StringAlignment]::Near
    $brush = [System.Drawing.SolidBrush]::new($color)
    $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x, $y, $w, $h), $format)
    $brush.Dispose()
    $format.Dispose()
    $font.Dispose()
}

function Draw-ImageCover($g, [System.Drawing.Image]$img, [System.Drawing.RectangleF]$dest) {
    $scale = [Math]::Max($dest.Width / $img.Width, $dest.Height / $img.Height)
    $srcW = $dest.Width / $scale
    $srcH = $dest.Height / $scale
    $srcX = ($img.Width - $srcW) / 2
    $srcY = ($img.Height - $srcH) / 2
    $src = [System.Drawing.RectangleF]::new($srcX, $srcY, $srcW, $srcH)
    $g.DrawImage($img, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-ScoreRing($g, [float]$x, [float]$y, [float]$size, [string]$score, [System.Drawing.Color]$accent) {
    $rect = [System.Drawing.RectangleF]::new($x, $y, $size, $size)
    $bgPen = [System.Drawing.Pen]::new((ColorA 46 $rose), 19)
    $fgPen = [System.Drawing.Pen]::new($accent, 19)
    $fgPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $fgPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawArc($bgPen, $rect, -90, 360)
    $g.DrawArc($fgPen, $rect, -90, 318)
    Draw-Text $g $score ($x + 8) ($y + ($size * 0.30)) ($size - 16) 90 48 $true $brandDark 'Center'
    $bgPen.Dispose()
    $fgPen.Dispose()
}

function Draw-FaceOverlay($g, [System.Drawing.RectangleF]$r, [string]$mode) {
    $line = [System.Drawing.Pen]::new((ColorA 190 $cyan), 2)
    $thin = [System.Drawing.Pen]::new((ColorA 160 $brand), 2)
    $white = [System.Drawing.Pen]::new((ColorA 190 ([System.Drawing.Color]::White)), 2)
    $dash = [System.Drawing.Pen]::new((ColorA 140 $brand), 2)
    $dash.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash

    $cx = $r.X + ($r.Width / 2)
    $top = $r.Y + ($r.Height * 0.14)
    $bottom = $r.Y + ($r.Height * 0.86)
    $left = $r.X + ($r.Width * 0.22)
    $right = $r.X + ($r.Width * 0.78)

    if ($mode -eq 'golden') {
        for ($i = 0; $i -le 5; $i++) {
            $x = $left + (($right - $left) / 5) * $i
            $g.DrawLine($dash, $x, $top, $x, $bottom)
        }
        for ($i = 0; $i -le 5; $i++) {
            $y = $top + (($bottom - $top) / 5) * $i
            $g.DrawLine($thin, $left, $y, $right, $y)
        }
        $g.DrawRectangle($line, $left, $top, $right - $left, $bottom - $top)
    } elseif ($mode -eq 'symmetry') {
        $g.DrawLine([System.Drawing.Pen]::new((ColorA 220 $brand), 4), $cx, $top, $cx, $bottom)
        $g.DrawEllipse($white, $left, $top, $right - $left, $bottom - $top)
        $g.DrawLine($dash, $left, $r.Y + ($r.Height * 0.42), $right, $r.Y + ($r.Height * 0.42))
    } elseif ($mode -eq 'palette') {
        $colors = @('#872B3F', '#C79A9A', '#F6E3E3', '#5C6B4A', '#C67B5C', '#1E4D4A')
        for ($i = 0; $i -lt $colors.Count; $i++) {
            $c = [System.Drawing.ColorTranslator]::FromHtml($colors[$i])
            $b = [System.Drawing.SolidBrush]::new($c)
            $g.FillEllipse($b, $r.X + 22 + ($i * 38), $r.Bottom - 70, 30, 30)
            $b.Dispose()
        }
        $g.DrawEllipse($line, $left, $top, $right - $left, $bottom - $top)
    } else {
        $points = @(
            [System.Drawing.PointF]::new($cx, $top),
            [System.Drawing.PointF]::new($right, $r.Y + ($r.Height * 0.35)),
            [System.Drawing.PointF]::new($right - 28, $bottom),
            [System.Drawing.PointF]::new($cx, $bottom + 24),
            [System.Drawing.PointF]::new($left + 28, $bottom),
            [System.Drawing.PointF]::new($left, $r.Y + ($r.Height * 0.35))
        )
        $g.DrawPolygon($line, $points)
        foreach ($p in $points) { $g.DrawLine($white, $cx, $r.Y + ($r.Height * 0.48), $p.X, $p.Y) }
        $g.DrawLine($dash, $cx, $top, $cx, $bottom + 24)
        $g.DrawLine($dash, $left, $r.Y + ($r.Height * 0.42), $right, $r.Y + ($r.Height * 0.42))
    }

    $line.Dispose()
    $thin.Dispose()
    $white.Dispose()
    $dash.Dispose()
}

function New-PhoneBitmap([int]$pw, [int]$ph, [string]$assetPath, [string]$screenTitle, [string]$mode, [string]$score) {
    $phone = [System.Drawing.Bitmap]::new($pw, $ph, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($phone)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $outer = [System.Drawing.RectangleF]::new(0, 0, $pw - 1, $ph - 1)
    $outerPath = New-RoundRectPath $outer 82
    $metal = [System.Drawing.Drawing2D.LinearGradientBrush]::new([System.Drawing.Rectangle]::new(0, 0, $pw, $ph), [System.Drawing.Color]::FromArgb(245, 245, 248), [System.Drawing.Color]::FromArgb(40, 40, 44), 20)
    $g.FillPath($metal, $outerPath)
    $g.DrawPath([System.Drawing.Pen]::new([System.Drawing.Color]::Black, 8), $outerPath)
    $metal.Dispose()

    $screen = [System.Drawing.RectangleF]::new(24, 24, $pw - 48, $ph - 48)
    $screenPath = New-RoundRectPath $screen 62
    $g.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), $screenPath)
    $oldClip = $g.Clip
    $g.SetClip($screenPath)

    $appBar = [System.Drawing.RectangleF]::new($screen.X, $screen.Y, $screen.Width, 106)
    $barBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new([System.Drawing.Rectangle]::Round($appBar), $brandDark, $brand, 0)
    $g.FillRectangle($barBrush, $appBar)
    $barBrush.Dispose()
    Draw-Text $g $screenTitle ($screen.X + 78) ($screen.Y + 35) ($screen.Width - 150) 50 28 $true ([System.Drawing.Color]::White)

    $notch = New-RoundRectPath ([System.Drawing.RectangleF]::new(($pw / 2) - 92, 24, 184, 44)) 22
    $g.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::Black), $notch)

    $photo = [System.Drawing.RectangleF]::new($screen.X + 28, $screen.Y + 126, $screen.Width - 56, $ph * 0.46)
    $photoPath = New-RoundRectPath $photo 28
    $img = [System.Drawing.Image]::FromFile($assetPath)
    $g.SetClip($photoPath)
    Draw-ImageCover $g $img $photo
    $g.SetClip($screenPath)
    Draw-FaceOverlay $g $photo $mode
    $img.Dispose()

    $bottom = [System.Drawing.RectangleF]::new($screen.X + 28, $photo.Bottom + 24, $screen.Width - 56, 300)
    $bottomPath = New-RoundRectPath $bottom 34
    $g.FillPath([System.Drawing.SolidBrush]::new($paper), $bottomPath)
    Draw-ScoreRing $g ($bottom.X + 32) ($bottom.Y + 38) 150 $score $brand
    $rowX = $bottom.X + 230
    $rowY = $bottom.Y + 58
    for ($i = 0; $i -lt 4; $i++) {
        $circleBrush = [System.Drawing.SolidBrush]::new((ColorA 45 $rose))
        $g.FillEllipse($circleBrush, $rowX, $rowY + ($i * 52), 34, 34)
        $circleBrush.Dispose()
        $barBg = [System.Drawing.Pen]::new((ColorA 70 $rose), 13)
        $barFg = [System.Drawing.Pen]::new($brand, 13)
        $barBg.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $barBg.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $barFg.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $barFg.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $g.DrawLine($barBg, $rowX + 54, $rowY + 17 + ($i * 52), $bottom.Right - 28, $rowY + 17 + ($i * 52))
        $g.DrawLine($barFg, $rowX + 54, $rowY + 17 + ($i * 52), $bottom.Right - 78 - ($i * 22), $rowY + 17 + ($i * 52))
        $barBg.Dispose()
        $barFg.Dispose()
    }

    $nav = [System.Drawing.RectangleF]::new($screen.X, $screen.Bottom - 98, $screen.Width, 98)
    $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), $nav)
    for ($i = 0; $i -lt 3; $i++) {
        $x = $screen.X + 105 + ($i * (($screen.Width - 210) / 2))
        $navBrush = [System.Drawing.SolidBrush]::new($(if ($i -eq 1) { $brand } else { (ColorA 115 $rose) }))
        $g.FillEllipse($navBrush, $x - 14, $nav.Y + 30, 28, 28)
        $navBrush.Dispose()
    }

    $g.Clip = $oldClip
    $g.DrawPath([System.Drawing.Pen]::new((ColorA 45 ([System.Drawing.Color]::White)), 2), $screenPath)

    $oldClip.Dispose()
    $outerPath.Dispose()
    $screenPath.Dispose()
    $photoPath.Dispose()
    $bottomPath.Dispose()
    $notch.Dispose()
    $g.Dispose()
    return $phone
}

function Draw-Phone($g, [System.Drawing.Bitmap]$phone, [float]$cx, [float]$cy, [float]$scale, [float]$angle) {
    $state = $g.Save()
    $g.TranslateTransform($cx, $cy)
    $g.RotateTransform($angle)
    $w = $phone.Width * $scale
    $h = $phone.Height * $scale
    $shadowRect = [System.Drawing.RectangleF]::new((-1 * $w / 2) + 20, (-1 * $h / 2) + 30, $w, $h)
    $shadowPath = New-RoundRectPath $shadowRect 90
    $g.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(42, 0, 0, 0)), $shadowPath)
    $g.DrawImage($phone, [System.Drawing.RectangleF]::new((-1 * $w / 2), (-1 * $h / 2), $w, $h))
    $shadowPath.Dispose()
    $g.Restore($state)
}

function Draw-ExternalBadge($g, [float]$x, [float]$y, [string]$label, [string]$value) {
    $r = [System.Drawing.RectangleF]::new($x, $y, 190, 190)
    $g.FillEllipse([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), $r)
    $g.DrawEllipse([System.Drawing.Pen]::new($green, 16), $r)
    $valueSize = if ($value.Length -le 2) { 62 } elseif ($value.Length -le 3) { 54 } else { 42 }
    Draw-Text $g $label ($x + 18) ($y + 38) 154 42 28 $false $brandDark 'Center'
    Draw-Text $g $value ($x + 18) ($y + 86) 154 76 $valueSize $true $brandDark 'Center'
}

function Save-Png([System.Drawing.Bitmap]$bmp, [string]$path) {
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Save-ResizedPng([string]$source, [string]$dest, [int]$width, [int]$height) {
    $src = [System.Drawing.Image]::FromFile($source)
    $bmp = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, [System.Drawing.Rectangle]::new(0, 0, $width, $height))
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
}

function Draw-AppIcon([string]$logoPath, [string]$dest) {
    $canvas = New-Canvas 512 512
    $rect = [System.Drawing.Rectangle]::new(0, 0, 512, 512)
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $brandDark, $brand, 40)
    $canvas.Graphics.FillRectangle($brush, $rect)
    $brush.Dispose()

    for ($i = 0; $i -lt 8; $i++) {
        $canvas.Graphics.DrawArc([System.Drawing.Pen]::new((ColorA 70 $rose), 3), 245 + ($i * 16), -38 + ($i * 9), 330, 260, 116, 194)
        $canvas.Graphics.DrawArc([System.Drawing.Pen]::new((ColorA 55 ([System.Drawing.Color]::White)), 3), -155 + ($i * 14), 280 + ($i * 11), 370, 230, 208, 126)
    }

    $badge = [System.Drawing.RectangleF]::new(66, 66, 380, 380)
    $canvas.Graphics.FillEllipse([System.Drawing.SolidBrush]::new($paper), $badge)
    $canvas.Graphics.DrawEllipse([System.Drawing.Pen]::new($rose, 10), $badge)

    $logo = [System.Drawing.Image]::FromFile($logoPath)
    $canvas.Graphics.DrawImage($logo, [System.Drawing.RectangleF]::new(126, 112, 260, 260))
    $logo.Dispose()

    $line = [System.Drawing.Pen]::new((ColorA 205 $brand), 5)
    $thin = [System.Drawing.Pen]::new((ColorA 185 $rose), 3)
    $canvas.Graphics.DrawEllipse($thin, 151, 151, 210, 238)
    $canvas.Graphics.DrawLine($line, 256, 122, 256, 407)
    $canvas.Graphics.DrawLine($thin, 133, 258, 379, 258)
    $canvas.Graphics.DrawLine($thin, 168, 198, 344, 319)
    $canvas.Graphics.DrawLine($thin, 344, 198, 168, 319)
    $line.Dispose()
    $thin.Dispose()

    Save-Png $canvas.Bitmap $dest
    $canvas.Graphics.Dispose()
    $canvas.Bitmap.Dispose()
}

function Draw-MetricRows($g, [float]$x, [float]$y, [float]$w, [float]$scale) {
    $labels = @('Symmetry', 'Skin tone', 'Features', 'Balance')
    for ($i = 0; $i -lt $labels.Count; $i++) {
        $rowY = $y + ($i * 78 * $scale)
        $dot = [System.Drawing.SolidBrush]::new((ColorA 58 $rose))
        $g.FillEllipse($dot, $x, $rowY + (10 * $scale), 36 * $scale, 36 * $scale)
        $dot.Dispose()

        Draw-Text $g $labels[$i] ($x + (54 * $scale)) $rowY ($w - (54 * $scale)) (32 * $scale) (23 * $scale) $true $brandDark

        $bg = [System.Drawing.Pen]::new((ColorA 70 $rose), 13 * $scale)
        $fg = [System.Drawing.Pen]::new($brand, 13 * $scale)
        $bg.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $bg.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $fg.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $fg.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $barX = $x + (54 * $scale)
        $barY = $rowY + (48 * $scale)
        $g.DrawLine($bg, $barX, $barY, $x + $w, $barY)
        $g.DrawLine($fg, $barX, $barY, $x + $w - ((42 + ($i * 34)) * $scale), $barY)
        $bg.Dispose()
        $fg.Dispose()
    }
}

function Draw-SmallCard($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$title, [string]$value, [float]$scale) {
    $path = New-RoundRectPath ([System.Drawing.RectangleF]::new($x, $y, $w, $h)) (24 * $scale)
    $g.FillPath([System.Drawing.SolidBrush]::new($paper), $path)
    $g.DrawPath([System.Drawing.Pen]::new((ColorA 52 $rose), 2 * $scale), $path)
    Draw-Text $g $title ($x + (24 * $scale)) ($y + (20 * $scale)) ($w - (48 * $scale)) (34 * $scale) (22 * $scale) $false $muted
    Draw-Text $g $value ($x + (24 * $scale)) ($y + (58 * $scale)) ($w - (48 * $scale)) (58 * $scale) (38 * $scale) $true $brandDark
    $path.Dispose()
}

function New-TabletArtwork([int]$canvasW, [int]$canvasH, [hashtable]$spec, [string]$dest) {
    $scale = $canvasW / 1440
    $canvas = New-Canvas $canvasW $canvasH
    Draw-Background $canvas.Graphics $canvasW $canvasH

    Draw-Text $canvas.Graphics $spec.Head (96 * $scale) (82 * $scale) ($canvasW - (192 * $scale)) (92 * $scale) (66 * $scale) $true $ink 'Center'
    Draw-Text $canvas.Graphics $spec.Sub (126 * $scale) (170 * $scale) ($canvasW - (252 * $scale)) (62 * $scale) (34 * $scale) $false $muted 'Center'

    $tx = 96 * $scale
    $ty = 390 * $scale
    $tw = $canvasW - (192 * $scale)
    $th = 1660 * $scale
    if ($canvasH -gt 2800) {
        $ty = 390 * $scale
        $th = 2000 * $scale
    }

    $shadow = New-RoundRectPath ([System.Drawing.RectangleF]::new($tx + (28 * $scale), $ty + (36 * $scale), $tw, $th)) (64 * $scale)
    $canvas.Graphics.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(38, 0, 0, 0)), $shadow)
    $shadow.Dispose()

    $outer = New-RoundRectPath ([System.Drawing.RectangleF]::new($tx, $ty, $tw, $th)) (64 * $scale)
    $metal = [System.Drawing.Drawing2D.LinearGradientBrush]::new([System.Drawing.Rectangle]::new([int]$tx, [int]$ty, [int]$tw, [int]$th), [System.Drawing.Color]::FromArgb(246, 246, 248), [System.Drawing.Color]::FromArgb(70, 70, 74), 35)
    $canvas.Graphics.FillPath($metal, $outer)
    $canvas.Graphics.DrawPath([System.Drawing.Pen]::new([System.Drawing.Color]::Black, 7 * $scale), $outer)
    $metal.Dispose()

    $screen = [System.Drawing.RectangleF]::new($tx + (34 * $scale), $ty + (34 * $scale), $tw - (68 * $scale), $th - (68 * $scale))
    $screenPath = New-RoundRectPath $screen (44 * $scale)
    $canvas.Graphics.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), $screenPath)
    $oldClip = $canvas.Graphics.Clip
    $canvas.Graphics.SetClip($screenPath)

    $topBar = [System.Drawing.RectangleF]::new($screen.X, $screen.Y, $screen.Width, 108 * $scale)
    $barBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new([System.Drawing.Rectangle]::Round($topBar), $brandDark, $brand, 0)
    $canvas.Graphics.FillRectangle($barBrush, $topBar)
    $barBrush.Dispose()
    Draw-Text $canvas.Graphics 'Verified Glam' ($topBar.X + (38 * $scale)) ($topBar.Y + (29 * $scale)) (270 * $scale) (48 * $scale) (31 * $scale) $true ([System.Drawing.Color]::White)
    Draw-Text $canvas.Graphics $spec.Screen ($topBar.X + (330 * $scale)) ($topBar.Y + (31 * $scale)) (470 * $scale) (46 * $scale) (28 * $scale) $true (ColorA 232 $paper)

    $navW = 166 * $scale
    $navRect = [System.Drawing.RectangleF]::new($screen.X, $screen.Y + $topBar.Height, $navW, $screen.Height - $topBar.Height)
    $canvas.Graphics.FillRectangle([System.Drawing.SolidBrush]::new($paper), $navRect)
    for ($i = 0; $i -lt 5; $i++) {
        $cx = $navRect.X + ($navW / 2)
        $cy = $navRect.Y + (96 * $scale) + ($i * 132 * $scale)
        $fill = if ($i -eq 0) { $brand } else { (ColorA 80 $rose) }
        $canvas.Graphics.FillEllipse([System.Drawing.SolidBrush]::new($fill), $cx - (28 * $scale), $cy - (28 * $scale), 56 * $scale, 56 * $scale)
    }

    $contentX = $screen.X + $navW + (38 * $scale)
    $contentY = $screen.Y + $topBar.Height + (42 * $scale)
    $contentW = $screen.Width - $navW - (76 * $scale)
    $contentH = $screen.Height - $topBar.Height - (84 * $scale)

    $photo = [System.Drawing.RectangleF]::new($contentX, $contentY, $contentW * 0.54, $contentH * 0.58)
    $photoPath = New-RoundRectPath $photo (28 * $scale)
    $img = [System.Drawing.Image]::FromFile($spec.Asset)
    $canvas.Graphics.SetClip($photoPath)
    Draw-ImageCover $canvas.Graphics $img $photo
    $canvas.Graphics.SetClip($screenPath)
    Draw-FaceOverlay $canvas.Graphics $photo $spec.Mode
    $img.Dispose()

    $panelX = $photo.Right + (34 * $scale)
    $panel = [System.Drawing.RectangleF]::new($panelX, $contentY, $contentW - ($photo.Width + (34 * $scale)), $photo.Height)
    $panelPath = New-RoundRectPath $panel (30 * $scale)
    $canvas.Graphics.FillPath([System.Drawing.SolidBrush]::new($paper), $panelPath)
    Draw-Text $canvas.Graphics 'Analysis Score' ($panel.X + (34 * $scale)) ($panel.Y + (34 * $scale)) ($panel.Width - (68 * $scale)) (44 * $scale) (27 * $scale) $false $muted
    Draw-ScoreRing $canvas.Graphics ($panel.X + (42 * $scale)) ($panel.Y + (96 * $scale)) (176 * $scale) $spec.Badge $brand
    Draw-MetricRows $canvas.Graphics ($panel.X + (36 * $scale)) ($panel.Y + (320 * $scale)) ($panel.Width - (72 * $scale)) $scale
    $panelPath.Dispose()

    $cardY = $photo.Bottom + (34 * $scale)
    $cardW = ($contentW - (36 * $scale)) / 2
    Draw-SmallCard $canvas.Graphics $contentX $cardY $cardW (178 * $scale) 'Best insight' $spec.CardOne $scale
    Draw-SmallCard $canvas.Graphics ($contentX + $cardW + (36 * $scale)) $cardY $cardW (178 * $scale) 'Next step' $spec.CardTwo $scale

    $wideCard = New-RoundRectPath ([System.Drawing.RectangleF]::new($contentX, $cardY + (212 * $scale), $contentW, $contentH - ($photo.Height + (246 * $scale)))) (30 * $scale)
    $canvas.Graphics.FillPath([System.Drawing.SolidBrush]::new((ColorA 245 $paper)), $wideCard)
    Draw-Text $canvas.Graphics $spec.Body ($contentX + (34 * $scale)) ($cardY + (244 * $scale)) ($contentW - (68 * $scale)) (140 * $scale) (27 * $scale) $false $muted
    $wideCard.Dispose()

    $canvas.Graphics.Clip = $oldClip
    $canvas.Graphics.DrawPath([System.Drawing.Pen]::new((ColorA 48 ([System.Drawing.Color]::White)), 2 * $scale), $screenPath)

    $oldClip.Dispose()
    $outer.Dispose()
    $screenPath.Dispose()
    $photoPath.Dispose()

    Save-Png $canvas.Bitmap $dest
    $canvas.Graphics.Dispose()
    $canvas.Bitmap.Dispose()
}

$assets = @{
    beauty = Join-Path $featureDir 'face_beauty_analysis.png'
    symmetry = Join-Path $featureDir 'facial_symmetry.png'
    comparison = Join-Path $featureDir 'face_comparison.png'
    palette = Join-Path $featureDir 'seasonal_color_palette.png'
    golden = Join-Path $featureDir 'face_golden_ratio.png'
    tips = Join-Path $featureDir 'beauty_tips.png'
    glow = Join-Path $featureDir 'glow_up_guide.png'
    celebrity = Join-Path $featureDir 'celebrity_look_alike.png'
    showdown = Join-Path $featureDir 'beauty_score_showdown.png'
}

$phones = @{
    beauty = New-PhoneBitmap 620 1320 $assets.beauty 'Beauty Scanner' 'mesh' '9.42'
    score = New-PhoneBitmap 620 1320 $assets.beauty 'Beauty Score' 'golden' '9.25'
    symmetry = New-PhoneBitmap 620 1320 $assets.symmetry 'Facial Symmetry' 'symmetry' '87%'
    comparison = New-PhoneBitmap 620 1320 $assets.comparison 'Face Comparison' 'mesh' '80%'
    palette = New-PhoneBitmap 620 1320 $assets.palette 'Color Palette' 'palette' '98'
    golden = New-PhoneBitmap 620 1320 $assets.golden 'Golden Ratio' 'golden' '1.62'
    glow = New-PhoneBitmap 620 1320 $assets.glow 'Glow Up Guide' 'mesh' '7d'
    celebrity = New-PhoneBitmap 620 1320 $assets.celebrity 'Look Alike' 'mesh' '92%'
}

$wide = New-Canvas 2160 $H
Draw-Background $wide.Graphics 2160 $H
Draw-Text $wide.Graphics 'Verified Glam' 90 82 820 92 68 $true $ink
Draw-Text $wide.Graphics 'Beauty Scanner' 92 162 820 84 58 $true $brand
Draw-Text $wide.Graphics 'AI face analysis with instant beauty score' 95 252 800 70 34 $false $muted
Draw-Phone $wide.Graphics $phones.beauty 600 1060 1.10 -8
Draw-Phone $wide.Graphics $phones.score 1168 1122 0.96 8
Draw-ExternalBadge $wide.Graphics 700 1218 'Score' '9.42'

Draw-Text $wide.Graphics 'AI Beauty Score' 1440 1330 620 86 60 $true $ink
Draw-Text $wide.Graphics 'Symmetry and balance in one scan' 1444 1412 650 86 32 $false $muted
Draw-ExternalBadge $wide.Graphics 1720 292 'Score' '9.25'

$leftCrop = $wide.Bitmap.Clone([System.Drawing.Rectangle]::new(0, 0, $W, $H), $wide.Bitmap.PixelFormat)
$rightCrop = $wide.Bitmap.Clone([System.Drawing.Rectangle]::new($W, 0, $W, $H), $wide.Bitmap.PixelFormat)
Save-Png $leftCrop (Join-Path $outDir 'phone-01-beauty-scanner.png')
Save-Png $rightCrop (Join-Path $outDir 'phone-02-ai-beauty-score.png')
Save-Png $wide.Bitmap (Join-Path $outDir 'preview-01-02-continuation.png')
$leftCrop.Dispose()
$rightCrop.Dispose()
$wide.Graphics.Dispose()
$wide.Bitmap.Dispose()

$screenSpecs = @(
    @{ File='phone-03-facial-symmetry.png'; Head='Facial Symmetry'; Sub='See your left and right balance clearly'; Phone='symmetry'; X=530; Y=1080; Scale=1.12; Angle=-3; Badge='87%' },
    @{ File='phone-04-face-comparison.png'; Head='Face Comparison'; Sub='Compare two faces and similarity score'; Phone='comparison'; X=548; Y=1110; Scale=1.10; Angle=4; Badge='80%' },
    @{ File='phone-05-seasonal-color-palette.png'; Head='Seasonal Color Palette'; Sub='Find colors that flatter your skin tone'; Phone='palette'; X=538; Y=1090; Scale=1.10; Angle=-5; Badge='Warm' },
    @{ File='phone-06-golden-ratio-face.png'; Head='Golden Ratio Face'; Sub='Measure facial proportion and structure'; Phone='golden'; X=545; Y=1110; Scale=1.10; Angle=5; Badge='1.62' },
    @{ File='phone-07-glow-up-guide.png'; Head='Glow Up Guide'; Sub='Personal beauty tips from your scan'; Phone='glow'; X=540; Y=1090; Scale=1.10; Angle=-4; Badge='7d' },
    @{ File='phone-08-celebrity-look-alike.png'; Head='Celebrity Look Alike'; Sub='Discover your AI face match style'; Phone='celebrity'; X=540; Y=1105; Scale=1.10; Angle=4; Badge='92%' }
)

foreach ($s in $screenSpecs) {
    $canvas = New-Canvas $W $H
    Draw-Background $canvas.Graphics $W $H
    Draw-Text $canvas.Graphics $s.Head 80 78 920 88 62 $true $ink 'Center'
    Draw-Text $canvas.Graphics $s.Sub 90 160 900 76 34 $false $muted 'Center'
    Draw-Phone $canvas.Graphics $phones[$s.Phone] $s.X $s.Y $s.Scale $s.Angle
    Draw-ExternalBadge $canvas.Graphics 730 1280 'Score' $s.Badge
    Save-Png $canvas.Bitmap (Join-Path $outDir $s.File)
    $canvas.Graphics.Dispose()
    $canvas.Bitmap.Dispose()
}

$feature = New-Canvas 1024 500
$rect = [System.Drawing.Rectangle]::new(0, 0, 1024, 500)
$fBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $brandDark, $brand, 0)
$feature.Graphics.FillRectangle($fBrush, $rect)
$fBrush.Dispose()
for ($i = 0; $i -lt 10; $i++) {
    $feature.Graphics.DrawArc([System.Drawing.Pen]::new((ColorA 55 $rose), 2), 560 + ($i * 22), -130 + ($i * 18), 620, 430, 128, 180)
}
Draw-Text $feature.Graphics 'Verified Glam' 62 64 560 72 62 $true ([System.Drawing.Color]::White
)
Draw-Text $feature.Graphics 'Beauty Scanner' 64 132 560 60 44 $true $blush
Draw-Text $feature.Graphics 'AI beauty score, symmetry, color palette, and face analysis' 66 210 540 80 28 $false (ColorA 220 $paper)
$feature.Graphics.FillEllipse([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), 74, 312, 124, 124)
$feature.Graphics.DrawEllipse([System.Drawing.Pen]::new($rose, 11), 74, 312, 124, 124)
Draw-Text $feature.Graphics 'Score' 94 338 84 28 18 $false $brandDark 'Center'
Draw-Text $feature.Graphics '9.42' 88 362 96 48 34 $true $brandDark 'Center'
Draw-Phone $feature.Graphics $phones.beauty 780 286 0.44 -8
Save-Png $feature.Bitmap (Join-Path $outDir 'feature-graphic-1024x500.png')
$feature.Graphics.Dispose()
$feature.Bitmap.Dispose()

foreach ($p in $phones.Values) { $p.Dispose() }

$logoSource = Join-Path $repoRoot 'images\verified_glam_logo.png'
Draw-AppIcon $logoSource (Join-Path $appIconDir 'app-icon-512.png')

Copy-Item -LiteralPath (Join-Path $outDir 'feature-graphic-1024x500.png') `
    -Destination (Join-Path $featureUploadDir 'feature-graphic-1024x500.png') -Force

Get-ChildItem -LiteralPath $outDir -Filter 'phone-*.png' | Sort-Object Name | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $phoneUploadDir $_.Name) -Force
}

$tabletSpecs = @(
    @{
        File='01-beauty-scanner.png'; Head='Verified Glam'; Sub='AI face analysis with instant beauty score'; Screen='Beauty Scanner';
        Asset=$assets.beauty; Mode='mesh'; Badge='9.42'; CardOne='Face score'; CardTwo='Feature map';
        Body='A tablet-ready analysis dashboard shows the scan, score, facial structure, and beauty insights in one clear view.'
    },
    @{
        File='02-ai-beauty-score.png'; Head='AI Beauty Score'; Sub='See symmetry and balance in one scan'; Screen='Beauty Score';
        Asset=$assets.beauty; Mode='golden'; Badge='9.25'; CardOne='Smart score'; CardTwo='Detail view';
        Body='A bigger tablet layout gives users room to compare scores, proportions, and individual facial details without crowding.'
    },
    @{
        File='03-facial-symmetry.png'; Head='Facial Symmetry'; Sub='Left and right balance made easy to read'; Screen='Facial Symmetry';
        Asset=$assets.symmetry; Mode='symmetry'; Badge='87%'; CardOne='Matched'; CardTwo='Balance';
        Body='Symmetry lines, facial callouts, and metric cards are laid out side by side for a true tablet browsing experience.'
    },
    @{
        File='04-face-comparison.png'; Head='Face Comparison'; Sub='Compare two faces with clear similarity results'; Screen='Face Comparison';
        Asset=$assets.comparison; Mode='mesh'; Badge='80%'; CardOne='Similarity'; CardTwo='Compare';
        Body='The wide tablet canvas makes side-by-side comparison feel natural, with the photos and results visible together.'
    },
    @{
        File='05-seasonal-color-palette.png'; Head='Seasonal Color Palette'; Sub='Find colors that flatter your skin tone'; Screen='Color Palette';
        Asset=$assets.palette; Mode='palette'; Badge='Warm'; CardOne='Palette'; CardTwo='Outfits';
        Body='Seasonal colors, undertone guidance, and flattering swatches get enough space to feel premium and easy to scan.'
    },
    @{
        File='06-golden-ratio-face.png'; Head='Golden Ratio Face'; Sub='Measure face proportion and structure'; Screen='Golden Ratio';
        Asset=$assets.golden; Mode='golden'; Badge='1.62'; CardOne='Phi ratio'; CardTwo='Proportion';
        Body='Golden-ratio measurements are presented as a larger visual report instead of a phone-only screenshot stretched bigger.'
    },
    @{
        File='07-glow-up-guide.png'; Head='Glow Up Guide'; Sub='Personal beauty tips from your scan'; Screen='Glow Up Guide';
        Asset=$assets.glow; Mode='mesh'; Badge='7d'; CardOne='Routine'; CardTwo='Challenge';
        Body='The tablet view highlights the user photo, skin insights, daily routine, and next action in a clean dashboard layout.'
    },
    @{
        File='08-celebrity-look-alike.png'; Head='Celebrity Look Alike'; Sub='Discover your AI face match style'; Screen='Look Alike';
        Asset=$assets.celebrity; Mode='mesh'; Badge='92%'; CardOne='Match'; CardTwo='Style';
        Body='The larger layout shows match photos, resemblance score, and styling inspiration together for stronger conversion.'
    }
)

foreach ($t in $tabletSpecs) {
    New-TabletArtwork 1440 2560 $t (Join-Path $tablet7Dir ("tablet7-" + $t.File))
    New-TabletArtwork 1800 3200 $t (Join-Path $tablet10Dir ("tablet10-" + $t.File))
}

Get-ChildItem -LiteralPath $outDir -Recurse -Filter '*.png' |
    Select-Object Name, Length, DirectoryName |
    Sort-Object DirectoryName, Name
