# SmartContractor Mobile Release Evidence Bundle

Date: 2026-05-07

Purpose: define the local evidence packet Codex can prepare before founder-present mobile or public beta release decisions. This is documentation and validation only; it does not create native app projects, upload builds, change live Supabase, or enable real-money flows.

## Scope

This bundle is for local review before any external release.

Codex may collect:

- local `npm run check` result;
- PWA installability notes;
- mobile viewport screenshots from a local browser or emulator;
- offline fallback result;
- demo-path notes for jobs, bids, simulated starter loan display, dispute evidence metadata, peer review, admin readiness, and Founder Action Center;
- redacted console or server logs when they contain no tokens, cookies, API keys, passwords, seed phrases, service-role keys, private keys, or raw payment credentials.

Codex must not collect or perform:

- Google Play Console or App Store Connect uploads;
- production signing keys or release keystore material;
- live Supabase migrations, RLS replacement, admin role assignment, or production database edits;
- real payment capture, real loan origination, escrow release, automatic repayment, token collateral lock, liquidation, or legal approval;
- screenshots or logs that expose secrets, session tokens, private customer data, or raw financial account details.

## Evidence Folder

Use a timestamped local folder under:

```text
docs/autonomous-status/mobile-release-evidence-YYYYMMDD-HHMMSS/
```

Allowed files:

- `summary.md`;
- `checks.txt`;
- `viewport-homeowner.png`;
- `viewport-contractor.png`;
- `viewport-admin.png`;
- `offline.png`;
- `redacted-console.txt`;
- `redacted-server-log.txt`.

Do not commit bulky screenshots by default. Commit `summary.md` only unless the founder explicitly asks for images in git. Screenshots can stay local and be regenerated.

## Summary Template

```markdown
# Mobile Release Evidence Summary

Run time: YYYY-MM-DDTHH:mm:ssZ
Automation id: gcsc-hourly-autonomous-builder
Workspace: C:\gcsc

## Local Checks

- `npm run check`: PASS/FAIL
- PWA install shell: PASS/FAIL
- Offline fallback: PASS/FAIL
- Strict/live-risk gates visible: PASS/FAIL

## Demo Path Covered

- Homeowner job flow:
- Contractor bid flow:
- Simulated loan display:
- Dispute evidence metadata:
- Peer review:
- Admin readiness:
- Founder Action Center:

## Blockers

- Founder action:
- External account needed:
- Legal/payment review needed:

## Secret Review

No secrets, session tokens, private keys, seed phrases, service-role keys, raw payment credentials, or private customer data were included.
```

## Pass Criteria

- Full local validation is run or the failure is recorded with exact command output summary.
- Evidence covers homeowner, contractor, admin, offline, and live-risk blocked states.
- Founder-only next step is explicit.
- No live system changes are made.
- No secret-looking values are written to committed files.

## Founder Action Step

After Codex prepares this evidence summary, the founder should review `summary.md`, decide whether the demo is ready for a founder-present deployment setup, and keep all account logins, passwords, signing keys, and production secrets outside chat.
