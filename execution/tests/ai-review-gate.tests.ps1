Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
if ($LASTEXITCODE -ne 0 -or -not $repoRoot) {
    throw 'Run this test inside the GCSC Git repository.'
}

$gate = Join-Path $repoRoot 'execution\ai-review-gate.ps1'
$recordsRoot = [System.IO.Path]::GetFullPath((Join-Path $repoRoot 'ai-review\records'))
$testRoot = Join-Path $recordsRoot (".gate-tests-" + [guid]::NewGuid().ToString('N'))
[System.IO.Directory]::CreateDirectory($testRoot) | Out-Null

$failures = New-Object System.Collections.Generic.List[string]
$passes = 0

function New-StrictRecord {
    param(
        [hashtable]$Overrides = @{},
        [string]$Eol = "`n"
    )

    $fields = [ordered]@{
        'Change ID' = '2026-08-15-test-change'
        'Repository' = 'gcsc-website'
        'Branch' = 'codex/test-change'
        'Base commit' = ('a' * 40)
        'Head commit' = ('b' * 40)
        'Author AI' = 'CODEX_AUTHOR'
        'Author context ID' = 'author-thread-001'
        'Reviewer AI' = 'SOL_ULTRA_REVIEWER'
        'Reviewer context ID' = 'review-thread-002'
        'Author status' = 'READY_FOR_REVIEW'
        'Reviewer decision' = 'APPROVED'
        'Required checks' = 'PASS'
        'Risk tier' = 'DOCS'
        'Independent QA/security' = 'NOT_REQUIRED'
        'QA/security context ID' = 'NOT_REQUIRED'
        'Unresolved P0/P1 findings' = '0'
        'Live-risk decision' = 'NOT_REQUIRED'
        'Founder evidence' = 'NOT_REQUIRED'
        'Merge decision' = 'READY'
        'Deploy decision' = 'BLOCKED'
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
        [string]$ChangeId = '2026-07-03-legacy'
    )

    @"
# AI Review Record

- Change ID: $ChangeId
- Repository: gcsc-website
- Branch: codex/legacy
- Base commit: $('c' * 40)
- Head commit: $('d' * 40)
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

function Invoke-Gate {
    param(
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
        '-SkipGitState',
        '-Operation', $Operation
    )
    if ($LegacyRecord) {
        $arguments += '-LegacyRecord'
    }

    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $output = (& powershell @arguments 2>&1 | Out-String).Trim()
        $exitCode = $LASTEXITCODE
    }
    finally {
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
        [string]$Content,
        [int]$ExpectedExitCode,
        [string]$ExpectedText,
        [ValidateSet('Merge', 'Deploy')]
        [string]$Operation = 'Merge',
        [switch]$LegacyRecord
    )

    $safeName = $Name -replace '[^A-Za-z0-9_.-]', '-'
    $reviewFile = Join-Path $testRoot "$safeName.md"
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($reviewFile, $Content, $utf8)

    $result = Invoke-Gate -ReviewFile $reviewFile -Operation $Operation -LegacyRecord:$LegacyRecord
    if ($result.ExitCode -ne $ExpectedExitCode -or $result.Output -notmatch [regex]::Escape($ExpectedText)) {
        $failures.Add("${Name}: expected exit $ExpectedExitCode containing '$ExpectedText'; got exit $($result.ExitCode): $($result.Output)")
        Write-Output "FAIL $Name"
        return
    }

    $script:passes++
    Write-Output "PASS $Name"
}

try {
    Assert-Gate -Name 'valid-sol-ultra-lf' `
        -Content (New-StrictRecord -Eol "`n") `
        -ExpectedExitCode 0 -ExpectedText 'AI_REVIEW_GATE=PASS'

    Assert-Gate -Name 'valid-sol-ultra-crlf' `
        -Content (New-StrictRecord -Eol "`r`n") `
        -ExpectedExitCode 0 -ExpectedText 'AI_REVIEW_GATE=PASS'

    Assert-Gate -Name 'same-context-rejected' `
        -Content (New-StrictRecord -Overrides @{'Reviewer context ID' = 'author-thread-001'}) `
        -ExpectedExitCode 1 -ExpectedText 'author and reviewer context IDs must differ'

    Assert-Gate -Name 'placeholder-context-rejected' `
        -Content (New-StrictRecord -Overrides @{'Reviewer context ID' = 'PENDING'}) `
        -ExpectedExitCode 1 -ExpectedText 'Reviewer context ID must identify an isolated execution context'

    Assert-Gate -Name 'same-role-rejected' `
        -Content (New-StrictRecord -Overrides @{'Reviewer AI' = 'CODEX_AUTHOR'}) `
        -ExpectedExitCode 1 -ExpectedText 'Reviewer AI must be an approved reviewer role'

    Assert-Gate -Name 'pending-decision-rejected' `
        -Content (New-StrictRecord -Overrides @{'Reviewer decision' = 'PENDING'}) `
        -ExpectedExitCode 1 -ExpectedText 'reviewer decision is not APPROVED'

    Assert-Gate -Name 'failed-checks-rejected' `
        -Content (New-StrictRecord -Overrides @{'Required checks' = 'FAIL'}) `
        -ExpectedExitCode 1 -ExpectedText 'required checks are not PASS'

    Assert-Gate -Name 'high-risk-without-qa-rejected' `
        -Content (New-StrictRecord -Overrides @{'Risk tier' = 'HIGH'}) `
        -ExpectedExitCode 1 -ExpectedText 'HIGH and LIVE risk tiers require an independent QA/security PASS'

    Assert-Gate -Name 'high-risk-with-independent-qa-passes' `
        -Content (New-StrictRecord -Overrides @{
            'Risk tier' = 'HIGH'
            'Independent QA/security' = 'PASS'
            'QA/security context ID' = 'qa-thread-003'
        }) `
        -ExpectedExitCode 0 -ExpectedText 'AI_REVIEW_GATE=PASS'

    Assert-Gate -Name 'high-risk-placeholder-qa-context-rejected' `
        -Content (New-StrictRecord -Overrides @{
            'Risk tier' = 'HIGH'
            'Independent QA/security' = 'PASS'
        }) `
        -ExpectedExitCode 1 `
        -ExpectedText 'HIGH and LIVE risk tiers require an isolated QA/security context ID'

    Assert-Gate -Name 'qa-context-must-differ-from-reviewer' `
        -Content (New-StrictRecord -Overrides @{
            'Risk tier' = 'HIGH'
            'Independent QA/security' = 'PASS'
            'QA/security context ID' = 'review-thread-002'
        }) `
        -ExpectedExitCode 1 `
        -ExpectedText 'QA/security context ID must differ from author and reviewer contexts'

    Assert-Gate -Name 'live-risk-tier-without-founder-approval-rejected' `
        -Content (New-StrictRecord -Overrides @{
            'Risk tier' = 'LIVE'
            'Independent QA/security' = 'PASS'
            'QA/security context ID' = 'qa-thread-003'
        }) `
        -ExpectedExitCode 1 `
        -ExpectedText 'LIVE risk tier requires FOUNDER_APPROVED live-risk decision'

    Assert-Gate -Name 'live-risk-tier-with-founder-approval-passes-merge-gate' `
        -Content (New-StrictRecord -Overrides @{
            'Risk tier' = 'LIVE'
            'Independent QA/security' = 'PASS'
            'QA/security context ID' = 'qa-thread-003'
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = 'founder-decision-123'
        }) `
        -ExpectedExitCode 0 -ExpectedText 'Operation=Merge'

    Assert-Gate -Name 'merge-does-not-require-deploy-readiness' `
        -Content (New-StrictRecord) `
        -ExpectedExitCode 0 -ExpectedText 'Operation=Merge'

    Assert-Gate -Name 'merge-accepts-blocked-founder-deploy-state' `
        -Content (New-StrictRecord -Overrides @{'Deploy decision' = 'BLOCKED_FOUNDER'}) `
        -ExpectedExitCode 0 -ExpectedText 'Operation=Merge'

    Assert-Gate -Name 'deploy-without-founder-approval-rejected' `
        -Content (New-StrictRecord -Overrides @{'Deploy decision' = 'READY'}) `
        -Operation Deploy -ExpectedExitCode 1 `
        -ExpectedText 'deploy requires FOUNDER_APPROVED live-risk decision'

    Assert-Gate -Name 'deploy-with-founder-approval-passes' `
        -Content (New-StrictRecord -Overrides @{
            'Live-risk decision' = 'FOUNDER_APPROVED'
            'Founder evidence' = 'github-pr-comment-123'
            'Deploy decision' = 'READY'
        }) `
        -Operation Deploy -ExpectedExitCode 0 -ExpectedText 'Operation=Deploy'

    Assert-Gate -Name 'legacy-rejected-by-default' `
        -Content (New-LegacyRecord) `
        -ExpectedExitCode 1 -ExpectedText 'missing field: Author context ID'

    Assert-Gate -Name 'legacy-explicitly-accepted' `
        -Content (New-LegacyRecord) -LegacyRecord `
        -ExpectedExitCode 0 -ExpectedText 'LegacyRecord=True'

    Assert-Gate -Name 'legacy-mode-cannot-bypass-new-policy' `
        -Content (New-LegacyRecord -ChangeId '2026-08-15-bypass') -LegacyRecord `
        -ExpectedExitCode 1 `
        -ExpectedText 'legacy compatibility is limited to records before 2026-08-15'

    Assert-Gate -Name 'duplicate-field-rejected' `
        -Content ((New-StrictRecord) + "`n- Reviewer decision: APPROVED") `
        -ExpectedExitCode 1 -ExpectedText 'duplicate field: Reviewer decision'

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
    if ($resolvedTestRoot.StartsWith($recordsRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase) -and
        (Split-Path -Leaf $resolvedTestRoot).StartsWith('.gate-tests-')) {
        Remove-Item -LiteralPath $resolvedTestRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
