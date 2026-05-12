# SmartContractor Founder Auth Troubleshooting

Date: 2026-05-11 PT

Purpose: simple troubleshooting map for the Founder Auth Setup flow. Use this when Magic Link, local backend, profile linking, or admin readiness does not work on the first try.

## Safety Rules

Do not paste into chat:

- passwords;
- Supabase access tokens;
- database URLs;
- service-role keys;
- API keys;
- seed phrases or private keys.

Do not activate tonight:

- strict RLS;
- real loans;
- real escrow;
- real payment release;
- token collateral.

## Symptom: Browser Cannot Open SmartContractor

What you see:

- browser says site cannot be reached;
- `localhost refused to connect`;
- blank page on `localhost`.

What to do:

1. Open PowerShell.
2. Run:

```powershell
cd C:\gcsc\construction-ai
npm start
```

3. Keep that PowerShell window open.
4. In browser open:

```text
http://localhost:3001/smartcontractor.html
```

5. If the app was started on another port, try:

```text
http://localhost:3002/smartcontractor.html
```

If it still fails, tell Codex the visible PowerShell error text only. Do not paste `.env` values.

## Symptom: Port Already In Use

What you see:

- `EADDRINUSE`;
- `address already in use`;
- server says another process already uses port `3001`.

What to do:

1. Do not close random Windows processes.
2. Tell Codex:

```text
Port problem: EADDRINUSE on port 3001
```

3. Codex can then check which local process owns the port and choose the safest next step.

## Symptom: Magic Link Email Does Not Arrive

What you see:

- no email in inbox after clicking `Send Magic Link`.

What to do:

1. Wait 2 minutes.
2. Check Spam / Junk / Promotions.
3. Make sure the email address was typed correctly.
4. Click `Send Magic Link` only a few times, not repeatedly.
5. If the app shows `429`, wait 15 minutes because the rate limit is protecting the project.

Report back:

```text
Magic Link problem: email not received
```

## Symptom: Magic Link Opens Wrong Browser Or Wrong Page

What you see:

- link opens another browser;
- link opens a blank tab;
- SmartContractor does not show authenticated status.

What to do:

1. Copy the Magic Link from email without sending it to Codex.
2. Paste it into the same browser where `localhost` SmartContractor is open.
3. Return to SmartContractor Admin tab.
4. Click `Check Founder Auth Setup`.

Never paste the Magic Link into chat.

## Symptom: Session Is Invalid Or Expired

What you see:

- `Invalid or expired session`;
- authenticated: no;
- token expired.

What to do:

1. Click `Send Magic Link` again.
2. Use the newest email only.
3. Open it in the same browser.
4. Click `Check Founder Auth Setup` again.

Report back:

```text
Founder Auth Setup problem: invalid or expired session
```

## Symptom: Authenticated Yes, Profile Linked No

What you see:

- authenticated: yes;
- profile linked: no.

Meaning:

The Magic Link worked, but the Supabase Auth user is not connected to one SmartContractor profile yet.

What to do:

1. Do not manually edit database rows.
2. Tell Codex:

```text
Founder Auth Setup problem: authenticated yes, profile linked no
```

Codex will then choose the safest profile-linking step and ask before any live change.

## Symptom: Admin Roles None

What you see:

- authenticated: yes;
- profile linked: yes;
- admin roles: none.

Meaning:

This is expected before founder admin activation. It means the account is ready for review.

What to do:

Tell Codex:

```text
Founder Auth Setup ready
```

Codex must then perform read-only verification first and ask explicit approval before adding founder role to `admin_memberships`.

## Symptom: Supabase Not Configured

What you see:

- `Supabase Auth client is not configured`;
- `Supabase is not configured`;
- auth endpoints return `503`.

What to do:

1. Do not paste `.env` or secret values into chat.
2. Tell Codex the exact visible error text.
3. Codex can check whether required env variable names exist without reading secret values aloud.

## Symptom: Founder Auth Setup Button Does Nothing

What to do:

1. Refresh the browser page.
2. Open Admin tab again.
3. Click `Check Session`.
4. Click `Check Founder Auth Setup`.
5. If still broken, tell Codex:

```text
Founder Auth Setup problem: button does nothing
```

Codex can then run local backend smoke tests and browser checks.

## Success Message

When the flow is successful, write exactly:

```text
Founder Auth Setup ready
```

That tells Codex to move to read-only verification and founder admin activation review.
