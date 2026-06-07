# GCSC Kimi 2.6 100-Worker Dispatch Board

Date: 2026-06-06 PT

Status: local-only dispatch board for Kimi 2.6 after Codex approval of the first `UNDERSTANDING REPORT`.

This board does not approve Kimi worker dispatch by itself. It also does not approve public website replacement, public whitepaper publication, live Supabase writes, admin activation, strict RLS apply, deployment setting changes, public beta launch, tester invites, legal conclusions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO signatures, app-store actions, secrets handling, production release, or destructive actions.

## Activation Gate

Kimi may use this board only after all three conditions are true:

1. Kimi returned the first `UNDERSTANDING REPORT`.
2. Codex reviewed it with `docs/gcsc-kimi-2-6-understanding-report-review-checklist-2026-06-06.md`.
3. Codex sent the exact phrase:

```text
APPROVED_TO_DISPATCH_KIMI_WAVE_TWO_LOCAL_ONLY
```

If this phrase has not been sent, Kimi must stop and return only a revised `UNDERSTANDING REPORT`.

## Controller Sequence

1. Confirm the activation gate above.
2. Re-state that all workers are report-only.
3. Dispatch Wave 1: streams A, B, F, G, H.
4. Wait for all Wave 1 reports or mark missing workers.
5. Dispatch Wave 2: streams C, D, E.
6. Wait for all Wave 2 reports or mark missing workers.
7. Dispatch Wave 3: streams I, J.
8. Return one controller summary, one report per worker, unsafe recommendation list, and exact Codex integration order.

## Global Worker Rules

Every worker must read:

- `AGENTS.md`
- `docs/gcsc-active-context.md`
- `docs/gcsc-kimi-2-6-100-bot-delegation-master-prompt-2026-06-06.md`
- `docs/gcsc-kimi-2-6-understanding-report-review-checklist-2026-06-06.md`
- the stream-specific files listed in the worker assignment

Every worker must return one structured report using the worker report schema in the master prompt. Workers must not edit files. If a worker cannot add useful signal, it must write `NO_NEW_SAFE_FINDING` and stop.

## Wave 1: Highest-Risk Architecture And Claim Review

| Worker | Stream | Assignment | Required Reads | Safe Output |
| --- | --- | --- | --- | --- |
| A01 | Whitepaper/public claims | Map v1.3 traditional-first positioning and list contradictions | `docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md`, `docs/whitepaper-v1-3-public-draft.md` | contradiction report |
| A02 | Whitepaper/public claims | Scan public draft for loan, escrow, token, stablecoin, yield, and approval claims | `docs/whitepaper-v1-3-public-draft.md`, `docs/whitepaper-v1-3-claim-risk-register.md` | risky-claim table |
| A03 | Whitepaper/public claims | Review homepage/static-draft wording for future-infrastructure overclaims | `index-v1-3-static-draft.html`, `docs/whitepaper-v1-3-homepage-wording-plan.md` | safe wording deltas |
| A04 | Whitepaper/public claims | Verify public outline avoids live finance/token promises | `docs/whitepaper-v1-3-public-outline.md`, `docs/whitepaper-v1-3-publication-gate.md` | outline safety report |
| A05 | Whitepaper/public claims | Review traditional-first Web3 appendix for public/private boundary clarity | `docs/whitepaper-v1-3-traditional-first-web3-ready-appendix.md` | boundary findings |
| A06 | Whitepaper/public claims | Check source-link and evidence appendix coverage for public statements | `docs/whitepaper-v1-3-source-link-appendix.md`, `docs/whitepaper-v1-3-reviewer-evidence-appendix.md` | source gap list |
| A07 | Whitepaper/public claims | Review reviewer routing and response templates for publication risk | `docs/whitepaper-v1-3-reviewer-routing-index.md`, `docs/whitepaper-v1-3-reviewer-response-intake-template.md` | reviewer-risk report |
| A08 | Whitepaper/public claims | Create founder-readable summary of publication blockers | `docs/whitepaper-v1-3-publication-blocker-status-matrix.md`, `docs/whitepaper-v1-3-founder-action-board.md` | blocker summary |
| A09 | Whitepaper/public claims | Validate no public `index.html` / `whitepaper.html` action is implied | `docs/whitepaper-v1-3-public-html-replacement-plan.md`, `docs/whitepaper-v1-3-public-website-update-plan.md` | no-public-action audit |
| A10 | Whitepaper/public claims | Stream A controller synthesis | A01-A09 reports | top 10 safe Codex actions |
| B01 | Legal/provider prep | Working-capital provider question delta | `docs/whitepaper-v1-3-legal-provider-review-packet.md`, `docs/whitepaper-v1-3-provider-question-register.md` | question delta |
| B02 | Legal/provider prep | Escrow/payment provider question delta | same as B01 | question delta |
| B03 | Legal/provider prep | ClaimBridge/advance review question delta | same as B01 | question delta |
| B04 | Legal/provider prep | Token-collateral and custody no-go question delta | `docs/whitepaper-v1-3-regulated-web3-architecture-map.md`, `docs/whitepaper-v1-3-claim-risk-register.md` | blocked-action map |
| B05 | Legal/provider prep | Public wording/legal review routing | `docs/whitepaper-v1-3-public-wording-scan-current-status.md`, `docs/whitepaper-v1-3-public-wording-scan-evidence-log.md` | routing note |
| B06 | Legal/provider prep | Redaction checklist review | `docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md`, `docs/whitepaper-v1-3-provider-handoff-packet-map.md` | redaction gaps |
| B07 | Legal/provider prep | Provider response intake readiness | `docs/whitepaper-v1-3-provider-response-intake-template.md`, `docs/whitepaper-v1-3-provider-response-routing-checklist.md` | intake gaps |
| B08 | Legal/provider prep | Stream B controller synthesis | B01-B07 reports | legal/provider merge order |
| F01 | Contract-backed loan | Signed-contract eligibility requirements | `docs/gcsc-contract-backed-loan-blueprint.md`, `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md` | eligibility gaps |
| F02 | Contract-backed loan | Contractor identity/EIN/license/compliance factors | same as F01 | factor map |
| F03 | Contract-backed loan | Repayment waterfall no-money implementation review | `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-calculation-pseudocode.md` | acceptance criteria |
| F04 | Contract-backed loan | Milestone-payment allocation preview review | `docs/whitepaper-v1-2-contract-backed-loan-repayment-waterfall-local-api-contract.md` | fixture gaps |
| F05 | Contract-backed loan | Adverse-action risk controls | `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing.md` | risk control map |
| F06 | Contract-backed loan | Provider boundary review | `docs/whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md` | provider boundary gaps |
| F07 | Contract-backed loan | Public claim review for credit/loan language | `docs/whitepaper-v1-2-contract-backed-loan-public-use-gate.md` | public-claim findings |
| F08 | Contract-backed loan | Fixture matrix completeness | `docs/whitepaper-v1-2-contract-backed-loan-fixture-matrix.md` | missing fixtures |
| F09 | Contract-backed loan | SmartContractor loan workspace UX/API alignment | `docs/smartcontractor-api.md`, `docs/smartcontractor-backend-to-chain-map.md` | product alignment report |
| F10 | Contract-backed loan | Stream F controller synthesis | F01-F09 reports | top 10 loan tasks |
| G01 | Smart contracts | Authority/admin invariant review | `contracts/gcsc-core/README.md`, `contracts/gcsc-core/gcsctreasry1.contract.ts` | invariant report |
| G02 | Smart contracts | Escrow/milestone contract invariant review | `contracts/gcsc-core/gcscrow1111.contract.ts`, `contracts/gcsc-core/gcscclaim111.contract.ts` | invariant report |
| G03 | Smart contracts | Credit/loan ledger invariant review | `contracts/gcsc-core/gcsccredit11.contract.ts`, `contracts/gcsc-core/gcscworkcap1.contract.ts` | invariant report |
| G04 | Smart contracts | Advance/repayment helper review | `contracts/gcsc-core/gcscadvance1.contract.ts` | helper gaps |
| G05 | Smart contracts | Token/stablecoin custody no-go review | `contracts/gcsc-core/gcsctoken111.contract.ts`, `contracts/gcsc-core/gcscstable11.contract.ts` | custody risk report |
| G06 | Smart contracts | Staking/member/reputation authority review | `contracts/gcsc-core/gcscstake111.contract.ts`, `contracts/gcsc-core/gcscmember11.contract.ts` | authority gaps |
| G07 | Smart contracts | Insurance/realty/treasury claim boundary review | `contracts/gcsc-core/gcscinsure11.contract.ts`, `contracts/gcsc-core/gcscrealty11.contract.ts` | boundary findings |
| G08 | Smart contracts | Meme/build/bounty/ticket local-only review | `contracts/gcsc-meme/README.md`, `contracts/gcsc-meme/*.contract.ts` | local build gaps |
| G09 | Smart contracts | Local replay fixture gap map | `contracts/gcsc-core/test/*.test.ts` | fixture gap list |
| G10 | Smart contracts | Anti-backdoor checklist | `docs/whitepaper-v1-3-regulated-web3-architecture-map.md` | anti-backdoor report |
| G11 | Smart contracts | Deployment blocker inventory | `contracts/gcsc-core/DEPLOYMENT-READINESS.md` | blocker map |
| G12 | Smart contracts | Stream G controller synthesis | G01-G11 reports | smart-contract merge order |
| H01 | QA/validators/CI | Package script inventory and stale validator scan | `package.json`, `construction-ai/package.json` | validator gap report |
| H02 | QA/validators/CI | SmartContractor frontend validator coverage | `construction-ai/scripts/*smartcontractor*.mjs` | coverage gaps |
| H03 | QA/validators/CI | Auth/admin validator coverage | `construction-ai/scripts/*auth*.mjs` | coverage gaps |
| H04 | QA/validators/CI | Whitepaper v1.3 validator coverage | `construction-ai/scripts/*whitepaper-v1-3*.mjs` | coverage gaps |
| H05 | QA/validators/CI | Contract-backed loan validator coverage | `construction-ai/scripts/*contract-backed-loan*.mjs` | coverage gaps |
| H06 | QA/validators/CI | Kimi handoff validator coverage | `construction-ai/scripts/*kimi*.mjs`, `docs/gcsc-kimi-*.md` | coverage gaps |
| H07 | QA/validators/CI | Public-file guard commands review | package scripts and docs | guard report |
| H08 | QA/validators/CI | CI workflow and local command ordering | `.github/workflows/*`, `docs/*validation*` | command order |
| H09 | QA/validators/CI | Demo-only warning coverage | `construction-ai/public/smartcontractor.html` | warning gap list |
| H10 | QA/validators/CI | Request-id/error-boundary test gaps | `construction-ai/server.js`, validators | test gaps |
| H11 | QA/validators/CI | Fixture hygiene and generated `.vert` dirs | `contracts/gcsc-core/test` | fixture hygiene report |
| H12 | QA/validators/CI | Stream H controller synthesis | H01-H11 reports | QA merge order |

## Wave 2: Product, Backend, Auth

| Worker | Stream | Assignment | Required Reads | Safe Output |
| --- | --- | --- | --- | --- |
| C01 | Product UX/Admin | Admin beta readiness navigation clarity | `construction-ai/public/smartcontractor.html` | UI issue list |
| C02 | Product UX/Admin | Founder action center usability | same as C01 | UI issue list |
| C03 | Product UX/Admin | Request Trace and evidence export UX | same as C01 | UX gaps |
| C04 | Product UX/Admin | Homeowner request and milestone flows | same as C01 | workflow gaps |
| C05 | Product UX/Admin | Contractor/open bids and bid readiness flows | same as C01 | workflow gaps |
| C06 | Product UX/Admin | Loan workspace demo-only clarity | same as C01 | copy/state gaps |
| C07 | Product UX/Admin | Payment Router and repayment preview clarity | same as C01 | copy/state gaps |
| C08 | Product UX/Admin | Dispute Center and evidence review clarity | same as C01 | workflow gaps |
| C09 | Product UX/Admin | Smart contract helper/replay/workbench UI | same as C01 | UI gaps |
| C10 | Product UX/Admin | Mobile viewport readability pass | same as C01 | responsive report |
| C11 | Product UX/Admin | Accessibility/static text density pass | same as C01 | accessibility gaps |
| C12 | Product UX/Admin | Stream C controller synthesis | C01-C11 reports | product merge order |
| D01 | Backend/API | Request ID behavior route map | `construction-ai/server.js` | route map |
| D02 | Backend/API | Validation error response consistency | `construction-ai/server.js` | error gaps |
| D03 | Backend/API | Admin endpoint read-only boundary map | `construction-ai/server.js` | boundary map |
| D04 | Backend/API | SmartContractor endpoint demo-only boundary map | `construction-ai/server.js` | boundary map |
| D05 | Backend/API | Evidence export source allowlist review | `construction-ai/server.js` | source gaps |
| D06 | Backend/API | Local history metadata-only review | `construction-ai/public/smartcontractor.html`, `construction-ai/server.js` | history gaps |
| D07 | Backend/API | Auth/session/profile guard review | `construction-ai/server.js`, `docs/smartcontractor-auth-*.md` | auth gaps |
| D08 | Backend/API | Payment/loan/dispute endpoint live-risk guard review | `construction-ai/server.js` | live-risk gaps |
| D09 | Backend/API | OpenAPI/API docs drift review | `docs/smartcontractor-api.md` | docs drift |
| D10 | Backend/API | Error status/header evidence review | validators and server | test gaps |
| D11 | Backend/API | Rate-limit/security header review | `construction-ai/server.js` | security gaps |
| D12 | Backend/API | Stream D controller synthesis | D01-D11 reports | backend merge order |
| E01 | Auth/RLS/Supabase | Magic Link evidence intake boundary | `docs/smartcontractor-auth-smoke-tests.md` | intake gaps |
| E02 | Auth/RLS/Supabase | Founder profile binding review | `docs/smartcontractor-auth-decision-package.md` | binding gaps |
| E03 | Auth/RLS/Supabase | Admin membership activation gate review | `docs/smartcontractor-admin-role-model.md` | gate gaps |
| E04 | Auth/RLS/Supabase | Strict RLS draft no-live review | `docs/smartcontractor-auth-rls-plan.md` | RLS gaps |
| E05 | Auth/RLS/Supabase | Payment intent ownership SQL draft review | `docs/smartcontractor-admin-role-model-draft.sql` | SQL review |
| E06 | Auth/RLS/Supabase | Auth smoke test report-back fields | auth docs and validators | field gaps |
| E07 | Auth/RLS/Supabase | Live Supabase stop-boundary audit | active context and auth docs | boundary report |
| E08 | Auth/RLS/Supabase | Stream E controller synthesis | E01-E07 reports | Auth/RLS merge order |

## Wave 3: Founder/Launch Prep And Repo Hygiene

| Worker | Stream | Assignment | Required Reads | Safe Output |
| --- | --- | --- | --- | --- |
| I01 | Mobile/beta/deploy/investor | Deployment decision prep review | `docs/smartcontractor-week-two-deployment-public-beta-recheck-2026-06-06.md` | decision gaps |
| I02 | Mobile/beta/deploy/investor | Public beta scope and consent review | `docs/smartcontractor-week-two-public-beta-scope-recheck-2026-06-06.md` | beta gaps |
| I03 | Mobile/beta/deploy/investor | Mobile PWA/Android/iOS blocker review | `docs/smartcontractor-week-two-mobile-release-recheck-2026-06-06.md` | mobile blockers |
| I04 | Mobile/beta/deploy/investor | Investor/founder package claim review | `docs/smartcontractor-week-two-investor-founder-package-recheck-2026-06-06.md` | claim gaps |
| I05 | Mobile/beta/deploy/investor | Founder action board reading order | `docs/whitepaper-v1-3-founder-action-board.md`, `docs/gcsc-active-context.md` | reading order |
| I06 | Mobile/beta/deploy/investor | Public URL smoke/report-back boundary | deploy/beta docs | report-back gaps |
| I07 | Mobile/beta/deploy/investor | Support/known-issues beta readiness | beta docs | readiness gaps |
| I08 | Mobile/beta/deploy/investor | Stream I controller synthesis | I01-I07 reports | launch-prep merge order |
| J01 | Repo hygiene/docs index | Duplicate Kimi handoff docs map | `docs/gcsc-kimi-*.md` | duplicate map |
| J02 | Repo hygiene/docs index | Whitepaper v1.2/v1.3 stale-doc map | `docs/whitepaper-v1-2-*.md`, `docs/whitepaper-v1-3-*.md` | stale-doc map |
| J03 | Repo hygiene/docs index | Backlog DONE/REVIEW/BLOCKED consistency scan | `docs/smartcontractor-backlog.md` | consistency gaps |
| J04 | Repo hygiene/docs index | Active context compression candidate map | `docs/gcsc-active-context.md` | compression map |
| J05 | Repo hygiene/docs index | Untracked local artifact risk map | `git status --short --branch` output provided by controller | risk map |
| J06 | Repo hygiene/docs index | Package/script documentation drift map | `package.json`, `construction-ai/package.json`, docs references | drift map |
| J07 | Repo hygiene/docs index | Generated artifact and `.tmp` policy review | docs and gitignore | policy gaps |
| J08 | Repo hygiene/docs index | Stream J controller synthesis | J01-J07 reports | repo hygiene merge order |

## Controller Final Summary Requirements

After all workers finish, Kimi must return:

1. One controller executive summary.
2. Stream status table A-J.
3. Worker count: expected 100, received N, missing IDs.
4. Unsafe recommendations rejected.
5. Top 25 safe local-only Codex integration candidates.
6. Exact integration order by risk and value.
7. Founder-only blockers.
8. No-touch confirmation for public files, secrets, live systems, legal/provider, money, XPR/FIO, mobile store, production, and destructive actions.
9. Final verdict: `PASS_LOCAL_ONLY`, `PARTIAL_REWORK_REQUIRED`, `BLOCKED_EXTERNAL_REVIEW`, or `FAIL_UNSAFE`.

## Codex Intake After Kimi Returns

Codex should process Kimi output in this order:

1. Reject unsafe or malformed reports.
2. Run the first-report intake and worker-output intake checks.
3. Group reports by stream.
4. Integrate only one small scoped local change at a time.
5. Run targeted checks.
6. Confirm public `index.html` and `whitepaper.html` are unchanged.
7. Commit scoped accepted files.
8. Keep founder/live/external/legal/money blockers explicit.
