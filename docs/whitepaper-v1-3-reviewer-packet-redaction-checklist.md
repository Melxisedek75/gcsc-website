# GCSC Whitepaper v1.3 Reviewer Packet Redaction Checklist

Status: internal redaction checklist. This does not approve outreach, public publication, legal conclusions, provider commitments, live accounts, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

Use this checklist before any v1.3 packet is sent to an attorney, compliance reviewer, escrow provider, lending provider, KYC/KYB/AML provider, FIO technical reviewer, XPR/WebAuth/Metal/Metallicus technical reviewer, investor, grant reviewer, or website/publication reviewer.

The goal is to keep reviewer packets useful while removing secrets, private data, misleading approval language, and live-risk instructions.

## Redaction Required Before Reviewer Packet Leaves Local Repo

| Data Type | Required Action | Notes |
|---|---|---|
| API keys, service-role keys, private keys, passwords | REMOVE | never include in reviewer packets |
| seed phrases, recovery phrases, wallet private material | REMOVE | never include in any packet |
| bank account numbers, routing numbers, cards, payment credentials | REMOVE | use placeholder labels only |
| customer names, homeowner addresses, contractor personal data | REMOVE_OR_ANONYMIZE | use synthetic examples |
| live Supabase URLs with privileged context | REMOVE_OR_LIMIT | public anon URLs only if explicitly intended |
| production wallet addresses or signer accounts | REMOVE_OR_ANONYMIZE | use `TO_FILL` or test placeholders |
| confidential provider pricing or contracts | REMOVE | summarize only after founder approval |
| internal founder phone/email not meant for sharing | REMOVE | use approved contact only |
| unreviewed legal conclusions | SOFTEN | mark as question for reviewer |
| unapproved partner references | SOFTEN | use candidate infrastructure wording |

## Allowed Packet Content

- internal v1.3 positioning docs;
- public-safe draft wording;
- claim-risk register excerpts;
- provider question register sections;
- architecture diagrams that do not contain secrets;
- synthetic examples;
- screenshots without private data;
- explicit NO-GO and no-live-action boundaries.

## Blocked Packet Content

- secrets, private keys, passwords, recovery phrases, API keys, or service-role keys;
- real payment credentials or bank details;
- live customer private data;
- real homeowner addresses unless founder/legal explicitly approves;
- live contractor financial data unless founder/legal/provider explicitly approves;
- unapproved logos or partnership claims;
- statements that legal review has completion status;
- statements that public publication has approval status;
- instructions to register FIO, sign XPR actions, activate stablecoin settlement, originate loans, hold escrow, or lock token collateral.

## Reviewer-Specific Redaction Rules

| Reviewer Type | Must Include | Must Redact Or Avoid |
|---|---|---|
| attorney / compliance | legal questions, blocked claims, state-by-state question list | legal conclusions framed as final |
| escrow provider | escrow-ready record flow, dispute state questions | any claim that GCSC controls funds |
| lending / working capital provider | underwriting data fields, repayment waterfall questions | any claim that GCSC approves or originates loans |
| KYC / KYB / AML provider | role map, consent, retention, deletion questions | private user records or production credentials |
| FIO technical reviewer | optional UX-layer questions, privacy questions | FIO registration or real payment request instructions |
| XPR / WebAuth / Metal / Metallicus technical reviewer | candidate infrastructure questions, testnet-only constraints | partnership, production settlement, token collateral, or value-bearing signature claims |
| website/publication reviewer | public-safe wording and visual QA evidence | internal-only decision notes, private reviewer notes, or live-action instructions |

## Redaction Review Record

Before sending a packet, fill this table locally:

| Field | Value |
|---|---|
| packet name | TO_FILL |
| reviewer type | TO_FILL |
| prepared date | TO_FILL |
| redaction reviewer | TO_FILL |
| secrets removed? | NO by default |
| private data removed? | NO by default |
| live-risk instructions removed? | NO by default |
| public publication approved? | NO by default |
| outreach approved by founder? | NO by default |

## Required Final Checks

- search packet for `password`, `secret`, `private key`, `service role`, `seed phrase`, `recovery phrase`;
- search packet for `approved-partnership`, `publication-approved`, `legal-review-complete`, `live-action-approved`;
- confirm examples are synthetic or anonymized;
- confirm public files are not changed;
- confirm reviewer packet includes the Stop Boundary.

## Stop Boundary

This checklist does not approve:

- sending any reviewer packet;
- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF;
- changing public routing;
- provider outreach;
- legal/provider conclusions;
- partnership claims;
- live payments, loans, escrow, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or production Web3 actions.
