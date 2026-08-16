param(
    [Parameter(Mandatory = $true)]
    [string]$ReviewFile,

    [ValidateSet('Merge', 'Deploy')]
    [string]$Operation = 'Merge',

    [switch]$LegacyRecord,

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

$recordsPrefix = $recordsRoot + [System.IO.Path]::DirectorySeparatorChar
if (-not $candidate.StartsWith($recordsPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    Fail-Gate 'review file must be inside ai-review/records/'
}
if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
    Fail-Gate "review file not found: $candidate"
}

try {
    $utf8 = New-Object System.Text.UTF8Encoding($false, $true)
    $content = [System.IO.File]::ReadAllText($candidate, $utf8)
}
catch {
    Fail-Gate "review file must be valid UTF-8: $($_.Exception.Message)"
}

$lines = $content -split "`r?`n"
function Read-Field([string]$Name) {
    $prefix = "- ${Name}:"
    $values = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed.StartsWith($prefix, [System.StringComparison]::Ordinal)) {
            $value = $trimmed.Substring($prefix.Length).Trim()
            if (-not $value) {
                Fail-Gate "empty field: $Name"
            }
            $values.Add($value)
        }
    }

    if ($values.Count -eq 0) {
        Fail-Gate "missing field: $Name"
    }
    if (-not $LegacyRecord -and $values.Count -ne 1) {
        Fail-Gate "duplicate field: $Name"
    }
    return $values[$values.Count - 1]
}

function Test-ContextId([string]$Value) {
    $placeholders = @(
        '',
        'PENDING',
        'NOT_REQUIRED',
        'NOT_RECORDED',
        'SAME_AS_AUTHOR',
        'TBD',
        'TODO',
        'UNKNOWN'
    )
    return $Value -notin $placeholders
}

$author = Read-Field 'Author AI'
$reviewer = Read-Field 'Reviewer AI'
$reviewDecision = Read-Field 'Reviewer decision'
$checks = Read-Field 'Required checks'
$unresolved = Read-Field 'Unresolved P0/P1 findings'
$liveRisk = Read-Field 'Live-risk decision'
$founderEvidence = Read-Field 'Founder evidence'
$deployDecision = Read-Field 'Deploy decision'

if ($LegacyRecord) {
    if ($author -notin @('CODEX', 'CLAUDE')) {
        Fail-Gate 'legacy Author AI must be CODEX or CLAUDE'
    }
    if ($reviewer -notin @('CODEX', 'CLAUDE')) {
        Fail-Gate 'legacy Reviewer AI must be CODEX or CLAUDE'
    }
    if ($author -eq $reviewer) {
        Fail-Gate 'author and reviewer must be different agents'
    }
    if ($Operation -eq 'Deploy' -and $liveRisk -ne 'FOUNDER_APPROVED') {
        Fail-Gate 'deploy requires FOUNDER_APPROVED live-risk decision'
    }
    if ($deployDecision -ne 'READY') {
        Fail-Gate 'legacy deploy decision is not READY'
    }
}
else {
    $authorContext = Read-Field 'Author context ID'
    $reviewerContext = Read-Field 'Reviewer context ID'
    $riskTier = Read-Field 'Risk tier'
    $qaSecurity = Read-Field 'Independent QA/security'
    $mergeDecision = Read-Field 'Merge decision'

    if ($author -notin @('CODEX_AUTHOR', 'SOL_ULTRA_AUTHOR', 'CLAUDE_AUTHOR', 'CLAUDE')) {
        Fail-Gate 'Author AI must be an approved author role'
    }
    if ($reviewer -notin @('SOL_ULTRA_REVIEWER', 'CODEX_REVIEWER', 'CLAUDE_REVIEWER')) {
        Fail-Gate 'Reviewer AI must be an approved reviewer role'
    }
    if ($author -eq $reviewer) {
        Fail-Gate 'author and reviewer roles must differ'
    }
    if (-not (Test-ContextId $authorContext)) {
        Fail-Gate 'Author context ID must identify an isolated execution context'
    }
    if (-not (Test-ContextId $reviewerContext)) {
        Fail-Gate 'Reviewer context ID must identify an isolated execution context'
    }
    if ($authorContext -eq $reviewerContext) {
        Fail-Gate 'author and reviewer context IDs must differ'
    }
    if ($riskTier -notin @('DOCS', 'STANDARD', 'HIGH', 'LIVE')) {
        Fail-Gate 'Risk tier must be DOCS, STANDARD, HIGH, or LIVE'
    }
    if ($qaSecurity -notin @('NOT_REQUIRED', 'PASS')) {
        Fail-Gate 'Independent QA/security must be NOT_REQUIRED or PASS'
    }
    if ($riskTier -in @('HIGH', 'LIVE') -and $qaSecurity -ne 'PASS') {
        Fail-Gate 'HIGH and LIVE risk tiers require an independent QA/security PASS'
    }
    if ($mergeDecision -ne 'READY') {
        Fail-Gate 'merge decision is not READY'
    }
    if ($deployDecision -notin @('BLOCKED', 'NOT_APPLICABLE', 'READY')) {
        Fail-Gate 'Deploy decision must be BLOCKED, NOT_APPLICABLE, or READY'
    }
    if ($Operation -eq 'Deploy') {
        if ($liveRisk -ne 'FOUNDER_APPROVED') {
            Fail-Gate 'deploy requires FOUNDER_APPROVED live-risk decision'
        }
        if ($deployDecision -ne 'READY') {
            Fail-Gate 'deploy decision is not READY'
        }
    }
    elseif ($deployDecision -eq 'READY' -and $liveRisk -ne 'FOUNDER_APPROVED') {
        Fail-Gate 'deploy readiness requires FOUNDER_APPROVED live-risk decision'
    }
}

if ($reviewDecision -ne 'APPROVED') {
    Fail-Gate 'reviewer decision is not APPROVED'
}
if ($checks -ne 'PASS') {
    Fail-Gate 'required checks are not PASS'
}
if ($unresolved -ne '0') {
    Fail-Gate 'unresolved P0/P1 findings remain'
}
if ($liveRisk -notin @('NOT_REQUIRED', 'FOUNDER_APPROVED')) {
    Fail-Gate 'live-risk decision is not cleared'
}
if ($liveRisk -eq 'FOUNDER_APPROVED' -and $founderEvidence -in @('', 'PENDING', 'NOT_REQUIRED', 'NOT_RECORDED')) {
    Fail-Gate 'founder approval requires a safe evidence reference'
}

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
Write-Output "Operation=$Operation"
Write-Output "LegacyRecord=$($LegacyRecord.IsPresent)"
exit 0
