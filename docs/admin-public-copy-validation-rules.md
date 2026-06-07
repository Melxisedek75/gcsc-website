# Admin Public Copy Validation Rules

Date: 2026-06-06 PT

Status: ADMIN_PUBLIC_COPY_RULES_LOCAL_ONLY

Purpose: document the existing SmartContractor Admin public-copy validation boundary so Codex, Kimi, and founder review can use one source of truth before any public beta, homepage, deck, packet, invite, or partner copy is considered.

This document does not approve public website replacement, public whitepaper publication, deployment, public beta launch, tester invites, external sends, provider claims, legal conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR/FIO signatures, production release, or live actions.

## Existing Surfaces

| Surface | Current Role |
| --- | --- |
| `POST /api/admin/beta-readiness/public-copy/validate` | Validates one local public-copy draft and returns safe/blocking metadata. |
| `traditional_first_public_copy_gate` in `/api/admin/beta-readiness` | Shows baseline public-copy rules and review states. |
| `construction-ai/public/smartcontractor.html` | Admin UI input, validation result, browser-local metadata history, and Request Trace reuse. |
| `/api/admin/admin-evidence-export-preview?source_filter=traditional_first_public_copy_validation_history` | Metadata-only export preview for validation history. |
| `npm --prefix construction-ai run check:smartcontractor` | Static guard for endpoint, Admin UI, history, export source, and request trace wiring. |
| `npm --prefix construction-ai run check:auth` | Runtime smoke for safe and unsafe public-copy validation paths. |

## Required Safe Public Copy Fields

A local public-copy draft should include all four ideas:

| Required Field | Meaning |
| --- | --- |
| construction trust platform positioning | SmartContractor is described as contractor matching, project records, milestone evidence, dispute readiness, or admin review. |
| demo-only or local review scope | The text makes clear this is demo-only, local review, workflow review, controlled demo, or no-real-money review. |
| no live finance or real-money boundary | The text says there are no real-money actions, live finance, real loans, payment movement, or escrow release. |
| founder review before publish | The text says founder review, review required, not production, before publish, or before public use. |

If these fields are missing, the draft stays `public_copy_required_fields_missing` and should not move toward public publication.

## Blocked Public Findings

The Admin public-copy validator must block and return `public_copy_blocked_for_redaction` when copy contains:

- secrets, tokens, API keys, private keys, seed phrases, service-role references, bearer/JWT strings, database URLs, or Supabase URLs;
- card numbers, bank details, SSNs, or other payment/identity data;
- blockchain, smart contract, token, XPR, FIO, stablecoin, Metallicus, Metal Blockchain, Web3, DeFi, DAO, LOAN integration, LOAN-style, or Proton Loan wording as public product claims;
- approve loan, loan approved, licensed lending, approved escrow, escrow provider approved, provider partnership, legal approved, compliance approved, payment live, real-money pilot approved, public beta approved, production launch, production release, go live, settle stablecoin, lock token collateral, or move money wording.

## Allowed Public Direction

Use this public direction only as local draft guidance:

```text
SmartContractor is a construction trust platform for contractor matching, project records, milestone evidence, dispute readiness, and admin review.
This is a demo-only local workflow review with no real-money pilot, no live finance, no payment movement, and no escrow release.
Founder review is required before publish and before public use.
```

## Status Rules

| Validator Status | Meaning | Public Action |
| --- | --- | --- |
| `safe_traditional_first_public_copy` | Local draft has no blocked findings and includes required safe fields. | Still blocked; not publication approval. |
| `public_copy_required_fields_missing` | No blocked findings, but required safe fields are incomplete. | Rewrite before founder review. |
| `public_copy_blocked_for_redaction` | Blocked wording or sensitive data was detected. | Remove/redact and rerun. |
| `public_copy_missing` | No copy was provided. | Add local draft text only. |

No status from this validator may approve `index.html`, `whitepaper.html`, PDF/deck/email/social publication, public URL sharing, tester invites, provider outreach, public beta launch, production release, or live finance.

## Storage And Evidence Boundaries

- Raw public-copy drafts are not stored by the server.
- Browser history may store only metadata: request ID, status, counts, issue IDs, safe summaries, and no-live/no-storage flags.
- Admin Evidence Export Preview may expose only metadata allowlisted for `traditional_first_public_copy_validation_history`.
- Raw draft text, issue excerpts beyond safe excerpts, secrets, payment data, identity data, provider/legal decisions, public beta approvals, production approvals, external sends, and live-action approvals remain blocked.

## Required Stop Boundaries

The public-copy flow must always stop before:

- public website edit;
- public `index.html` or `whitepaper.html` replacement;
- external send;
- external provider claim;
- public beta flip;
- payment charge;
- loan approval;
- escrow release;
- signed contract creation;
- XPR signature;
- FIO registration;
- stablecoin settlement;
- token collateral lock;
- provider commitment;
- legal decision;
- production release.

## Required Checks

Run these before relying on an Admin public-copy validation result:

```powershell
npm --prefix construction-ai run check:smartcontractor
npm --prefix construction-ai run check:auth
git diff --name-only -- index.html whitepaper.html
git diff --cached --name-only -- index.html whitepaper.html
```

`index.html` and `whitepaper.html` must stay unchanged unless a separate founder-approved `PUBLICATION_GO` record explicitly names the file and action.

## Kimi/Codex Interpretation Rule

If Kimi or Codex reports "public copy passed", translate it as:

```text
The local Admin public-copy validator returned a local-only status for review metadata. It did not approve publication, public file replacement, external send, public beta launch, legal/provider claims, real finance, Web3/token actions, production, or live actions.
```
