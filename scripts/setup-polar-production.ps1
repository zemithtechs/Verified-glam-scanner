# Print Polar production checklist and run deploy/smoke when credentials exist.
param(
  [string]$ProjectRef = "qmivgvctmxvpnbouqslj",
  [string]$SupabaseUrl = "https://qmivgvctmxvpnbouqslj.supabase.co",
  [switch]$DeployFunctions,
  [switch]$SmokeTest
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Load-EnvFile($path) {
  if (-not (Test-Path $path)) { return }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    if ($line -match '^SUPABASE_URL=(.+)$') {
      $v = $matches[1].Trim()
      if ($v -notmatch "your_") { $script:SupabaseUrl = $v }
    }
    if ($line -match '^([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
      $key = $matches[1]
      $val = $matches[2].Trim()
      if ($key -eq "SUPABASE_ACCESS_TOKEN" -and [string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
        if ($val -notmatch "your_") { $env:SUPABASE_ACCESS_TOKEN = $val }
      }
    }
  }
}

Load-EnvFile (Join-Path $Root ".env")
Load-EnvFile (Join-Path $Root ".env.example")

Write-Host "=== Polar production setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Supabase Edge secrets (Dashboard -> Edge Functions -> Secrets):"
Write-Host "  POLAR_ACCESS_TOKEN       = production org token from Polar"
Write-Host "  POLAR_ORGANIZATION_ID    = org UUID (Settings -> unique identifier)"
Write-Host "  POLAR_ORGANIZATION_SLUG  = org slug for polar.sh/{slug}/portal"
Write-Host "  POLAR_WEBHOOK_SECRET     = polar_whs_... from Polar Webhooks (no whsec_ prefix)"
Write-Host "  POLAR_PRODUCT_ID_ANNUAL  = 9e185286-cf2b-41b8-a728-e7154d144722"
Write-Host "  POLAR_PRODUCT_ID_PRO_WEEKLY = 8c9fddc9-1001-4143-8a27-31ce929ae5e6"
Write-Host "  POLAR_CHECKOUT_LINK_*    = optional guest/marketing only (not required in Supabase)"
Write-Host "  POLAR_SUCCESS_URL        = https://scanner.verifiedglam.com/app/face-beauty-analysis?checkout=success"
Write-Host "  POLAR_CANCEL_URL         = https://scanner.verifiedglam.com/pricing?checkout=cancelled"
Write-Host "  POLAR_ENV                = production"
Write-Host ""
Write-Host "Polar webhook events (required for Pro/credits):"
Write-Host "  subscription.active, subscription.updated, subscription.canceled,"
Write-Host "  subscription.revoked, order.created"
Write-Host "  (checkout.created alone does NOT grant Pro)"
Write-Host ""
Write-Host "Polar webhook URL:"
Write-Host "  $SupabaseUrl/functions/v1/polar-webhook"
Write-Host ""
Write-Host "Supabase Auth -> URL configuration:"
Write-Host "  Site URL: https://scanner.verifiedglam.com"
Write-Host "  Redirect URLs: https://scanner.verifiedglam.com/** , http://localhost:**"
Write-Host ""
Write-Host "Cloudflare Production env vars:"
Write-Host "  SUPABASE_URL, SUPABASE_ANON_KEY, GOOGLE_WEB_CLIENT_ID (optional)"
Write-Host ""
Write-Host "Full checklist: docs/POLAR_PRODUCTION_SETUP.md"
Write-Host ""

if ($DeployFunctions) {
  if ([string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
    Write-Warning "Skip deploy: add SUPABASE_ACCESS_TOKEN to .env"
  } else {
    & (Join-Path $Root "scripts\deploy-functions.ps1") -ProjectRef $ProjectRef -SupabaseUrl $SupabaseUrl
  }
}

if ($SmokeTest) {
  & (Join-Path $Root "scripts\test-polar-integration.ps1") -SupabaseUrl $SupabaseUrl
}
