# GCSC Unified Vocabulary Matrix

Date: 2026-06-06 PT

Status: LOCAL_VOCABULARY_CONTROL_ONLY

Purpose: consolidate the Safe / Review-Required / Blocked vocabulary used across Kimi intake, whitepaper v1.3 publication controls, SmartContractor smart-contract blockers, and local readiness docs so no status word is accidentally treated as public, live, legal, provider, finance, XPR, or deployment approval.

This matrix does not approve public website replacement, public whitepaper publication, deployment, live Supabase writes, admin activation, strict RLS apply, public beta launch, tester invites, external sends, legal conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR/FIO signatures, app-store actions, secrets handling, production release, or destructive actions.

## Source Families

| Family | Source Examples | Scope |
| --- | --- | --- |
| Kimi triage | `DONE_CONFIRMED`, `CORRECTED_STALE_KIMI_FINDING`, `OPEN_SAFE_LOCAL`, `VERIFY_BEFORE_BUILDING`, `FOUNDER_OR_EXTERNAL_ONLY` | Report intake and local task routing only. |
| Whitepaper/publication | `NO-GO`, `REVIEW`, `GO`, `PUBLICATION_GO`, `publication_allowed: false` | Public wording and publication gates only. |
| Smart-contract readiness | `SAFE_LOCAL_ONLY`, `READY_FOR_LOCAL_ONLY`, `READY_FOR_FOUNDER_REVIEW`, `HOLD_FOR_EVIDENCE`, `HOLD_FOR_REVIEW`, `BLOCKED_FOR_LIVE`, `NOT_APPROVED_FOR_DEPLOYMENT` | Local smart-contract design, replay, blocker, and authority review only. |
| Live-risk boundary | `LEGAL_PROVIDER_REQUIRED`, `SECURITY_REVIEW_REQUIRED`, `XPR_OWNER_REQUIRED`, `NOT_ALLOWED_AUTONOMOUSLY` | Stop conditions for founder, legal/provider, security, XPR owner, or external systems. |

## Canonical Status Matrix

| Canonical Status | Common Aliases | Means | Never Means | Owner To Clear |
| --- | --- | --- | --- | --- |
| `DONE_CONFIRMED` | complete, exists, passed local check | Codex verified the local artifact/check exists. | Public approval, live approval, legal/provider approval, deployment approval. | Codex for local evidence only. |
| `CORRECTED_STALE_KIMI_FINDING` | stale finding corrected | Kimi reported a missing item, but Codex verified it exists. | Kimi is wrong about all related areas or a live gate is cleared. | Codex for source correction only. |
| `OPEN_SAFE_LOCAL` | safe local task, candidate local doc | Codex may create a local doc/check/fixture without live action. | External send, public edit, money movement, XPR action. | Codex for local work. |
| `VERIFY_BEFORE_BUILDING` | inspect first, avoid duplicate | Codex must inspect existing repo artifacts before creating anything new. | Permission to build broad new systems or overwrite existing files. | Codex after source scan. |
| `SAFE_LOCAL_ONLY` | `READY_FOR_LOCAL_ONLY`, `PASS_LOCAL_ONLY`, local-ready | Artifact is safe for local fake-data docs, local replay, or local validators. | Testnet, mainnet, production, public beta, real user data, real money, provider activation. | Codex for local scope only. |
| `READY_FOR_FOUNDER_REVIEW` | founder-ready, review packet ready | Safe to show founder a decision packet. | Founder has approved it, or Codex may act externally. | Founder decision required. |
| `HOLD_FOR_EVIDENCE` | `HOLD_FOR_REVIEW`, pending evidence, incomplete evidence | Evidence is missing, stale, ambiguous, or inconsistent. | Failure is fixed, live is allowed, public wording is approved. | Relevant owner named by blocker. |
| `REVIEW_REQUIRED` | legal review required, provider review required, security review required | A human, attorney, provider, finance, custody, payment, or security review is needed. | Local docs/checks can substitute for external review. | Founder routes to reviewer/provider/security owner. |
| `FOUNDER_OR_EXTERNAL_ONLY` | founder-only, external-only, blocked for founder | Next step needs founder, legal/provider, account, public, live, or money authority. | Codex/Kimi may continue autonomously. | Founder or external owner. |
| `BLOCKED_FOR_LIVE` | `BLOCKED`, live blocked, default blocked | No live action is allowed without the required evidence and explicit approval path. | The project is blocked locally, or local documentation cannot continue. | Founder plus required external/security/XPR owner. |
| `NOT_APPROVED_FOR_DEPLOYMENT` | deployment not approved, no deploy | Deployment evidence is missing or the artifact implies unsafe live authority. | Local design cannot continue. | Founder, security, legal/provider, XPR owner. |
| `NOT_ALLOWED_AUTONOMOUSLY` | never autonomous, stop boundary | Codex/Kimi must not perform this action. | The founder cannot do it separately with proper approval. | Founder or explicit external owner only. |
| `NO-GO` | publication blocked, `publication_allowed: false` | Public publishing is blocked. | Local draft/review work is blocked. | Founder plus required reviews. |
| `GO` | publication go, approved to publish | Only the exact scoped publication action may proceed after required evidence. | Live finance/Web3, provider commitment, XPR deployment, payment, loan, escrow, token collateral, legal conclusion. | Founder publication approval plus required reviews. |

## Approval Phrase Rules

| Phrase | Allowed Scope | Explicitly Not Allowed |
| --- | --- | --- |
| `APPROVED_TO_DISPATCH_KIMI_WAVE_TWO_LOCAL_ONLY` | Kimi may run report-only local analysis workers. | Repo edits by Kimi, public files, secrets, live systems, money, legal/provider actions, XPR/FIO/mobile-store actions. |
| `PUBLICATION_GO` | Exact public publication step named in the dated publication record, if all required reviews exist. | Real finance/Web3 activation, provider commitments, live Supabase changes, XPR/FIO signatures, production payment/loan/escrow/token actions. |
| `MOBILE_RELEASE_DECISION_RECORDED` | Exact internal mobile release decision record named in the evidence packet. | Store submission, signing upload, Apple/Google account action, production deploy, live finance. |
| `PUBLIC_BETA_INVITE_ACTION_RECORDED` | Exact internal invite-readiness record named in the evidence packet. | Public URL sharing, uncontrolled invites, paid-user invites, live payments, loans, escrow, token collateral, production. |

## Precedence Rule

When statuses conflict, the safest status wins in this order:

1. `NOT_ALLOWED_AUTONOMOUSLY`
2. `BLOCKED_FOR_LIVE`
3. `FOUNDER_OR_EXTERNAL_ONLY`
4. `REVIEW_REQUIRED`
5. `HOLD_FOR_EVIDENCE`
6. `READY_FOR_FOUNDER_REVIEW`
7. `SAFE_LOCAL_ONLY`
8. `VERIFY_BEFORE_BUILDING`
9. `OPEN_SAFE_LOCAL`
10. `DONE_CONFIRMED`

No local `DONE`, `READY`, `PASS`, `GO`, or `APPROVED` wording can override a higher-priority blocker.

## Usage Rules

1. Use `SAFE_LOCAL_ONLY` when Codex can create local docs, local fake-data fixtures, local validators, or internal review packets.
2. Use `READY_FOR_FOUNDER_REVIEW` when the only safe next action is founder review.
3. Use `HOLD_FOR_EVIDENCE` when evidence is missing or stale, even if some local checks pass.
4. Use `BLOCKED_FOR_LIVE` for any real payment, loan, escrow, repayment routing, stablecoin, token collateral, XPR/FIO, live Supabase, provider, legal, public launch, production, or destructive path.
5. Use `NOT_ALLOWED_AUTONOMOUSLY` for secrets, private keys, service-role keys, external account changes, provider submissions, public publication, live deployment, money movement, legal decisions, and destructive actions.
6. Treat Kimi output as analysis only until Codex verifies the local source and integrates scoped changes.
7. Keep `index.html` and `whitepaper.html` unchanged unless a standalone founder-approved publication record explicitly names the file and action.

## Closeout Template

Use this block when resolving vocabulary conflicts:

```text
source_term:
canonical_status:
safe_local_action:
review_or_blocked_owner:
blocked_live_actions:
public_files_changed: no
live_actions_taken: no
approval_scope:
```

