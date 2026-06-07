# Local Security Audit Validator

Status: LOCAL_VALIDATOR_ONLY

Command: `npm --prefix construction-ai run check:security-audit`

Purpose: provide the Kimi Phase 1 requested local-only security audit gate without exposing secrets, reading untracked `.env` files, using paid services, or calling external providers.

## Scope

- scans tracked files only through `git ls-files`;
- skips binary and large files;
- detects high-risk secret-looking values such as private key blocks, concrete API key formats, JWT-like tokens, and database URLs with embedded passwords;
- reports only file path, line number, and pattern ID;
- uses redacted output and never prints matched secret values.

## Required Boundaries

This validator does not approve live Supabase changes, external account changes, deployment, public website replacement, public whitepaper publication, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO signatures, legal decisions, provider commitments, mobile store actions, production release, or destructive actions.

It specifically does not approve real payments, real loans, escrow release, repayment routing, stablecoin settlement, token collateral, XPR/FIO signatures, or any production action.

It does not scan untracked local secret files. If a developer keeps local credentials in `.env`, `credentials.json`, `token.json`, or private key files, those must stay ignored and must not be pasted into chat.

## Pass Criteria

1. `construction-ai/package.json` includes `check:security-audit`.
2. Root `.gitignore` blocks `.env`, `.env.local`, `.tmp/`, `credentials.json`, `token.json`, and `*.pem`.
3. Validator registry and Kimi Phase 1 action register mention the local security audit boundary.
4. No high-risk secret-looking values are detected in tracked text files.

## Failure Handling

If the validator fails, inspect only the redacted file/path/pattern metadata. Do not paste secret values into chat. Remove the tracked secret, rotate the credential outside Codex if it was real, and rerun the local check.
