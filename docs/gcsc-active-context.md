# GCSC Active Context

Date: 2026-05-04

Purpose: this file is the short source-of-truth briefing for Codex when the chat becomes long, context is compressed, or a new session starts.

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
- service-role boundary draft;
- admin role model live table created in Supabase migration `20260505053127 add_admin_memberships`, with no users assigned yet;
- admin enforcement scaffold;
- Founder Action Center.

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

Prepare the strict Supabase RLS replacement package locally:

1. remove permissive dev policies in the draft SQL;
2. keep browser access limited to authenticated owner/participant records;
3. keep backend-only tables closed to browser writes;
4. add the two missing FK indexes;
5. document verification queries;
6. do not apply the SQL live until founder approves after review.

Then prepare typed payment intent ownership so payment status can move from backend-only reads to safe participant reads.
