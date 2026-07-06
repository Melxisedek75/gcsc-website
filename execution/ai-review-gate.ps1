param(
    [Parameter(Mandatory = $true)]
    [string]$ReviewFile,

    [switch]$SkipGitState
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Fail-Gate([string]$Message) {
    Write-Error "AI_REVIEW_GATE=FAIL: $Message"
    exit 1
}

$root = (& git rev-parse --show-toplevel 2>$null).Trim()
if ($LASTEXITCODE -ne 0 -or -not $root) {
    Fail-Gate 'run this command inside a Git repository'
}

$recordsRoot = [System.IO.Path]::GetFullPath((Join-Path $root 'ai-review\records'))
$candidate = if ([System.IO.Path]::IsPathRooted($ReviewFile)) {
    [System.IO.Path]::GetFullPath($ReviewFile)
} else {
    [System.IO.Path]::GetFullPath((Join-Path $root $ReviewFile))
}

if (-not $candidate.StartsWith($recordsRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    Fail-Gate 'review file must be inside ai-review/records/'
}
if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
    Fail-Gate "review file not found: $candidate"
}

$content = Get-Content -Raw -Encoding UTF8 -LiteralPath $candidate
function Read-Field([string]$Name) {
    $match = [regex]::Match($content, "(?m)^- $([regex]::Escape($Name)): ([^`r`n]+)$")
    if (-not $match.Success) {
        Fail-Gate "missing field: $Name"
    }
    return $match.Groups[1].Value.Trim()
}

$author = Read-Field 'Author AI'
$reviewer = Read-Field 'Reviewer AI'
$reviewDecision = Read-Field 'Reviewer decision'
$checks = Read-Field 'Required checks'
$unresolved = Read-Field 'Unresolved P0/P1 findings'
$liveRisk = Read-Field 'Live-risk decision'
$founderEvidence = Read-Field 'Founder evidence'
$deployDecision = Read-Field 'Deploy decision'

if ($author -notin @('CODEX', 'CLAUDE')) { Fail-Gate 'Author AI must be CODEX or CLAUDE' }
if ($reviewer -notin @('CODEX', 'CLAUDE')) { Fail-Gate 'Reviewer AI must be CODEX or CLAUDE' }
if ($author -eq $reviewer) { Fail-Gate 'author and reviewer must be different agents' }
if ($reviewDecision -ne 'APPROVED') { Fail-Gate 'reviewer decision is not APPROVED' }
if ($checks -ne 'PASS') { Fail-Gate 'required checks are not PASS' }
if ($unresolved -ne '0') { Fail-Gate 'unresolved P0/P1 findings remain' }
if ($liveRisk -notin @('NOT_REQUIRED', 'FOUNDER_APPROVED')) { Fail-Gate 'live-risk decision is not cleared' }
if ($liveRisk -eq 'FOUNDER_APPROVED' -and $founderEvidence -in @('', 'PENDING', 'NOT_REQUIRED')) {
    Fail-Gate 'founder approval requires a safe evidence reference'
}
if ($deployDecision -ne 'READY') { Fail-Gate 'deploy decision is not READY' }

if (-not $SkipGitState) {
    $branch = (& git -C $root branch --show-current).Trim()
    if ($branch -in @('', 'main', 'master')) {
        Fail-Gate 'reviewed work must be on a non-main feature branch'
    }
    $dirty = & git -C $root status --porcelain
    if ($dirty) {
        Fail-Gate 'working tree must be clean before merge/deploy'
    }
}

Write-Output 'AI_REVIEW_GATE=PASS'
Write-Output "ReviewFile=$candidate"
Write-Output "Author=$author Reviewer=$reviewer"
exit 0
