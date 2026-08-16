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

    Write-Utf8File (Join-Path $repository $ImplementationPath) $ImplementationContent
    Invoke-Git $repository @('add', '--', ($ImplementationPath -replace '\\', '/')) | Out-Null
    Invoke-Git $repository @('commit', '--quiet', '-m', 'test: implementation') | Out-Null
    $headCommit = (Invoke-Git $repository @('rev-parse', 'HEAD') | Select-Object -Last 1).Trim()

    return [pscustomobject]@{
        Root = $repository
        Branch = 'test/review-gate'
        BaseCommit = $baseCommit
        HeadCommit = $headCommit
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
    $qaContext = if ($Repository.RiskTier -eq 'HIGH') { 'qa-thread-003' } else { 'NOT_REQUIRED' }
    $fields = [ordered]@{
        'Change ID' = '2026-08-15-test-change'
        'Repository' = 'gcsc-website'
        'Branch' = $Repository.Branch
        'Base commit' = $Repository.BaseCommit
        'Head commit' = $Repository.HeadCommit
        'Author AI' = 'CODEX_AUTHOR'
        'Author context ID' = 'author-thread-001'
        'Reviewer AI' = 'SOL_ULTRA_REVIEWER'
        'Reviewer context ID' = 'review-thread-002'
        'Author status' = 'READY_FOR_REVIEW'
        'Reviewer decision' = 'APPROVED'
        'Required checks' = 'PASS'
        'Risk tier' = $Repository.RiskTier
        'Independent QA/security' = $qaResult
        'QA/security context ID' = $qaContext
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
        [byte[]]$Bytes
    )

    $safeName = $Name -replace '[^A-Za-z0-9_.-]', '-'
    $relativePath = "ai-review/records/$safeName.md"
    $reviewFile = Join-Path $Repository.Root ($relativePath -replace '/', '\')
    [System.IO.Directory]::CreateDirectory((Split-Path -Parent $reviewFile)) | Out-Null
    [System.IO.File]::WriteAllBytes($reviewFile, $Bytes)
    Invoke-Git $Repository.Root @('add', '--', $relativePath) | Out-Null
    Invoke-Git $Repository.Root @('commit', '--quiet', '-m', "test: add $safeName fixture") | Out-Null
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
        [switch]$LegacyRecord
    )

    $reviewFile = Add-ReviewFixtureCommit -Repository $Repository -Name $Name -Bytes $utf8.GetBytes($Content)
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

    Assert-Gate -Name 'literal-context-placeholder-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{
            'Author context ID' = '<task/thread/session ID; concrete and non-placeholder>'
        }) -ExpectedExitCode 1 -ExpectedText 'Author context ID must identify an isolated execution context'

    Assert-Gate -Name 'same-context-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Reviewer context ID' = 'author-thread-001'}) `
        -ExpectedExitCode 1 -ExpectedText 'author and reviewer context IDs must differ'

    Assert-Gate -Name 'invalid-reviewer-role-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Reviewer AI' = 'CODEX_AUTHOR'}) `
        -ExpectedExitCode 1 -ExpectedText 'Reviewer AI must be an approved reviewer role'

    Assert-Gate -Name 'pending-decision-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Reviewer decision' = 'PENDING'}) `
        -ExpectedExitCode 1 -ExpectedText 'reviewer decision is not APPROVED'

    Assert-Gate -Name 'failed-checks-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Required checks' = 'FAIL'}) `
        -ExpectedExitCode 1 -ExpectedText 'required checks are not PASS'

    Assert-Gate -Name 'branch-mismatch-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Branch' = 'codex/wrong-branch'}) `
        -ExpectedExitCode 1 -ExpectedText 'record Branch does not match current branch'

    Assert-Gate -Name 'stale-head-rejected' -Repository $docsRepo `
        -Content (New-StrictRecord -Repository $docsRepo -Overrides @{'Head commit' = $docsRepo.BaseCommit}) `
        -ExpectedExitCode 1 -ExpectedText 'unreviewed non-coordination changes exist after recorded Head commit'

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
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{'QA/security context ID' = 'review-thread-002'}) `
        -ExpectedExitCode 1 -ExpectedText 'QA/security context ID must differ from author and reviewer contexts'

    Assert-Gate -Name 'live-risk-without-founder-approval-rejected' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{'Risk tier' = 'LIVE'}) `
        -ExpectedExitCode 1 -ExpectedText 'LIVE risk tier requires FOUNDER_APPROVED live-risk decision'

    $founderEvidence = 'codex-user-message:thread-123:2026-08-15T00:00:00Z'
    Assert-Gate -Name 'live-risk-founder-approved-merge-passes' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Risk tier' = 'LIVE'
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = $founderEvidence
            'Founder approval head' = $highRepo.HeadCommit
            'Founder approval operation' = 'Merge'
        }) -ExpectedExitCode 0 -ExpectedText 'Operation=Merge'

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

    Assert-Gate -Name 'deploy-with-scoped-founder-approval-passes' -Repository $highRepo `
        -Content (New-StrictRecord -Repository $highRepo -Overrides @{
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = $founderEvidence
            'Founder approval head' = $highRepo.HeadCommit
            'Founder approval operation' = 'Deploy'
            'Deploy decision' = 'READY'
        }) -Operation Deploy -ExpectedExitCode 0 -ExpectedText 'Operation=Deploy'

    Assert-Gate -Name 'legacy-rejected-by-default' -Repository $docsRepo `
        -Content (New-LegacyRecord -Repository $docsRepo) `
        -ExpectedExitCode 1 -ExpectedText 'missing field: Author context ID'

    Assert-Gate -Name 'legacy-explicitly-accepted' -Repository $docsRepo `
        -Content (New-LegacyRecord -Repository $docsRepo) -LegacyRecord `
        -ExpectedExitCode 0 -ExpectedText 'LegacyRecord=True'

    Assert-Gate -Name 'legacy-mode-cannot-bypass-new-policy' -Repository $docsRepo `
        -Content (New-LegacyRecord -Repository $docsRepo -ChangeId '2026-08-15-bypass') -LegacyRecord `
        -ExpectedExitCode 1 -ExpectedText 'legacy compatibility is limited to records before 2026-08-15'

    Assert-Gate -Name 'duplicate-field-rejected' -Repository $docsRepo `
        -Content ((New-StrictRecord -Repository $docsRepo) + "`n- Reviewer decision: APPROVED") `
        -ExpectedExitCode 1 -ExpectedText 'duplicate field: Reviewer decision'

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
        'Independent QA/security', 'QA/security context ID', 'Reviewer decision',
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
