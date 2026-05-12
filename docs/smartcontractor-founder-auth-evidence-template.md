# SmartContractor Founder Auth Evidence Template

Date: 2026-05-11 PT

Purpose: safe evidence template for recording the Founder Auth Setup result before any live founder/admin activation. This file is for non-secret status only.

## Safety Boundary

Do not record:

- Supabase access token;
- Magic Link URL;
- service-role key;
- database password;
- API key;
- seed phrase or private key;
- full raw `.env` content.

Do not use this template as approval for:

- strict RLS;
- real loans;
- real escrow;
- real payment release;
- token collateral.

## Session Evidence

Fill this after the founder completes Magic Link in the browser.

```text
Founder Auth Setup date:
Local URL used:
Browser used:
Backend port:
Magic Link email received: yes/no
Magic Link opened in same browser: yes/no
Check Founder Auth Setup clicked: yes/no
Authenticated: yes/no
Profile linked: yes/no
Admin roles shown:
Visible non-secret error text:
Founder confirmation message:
```

Allowed founder confirmation messages:

```text
Founder Auth Setup ready
Founder Auth Setup problem: [visible non-secret error text]
```

## Expected Ready State Before Admin Activation

The ready state should look like this:

```text
Authenticated: yes
Profile linked: yes
Admin roles shown: none
```

Meaning:

- Magic Link worked;
- browser session is real;
- one SmartContractor profile is linked to the Supabase Auth user;
- founder role has not been activated yet;
- next step is read-only verification before any live insert.

## If Profile Is Not Linked

Record:

```text
Authenticated: yes
Profile linked: no
Admin roles shown: none
```

Next action:

- do not manually edit database rows;
- do not apply strict RLS;
- ask Codex to prepare the safest profile-linking step.

## If Admin Role Already Exists

Record:

```text
Authenticated: yes
Profile linked: yes
Admin roles shown: founder
```

Next action:

- do not insert another founder row;
- run read-only admin membership check;
- run strict admin smoke tests only after confirming the row belongs to the intended founder user.

## Codex Read-Only Verification Notes

After founder says `Founder Auth Setup ready`, Codex should verify without exposing secrets:

```text
Auth user count for founder email:
Linked profile count:
Active founder membership count:
Admin membership status:
Read-only verification result:
```

## Acceptance Check

This evidence is acceptable when:

- it includes only non-secret status;
- it records whether Magic Link worked;
- it records whether the profile is linked;
- it records whether admin roles are still none before activation;
- it does not approve real loans, escrow, payments, token collateral, or strict RLS.
