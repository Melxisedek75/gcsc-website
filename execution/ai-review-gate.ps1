param(
    [Parameter(Mandatory = $true)]
    [string]$ReviewFile,

    [ValidateSet('Merge', 'Deploy')]
    [string]$Operation = 'Merge',

    [switch]$LegacyRecord
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Fail-Gate([string]$Message) {
    Write-Error "AI_REVIEW_GATE=FAIL: $Message"
    exit 1
}

function Invoke-GitLines {
    param([string[]]$Arguments)

    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $output = & git -C $root @Arguments 2>&1
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if ($exitCode -ne 0) {
        Fail-Gate "git $($Arguments -join ' ') failed"
    }
    return @($output)
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
        '', 'PENDING', 'NOT_REQUIRED', 'NOT_RECORDED', 'SAME_AS_AUTHOR',
        'TBD', 'TODO', 'UNKNOWN'
    )
    if ($Value -in $placeholders) { return $false }
    if ($Value -match '^<.*>$') { return $false }
    if ($Value -match '(?i)placeholder|task/thread/session|fresh isolated') { return $false }
    return $Value.Length -ge 8
}

function Test-FullCommit([string]$Value, [string]$FieldName) {
    if ($Value -notmatch '^[0-9a-fA-F]{40}$') {
        Fail-Gate "$FieldName must be a full 40-character commit SHA"
    }
    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        & git -C $root cat-file -e "${Value}^{commit}" 2>$null
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if ($exitCode -ne 0) {
        Fail-Gate "$FieldName does not identify a commit in this repository"
    }
}

$changeId = Read-Field 'Change ID'
$recordBranch = Read-Field 'Branch'
$baseCommit = Read-Field 'Base commit'
$headCommit = Read-Field 'Head commit'
$author = Read-Field 'Author AI'
$reviewer = Read-Field 'Reviewer AI'
$reviewDecision = Read-Field 'Reviewer decision'
$checks = Read-Field 'Required checks'
$unresolved = Read-Field 'Unresolved P0/P1 findings'
$liveRisk = Read-Field 'Live-risk decision'
$founderEvidence = Read-Field 'Founder evidence'
$deployDecision = Read-Field 'Deploy decision'
$derivedRisk = 'LEGACY'

Test-FullCommit $baseCommit 'Base commit'
Test-FullCommit $headCommit 'Head commit'

$currentBranch = (Invoke-GitLines @('branch', '--show-current') | Select-Object -Last 1).Trim()
if (-not $currentBranch -or $currentBranch -in @('main', 'master')) {
    Fail-Gate 'reviewed work must be on a non-main feature branch'
}
if ($recordBranch -ne $currentBranch) {
    Fail-Gate 'record Branch does not match current branch'
}

$currentHead = (Invoke-GitLines @('rev-parse', 'HEAD') | Select-Object -Last 1).Trim()
$previousErrorActionPreference = $ErrorActionPreference
try {
    $ErrorActionPreference = 'Continue'
    & git -C $root merge-base --is-ancestor $baseCommit $headCommit 2>$null
    $baseIsAncestor = $LASTEXITCODE -eq 0
    & git -C $root merge-base --is-ancestor $headCommit $currentHead 2>$null
    $headIsAncestor = $LASTEXITCODE -eq 0
}
finally {
    $ErrorActionPreference = $previousErrorActionPreference
}
if (-not $baseIsAncestor) {
    Fail-Gate 'Base commit must be an ancestor of reviewed Head commit'
}
if (-not $headIsAncestor) {
    Fail-Gate 'reviewed Head commit must be an ancestor of current HEAD'
}

$postHeadFiles = Invoke-GitLines @('diff', '--name-only', "${headCommit}..${currentHead}") |
    ForEach-Object { ([string]$_).Trim().Replace('\', '/') } |
    Where-Object { $_ }
$unreviewedFiles = @($postHeadFiles | Where-Object {
    $_ -notmatch '^ai-review/records/[^/]+\.md$' -and
    $_ -notmatch '^ai-review/coordination/'
})
if ($unreviewedFiles.Count -gt 0) {
    Fail-Gate 'unreviewed non-coordination changes exist after recorded Head commit'
}

$dirty = Invoke-GitLines @('status', '--porcelain')
if ($dirty) {
    Fail-Gate 'working tree must be clean before merge/deploy'
}

if ($LegacyRecord) {
    if ($changeId -notmatch '^(?<date>\d{4}-\d{2}-\d{2})(?:-|$)') {
        Fail-Gate 'legacy Change ID must begin with YYYY-MM-DD'
    }
    try {
        $legacyDate = [datetime]::ParseExact(
            $Matches['date'],
            'yyyy-MM-dd',
            [System.Globalization.CultureInfo]::InvariantCulture
        )
    }
    catch {
        Fail-Gate 'legacy Change ID must begin with a valid YYYY-MM-DD date'
    }
    if ($legacyDate -ge [datetime]'2026-08-15') {
        Fail-Gate 'legacy compatibility is limited to records before 2026-08-15'
    }
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
    $qaContext = Read-Field 'QA/security context ID'
    $founderApprovalHead = Read-Field 'Founder approval head'
    $founderApprovalOperation = Read-Field 'Founder approval operation'
    $mergeDecision = Read-Field 'Merge decision'

    if ($author -notin @('CODEX_AUTHOR', 'SOL_ULTRA_AUTHOR', 'CLAUDE_AUTHOR', 'CLAUDE')) {
        Fail-Gate 'Author AI must be an approved author role'
    }
    if ($reviewer -notin @('SOL_ULTRA_REVIEWER', 'CODEX_REVIEWER', 'CLAUDE_REVIEWER')) {
        Fail-Gate 'Reviewer AI must be an approved reviewer role'
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
    $reviewedFiles = Invoke-GitLines @('diff', '--name-only', "${baseCommit}...${headCommit}") |
        ForEach-Object { ([string]$_).Trim().Replace('\', '/') } |
        Where-Object { $_ }
    if (-not $reviewedFiles) {
        Fail-Gate 'reviewed diff is empty'
    }
    $nonDocumentationFiles = @($reviewedFiles | Where-Object {
        [System.IO.Path]::GetExtension($_).ToLowerInvariant() -notin @('.md', '.txt', '.csv')
    })
    $derivedRisk = if ($nonDocumentationFiles.Count -eq 0) { 'DOCS' } else { 'HIGH' }
    $riskRank = @{DOCS = 0; STANDARD = 1; HIGH = 2; LIVE = 3}
    if ($riskRank[$riskTier] -lt $riskRank[$derivedRisk]) {
        Fail-Gate "declared Risk tier is lower than diff-derived minimum $derivedRisk"
    }

    if ($qaSecurity -notin @('NOT_REQUIRED', 'PASS')) {
        Fail-Gate 'Independent QA/security must be NOT_REQUIRED or PASS'
    }
    if ($riskTier -in @('HIGH', 'LIVE') -and $qaSecurity -ne 'PASS') {
        Fail-Gate 'HIGH and LIVE risk tiers require an independent QA/security PASS'
    }
    if ($riskTier -in @('HIGH', 'LIVE') -and -not (Test-ContextId $qaContext)) {
        Fail-Gate 'HIGH and LIVE risk tiers require an isolated QA/security context ID'
    }
    if ($qaSecurity -eq 'PASS') {
        if (-not (Test-ContextId $qaContext)) {
            Fail-Gate 'a QA/security PASS requires an isolated QA/security context ID'
        }
        if ($qaContext -in @($authorContext, $reviewerContext)) {
            Fail-Gate 'QA/security context ID must differ from author and reviewer contexts'
        }
    }
    elseif ($qaContext -ne 'NOT_REQUIRED') {
        Fail-Gate 'QA/security context ID must be NOT_REQUIRED when QA/security is NOT_REQUIRED'
    }

    if ($liveRisk -eq 'NOT_REQUIRED') {
        if ($founderEvidence -ne 'NOT_REQUIRED' -or
            $founderApprovalHead -ne 'NOT_REQUIRED' -or
            $founderApprovalOperation -ne 'NOT_REQUIRED') {
            Fail-Gate 'founder approval fields must be NOT_REQUIRED when live-risk is NOT_REQUIRED'
        }
    }
    elseif ($liveRisk -eq 'FOUNDER_APPROVED') {
        if ($founderEvidence -notmatch '^(github-pr-comment|codex-user-message):[A-Za-z0-9._/#:@-]+$') {
            Fail-Gate 'Founder evidence must use an approved evidence reference format'
        }
        if ($founderApprovalHead -ne $headCommit) {
            Fail-Gate 'Founder approval head must match reviewed Head commit'
        }
        if ($founderApprovalOperation -notin @('Merge', 'Deploy', 'MergeAndDeploy')) {
            Fail-Gate 'Founder approval operation must be Merge, Deploy, or MergeAndDeploy'
        }
        $operationAuthorized = switch ($Operation) {
            'Merge' { $founderApprovalOperation -in @('Merge', 'MergeAndDeploy') }
            'Deploy' { $founderApprovalOperation -in @('Deploy', 'MergeAndDeploy') }
        }
        if (-not $operationAuthorized) {
            Fail-Gate "Founder approval operation does not authorize $Operation"
        }
    }
    else {
        Fail-Gate 'live-risk decision is not cleared'
    }

    if ($riskTier -eq 'LIVE' -and $liveRisk -ne 'FOUNDER_APPROVED') {
        Fail-Gate 'LIVE risk tier requires FOUNDER_APPROVED live-risk decision'
    }
    if ($mergeDecision -ne 'READY') {
        Fail-Gate 'merge decision is not READY'
    }
    if ($deployDecision -notin @('BLOCKED', 'BLOCKED_FOUNDER', 'NOT_APPLICABLE', 'READY')) {
        Fail-Gate 'Deploy decision must be BLOCKED, BLOCKED_FOUNDER, NOT_APPLICABLE, or READY'
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

Write-Output 'AI_REVIEW_GATE=PASS'
Write-Output "ReviewFile=$candidate"
Write-Output "Author=$author Reviewer=$reviewer"
Write-Output "ReviewedHead=$headCommit CurrentHead=$currentHead"
Write-Output "DerivedRisk=$derivedRisk"
Write-Output "Operation=$Operation"
Write-Output "LegacyRecord=$($LegacyRecord.IsPresent)"
exit 0
