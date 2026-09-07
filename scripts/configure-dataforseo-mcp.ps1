# Configure DataForSEO MCP for Cursor + Claude Code using credentials from .env
param(
  [string]$EnvFile = (Join-Path (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)) ".env")
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$FieldConfig = Join-Path $env:USERPROFILE ".claude\skills\seo\dataforseo-field-config.json"

function Read-EnvValue($key, $file) {
  if (-not (Test-Path $file)) { return $null }
  foreach ($line in Get-Content $file) {
    if ($line -match "^\s*#") { continue }
    if ($line -match "^\s*$key\s*=\s*(.*)$") {
      return $matches[1].Trim().Trim('"').Trim("'")
    }
  }
  return $null
}

$username = $env:DATAFORSEO_USERNAME
if (-not $username) { $username = Read-EnvValue "DATAFORSEO_USERNAME" $EnvFile }
$password = $env:DATAFORSEO_PASSWORD
if (-not $password) { $password = Read-EnvValue "DATAFORSEO_PASSWORD" $EnvFile }

if (-not $username -or -not $password) {
  Write-Error "Set DATAFORSEO_USERNAME and DATAFORSEO_PASSWORD in .env or environment, then re-run."
}

if (-not (Test-Path $FieldConfig)) {
  Write-Error "Missing $FieldConfig — run DataForSEO extension file install first."
}

$mcpEntry = @{
  command = "npx"
  args = @("-y", "dataforseo-mcp-server@2.8.10")
  env = @{
    DATAFORSEO_USERNAME = $username
    DATAFORSEO_PASSWORD = $password
    ENABLED_MODULES = "SERP,KEYWORDS_DATA,ONPAGE,DATAFORSEO_LABS,BACKLINKS,DOMAIN_ANALYTICS,BUSINESS_DATA,CONTENT_ANALYSIS,AI_OPTIMIZATION"
    FIELD_CONFIG_PATH = $FieldConfig
  }
}

# Cursor ~/.cursor/mcp.json
$cursorMcp = Join-Path $env:USERPROFILE ".cursor\mcp.json"
$cursor = @{}
if (Test-Path $cursorMcp) {
  $cursor = Get-Content $cursorMcp -Raw | ConvertFrom-Json -AsHashtable
}
if (-not $cursor.mcpServers) { $cursor.mcpServers = @{} }
$cursor.mcpServers["dataforseo"] = $mcpEntry
$cursor | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 $cursorMcp
Write-Host "Updated $cursorMcp"

# Claude Code ~/.claude/settings.json
$claudeSettings = Join-Path $env:USERPROFILE ".claude\settings.json"
$claude = @{}
if (Test-Path $claudeSettings) {
  $claude = Get-Content $claudeSettings -Raw | ConvertFrom-Json -AsHashtable
}
if (-not $claude.mcpServers) { $claude.mcpServers = @{} }
$claude.mcpServers["dataforseo"] = $mcpEntry
New-Item -ItemType Directory -Force -Path (Split-Path $claudeSettings) | Out-Null
$claude | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 $claudeSettings
Write-Host "Updated $claudeSettings"
Write-Host "DataForSEO MCP configured. Restart Cursor to load the server."
