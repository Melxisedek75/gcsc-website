# GCSC Whitepaper v1.3 Archive Rollback Evidence Template

Status: internal archive and rollback evidence template. No archive copy or rollback execution is recorded here.

This template does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This template defines the evidence rows needed later to prove that legacy public files were archived and rollback was reviewed before any v1.3 public replacement. It is a preparation record only.

## Run Record Template

| Field | Value |
|---|---|
| evidence run id | PENDING_RUN_ID |
| run date | PENDING_DATE |
| operator | PENDING_FOUNDER_OR_APPROVED_OPERATOR |
| source commit | PENDING_COMMIT |
| publication gate state | NO-GO by default |
| public files touched in this template | NO |
| archive commands executed | NO |
| rollback commands executed | NO |
| private data reviewed | PENDING |
| final state | PENDING_ARCHIVE_AND_ROLLBACK_EVIDENCE |

## Archive Evidence Rows Template

| Evidence ID | Source File | Future Archive Target | Required Hash Before Copy | Required Hash After Copy | Current State | Notes |
|---|---|---|---|---|---|---|
| V13-ARCHIVE-WP-01 | `whitepaper.html` | `whitepaper-v1-0-archive.html` | PENDING_HASH | PENDING_HASH | PENDING_ARCHIVE_COPY | do not execute until publication GO |
| V13-ARCHIVE-HOME-01 | `index.html` | future homepage archive target if homepage replacement is approved | PENDING_HASH | PENDING_HASH | PENDING_ARCHIVE_COPY | do not execute until separate homepage replacement GO |
| V13-ARCHIVE-PDF-01 | `whitepaper-v1.1.pdf` | future PDF archive target if PDF publishing is approved | PENDING_HASH | PENDING_HASH | PENDING_ARCHIVE_COPY | do not execute until separate PDF publishing GO |

## Rollback Evidence Rows Template

| Evidence ID | Restore Source | Restore Target | Required Review | Current State | Notes |
|---|---|---|---|---|---|
| V13-ROLLBACK-WP-01 | `whitepaper-v1-0-archive.html` | `whitepaper.html` | restore command and validator review | PENDING_ROLLBACK_REVIEW | no command executed |
| V13-ROLLBACK-HOME-01 | future homepage archive target | `index.html` | restore command and validator review | PENDING_ROLLBACK_REVIEW | no command executed |
| V13-ROLLBACK-PDF-01 | future PDF archive target | public PDF target | restore or re-link review | PENDING_ROLLBACK_REVIEW | no command executed |

## Allowed Evidence States

- PENDING_ARCHIVE_COPY;
- PENDING_HASH;
- PENDING_ROLLBACK_REVIEW;
- PASS_REVIEWED_LATER;
- FAIL_REVIEWED_LATER.

## Required Before Any PASS

- publication gate is GO in a separate dated record;
- founder publication decision is recorded;
- public file replacement scope is recorded separately;
- archive source and target hashes are recorded;
- rollback owner is recorded;
- `npm run check:whitepaper-v1-3-public-html-plan` passes after the future operation;
- `git diff -- whitepaper.html index.html` is reviewed after the future operation.

## Stop Boundary

This template cannot be used to create archives, replace public files, publish PDFs, run rollback commands, claim evidence completion, contact providers, make legal conclusions, touch live Supabase, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, or sign XPR actions.
