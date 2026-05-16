# SmartContractor Founder Auth/Admin Evidence Closeout

Status: INTERNAL_EVIDENCE_CLOSEOUT_ONLY

Purpose: close out the local Founder Auth/Admin evidence package before any live approval request. This closeout checks that the founder's same-browser Magic Link result, selected Auth user confirmation, request ID, evidence age, and no-secret confirmation are current enough to request a separate live decision.

This does not approve live Supabase changes, admin membership insert, strict RLS, production deploy, external accounts, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal/provider decisions, public launch, or destructive actions.

## What This Does Not Approve

This closeout is not approval for:

- live Supabase changes;
- inserting or updating `public.admin_memberships`;
- applying strict RLS;
- production deploy;
- external account changes;
- real payments;
- real loans;
- real escrow;
- repayment routing;
- stablecoin settlement;
- token collateral;
- legal/provider decisions;
- public launch;
- destructive actions.

## Source Documents

Use this source set before closing the evidence package:

- `docs/smartcontractor-founder-auth-admin-activation-prep.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`
- `docs/smartcontractor-founder-auth-admin-live-request-draft.md`
- `docs/smartcontractor-founder-auth-evidence-template.md`
- `docs/smartcontractor-founder-tonight-checklist.md`
- `docs/smartcontractor-founder-admin-activation-runbook.md`

## Closeout States

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| READY_TO_REQUEST_LIVE_APPROVAL | Fresh same-browser evidence is complete, the selected Auth user is founder-confirmed, a request ID is present, and no secret values were recorded | Use the separate live request draft only |
| NOT_READY | Required evidence is missing, incomplete, or cannot be tied to the current local check | Repeat the local Founder Auth Setup flow and update evidence |
| HOLD_FOR_STALE_EVIDENCE | Evidence age is more than 30 minutes or the check time is stale/unclear | Repeat the same-browser check before any request |
| HOLD_FOR_SELECTED_USER_MISMATCH | The selected Auth user is missing, unclear, unexpected, or not founder-controlled | Stop and resolve selected-user evidence |
| HOLD_FOR_SECRET_REDACTION | The evidence contains a Magic Link URL/token, service-role key, password, raw `.env` content, or other secret-looking value | Redact locally and repeat safe evidence capture |
| BLOCKED_FOR_LIVE_ACTION | The next requested step is a live Supabase write, strict RLS apply, deploy, external account change, payment, loan, escrow, repayment routing, stablecoin, token collateral, legal/provider decision, public launch, or destructive action | Stop for explicit founder-controlled live/external/legal/money approval |

## Required Evidence Before Live Approval Request

Record only non-secret values:

```text
same_browser_magic_link_status:
founder_auth_setup_status:
selected_auth_user_confirmed:
selected_user_confirmed_at:
request_id_present:
evidence_age_minutes:
no_secret_values_recorded:
profile_link_status:
active_admin_role_visible:
live_approval_phrase_status:
```

The closeout can reach READY_TO_REQUEST_LIVE_APPROVAL only when:

- `same_browser_magic_link_status` confirms the Magic Link opened in the same browser;
- `founder_auth_setup_status` confirms the Founder Auth Setup check was clicked and returned a current result;
- `selected_auth_user_confirmed` is yes;
- `selected_user_confirmed_at` is current-thread evidence;
- `request_id_present` is yes;
- `evidence_age_minutes` is 30 or less;
- `no_secret_values_recorded` is yes;
- `profile_link_status` is `Profile linked: yes`;
- `active_admin_role_visible` is `Admin roles shown: none`;
- `live_approval_phrase_status` confirms no live approval phrase has been treated as already granted.

## Automatic HOLD Rules

Return NOT_READY or a HOLD state when any of these appear:

- missing selected user confirmation;
- missing fresh evidence;
- missing request ID;
- missing no-secret status;
- `evidence_age_minutes` more than 30;
- old screenshot, forwarded Magic Link tab, copied session URL, prior heartbeat evidence, or another browser profile/device;
- selected Auth user not shown, unclear, unexpected, or not founder-controlled;
- Magic Link URL/token, access token, service-role key, database password, raw `.env`, API key, seed phrase, private key, or other secret-looking value in evidence.

Return BLOCKED_FOR_LIVE_ACTION when the next requested action is to:

- insert or update admin membership;
- apply strict RLS;
- change production deploy settings;
- change external accounts;
- enable or route real payments;
- create real loans;
- release real escrow;
- configure repayment routing;
- settle stablecoin activity;
- lock token collateral;
- make legal/provider commitments;
- launch publicly;
- perform destructive action.

## Founder Copy/Paste Closeout

```text
Founder Auth/Admin evidence closeout
same_browser_magic_link_status: [same browser / not same browser / unknown]
founder_auth_setup_status: [ready / problem / unknown]
selected_auth_user_confirmed: [yes / no / unknown]
selected_user_confirmed_at: [time]
request_id_present: [yes / no]
evidence_age_minutes: [number]
no_secret_values_recorded: [yes / no]
profile_link_status: [Profile linked: yes/no/unknown]
active_admin_role_visible: [Admin roles shown: none/founder/admin/unknown]
live_approval_phrase_status: [not requested / requested separately / bundled or unclear]
closeout_state: [READY_TO_REQUEST_LIVE_APPROVAL / NOT_READY / HOLD_FOR_STALE_EVIDENCE / HOLD_FOR_SELECTED_USER_MISMATCH / HOLD_FOR_SECRET_REDACTION / BLOCKED_FOR_LIVE_ACTION]
```

## Required Checks

Run these before marking the local evidence package closed:

```powershell
npm run check:founder-auth-admin-evidence-closeout
npm run check:founder-auth-admin-activation-prep
npm run check:founder-auth-admin-live-decision-packet
npm run check:founder-auth-admin-live-request-draft
npm run check:founder-auth-evidence
npm run check:real-status-audit
npm run check
```

## Acceptance Check

The evidence package is closed only when `npm run check:founder-auth-admin-evidence-closeout` passes and the closeout state is READY_TO_REQUEST_LIVE_APPROVAL. Any live/admin/RLS/deploy/external/legal/money/public-launch/destructive step still requires a separate founder-controlled approval outside this local closeout.
