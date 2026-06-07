# Smart Contract Anti-Backdoor Checklist

Date: 2026-06-06 PT

Status: LOCAL_REVIEW_CHECKLIST_ONLY

Purpose: provide a concise local checklist for future SmartContractor smart-contract review so no module can gain hidden live authority, owner drains, mutable history, stealth upgrades, or money-moving shortcuts.

This checklist does not approve live XPR deployment, XPR account creation, signatures, real escrow, real loans, real payments, repayment routing, stablecoin settlement, token collateral, token custody, provider action, legal decision, live Supabase write, production release, public file replacement, or public claims that any roadmap feature is live.

## Source Documents

- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-fixture-gap-map-2026-06-06.md`

## Review Result Vocabulary

| Result | Meaning |
| --- | --- |
| `PASS_LOCAL_ONLY` | The reviewed design or code draft passes this local checklist, but live deployment remains blocked. |
| `HOLD_FOR_REVIEW` | Evidence is incomplete, ambiguous, stale, or inconsistent. |
| `FAIL_BACKDOOR_RISK` | A hidden authority, mutation, bypass, or privileged shortcut is present. |
| `BLOCKED_FOR_LIVE` | A live step requires founder, legal/provider, security, XPR, payment, escrow, lending, or custody approval. |

## Checklist

| # | Check | Must Pass | Fail Condition |
| ---: | --- | --- | --- |
| 1 | Module split | Each module has one narrow responsibility and depends on explicit authority/audit gates. | Monolithic contract, broad owner powers, or module that can silently control unrelated workflows. |
| 2 | Privileged authority | Deployment, upgrade, unpause, authority change, provider signer activation, and recovery require multisig or explicit multi-role review evidence. | Single-key production authority, developer-only owner authority, AI-only approval, frontend-only protected action, or same-signer proposer/approver. |
| 3 | No owner drain | No action can transfer, seize, reroute, unlock, or mutate balances without provider/legal/security/founder evidence and audit trail. | Hidden owner-only drain, arbitrary balance mutation, forced collateral unlock, repayment reroute, escrow release, or reward/slash without review. |
| 4 | Upgrade boundary | Upgrade and rollback paths must name module, action, reason, risk class, affected state, rollback path, request id, and audit event. | Hidden upgrade path, mutable ABI behavior, unreviewed migration, role escalation, or upgrade that introduces owner drain, AI-only approval, dispute bypass, or public-live claim. |
| 5 | Pause and unpause | Pause may stop new protected actions only; unpause must require stronger evidence and cannot settle economic state. | Pause or unpause releases escrow, approves loans, routes repayments, liquidates collateral, rewrites history, clears disputes, or upgrades authority. |
| 6 | Dispute and repayment invariants | Dispute, pause, HOLD, REVIEW_REQUIRED, and BLOCKED_FOR_LIVE states must win over release, repayment, settlement, and collateral actions. | Release while disputed, repayment while disputed, repayment above outstanding balance, negative contractor payout, missing loan id, stale milestone id, or contradictory actor role defaulting to approval. |
| 7 | AI and frontend limits | AI agents, UI state, and frontend code may recommend or display review states only. | AI, browser code, or request payload can approve loans, release escrow, resolve disputes, route repayment, change authority, deploy, sign, or mark a live claim as approved. |
| 8 | Audit integrity | Every protected action records append-only non-secret evidence: request id, actor role, action, prior state, next state, blocked-live status, and review evidence reference. | Mutable audit history, missing request id, missing prior state, missing affected module/action, secret storage, raw identity data, private keys, service-role keys, wallet secrets, or provider credentials. |
| 9 | Oracle and collateral | Token collateral, valuation, oracle snapshots, lock/release, LTV, and liquidation remain disabled until legal/provider/custody/oracle review exists. | Arbitrary oracle trust, auto-liquidation, real token lock, collateral seizure, margin call, custody assumption, or token collateral enabled by code/config alone. |
| 10 | Public/live status | Public wording and live-state flags must match actual approved implementation and default to blocked when evidence is missing. | Code, docs, API response, or public draft implies live escrow, live loans, stablecoin settlement, token collateral, FIO payment approval, XPR deployment, partnership approval, or public investment product without approval. |

## Minimum Evidence Before Any Local PASS

- Linked authority model and deployment blocker rows.
- Linked backend-to-chain action/table/audit map.
- Local fixture or fixture-gap evidence with fake data only.
- No-secret scan result for the reviewed artifact.
- Confirmation that `index.html` and `whitepaper.html` were not edited.
- Explicit `BLOCKED_FOR_LIVE` closeout for any live XPR, payment, escrow, loan, stablecoin, token collateral, provider, legal, or public-publication path.

## Automatic Failure Phrases

Any reviewed artifact fails this checklist if it includes an autonomous path to:

- deploy live XPR contracts;
- create or change live XPR account authority;
- sign XPR transactions;
- move, hold, release, route, settle, or seize real funds;
- approve or originate real loans;
- hold or release real escrow;
- lock, release, or liquidate real token collateral;
- store secrets, service-role keys, private keys, seed phrases, wallet credentials, raw identity documents, bank data, or provider credentials;
- let AI, frontend code, a single admin, or a single signer make final protected decisions;
- publish live Web3/token/loan/escrow/stablecoin/partnership claims.

## Required Local Checks

Run the relevant existing checks before accepting a local anti-backdoor review:

- `npm --prefix construction-ai run check:smart-contract-authority-model`
- `npm --prefix construction-ai run check:smart-contract-deployment-blockers`
- `npm --prefix construction-ai run check:smart-contract-local-replay-live-gate`
- `npm --prefix construction-ai run check:smart-contract-test-fixtures`

If any check fails, the reviewed module remains `HOLD_FOR_REVIEW` and `BLOCKED_FOR_LIVE`.

