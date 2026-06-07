# Smart Contract Complete Boundary Matrix

Date: 2026-06-06 PT

Status: LOCAL_BOUNDARY_MATRIX_ONLY

Purpose: give Codex, Kimi, and the founder one compact boundary matrix for every SmartContractor smart-contract-adjacent domain so local design, local replay, and future review packets cannot drift into live deployment, money movement, or public claims.

This matrix does not approve live XPR deployment, XPR account creation, signatures, real escrow, real loans, real payments, repayment routing, stablecoin settlement, token collateral, token custody, provider action, legal decision, live Supabase write, production release, public file replacement, or public claims that any roadmap feature is live.

## Source Documents

- `docs/smartcontractor-smart-contract-design.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smart-contract-deployment-blocker-spec.md`
- `docs/smart-contract-anti-backdoor-checklist.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-fixture-gap-map-2026-06-06.md`

## Status Vocabulary

| Status | Meaning |
| --- | --- |
| `SAFE_LOCAL_ONLY` | Codex can prepare local docs, fake-data fixtures, local validators, or internal review packets. |
| `FOUNDER_REVIEW_REQUIRED` | Codex can prepare a decision packet, but the founder must decide before any external/live step. |
| `LEGAL_PROVIDER_REQUIRED` | Attorney, licensed provider, finance provider, custody provider, payment provider, or compliance review is needed. |
| `SECURITY_REVIEW_REQUIRED` | Permission, authority, anti-backdoor, audit, replay, and external audit evidence is needed. |
| `XPR_OWNER_REQUIRED` | XPR account, authority, signature, key, FIO, or deployment action is founder/XPR owner only. |
| `BLOCKED_FOR_LIVE` | No autonomous Codex/Kimi action may proceed beyond local review. |
| `NOT_ALLOWED_AUTONOMOUSLY` | This action must never be performed by autonomous Codex/Kimi. |

## Complete Boundary Matrix

| Domain | Safe Local Work | Review Required | Blocked Live Action | Never Autonomous |
| --- | --- | --- | --- | --- |
| Project escrow | Design states, milestone labels, dispute labels, fake-data replay, audit map. | Founder, legal/provider, escrow/payment provider, security. | Holding funds, releasing escrow, refunding, acting as escrow agent. | Moving real funds or claiming licensed escrow status. |
| Loan ledger | Ledger labels, request/score/offer/repayment labels, local repayment waterfall simulation. | Founder, finance provider, lending counsel, adverse-action review, security. | Loan approval, origination, funding, repayment routing, collections, default enforcement. | Acting as lender/broker/underwriter or approving credit. |
| Repayment waterfall | Local allocation preview, repayment-first labels, no-real-money fixture checks. | Finance/payment provider, legal/provider, founder, security. | Routing real milestone payments, paying contractors, repaying live loans. | Moving money or overriding disputes/holds. |
| Token collateral | Demo-only lock labels, LTV labels, oracle question list, collateral state machine. | Token-collateral legal/provider, custody, oracle, founder, security. | Locking real tokens, custody, release, margin call, collateral seizure. | Auto-liquidation or token custody by autonomous agent. |
| Stablecoin/payment settlement | Provider-agnostic payment intent docs and local event labels. | Payment/stablecoin provider, sanctions/AML, refund/dispute review, founder. | Stablecoin settlement, card/ACH transfer, provider activation, refund execution. | Real payment movement or production provider setup. |
| Peer review rewards | Review score labels, abuse flags, reputation impact labels, reward labels. | Founder, abuse-control review, legal/provider if token rewards are real, security. | Real token rewards, slashing, payment-release authority. | Final dispute/legal/payment decisions by peers or AI. |
| Authority and multisig | Draft signer roles, pause/unpause rules, local multisig labels. | Founder, security, provider signer where regulated flow exists. | Live authority change, unpause, upgrade, deployment, emergency recovery. | Single-key production authority or developer-only owner powers. |
| Backend-to-chain map | API/action/table/audit mapping with request IDs and privacy boundaries. | Founder, security, legal/provider for money-touching rows. | Live chain writes, private data storage, provider-status claims. | Writing private data or secrets on-chain. |
| Audit event map | Event names, required fields, prior/next state rules, local evidence references. | Founder, security, legal/provider where evidence has legal meaning. | Production audit assertions, legal conclusions, provider commitments. | Mutable audit history or raw sensitive evidence storage. |
| Local replay and fixtures | Fake-data-only fixtures, local replay packets, no-real-money checks. | Security review before code merge; founder/legal/provider before live use. | Testnet/mainnet deployment or live transaction execution. | Using real identities, payment data, wallet keys, or provider secrets. |
| AI agents and frontend | Recommendations, labels, review states, request-id display, local warnings. | Founder/product review for wording; security for protected actions. | Loan approval, escrow release, dispute resolution, authority change, deployment. | AI-only or frontend-only final protected decisions. |
| Public wording | Internal draft language, claim-risk scans, publication gate packets. | Founder publication approval, legal/provider review for finance/Web3 claims. | Public `index.html`, `whitepaper.html`, deck, email, social, investor/public claims. | Publishing live loan/escrow/token/stablecoin/partnership claims. |
| XPR account and deployment | Draft account names, module manifest, local blocker packets. | Founder/XPR owner, security, legal/provider, multisig approval. | Account creation, authority update, signing, WASM deploy, contract action. | Any XPR signature, key handling, or live deployment. |
| Supabase/admin integration | Local admin evidence surfaces, request-id maps, draft SQL review. | Founder Auth evidence, admin activation approval, strict RLS approval. | Live Supabase writes, admin role assignment, strict RLS apply. | Service-role use or live DB mutation without founder approval. |
| External providers | Question lists, review packets, redacted evidence templates. | Founder chooses recipients and sends externally. | Provider submissions, commitments, contract setup, production credentials. | External sends or storing raw reviewer responses/secrets. |
| Rollback/emergency pause | Local rollback plan, emergency pause labels, audit requirements. | Founder, security, provider/legal where live flow exists. | Live pause/unpause, recovery, rollback execution, authority repair. | Pause/unpause that moves money or rewrites history. |

## Cross-Domain Rules

1. `SAFE_LOCAL_ONLY` never means testnet, mainnet, production, provider activation, public release, real user data, or money movement.
2. Any missing founder, legal/provider, finance-provider, payment-provider, custody, security, or XPR-owner evidence returns the row to `BLOCKED_FOR_LIVE`.
3. Kimi output is analysis only. Codex remains the integrator and cannot use Kimi output as live approval evidence.
4. Local validators can prove a document or local helper respects boundaries; they cannot approve a legal, provider, XPR, payment, loan, escrow, token, public, or production decision.
5. `index.html` and `whitepaper.html` remain unchanged unless the founder gives an explicit publication approval for that exact public edit.
6. No autonomous workflow may ask the founder to paste private keys, seed phrases, service-role keys, payment credentials, provider credentials, Magic Link URLs, JWTs, or raw customer identity evidence into chat.

## Required Closeout For Future Reviews

Every future smart-contract boundary review must record:

```text
domain:
safe_local_work_completed:
review_required:
blocked_live_action:
never_autonomous:
checks_run:
public_files_changed: no
live_actions_taken: no
deployment_approved: no
next_safe_local_action:
```

## Required Local Checks

Use the relevant existing checks before relying on this matrix:

- `npm --prefix construction-ai run check:smart-contract-deployment-blockers`
- `npm --prefix construction-ai run check:smart-contract-authority-model`
- `npm --prefix construction-ai run check:smart-contract-local-replay-live-gate`
- `npm --prefix construction-ai run check:smart-contract-test-fixtures`

If any check fails, the affected row remains `HOLD_FOR_EVIDENCE` and `BLOCKED_FOR_LIVE`.

