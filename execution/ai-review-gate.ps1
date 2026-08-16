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

$relativeReviewPath = $candidate.Substring($root.Length).TrimStart('\', '/').Replace('\', '/')
if ($relativeReviewPath.Contains(':')) {
    Fail-Gate 'review file path must not contain an alternate data stream'
}
$attributes = [System.IO.File]::GetAttributes($candidate)
if (($attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
    Fail-Gate 'review file must not be a symlink or reparse point'
}
$trackedEntry = @(Invoke-GitLines @('ls-files', '--stage', '--', $relativeReviewPath))
if (-not $trackedEntry -or $trackedEntry.Count -ne 1 -or $trackedEntry[0] -notmatch '^100(?:644|755) [0-9a-f]+ 0\s+') {
    Fail-Gate 'review file must be a tracked regular Git file'
}
$trackedBlob = (Invoke-GitLines @('rev-parse', "HEAD:$relativeReviewPath") | Select-Object -Last 1).Trim()
$workingBlob = (Invoke-GitLines @('hash-object', '--', $candidate) | Select-Object -Last 1).Trim()
if ($trackedBlob -ne $workingBlob) {
    Fail-Gate 'review file content must match the committed HEAD blob'
}

try {
    $utf8 = New-Object System.Text.UTF8Encoding($false, $true)
    $content = [System.IO.File]::ReadAllText($candidate, $utf8)
}
catch {
    Fail-Gate "review file must be valid UTF-8: $($_.Exception.Message)"
}

if ($LegacyRecord) {
    Fail-Gate 'legacy records are archival only and cannot authorize Merge or Deploy'
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
    if ($values.Count -ne 1) {
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
    return $Value -match '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'
}

function Test-CompletedEvidence([string]$Value) {
    if ($Value -match '^(PENDING|TBD|TODO|UNKNOWN|NOT_RECORDED)$') { return $false }
    if ($Value -match '^<.*>$') { return $false }
    return $Value.Trim().Length -ge 8
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

if ($changeId -notmatch '^[0-9A-Za-z][0-9A-Za-z._-]*$') {
    Fail-Gate 'Change ID must be path-safe'
}

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

$postHeadFiles = @(Invoke-GitLines @('diff', '--name-only', "${headCommit}..${currentHead}") |
    ForEach-Object { ([string]$_).Trim().Replace('\', '/') } |
    Where-Object { $_ })
$reviewRequestPath = "ai-review/coordination/inbox/codex-review/$changeId-review.md"
$allowedPostHeadFiles = @($relativeReviewPath, $reviewRequestPath)
$unreviewedFiles = @($postHeadFiles | Where-Object { $_ -notin $allowedPostHeadFiles })
if ($unreviewedFiles.Count -gt 0) {
    Fail-Gate 'only the current Markdown review record and paired request may change after reviewed Head commit'
}
if ($reviewRequestPath -in $postHeadFiles) {
    $requestEntry = @(Invoke-GitLines @('ls-tree', 'HEAD', '--', $reviewRequestPath))
    if ($requestEntry.Count -ne 1 -or $requestEntry[0] -notmatch '^100(?:644|755) blob [0-9a-f]+\s+') {
        Fail-Gate 'paired review request must be a tracked regular Markdown file'
    }
}

$dirty = Invoke-GitLines @('status', '--porcelain')
if ($dirty) {
    Fail-Gate 'working tree must be clean before merge/deploy'
}

$authorContext = Read-Field 'Author context ID'
    $reviewerContext = Read-Field 'Reviewer context ID'
    $reviewerAttestedHead = Read-Field 'Reviewer attested head'
    $reviewerAttestedTree = Read-Field 'Reviewer attested tree'
    $authorStatus = Read-Field 'Author status'
    $reviewedAt = Read-Field 'Reviewed at (UTC)'
    $resultSummary = Read-Field 'Result summary'
    $knownLimitations = Read-Field 'Known limitations and open risks'
    $reviewerDiffInspection = Read-Field 'Reviewer diff inspection'
    $checksRerun = Read-Field 'Required checks rerun independently'
    $findings = Read-Field 'Findings (P0/P1/P2/P3)'
    $finalRationale = Read-Field 'Final rationale'
    $status = Read-Field 'Status'
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
    if ($authorStatus -ne 'READY_FOR_REVIEW') {
        Fail-Gate 'author status is not READY_FOR_REVIEW'
    }
    try {
        [datetime]::ParseExact(
            $reviewedAt,
            'yyyy-MM-ddTHH:mm:ssZ',
            [System.Globalization.CultureInfo]::InvariantCulture,
            [System.Globalization.DateTimeStyles]::AssumeUniversal
        ) | Out-Null
    }
    catch {
        Fail-Gate 'Reviewed at (UTC) must be an ISO-8601 UTC timestamp'
    }
    foreach ($evidenceField in @{
        'Result summary' = $resultSummary
        'Known limitations and open risks' = $knownLimitations
        'Reviewer diff inspection' = $reviewerDiffInspection
        'Required checks rerun independently' = $checksRerun
        'Findings (P0/P1/P2/P3)' = $findings
        'Final rationale' = $finalRationale
    }.GetEnumerator()) {
        if (-not (Test-CompletedEvidence $evidenceField.Value)) {
            Fail-Gate "$($evidenceField.Key) must contain completed evidence"
        }
    }
    if ($status -ne 'APPROVED') {
        Fail-Gate 'review status is not APPROVED'
    }
    if ($reviewerAttestedHead -ne $headCommit) {
        Fail-Gate 'Reviewer attested head must match reviewed Head commit'
    }
    $headTree = (Invoke-GitLines @('rev-parse', "${headCommit}^{tree}") | Select-Object -Last 1).Trim()
    if ($reviewerAttestedTree -ne $headTree) {
        Fail-Gate 'Reviewer attested tree must match reviewed Head tree'
    }

    $reviewCommit = (Invoke-GitLines @('log', '-1', '--format=%H', '--', $relativeReviewPath) | Select-Object -Last 1).Trim()
    if (-not $reviewCommit -or $reviewCommit -eq $headCommit) {
        Fail-Gate 'review attestation must be committed after the reviewed Head commit'
    }
    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        & git -C $root merge-base --is-ancestor $headCommit $reviewCommit 2>$null
        $reviewAfterHead = $LASTEXITCODE -eq 0
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if (-not $reviewAfterHead) {
        Fail-Gate 'review attestation commit must descend from reviewed Head commit'
    }
    $reviewCommitAuthor = (Invoke-GitLines @('show', '-s', '--format=%an', $reviewCommit) | Select-Object -Last 1).Trim()
    $reviewCommitEmail = (Invoke-GitLines @('show', '-s', '--format=%ae', $reviewCommit) | Select-Object -Last 1).Trim()
    $expectedReviewerEmail = $reviewer.ToLowerInvariant().Replace('_', '-') + '@gcsc.local'
    if ($reviewCommitAuthor -ne $reviewer -or $reviewCommitEmail -ne $expectedReviewerEmail) {
        Fail-Gate 'review attestation commit must be authored by Reviewer AI'
    }
    $reviewCommitFiles = @(Invoke-GitLines @('diff-tree', '--no-commit-id', '--name-only', '-r', $reviewCommit) |
        ForEach-Object { ([string]$_).Trim().Replace('\', '/') } |
        Where-Object { $_ })
    if ($reviewCommitFiles.Count -ne 1 -or $reviewCommitFiles[0] -ne $relativeReviewPath) {
        Fail-Gate 'review attestation commit may change only its review record'
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
    if ($riskTier -eq 'LIVE') {
        Fail-Gate 'local gate cannot authorize LIVE operations'
    }
    if ($Operation -eq 'Deploy') {
        Fail-Gate 'local gate cannot authorize Deploy operations'
    }
    if ($mergeDecision -ne 'READY') {
        Fail-Gate 'merge decision is not READY'
    }
    if ($deployDecision -notin @('BLOCKED', 'BLOCKED_FOUNDER', 'NOT_APPLICABLE', 'READY')) {
        Fail-Gate 'Deploy decision must be BLOCKED, BLOCKED_FOUNDER, NOT_APPLICABLE, or READY'
    }
if ($deployDecision -eq 'READY' -and $liveRisk -ne 'FOUNDER_APPROVED') {
    Fail-Gate 'deploy readiness requires FOUNDER_APPROVED live-risk decision'
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
exit 0
