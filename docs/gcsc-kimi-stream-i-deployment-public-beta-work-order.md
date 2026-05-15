# Kimi Stream I Work Order: Deployment And Public Beta Prep

Date: 2026-05-14 PT

Status: internal parallel-agent work order. Safe for Kimi/local agents. Not approval for deployment, public launch, external account changes, or tester invites.

Purpose: give Kimi a precise Stream I package for auditing deployment readiness and public beta preparation without connecting Vercel, GitHub Pages, Namecheap, Supabase, DNS, payment providers, app stores, or any other external account; without entering secrets; without changing Supabase Auth redirects; without deploying production; without sending tester invites; and without enabling real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, provider commitments, or public launch.

This work order is not deployment approval, not public beta launch approval, not legal advice, not provider approval, not payment approval, and not approval for any external account or live-system action.

## Required Starting Prompt For Kimi

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Mission: execute Stream I only: create a local deployment/public beta readiness package that tells Codex and the founder what is ready, what is blocked, what must be checked, and what must remain founder-controlled before any Vercel/GitHub Pages/DNS/Supabase redirect/public beta action.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md
- docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md
- docs/gcsc-kimi-stream-i-deployment-public-beta-work-order.md
- every source file listed in "Required Source Files"

Safety:
- No secrets.
- No external account login.
- No Vercel import.
- No GitHub Pages settings change.
- No Namecheap, DNS, or domain change.
- No Supabase Auth redirect change.
- No environment variable value entry.
- No production deploy.
- No public beta URL publication.
- No tester invite sending.
- No payment/provider setup.
- No real payments, loans, escrow, repayment routing, stablecoin settlement, or token collateral.
- No legal, compliance, lender, provider, or public launch conclusions.
- Do not edit files outside your assigned file set.
- Do not edit AGENTS.md, GEMINI.md, .claude/CLAUDE.md, .env, package.json, server.js, public HTML, deploy/account files, Vercel config, Supabase config, or public website files unless the integrator explicitly assigns a later package.

Output:
- Short Russian summary.
- Files created/modified.
- Exact commands run and result.
- Findings/blockers ranked Critical/High/Medium/Low.
- Proposed integrator actions.
- Confirmation that no live/legal/money/external/secrets/deploy boundary was crossed.
```

## Stream I Goal

Create a local-only deployment and public beta readiness package that can be reviewed before any founder external setup.

The package must answer:

- Is Vercel still the correct first app host for a demo-only public beta?
- Which deployment docs contradict each other or need reconciliation?
- Which environment variable names are allowed to be documented and which values must stay founder-only?
- Which post-deploy smoke checks are required before tester invites?
- Which public beta documents are ready for a first 3-5 tester cohort?
- What exact Day 0 through Day 7 beta plan should Kimi/Codex follow without sending invites or publishing links?
- What must stay blocked until founder/legal/provider/external-account review?

## Required Source Files

Kimi Stream I must read:

- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-deployment-live-action-decision-packet.md`
- `docs/smartcontractor-deploy-platform-decision-brief.md`
- `docs/smartcontractor-vercel-founder-setup-walkthrough.md`
- `docs/smartcontractor-vercel-preflight.md`
- `docs/smartcontractor-vercel-env-matrix.md`
- `docs/smartcontractor-vercel-postdeploy-checklist.md`
- `docs/smartcontractor-public-beta-env-report-template.md`
- `docs/smartcontractor-public-beta-founder-execution-plan.md`
- `docs/smartcontractor-public-beta-first-cohort-launch-packet.md`
- `docs/smartcontractor-public-beta-review-packet.md`
- `docs/smartcontractor-public-beta-launch-readiness.md`
- `docs/smartcontractor-public-beta-launch-decision-record.md`
- `docs/smartcontractor-public-beta-handoff-checklist.md`
- `docs/smartcontractor-public-beta-smoke-commands.md`
- `docs/smartcontractor-public-beta-rollback-drill.md`
- `docs/smartcontractor-public-beta-incident-response.md`
- `docs/smartcontractor-public-beta-support-queue.md`
- `docs/smartcontractor-public-beta-known-issues.md`
- `docs/smartcontractor-public-beta-tester-quickstart.md`
- `docs/smartcontractor-public-beta-tester-cohort.md`
- `docs/smartcontractor-public-beta-invite-batches.md`
- `docs/smartcontractor-public-beta-launch-message.md`
- `docs/smartcontractor-public-beta-tester-faq.md`
- `docs/smartcontractor-public-beta-consent-acknowledgement.md`
- `docs/smartcontractor-public-beta-privacy-notice.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`
- `docs/smartcontractor-auth-rls-plan.md`
- `docs/smartcontractor-mobile-release-go-no-go-matrix.md`
- `docs/smartcontractor-mobile-release-blockers.md`
- `construction-ai/package.json` scripts section, read-only

Read-only comparison files if needed:

- `docs/gcsc-active-context.md`
- `docs/smartcontractor-backlog.md`
- `docs/gcsc-real-status-audit-2026-05-11.md`

## Assigned File Set

Kimi Stream I may create:

- `docs/smartcontractor-deployment-public-beta-kimi-audit.md`
- `docs/smartcontractor-public-beta-one-week-launch-plan.md`
- `docs/smartcontractor-deployment-public-beta-kimi-worker-split.md`

Kimi Stream I may propose, but should not directly apply unless assigned later by the Codex integrator:

- updates to deployment docs;
- updates to public beta docs;
- new local-only validators;
- package script additions;
- public website or app copy changes.

Reason: deployment, public beta, and public messaging are shared founder-facing surfaces and must be integrated in one controlled pass.

## No-Touch Files And Actions

Do not modify:

- `.env`, `.env.*`, secrets, credentials, tokens, Supabase keys, OAuth files, wallet files;
- `AGENTS.md`, `GEMINI.md`, `.claude/CLAUDE.md`;
- `construction-ai/package.json` unless a later integrator package explicitly assigns it;
- `construction-ai/server.js`;
- Vercel, GitHub Pages, Supabase, DNS, Namecheap, payment-provider, app-store, wallet, or deploy config files;
- public website and whitepaper files;
- migration/apply files.

Do not perform:

- Vercel project import or deployment;
- GitHub Pages settings change;
- DNS, Namecheap, domain, or redirect changes;
- Supabase Auth redirect changes;
- environment variable value entry;
- service-role key setup;
- payment/provider setup;
- public beta URL publication;
- tester invite sending;
- production deploy;
- public launch announcement.

## Output 1: Deployment/Public Beta Kimi Audit

`docs/smartcontractor-deployment-public-beta-kimi-audit.md` must include:

- executive summary;
- required source files read;
- deployment target recommendation status;
- Vercel readiness evidence;
- GitHub Pages role boundary;
- local-only fallback status;
- environment variable boundary table;
- Supabase Auth redirect dependency;
- post-deploy smoke coverage;
- rollback and incident-response readiness;
- public beta first cohort readiness;
- critical/high/medium/low findings;
- blocked-live gates;
- no-touch confirmation.

Required table:

| Area | Current Evidence | Ready State | Missing Evidence | Live Status | Owner |
| --- | --- | --- | --- | --- | --- |

Required areas:

- Vercel first app host recommendation;
- GitHub Pages docs-only boundary;
- local-only fallback;
- repo root/build command;
- environment variable names;
- founder-only secret values;
- Supabase redirect planning;
- Auth/admin/RLS dependency;
- post-deploy smoke checks;
- public beta decision record;
- first cohort packet;
- support queue and known issues;
- consent/privacy/FAQ/quickstart;
- rollback drill;
- incident response.

## Output 2: One-Week Public Beta Launch Plan

`docs/smartcontractor-public-beta-one-week-launch-plan.md` must define a demo-only Day 0 through Day 7 plan.

Required table:

| Day | Goal | Allowed Internal Work | Founder-Controlled Action | Evidence | Stop Conditions |
| --- | --- | --- | --- | --- | --- |

Required days:

- Day 0: local preflight and decision review;
- Day 1: founder external setup only if ready;
- Day 2: smoke checks and issue triage;
- Day 3: first 1-2 tester dry run;
- Day 4: support/known-issue stabilization;
- Day 5: first cohort expansion to 3-5 testers only if safe;
- Day 6: go/review/no-go checkpoint;
- Day 7: closeout, metrics snapshot, next-week decision.

Every day must state:

- demo-only scope;
- no real payments;
- no real loans;
- no real escrow;
- no repayment routing;
- no stablecoin settlement;
- no token collateral;
- no legal/provider commitment;
- no public launch without separate approval.

## Output 3: Worker Split

`docs/smartcontractor-deployment-public-beta-kimi-worker-split.md` must define future independent workers:

| Worker | Focus | May Create/Modify | Must Not Touch | Checks |
| --- | --- | --- | --- | --- |

Workers:

- I01 Deployment docs contradiction audit.
- I02 Vercel preflight and environment boundary audit.
- I03 Post-deploy smoke and rollback audit.
- I04 Public beta first cohort readiness audit.
- I05 Public beta one-week launch plan.
- I06 Support, known issues, and incident-response audit.
- I07 Privacy/consent/tester evidence safety audit.
- I08 Mobile/PWA public beta readiness cross-check.
- I09 Future validator proposal.
- I10 Integrator handoff and Claude review packet.

## Required Safety Conclusions

Every output must preserve these conclusions:

- Vercel is a recommendation for first app host, not autonomous deployment approval.
- GitHub Pages is docs/landing only unless the backend lives elsewhere.
- External account setup remains founder-controlled.
- Environment variable names may be documented; values must not be placed in chat, docs, screenshots, frontend files, or public GitHub.
- Supabase Auth redirects remain founder-controlled after a deployed URL exists.
- Public beta remains demo-only until separate founder/legal/provider/security/deploy gates are complete.
- Tester invites and public beta URL sharing remain founder-controlled.
- Real payments, real loans, escrow, repayment routing, stablecoin settlement, and token collateral stay disabled.

## Commands To Run

Start with:

```powershell
cd C:\gcsc\construction-ai
npm run check:deployment-decision-prep
npm run check:deployment-live-action-decision-packet
npm run check:vercel-founder-setup-walkthrough
npm run check:public-beta-founder-execution-plan
npm run check:public-beta-first-cohort-launch-packet
npm run check:public-beta-launch-readiness
npm run check:public-beta-review-packet
npm run check:public-beta-smoke-commands
npm run check:public-beta-rollback-drill
npm run check:public-beta-incident-response
```

If Stream I creates docs only, also run:

```powershell
cd C:\gcsc
git diff --check
```

If a later integrator accepts validator, app, or deployment-doc changes, run:

```powershell
cd C:\gcsc\construction-ai
npm run check:deployment-decision-prep
npm run check:public-beta-founder-execution-plan
npm run check:public-beta-first-cohort-launch-packet
npm run check:real-status-audit
npm run check
```

## Definition Of Done

Stream I is done only when:

- deployment/public beta Kimi audit exists;
- one-week launch plan exists;
- worker split exists;
- every required source file is listed as read or explicitly missing;
- every output states local-only/internal status;
- Vercel/GitHub Pages/local-only roles are separated;
- environment names and founder-only secret values are separated;
- Supabase redirect dependency is explicit;
- first cohort remains 3-5 testers with tester codes only;
- support, known issues, consent/privacy, rollback, and incident response are covered;
- public beta URL sharing and tester invites remain founder-controlled;
- no locked files were modified;
- no secrets, external accounts, deploys, DNS, Supabase redirects, public launch, tester invites, or real-money actions were touched;
- commands run are listed with exact results.

## Handoff To Codex And Claude

After Kimi completes Stream I:

1. Codex reviews the three docs first.
2. Codex checks for locked-file changes and live-risk claims.
3. Codex runs the Stream I commands and intake checklist.
4. Codex may batch local-only validator or doc updates in a later scoped integrator commit.
5. Claude reviews public beta launch assumptions and deployment safety before any founder external setup session.
6. Founder approval remains required before Vercel/GitHub Pages/DNS/Supabase redirect changes, environment value entry, tester invites, public URL sharing, public launch, or real-money features.

## Stop Conditions

Stop and report instead of continuing if Kimi encounters:

- passwords, API keys, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, raw database passwords, Magic Link URLs, or environment variable values;
- external account setup requirements;
- Vercel import/deploy requirements;
- GitHub Pages, DNS, Namecheap, domain, or Supabase Auth redirect changes;
- payment-provider, lender, escrow, wallet, app-store, or provider setup;
- production deploy or public launch decisions;
- tester invite sending or public beta URL publication;
- real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, or production money movement;
- legal, securities, escrow, lending, custody, AML, tax, provider, security certification, or public launch decisions;
- need to edit locked files to complete the assigned stream.
