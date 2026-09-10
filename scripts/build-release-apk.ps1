# Play Store / production build against the Cloudflare Worker API.
# Only the public Worker URL is embedded; Cloudflare credentials and backend
# secrets must never be bundled in the app.
param(
  [ValidateSet("apk", "appbundle")]
  [string]$Target = "appbundle"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$EnvFile = Join-Path $Root ".env"

if (-not (Test-Path $EnvFile)) {
  Write-Error "Missing .env - copy .env.example to .env and set VG_API_URL."
}

$vars = @{}
Get-Content $EnvFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }
  $idx = $line.IndexOf("=")
  if ($idx -lt 1) { return }
  $vars[$line.Substring(0, $idx).Trim()] = $line.Substring($idx + 1).Trim()
}

foreach ($required in @("VG_API_URL")) {
  if (-not $vars.ContainsKey($required) -or [string]::IsNullOrWhiteSpace($vars[$required])) {
    Write-Error "Missing $required in .env"
  }
  if ($vars[$required] -match "your_") {
    Write-Error "Replace placeholder $required in .env before release build."
  }
}

$googlePublicTestAdMobPublisherId = "ca-app-pub-3940256099942544"
$adMobConfigFiles = @(
  (Join-Path $Root "android\app\src\main\res\values\admob.xml"),
  (Join-Path $Root "lib\services\ads\vg_ads_config.dart")
)
foreach ($adMobConfigFile in $adMobConfigFiles) {
  if ((Test-Path $adMobConfigFile) -and
      (Select-String -Path $adMobConfigFile -SimpleMatch $googlePublicTestAdMobPublisherId -Quiet)) {
    Write-Error @"
Release build blocked: Google's public AdMob test ID is still present in:
  $adMobConfigFile

Before a Play Store submission, replace all AdMob test IDs with your production
AdMob App ID / ad-unit IDs, or disable/remove ads for the release build.
"@
  }
}

$googleWebClientId = ""
if ($vars.ContainsKey("GOOGLE_WEB_CLIENT_ID") -and $vars["GOOGLE_WEB_CLIENT_ID"] -notmatch "your_") {
  $googleWebClientId = $vars["GOOGLE_WEB_CLIENT_ID"]
} elseif ($vars.ContainsKey("GOOGLE_CLIENT_ID") -and $vars["GOOGLE_CLIENT_ID"] -notmatch "your_") {
  $googleWebClientId = $vars["GOOGLE_CLIENT_ID"]
}

$flutter = "C:\Users\zenit\flutter\bin\flutter.bat"
if (-not (Test-Path $flutter)) { $flutter = "flutter" }

$buildTarget = if ($Target -eq "appbundle") { "appbundle" } else { "apk" }
$flutterArgs = @(
  "build"
  $buildTarget
  "--release"
  "--no-tree-shake-icons"
  "--dart-define=VG_API_URL=$($vars['VG_API_URL'].TrimEnd('/'))"
  "--dart-define=VG_USE_CLOUD_BACKEND=true"
  "--dart-define=VG_USE_MOCK_ANALYSIS=false"
)

if (-not [string]::IsNullOrWhiteSpace($googleWebClientId)) {
  $flutterArgs += "--dart-define=GOOGLE_WEB_CLIENT_ID=$googleWebClientId"
}

Write-Host "Release build ($Target) with Cloudflare API: $($vars['VG_API_URL'].TrimEnd('/'))" -ForegroundColor Cyan
Write-Host "FCM: google-services.json is bundled from android/app/; push and API secrets stay in Cloudflare Worker secrets."
Set-Location $Root
& $flutter @flutterArgs

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Done. Upload appbundle from build/app/outputs/bundle/release/ to Play Console."
