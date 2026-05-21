# SmartContractor Founder Evening Command Board

Status: INTERNAL_EVENING_COMMAND_BOARD_ONLY

Purpose: give the founder and Codex one visible after-17:00 priority board for serious founder-present work, so evening work moves by priority without asking the founder to approve every point again.

This board uses the founder standing approval for internal drafts, checklists, scaffolds, validators, and scoped commits. It does not approve live Supabase changes, external account changes, production deploy settings, real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, secrets, legal decisions, financial/provider commitments, public launch, or destructive actions.

## Operating Rule

After 17:00 founder local time:

1. Stop the old monotone micro-validator loop.
2. Use this board to choose the next highest-value internal task.
3. Proceed without requiring repeated "approve point N" messages.
4. Stop before any live/external/legal/money action.
5. Commit and push only scoped safe internal work after checks pass.

## Priority Board

| Order | Workstream | Current Internal Target | Allowed Without New Approval | Stop Before |
| ---: | --- | --- | --- | --- |
| 1 | GCSC v1.2 / public wording | Convert approved architecture into safe public whitepaper wording | Draft wording, sentence registers, placement maps, review packets, validators | Public whitepaper/PDF/site/deck/email/social publication |
| 2 | Contract-backed loan | Keep signed-contract working-capital model precise and provider-reviewable | Technical requirements, blocker registers, approval evidence templates, repayment waterfall docs | Real loans, lender commitments, escrow claims, repayment routing |
| 3 | Smart contract architecture | Keep authority, escrow, loan, collateral, dispute, audit, and anti-backdoor modules reviewable | Local state helpers, replay fixtures, manifests, digest/evidence packets, scaffold docs | Live XPR deployment, live signatures, token collateral locks |
| 4 | Founder Auth/Admin | Prepare the founder identity/admin activation path | Read-only evidence templates, step-by-step runbooks, smoke-test prep | Magic Link token sharing, live `admin_memberships` insert, strict RLS apply |
| 5 | Legal/provider review | Prepare non-secret packets for attorney, finance, escrow/payment, stablecoin, AI, and smart contract reviewers | Evidence indexes, question sets, conservative claim language, handoff docs | Legal advice, provider commitments, classified product claims |
| 6 | Deployment decision prep | Keep demo-only deploy choices clear | Vercel/GitHub Pages/local-only comparison, env category docs, rollback/smoke prep | Vercel import, GitHub Pages settings, DNS/Namecheap, production env secrets |
| 7 | Public beta planning | Prepare no-real-money beta execution | Founder execution plan, launch readiness, go/no-go records, tester/support docs | Tester invites, public link sharing, public launch |
| 8 | Investor/founder package | Keep conversations conservative and evidence-backed | One-pager, pitch language, safe metrics, claim rules, founder packets | Investor promises, securities claims, provider/lender claims |
| 9 | Mobile release decisions | Keep mobile path ready without store/live risk | Android/iOS setup, QA evidence templates, screenshot redaction, release blockers | App store accounts, signing keys, public store release |

## Default Next Task Rule

When several tasks are available, choose the first workstream in the priority board that can be advanced locally and safely. If the next step in that workstream needs a live/external/legal/money action, skip to the next internal-safe workstream and record the blocker.

## Evening Cutover Guard

After 17:00 founder local time, do not extend long same-family validator chains just because another chain node exists. Prefer workstream deliverables that help the founder make evening decisions: public wording packets, contract-backed loan requirements, smart contract authority review, Founder Auth/Admin prep, legal/provider handoffs, deployment decision prep, public beta planning, investor/founder package work, and mobile release decisions.

Micro-validator continuation is allowed only when it directly supports one of the priority-board workstreams and does not bury the founder-facing value. Record the workstream and founder-facing value in the final heartbeat message so the evening status stays decision-oriented.

## Founder-Facing Status Format

For evening status, report only:

- what serious workstream advanced;
- what file or code changed;
- what checks passed;
- what commit was pushed;
- what remains blocked for founder/live/legal/provider/external-account action.

Do not narrate routine file reads, staging, or micro-validator chatter.

## Current Evening Session Run Sheet

Use this run sheet when founder-local time is after 17:00 and the next heartbeat needs to stay decision-oriented.

| Evening Session Field | Required Handling |
| --- | --- |
| Evening session state | FOUNDER_PRESENT_INTERNAL_WORK unless a live/external/legal/money stop boundary is reached |
| highest-value internal workstream | Choose the first priority-board workstream that can be advanced locally without live action |
| Founder action needed tonight | Report only if the next step needs founder account access, external account action, legal/provider decision, money action, public launch, or secrets |
| Next Codex action | Continue internal drafts, checklists, review packets, local code scaffolds, or validators that directly support the chosen workstream |
| Approval handling | Do not ask for another approval unless the next step crosses a stop boundary |
| Status source | If the founder asks for status, answer from this run sheet first |

## Current Recommended Sequence

1. Finish safe public beta command materials so the founder can run a demo-only beta decision session.
2. Continue contract-backed loan implementation readiness, but keep all live finance blocked.
3. Continue smart contract local replay and anti-backdoor evidence, but keep live XPR deployment blocked.
4. Prepare founder Auth/admin activation evidence, but stop before real `admin_memberships` changes.
5. Prepare legal/provider packets, but stop before legal/provider commitments.

## Required Source Documents

- `docs/gcsc-daily-work-mode-hook.md`
- `docs/codex-nonstop-execution-hook.md`
- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/gcsc-contract-backed-loan-blueprint.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`
- `docs/whitepaper-v1-2-legal-provider-review-prep.md`
- `docs/smartcontractor-founder-auth-admin-activation-prep.md`
- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-public-beta-founder-execution-plan.md`
- `docs/smartcontractor-investor-founder-package.md`
- `docs/smartcontractor-mobile-release-go-no-go-matrix.md`

## Required Checks

- `npm run check:founder-evening-command-board`
- `npm run check:daily-work-mode-hook`
- `npm run check:public-beta-founder-execution-plan`
- `npm run check:contract-backed-loan-blueprint`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor`
- `npm run check:founder-auth-admin-activation-prep`
- `npm run check:deployment-decision-prep`
- `npm run check:investor-founder-package`
- `npm run check:mobile-release-go-no-go`
- `npm run check`

## Acceptance Check

The founder can open this board after 17:00 and see the serious evening priorities, what Codex may do under standing approval, and exactly where Codex must stop before live/external/legal/money actions.
