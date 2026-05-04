# SmartContractor MVP Demo Script

Date: 2026-05-03

Purpose: run one clean 5-minute demo of the SmartContractor MVP for founder review, grant applications, partners, or early testers.

Local demo URL:

```text
http://localhost:3002/smartcontractor.html
```

## Before The Demo

1. Open the local demo URL.
2. Look at the top status line.
3. Continue only if it says the backend is online.
4. Do not enter real passwords, bank details, SSNs, or private wallet keys.

## Demo Story

SmartContractor protects homeowners from unsafe upfront deposits while giving serious contractors a way to start work using platform-backed credit, milestone payments, verification, dispute review, and multi-rail payments.

## 5-Minute Walkthrough

### 1. Homeowner Creates A Job

1. Stay on the `Owner` tab.
2. Keep the demo email and name.
3. Keep the example job: `Kitchen remodel`.
4. Click `Create Job`.
5. Confirm that the result box shows a new job ID.
6. Confirm the job appears in the `Open Jobs` list on the right.

What to say:

```text
The homeowner posts a real construction job with budget and location. This creates the first object that contractors can bid on.
```

### 2. Contractor Submits A Bid

1. Click the job card or `Select Job`.
2. The app should move to the `Contractor` tab.
3. Keep the demo contractor information.
4. Keep the bid amount at `9800`.
5. Click `Submit Bid`.
6. Confirm that the result box shows a contractor ID and bid ID.

What to say:

```text
The contractor is attached to a verified business profile and submits a bid against a specific homeowner job.
```

### 3. Contractor Requests Starter Loan

1. Open the `Loan` tab.
2. Confirm Contractor ID and Job ID are already filled.
3. Click `Calculate Loan Score`.
4. Confirm the score cards update.
5. Click `Request Loan`.
6. Confirm that a loan ID appears in the result box.

What to say:

```text
Instead of asking the homeowner for risky upfront money, the contractor can request a starter working-capital loan based on business identity, license, repayment history, disputes, and future token collateral.
```

### 4. Milestone Payment Repays The Loan

1. Stay on the `Loan` tab.
2. Keep `Milestone Payment` selected.
3. Keep amount at `1000`.
4. Click `Record Repayment`.
5. Confirm that outstanding loan balance decreases.

What to say:

```text
When the homeowner approves progress, the platform can route milestone payments toward loan repayment first, then release the remainder to the contractor.
```

### 5. Payment Router Shows Multiple Rails

1. Open the `Pay` tab.
2. Click `Refresh Providers`.
3. Select `XPR Network`, `Metal Pay Connect`, or another provider from the provider cards.
4. Keep amount at `50`.
5. Click `Create Payment Intent`.
6. Confirm that payment intent instructions appear.

What to say:

```text
Payments are routed through one API. The MVP already models XPR/WebAuth, Metal Pay, Stripe, PayPal, Coinbase Commerce, and BTCPay as replaceable payment rails.
```

### 6. Homeowner Opens A Dispute

1. Open the `Dispute` tab.
2. Confirm Job ID and Contractor ID are filled.
3. Keep `Homeowner` selected.
4. Click `Open Dispute`.
5. Confirm that a dispute ID appears.

What to say:

```text
If work quality is disputed, payment does not have to rely only on emotion or private argument. The issue becomes a trackable case.
```

### 7. Evidence And Peer Review

1. Keep the dispute ID filled.
2. Click `Add Evidence`.
3. Confirm evidence is recorded.
4. Keep the peer finding and quality score.
5. Click `Submit Peer Review`.
6. Confirm that a peer review ID and reward amount appear.

What to say:

```text
Other contractors can review photo, video, or in-person evidence. Their useful review can earn token rewards, improve reputation, and later support larger credit limits.
```

## Strong Closing

```text
This MVP proves the main SmartContractor loop: homeowner job, contractor bid, starter credit, milestone repayment, payment routing, dispute evidence, and peer review rewards. The next production step is real authentication, stricter RLS policies, provider credentials, and legal review before any real lending.
```

## Demo Safety Notes

- This is an MVP demo, not a legal loan product yet.
- Starter loans require legal review before production.
- Payment provider keys must stay server-side only.
- Supabase RLS must be tightened before public launch.
- Never test with real personal documents until the verification provider and privacy policy are ready.
