# GCSC Whitepaper v1.3 Draft CSS QA Checklist

Status: internal CSS QA checklist. This does not approve public publication or public website replacement.

## Purpose

This checklist keeps the local v1.3 draft HTML readable on desktop and mobile before screenshot QA is available.

## Files Covered

- `whitepaper-v1-3-draft.css`
- `whitepaper-v1-3-draft.html`
- `index-v1-3-draft.html`

Public files remain out of scope:

- `whitepaper.html`
- `index.html`

## Static CSS Checks

| Check | Required State |
|---|---|
| Global box sizing | `box-sizing: border-box` present |
| Horizontal overflow guard | `overflow-x: hidden` present on `body` |
| Long text wrapping | `overflow-wrap: anywhere` present for text elements |
| Responsive layout | `@media (max-width: 920px)` stacks the whitepaper layout |
| Small mobile layout | `@media (max-width: 520px)` keeps buttons and main content constrained |
| Table safety | mobile table overflow uses `overflow-x: auto` |
| Asset safety | no dependency on missing `css/` or `assets/gcsc-logo.png` files |
| Mojibake guard | no `mojibake` patterns in draft HTML or CSS |

## Manual Visual Checks Still Required

- desktop screenshot of `whitepaper-v1-3-draft.html`;
- mobile screenshot of `whitepaper-v1-3-draft.html`;
- desktop screenshot of `index-v1-3-draft.html`;
- mobile screenshot of `index-v1-3-draft.html`;
- no overlap in hero/status areas;
- no horizontal overflow at phone width;
- publication gate remains NO-GO.

## Stop Boundary

This checklist does not approve:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing PDF, deck, social, email, or website updates;
- provider outreach;
- legal conclusions;
- live payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, or XPR actions.
