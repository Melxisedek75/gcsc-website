param(
  [string]$EnvFile = "C:\gcsc\.env",
  [string]$Email = "gcsc@xprnet.org"
)

$ErrorActionPreference = "Stop"

$defaults = [ordered]@{
  SMTP_HOST = "mail.privateemail.com"
  SMTP_PORT = "587"
  SMTP_USER = $Email
  SMTP_PASS = "REPLACE_WITH_NAMECHEAP_PRIVATE_EMAIL_PASSWORD"
  SMTP_FROM = $Email
  MAIL_TO = $Email
}

if (-not (Test-Path -LiteralPath $EnvFile)) {
  New-Item -ItemType File -Path $EnvFile -Force | Out-Null
}

$lines = [System.Collections.Generic.List[string]]::new()
Get-Content -LiteralPath $EnvFile | ForEach-Object { $lines.Add($_) }

$existing = @{}
foreach ($line in $lines) {
  $trimmed = $line.Trim()
  if ($trimmed.Length -eq 0 -or $trimmed.StartsWith("#")) {
    continue
  }
  $parts = $trimmed -split "=", 2
  if ($parts.Count -eq 2) {
    $existing[$parts[0].Trim()] = $true
  }
}

$added = @()
foreach ($key in $defaults.Keys) {
  if (-not $existing.ContainsKey($key)) {
    $lines.Add("$key=$($defaults[$key])")
    $added += $key
  }
}

Set-Content -LiteralPath $EnvFile -Value $lines -Encoding UTF8

if ($added.Count -eq 0) {
  Write-Output "Email env keys already exist. Nothing added."
} else {
  Write-Output ("Added email env keys: " + ($added -join ", "))
}

Write-Output "Env file prepared: $EnvFile"
Write-Output "Next step: open the env file locally and replace SMTP_PASS with the mailbox password. Do not paste the password into chat."
