# Smoke-test Polar Edge Functions (OPTIONS + auth gate). Full E2E requires Polar sandbox secrets.
param(
  [string]$SupabaseUrl = "https://qmivgvctmxvpnbouqslj.supabase.co"
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
    if ($line -match '^SUPABASE_ANON_KEY=(.+)$') {
      $v = $matches[1].Trim()
      if ($v -notmatch "your_") { $script:Anon = $v }
    }
  }
}

Load-EnvFile (Join-Path $Root ".env")
Load-EnvFile (Join-Path $Root ".env.example")

$headers = @{}
if ($Anon) { $headers["apikey"] = $Anon }

Write-Host "Polar integration smoke test ($SupabaseUrl)"
Write-Host ""

foreach ($name in @("polar-create-checkout", "polar-customer-portal", "polar-webhook")) {
  $uri = "$SupabaseUrl/functions/v1/$name"
  try {
    $r = Invoke-WebRequest -Uri $uri -Method OPTIONS -Headers $headers -UseBasicParsing
    $ver = $r.Headers["X-Function-Version"]
    Write-Host "  [OK] OPTIONS $name -> $($r.StatusCode) (version=$ver)"
  } catch {
    Write-Error "OPTIONS $name failed: $($_.Exception.Message)"
  }
}

Write-Host ""
Write-Host "Authenticated checkout should return 401 without JWT:"
try {
  $r = Invoke-WebRequest -Uri "$SupabaseUrl/functions/v1/polar-create-checkout" `
    -Method POST -Headers (@{ "Content-Type" = "application/json" } + $headers) `
    -Body '{"planId":"annual"}' -UseBasicParsing
  Write-Warning "Expected 401, got $($r.StatusCode)"
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 401) {
    Write-Host "  [OK] polar-create-checkout rejects unauthenticated POST"
  } else {
    Write-Error "Unexpected response: $($_.Exception.Message)"
  }
}

Write-Host ""
Write-Host "Webhook GET (browser ping) should be 200; POST without signature should be 403:"
try {
  $r = Invoke-WebRequest -Uri "$SupabaseUrl/functions/v1/polar-webhook" -Method GET -UseBasicParsing
  Write-Host "  [OK] GET polar-webhook -> $($r.StatusCode)"
} catch {
  Write-Warning "GET polar-webhook: $($_.Exception.Message)"
}
try {
  $r = Invoke-WebRequest -Uri "$SupabaseUrl/functions/v1/polar-webhook" `
    -Method POST -Headers (@{ "Content-Type" = "application/json" } + $headers) `
    -Body '{}' -UseBasicParsing
  Write-Warning "Expected 403 invalid signature, got $($r.StatusCode)"
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 403) {
    Write-Host "  [OK] polar-webhook rejects unsigned POST (expected - use polar_whs_ secret for signed events)"
  } else {
    Write-Warning "POST polar-webhook: $($_.Exception.Message)"
  }
}

Write-Host ""
Write-Host "Automated checks complete. Manual production E2E (requires POLAR_ENV=production secrets + live card):"
Write-Host "  1. Sign in at https://scanner.verifiedglam.com/login"
Write-Host "  2. /pricing -> Subscribe -> Polar checkout -> pay -> ?checkout=success -> Pro credits"
Write-Host "  3. Polar dashboard -> webhook deliveries OK for polar-webhook URL"
Write-Host "  4. Manage subscription on /pricing or profile -> cancel in Polar portal"
Write-Host "  5. Scan in app -> 5 credits deducted"
Write-Host ""
Write-Host "See docs/POLAR_PRODUCTION_SETUP.md for full checklist."
