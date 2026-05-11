# GCSC Active Context

Date: 2026-05-04

Purpose: this file is the short source-of-truth briefing for Codex when the chat becomes long, context is compressed, or a new session starts.

## Codex Nonstop Execution Hook

Codex must follow `docs/codex-nonstop-execution-hook.md`.

After every completed safe task, Codex must immediately select the next safe task from `docs/smartcontractor-backlog.md`, implement it, test it, update docs, commit, and push. Codex should stop only for secrets, external account changes, live Supabase changes without explicit approval, real payments/loans/escrow/token collateral, legal decisions, or founder-only business decisions.

There are two automation layers:

- heartbeat `gcsc-nonstop-next-task-hook`: wakes this chat every 1 minute when the Codex app/thread can receive heartbeats, then Codex must keep looping through safe tasks inside the same active run when feasible;
- cron `gcsc-hourly-autonomous-builder`: standalone hourly local workspace worker for overnight safe scoped tasks. This is a backup layer, not the primary "continue after each task" mechanism.

## Red Line

GCSC is not a generic crypto website. It is a real-world construction finance and trust platform built around SmartContractor, XPR Network smart contracts, AI agents, contractor credit, milestone payments, disputes, peer review, and DAO/token economics.

Every feature must support this core mission:

- help homeowners find and pay verified contractors safely;
- help contractors win jobs, prove seriousness, and access responsible working capital;
- replace risky upfront homeowner deposits with milestone-based progress, credit, verification, and audit trails;
- connect real construction workflows to XPR Network, GCSC token utility, GCST internal payments, and future smart contracts;
- keep legal, financial, identity, escrow, lending, and token-collateral actions reviewable before public launch.

## Product Model

SmartContractor is the main product experience.

Core user roles:

- homeowner;
- contractor;
- peer reviewer or inspector;
- admin/founder;
- future worker, lender, DAO member, and AI agent roles.

Core workflow:

1. Homeowner posts a construction job.
2. Contractor registers, verifies identity/business/license/insurance, and submits a bid.
3. Accepted bid becomes a project contract.
4. Project contract breaks work into milestones.
5. Contractor may request a starter loan or token-backed credit.
6. Homeowner pays milestones after visible progress and/or inspection.
7. Milestone payment can repay contractor loan first, then pay contractor.
8. If there is a dispute, evidence is uploaded and peer reviewers/inspectors can evaluate the work.
9. Reviews affect payment release, reputation, token rewards, and future credit limits.
10. Important actions are written to audit/payment/verification ledgers and later mapped to smart contracts.

## Strategic Decisions Already Made

- Magic Link is the preferred MVP authentication path.
- Supabase is the current backend/database/Auth candidate.
- GitHub Pages is currently used for the public static site at `xprnet.org`.
- Local SmartContractor MVP runs from `C:\gcsc\construction-ai`.
- Route protection remains in draft mode until Supabase Auth, RLS, admin memberships, and smoke tests are ready.
- Service-role keys stay server-side only and must never be exposed in frontend or chat.
- RLS policies must be strict before public launch; current live dev policies are too open for production.
- Payment intent rows need typed ownership columns before browser RLS can safely show payment status to the correct homeowner or contractor.
- Payment providers are adapters behind one payment router: XPR/WebAuth, Metal Pay, Stripe, PayPal/Crypto, Coinbase Commerce, BTCPay, and future ACH/open-banking rails.
- Metal Pay is important but requires partner/API credentials before real integration.
- Smart contracts should receive finalized settlement/token logic only after database MVP, legal review, and security review.
- Loans, escrow, collateral, and legal ownership language require attorney review before real-money launch.

## Current Engineering State

Live/local pieces already prepared:

- clickable SmartContractor MVP;
- baseline security headers for local/public backend responses, guarded by static validation and live smoke checks via `npm run check:smartcontractor` and `npm run check:auth`;
- request-id tracing via `X-Request-Id`, so API responses and audit rows can be correlated during beta testing, deployment debugging, disputes, and admin review;
- jobs, bids, starter loans, disputes, evidence, peer review;
- mobile-responsive PWA shell;
- backend validation;
- audit/event ledger;
- payment intent/event ledger;
- project contracts and milestones;
- multi-provider payment router;
- Metal Pay signature scaffold;
- verification provider abstraction;
- Admin / Risk Console MVP;
- Admin Console review workflow;
- Production Readiness Gate;
- Magic Link Auth scaffold;
- profile ownership binding draft;
- role ownership guards;
- auth smoke-test harness;
- strict route gate smoke test via `npm run check:strict-gates`;
- strict RLS draft preflight validator via `npm run check:rls-draft`;
- payment ownership draft validator via `npm run check:payment-ownership`;
- smart contract design docs validator via `npm run check:contract-docs`;
- nonstop hook validator via `npm run check:nonstop-hook`;
- automation health validator via `npm run check:automation-health`, checking the real Codex heartbeat/hourly TOML files for active schedules, readable prompts, target thread, and `C:\gcsc` workspace wiring;
- autonomous status note validator via `npm run check:autonomous-status`;
- founder action boundary validator via `npm run check:founder-boundaries`;
- deploy-platform decision brief validator via `npm run check:deploy-brief`;
- CI workflow validator via `npm run check:ci-workflow`;
- environment example validator via `npm run check:env-example`, including production `PUBLIC_SITE_URL`, local/public allowed origins, Supabase Auth redirect origins, placeholder secrets, and server-only warnings;
- PWA QA checklist validator via `npm run check:pwa-qa`;
- Android wrapper preflight validator via `npm run check:android-preflight`;
- Android QA runbook validator via `npm run check:android-qa`;
- mobile release evidence bundle and validator via `npm run check:mobile-release-evidence`, keeping local QA proof, screenshots/log handling, offline checks, live-risk blockers, and founder next step reviewable before public/mobile release decisions;
- mobile install readiness endpoint `/api/admin/mobile-install-readiness` plus validator `npm run check:mobile-install-readiness`, checking PWA app shell files, manifest identity, service worker cache boundaries, offline fallback, and founder-controlled mobile release blockers;
- iOS preflight runbook at `docs/smartcontractor-ios-preflight.md`, keeping Apple/App Store steps founder-controlled;
- iOS preflight validator via `npm run check:ios-preflight`, keeping Apple-account blockers, safe command boundaries, secret checks, and live-risk gates pinned before iOS wrapper work;
- mobile package-id drift guard via `npm run check:mobile`;
- AI agent workflow scaffold validator via `npm run check:ai-agent-workflows`;
- service-role boundary draft;
- admin role model live table created in Supabase migration `20260505053127 add_admin_memberships`, with no users assigned yet;
- admin enforcement scaffold;
- Founder Action Center.
- Founder Auth Setup read-only API/UI, which checks Magic Link session status, profile binding, admin role state, and admin membership table reachability before strict RLS/admin testing.
- Founder admin activation runbook at `docs/smartcontractor-founder-admin-activation-runbook.md`, with exact review SQL, insert template, post-checks, and rollback. Do not apply live without founder approval and real `auth_user_id`.
- Founder admin activation runbook validator via `npm run check:founder-admin-runbook`, which verifies the runbook keeps the approval gate, browser steps, SQL template, rollback, and no secret-looking values.
- Deploy-platform decision brief at `docs/smartcontractor-deploy-platform-decision-brief.md`, with Vercel as the recommended first public beta target and founder-only setup steps.
- Vercel preflight runbook at `docs/smartcontractor-vercel-preflight.md`, plus validator `npm run check:vercel-preflight`, documenting founder-controlled import settings, demo-safe environment variables, and disabled real-money launch boundaries before any external deployment work.
- Vercel environment matrix at `docs/smartcontractor-vercel-env-matrix.md`, plus validator `npm run check:vercel-env-matrix`, separating demo-safe variables, founder-only secrets, disabled real-money features, and safe setup order before Vercel import.
- Vercel post-deploy checklist at `docs/smartcontractor-vercel-postdeploy-checklist.md`, plus validator `npm run check:vercel-postdeploy`, preserving read-only deployed URL checks, security headers, request-id tracing, readiness endpoints, and founder-controlled Supabase Auth redirect steps.
- Public beta handoff checklist at `docs/smartcontractor-public-beta-handoff-checklist.md`, with safe demo scope, founder review packet, local checks, and the next deploy-account action.
- Public beta handoff checklist validator via `npm run check:public-beta-handoff`, preserving safe demo scope, review packet docs, disabled real-money features, and founder-only deploy-account action.
- demo script validator via `npm run check:demo-script`, keeping the 5-minute walkthrough aligned with SmartContractor safety boundaries, payment rails, disputes, milestone repayment, and founder review scope.
- Claude Code global nonstop prompt at `docs/claude-code-global-nonstop-prompt.md`, plus validator `npm run check:claude-code-prompt`, preserving the reusable `~/.claude` setup prompt for the founder's other projects without touching external accounts or secrets.

## Current Supabase State

Project:

- name: `smartcontractor-gcsc`;
- project ref: `uhixuyurxsrxayhghjzm`;
- region: `us-east-1`;
- status: active/healthy in the latest connector check.

Known security status:

- all important public tables have RLS enabled;
- many live policies are still development policies with `USING true` / `WITH CHECK true`;
- strict RLS replacement must be prepared, reviewed, tested, and only then applied;
- do not run live DDL/migrations without explicit founder approval.

Known performance advisor items:

- FK indexes for `project_contracts.accepted_bid_id` and `token_collateral_locks.price_snapshot_id` were applied live in Supabase migration `20260505033416 add_missing_fk_indexes`;
- `admin_memberships` exists live from migration `20260505053127 add_admin_memberships`, but it has zero rows until founder Magic Link/Auth user is selected;
- local `/api/admin/founder-auth-setup` can now show whether the current browser Magic Link session has a linked SmartContractor profile and active founder role, without assigning roles or changing live data;
- keep unused-index cleanup for later because demo data is small.

## Current Priorities

P0 before public/real-money launch:

- strict RLS replacement package;
- Supabase Auth real user testing;
- admin membership activation;
- service-role secret setup in deployment environment only;
- legal review for loans, escrow/payment handling, contractor credit, token collateral, and business-control language;
- deploy-platform decision and production environment variables;
- public demo script and founder/investor package polishing.
- legal/financial review validator via `npm run check:legal-review`, keeping real loans disabled, real escrow disabled, token collateral disabled, production payments blocked, and AI approvals blocked until attorney/provider/founder review.

P1 after P0 is stable:

- Android Capacitor shell;
- iOS plan after Apple account/certificates;
- more complete contractor/homeowner onboarding;
- verification provider selection;
- payment provider partner onboarding;
- AI agent workflow scaffolds.

## Do Not Drift

Do not turn the project into:

- a simple landing page;
- a generic Upwork clone;
- a generic token presale page;
- an unregulated lending promise;
- an automatic escrow/lending system without legal review;
- a crypto-only tool that ignores real construction workflows;
- a frontend-only demo without audit, verification, payments, disputes, and admin review.

## Safety Boundaries

Never:

- ask the founder to paste passwords, private keys, service-role keys, seed phrases, or raw database passwords into chat;
- expose secret keys in frontend code;
- apply live Supabase migrations without explicit approval;
- change Namecheap, GitHub Pages, payment provider, Supabase production settings, or external accounts without the founder present;
- present loan, escrow, collateral, or token appreciation language as legal advice or guaranteed returns.

Always:

- explain founder actions step by step in simple Russian;
- keep code/docs scoped and committed carefully;
- update `docs/smartcontractor-backlog.md` when status changes;
- preserve `AGENTS.md` project rules;
- read this file, `AGENTS.md`, `docs/gcsc-target-architecture.md`, and `docs/smartcontractor-backlog.md` before major autonomous work.

## Next Best Step

Use the Founder Auth Setup flow to finish the first real founder identity path:

1. send Magic Link to the founder email;
2. open the link in the same browser as the local MVP;
3. check Founder Auth Setup;
4. create/link one founder SmartContractor profile if it is missing;
5. after explicit founder approval, add that Auth user to `admin_memberships` as active `founder`;
6. run admin smoke tests before applying strict RLS.

Do not assign founder roles, apply strict RLS, or activate real loan/payment actions without explicit founder approval.
