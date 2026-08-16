# GCSC API Provenance Matrix

Status: `BASELINE_DRAFT`
Date: 2026-08-15

This matrix records observed API ownership. It does not authorize deployment,
public publication, payment movement, or blockchain signing.

## Service boundaries

| Consumer or service | Observed source | API namespace | Provenance decision |
| --- | --- | --- | --- |
| Web marketplace | `C:\gcsc-store\src\services\api.ts` | `/api/auth`, `/api/admin`, `/api/projects`, `/api/contractors`, `/api/bids`, `/api/escrow`, `/api/milestones`, `/api/wallet`, `/api/financing`, `/api/token` | Targets Smart Contractor backend; token routes have observed gaps |
| Mobile marketplace | `C:\gcsc\mobile\smartcontractor\lib` | `/api/auth`, legacy `/api/verify`, `/api/projects`, `/api/payment` | Targets Smart Contractor backend; verification still mixes current and legacy auth routes, and several domains remain local fixtures |
| Marketplace backend | `C:\Users\rivne\gcsc-v3\v3\pure-server.js` | `/api/auth`, `/api/projects`, `/api/bids`, `/api/escrow`, `/api/milestones`, `/api/payment`, `/api/wallet`, `/api/financing` | Canonical marketplace backend candidate |
| Construction AI demo/admin | `C:\gcsc\construction-ai\server.js` | `/api/smartcontractor`, `/api/admin`, `/api/chat`, `/api/verification`, `/api/payments` | Separate local demo, readiness, and evidence service |

## Partially verified marketplace compatibility

The following inspected web/mobile route families are implemented in
`v3/pure-server.js` and therefore have an observed provider. This is static
route-family evidence, not an end-to-end compatibility result:

- registration, login, verification, profile, documents, and compliance;
- wallet challenge, wallet binding, and wallet profile lookup;
- project create/list/detail and contractor public profile;
- bid submit/list/accept;
- escrow read, milestone create/submit/approve/release/dispute;
- milestone chain transaction record and verification;
- financing precheck records;
- XPR testnet payment challenge paths for lead token and job posting.

Mobile verification currently calls legacy `POST /api/verify`; a matching
provider route was observed in `v3/pure-server.js`, but end-to-end
compatibility is unverified. Migrate it to the canonical
`/api/auth/verification/check` contract before the legacy auth surface is
archived.

## Verified API gaps or mismatches

| Consumer route | Provider state | Required action |
| --- | --- | --- |
| `POST /api/escrow/create` in `gcsc-store` | No matching route observed in `pure-server.js`; escrow is created during accepted-bid workflow | Remove unused client method or define one reviewed ownership path |
| `/api/token/info` | No matching route observed | Mark unsupported or provide a separately owned read-only token service |
| `/api/token/price-history` | No matching route observed | Mark unsupported; no fabricated market data |
| `/api/token/staking/calculate` | No matching route observed | Keep local calculator clearly labelled or implement reviewed API |
| `/api/wallet/balance/:account` | No matching route observed | Keep chain read separate from authenticated marketplace API |
| Mobile bids, leads, reviews, disputes, preferences | Source comments identify local fixtures or local storage | Keep explicit demo labels until backend contract exists |
| `construction-ai` `/api/smartcontractor/*` | Different resource model and namespace | Do not treat as drop-in replacement for marketplace backend |

## Deployment evidence

The Smart Contractor repository root `Dockerfile`, `railway.json`, and
`render.yaml` all select `v3/pure-server.js`. The nested `v3/Dockerfile`,
`v3/render.yaml`, and `v3/package.json` still select `v3/server.js`; these are
stale/conflicting configuration surfaces and must not be used as deployment
truth.

## Decision consequence

Frontend and mobile integration work must target the typed contract of
`v3/pure-server.js`. `construction-ai` remains a separate bounded service and
must not own authentication, marketplace escrow state, or payment settlement
until an explicit architecture change is independently reviewed.
