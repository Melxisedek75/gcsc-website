# Smart Contract Deployment Blocker Spec

Date: 2026-06-06 PT

Status: LOCAL_DEPLOYMENT_BLOCKER_SPEC_ONLY

Purpose: translate the existing SmartContractor smart-contract deployment blocker register into concrete review states, evidence requirements, and no-live-action rules before any future contract module can move beyond local design or local replay.

This spec does not approve live XPR deployment, XPR account creation, signatures, real escrow, real loans, real payments, repayment routing, stablecoin settlement, token collateral, token custody, provider action, legal decision, live Supabase write, production release, public file replacement, or public claims that any roadmap feature is live.

## Source Documents

- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smart-contract-anti-backdoor-checklist.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-fixture-gap-map-2026-06-06.md`

## Review States

| State | Meaning |
| --- | --- |
| `BLOCKED_FOR_LIVE` | Live action is blocked until founder, legal/provider, finance-provider, security, XPR owner, or external account evidence exists. |
| `READY_FOR_LOCAL_ONLY` | Safe for local design, local fake-data fixtures, or local replay only; cannot authorize live systems. |
| `READY_FOR_FOUNDER_REVIEW` | Safe to show the founder for a decision packet; still not live authority. |
| `HOLD_FOR_EVIDENCE` | Evidence is missing, stale, ambiguous, incomplete, or inconsistent with the active blocker register. |
| `NOT_APPROVED_FOR_DEPLOYMENT` | The row cannot support deployment because required approvals are missing or the artifact implies live authority. |

Default state is `BLOCKED_FOR_LIVE` for every escrow, lending, repayment, payment, stablecoin, token collateral, custody, authority, public wording, XPR account, or deployment path.

## Evidence Requirements

| Blocker | Required Evidence | Local Outcome Allowed | Missing Evidence Outcome |
| --- | --- | --- | --- |
| Founder module scope approval | Non-secret founder decision naming exact modules, excluded live-risk features, and review owner. | `READY_FOR_FOUNDER_REVIEW` for scope discussion only. | `BLOCKED_FOR_LIVE` |
| Legal/provider escrow review | Attorney or provider review record for custody, escrow role, release, refund, dispute, and consumer-protection boundaries. | `HOLD_FOR_EVIDENCE` or local question packet only. | `BLOCKED_FOR_LIVE` |
| Finance-provider lending review | Provider/counsel review for contractor credit, receivables, disclosures, APR, repayment waterfall, adverse action, and collections boundaries. | `HOLD_FOR_EVIDENCE` or local question packet only. | `BLOCKED_FOR_LIVE` |
| Token collateral review | Legal/provider/custody/oracle review for classification, volatility disclosure, lock/release mechanics, no-liquidation policy, and custody boundaries. | Local placeholder labels only. | `BLOCKED_FOR_LIVE` |
| Stablecoin/payment provider review | Approved provider review for settlement, custody, sanctions/AML, disputes, refunds, payment flow, and money-movement responsibilities. | Local payment-event labels only. | `BLOCKED_FOR_LIVE` |
| Authority/multisig approval | Approved signer set, threshold, pause/unpause policy, upgrade policy, emergency recovery, and separation of duties. | `READY_FOR_FOUNDER_REVIEW` for authority packet only. | `BLOCKED_FOR_LIVE` |
| Security/anti-backdoor review | Completed local anti-backdoor checklist, permission review, no-secret scan, local replay evidence, and external audit path where required. | `READY_FOR_LOCAL_ONLY` for reviewed local draft only. | `HOLD_FOR_EVIDENCE` |
| XPR account approval | Founder-created account names, permissions, key-handling outside chat, and multisig plan. | Draft account-name planning only. | `BLOCKED_FOR_LIVE` |
| Backend-to-chain mapping approval | Approved API/action/table/audit map with privacy boundary and request-id correlation. | Local interface planning only. | `HOLD_FOR_EVIDENCE` |
| Audit event map approval | Approved event names, required fields, prior/next state rules, and no-real-money semantics. | Local event planning only. | `HOLD_FOR_EVIDENCE` |
| No-real-money fixture test results | Passing local fake-data fixture/replay checks for escrow, loan, collateral, peer review, authority failure, dispute pause, and emergency pause. | `READY_FOR_LOCAL_ONLY` only. | `HOLD_FOR_EVIDENCE` |
| Public wording approval | Founder/legal/provider-approved wording that matches actual approved implementation and does not imply live finance/Web3 features. | Internal wording draft only. | `BLOCKED_FOR_LIVE` |
| Rollback/emergency pause plan | Documented rollback owner, emergency pause trigger, unpause threshold, audit event, and no-fund-movement rule. | `READY_FOR_FOUNDER_REVIEW` for plan review only. | `HOLD_FOR_EVIDENCE` |

## Non-Negotiable Rules

1. No single row can move a module to live deployment by itself.
2. Missing evidence always returns the affected module to `BLOCKED_FOR_LIVE`.
3. External legal, provider, payment, lending, custody, XPR, and security decisions cannot be simulated by docs, validators, local fixture labels, AI output, or frontend state.
4. Local checks can produce only local readiness, never deployment approval.
5. `READY_FOR_LOCAL_ONLY` means fake-data local review only; it does not mean testnet, mainnet, production, public beta, money movement, or provider activation.
6. `READY_FOR_FOUNDER_REVIEW` means the founder can review a packet; it does not authorize Codex to act on the decision externally.
7. If a document, validator, API response, UI, prompt, or report implies live escrow, live loans, stablecoin settlement, token collateral, XPR deployment, partnership approval, or public investment claims without evidence, the result is `NOT_APPROVED_FOR_DEPLOYMENT`.

## Module Closeout Rule

Each future module review must close with this exact shape:

```text
module:
local_review_state:
required_evidence_missing:
checks_run:
public_files_changed: no
live_actions_taken: no
deployment_approved: no
blocked_next_action:
```

The only acceptable deployment value in autonomous Codex work is `deployment_approved: no`.

## Required Local Checks

Before accepting this spec or using it for a future module review, run:

- `npm --prefix construction-ai run check:smart-contract-deployment-blockers`
- `npm --prefix construction-ai run check:smart-contract-authority-model`
- `npm --prefix construction-ai run check:smart-contract-local-replay-live-gate`
- `npm --prefix construction-ai run check:smart-contract-test-fixtures`

If any check fails, the reviewed artifact remains `HOLD_FOR_EVIDENCE` and `BLOCKED_FOR_LIVE`.

