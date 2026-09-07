# Shared helpers for Flutter web build/run (dart-defines from .env)
param(
  [string[]]$ExtraArgs = @()
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$EnvFile = Join-Path $Root ".env"

if (-not (Test-Path $EnvFile)) {
  Write-Error "Missing .env - copy .env.example to .env and fill in values."
}

$vars = @{}
Get-Content $EnvFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }
  $idx = $line.IndexOf("=")
  if ($idx -lt 1) { return }
  $key = $line.Substring(0, $idx).Trim()
  $val = $line.Substring($idx + 1).Trim()
  $vars[$key] = $val
}

if (-not $vars.ContainsKey("VG_API_URL") -or [string]::IsNullOrWhiteSpace($vars["VG_API_URL"])) {
  Write-Error "Missing VG_API_URL in .env"
}
if ($vars["VG_API_URL"] -match "your_") {
  Write-Error "Replace placeholder VG_API_URL in .env before building."
}

$flutter = "C:\Users\zenit\flutter\bin\flutter.bat"
if (-not (Test-Path $flutter)) {
  $flutter = "flutter"
}

$apiUrl = $vars["VG_API_URL"]

$flutterArgs = @(
  "build",
  "web",
  "--release",
  "--no-wasm-dry-run",
  "--no-tree-shake-icons",
  "-t",
  "lib/main_web.dart",
  "--dart-define=VG_API_URL=$apiUrl",
  "--dart-define=VG_USE_SUPABASE=true",
  "--dart-define=VG_USE_MOCK_ANALYSIS=false"
)

if ($vars.ContainsKey("GOOGLE_WEB_CLIENT_ID") -and $vars["GOOGLE_WEB_CLIENT_ID"] -notmatch "your_") {
  $flutterArgs += "--dart-define=GOOGLE_WEB_CLIENT_ID=$($vars['GOOGLE_WEB_CLIENT_ID'])"
}

$flutterArgs += $ExtraArgs

Write-Host "Building web app shell (main_web.dart) with Worker API: $apiUrl"
Set-Location $Root

foreach ($seoFile in @("sitemap.xml", "robots.txt", "llms.txt", "_headers")) {
  $src = Join-Path $Root "website\$seoFile"
  if (Test-Path $src) {
    Copy-Item -Force $src (Join-Path $Root "web\$seoFile")
  }
}

& $flutter @flutterArgs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Disable service worker in local/release static serves (avoids infinite loading on localhost).
$bootstrap = Join-Path $Root "build\web\flutter_bootstrap.js"
if (Test-Path $bootstrap) {
  $content = Get-Content $bootstrap -Raw
  $content = $content -replace 'serviceWorkerSettings:\s*\{[^}]+\}', 'serviceWorkerSettings: null'
  $tmp = "$bootstrap.patch.tmp"
  Set-Content -Path $tmp -Value $content -NoNewline
  Move-Item -Force $tmp $bootstrap
}

# Local serve-web locks build/web/js/auth-config.js on Windows — stop listener first.
foreach ($port in @(8080, 8099)) {
  try {
    $pids = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
      ForEach-Object { $_.OwningProcess } | Where-Object { $_ -gt 0 } | Select-Object -Unique)
    foreach ($procId in $pids) {
      Write-Host "Stopping local server on port $port (PID $procId) before static overlay..."
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
  } catch { }
}
Start-Sleep -Milliseconds 500

& (Join-Path $Root "scripts\sync-static-site.ps1") -EnvFile $EnvFile

Write-Host "Output: build/web/ (static Tier 1 pages + Flutter shell at 404.html for /app/*)"
