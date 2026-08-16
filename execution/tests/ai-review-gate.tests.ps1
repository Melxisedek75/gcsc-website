Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$sourceRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if ($LASTEXITCODE -ne 0 -or -not $sourceRoot) {
    throw 'Run this test inside the GCSC Git repository.'
}

$gate = Join-Path $sourceRoot 'execution\ai-review-gate.ps1'
$template = Join-Path $sourceRoot 'ai-review\TEMPLATE.md'
$tempBase = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
$testRoot = Join-Path $tempBase ("gcsc-ai-review-gate-tests-" + [guid]::NewGuid().ToString('N'))
[System.IO.Directory]::CreateDirectory($testRoot) | Out-Null

$failures = New-Object System.Collections.Generic.List[string]
$passes = 0
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Invoke-Git {
    param(
        [string]$Repository,
        [string[]]$Arguments
    )

    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $output = & git -C $Repository @Arguments 2>&1
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if ($exitCode -ne 0) {
        throw "git $($Arguments -join ' ') failed in ${Repository}: $($output -join [Environment]::NewLine)"
    }
    return $output
}

function Write-Utf8File {
    param(
        [string]$Path,
        [string]$Content
    )

    $parent = Split-Path -Parent $Path
    [System.IO.Directory]::CreateDirectory($parent) | Out-Null
    [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}

function New-TestRepository {
    param(
        [string]$Name,
        [string]$ImplementationPath,
        [string]$ImplementationContent,
        [ValidateSet('DOCS', 'HIGH')]
        [string]$RiskTier
    )

    $repository = Join-Path $testRoot $Name
    [System.IO.Directory]::CreateDirectory($repository) | Out-Null
    Invoke-Git $repository @('init', '--quiet') | Out-Null
    Invoke-Git $repository @('checkout', '--quiet', '-b', 'test/review-gate') | Out-Null
    Invoke-Git $repository @('config', 'core.autocrlf', 'false') | Out-Null
    Invoke-Git $repository @('config', 'user.email', 'gate-tests@example.invalid') | Out-Null
    Invoke-Git $repository @('config', 'user.name', 'GCSC Gate Tests') | Out-Null

    Write-Utf8File (Join-Path $repository 'docs\base.md') "# Base`n"
    Invoke-Git $repository @('add', '--', 'docs/base.md') | Out-Null
    Invoke-Git $repository @('commit', '--quiet', '-m', 'test: base') | Out-Null
    $baseCommit = (Invoke-Git $repository @('rev-parse', 'HEAD') | Select-Object -Last 1).Trim()
    $baseTree = (Invoke-Git $repository @('rev-parse', "${baseCommit}^{tree}") | Select-Object -Last 1).Trim()

    Write-Utf8File (Join-Path $repository $ImplementationPath) $ImplementationContent
    Invoke-Git $repository @('add', '--', ($ImplementationPath -replace '\\', '/')) | Out-Null
    Invoke-Git $repository @('commit', '--quiet', '-m', 'test: implementation') | Out-Null
    $headCommit = (Invoke-Git $repository @('rev-parse', 'HEAD') | Select-Object -Last 1).Trim()
    $headTree = (Invoke-Git $repository @('rev-parse', "${headCommit}^{tree}") | Select-Object -Last 1).Trim()

    return [pscustomobject]@{
        Root = $repository
        Branch = 'test/review-gate'
        BaseCommit = $baseCommit
        BaseTree = $baseTree
        HeadCommit = $headCommit
        HeadTree = $headTree
        RiskTier = $RiskTier
    }
}

function New-StrictRecord {
    param(
        [pscustomobject]$Repository,
        [hashtable]$Overrides = @{},
        [string]$Eol = "`n"
    )

    $qaResult = if ($Repository.RiskTier -eq 'HIGH') { 'PASS' } else { 'NOT_REQUIRED' }
    $qaContext = if ($Repository.RiskTier -eq 'HIGH') { '33333333-3333-7333-8333-333333333333' } else { 'NOT_REQUIRED' }
    $qaDispatch = if ($Repository.RiskTier -eq 'HIGH') { 'codex-agent:33333333-3333-7333-8333-333333333333' } else { 'NOT_REQUIRED' }
    $fields = [ordered]@{
        'Change ID' = '2026-08-15-test-change'
        'Repository' = 'gcsc-website'
        'Branch' = $Repository.Branch
        'Base commit' = $Repository.BaseCommit
        'Head commit' = $Repository.HeadCommit
        'Author AI' = 'CODEX_AUTHOR'
        'Author context ID' = '11111111-1111-7111-8111-111111111111'
        'Reviewer AI' = 'SOL_ULTRA_REVIEWER'
        'Reviewer context ID' = '22222222-2222-7222-8222-222222222222'
        'Reviewer dispatch evidence' = 'codex-agent:22222222-2222-7222-8222-222222222222'
        'Reviewer attested head' = $Repository.HeadCommit
        'Reviewer attested tree' = $Repository.HeadTree
        'Author status' = 'READY_FOR_REVIEW'
        'Reviewed at (UTC)' = '2026-08-15T12:00:00Z'
        'Result summary' = 'PASS: author checks completed'
        'Known limitations and open risks' = 'No live or external action in scope'
        'Reviewer diff inspection' = 'PASS: base...head inspected independently'
        'Required checks rerun independently' = 'powershell gate tests: PASS'
        'Findings (P0/P1/P2/P3)' = 'P0=0 P1=0 P2=0 P3=0'
        'Final rationale' = 'Independent diff and checks support approval'
        'Status' = 'APPROVED'
        'Reviewer decision' = 'APPROVED'
        'Required checks' = 'PASS'
        'Risk tier' = $Repository.RiskTier
        'Independent QA/security' = $qaResult
        'QA/security context ID' = $qaContext
        'QA/security dispatch evidence' = $qaDispatch
        'Unresolved P0/P1 findings' = '0'
        'Live-risk decision' = 'NOT_REQUIRED'
        'Founder evidence' = 'NOT_REQUIRED'
        'Founder approval head' = 'NOT_REQUIRED'
        'Founder approval operation' = 'NOT_REQUIRED'
        'Merge decision' = 'READY'
        'Deploy decision' = 'BLOCKED_FOUNDER'
    }

    foreach ($key in $Overrides.Keys) {
        if (-not $fields.Contains($key)) {
            throw "Unknown strict-record field override: $key"
        }
        $fields[$key] = [string]$Overrides[$key]
    }

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add('# AI Review Record')
    $lines.Add('')
    foreach ($entry in $fields.GetEnumerator()) {
        $lines.Add("- $($entry.Key): $($entry.Value)")
    }
    $lines.Add('')
    $lines.Add('## Reviewer Notes')
    $lines.Add('')
    $lines.Add('- Independent diff inspection and checks completed.')
    return [string]::Join($Eol, $lines)
}

function New-LegacyRecord {
    param(
        [pscustomobject]$Repository,
        [string]$ChangeId = '2026-07-03-legacy'
    )

    @"
# AI Review Record

- Change ID: $ChangeId
- Repository: gcsc-website
- Branch: $($Repository.Branch)
- Base commit: $($Repository.BaseCommit)
- Head commit: $($Repository.HeadCommit)
- Author AI: CODEX
- Reviewer AI: CLAUDE
- Author status: READY_FOR_REVIEW
- Reviewer decision: APPROVED
- Required checks: PASS
- Unresolved P0/P1 findings: 0
- Live-risk decision: NOT_REQUIRED
- Founder evidence: NOT_REQUIRED
- Deploy decision: READY
"@.TrimEnd()
}

function Add-ReviewFixtureCommit {
    param(
        [pscustomobject]$Repository,
        [string]$Name,
        [byte[]]$Bytes,
        [switch]$WrongAuthor
    )

    $safeName = $Name -replace '[^A-Za-z0-9_.-]', '-'
    $relativePath = "ai-review/records/$safeName.md"
    $reviewFile = Join-Path $Repository.Root ($relativePath -replace '/', '\')
    [System.IO.Directory]::CreateDirectory((Split-Path -Parent $reviewFile)) | Out-Null
    [System.IO.File]::WriteAllBytes($reviewFile, $Bytes)
    Invoke-Git $Repository.Root @('add', '--', $relativePath) | Out-Null
    $commitName = if ($WrongAuthor) { 'GCSC Gate Tests' } else { 'SOL_ULTRA_REVIEWER' }
    $commitEmail = if ($WrongAuthor) { 'gate-tests@example.invalid' } else { 'sol-ultra-reviewer@gcsc.local' }
    Invoke-Git $Repository.Root @(
        '-c', "user.name=$commitName",
        '-c', "user.email=$commitEmail",
        'commit', '--quiet', '-m', "test: add $safeName fixture"
    ) | Out-Null
    return $reviewFile
}

function Invoke-Gate {
    param(
        [pscustomobject]$Repository,
        [string]$ReviewFile,
        [ValidateSet('Merge', 'Deploy')]
        [string]$Operation = 'Merge',
        [switch]$LegacyRecord
    )

    $arguments = @(
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-File', $gate,
        '-ReviewFile', $ReviewFile,
        '-Operation', $Operation
    )
    if ($LegacyRecord) {
        $arguments += '-LegacyRecord'
    }

    $previousErrorActionPreference = $ErrorActionPreference
    Push-Location $Repository.Root
    try {
        $ErrorActionPreference = 'Continue'
        $output = (& powershell @arguments 2>&1 | Out-String).Trim()
        $exitCode = $LASTEXITCODE
    }
    finally {
        Pop-Location
        $ErrorActionPreference = $previousErrorActionPreference
    }

    return [pscustomobject]@{
        ExitCode = $exitCode
        Output = $output
    }
}

function Assert-Gate {
    param(
        [string]$Name,
        [pscustomobject]$Repository,
        [string]$Content,
        [int]$ExpectedExitCode,
        [string]$ExpectedText,
        [ValidateSet('Merge', 'Deploy')]
        [string]$Operation = 'Merge',
        [switch]$LegacyRecord,
        [switch]$WrongCommitAuthor,
        [switch]$KeepPostHeadCommits,
        [switch]$SkipPairedRequest
    )

    if (-not $KeepPostHeadCommits) {
        $safeBranchName = $Name -replace '[^A-Za-z0-9_.-]', '-'
        $fixtureBranch = "test/fixture-$safeBranchName"
        Invoke-Git $Repository.Root @('switch', '--quiet', '--create', $fixtureBranch, $Repository.HeadCommit) | Out-Null
        $oldBranchPattern = "(?m)^- Branch: $([regex]::Escape($Repository.Branch))(\r?)$"
        $branchReplacement = "- Branch: $fixtureBranch" + '$1'
        $Content = [regex]::Replace($Content, $oldBranchPattern, $branchReplacement)
    }
    if (-not $SkipPairedRequest -and -not $LegacyRecord) {
        $currentFixtureBranch = (Invoke-Git $Repository.Root @('branch', '--show-current') | Select-Object -Last 1).Trim()
        $changeMatch = [regex]::Match($Content, '(?m)^- Change ID: ([0-9A-Za-z][0-9A-Za-z._-]*)\r?$')
        if (-not $changeMatch.Success) {
            throw 'Fixture record must contain a path-safe Change ID.'
        }
        $fixtureChangeId = $changeMatch.Groups[1].Value
        $requestRelative = "ai-review/coordination/inbox/codex-review/$fixtureChangeId-review.md"
        $requestFile = Join-Path $Repository.Root ($requestRelative -replace '/', '\')
        if (-not (Test-Path -LiteralPath $requestFile -PathType Leaf)) {
            Write-Utf8File $requestFile @"
# Review request

- Change ID: $fixtureChangeId
- Branch: $currentFixtureBranch
- Reviewed implementation commit: $($Repository.HeadCommit)
"@.TrimEnd()
            Invoke-Git $Repository.Root @('add', '--', $requestRelative) | Out-Null
            Invoke-Git $Repository.Root @('commit', '--quiet', '-m', 'test: add paired review request') | Out-Null
        }
    }
    $reviewFile = Add-ReviewFixtureCommit -Repository $Repository -Name $Name `
        -Bytes $utf8.GetBytes($Content) -WrongAuthor:$WrongCommitAuthor
    $result = Invoke-Gate -Repository $Repository -ReviewFile $reviewFile -Operation $Operation -LegacyRecord:$LegacyRecord
    if ($result.ExitCode -ne $ExpectedExitCode -or $result.Output -notmatch [regex]::Escape($ExpectedText)) {
        $failures.Add("${Name}: expected exit $ExpectedExitCode containing '$ExpectedText'; got exit $($result.ExitCode): $($result.Output)")
        Write-Output "FAIL $Name"
        return
    }

    $script:passes++
    Write-Output "PASS $Name"
}

function Assert-Condition {
    param(
        [string]$Name,
        [bool]$Condition,
        [string]$Failure
    )

    if (-not $Condition) {
        $failures.Add("${Name}: $Failure")
        Write-Output "FAIL $Name"
        return
    }
    $script:passes++
    Write-Output "PASS $Name"
}

try {
    $docsRepo = New-TestRepository -Name 'docs' -ImplementationPath 'docs\change.md' `
        -ImplementationContent "# Documentation change`n" -RiskTier DOCS
    $highRepo = New-TestRepository -Name 'high' -ImplementationPath 'src\app.ps1' `
        -ImplementationContent "Write-Output 'runtime'`n" -RiskTier HIGH

    Assert-Gate -Name 'valid-sol-ultra-lf' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Eol "`n") `
        -ExpectedExitCode 0 -ExpectedText 'AI_REVIEW_GATE=PASS'

    Assert-Gate -Name 'valid-sol-ultra-crlf' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Eol "`r`n") `
        -ExpectedExitCode 0 -ExpectedText 'AI_REVIEW_GATE=PASS'

    Assert-Gate -Name 'paired-review-request-required' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo) -SkipPairedRequest `
        -ExpectedExitCode 1 -ExpectedText 'paired review request must be a tracked regular Markdown file'

    Assert-Gate -Name 'environment-issued-uuid-v7-accepted' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Author context ID' = '019e7c87-8410-79f1-b86a-eedf78a1aa27'
        }) -ExpectedExitCode 0 -ExpectedText 'AI_REVIEW_GATE=PASS'

    Assert-Gate -Name 'uuid-v4-context-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Author context ID' = '11111111-1111-4111-8111-111111111111'
        }) -ExpectedExitCode 1 -ExpectedText 'Author context ID must identify an isolated execution context'

    Assert-Gate -Name 'literal-context-placeholder-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Author context ID' = '<task/thread/session ID; concrete and non-placeholder>'
        }) -ExpectedExitCode 1 -ExpectedText 'Author context ID must identify an isolated execution context'

    Assert-Gate -Name 'same-context-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Reviewer context ID' = '11111111-1111-7111-8111-111111111111'
            'Reviewer dispatch evidence' = 'codex-agent:11111111-1111-7111-8111-111111111111'
        }) `
        -ExpectedExitCode 1 -ExpectedText 'author and reviewer context IDs must differ'

    Assert-Gate -Name 'reviewer-dispatch-mismatch-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Reviewer dispatch evidence' = 'codex-agent:019e7c87-8410-79f1-b86a-eedf78a1aa27'
        }) -ExpectedExitCode 1 -ExpectedText 'Reviewer dispatch evidence must bind Reviewer context ID'

    Assert-Gate -Name 'invalid-reviewer-role-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Reviewer AI' = 'CODEX_AUTHOR'}) `
        -ExpectedExitCode 1 -ExpectedText 'Reviewer AI must be an approved reviewer role'

    Assert-Gate -Name 'pending-decision-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Reviewer decision' = 'PENDING'}) `
        -ExpectedExitCode 1 -ExpectedText 'reviewer decision is not APPROVED'

    Assert-Gate -Name 'failed-checks-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Required checks' = 'FAIL'}) `
        -ExpectedExitCode 1 -ExpectedText 'required checks are not PASS'

    Assert-Gate -Name 'pending-review-evidence-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Reviewer diff inspection' = 'PENDING'}) `
        -ExpectedExitCode 1 -ExpectedText 'Reviewer diff inspection must contain completed evidence'

    Assert-Gate -Name 'invalid-reviewed-at-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Reviewed at (UTC)' = 'PENDING'}) `
        -ExpectedExitCode 1 -ExpectedText 'Reviewed at (UTC) must be an ISO-8601 UTC timestamp'

    Assert-Gate -Name 'branch-mismatch-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Branch' = 'codex/wrong-branch'}) `
        -ExpectedExitCode 1 -ExpectedText 'record Branch does not match current branch'

    Assert-Gate -Name 'reviewer-attested-head-must-match' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Reviewer attested head' = $docsRepo.BaseCommit
            'Reviewer attested tree' = $docsRepo.BaseTree
        }) -ExpectedExitCode 1 -ExpectedText 'Reviewer attested head must match reviewed Head commit'

    Assert-Gate -Name 'review-attestation-commit-requires-reviewer-identity' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo) -WrongCommitAuthor `
        -ExpectedExitCode 1 -ExpectedText 'review attestation commit must be authored by Reviewer AI'

    Assert-Gate -Name 'stale-head-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Head commit' = $docsRepo.BaseCommit
            'Reviewer attested head' = $docsRepo.BaseCommit
            'Reviewer attested tree' = $docsRepo.BaseTree
        }) `
        -ExpectedExitCode 1 -ExpectedText 'only the current Markdown review record and paired request may'

    $requestRepo = New-TestRepository -Name 'paired-review-request' -ImplementationPath 'docs\change.md' `
        -ImplementationContent "# Documentation change`n" -RiskTier DOCS
    Write-Utf8File (Join-Path $requestRepo.Root 'ai-review\coordination\inbox\codex-review\2026-08-15-test-change-review.md') @"
# Review request

- Change ID: 2026-08-15-test-change
- Branch: test/review-gate
- Reviewed implementation commit: $($requestRepo.HeadCommit)
"@.TrimEnd()
    Invoke-Git $requestRepo.Root @('add', '--', 'ai-review/coordination/inbox/codex-review/2026-08-15-test-change-review.md') | Out-Null
    Invoke-Git $requestRepo.Root @('commit', '--quiet', '-m', 'test: add paired review request') | Out-Null
    Assert-Gate -Name 'post-head-paired-review-request-allowed' -Repository $requestRepo `
        -Content (New-StrictRecord -Repository $requestRepo) -KeepPostHeadCommits `
        -ExpectedExitCode 0 -ExpectedText 'AI_REVIEW_GATE=PASS'

    $payloadRepo = New-TestRepository -Name 'post-head-payload' -ImplementationPath 'docs\change.md' `
        -ImplementationContent "# Documentation change`n" -RiskTier DOCS
    Write-Utf8File (Join-Path $payloadRepo.Root 'ai-review\coordination\payload.ps1') "Write-Output 'unreviewed'`n"
    Invoke-Git $payloadRepo.Root @('add', '--', 'ai-review/coordination/payload.ps1') | Out-Null
    Invoke-Git $payloadRepo.Root @('commit', '--quiet', '-m', 'test: add unreviewed coordination payload') | Out-Null
    Assert-Gate -Name 'post-head-coordination-payload-rejected' -Repository $payloadRepo `
        -Content (New-StrictRecord -Repository $payloadRepo) -KeepPostHeadCommits `
        -ExpectedExitCode 1 -ExpectedText 'only the current Markdown review record and paired request may'

    Assert-Gate -Name 'runtime-cannot-be-declared-standard' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Risk tier' = 'STANDARD'
            'Independent QA/security' = 'NOT_REQUIRED'
            'QA/security context ID' = 'NOT_REQUIRED'
        }) -ExpectedExitCode 1 -ExpectedText 'declared Risk tier is lower than diff-derived minimum HIGH'

    Assert-Gate -Name 'high-risk-without-qa-rejected' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Independent QA/security' = 'NOT_REQUIRED'
            'QA/security context ID' = 'NOT_REQUIRED'
        }) -ExpectedExitCode 1 -ExpectedText 'HIGH and LIVE risk tiers require an independent QA/security PASS'

    Assert-Gate -Name 'high-risk-independent-qa-passes' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo) `
        -ExpectedExitCode 0 -ExpectedText 'DerivedRisk=HIGH'

    Assert-Gate -Name 'qa-context-must-differ-from-reviewer' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'QA/security context ID' = '22222222-2222-7222-8222-222222222222'
            'QA/security dispatch evidence' = 'codex-agent:22222222-2222-7222-8222-222222222222'
        }) `
        -ExpectedExitCode 1 -ExpectedText 'QA/security context ID must differ from author and reviewer contexts'

    Assert-Gate -Name 'live-risk-without-founder-approval-rejected' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{'Risk tier' = 'LIVE'}) `
        -ExpectedExitCode 1 -ExpectedText 'LIVE risk tier requires FOUNDER_APPROVED live-risk decision'

    $founderEvidence = 'codex-user-message:thread-123:2026-08-15T00:00:00Z'
    Assert-Gate -Name 'live-risk-remains-locally-blocked-after-evidence' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Risk tier' = 'LIVE'
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = $founderEvidence
            'Founder approval head' = $highRepo.HeadCommit
            'Founder approval operation' = 'Merge'
        }) -ExpectedExitCode 1 -ExpectedText 'local gate cannot authorize LIVE operations'

    Assert-Gate -Name 'arbitrary-founder-evidence-rejected' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Risk tier' = 'LIVE'
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = 'x'
            'Founder approval head' = $highRepo.HeadCommit
            'Founder approval operation' = 'Merge'
        }) -ExpectedExitCode 1 -ExpectedText 'Founder evidence must use an approved evidence reference format'

    Assert-Gate -Name 'founder-approval-head-must-match-reviewed-head' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Risk tier' = 'LIVE'
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = $founderEvidence
            'Founder approval head' = $highRepo.BaseCommit
            'Founder approval operation' = 'Merge'
        }) -ExpectedExitCode 1 -ExpectedText 'Founder approval head must match reviewed Head commit'

    Assert-Gate -Name 'deploy-requires-deploy-scoped-founder-approval' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = $founderEvidence
            'Founder approval head' = $highRepo.HeadCommit
            'Founder approval operation' = 'Merge'
            'Deploy decision' = 'READY'
        }) -Operation Deploy -ExpectedExitCode 1 `
        -ExpectedText 'Founder approval operation does not authorize Deploy'

    Assert-Gate -Name 'deploy-remains-locally-blocked-after-evidence' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = $founderEvidence
            'Founder approval head' = $highRepo.HeadCommit
            'Founder approval operation' = 'Deploy'
            'Deploy decision' = 'READY'
        }) -Operation Deploy -ExpectedExitCode 1 -ExpectedText 'local gate cannot authorize Deploy operations'

    Assert-Gate -Name 'legacy-rejected-by-default' -Repository $docsRepo `
        -Content (New-LegacyRecord -Repository $docsRepo) `
        -ExpectedExitCode 1 -ExpectedText 'missing field: Author context ID'

    Assert-Gate -Name 'legacy-explicitly-blocked-for-merge' -Repository $docsRepo `
        -Content (New-LegacyRecord -Repository $docsRepo) -LegacyRecord `
        -ExpectedExitCode 1 -ExpectedText 'legacy records are archival only and cannot authorize Merge or Deploy'

    Assert-Gate -Name 'legacy-explicitly-blocked-for-deploy' -Repository $docsRepo `
        -Content (New-LegacyRecord -Repository $docsRepo) -LegacyRecord -Operation Deploy `
        -ExpectedExitCode 1 -ExpectedText 'legacy records are archival only and cannot authorize Merge or Deploy'

    Assert-Gate -Name 'duplicate-field-rejected' -Repository $docsRepo `
        -Content ((New-StrictRecord -Repository $docsRepo) + "`n- Reviewer decision: APPROVED") `
        -ExpectedExitCode 1 -ExpectedText 'duplicate field: Reviewer decision'

    $ignoredRelative = 'ai-review/records/ignored-review-record.md'
    $ignoredFile = Join-Path $docsRepo.Root ($ignoredRelative -replace '/', '\')
    Write-Utf8File $ignoredFile (New-StrictRecord -Repository $docsRepo)
    [System.IO.File]::AppendAllText(
        (Join-Path $docsRepo.Root '.git\info\exclude'),
        "`n/$ignoredRelative`n",
        $utf8
    )
    $ignoredResult = Invoke-Gate -Repository $docsRepo -ReviewFile $ignoredFile
    Assert-Condition -Name 'ignored-untracked-review-record-rejected' `
        -Condition ($ignoredResult.ExitCode -eq 1 -and $ignoredResult.Output -match 'review file must be a tracked regular Git file') `
        -Failure "unexpected result: $($ignoredResult.Output)"

    $invalidUtf8File = Add-ReviewFixtureCommit -Repository $docsRepo -Name 'invalid-utf8-rejected' `
        -Bytes ([byte[]](0x23, 0x20, 0xC3, 0x28))
    $invalidUtf8Result = Invoke-Gate -Repository $docsRepo -ReviewFile $invalidUtf8File
    Assert-Condition -Name 'invalid-utf8-rejected' `
        -Condition ($invalidUtf8Result.ExitCode -eq 1 -and $invalidUtf8Result.Output -match 'review file must be valid UTF-8') `
        -Failure "unexpected result: $($invalidUtf8Result.Output)"

    $gateParameters = (Get-Command $gate).Parameters.Keys
    Assert-Condition -Name 'no-public-git-state-bypass' `
        -Condition ('SkipGitState' -notin $gateParameters) `
        -Failure 'SkipGitState remains a public gate bypass'

    $templateContent = [System.IO.File]::ReadAllText($template, $utf8)
    $requiredTemplateFields = @(
        'Change ID', 'Branch', 'Base commit', 'Head commit', 'Author AI',
        'Author context ID', 'Reviewer AI', 'Reviewer context ID', 'Risk tier',
        'Reviewer dispatch evidence',
        'Reviewer attested head', 'Reviewer attested tree',
        'Reviewed at (UTC)', 'Result summary', 'Known limitations and open risks',
        'Reviewer diff inspection', 'Required checks rerun independently',
        'Findings (P0/P1/P2/P3)', 'Final rationale', 'Status',
        'Independent QA/security', 'QA/security context ID',
        'QA/security dispatch evidence', 'Reviewer decision',
        'Required checks', 'Unresolved P0/P1 findings', 'Live-risk decision',
        'Founder evidence', 'Founder approval head', 'Founder approval operation',
        'Merge decision', 'Deploy decision'
    )
    foreach ($field in $requiredTemplateFields) {
        Assert-Condition -Name "template-field-$($field -replace '[^A-Za-z0-9]', '-')" `
            -Condition ($templateContent -match "(?m)^- $([regex]::Escape($field)):") `
            -Failure "template is missing exact field '$field'"
    }

    if ($failures.Count -gt 0) {
        Write-Output ''
        foreach ($failure in $failures) {
            Write-Output $failure
        }
        throw "AI_REVIEW_GATE_TESTS=FAIL ($($failures.Count) failed, $passes passed)"
    }

    Write-Output "AI_REVIEW_GATE_TESTS=PASS ($passes passed)"
}
finally {
    $resolvedTestRoot = [System.IO.Path]::GetFullPath($testRoot)
    if ($resolvedTestRoot.StartsWith($tempBase, [System.StringComparison]::OrdinalIgnoreCase) -and
        (Split-Path -Leaf $resolvedTestRoot).StartsWith('gcsc-ai-review-gate-tests-')) {
        Remove-Item -LiteralPath $resolvedTestRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
