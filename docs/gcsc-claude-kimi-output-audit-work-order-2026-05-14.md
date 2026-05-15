# GCSC Claude Kimi Output Audit Work Order

Date: 2026-05-14 PT

Status: ready for Claude after Kimi Wave One returns outputs.

Purpose: give Claude a strict independent audit assignment for reviewing Kimi's 100-agent output before Codex integrates anything into the main project.

This is not approval for deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Inputs Claude Must Read

Claude should read these files first:

1. `AGENTS.md`
2. `docs/gcsc-active-context.md`
3. `docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md`
4. `docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md`
5. `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`
6. Kimi controller summary
7. Kimi worker reports
8. Kimi-created or Kimi-modified files

Claude must not rely on the controller summary alone. It must sample worker reports and inspect every file proposed for integration.

## Audit Scope

Claude owns independent review of:

- public wording and whitepaper claims;
- legal/provider/lending/escrow/payment/stablecoin/token collateral claims;
- smart contract module split, authority, audit trail, and anti-backdoor assumptions;
- Auth/RLS/admin activation assumptions;
- deployment/public beta assumptions;
- investor/grant/partner language;
- mobile release readiness language;
- locked-file, secret, live-system, and money-movement violations;
- integration risk and merge order.

Claude does not own final integration. Codex keeps final edits, validators, commits, and pushes.

## Mandatory Audit Questions

Claude must answer these questions for every stream:

1. Did any worker touch a locked file?
2. Did any worker include a secret-looking value, credential, Magic Link URL, token, key, wallet material, or environment value?
3. Did any worker claim legal approval, lender approval, escrow readiness, stablecoin readiness, token collateral readiness, production launch readiness, or public publication approval?
4. Did any worker propose a live Supabase write, live RLS apply, production SQL, admin membership insert, XPR signature, deployment, app-store action, provider setup, or external account change?
5. Did any worker edit public website, public whitepaper, deck, email, social, grant, investor, or outreach files?
6. Did the work order allow every created/modified file?
7. Are the findings useful enough for Codex to integrate, or should the stream be reworked?

## Stream-Specific Review

| Stream | Claude Focus | Required Verdict |
| --- | --- | --- |
| A | public whitepaper wording, AI/token/finance claim safety | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| F | API inventory accuracy, no package/backend edits by workers | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| N | public artifact safety, secret/mojibake/claim findings | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| J | smart contract module map, authority, anti-backdoor assumptions | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| H | Auth/RLS/admin assumptions and live apply boundaries | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| I | deployment/public beta assumptions and external-account boundaries | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| O | investor/grant/partner claims and revenue/token language | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| M | mobile readiness, app-store/signing/live account boundaries | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| K | contract-backed loan implementation gaps and provider gates | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| L | legal/provider review prep and no legal conclusion boundary | `PASS_LOCAL_ONLY`, `REWORK`, or `BLOCKED_EXTERNAL_REVIEW` |
| Q | intake classification quality | `PASS_LOCAL_ONLY` or `REWORK` |
| S | safety review completeness | `PASS_LOCAL_ONLY` or `REWORK` |

## Hard Reject Conditions

Claude must reject a package until reworked if it includes:

- any secret-looking value or credential;
- live database, live Supabase, live RLS, admin membership, service-role, production SQL, or deployment action;
- real payment, real loan, escrow, repayment routing, stablecoin settlement, token collateral, wallet funding, XPR signature, or token transfer action;
- legal, securities, lending, escrow, custody, AML, tax, privacy, provider, app-store, or public-launch conclusion;
- public website/whitepaper/deck/email/social/grant/investor/outreach publication or edit;
- edits outside the stream's allowed files;
- missing worker report fields.

## Claude Output Format

Claude must return one audit report:

```text
Claude Audit Report:
Date:
Inputs reviewed:
Kimi controller summary reviewed: yes/no
Worker reports reviewed:
Files inspected:

Overall verdict:

Stream verdicts:
- A:
- F:
- N:
- J:
- H:
- I:
- O:
- M:
- K:
- L:
- Q:
- S:

Critical findings:
High findings:
Medium findings:
Low findings:

Locked-file violations:
Secret/live/legal/money/publication violations:
Claim-risk findings:
Smart contract authority findings:
Auth/RLS/admin findings:
Deployment/public beta findings:
Investor/mobile wording findings:

Recommended Codex merge order:
Required rework before merge:
Founder/external/legal/provider blockers:
No-touch confirmation:
```

## Recommended Codex Response To Claude

After Claude returns the audit:

1. Codex reads only the controller summary, worker reports for accepted streams, and Claude audit first.
2. Codex rejects hard-reject packages immediately.
3. Codex integrates only `PASS_LOCAL_ONLY` streams.
4. Codex creates one scoped commit per accepted stream.
5. Codex keeps `BLOCKED_EXTERNAL_REVIEW` items as docs or backlog review items only.

## Founder Boundary

The founder can give this work order to Claude safely because it asks for review only. The founder should not paste secrets, credentials, Magic Link URLs, wallet keys, live Supabase values, private investor/account information, provider credentials, or legal advice into Claude.
