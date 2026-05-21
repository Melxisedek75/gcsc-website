# SmartContractor Investor Founder Package

Date: 2026-05-13 PT

Status: INTERNAL_PACKAGE_ONLY

Purpose: give the founder one conservative, no-secret package for investor, grant, partner, and strategic conversations before public launch. This package is not a securities offer, not legal advice, not a lender or escrow approval, not a public whitepaper update, and not approval to deploy production or enable real-money features.

## Positioning

SmartContractor is the product layer of GCSC: construction trust infrastructure for homeowners, contractors, and future regulated settlement providers.

The safest current positioning is:

```text
SmartContractor helps prove the construction workflow before money moves: job posting, bids, project contracts, milestones, contractor readiness, demo working-capital logic, dispute evidence, peer review, admin oversight, and audit trails.
```

Do not position the current MVP as a live lender, bank, escrow agent, investment product, payment institution, securities product, or production smart-contract finance system.

## Audience Packets

| Audience | Goal | Safe artifacts | Must avoid |
| --- | --- | --- | --- |
| Investor / strategic partner | Explain the vision and why construction needs trust infrastructure | Founder one-pager, demo script, real-status audit, v1.2 architecture package, deployment decision prep | Token price promises, guaranteed returns, live-lending claims, public launch claims |
| Grant / startup program | Show product progress, AI/cloud usage, and safety discipline | Microsoft/Azure packet, demo script, architecture summary, validators/check status | Unsupported traction numbers, legal/compliance certainty, production finance claims |
| Payment / verification provider | Explain future integration needs without asking them to approve live money | Legal/provider prep, Vercel env matrix, payment router docs, no-real-money gates | Production payment capture, escrow handling, secret sharing, unreviewed user data flows |
| Attorney / finance provider | Ask classification and operating questions | Legal/provider prep, contract-backed loan technical requirements, blocker register | Treating Codex drafts as legal advice or provider commitment |
| Founder internal review | Decide next evening work and what needs external approval | Daily work mode hook, founder action queue, deployment decision prep, Auth/Admin activation prep | Secrets in chat, live SQL, external account changes |

## Core Story

1. Construction has a trust gap: homeowners fear upfront deposits, and serious contractors need working capital to start jobs.
2. SmartContractor creates a structured workflow: job, bid, project contract, milestones, payment readiness, dispute evidence, peer review, and audit records.
3. The contract-backed loan concept is future working-capital infrastructure: the signed project contract and milestone schedule can support contractor funding, while milestone payments can repay first before any remainder goes to the contractor.
4. GCSC adds long-term settlement and governance architecture, but current public language must stay product-first and compliance-aware.
5. The MVP is demo-ready locally, not production finance-ready.

## Evidence Index

Use these files as the internal evidence set:

| Evidence | File | Use |
| --- | --- | --- |
| Founder one-pager | `docs/smartcontractor-founder-one-pager.md` | Short partner/investor overview |
| Demo script | `docs/smartcontractor-demo-script.md` | Five-minute walkthrough |
| Real status audit | `docs/gcsc-real-status-audit-2026-05-11.md` | Honest readiness and blockers |
| Core architecture | `docs/gcsc-v1-2-core-architecture-package.md` | Founder-approved internal source of truth |
| Contract-backed loan blueprint | `docs/gcsc-contract-backed-loan-blueprint.md` | Future working-capital architecture |
| Technical requirements | `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md` | Implementable local-only requirements and live gates |
| Legal/provider prep | `docs/whitepaper-v1-2-legal-provider-review-prep.md` | External review packet |
| Deployment decision prep | `docs/smartcontractor-deployment-decision-prep.md` | Vercel/GitHub Pages/local-only decision gates |
| Public beta review packet | `docs/smartcontractor-public-beta-review-packet.md` | Demo-only beta readiness |
| Founder action queue | `docs/smartcontractor-founder-action-queue.md` | Founder-only next steps |

## Evidence Freshness Boundary

Do not share this package externally until evidence dates, check counts, and status claims are refreshed against the latest local run.

Before investor, grant, partner, provider, or legal/finance sharing:

- confirm the real-status audit count matches the latest backlog/context update;
- confirm the latest full suite count must be copied from the current run-checks output before sharing;
- if a metric is older than the latest full check run, label it historical or remove it;
- keep screenshots, tester notes, request IDs, deploy URLs, and demo evidence redacted and audience-approved before sharing;
- do not convert internal draft evidence into traction, revenue, legal, provider, launch, lending, escrow, token, payment, or production-readiness claims without separate founder/legal/provider approval.

## Investor/Founder External Share Approval Stamp

External investor, grant, partner, provider, or founder-forwarded packet sharing requires an approval stamp with audience, packet_version, approved_by, approved_at, source_commit, latest_check_run, evidence_date, redaction_status, and blocked_claims_review.

Missing packet_version, approved_by, approved_at, source_commit, latest_check_run, evidence_date, redaction_status, or blocked_claims_review keeps the packet INTERNAL_REVIEW_ONLY.

An approval stamp does not approve investor outreach, grant submission, provider commitments, legal conclusions, token/yield promises, live finance, public launch, production deployment, payment provider setup, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral.

Old decks, old PDFs, screenshots, chat summaries, stale metrics, or copied approval text cannot replace a current packet_version approval stamp.

## Audience-Specific Packet Delta Boundary

Each audience packet must record audience, allowed_artifacts, removed_artifacts, claim_level, evidence_version, redaction_status, owner, approval_stamp_status, and blocked_next_actions before sharing leaves INTERNAL_REVIEW_ONLY.

Investor, grant, partner, provider, attorney, and founder-internal packets must not be treated as interchangeable; a stamp for one audience cannot approve another audience or a broader channel.

If a packet is reused, forwarded, clipped, translated, converted to slides/PDF/email/social copy, or merged with tester evidence, it defaults to HOLD_FOR_AUDIENCE_REVIEW until the audience-specific deltas and blocked claims are rechecked.

Audience-specific packet review does not approve outreach, grant submission, provider commitments, legal conclusions, public claims, production deployment, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or public launch.

## Recipient Context And Follow-Up Boundary

External packet records must capture recipient_context_type, intended_follow_up_type, reply_owner, allowed_response_topics, blocked_response_topics, private_recipient_data_status, and follow_up_log_location before any investor, grant, partner, provider, attorney, or founder-forwarded packet leaves INTERNAL_REVIEW_ONLY.

Recipient names, emails, phone numbers, addresses, private investor notes, provider contacts, attorney details, and private follow-up content must stay outside tracked docs; tracked records may use recipient_code, audience, channel_class, follow_up_status, and owner only.

Questions or replies about investment terms, token purchases, legal conclusions, provider commitments, production deploys, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or public launch default to FOUNDER_LEGAL_PROVIDER_FOLLOW_UP_REQUIRED and BLOCKED_FOR_LIVE.

## Current Claim Source Binding Boundary

Before any investor, grant, partner, provider, attorney, or founder-forwarded claim leaves INTERNAL_REVIEW_ONLY, the claim record must bind claim_id, audience, packet_version, source_file, source_commit, evidence_id, evidence_date, latest_check_run, claim_level, redaction_status, owner, approval_stamp_status, and blocked_next_action.

Copied claims from old decks, PDFs, screenshots, website text, chat summaries, Kimi or Claude outputs, public beta notes, or prior investor packets default to HOLD_FOR_CURRENT_CLAIM_SOURCE_BINDING until the source file, source commit, evidence id, latest check run, audience, and redaction status are current.

Current claim source binding does not approve outreach, grant submission, provider commitments, legal conclusions, public claims, production deployment, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, token/yield promises, or public launch.

## Founder Evening Share Decision Gate

FOUNDER_EVENING_SHARE_DECISION_GATE is the founder-present internal share-readiness decision for using this package in an evening investor, grant, partner, provider, attorney, or founder-forwarded review.

Use `Share/Revise/Hold` only for internal readiness:

- `Share`: the audience is specific, packet version is current, source commit and latest check run are recorded, evidence is fresh, redaction is complete, and blocked claims are reviewed.
- `Revise`: one audience, evidence, redaction, metric, claim, artifact, or owner question needs a named owner before sharing can leave internal review.
- `Hold`: any secret, stale evidence, unsupported metric, claim-risk, legal/provider, real-money, deployment, public launch, or audience mismatch question is unresolved.

For each `Share/Revise/Hold` line, record audience, packet version, source commit, latest check run, evidence date, redaction owner, claim reviewer, and blocked next action.

No outreach, grant submission, provider commitment, legal conclusion, public claim, production deployment, real payment, real loan, escrow, repayment routing, stablecoin settlement, token collateral, or public launch is approved by this gate.

## Founder Evening Investor Response Readiness Record

Use this record during founder-present evening mode to decide whether an investor, grant, partner, provider, attorney, or founder-forwarded response is ready for founder drafting, not sending.

| Founder Evening Response Field | Required Value |
| --- | --- |
| evening_response_readiness_state | READY_FOR_FOUNDER_RESPONSE_DRAFT, REVIEW_RECIPIENT_CONTEXT, HOLD_FOR_CLAIM_REVIEW, HOLD_FOR_LEGAL_PROVIDER, HOLD_FOR_REDACTION, or NO_GO |
| evening_response_readiness_evidence | Current packet version, source commit, latest check run, recipient code, audience, claim-source record, redaction status, blocked-topic review, or founder notes with no private contact data |
| evening_response_readiness_owner | Founder, Codex-local, claim reviewer pending, redaction owner pending, legal/provider owner pending, response owner pending, or HOLD_FOR_OWNER |
| evening_response_readiness_blocked_action | Do not send investor, grant, partner, provider, attorney, or founder-forwarded responses, disclose private recipient details, make investment terms, submit grants, make provider commitments, give legal conclusions, change deploy settings, enable payments, approve loans, release escrow, route repayments, settle stablecoins, lock token collateral, make public claims, or launch publicly from this record |

## Founder Evening Investor Package Final Handoff Matrix

Use this matrix during founder-present evening mode to decide whether the investor/founder package can move into a founder packet draft. This is internal package prep only, not external sharing.

| Final Handoff Field | Required Value |
| --- | --- |
| investor_package_final_handoff_state | READY_FOR_FOUNDER_PACKET_DRAFT, NEEDS_AUDIENCE_CLARIFICATION, HOLD_FOR_CLAIM_REVIEW, HOLD_FOR_REDACTION_REVIEW, HOLD_FOR_LEGAL_PROVIDER_REVIEW, HOLD_FOR_TRACTION_EVIDENCE_REVIEW, or NO_GO |
| investor_package_final_handoff_evidence | Current audience, packet version, source commit, latest check run, evidence date, claim-source binding, redaction status, legal/provider review reference, traction evidence status, blocked-claims list, or founder notes with no private contact data |
| investor_package_final_handoff_owner | Founder, Codex-local, audience owner pending, claim reviewer pending, redaction owner pending, legal/provider owner pending, traction evidence owner pending, or HOLD_FOR_OWNER |
| investor_package_final_handoff_blocked_action | Do not treat this matrix as investor outreach approval, grant submission approval, partner outreach approval, provider outreach approval, legal approval, public claim approval, token/yield promise approval, fundraising approval, securities-law approval, payment-provider approval, live deploy approval, public launch approval, or external send approval |

## Safe Metrics Language

Use only verifiable local status:

- local MVP exists;
- backend API exists;
- Supabase schema direction and Auth/RLS prep exist;
- admin/risk console exists;
- payment router scaffolding exists;
- contract-backed loan architecture is internally drafted;
- no-real-money public beta prep exists;
- 359 local checks passed in the latest full suite when this package was prepared.

Do not use unsupported metrics such as active users, revenue, loan volume, escrow volume, token performance, guaranteed savings, guaranteed approval rates, or provider commitments unless separate evidence exists and is approved for that audience.

## Conservative Claim Rules

Allowed:

- "demo-ready local MVP";
- "working toward no-real-money public beta";
- "contract-backed working-capital concept";
- "future provider-reviewed lending/escrow/payment integrations";
- "smart-contract architecture drafted";
- "legal/provider review required before live money movement";
- "founder-controlled deployment and Auth/Admin steps remain."

Blocked:

- "approved lender";
- "licensed escrow";
- "guaranteed contractor loan";
- "guaranteed token return";
- "SEC-approved";
- "bank-grade compliance complete";
- "production payments ready";
- "real escrow enabled";
- "AI approves loans automatically";
- "token collateral live";
- "public launch complete";
- "provider partnership secured" unless a written provider record exists.

## One-Minute Founder Pitch

```text
SmartContractor is the first product layer of GCSC. It is built for a real construction problem: homeowners do not want to risk large upfront deposits, but good contractors still need working capital to begin work. Our MVP connects job posting, contractor bids, project contracts, milestones, demo working-capital logic, payment readiness, disputes, peer review, and audit trails. The long-term architecture supports compliant settlement, smart contracts, AI-assisted risk and compliance, and contract-backed capital, but real loans, escrow, repayment routing, stablecoin settlement, token collateral, and production payments stay disabled until legal, provider, security, Auth/Admin, and founder gates are complete.
```

## Three-Minute Founder Pitch

```text
GCSC is building construction trust infrastructure. The first usable product is SmartContractor, a platform that helps homeowners and contractors manage the risky parts of residential construction: finding serious contractors, turning bids into project contracts, tracking milestones, reducing unsafe upfront deposits, reviewing disputes with evidence, and preparing payment and audit trails.

The important idea is contract-backed working capital. In the future, a signed project contract and milestone schedule may support contractor funding. As homeowner-approved milestones are paid, the system can prioritize repayment first, then route the remainder to the contractor. That makes the contractor less dependent on direct homeowner deposits while keeping the homeowner tied to visible progress.

Right now, the MVP is local and demo-safe. It is not a live lender, escrow agent, bank, or production payment platform. The architecture, validators, no-real-money gates, Auth/Admin prep, deployment decision packet, legal/provider packet, and public beta docs are prepared so the founder can move carefully from local demo to controlled beta and then to provider-reviewed pilots.
```

## Founder Talking Points

- Lead with construction trust, not crypto speculation.
- Show the MVP workflow before discussing tokens.
- Explain contract-backed loans as future provider-reviewed working capital, not as a live loan offer.
- Say "demo-only" and "no real money" clearly for current beta scope.
- Route legal, lending, escrow, payment, token, and provider questions to review packets.
- Keep all secrets, private user data, provider credentials, and Magic Links out of calls, chat, screenshots, and shared docs.

## Red Flags During Conversations

Stop and route to founder/legal/provider review if anyone asks for:

- investment terms or token purchase promises;
- loan approval, underwriting, APR, escrow custody, repayment routing, or collateral details as if live;
- provider commitments or production account setup;
- private customer data, identity documents, bank data, wallet secrets, or service-role keys;
- public announcement wording;
- legal, tax, securities, lending, escrow, or money-transmission conclusions.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:investor-founder-package
npm run check:founder-one-pager
npm run check:demo-script
npm run check:real-status-audit
npm run check:deployment-decision-prep
npm run check:whitepaper-v1-2-legal-provider-review-prep
npm run check
```

## Acceptance Check

The investor/founder package is ready when it:

- explains SmartContractor as construction trust infrastructure;
- points to the existing one-pager, demo script, architecture, legal/provider, deployment, and beta evidence;
- keeps real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production payments, and public launch blocked;
- avoids unsupported metrics, token appreciation, legal certainty, provider commitments, and production finance claims;
- gives the founder a safe one-minute and three-minute pitch.
