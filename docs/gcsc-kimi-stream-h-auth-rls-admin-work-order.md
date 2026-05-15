# Kimi Stream H Work Order: Auth, RLS, And Admin Activation Prep

Date: 2026-05-14 PT

Status: internal parallel-agent work order. Safe for Kimi/local agents. Not approval for live Supabase changes.

Purpose: give Kimi a precise Stream H package for auditing SmartContractor Auth, RLS, and founder admin activation readiness without sending Magic Links, handling secrets, applying SQL, assigning roles, changing live Supabase, deploying production, or enabling real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, provider commitments, or public launch.

This work order is not legal advice, not security certification, not deployment approval, not RLS apply approval, not founder admin activation approval, and not approval for any live Supabase write.

## Required Starting Prompt For Kimi

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Mission: execute Stream H only: create a local Auth/RLS/admin activation audit package that tells Codex and the founder what is ready, what is blocked, what must be tested, and what must remain founder-controlled before any live Supabase role assignment or strict RLS apply.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md
- docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md
- docs/gcsc-kimi-stream-h-auth-rls-admin-work-order.md
- every source file listed in "Required Source Files"

Safety:
- No secrets.
- No Magic Link sending.
- No live Supabase changes.
- No SQL apply.
- No admin_memberships insert/update/delete.
- No profile/auth_user_id live linking.
- No external account changes.
- No production deploy or environment variable changes.
- No real payments, loans, escrow, repayment routing, stablecoin settlement, or token collateral.
- No legal, compliance, lender, provider, or public launch conclusions.
- Do not edit files outside your assigned file set.
- Do not edit AGENTS.md, GEMINI.md, .claude/CLAUDE.md, .env, package.json, server.js, public HTML, deploy/account files, migrations, SQL apply scripts, or live Supabase files unless the integrator explicitly assigns a later package.

Output:
- Short Russian summary.
- Files created/modified.
- Exact commands run and result.
- Findings/blockers ranked Critical/High/Medium/Low.
- Proposed integrator actions.
- Confirmation that no live/legal/money/external/secrets/Supabase boundary was crossed.
```

## Stream H Goal

Create a local-only Auth/RLS/admin readiness package that can be reviewed before any founder live action.

The package must answer:

- Which founder Auth/Admin docs are aligned?
- Which API, UI, and test scaffolds support Magic Link, session check, profile binding, admin role visibility, and strict-mode smoke tests?
- Which RLS tables/policies are ready for review and which remain blocked for live apply?
- What exact manual founder evidence is needed before a live admin role decision?
- What exact smoke tests must pass before strict RLS is considered for staging or production?
- Which future Kimi workers can safely draft docs/tests without touching live Supabase or shared server files?

## Required Source Files

Kimi Stream H must read:

- `docs/smartcontractor-founder-auth-admin-activation-prep.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`
- `docs/smartcontractor-founder-auth-troubleshooting.md`
- `docs/smartcontractor-founder-auth-evidence-template.md`
- `docs/smartcontractor-founder-tonight-checklist.md`
- `docs/smartcontractor-founder-admin-activation-runbook.md`
- `docs/smartcontractor-strict-admin-smoke-checklist.md`
- `docs/smartcontractor-auth-rls-plan.md`
- `docs/smartcontractor-strict-rls-review.md`
- `docs/smartcontractor-strict-rls-replacement-draft.sql`
- `docs/smartcontractor-admin-role-model.md`
- `docs/smartcontractor-admin-role-model-draft.sql`
- `docs/smartcontractor-admin-enforcement-scaffold.md`
- `docs/smartcontractor-auth-smoke-tests.md`
- `construction-ai/server.js`
- `construction-ai/scripts/smoke-auth-ownership.mjs`
- `construction-ai/scripts/validate-auth-rls-plan.mjs`
- `construction-ai/scripts/validate-founder-auth-admin-activation-prep.mjs`
- `construction-ai/scripts/validate-founder-auth-admin-live-decision-packet.mjs`
- `construction-ai/scripts/validate-strict-rls-draft.mjs`
- `construction-ai/scripts/validate-strict-admin-smoke-checklist.mjs`
- `construction-ai/scripts/validate-founder-admin-runbook.mjs`
- `construction-ai/package.json` scripts section, read-only

Read-only comparison files if needed:

- `docs/smartcontractor-backlog.md`
- `docs/gcsc-active-context.md`
- `docs/gcsc-real-status-audit-2026-05-11.md`

## Assigned File Set

Kimi Stream H may create:

- `docs/smartcontractor-auth-rls-admin-kimi-audit.md`
- `docs/smartcontractor-auth-rls-policy-test-matrix.md`
- `docs/smartcontractor-auth-admin-kimi-worker-split.md`

Kimi Stream H may propose, but should not directly apply unless assigned later by the Codex integrator:

- new local-only validator files under `construction-ai/scripts/`;
- new local-only smoke fixtures under `construction-ai/test-fixtures/` or a clearly existing fixture folder;
- package script additions;
- `construction-ai/server.js` edits;
- RLS SQL edits.

Reason: Stream H must stay read-heavy and conflict-light because Auth/RLS/admin touches shared risk surfaces.

## No-Touch Files And Actions

Do not modify:

- `.env`, `.env.*`, secrets, credentials, tokens, Supabase keys, OAuth files, wallet files;
- `AGENTS.md`, `GEMINI.md`, `.claude/CLAUDE.md`;
- `construction-ai/package.json` unless a later integrator package explicitly assigns it;
- `construction-ai/server.js` unless a later integrator package explicitly assigns it;
- `docs/smartcontractor-strict-rls-replacement-draft.sql` unless a later SQL review package explicitly assigns it;
- migration/apply files;
- deploy/Vercel/Namecheap/GitHub Pages/payment/provider/app-store files;
- public website/whitepaper files.

Do not perform:

- Magic Link sending;
- live Supabase connector writes;
- live SQL apply;
- `admin_memberships` insert/update/delete;
- `profiles.auth_user_id` live update;
- production deploy;
- external account setting changes;
- real payment, loan, escrow, repayment, stablecoin, token collateral, or provider setup.

## Output 1: Auth/RLS/Admin Kimi Audit

`docs/smartcontractor-auth-rls-admin-kimi-audit.md` must include:

- executive summary;
- required source files read;
- current Auth flow status;
- current profile ownership binding status;
- current admin role model status;
- current strict RLS status;
- current smoke-test coverage;
- manual founder evidence needed;
- critical/high/medium/low findings;
- blocked-live gates;
- no-touch confirmation.

Required table:

| Area | Current Evidence | Ready State | Missing Evidence | Live Status | Owner |
| --- | --- | --- | --- | --- | --- |

Required areas:

- Magic Link send endpoint and UI;
- same-browser session capture;
- `GET /api/auth/profile`;
- profile `auth_user_id` binding;
- `admin_memberships` table existence;
- active founder role visibility;
- admin enforcement draft/strict mode;
- protected route behavior;
- strict RLS SQL draft;
- strict admin smoke checklist;
- payment/provider/webhook backend-only boundaries;
- audit event visibility;
- founder evidence template.

## Output 2: RLS Policy Test Matrix

`docs/smartcontractor-auth-rls-policy-test-matrix.md` must include a table for the expected anonymous, homeowner, contractor, admin, and backend/service-role behavior.

Required table:

| Table Or Surface | Anonymous | Homeowner | Contractor | Admin | Backend/System | Current Test | Missing Test | Live Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Minimum surfaces:

- `profiles`;
- `homeowners`;
- `contractors`;
- `jobs`;
- `bids`;
- `project_contracts`;
- `milestones`;
- `loan_requests`;
- `loan_repayments`;
- `payment_intents`;
- `payment_events`;
- `disputes`;
- `dispute_evidence`;
- `dispute_peer_reviews`;
- `verification_checks`;
- `verification_provider_events`;
- `token_price_snapshots`;
- `token_collateral_locks`;
- `audit_events`;
- admin API surfaces;
- founder Auth setup endpoint;
- public/demo static surfaces.

For every row, the matrix must state whether the behavior is:

- `COVERED_BY_LOCAL_SMOKE`;
- `COVERED_BY_DOCS_ONLY`;
- `MISSING_REAL_TOKEN_TEST`;
- `MISSING_TYPED_OWNERSHIP`;
- `BACKEND_ONLY`;
- `BLOCKED_FOR_LIVE_APPLY`;
- `REQUIRES_FOUNDER_APPROVAL`.

## Output 3: Worker Split

`docs/smartcontractor-auth-admin-kimi-worker-split.md` must define future independent workers:

| Worker | Focus | May Create/Modify | Must Not Touch | Checks |
| --- | --- | --- | --- | --- |

Workers:

- H01 Founder Auth docs alignment.
- H02 Founder evidence and report-back template audit.
- H03 Admin role model and enforcement audit.
- H04 Strict RLS policy matrix.
- H05 Auth smoke and real-token test gap map.
- H06 Backend-only/service-role boundary audit.
- H07 Payment/provider/backend-only RLS risk review.
- H08 Live apply blocker register.
- H09 Future local validator proposal.
- H10 Integrator handoff and Claude review packet.

## Required Safety Conclusions

Every output must preserve these conclusions:

- `Founder Auth Setup ready` is not approval for live role assignment.
- Admin activation requires separate founder approval for the selected `auth_user_id`.
- Strict RLS apply remains blocked until real Auth/admin smoke tests pass and founder approves exact SQL.
- Service-role key must remain backend-only and must never be placed in browser code or chat.
- Payment events, verification provider events, audit events, and system/provider records remain backend-only.
- Payment intents remain risky for direct browser RLS until typed ownership columns are complete.
- Public beta remains demo-only until Auth/admin/deploy/RLS evidence is reviewed.
- Real payments, real loans, escrow release, repayment routing, stablecoin settlement, and token collateral stay disabled.

## Commands To Run

Start with:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
npm run check:auth-rls-plan
npm run check:founder-auth-admin-activation-prep
npm run check:founder-auth-admin-live-decision-packet
npm run check:rls-draft
npm run check:strict-admin-smoke
```

If Stream H creates docs only, also run:

```powershell
cd C:\gcsc
git diff --check
```

If a later integrator accepts validator or backend changes, run:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
npm run check:strict-gates
npm run check:strict-admin-smoke
npm run check
```

## Definition Of Done

Stream H is done only when:

- Auth/RLS/admin Kimi audit exists;
- RLS policy test matrix exists;
- worker split exists;
- every required source file is listed as read or explicitly missing;
- every output states local-only/internal status;
- missing real-token tests and typed ownership gaps are explicit;
- founder live approval boundary is explicit;
- strict RLS live apply remains blocked;
- no locked files were modified;
- no secrets, Magic Links, live SQL, Supabase writes, external accounts, public launch actions, or real-money actions were touched;
- commands run are listed with exact results.

## Handoff To Codex And Claude

After Kimi completes Stream H:

1. Codex reviews the three docs first.
2. Codex checks for locked-file changes and live-risk claims.
3. Codex runs the Stream H commands and intake checklist.
4. Codex may batch local-only validator proposals in a later scoped integrator commit.
5. Claude reviews Auth/RLS/admin boundary risks before any strict RLS or founder admin live action.
6. Founder approval remains required before Magic Link live follow-up, `admin_memberships` updates, strict RLS apply, production deploy, public beta launch, or real-money features.

## Stop Conditions

Stop and report instead of continuing if Kimi encounters:

- passwords, API keys, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, raw database passwords, or Magic Link URLs;
- live Supabase changes;
- live SQL apply requirements;
- `admin_memberships` insert/update/delete requirements;
- `profiles.auth_user_id` live linking requirements;
- production deploy or external account changes;
- real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, or production money movement;
- legal, securities, escrow, lending, custody, AML, tax, provider, security certification, or public launch decisions;
- need to edit locked files to complete the assigned stream.
