# Whitepaper v1.2 Full Audit And Kimi Execution Plan

Date: 2026-05-15 PT

Status: internal local-only execution plan for Kimi, Claude, and Codex.

Purpose: turn the current GCSC / SmartContractor v1.2 whitepaper file set into a fast parallel work package. Kimi can execute high-volume drafting, inventory, table filling, and static review work. Claude should independently audit the result. Codex owns repo integration, validators, final checks, scoped commits, and safety gates.

This plan does not approve public publication, website edits, PDF release, investor outreach, grant submission, legal advice, provider commitments, live Supabase changes, deployment, external account changes, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Current Whitepaper Source Map

Kimi must treat these files as the current internal source set:

| Group | File | Role | Kimi Action |
| --- | --- | --- | --- |
| Core architecture | `docs/gcsc-v1-2-core-architecture-package.md` | Founder-approved internal source of truth | Read only; cite as source |
| Restructure | `docs/whitepaper-v1-2-restructure-draft.md` | Proposed v1.2 section structure | Read only; use as outline source |
| Source map | `docs/whitepaper-v1-2-source-map.md` | Maps claims to sources | Read only; expand only in proposed draft/report |
| Public wording | `docs/whitepaper-v1-2-public-wording-package.md` | Safe public wording rules | Read only; enforce wording |
| Section preview | `docs/whitepaper-v1-2-section-replacement-preview.md` | Replacement section examples | Read only; reuse only safe language |
| Claim review | `docs/whitepaper-v1-2-claim-review-matrix.md` | Claim safety matrix | Read only; update findings in review report |
| Terms | `docs/whitepaper-v1-2-terms-glossary.md` | Allowed/blocked terms | Read only; use for phrase checks |
| Public excerpt guard | `docs/whitepaper-v1-2-public-excerpt-guard.md` | Public excerpt boundaries | Read only; enforce guard |
| Public edit queue | `docs/whitepaper-v1-2-public-edit-queue.md` | Future public edit staging | Read only; do not edit public files |
| Website packet | `docs/whitepaper-v1-2-public-website-update-packet.md` | Website/deck/email/social mapping | Read only; no website edits |
| Publish gate | `docs/whitepaper-v1-2-publish-gate.md` | Publication blockers | Read only; keep blockers visible |
| Go/no-go | `docs/whitepaper-v1-2-publication-go-no-go-checklist.md` | Publication decision checklist | Read only; no GO decision |
| Smart contract architecture | `docs/whitepaper-v1-2-smart-contract-architecture-draft.md` | Module architecture draft | Read only; summarize cautiously |
| Module split | `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md` | Authority/audit/anti-backdoor review | Read only; enforce no-backdoor claims |
| Contract-backed loan | `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md` | Technical requirements and live gates | Read only; no live lending claim |
| Legal/provider prep | `docs/whitepaper-v1-2-legal-provider-review-prep.md` | External review prep | Read only; route legal/provider questions |
| Stream A work order | `docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md` | Existing Kimi whitepaper work order | Treat as primary Kimi assignment |

## Current Audit Verdict

The whitepaper v1.2 package is strong as an internal source set, but it is not yet a single polished public whitepaper file.

Current strengths:

- The architecture is no longer just a token story; it ties SmartContractor product flows, contractor credit, escrow readiness, audit events, smart contract modules, beta readiness, and legal/provider gates together.
- Public-claim safety is already heavily documented through claim review, public excerpt guard, publish gate, go/no-go, legal/provider prep, and contract-backed loan approval gates.
- The Kimi Stream A work order already defines the intended public draft files, validator, section order, safety language, and acceptance checks.
- The current package preserves the main stop boundaries: no live lending, no live escrow, no real repayment routing, no stablecoin settlement, no token collateral, no public launch, no legal/provider commitments.

Current gaps before public use:

- `docs/whitepaper-v1-2-public-draft.md` does not yet exist as the single v1.2 public draft.
- `docs/whitepaper-v1-2-public-draft-review-report.md` does not yet exist as the public-draft audit report.
- `construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs` does not yet exist as the deterministic draft validator.
- The public draft still needs one clean narrative voice instead of many internal checklist fragments.
- The final public draft must reduce repeated disclaimers while preserving exact stop boundaries.
- Market-size, token, lending, escrow, AI, smart-contract, and compliance claims need one last claim-risk pass by Claude before Codex integration.
- Founder, legal/provider, finance-provider, technical/security, and publication go/no-go approvals remain required before any public release.

## Files Kimi Should Create

Kimi Stream A may create only these files unless Codex explicitly expands the scope:

| File | Required | Purpose |
| --- | --- | --- |
| `docs/whitepaper-v1-2-public-draft.md` | yes | Full internal public-facing whitepaper v1.2 draft |
| `docs/whitepaper-v1-2-public-draft-review-report.md` | yes | Source coverage, claim-risk review, commands, and remaining blockers |
| `construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs` | yes | Deterministic local validator for draft structure and forbidden claim scans |

Kimi may propose edits to these shared files, but must not directly own the final edit:

- `construction-ai/package.json`
- `construction-ai/scripts/run-checks.mjs`
- `docs/gcsc-active-context.md`
- `docs/smartcontractor-backlog.md`
- `docs/gcsc-real-status-audit-2026-05-11.md`

Codex owns shared-file integration after Claude marks the stream `PASS_LOCAL_ONLY`.

## Required Public Draft Section Order

`docs/whitepaper-v1-2-public-draft.md` should use this order:

1. Publication Status And Review Boundary
2. Executive Summary
3. Construction Trust Problem
4. SmartContractor Product Layer
5. Verified Contractor And Homeowner Workflow
6. Contract-Backed Working Capital Roadmap
7. Escrow-Ready Milestone Architecture
8. Smart Contract Module Architecture
9. AI Agent Roles And Human Review Boundaries
10. GCSC / GCST / XPR Utility Roadmap
11. Security, Audit Trail, And Anti-Backdoor Controls
12. Public Beta And Deployment Readiness
13. Legal, Provider, And Finance Review Gates
14. Roadmap
15. Source And Review Appendix

Required exact publication boundary:

```text
This draft is not approved for public publication.
```

Required exact live-risk boundary:

```text
Real loans, escrow, repayment routing, stablecoin settlement, token collateral, provider integrations, and public launch require founder approval plus legal/provider, finance-provider, technical/security, and publication go/no-go review before activation.
```

## Kimi Worker Split For Whitepaper

Use this split if Kimi can assign multiple workers inside Stream A:

| Worker Set | Agents | Task | Output |
| --- | ---:| --- | --- |
| A1 Source Inventory | 4 | Verify every source file exists and summarize its role | Source inventory table in review report |
| A2 Outline Builder | 3 | Convert restructure/source map into final section order | Draft outline with source references |
| A3 Executive Summary | 3 | Draft concise product narrative | Sections 1-2 |
| A4 Problem / Market | 3 | Draft construction trust problem without unsupported overclaims | Section 3 |
| A5 Product Workflow | 5 | Draft SmartContractor owner/contractor/admin flow | Sections 4-5 |
| A6 Loan / Escrow Roadmap | 5 | Draft contract-backed loan and escrow-ready sections with blocked-live gates | Sections 6-7 |
| A7 Smart Contract Architecture | 4 | Draft module split, audit trail, anti-backdoor controls | Sections 8 and 11 |
| A8 AI Boundary | 3 | Draft AI agent roles with human review boundaries | Section 9 |
| A9 Token Utility | 3 | Draft GCSC/GCST/XPR utility roadmap without price/yield promises | Section 10 |
| A10 Beta / Deployment | 3 | Draft public beta and deployment readiness without launch claims | Section 12 |
| A11 Legal / Provider Gates | 3 | Draft review gates and blocked-live actions | Section 13 |
| A12 Roadmap | 3 | Draft conservative roadmap | Section 14 |
| A13 Appendix | 3 | Build source/review appendix | Section 15 |
| A14 Claim Safety | 5 | Scan for lending, escrow, token, AI, compliance, security overclaims | Review report claim table |
| A15 Readability | 3 | Remove checklist tone and repeated disclaimers while preserving gates | Draft polish notes |
| A16 Validator | 5 | Create `validate-whitepaper-v1-2-public-draft.mjs` | Validator script |
| A17 Commands | 2 | Run available checks and record output | Commands section in review report |
| A18 Final Packager | 3 | Assemble draft + review report | Final Kimi package |

Total suggested Stream A allocation: 60 workers. Remaining Kimi capacity should stay with Streams F/N/J/H/I/O/M/K/L/Q/S from the existing master plan.

## Kimi Definition Of Done

Kimi Stream A is complete only when:

- `docs/whitepaper-v1-2-public-draft.md` exists.
- `docs/whitepaper-v1-2-public-draft-review-report.md` exists.
- `construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs` exists.
- The draft uses the required section order.
- The draft contains both required exact boundary sentences.
- The draft avoids live lending, live escrow, live repayment routing, stablecoin settlement, token collateral, AI final approval, legal/compliance approval, guaranteed returns, guaranteed liquidity, token price, and provider-readiness claims.
- The review report lists files read, files created/modified, commands run, claim-risk findings, and remaining external approvals.
- The validator fails on missing headings and obvious forbidden phrases.
- All output is local-only and marked not approved for public publication.

## Claude Audit Assignment

Claude should review Kimi Stream A output after Kimi returns it.

Claude must check:

- Whether the public draft reads like a coherent whitepaper instead of an internal checklist.
- Whether every major claim maps back to the source files.
- Whether public wording overstates live readiness.
- Whether token language avoids price, yield, liquidity, securities, or guaranteed-return claims.
- Whether loan and escrow language remains roadmap/readiness language, not operational lending/escrow language.
- Whether AI is positioned as assistive/recommendation/review support, not final legal, financial, or approval authority.
- Whether smart contract anti-backdoor claims match the module split review.
- Whether the validator is deterministic and useful.
- Whether any file should be `REWORK`, `BLOCKED_EXTERNAL_REVIEW`, or `FAIL_UNSAFE`.

Allowed Claude verdicts:

- `PASS_LOCAL_ONLY`
- `REWORK`
- `BLOCKED_EXTERNAL_REVIEW`
- `FAIL_UNSAFE`

## Codex Integration Assignment

Codex should integrate only after Claude marks the whitepaper stream `PASS_LOCAL_ONLY`.

Codex tasks:

1. Inspect Kimi-created files.
2. Run `node construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs` or `npm run check:whitepaper-v1-2-public-draft` if already wired.
3. Wire `check:whitepaper-v1-2-public-draft` into `construction-ai/package.json` only after reviewing the validator.
4. Add the validator to `construction-ai/scripts/run-checks.mjs`.
5. Update `docs/gcsc-active-context.md`, `docs/smartcontractor-backlog.md`, and `docs/gcsc-real-status-audit-2026-05-11.md`.
6. Run targeted whitepaper checks:

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft
npm run check:whitepaper-v1-2-public-wording-package
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-public-excerpt-guard
npm run check:whitepaper-v1-2-publish-gate
npm run check:whitepaper-v1-2-publication-go-no-go
```

7. Run full `npm run check` before committing if shared files or package scripts change.
8. Commit only scoped files.

## Hard Stop Boundaries

Stop and route to founder/legal/provider review if any output:

- requests or includes secrets, private keys, service-role keys, raw credentials, seed phrases, Magic Link URLs, wallet material, or private customer data;
- edits `whitepaper.html`, public website files, PDF, deck, social post, email, investor packet, grant packet, or announcement copy;
- claims real loans are approved, funded, originated, underwritten, or available;
- claims live escrow, fund custody, repayment routing, stablecoin settlement, or token collateral is active;
- promises GCSC/GCST price, yield, liquidity, collateral value, appreciation, buybacks, guaranteed income, or legal status;
- says AI makes final legal, financial, lending, insurance, compliance, or escrow decisions;
- says legal/provider/security review is complete when no recorded approval exists;
- requires live Supabase changes, deployment, external accounts, public launch, provider setup, XPR signatures, or app-store actions.

## Recommended First Kimi Prompt Add-On

Append this to the Stream A Kimi prompt:

```text
Before drafting, read docs/whitepaper-v1-2-full-audit-kimi-execution-plan-2026-05-15.md. Treat it as the Stream A execution control document. Create only the three allowed files unless Codex later expands scope. Keep all output internal, local-only, and not approved for public publication.
```

## Acceptance Checks For This Plan

This plan is valid when:

- it names the current whitepaper source files;
- it identifies existing gaps;
- it gives Kimi exact files to create;
- it splits worker tasks clearly enough for parallel execution;
- it gives Claude an independent audit checklist;
- it gives Codex integration steps and commands;
- it keeps all public, live, legal, money, provider, deployment, external account, XPR signature, and secret boundaries blocked.
