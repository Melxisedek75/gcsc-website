# GCSC Daily Work Mode Hook

Date: 2026-05-13 PT

Purpose: keep Codex aligned with the founder's daily rhythm. Before the founder is home, Codex works autonomously on safe local work. After 17:00 founder local time, Codex stops repetitive micro-work and switches to founder-present decisions.

This is an operating hook, not legal, financial, deployment, or live-system approval.

## Daily Split

| Founder local time | Mode | Codex behavior |
| --- | --- | --- |
| Before 17:00 | Autonomous Nonstop Mode | Continue safe local tasks without asking what next. |
| After 17:00 | Founder-Present Evening Mode | Stop micro-validator loops and proceed through the founder-standing-approved internal high-value agenda. |

## Before 17:00: Autonomous Nonstop Mode

When the founder is not home, Codex should do useful safe work that does not require founder decisions, secrets, external accounts, live money, legal approval, or destructive actions.

Priority order:

1. Fix failing local tests, validators, smoke checks, and CI drift.
2. Harden local backend/API behavior: validation, errors, request IDs, auth guards, audit logs, demo-safe admin visibility.
3. Harden local frontend/PWA flows: clearer states, mobile usability, demo-only warnings, admin readiness displays.
4. Prepare documentation and runbooks that unblock founder action later: Auth, RLS, deploy, beta, legal/provider handoff.
5. Prepare architecture drafts that stay local/internal until founder review.
6. Prepare smart contract design drafts, replay fixtures, state machines, and anti-backdoor checks without live XPR signatures.
7. Prepare mobile readiness docs and local-only QA evidence templates.
8. Update backlog/context/audit records after completed scoped work.
9. Commit and push only scoped safe files after checks pass.

Autonomous mode must avoid:

- real loans, real escrow, real payments, token collateral, or money movement;
- live Supabase migrations or live production database changes without explicit founder approval;
- external account settings, deploy settings, Namecheap, Vercel, GitHub Pages, payment providers, or app stores;
- passwords, API keys, private keys, seed phrases, service-role keys, or secrets;
- legal, financial, lender, provider, securities, tax, or compliance decisions;
- founder business decisions such as public positioning, launch timing, provider choice, or production go/no-go.

## After 17:00: Founder-Present Evening Mode

After 17:00 founder local time, Codex should not continue the old monotone micro-validator loop unless the founder explicitly asks for it.

## Founder Standing Approval For Internal Evening Work

As of 2026-05-13 PT, the founder granted standing approval for Codex to proceed through the evening high-value internal agenda without requiring the founder to type "I approve point 1", "I approve point 2", or similar per-item confirmations.

This standing approval covers internal architecture, whitepaper drafts, contract-backed loan design, smart contract module planning, local-only review packets, local code scaffolds, local validators, local checklists, and scoped commits/pushes after checks pass.

This standing approval does not cover live Supabase changes, production deploy settings, external account changes, real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, secrets, legal decisions, financial/provider commitments, public launch, or destructive actions. Those remain explicit stop boundaries.

Evening work should focus on high-value decisions where the founder is present:

1. Whitepaper v1.2 positioning and public wording.
2. Contract-backed loan architecture, repayment waterfall, lender/provider boundaries, and risk controls.
3. Smart contract module split, authority model, audit trail, and anti-backdoor review.
4. Founder Auth and admin activation steps, including Magic Link evidence and explicit admin membership approval.
5. Strict RLS review and live-apply decision prep.
6. Legal/provider review packet: what GCSC does, what remains disabled, what must be reviewed externally.
7. Deploy strategy: Vercel/GitHub Pages/domain/environment variable decisions, without autonomous account changes.
8. Public beta plan: tester scope, demo-only boundaries, invite batches, support process, and go/no-go.
9. Investor/founder package: one-pager, demo script, architecture summary, and conservative claims.
10. Mobile release decisions: Android/iOS tooling, store accounts, signing, screenshots, and release blockers.

Evening mode can prepare documents and local checklists, but it must stop before any live action that needs founder approval.

## Daily Check-In Contract

Every heartbeat or daily worker must first read:

1. `docs/gcsc-active-context.md`
2. `docs/codex-nonstop-execution-hook.md`
3. `docs/gcsc-daily-work-mode-hook.md`
4. `docs/smartcontractor-backlog.md`

Then it must run:

```powershell
git status --short
```

Daily reporting rule:

- If before 17:00, continue safe autonomous work and keep routine progress silent.
- If after 17:00, report only if founder action is needed or the founder is actively asking for a planning/status answer.
- When asked for a daily audit, summarize:
  - what Codex completed while the founder was away;
  - checks that passed;
  - commits pushed;
  - blockers that require founder/legal/provider/external-account action;
  - recommended evening agenda with the founder.

## Current Evening Agenda Recommendation

The next founder-present sequence should be:

1. Keep the GCSC v1.2 Core Architecture Package as the founder-approved internal source of truth.
2. Transform the approved package into safe public whitepaper v1.2 wording.
3. Convert the contract-backed loan model into technical implementation requirements and blocked-live gates.
4. Lock the smart contract module split, authority model, audit trail, and anti-backdoor checks.
5. Prepare legal/provider review packets before any real loan, escrow, repayment, payment, or token collateral action.
6. Prepare Founder Auth/Admin activation steps, stopping before live role assignment or live RLS changes.
7. Prepare deploy target decisions, with Vercel as the recommended first public beta host, stopping before external account changes.
8. Prepare public beta, investor/founder package, and mobile release decisions with conservative claims.

## Success Criteria

This hook is working when:

- Codex no longer spends founder-present evening time on tiny repetitive validator/backlog/audit work unless asked.
- Codex keeps using safe autonomous work before 17:00.
- Every daily cycle checks the daily work mode hook before choosing work.
- Founder-facing status clearly separates "done while you were away" from "needs you tonight".
- Evening founder-level internal work proceeds by priority without requiring repeated "approve point N" messages.
- No live system, secret, account, money, legal, or destructive action happens without explicit founder approval.
