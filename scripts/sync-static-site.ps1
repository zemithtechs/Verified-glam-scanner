# Overlay static marketing site on Flutter build/web output.
# Called after flutter build web from build-web.ps1 / cloudflare-build.sh.
param(
  [string]$EnvFile = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$BuildWeb = Join-Path $Root "build\web"

function Write-FileWithRetry {
  param(
    [string]$Path,
    [string]$Content,
    [int]$MaxAttempts = 8
  )
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  $tmp = Join-Path $dir "$(Split-Path -Leaf $Path).sync-tmp"
  Set-Content -Path $tmp -Value $Content -NoNewline -Force
  for ($i = 1; $i -le $MaxAttempts; $i++) {
    try {
      Move-Item -Force $tmp $Path
      return
    } catch {
      if ($i -eq $MaxAttempts) {
        Remove-Item -Force $tmp -ErrorAction SilentlyContinue
        throw "Could not write $Path (file locked). Stop serve-web.ps1 (Ctrl+C) and rerun build-web.ps1. $_"
      }
      Start-Sleep -Milliseconds 400
    }
  }
}

if (-not (Test-Path $BuildWeb)) {
  Write-Error "Missing build/web - run flutter build web first."
}

$dart = "C:\Users\zenit\flutter\bin\dart.bat"
if (-not (Test-Path $dart)) { $dart = "dart" }

Write-Host "==> Generate static HTML pages"
Set-Location $Root
$prevEa = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& $dart run tool/generate_marketing_html.dart 2>&1 | ForEach-Object { Write-Host $_ }
$ErrorActionPreference = $prevEa
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Save Flutter SPA shell before overwriting root index.html (only when build output is the app shell).
$flutterShell = Join-Path $BuildWeb "_flutter\index.html"
$buildIndex = Join-Path $BuildWeb "index.html"
$webIndex = Join-Path $Root "web\index.html"
New-Item -ItemType Directory -Path (Split-Path $flutterShell) -Force | Out-Null

function Test-FlutterShellHtml([string]$path) {
  if (-not (Test-Path $path)) { return $false }
  return (Get-Content $path -Raw) -match 'flutter_bootstrap\.js'
}

if (Test-FlutterShellHtml $buildIndex) {
  Copy-Item -Force $buildIndex $flutterShell
} elseif (-not (Test-FlutterShellHtml $flutterShell) -and (Test-Path $webIndex)) {
  Copy-Item -Force $webIndex $flutterShell
  $shell = Get-Content $flutterShell -Raw
  $shell = $shell -replace '\$FLUTTER_BASE_HREF', '/'
  Set-Content -Path $flutterShell -Value $shell -NoNewline
}

if (Test-FlutterShellHtml $flutterShell) {
  Copy-Item -Force $flutterShell (Join-Path $BuildWeb "404.html")
} else {
  Write-Warning 'Flutter app shell missing - run flutter build web before sync-static-site.'
}

Write-Host "==> Copy marketing assets"
$assetSrc = Join-Path $Root "images\vg\marketing"
$assetDest = Join-Path $BuildWeb "assets"
if (Test-Path $assetSrc) {
  New-Item -ItemType Directory -Path $assetDest -Force | Out-Null
  Copy-Item -Path (Join-Path $assetSrc "*") -Destination $assetDest -Recurse -Force
}
foreach ($sub in @("css")) {
  $from = Join-Path $Root "website\$sub"
  $to = Join-Path $BuildWeb $sub
  if (Test-Path $from) {
    if (Test-Path $to) { Remove-Item $to -Recurse -Force }
    Copy-Item $from $to -Recurse -Force
  }
}

# Overlay marketing JS without wiping Flutter shell scripts (passkeys-bundle.js).
$jsFrom = Join-Path $Root "website\js"
$jsTo = Join-Path $BuildWeb "js"
if (Test-Path $jsFrom) {
  New-Item -ItemType Directory -Path $jsTo -Force | Out-Null
  Copy-Item -Path (Join-Path $jsFrom "*") -Destination $jsTo -Recurse -Force
}
$passkeysSrc = Join-Path $Root "web\js\passkeys-bundle.js"
if (Test-Path $passkeysSrc) {
  Copy-Item -Force $passkeysSrc (Join-Path $jsTo "passkeys-bundle.js")
} else {
  Write-Warning "Missing web/js/passkeys-bundle.js - web auth will crash on /app/*"
}

# Inject Worker API config into auth-config.js
if ([string]::IsNullOrWhiteSpace($EnvFile)) {
  $EnvFile = Join-Path $Root ".env"
}
$vars = @{}
if (Test-Path $EnvFile) {
  Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $vars[$line.Substring(0, $idx).Trim()] = $line.Substring($idx + 1).Trim()
  }
}
$exampleEnv = Join-Path $Root ".env.example"
if (Test-Path $exampleEnv) {
  Get-Content $exampleEnv | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $val = $line.Substring($idx + 1).Trim()
    if ($val -match "your_" -or [string]::IsNullOrWhiteSpace($val)) { return }
    if (-not $vars.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($vars[$key])) {
      $vars[$key] = $val
    }
  }
}
$apiUrl = $vars["VG_API_URL"]
$googleId = $vars["GOOGLE_WEB_CLIENT_ID"]
$polarAnnual = $vars["POLAR_CHECKOUT_LINK_ANNUAL"]
$polarWeekly = $vars["POLAR_CHECKOUT_LINK_PRO_WEEKLY"]
if (-not $apiUrl) { $apiUrl = $env:VG_API_URL }
if (-not $googleId) { $googleId = $env:GOOGLE_WEB_CLIENT_ID }

$authConfig = Join-Path $BuildWeb "js\auth-config.js"
if (Test-Path $authConfig) {
  $cfg = Get-Content $authConfig -Raw
  if ($apiUrl) { $cfg = $cfg -replace '__VG_API_URL__', $apiUrl }
  if ($googleId) { $cfg = $cfg -replace '__GOOGLE_WEB_CLIENT_ID__', $googleId }
  if ($polarAnnual) { $cfg = $cfg -replace '__POLAR_CHECKOUT_LINK_ANNUAL__', $polarAnnual }
  if ($polarWeekly) { $cfg = $cfg -replace '__POLAR_CHECKOUT_LINK_PRO_WEEKLY__', $polarWeekly }
  Write-FileWithRetry -Path $authConfig -Content $cfg
}

Write-Host "==> Copy static pages"
$homeIndex = Join-Path $Root "website\generated\home\index.html"
if (-not (Test-Path $homeIndex)) {
  Write-Error "Missing website/generated/home/index.html - run generate_marketing_html.dart first."
}
Copy-Item -Force $homeIndex (Join-Path $BuildWeb "index.html")

$generated = Join-Path $Root "website\generated"
if (Test-Path $generated) {
  Get-ChildItem $generated -Directory | ForEach-Object {
    if ($_.Name -eq "home") { return }
    $dest = Join-Path $BuildWeb $_.Name
    if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
    Copy-Item $_.FullName $dest -Recurse -Force
  }
}

$staleRedirects = Join-Path $BuildWeb "_redirects"
if (Test-Path $staleRedirects) { Remove-Item -Force $staleRedirects }
$staleServeJson = Join-Path $BuildWeb "serve.json"
if (Test-Path $staleServeJson) { Remove-Item -Force $staleServeJson }

$legacyStatic = Join-Path $BuildWeb "_static"
if (Test-Path $legacyStatic) { Remove-Item $legacyStatic -Recurse -Force }
$legacyMarketing = Join-Path $BuildWeb "marketing"
if (Test-Path $legacyMarketing) { Remove-Item $legacyMarketing -Recurse -Force }

if (Test-FlutterShellHtml $flutterShell) {
  Copy-Item -Force $flutterShell (Join-Path $BuildWeb "404.html")
}

foreach ($seoFile in @("sitemap.xml", "robots.txt", "llms.txt", "_headers")) {
  $src = Join-Path $Root "website\$seoFile"
  if (Test-Path $src) {
    Copy-Item -Force $src (Join-Path $BuildWeb $seoFile)
  }
}

$sitemapPath = Join-Path $BuildWeb "sitemap.xml"
if (-not (Test-Path $sitemapPath)) { Write-Error "Missing build/web/sitemap.xml after sync." }
$sitemap = Get-Content $sitemapPath -Raw
if ($sitemap -match 'flutter_bootstrap|<html|<!DOCTYPE') {
  Write-Error "sitemap.xml contains HTML - would break crawlers."
}
if ($sitemap -notmatch '<urlset') { Write-Error "sitemap.xml missing urlset element." }
if ((Select-String -Path $sitemapPath -Pattern '<loc>').Count -lt 1) {
  Write-Error "sitemap.xml has no URLs."
}

Write-Host "Static overlay complete."
