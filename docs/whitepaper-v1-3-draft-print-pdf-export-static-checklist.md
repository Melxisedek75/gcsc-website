# GCSC Whitepaper v1.3 Draft Print PDF Export Static Checklist

Status: internal draft print/PDF export static checklist. Print and PDF export evidence remains PENDING_PRINT_PDF_EXPORT_REVIEW. Current publication decision remains NO-GO.

This checklist does not approve public publication, public website replacement, PDF publishing, deck/social/email distribution, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This checklist controls the future print/PDF export review path for the v1.3 local whitepaper draft. It does not generate, export, publish, distribute, or approve a PDF.

## Files In Scope

| File | Scope | Current State |
|---|---|---|
| `whitepaper-v1-3-draft.html` | local whitepaper draft source | export candidate source only |
| `whitepaper-v1-3-draft.css` | local draft stylesheet | print/export CSS review pending |
| `index-v1-3-draft.html` | local homepage draft | not a PDF source unless separately approved |
| `whitepaper.html` | legacy public whitepaper | scan only; do not replace |
| `index.html` | legacy public homepage | scan only; do not replace |

## Static Print And Export Checks

| Check | Current State | Notes |
|---|---|---|
| v1.3 whitepaper draft source exists | PASS_STATIC | source exists for local review only |
| local stylesheet source exists | PASS_STATIC | stylesheet exists for local review only |
| internal draft/no-publication banner exists | PASS_STATIC | public publication is still blocked |
| PDF export command executed | PENDING_PRINT_PDF_EXPORT_REVIEW | no export command is recorded here |
| print preview reviewed | PENDING_PRINT_PREVIEW_REVIEW | no browser print preview evidence is recorded |
| page breaks, headings, and tables reviewed | PENDING_LAYOUT_REVIEW | no layout evidence is recorded |
| PDF metadata, filename, version, and source commit reviewed | PENDING_EXPORT_METADATA_REVIEW | no exported file is recorded |
| private data, hidden content, and redaction reviewed | PENDING_REDACTION_REVIEW | no redaction evidence is recorded |
| public distribution approval recorded | HOLD_NO_PUBLIC_USE | public use remains NO-GO |

## Allowed Future States

- PENDING_PRINT_PDF_EXPORT_REVIEW;
- PENDING_PRINT_PREVIEW_REVIEW;
- PENDING_LAYOUT_REVIEW;
- PENDING_EXPORT_METADATA_REVIEW;
- PENDING_REDACTION_REVIEW;
- ISSUE_FOUND;
- READY_LOCAL_EXPORT_CANDIDATE;
- HOLD_NO_PUBLIC_USE.

## Future Export Evidence Template

| Field | Value |
|---|---|
| source file | TO_FILL |
| source commit | TO_FILL |
| export tool and version | TO_FILL |
| local output path | TO_FILL |
| file hash | TO_FILL |
| file size | TO_FILL |
| print preview reviewed by | TO_FILL |
| layout issues found | TO_FILL |
| redaction/privacy review result | TO_FILL |
| public distribution decision | TO_FILL_NO_GO_BY_DEFAULT |

## Required Source Documents

- `docs/whitepaper-v1-3-final-publication-checklist.md`;
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`;
- `docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md`;
- `docs/whitepaper-v1-3-internal-review-master-index.md`;
- `docs/whitepaper-v1-3-visual-qa-evidence-template.md`;
- `docs/whitepaper-v1-3-screenshot-evidence-results-template.md`;
- `docs/whitepaper-v1-3-browser-qa-evidence-flow.md`;
- `docs/whitepaper-v1-3-publication-gate.md`.

## No Shortcut Rules

- A checklist is not an exported PDF.
- Print preview is not publication.
- A local PDF export hash is not distribution approval.
- A clean local export does not prove legal/provider review.
- A PDF file does not replace `whitepaper.html`.
- A PDF file does not authorize `index.html` changes.
- A PDF file does not authorize provider outreach, announcements, real finance, or Web3 actions.

## Stop Boundary

Stop before running any public publication path, replacing public files, sending or uploading a PDF, distributing announcement materials, contacting reviewers or providers, making legal conclusions, touching live systems, moving money, approving loans, holding escrow, settling stablecoins, locking token collateral, registering FIO names, or signing XPR actions.
