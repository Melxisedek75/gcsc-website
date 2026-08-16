# Canonical Backend Decision

Status: `PROPOSED_FOR_INDEPENDENT_REVIEW`
Date: 2026-08-15
Decision owner: CODEX

## Decision

Use `C:\Users\rivne\gcsc-v3\v3\pure-server.js` as the canonical
SmartContractor marketplace backend candidate.

Classify `C:\gcsc\construction-ai\server.js` as a separate local
construction-AI, admin-readiness, evidence, and demo service. It is not a
drop-in marketplace backend and must not become a second owner of auth,
projects, bids, escrow, or payment settlement.

The decision becomes final only after independent review verifies the exact
route matrix and confirms that no active deployment or consumer targets a
different backend.

## Evidence

1. The Smart Contractor repository root Docker, Railway, and Render configs
   launch `v3/pure-server.js`.
2. `gcsc-store/src/services/api.ts` defaults to the Smart Contractor Railway
   API and has partial static route-family compatibility with
   `v3/pure-server.js`; unsupported calls remain listed in the API matrix.
3. `mobile/smartcontractor/lib` has partial static compatibility with the auth,
   project, and payment route families and explicitly labels several
   unfinished domains as local data.
4. `construction-ai/server.js` exposes a different `/api/smartcontractor/*`
   resource model plus a large local admin/readiness surface.

## Required follow-up

1. Add a deterministic route-contract comparison test for `gcsc-store` and
   `v3/pure-server.js`.
2. Resolve or remove the five currently observed unsupported web client calls.
3. Align `v3/package.json`, nested Docker/Render files, README, and security
   documentation with deployment truth.
4. Preserve stale implementations in a reviewed archive before deletion is
   considered.
5. Run the canonical Jest suite and safe PostgreSQL tests in an isolated test
   database; do not use production credentials.

## Prohibited consequences

This decision does not authorize merge, deployment, production database
changes, public website replacement, payment activation, real escrow, XPR/FIO
signatures, token custody, provider commitments, or mobile release.

Review-only mode applies to this packet: no product-file edits, credential
loading, secret handling, external account access, or live-system inspection.
