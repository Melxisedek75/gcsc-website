param(
  [switch]$StagedOnly
)

$ErrorActionPreference = "Stop"

$projectRoot = "C:\gcsc"
$serverPath = Join-Path $projectRoot "construction-ai\server.js"

Write-Host "GCSC pre-commit safety check" -ForegroundColor Cyan
Write-Host "Project: $projectRoot"

Set-Location $projectRoot

if (Test-Path $serverPath) {
  Write-Host "Checking backend syntax..." -ForegroundColor Yellow
  node -c $serverPath
}

Write-Host "Checking Git whitespace errors..." -ForegroundColor Yellow
git diff --check

if ($StagedOnly) {
  Write-Host "Staged files:" -ForegroundColor Yellow
  git diff --cached --name-only
} else {
  Write-Host "Changed files:" -ForegroundColor Yellow
  git status --short
}

Write-Host "Safety check complete." -ForegroundColor Green

