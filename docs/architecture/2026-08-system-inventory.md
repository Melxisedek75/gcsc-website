# GCSC System Inventory

Status: `BASELINE_DRAFT`
Date: 2026-08-15
Owner: CODEX

This inventory records repository provenance before any integration or runtime
changes. It is evidence, not a deployment approval.

## Observed repositories

Observation time: `2026-08-16T00:32:24Z`. `LOCAL_SOURCE_VERIFIED`
means that the path, repository HEAD, remote, and named inspected files were
observed locally. It does not approve or attribute dirty working-tree content.

| Component | Local path | Inspected scope | Observed revision | Working tree | Remote | Provenance |
| --- | --- | --- | --- | --- | --- | --- |
| Website/contracts workspace | `C:\gcsc` | repository identity and component paths | `99f2838a5d80bf1c3c1b368c50bcb4a28ef41521` | dirty | `Melxisedek75/gcsc-website` | `LOCAL_SOURCE_VERIFIED` |
| Smart Contractor backend | `C:\Users\rivne\gcsc-v3` | `v3/pure-server.js` and root deploy configs | `64077d549798911e1b16954b61d0239fa6e4b71f` | dirty | `Melxisedek75/gcsc-smart-contractor` | `LOCAL_SOURCE_VERIFIED` |
| Store frontend | `C:\gcsc-store` | `src/services/api.ts` | `2f023068cb7b5a08a481f7fb0a503d3a5f0f6248` | dirty | `Melxisedek75/gcsc-store` | `LOCAL_SOURCE_VERIFIED` |
| Website source | `C:\gcsc-website` | repository identity only | `b7b767c3d0cccec9b5024b34a1bd9323faebe508` | no changes reported by `git status` at observation time | `Melxisedek75/gcsc-website` | `LOCAL_SOURCE_VERIFIED` |

## Backend canonicality evidence

The inspected root `Dockerfile`, `railway.json`, and root `render.yaml` in the
Smart Contractor repository point to `v3/pure-server.js`.

This is a strong candidate for canonical backend status, but the final
decision remains `PENDING_INDEPENDENT_REVIEW` until deploy history, frontend
API usage, and test ownership are reconciled.

The following are not yet accepted as production truth:

- `v3/server.js` and its Express route/middleware tree;
- root legacy `server.js` and `smart-contractor-backend.js`;
- stale `v3/Dockerfile` and `v3/render.yaml`;
- README and marketing claims that describe a custodial wallet model.

## Safety constraints

- No reset, clean, stash, delete, merge, push, or deployment was performed.
- Review-only mode applies: do not load credentials, inspect secret values,
  modify external accounts, or make product-code changes from this packet.
- No secrets, external account settings, live databases, payment providers,
  XPR/FIO signatures, or production systems were accessed.
- Dirty working trees are preserved and must be reviewed before any merge.
- This document does not authorize archive or deletion of any implementation.

## Next decision

The architecture reviewer role (assigned to the most capable available model)
must reconcile the backend candidates and produce a canonical decision with
exact file scope. The implementation role is blocked until that decision
exists. The independent validation role may continue with local route and test
inventory only. Model names are execution choices and do not replace these
role boundaries.
