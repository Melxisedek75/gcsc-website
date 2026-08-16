# Phase 0 backend provenance and canonical decision

- Change ID: `2026-08-15-phase0-provenance`
- Repository: `gcsc-website`
- Worktree: `C:\gcsc\.tmp\codex\phase0-provenance`
- Branch: `codex/phase0-provenance`
- Base commit: `99f2838a5d80bf1c3c1b368c50bcb4a28ef41521`
- Reviewed documentation commit: `393135a4236b0b4abed634325b3424da92c0cdce`
- Author AI: CODEX
- Requested reviewer AI: CLAUDE
- Author status: READY_FOR_REVIEW
- Reviewer decision: PENDING
- Live-risk decision: BLOCKED
- Merge decision: BLOCKED
- Deploy decision: BLOCKED

## Scope

Read-only cross-repository provenance baseline and proposed canonical backend
decision. No product source, deployment configuration, public file, external
account, secret, database, payment, or blockchain state was changed.

## Changed files

- `docs/architecture/2026-08-system-inventory.md`
- `docs/architecture/2026-08-component-provenance.csv`
- `docs/architecture/2026-08-api-provenance-matrix.md`
- `docs/architecture/2026-08-canonical-backend-decision.md`

## Author verification

| Command | Result |
| --- | --- |
| `git diff --check` | PASS |
| PowerShell `Import-Csv` field/count validation | PASS, 6 rows |
| `npm run check:no-live-actions` from `construction-ai` | PASS; 1 package file, 3 workflows, 596 source files scanned |
| Independent Codex spec review | APPROVED after P1/P2 corrections |
| Independent Codex quality review | APPROVED after P2 corrections |

## Reviewer instructions

1. Inspect commit `393135a4236b0b4abed634325b3424da92c0cdce` independently.
2. Verify route claims against `C:\Users\rivne\gcsc-v3\v3\pure-server.js`,
   `C:\gcsc-store\src\services\api.ts`,
   `C:\gcsc\mobile\smartcontractor\lib`, and
   `C:\gcsc\construction-ai\server.js`.
3. Rerun `git diff --check`, CSV validation, and
   `npm run check:no-live-actions`.
4. Record `APPROVED` only if no unresolved P0/P1 findings remain.

## Known limitations

- Static route-family evidence is not end-to-end API compatibility.
- All source repositories were inspected as point-in-time local state; three
  contained pre-existing dirty changes.
- PostgreSQL, external endpoints, testnet transactions, mobile runtime, and
  production systems were not exercised.
- This packet proposes architecture ownership only; it does not approve
  archive, merge, deployment, money movement, or public claims.
