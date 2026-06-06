# GCSC Kimi 2.6 100-Bot Delegation Master Prompt

Date: 2026-06-06 PT

Status: founder-requested delegation report and Kimi 2.6 launch prompt.

This document does not approve public website replacement, public whitepaper publication, live Supabase writes, admin activation, strict RLS apply, deployment setting changes, public beta launch, tester invites, legal conclusions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO signatures, app-store actions, secrets handling, production release, or destructive actions.

## 1. Current Project Report

### What Has Been Completed Locally

1. SmartContractor has a large set of local-only product, Admin, readiness, evidence, and request-id surfaces.
2. Whitepaper v1.3 has been reframed as traditional-first Construction Trust Infrastructure, with Web3/token/loan/escrow language moved behind review gates or future regulated-architecture wording.
3. Public `index.html` and `whitepaper.html` are intentionally unchanged.
4. A local homepage candidate exists through v1.3 draft/static-draft work, but it is not authorized for public replacement.
5. Week 2 local gate surfaces are prepared for Auth/Admin, deployment/public beta, legal/provider review, smart contract modules, contract-backed loan architecture, investor/founder package, mobile readiness, validation, closeout, and founder action board.
6. SmartContractor product workflows now include demo-only/local preview and review surfaces for job fit, bid readiness, milestone acceptance, repayment allocation/readiness, payment intent warnings, loan request warnings, dispute evidence, milestone evidence, smart contract helper index, local replay dry-run, and smart contract review workbench.
7. Recent commits include `8365acea Record week two live boundary handoff` and `3f820795 Add safe continuation work queue`.
8. Backlog evidence shows the project has many DONE local surfaces and a smaller number of REVIEW/BLOCKED/LATER items waiting on founder/live/external/legal/provider decisions.

### Objective Situation

The project is not production-finished. It is highly prepared locally, but real completion is blocked by live-risk gates, not by more micro-documents.

The six-month estimate only makes sense if one agent continues sequentially across product, contracts, QA, compliance, public launch prep, mobile prep, legal/provider routing, and evidence cleanup. With a controlled 100-bot Kimi 2.6 wave, 80 percent of routine audit, documentation, QA matrix, fixture, validator, review, and handoff work can be parallelized. The timeline can be compressed, but only if Kimi is used as a report-and-plan factory, not as an uncontrolled committer or live operator.

### Main Risks Right Now

1. Repetitive validator/document loops can create noise without advancing launch.
2. Public Web3/token/loan/escrow claims can hurt the project if published before founder/legal/provider review.
3. Kimi bots can damage the project if they edit public files, touch secrets, rewrite architecture, or create contradictory outputs.
4. Parallel work can become unusable unless every worker uses the same output package and the controller returns a merge order.
5. Live actions remain founder-only: Magic Link evidence, verified Auth user selection, live admin activation, deploy/public URL actions, legal/provider send decisions, mobile device/store actions, real finance, and XPR/FIO actions.

## 2. What To Delegate To Kimi 2.6

Kimi should handle routine local-only work that is expensive in time but safe when constrained:

| Stream | Worker Count | Safe Output |
| --- | ---: | --- |
| A. Whitepaper v1.3 and public claim safety | 10 | Claim-risk findings, safe wording options, publication NO-GO checks |
| B. Founder/legal/provider packets | 8 | Reading orders, redaction checklists, reviewer question deltas |
| C. Product UX/Admin surfaces | 12 | Screen-by-screen QA notes, copy clarity reports, missing state matrices |
| D. Backend/API request-id and error boundaries | 12 | Endpoint maps, validation gaps, request-id/error checklist reports |
| E. Auth/RLS/Supabase local-only review | 8 | Policy/readiness reviews, no-live SQL gap maps, evidence checklists |
| F. Contract-backed loan/compliance architecture | 10 | Eligibility, repayment waterfall, adverse-action, provider-boundary reports |
| G. Smart contracts local architecture/replay | 12 | Invariant maps, replay fixture gaps, authority/audit/anti-backdoor reports |
| H. QA, validators, fixtures, and CI | 12 | Test matrix, fixture proposals, validator coverage gap reports |
| I. Mobile/browser/public beta QA prep | 8 | Device/browser QA runbooks, beta consent/support/known-issue reports |
| J. Repo hygiene and documentation indexes | 8 | Duplicate-doc maps, stale-file index, integration queue, risk-free cleanup proposals |

Total: 100 worker bots.

Kimi must not directly perform final integration. Kimi returns worker reports. Codex/founder reviews and integrates only safe, scoped changes.

## 3. Copy-Paste Prompt For Kimi 2.6

```text
You are Kimi 2.6 acting as the controller for a 100-bot GCSC/SmartContractor delegation wave.

Your job is to accelerate routine local-only project work without damaging the repository. You are not authorized to deploy, publish, touch secrets, perform live account actions, make legal decisions, contact providers, move money, approve loans, release escrow, route repayments, settle stablecoins, lock token collateral, sign XPR/FIO actions, change public website files, or make production changes.

MANDATORY FIRST STEP - DO NOT DISPATCH WORKERS YET

Before starting any worker task, read and study these files in this order:

1. AGENTS.md
2. docs/gcsc-active-context.md
3. docs/codex-nonstop-execution-hook.md
4. docs/gcsc-daily-work-mode-hook.md
5. docs/smartcontractor-backlog.md
6. docs/smartcontractor-safe-continuation-work-queue-2026-06-06.md
7. docs/smartcontractor-two-week-plan-2026-05-30.md
8. docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md
9. docs/whitepaper-v1-3-public-draft.md
10. docs/whitepaper-v1-3-public-outline.md
11. docs/whitepaper-v1-3-traditional-first-web3-ready-appendix.md
12. docs/whitepaper-v1-3-claim-risk-register.md
13. docs/whitepaper-v1-3-smartcontractor-product-integration-map.md
14. docs/whitepaper-v1-3-publication-gate.md
15. docs/whitepaper-v1-3-week-one-closeout-2026-06-06.md
16. docs/whitepaper-v1-3-autonomous-continuation-rule.md
17. docs/autonomous-status/2026-06-05-2225-week-two-live-boundary-handoff.md
18. docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md

After reading those files, STOP. Return only an UNDERSTANDING REPORT. Do not dispatch workers, do not create files, do not edit files, and do not propose live actions.

Your UNDERSTANDING REPORT must contain:

1. Mission summary: explain in your own words what GCSC/SmartContractor is now, using the updated whitepaper direction.
2. Current state: list what is local-ready, what is review-only, and what is blocked.
3. Non-negotiable boundaries: list every no-touch area you will enforce.
4. Proposed 100-bot allocation: use the 10 streams A-J below and confirm the worker count totals exactly 100.
5. Expected output package: show the exact worker report format each bot will return.
6. Integration safety model: explain how you will prevent conflicting edits and unsafe recommendations.
7. Questions or contradictions: list anything unclear or risky.
8. Final controller verdict: must be WAITING_FOR_CODEX_APPROVAL.

Do not continue until Codex replies with:
APPROVED_TO_DISPATCH_KIMI_WAVE_TWO_LOCAL_ONLY

If Codex replies with corrections, update your controller plan and return a revised UNDERSTANDING REPORT. Only after explicit approval may you dispatch the workers.

WORKER ALLOCATION AFTER APPROVAL

Use exactly these streams and counts:

A. Whitepaper v1.3 and public claim safety - 10 workers
B. Founder/legal/provider packets - 8 workers
C. Product UX/Admin surfaces - 12 workers
D. Backend/API request-id and error boundaries - 12 workers
E. Auth/RLS/Supabase local-only review - 8 workers
F. Contract-backed loan/compliance architecture - 10 workers
G. Smart contracts local architecture/replay - 12 workers
H. QA, validators, fixtures, and CI - 12 workers
I. Mobile/browser/public beta QA prep - 8 workers
J. Repo hygiene and documentation indexes - 8 workers

Total worker bots: 100.

GLOBAL SAFETY RULES FOR EVERY WORKER

Allowed:
- read local project files provided in the handoff;
- produce local-only reports, checklists, QA matrices, fixture proposals, validator gap reports, safe wording options, implementation plans, and integration recommendations;
- propose file changes only as review recommendations with exact paths and rationale;
- mark blockers clearly.

Forbidden:
- editing public index.html or whitepaper.html;
- replacing PDFs, decks, public HTML, public URLs, email/social/public announcement content;
- requesting or recording secrets, Magic Link URLs, Auth tokens, session cookies, service-role keys, database passwords, private keys, seed phrases, raw env values, wallet material, payment data, private device IDs, recipient contact data, raw attorney/provider responses, or private customer data;
- touching live Supabase, applying SQL, inserting admin memberships, applying strict RLS, changing deploy settings, changing DNS/Namecheap/Vercel/GitHub Pages, sending tester invites, sharing public URLs, publishing, launching beta, contacting providers, making legal conclusions, making provider/lender commitments, approving loans, moving payments, releasing escrow, routing repayments, settling stablecoins, locking token collateral, signing XPR/FIO transactions, app-store actions, production releases, or destructive filesystem/git actions.

Each worker must return this exact report format:

WORKER_ID:
STREAM:
TASK_TITLE:
FILES_READ:
FILES_NOT_FOUND:
SUMMARY:
FINDINGS_BY_SEVERITY:
- Critical:
- High:
- Medium:
- Low:
SAFE_OUTPUT:
PROPOSED_CODEX_ACTION:
FILES_TO_CREATE_OR_MODIFY_PROPOSED_ONLY:
COMMANDS_RECOMMENDED:
VALIDATION_EXPECTED:
BOUNDARIES_CHECKED:
NO_TOUCH_CONFIRMATION:
BLOCKERS:
FINAL_VERDICT:

Allowed FINAL_VERDICT values:
- PASS_LOCAL_ONLY
- PARTIAL_REWORK_REQUIRED
- BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW
- FAIL_UNSAFE

CONTROLLER OUTPUT AFTER WORKERS FINISH

Return:

1. Controller executive summary.
2. Stream-by-stream status table.
3. Missing or failed worker reports.
4. Unsafe recommendations rejected.
5. Top 25 highest-value safe tasks for Codex integration.
6. Exact recommended merge/integration order.
7. Files proposed by workers, grouped by risk.
8. Validator/test commands recommended.
9. Founder-only blockers.
10. Final verdict: PASS_LOCAL_ONLY, PARTIAL_REWORK_REQUIRED, BLOCKED_EXTERNAL_REVIEW, or FAIL_UNSAFE.

IMPORTANT:
The goal is not to make 100 bots generate noise. The goal is to compress 80 percent of routine audit, QA, documentation, fixture, validator, and review work into structured reports that Codex can safely integrate. If a worker cannot add useful signal, it must say NO_NEW_SAFE_FINDING and stop.
```

## 4. Codex Review Gate For Kimi's First Report

Codex should approve Kimi only if the first UNDERSTANDING REPORT proves that Kimi:

1. understood the updated v1.3 traditional-first whitepaper direction;
2. preserved public Web3/token/loan/escrow boundaries;
3. did not claim authority to publish, deploy, approve legal status, or run live finance;
4. kept public `index.html` and `whitepaper.html` no-touch;
5. allocated exactly 100 workers into the 10 safe streams;
6. requires all workers to return structured reports, not uncontrolled edits;
7. returns `WAITING_FOR_CODEX_APPROVAL` before dispatch.

Approval phrase:

```text
APPROVED_TO_DISPATCH_KIMI_WAVE_TWO_LOCAL_ONLY
```

Correction phrase:

```text
NOT_APPROVED_REVISE_UNDERSTANDING_REPORT
```

## 5. Recommended Founder/Codex Position

Do not use Kimi 2.6 as an autonomous committer. Use it as a parallel analysis and report engine.

Codex remains the integrator. Founder remains the authority for live systems, legal/provider decisions, public launch, money, XPR/FIO, mobile store actions, and production.

This is the fastest safe path: 100 bots do the slow routine reading and QA; Codex filters and integrates; founder approves only true live-risk gates.
