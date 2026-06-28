# SmartContractor — Email Templates

Source-of-truth copy for transactional emails. Drop into the backend mailer with the same variable names. Brand voice matches `docs/site-copy.md`. Last updated 2026-06-28.

---

## Brand defaults (apply to every email)

- **From:** `SmartContractor <hello@gcsc.io>`
- **Reply-To:** `support@gcsc.io`
- **Primary color:** `#5B6CFF`
- **Accent color:** `#00C896`
- **Container width:** max 600px
- **Footer:** `— Team SmartContractor` + `gcsc.io | privacy@gcsc.io`

Every HTML template should set `<meta name="color-scheme" content="light dark">` for dark-mode mail clients.

---

## 1. Verify code (sign-up)

**Trigger:** user submits `/api/auth/register` with `verificationMode: 'required'`.
**Variables:** `{{code}}` (6 digits), `{{ttlMinutes}}` (number).

### Subject
`Your SmartContractor code: {{code}}`

### Preheader
`Enter this code to finish signing up. Expires in {{ttlMinutes}} minutes.`

### Plain text
```
Your SmartContractor verification code is:

   {{code}}

Enter it in the app to finish signing up. The code expires in {{ttlMinutes}} minutes.

If you did not request this, ignore this email. No account will be created.

— Team SmartContractor
gcsc.io
```

### HTML body
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:24px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#18181b;">
      <tr><td>
        <h1 style="margin:0 0 8px;font-size:20px;color:#5B6CFF;">SmartContractor</h1>
        <p style="margin:0 0 24px;color:#71717a;font-size:14px;">Verify your email to finish signing up.</p>
        <div style="background:#f4f4f5;border-radius:8px;padding:24px;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;color:#18181b;">{{code}}</div>
        <p style="margin:24px 0 0;color:#71717a;font-size:14px;">Enter this code in the app. It expires in {{ttlMinutes}} minutes.</p>
        <p style="margin:16px 0 0;color:#a1a1aa;font-size:13px;">If you did not request this, ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0 16px;">
        <p style="margin:0;color:#a1a1aa;font-size:12px;">— Team SmartContractor · <a href="https://gcsc.io" style="color:#5B6CFF;text-decoration:none;">gcsc.io</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
```

---

## 2. Welcome (post sign-up)

**Trigger:** account created and verified.
**Variables:** `{{name}}` (display name), `{{role}}` ('homeowner' or 'contractor').

### Subject (homeowner)
`Welcome to SmartContractor, {{name}}`

### Subject (contractor)
`{{name}}, your contractor account is live`

### Preheader (both)
`Connect your WebAuth wallet to post a job or buy a Lead Token.`

### Plain text (homeowner)
```
Welcome to SmartContractor, {{name}}.

You're set up as a homeowner. Here is what to do next:

  1. Connect your WebAuth wallet (one biometric tap).
  2. Post a job — describe the scope, set a budget.
  3. Verified contractors will bid within 24 hours.
  4. You approve each milestone before money releases.

Every payment is on-chain on XPR Network. You stay in control.

Open the app: https://gcsc.io/app

Questions? Reply to this email.

— Team SmartContractor
gcsc.io
```

### Plain text (contractor)
```
{{name}}, your contractor account is live.

Next steps:

  1. Connect your WebAuth wallet (one biometric tap).
  2. Verify your license and insurance in Profile.
  3. Buy a Lead Token (50 XPR) to unlock a verified homeowner job.
  4. Submit a bid. Win, complete milestones, get paid on-chain.

No platform commission on the work itself.

Open the app: https://gcsc.io/app

Questions? Reply to this email.

— Team SmartContractor
gcsc.io
```

### HTML body (homeowner)
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:24px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#18181b;">
      <tr><td>
        <h1 style="margin:0 0 8px;font-size:24px;color:#18181b;">Welcome, {{name}}.</h1>
        <p style="margin:0 0 24px;color:#71717a;font-size:15px;">You're set up as a homeowner.</p>

        <ol style="margin:0;padding-left:20px;color:#18181b;font-size:15px;line-height:1.7;">
          <li>Connect your WebAuth wallet (one biometric tap).</li>
          <li>Post a job — describe the scope, set a budget.</li>
          <li>Verified contractors bid within 24 hours.</li>
          <li>Approve each milestone before money releases.</li>
        </ol>

        <p style="margin:24px 0;color:#71717a;font-size:14px;">Every payment is on-chain on XPR Network. You stay in control.</p>

        <a href="https://gcsc.io/app" style="display:inline-block;background:#5B6CFF;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Open the app</a>

        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0 16px;">
        <p style="margin:0;color:#a1a1aa;font-size:12px;">— Team SmartContractor · <a href="https://gcsc.io" style="color:#5B6CFF;text-decoration:none;">gcsc.io</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
```

(The contractor HTML body is identical except for the headline and ordered list — adapt the steps from the contractor plain-text version.)

---

## 3. Bid received (homeowner)

**Trigger:** contractor submits a bid on a homeowner's job.
**Variables:** `{{name}}` (homeowner), `{{contractor}}`, `{{jobTitle}}`, `{{bidAmount}}`, `{{timeline}}`, `{{jobLink}}`.

### Subject
`New bid on "{{jobTitle}}" — {{bidAmount}}`

### Preheader
`{{contractor}} proposed {{bidAmount}} · {{timeline}}.`

### Plain text
```
{{name}},

A verified contractor just bid on your job.

  Job:        {{jobTitle}}
  Contractor: {{contractor}}
  Bid:        {{bidAmount}}
  Timeline:   {{timeline}}

Review the bid and accept it (or wait for more) in the app.

  {{jobLink}}

— Team SmartContractor
gcsc.io
```

### HTML body
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:24px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#18181b;">
      <tr><td>
        <p style="margin:0 0 8px;color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1px;">NEW BID</p>
        <h1 style="margin:0 0 24px;font-size:22px;color:#18181b;">{{contractor}} bid on your job.</h1>

        <table cellpadding="0" cellspacing="0" style="width:100%;background:#f4f4f5;border-radius:8px;padding:16px;font-size:14px;color:#18181b;">
          <tr><td style="padding:6px 0;color:#71717a;">Job</td><td style="padding:6px 0;font-weight:600;">{{jobTitle}}</td></tr>
          <tr><td style="padding:6px 0;color:#71717a;">Bid</td><td style="padding:6px 0;font-weight:600;">{{bidAmount}}</td></tr>
          <tr><td style="padding:6px 0;color:#71717a;">Timeline</td><td style="padding:6px 0;font-weight:600;">{{timeline}}</td></tr>
        </table>

        <p style="margin:24px 0;color:#71717a;font-size:14px;">Review and accept (or wait for more bids) in the app.</p>

        <a href="{{jobLink}}" style="display:inline-block;background:#5B6CFF;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View bid</a>

        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0 16px;">
        <p style="margin:0;color:#a1a1aa;font-size:12px;">— Team SmartContractor · <a href="https://gcsc.io" style="color:#5B6CFF;text-decoration:none;">gcsc.io</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
```

---

## 4. Bid accepted (contractor)

**Trigger:** homeowner accepts a contractor's bid.
**Variables:** `{{name}}` (contractor), `{{jobTitle}}`, `{{bidAmount}}`, `{{jobLink}}`.

### Subject
`Your bid was accepted — {{jobTitle}}`

### Preheader
`{{bidAmount}} project starts now. Open the app to begin the first milestone.`

### Plain text
```
{{name}},

Your bid was accepted.

  Job:    {{jobTitle}}
  Amount: {{bidAmount}}

The escrow is open. Start the first milestone and upload proof when you're ready for approval.

  {{jobLink}}

— Team SmartContractor
gcsc.io
```

### HTML body
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:24px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#18181b;">
      <tr><td>
        <p style="margin:0 0 8px;color:#00C896;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">✓ ACCEPTED</p>
        <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">Your bid was accepted.</h1>
        <p style="margin:0 0 24px;color:#71717a;font-size:15px;">{{jobTitle}} — {{bidAmount}}</p>
        <p style="margin:0 0 24px;color:#18181b;font-size:14px;">Escrow is open. Start the first milestone, upload proof when ready for approval.</p>
        <a href="{{jobLink}}" style="display:inline-block;background:#5B6CFF;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Open job</a>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0 16px;">
        <p style="margin:0;color:#a1a1aa;font-size:12px;">— Team SmartContractor · <a href="https://gcsc.io" style="color:#5B6CFF;text-decoration:none;">gcsc.io</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
```

---

## 5. Milestone approved & funds released (contractor)

**Trigger:** homeowner approves a milestone, on-chain transfer confirmed.
**Variables:** `{{name}}`, `{{milestone}}`, `{{jobTitle}}`, `{{amount}}`, `{{txHash}}`, `{{explorerUrl}}`.

### Subject
`Paid: {{amount}} for {{milestone}}`

### Preheader
`{{jobTitle}} milestone approved · tx {{txHash}}`

### Plain text
```
{{name}},

The homeowner approved your milestone. Funds released on-chain.

  Job:       {{jobTitle}}
  Milestone: {{milestone}}
  Amount:    {{amount}}
  TX:        {{txHash}}

View on XPR explorer:
  {{explorerUrl}}

— Team SmartContractor
gcsc.io
```

### HTML body
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:24px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#18181b;">
      <tr><td>
        <p style="margin:0 0 8px;color:#00C896;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">✓ PAID</p>
        <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">{{amount}} released to your wallet.</h1>
        <p style="margin:0 0 24px;color:#71717a;font-size:15px;">{{jobTitle}} — {{milestone}}</p>
        <a href="{{explorerUrl}}" style="display:inline-block;background:#5B6CFF;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View on XPR explorer</a>
        <p style="margin:24px 0 0;color:#a1a1aa;font-size:12px;font-family:monospace;">tx {{txHash}}</p>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0 16px;">
        <p style="margin:0;color:#a1a1aa;font-size:12px;">— Team SmartContractor · <a href="https://gcsc.io" style="color:#5B6CFF;text-decoration:none;">gcsc.io</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
```

---

## 6. New message (both roles)

**Trigger:** counterparty sends a message (rate-limited to one email per thread per 10 min).
**Variables:** `{{name}}`, `{{counterparty}}`, `{{snippet}}` (first 120 chars), `{{threadLink}}`.

### Subject
`{{counterparty}}: {{snippet}}`

### Preheader
`New message in your SmartContractor chat.`

### Plain text
```
{{name}},

{{counterparty}} sent you a message:

  "{{snippet}}"

Reply in the app:
  {{threadLink}}

To stop these emails, change notification settings in the app.

— Team SmartContractor
```

### HTML body
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:24px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#18181b;">
      <tr><td>
        <h2 style="margin:0 0 8px;font-size:18px;color:#18181b;">{{counterparty}}</h2>
        <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #5B6CFF;background:#f4f4f5;border-radius:0 8px 8px 0;color:#18181b;font-size:15px;">{{snippet}}</blockquote>
        <a href="{{threadLink}}" style="display:inline-block;background:#5B6CFF;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reply</a>
        <p style="margin:24px 0 0;color:#a1a1aa;font-size:12px;">To stop these emails, change notification settings in the app.</p>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0 16px;">
        <p style="margin:0;color:#a1a1aa;font-size:12px;">— Team SmartContractor</p>
      </td></tr>
    </table>
  </td></tr>
</table>
```

---

## 7. Dispute opened (counterparty + ops)

**Trigger:** user submits a dispute via `app/dispute.tsx`.
**Variables:** `{{name}}` (counterparty), `{{raisedBy}}`, `{{refLabel}}`, `{{reason}}`, `{{description}}`, `{{disputeLink}}`.

### Subject (counterparty)
`Dispute opened on "{{refLabel}}"`

### Preheader
`AI compliance will review proof and chat history. Response in 48 hours.`

### Plain text (counterparty)
```
{{name}},

A dispute was opened by the {{raisedBy}}:

  Item:        {{refLabel}}
  Reason:      {{reason}}
  Description: {{description}}

What happens next:
  1. AI compliance reviews milestone proof and chat history.
  2. You'll receive a non-binding recommendation within 48 hours.
  3. If either party rejects, human mediation kicks in.
  4. Mediator decision is final and executed by the smart contract.

You may respond in the app at any time:
  {{disputeLink}}

— Team SmartContractor
gcsc.io
```

(Ops email goes to `disputes@gcsc.io` with the same body plus a "View in admin" link.)

---

## Implementation notes

- Use `nodemailer` or any SMTP-compatible transport. Postmark and Resend are good defaults for transactional volume.
- All `{{variable}}` placeholders are plain Mustache-style.
- DO escape user-supplied variables like `snippet`, `description`, `counterparty`, `name` before injecting into HTML to prevent XSS.
- DO NOT HTML-escape platform-generated URLs (`jobLink`, `explorerUrl`, `threadLink`, `disputeLink`) — they are safe.
- Subject lines should never exceed 65 characters total (after variable substitution at upper bound).
- Always include a one-click unsubscribe header (`List-Unsubscribe: <mailto:unsubscribe@gcsc.io>`) on marketing-class emails; transactional emails are exempt.
- Test all templates against [Mail Tester](https://www.mail-tester.com) and [Litmus](https://litmus.com) before going live.
