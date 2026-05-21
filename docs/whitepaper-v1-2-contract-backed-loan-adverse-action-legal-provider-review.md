# GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Legal/Provider Review

Status: LOCAL_ONLY_REVIEW_PACKET. This is not legal advice, not a credit decision, not provider approval, not lender approval, not approval to send denial notices, not approval for credit-bureau reporting, not approval to launch real contractor loans, and not approval for payment, escrow, repayment routing, stablecoin settlement, or token collateral action.

## Purpose

This packet turns the adverse-action and denial-notice boundary from `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md` into a legal/provider review checklist. It keeps held, reduced, declined, and more-info-needed working-capital outcomes in local draft status until founder, legal/provider, finance-provider, compliance, and technical reviewers define the allowed wording, reason-code taxonomy, notice process, appeal/correction workflow, and retention rules.

## Local-Only Review Packet

Review only these non-secret local references:

- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md`

Do not send passwords, private keys, API keys, service-role keys, wallet seed phrases, bank data, credit reports, raw applicant personal data, provider credentials, live logs, Magic Link URLs, database connection strings, or unredacted screenshots.

## Required Review Questions

| Area | Question |
| --- | --- |
| Contractor-facing status | What contractor-facing language is allowed for held, reduced, declined, or more-info-needed working-capital requests? |
| Principal reasons | Which principal-reason categories are legally/provider acceptable? Which categories must be removed or rewritten? |
| Data sources | Which data sources may be referenced in local draft notices? Which sources require additional consent, licensing, or provider handling? |
| Notice operations | What notice timing, delivery, retention, appeal, correction, and dispute processes are required before live use? |
| Reviewer authority | Which reviewer roles can approve notice templates, reason codes, escalation paths, and applicant-facing copy? |
| AI boundary | How should AI risk signals be described so they remain support-only and never become automated-only denial authority? |
| Redaction | What must stay redacted before reviewer sharing, founder packets, provider packets, public wording, or investor material? |

## Required Draft Trace Fields

Every local adverse-action review record must preserve:

- `adverse_action_event_id`
- `applicant_profile_id`
- `request_id`
- `decision_type`
- `principal_reasons`
- `data_sources_used`
- `notice_template_version`
- `delivery_status`
- `appeal_window_status`
- `reviewer_role`
- `redaction_status`
- `source_file`
- `source_commit`
- `latest_check_run`
- `HOLD_FOR_ADVERSE_ACTION_REVIEW`
- `LOCAL_DRAFT_ADVERSE_ACTION_TRACE`
- `BLOCKED_FOR_LIVE_LOAN`

## Blocked Live Actions

This packet must not be used to:

- send notices;
- deny real credit;
- approve real credit;
- report to credit bureaus;
- create legal determinations;
- create provider obligations;
- route repayments;
- activate escrow;
- settle stablecoins;
- lock token collateral;
- launch real lending.

## Founder/Legal/Provider Decisions Required Before Live Use

Founder/legal/provider decisions required before live use:

- notice template ownership;
- reason-code taxonomy;
- reviewer escalation path;
- retention period;
- appeal/correction workflow;
- allowed contractor-facing status language;
- whether any data source requires additional consent, licensing, or provider handling;
- whether public whitepaper, website, deck, grant, investor, or partner wording must mention adverse-action boundaries at all.

Until those decisions are written and reviewed, every adverse-action artifact stays local-only, no secrets, no live notice, no live denial, no provider commitment, and no public claim.

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff`
- `npm run check`
