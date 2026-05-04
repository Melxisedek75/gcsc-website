# SmartContractor PWA QA Checklist

Date: 2026-05-04

## Purpose

This checklist verifies that SmartContractor can behave like a mobile app before we spend time on Android/iOS wrappers.

## Local URL

```text
http://localhost:3002/smartcontractor.html
```

## Files In Scope

- `construction-ai/public/smartcontractor.html`
- `construction-ai/public/manifest.webmanifest`
- `construction-ai/public/service-worker.js`
- `construction-ai/public/offline.html`

## Desktop Browser Checks

1. Open `http://localhost:3002/smartcontractor.html`.
2. Confirm the status indicator says the backend is online.
3. Open browser DevTools.
4. Go to `Application`.
5. Confirm `Manifest` is detected.
6. Confirm `Service Workers` shows an active worker.
7. Confirm no manifest icon errors block installability.

## Mobile Width Checks

Use browser responsive mode and test:

- 390 x 844, common iPhone width;
- 412 x 915, common Android width;
- 360 x 740, smaller Android width.

Required result:

- no horizontal scrolling;
- tab buttons fit without text overlap;
- cards do not overflow;
- form inputs remain readable;
- primary buttons are easy to tap;
- result panels do not cover other content.

## PWA Install Checks

Android / Chrome:

1. Open the site.
2. Open browser menu.
3. Look for `Install app` or `Add to Home screen`.
4. Install.
5. Launch from home screen.
6. Confirm it opens in standalone mode.

iPhone / Safari:

1. Open the site.
2. Tap share icon.
3. Tap `Add to Home Screen`.
4. Launch from home screen.
5. Confirm top browser bar is reduced or absent.

## Offline Checks

1. Open SmartContractor online first.
2. Wait a few seconds for the service worker to install.
3. Turn off network in DevTools or disconnect internet.
4. Refresh the page.
5. Expected: app shell or offline page loads.
6. API-backed data may fail while offline; this is acceptable for MVP.

## MVP Flow Checks On Phone Width

Run the 5-minute demo path:

1. Owner creates job.
2. Contractor selects job and submits bid.
3. Contractor requests loan.
4. Contractor records milestone repayment.
5. User creates payment intent.
6. Homeowner opens dispute.
7. User adds evidence.
8. Peer reviewer submits review.

Required result:

- every button is tappable;
- no field is hidden under sticky header;
- JSON/result output is readable enough for demo;
- no viewport zoom is required.

## Known MVP Limits

- Offline mode does not support live backend actions.
- Real push notifications are not enabled.
- Camera/photo upload is simulated with URL/metadata.
- Auth and strict RLS are drafted but not live.
- Android/iOS wrappers are not created yet.

## Pass Criteria

PWA polish can be marked `DONE` when:

- manifest exists and has app identity;
- service worker caches app shell;
- offline page exists;
- mobile viewport checks pass manually;
- demo flow is usable at phone width.
