# SmartContractor Mobile Screenshot Redaction Checklist

Purpose: make Android and iOS screenshots, screen recordings, and QA evidence safe before they are shared with testers, partners, grant programs, investors, or public channels.

This checklist is local and demo-safe. It does not approve real payments, loans, escrow, token collateral, wallet funding, Play Console release, App Store release, or production provider onboarding.

## Applies To

- Android screenshots.
- Android screen recordings.
- iOS screenshots.
- iOS screen recordings.
- PWA mobile browser captures.
- Emulator captures.
- Physical phone captures.

## Must Redact Before Sharing

Remove or blur:

- private contact details;
- names, emails, phone numbers, and street addresses;
- wallet addresses and wallet balances;
- payment data, card data, bank data, invoices, and receipts;
- database URLs;
- API keys;
- service-role keys;
- Supabase project secrets;
- browser tabs that show private accounts;
- browser address bars that expose tokens or magic links;
- request bodies with sensitive values;
- homeowner or contractor private documents;
- exact live location details;
- anything that looks like a password, seed phrase, or private key.

## Safe To Keep

These are usually safe if they do not reveal private data:

- generic demo job titles;
- demo-only contractor names;
- demo-only homeowner names;
- redacted `request_id` values;
- app shell layout;
- navigation labels;
- local-only error state;
- generic status labels like `Blocked`, `Review`, `Passed`, or `Failed`.

When using `request_id`, keep only enough characters to match a QA note. Example:

```text
request_id: req_1234...abcd
```

## Mobile Evidence Review Steps

1. Capture the screenshot or screen recording locally.
2. Save it in a local review folder, not in a public folder.
3. Open the file and inspect all four corners first.
4. Inspect the browser/app header.
5. Inspect forms, tables, modals, and toast messages.
6. Redact private contact details, wallet addresses, payment data, database URLs, API keys, and account tabs.
7. Confirm the capture shows no secrets and no real payments.
8. Rename the file with a safe name.
9. Record the artifact in the beta issue log or mobile evidence checklist.

## Safe Filename Pattern

Use:

```text
smartcontractor-mobile-YYYYMMDD-area-status-redacted.png
smartcontractor-mobile-YYYYMMDD-area-status-redacted.mp4
```

Examples:

```text
smartcontractor-mobile-20260512-android-bids-passed-redacted.png
smartcontractor-mobile-20260512-ios-auth-blocked-redacted.png
```

Do not put emails, phone numbers, wallet addresses, customer names, or street addresses in filenames.

## Approval States

| State | Meaning |
|-------|---------|
| Blocked | Contains private data, secret-looking data, or real-money/live-risk evidence |
| Internal Only | Redacted enough for founder/admin review, not outside sharing |
| Approved | Redacted and safe for the intended audience |
| Revoked | Previously approved, but later found unsafe or stale |

## Founder Report Back

Use this safe format:

```text
Mobile screenshot redaction:
Artifact type: screenshot / screen recording
Platform: Android / iOS / PWA
Area: bids / loan / dispute / admin / auth / other
request_id included: Yes / No / Redacted
Private contact details removed: Yes / No
Wallet addresses removed: Yes / No
Payment data removed: Yes / No
Database URLs removed: Yes / No
API keys removed: Yes / No
No secrets visible: Yes / No
No real payments visible: Yes / No
Status: Blocked / Internal Only / Approved / Revoked
```

## Stop Conditions

Do not share the artifact if:

- any secret-looking value is visible;
- any magic link URL or auth token is visible;
- real payment, bank, card, loan, escrow, or wallet funding data is visible;
- private contact details are visible;
- the intended audience is unclear;
- the artifact was not reviewed after redaction.

## Go / No-Go

- Approved: no secrets, no real payments, no private contact details, no wallet/private account data, and intended audience is clear.
- Internal Only: safe enough for founder/admin review, but not enough for external sharing.
- Blocked: anything sensitive or live-risk remains visible.
