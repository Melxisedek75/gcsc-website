# GCSC Overnight Launch Status

Date: 2026-05-03

## Domain

Domain: `xprnet.org`

DNS status:

- `xprnet.org` points to GitHub Pages IP addresses.
- `www.xprnet.org` points to `Melxisedek75.github.io`.
- Namecheap mail records were not touched.

## Website

Working:

```text
http://xprnet.org
```

HTTPS may still need GitHub SSL finalization:

```text
https://xprnet.org
```

This is normal after DNS changes. GitHub Pages can take minutes or hours to issue the SSL certificate.

## GitHub

Repository:

```text
https://github.com/Melxisedek75/gcsc-website
```

Important commits:

```text
824de8f Configure GitHub Pages custom domain
3286d2d Add SmartContractor Supabase backend
1f000f3 Add SmartContractor MVP workspace
```

## Supabase

Project:

```text
smartcontractor-gcsc
```

Project ref:

```text
uhixuyurxsrxayhghjzm
```

Public URL:

```text
https://uhixuyurxsrxayhghjzm.supabase.co
```

Tables created:

- profiles
- contractors
- homeowners
- jobs
- bids
- bid_unlocks
- contractor_loans
- loan_repayments
- ratings

Backend folder:

```text
C:\gcsc\construction-ai
```

Local MVP page when backend is running:

```text
http://localhost:3002/smartcontractor.html
```

## Verified Tonight

- Supabase migration applied successfully.
- Supabase security advisor is clean.
- Missing foreign-key indexes were added.
- Full API workflow passed:
  homeowner profile -> homeowner -> job -> contractor profile -> contractor -> bid -> contractor loan.
- Backend health check passed:

```text
GET http://localhost:3002/api/health
```

- MVP page check passed:

```text
GET http://localhost:3002/smartcontractor.html
HTTP 200
```

## What To Check In The Morning

1. Open:

```text
http://xprnet.org
```

2. Then open:

```text
https://xprnet.org
```

3. If HTTPS still does not work, open GitHub Pages settings:

```text
https://github.com/Melxisedek75/gcsc-website/settings/pages
```

4. Check:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
Custom domain: xprnet.org
```

5. If `Enforce HTTPS` is active, turn it on.

## Important

Do not delete or change Namecheap mail records:

- MX
- TXT
- SPF
- DKIM
- Private Email

They are required for:

```text
gcsc@xprnet.org
```
