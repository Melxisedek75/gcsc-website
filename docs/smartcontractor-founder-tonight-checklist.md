# SmartContractor Founder Tonight Checklist

Date: 2026-05-11 PT

Purpose: one short evening checklist for the founder to move SmartContractor from local demo toward public beta without touching real money, real loans, live escrow, token collateral, or legal decisions.

## Goal For Tonight

Finish the first real founder identity path:

1. local backend is running;
2. founder can open SmartContractor MVP;
3. founder receives Magic Link;
4. browser session is authenticated;
5. founder profile is linked or the missing link is clearly identified;
6. founder/admin activation is ready for explicit approval.

## Do Not Do Tonight

Do not:

- paste passwords, database URLs, Supabase access tokens, service-role keys, seed phrases, private keys, or API keys into chat;
- apply strict RLS yet;
- approve real loans;
- release real escrow or payments;
- activate token collateral;
- change Namecheap, payment providers, or production accounts unless Codex gives a step-by-step instruction and founder is present.

## Step 1: Start Local Backend

1. Open PowerShell.
2. Run:

```powershell
cd C:\gcsc\construction-ai
npm start
```

3. Keep that PowerShell window open.
4. If it says the port is already in use, stop and tell Codex exactly what PowerShell shows.

## Step 2: Open SmartContractor MVP

1. Open browser.
2. Go to:

```text
http://localhost:3001/smartcontractor.html
```

3. If this does not open, try:

```text
http://localhost:3002/smartcontractor.html
```

4. Do not continue until the SmartContractor page is visible.

## Step 3: Send Magic Link

1. Open the `Admin` tab.
2. Find the login / auth email field.
3. Type the founder email.
4. Click `Send Magic Link`.
5. Open the founder email inbox.
6. Find the newest Supabase / SmartContractor login email.
7. Click the Magic Link.

Important: open the link in the same browser where SmartContractor is running.

## Step 4: Check Founder Auth Setup

1. Return to SmartContractor.
2. Open `Admin`.
3. Click `Check Founder Auth Setup`.
4. Expected result before live activation:
   - authenticated: yes;
   - profile linked: yes, or a clear missing-profile message;
   - admin roles: none.

## Step 5: Report Back To Codex

Write only one of these messages:

```text
Founder Auth Setup ready
```

or:

```text
Founder Auth Setup problem: [copy the visible error text, but no secrets]
```

Do not paste access tokens or secret values.

## Step 6: What Codex Can Do After That

After `Founder Auth Setup ready`, Codex can:

1. perform read-only verification;
2. show the exact selected `auth_user_id` for founder review without exposing secrets;
3. ask for explicit approval before live `admin_memberships` activation;
4. run strict admin smoke tests after activation;
5. prepare strict RLS apply review.

## Acceptance Check

Tonight is successful when:

- backend starts locally;
- SmartContractor opens in browser;
- Magic Link works;
- Founder Auth Setup returns authenticated session status;
- no secret was pasted into chat;
- no real loan, no real payment, live escrow, token collateral, or strict RLS was activated prematurely.
