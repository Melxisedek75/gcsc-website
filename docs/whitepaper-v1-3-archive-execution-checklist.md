# GCSC Whitepaper v1.3 Archive Execution Checklist

Status: internal execution checklist. Do not execute until publication gate is GO.

This checklist does not approve file replacement, public publication, website deployment, PDF release, external announcement, legal claims, provider commitments, live payments, loans, escrow, stablecoin settlement, token collateral, FIO actions, or XPR signatures.

## Purpose

Prepare the exact future archive steps so old public whitepaper files are preserved instead of deleted.

## Required Before Running

- `docs/whitepaper-v1-3-publication-gate.md` says GO;
- founder approves archiving v1.0 public whitepaper;
- founder approves replacing public whitepaper with v1.3;
- `npm run check:whitepaper-v1-3-plan` passes;
- `npm run check:whitepaper-v1-3-public-html-plan` passes;
- rollback owner is recorded;
- current branch is clean except intended files.

## Future Commands

Do not run until GO:

```powershell
Copy-Item -LiteralPath whitepaper.html -Destination whitepaper-v1-0-archive.html
Copy-Item -LiteralPath whitepaper-v1-3-draft.html -Destination whitepaper.html
npm run check:whitepaper-v1-3-plan
npm run check:whitepaper-v1-3-public-html-plan
git status --short
```

## Future Files To Commit

- `whitepaper-v1-0-archive.html`
- `whitepaper.html`
- any validator updates required by publication GO
- publication evidence file if created

## Rollback Commands

If publication creates an issue:

```powershell
Copy-Item -LiteralPath whitepaper-v1-0-archive.html -Destination whitepaper.html
npm run check:whitepaper-v1-3-public-html-plan
git status --short
```

## Blocked Now

This checklist remains blocked while publication gate is NO-GO.
