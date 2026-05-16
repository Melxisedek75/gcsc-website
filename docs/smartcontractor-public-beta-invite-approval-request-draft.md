# SmartContractor Public Beta Invite Approval Request Draft

Status: INTERNAL_INVITE_APPROVAL_REQUEST_DRAFT_ONLY

This draft is not approval to send invites, not approval to share a public beta URL, not approval to deploy production, not approval to change external accounts, and not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Give Codex and the founder one safe message draft for the narrow moment after the public beta invite evidence closeout reaches READY_TO_REQUEST_INVITE_APPROVAL.

This keeps the first demo-only invite approval request separate, current, evidence-based, limited to the reviewed tester-code list, and blocked from public launch, deploy/account changes, legal/provider commitments, and money actions.

## Required Current Evidence

Do not use this draft unless all current-thread evidence is present:

- READY_TO_REQUEST_INVITE_APPROVAL;
- deploy_closeout_state;
- public_beta_url_status;
- url_smoke_checked_at;
- deployed_commit_confirmed;
- request_id_sample_present;
- security_headers_checked;
- auth_redirect_status;
- no_real_money_banner_visible;
- disabled_payment_loan_actions_confirmed;
- support_owner_confirmed;
- rollback_owner_confirmed;
- tester_batch_scope;
- tester_code_only_confirmed;
- redaction_status;
- founder_invite_release_phrase_status.

If the public beta URL changes, expires, rotates, points to a different commit, loses request-id/security/no-real-money evidence, or shows live-risk capability, the request draft returns to NOT_READY and the founder must repeat URL smoke evidence intake.

## Request Draft Template

Use this exact request format when current evidence is fresh and complete:

```text
Public beta invite approval request draft

Current local evidence status: READY_TO_REQUEST_INVITE_APPROVAL
Deploy closeout state: [state]
Public beta URL status: [label/status only]
URL smoke checked at: [time]
Deployed commit confirmed: yes/no
Request ID sample present: yes/no
Security headers checked: yes/no
Auth redirect status checked: yes/no
No-real-money banner visible: yes/no
Payment and loan actions disabled: yes/no
Support owner confirmed: yes/no
Rollback owner confirmed: yes/no
Tester batch scope: [3-5 tester codes only]
Tester-code-only confirmed: yes/no
Redaction status: [redacted/internal-only]

To approve only the reviewed first demo-only public beta invite batch, reply with this exact standalone phrase:

I approve releasing the first demo-only public beta invite batch using the reviewed URL evidence and tester-code list only.

This approval is only for releasing the reviewed first demo-only invite batch through a founder-controlled channel using tester codes and redacted support intake.

This approval is not approval for public launch, public announcement, DNS changes, Vercel or GitHub Pages changes, Supabase Auth redirect changes, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, app store release, legal/provider commitments, adding unreviewed testers, or destructive action.
```

Do not bundle this request with any other live, external, legal, money, deploy, DNS, Supabase, payment, loan, escrow, stablecoin, token collateral, provider, app store, public launch, or destructive action request.

## Allowed Codex Scope After Approval

After the exact approval phrase appears as a clean standalone founder message and current evidence still matches the reviewed closeout:

- Codex may mark the invite approval as recorded in local docs;
- Codex may update local backlog/context/audit records with the approval-request status;
- Codex may prepare a redacted founder-controlled send checklist that uses tester codes only;
- Codex may run local validators and read-only checks;
- Codex may commit and push scoped local files after checks pass.

Codex must stop before sending any invite, sharing any public URL, opening external dashboards, entering secrets, changing deploy settings, changing Supabase redirects, enabling provider integrations, or touching any live money feature.

## Blocked Scope

Public URL sharing stays separate.

Sending actual tester invites stays founder-controlled.

Production deploy and external account settings stay separate.

Supabase Auth redirects, live SQL, strict RLS, and founder admin activation stay separate.

Payment/provider setup stays separate.

Real loan, escrow, repayment routing, stablecoin settlement, and token collateral stay separate.

Legal/provider commitments stay separate.

Public launch stays separate.

Any approval message that includes extra scope becomes BLOCKED_FOR_EXTERNAL_ACTION and must be split into separate founder-controlled decisions.

## Recheck Before Use

Before using the request draft, re-run or confirm:

- invite evidence closeout is still READY_TO_REQUEST_INVITE_APPROVAL;
- deployed commit still matches the reviewed evidence;
- request ID, security headers, Auth redirect, no-real-money banner, and disabled payment/loan actions are still confirmed;
- first tester batch remains 3-5 tester codes only;
- support owner and rollback owner are known;
- tracked docs contain no real URL, tester names, tester emails, phone numbers, addresses, account IDs, wallet data, cookies, Authorization headers, Magic Link URLs, raw response bodies, private screenshots, payment data, or secret-looking values;
- no public launch, payment, loan, escrow, stablecoin, token collateral, legal, provider, deploy, external account, app store, or destructive scope is included.

## Required Checks

```powershell
npm run check:public-beta-invite-approval-request-draft
npm run check:public-beta-invite-evidence-closeout
npm run check:public-beta-invite-release-decision-packet
npm run check:public-beta-url-smoke-evidence-intake
npm run check:public-beta-deploy-to-invite-handoff
npm run check:public-beta-first-cohort-launch-packet
npm run check:real-status-audit
npm run check
```
