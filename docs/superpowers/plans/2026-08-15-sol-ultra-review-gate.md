# SOL Ultra Independent Review Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unavailable mandatory Claude reviewer with an isolated SOL Ultra Codex reviewer while preserving reviewer independence and all merge/live-risk controls.

**Architecture:** Review records identify both role and execution context. A PowerShell gate validates separation, evidence, checks, and risk decisions; repository instructions and coordination templates describe the same workflow. Historical records remain readable but are archival and cannot authorize integration.

**Tech Stack:** Markdown policy files, PowerShell 5.1-compatible validator and fixture tests, Git worktrees, GitHub draft pull requests.

---

### Task 1: Record the founder-approved policy

**Files:**
- Modify: `AI-REVIEW-GATE.md`
- Create: `ai-review/TEMPLATE.md`
- Create: `ai-review/coordination/PROTOCOL.md`

- [ ] **Step 1: Replace vendor-pair wording with role/context independence**

Document `CODEX_AUTHOR`, `SOL_ULTRA_REVIEWER`, context IDs, bounded evidence,
and the prohibition on same-context approval.

- [ ] **Step 2: Preserve merge and live-risk boundaries**

State explicitly that `APPROVED` only permits merge consideration and that
deploy, production, public publication, payments, blockchain signing, secrets,
and external accounts remain `BLOCKED_FOUNDER`.

- [ ] **Step 3: Verify policy consistency**

```powershell
rg -n "SOL_ULTRA_REVIEWER|Author context ID|Reviewer context ID|BLOCKED_FOUNDER" AI-REVIEW-GATE.md ai-review/TEMPLATE.md ai-review/coordination/PROTOCOL.md
```

Expected: every concept appears in the authoritative policy and supporting
templates without contradictory Claude-only requirements.

### Task 2: Synchronize agent instructions

**Files:**
- Modify: `AGENTS.md`
- Modify: `.claude/CLAUDE.md`
- Modify: `GEMINI.md`

- [ ] **Step 1: Update Rule 7 identically in all three files**

Use the same text for independent role/context review and the SOL Ultra default.

- [ ] **Step 2: Prove byte-for-byte synchronization**

```powershell
$a = (Get-FileHash AGENTS.md -Algorithm SHA256).Hash
$c = (Get-FileHash .claude/CLAUDE.md -Algorithm SHA256).Hash
$g = (Get-FileHash GEMINI.md -Algorithm SHA256).Hash
if (($a -ne $c) -or ($a -ne $g)) { throw 'Instruction files diverged' }
```

Expected: command exits successfully and all hashes match.

### Task 3: Harden the executable review gate

**Files:**
- Modify: `execution/ai-review-gate.ps1`
- Create: `execution/tests/ai-review-gate.tests.ps1`

- [ ] **Step 1: Add failing fixtures for identity and context separation**

Create temporary review records and assert expected PASS/FAIL output for valid
SOL Ultra review, same role, same context, pending checks, and uncleared risk.

- [ ] **Step 2: Run fixtures and confirm baseline failure**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File execution/tests/ai-review-gate.tests.ps1
```

Expected before implementation: one or more fixture failures because the old
gate only permits `CODEX`/`CLAUDE` and currently misreads repository records.

- [ ] **Step 3: Implement strict new-record validation**

Add `Author context ID`, `Reviewer context ID`, explicit reviewer roles, robust
UTF-8/CRLF field parsing, and fail-closed `-LegacyRecord` handling. Default behavior
must reject missing or placeholder context IDs.

- [ ] **Step 4: Run fixtures until all pass**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File execution/tests/ai-review-gate.tests.ps1
```

Expected: `AI_REVIEW_GATE_TESTS=PASS` with every positive and negative fixture
accounted for.

### Task 4: Migrate the Phase 0 provenance review packet

**Files:**
- Modify on `codex/phase0-provenance`: `ai-review/records/2026-08-15-phase0-provenance.md`
- Replace on `codex/phase0-provenance`: `ai-review/coordination/inbox/claude/2026-08-15-phase0-provenance-review.md`
- Create on `codex/phase0-provenance`: `ai-review/coordination/inbox/codex-review/2026-08-15-phase0-provenance-review.md`

- [ ] **Step 1: Record the author context and new reviewer assignment**

Keep the decision `PENDING`; do not pre-approve the Codex-authored work.

- [ ] **Step 2: Dispatch a fresh isolated SOL Ultra reviewer**

Provide only requirements, base/head SHAs, diff scope, evidence paths, commands,
and risk boundaries. Do not provide the author's reasoning transcript.

- [ ] **Step 3: Apply reviewer findings**

The author fixes all P0/P1 findings. A different isolated reviewer context
performs the final pass and alone records `APPROVED`.

### Task 5: Verify and publish without integration

**Files:**
- Update the appropriate review records only if independent review completes.

- [ ] **Step 1: Run repository checks**

```powershell
git diff --check
powershell -NoProfile -ExecutionPolicy Bypass -File execution/tests/ai-review-gate.tests.ps1
```

Expected: both commands pass.

- [ ] **Step 2: Commit explicit files and push the task branch**

```powershell
git add AI-REVIEW-GATE.md AGENTS.md .claude/CLAUDE.md GEMINI.md ai-review/TEMPLATE.md ai-review/coordination/PROTOCOL.md execution/ai-review-gate.ps1 execution/tests/ai-review-gate.tests.ps1 docs/superpowers/specs/2026-08-15-sol-ultra-review-gate-design.md docs/superpowers/plans/2026-08-15-sol-ultra-review-gate.md
git commit -m "build: add independent SOL Ultra review gate"
git push -u origin codex/sol-ultra-review-gate
```

Expected: only the listed policy, validator, test, spec, and plan files are in
the commit.

- [ ] **Step 3: Open a draft pull request**

The PR must state that it changes governance tooling only, requires independent
review, and does not authorize merge or deploy.
