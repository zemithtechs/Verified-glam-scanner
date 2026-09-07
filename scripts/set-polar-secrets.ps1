# Sync Polar Edge secrets from .env to Supabase (never commit real secrets).
param(
  [string]$ProjectRef = "qmivgvctmxvpnbouqslj",
  [string]$EnvFile = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Load-EnvFile($path) {
  $vars = @{}
  if (-not (Test-Path $path)) { return $vars }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $val = $line.Substring($idx + 1).Trim()
    if ($val -notmatch "your_") { $vars[$key] = $val }
  }
  return $vars
}

function Normalize-PolarWebhookSecret([string]$Raw) {
  $secret = $Raw.Trim()
  $stripped = $false
  if ($secret.StartsWith("whsec_polar_whs_")) {
    $secret = $secret.Substring("whsec_".Length)
    $stripped = $true
  } elseif ($secret.StartsWith("whsec_") -and $secret.Contains("polar_whs_")) {
    $secret = $secret.Substring("whsec_".Length)
    $stripped = $true
  }
  return @{ Secret = $secret; StrippedWhsec = $stripped }
}

if ([string]::IsNullOrWhiteSpace($EnvFile)) {
  $EnvFile = Join-Path $Root ".env"
}

$vars = Load-EnvFile $EnvFile
if ($vars.ContainsKey("SUPABASE_ACCESS_TOKEN") -and -not $env:SUPABASE_ACCESS_TOKEN) {
  $env:SUPABASE_ACCESS_TOKEN = $vars["SUPABASE_ACCESS_TOKEN"]
}

if ([string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
  Write-Error "Missing SUPABASE_ACCESS_TOKEN in .env"
}

$polarKeys = @(
  "POLAR_ACCESS_TOKEN",
  "POLAR_WEBHOOK_SECRET",
  "POLAR_ORGANIZATION_ID",
  "POLAR_ORGANIZATION_SLUG",
  "POLAR_PRODUCT_ID_ANNUAL",
  "POLAR_PRODUCT_ID_PRO_WEEKLY",
  "POLAR_CHECKOUT_LINK_ANNUAL",
  "POLAR_CHECKOUT_LINK_PRO_WEEKLY",
  "POLAR_SUCCESS_URL",
  "POLAR_CANCEL_URL",
  "POLAR_ENV"
)

$toSet = @()
foreach ($key in $polarKeys) {
  if ($vars.ContainsKey($key) -and -not [string]::IsNullOrWhiteSpace($vars[$key])) {
    $val = $vars[$key]
    if ($key -eq "POLAR_WEBHOOK_SECRET") {
      if ($val.StartsWith("whsec_")) {
        Write-Warning "POLAR_WEBHOOK_SECRET has whsec_ prefix - stripping whsec_ before upload (use polar_whs_ only in .env)."
        $norm = Normalize-PolarWebhookSecret $val
        $val = $norm.Secret
      }
      if (-not $val.StartsWith("polar_whs_")) {
        Write-Error "POLAR_WEBHOOK_SECRET must start with polar_whs_ - paste exactly from Polar Dashboard Webhooks Signing secret (no whsec_ prefix)."
      }
      if ($val.Length -lt 20) {
        Write-Error "POLAR_WEBHOOK_SECRET looks too short."
      }
      Write-Host "Webhook secret format OK (polar_whs_...)" -ForegroundColor Green
    }
    $toSet += "$key=$val"
  }
}

if ($toSet.Count -eq 0) {
  Write-Host "No POLAR_* values in $EnvFile"
  Write-Host "Add POLAR_WEBHOOK_SECRET=polar_whs_... (exact copy from Polar dashboard, no whsec_ prefix) and rerun."
  exit 1
}

Write-Host "Setting $($toSet.Count) Polar secret(s) on $ProjectRef ..."
Set-Location $Root
npx supabase secrets set @toSet --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host 'Done. Redeploy not required - secrets apply to running functions within ~1 min.'
Write-Host 'Test in Polar: Webhooks, Send test event, expect HTTP 202.'
