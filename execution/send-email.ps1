param(
  [Parameter(Mandatory=$true)]
  [string]$Subject,

  [Parameter(Mandatory=$true)]
  [string]$Body,

  [string]$To,
  [string]$From,
  [string]$EnvFile = "C:\gcsc\.env"
)

$ErrorActionPreference = "Stop"

function Import-DotEnv {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Env file not found: $Path"
  }

  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if ($line.Length -eq 0 -or $line.StartsWith("#")) {
      return
    }

    $parts = $line -split "=", 2
    if ($parts.Count -ne 2) {
      return
    }

    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"').Trim("'")
    if ($name) {
      Set-Item -Path "Env:$name" -Value $value
    }
  }
}

Import-DotEnv -Path $EnvFile

$smtpHost = $env:SMTP_HOST
$smtpPort = if ($env:SMTP_PORT) { [int]$env:SMTP_PORT } else { 587 }
$smtpUser = $env:SMTP_USER
$smtpPass = $env:SMTP_PASS
$mailFrom = if ($From) { $From } elseif ($env:SMTP_FROM) { $env:SMTP_FROM } else { $smtpUser }
$mailTo = if ($To) { $To } elseif ($env:MAIL_TO) { $env:MAIL_TO } else { $smtpUser }

if (-not $smtpHost) { throw "SMTP_HOST is missing." }
if (-not $smtpUser) { throw "SMTP_USER is missing." }
if (-not $smtpPass) { throw "SMTP_PASS is missing." }
if (-not $mailFrom) { throw "From address is missing." }
if (-not $mailTo) { throw "To address is missing." }

$message = [System.Net.Mail.MailMessage]::new()
$message.From = $mailFrom
$message.To.Add($mailTo)
$message.Subject = $Subject
$message.Body = $Body
$message.IsBodyHtml = $false
$utf8 = [System.Text.Encoding]::UTF8
$message.SubjectEncoding = $utf8
$message.BodyEncoding = $utf8
$message.HeadersEncoding = $utf8

$client = [System.Net.Mail.SmtpClient]::new($smtpHost, $smtpPort)
$client.EnableSsl = $true
$client.Credentials = [System.Net.NetworkCredential]::new($smtpUser, $smtpPass)

try {
  $client.Send($message)
  Write-Output "Email sent to $mailTo"
}
finally {
  $message.Dispose()
  $client.Dispose()
}
