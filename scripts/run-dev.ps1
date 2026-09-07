# Run Verified Glam on a connected device against the live Cloudflare Worker API.
param(
  [string]$DeviceId = ""
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
  Write-Error "Missing VG_API_URL in .env - set it to your Cloudflare Worker URL (e.g. https://verified-glam-api.<account>.workers.dev)."
}
if ($vars["VG_API_URL"] -match "your_") {
  Write-Error "Replace placeholder VG_API_URL in .env before running."
}

$flutter = "C:\Users\zenit\flutter\bin\flutter.bat"
if (-not (Test-Path $flutter)) {
  $flutter = "flutter"
}

$apiUrl = $vars["VG_API_URL"]

$flutterArgs = @(
  "run",
  "--dart-define=VG_API_URL=$apiUrl",
  "--dart-define=VG_USE_SUPABASE=true",
  "--dart-define=VG_USE_MOCK_ANALYSIS=false"
)

if ($vars.ContainsKey("GOOGLE_WEB_CLIENT_ID") -and $vars["GOOGLE_WEB_CLIENT_ID"] -notmatch "your_") {
  $flutterArgs += "--dart-define=GOOGLE_WEB_CLIENT_ID=$($vars['GOOGLE_WEB_CLIENT_ID'])"
}

if ($DeviceId -ne "") {
  $flutterArgs += "-d"
  $flutterArgs += $DeviceId
}

Write-Host "Running against Cloudflare Worker: $apiUrl"
Set-Location $Root
& $flutter @flutterArgs
