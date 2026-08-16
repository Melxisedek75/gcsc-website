# GCSC System Inventory

Status: `LOCAL_BASELINE`
Date: 2026-08-15

## Evidence boundary

This inventory is limited to `C:\gcsc`, the project root and source of truth.
It records only tracked source that can be inspected from this repository. It
does not inspect, approve, or infer state from other local folders, remote
repositories, external accounts, deployments, databases, wallets, or chains.

The observed starting revision for this Safe MVP work is
`99f2838a5d80bf1c3c1b368c50bcb4a28ef41521`. The root worktree was dirty at
that baseline; no dirty content is attributed, approved, reset, cleaned,
stashed, moved, or deleted by this inventory.

## Provenance states

| State | Meaning |
| --- | --- |
| `LOCAL_SOURCE_VERIFIED` | A named relative path exists in the tracked `C:\gcsc` source tree. |
| `LOCAL_ARTIFACT_ONLY` | A local artifact is present but does not establish source ownership. |
| `EXTERNAL_SOURCE_NOT_PRESENT` | The claimed component has no tracked path in this repository. |
| `EXTERNAL_STATE_UNVERIFIED` | A possible external system is known only by reference, not inspected here. |
| `ARCHIVE_OR_REFERENCE` | Material retained for context only, without implementation ownership. |

The machine-readable component list is
`docs/architecture/2026-08-component-provenance.csv`. Run
`npm --prefix construction-ai run check:system-inventory` to ensure that a
local-source claim still has a matching tracked root path.

## Local component boundary

The inventory verifies local component presence only. It does not establish
API compatibility, contract deployment, payment readiness, custody, testnet
state, production readiness, or public-launch approval.

Components marked `EXTERNAL_SOURCE_NOT_PRESENT` require a separately reviewed
source import or evidence packet before any implementation, integration, or
architecture claim can rely on them.

## Safety constraints

- No secrets, external accounts, live Supabase, payments, loans, escrow,
  stablecoin settlement, collateral, XPR/FIO signing, deployment, or public
  publication is part of this inventory.
- The validator reads tracked repository state and local documentation only.
- This document is evidence for local planning, not permission to merge,
  deploy, archive, delete, or operate a live system.
