# GCSC / SmartContractor Project Map

Status: `ROOT_ONLY_LOCAL_SOURCE`
Updated: 2026-08-16

This map covers only `C:\gcsc`, the source of truth for this repository. It
does not assert source ownership, runtime state, deployment configuration, or
compatibility for any path outside this tracked root.

## Local source tree

| Area | Path | Local scope |
| --- | --- | --- |
| Agent instructions | `AGENTS.md`, `.claude/CLAUDE.md`, `GEMINI.md` | Shared operating rules. |
| Review gate | `AI-REVIEW-GATE.md`, `execution/ai-review-gate.ps1` | Local review evidence and merge checks. |
| Review records | `ai-review/records/`, `ai-review/coordination/` | Task evidence and independent-review handoff. |
| Validation/demo service | `construction-ai/` | Local validators, tests, Admin/demo surfaces. |
| Mobile application | `mobile/smartcontractor/` | React Native local source. |
| Contract sources | `contracts/gcsc-core/`, `contracts/gcsc-meme/`, `gcsctoken111/` | Local contract source only; no deployment claim. |
| Documentation | `docs/`, `VALIDATORS.md` | Local plans, boundaries, and check registry. |

## Provenance check

`docs/architecture/2026-08-system-inventory.md` and
`docs/architecture/2026-08-component-provenance.csv` are the current
machine-checked inventory. Run:

```powershell
npm --prefix construction-ai run check:system-inventory
```

The validator permits `LOCAL_SOURCE_VERIFIED` only for tracked root-relative
paths. A missing path must be `EXTERNAL_SOURCE_NOT_PRESENT` until source is
separately imported and independently reviewed.

## Local checks

```powershell
npm --prefix construction-ai run check:system-inventory
npm --prefix construction-ai run check:no-live-actions
npx --prefix mobile/smartcontractor tsc --noEmit
```

These commands establish local evidence only. They do not approve deployment,
live Supabase, payments, loans, escrow, stablecoin settlement, collateral,
XPR/FIO signing, public publication, or a mobile release.

## External-reference boundary

Anything outside `C:\gcsc` is `EXTERNAL_SOURCE_NOT_PRESENT` for this map. A
future integration may use it only after source is available in this repository
or a separately reviewed evidence packet establishes its provenance. This map
does not direct an agent to inspect external folders.
