# SmartContractor Payment Router

Date: 2026-05-03

## Goal

SmartContractor should let a homeowner, contractor, or platform admin choose the best payment rail without rebuilding the product each time.

Supported MVP rails:

| Provider | Use In GCSC | Status |
|---------|-------------|--------|
| Metal Pay Connect | Metallicus/XPR-friendly crypto onboarding and payments | API keys needed |
| XPR Network / WebAuth | Native GCSC, GCST, XPR payments | MVP-ready |
| Stripe | Credit cards, debit cards, ACH, Apple Pay, Google Pay, stablecoin where approved | API keys needed |
| PayPal Pay with Crypto | PayPal checkout and crypto-to-fiat merchant settlement where approved | API keys needed |
| Coinbase Commerce | USDC/onchain checkout | API keys needed |
| BTCPay Server | Self-hosted Bitcoin/Lightning payments | Server and API key needed |

## Rule

GCSC must never collect raw credit card numbers directly.

Use hosted checkout pages, provider SDKs, or payment intents. Store only:

- provider;
- payment intent ID;
- checkout/reference ID;
- amount;
- purpose;
- status;
- transaction hash or provider receipt.

## Metal Pay Connect Integration

Metal Pay Connect uses a backend-generated HMAC signature.

Environment variables:

```text
METAL_PAY_CONNECT_API_KEY=
METAL_PAY_CONNECT_SECRET_KEY=
METAL_PAY_CONNECT_ENV=dev
```

Backend endpoint:

```http
GET /api/payments/metal-pay/signature
```

Returns:

```json
{
  "apiKey": "public-api-key",
  "signature": "hmac-signature",
  "nonce": "nonce",
  "environment": "dev",
  "networks": ["xpr-network"]
}
```

Security:

- secret key stays on backend only;
- frontend receives only `apiKey`, `nonce`, `signature`, environment, and allowed networks;
- production requires Metallicus/Metal Pay API approval and keys.

## Generic Payment Intent

```http
POST /api/payments/intents
```

Body:

```json
{
  "provider": "metal_pay",
  "amount_usd": 50,
  "currency": "USD",
  "purpose": "lead_token",
  "payer_role": "contractor",
  "reference_id": "JOB_OR_LOAN_ID"
}
```

Provider values:

```text
metal_pay
xpr_network
stripe
paypal_crypto
coinbase_commerce
btcpay
```

## Payment Purposes

Initial GCSC purposes:

- `lead_token`;
- `membership`;
- `loan_repayment`;
- `milestone_payment`;
- `dispute_review_reward`;
- `token_collateral`.

## Provider Strategy

1. Keep XPR/WebAuth as the native ecosystem payment method.
2. Add Metal Pay Connect as the Metallicus-friendly crypto/onramp rail.
3. Add Stripe when business onboarding is ready for credit/debit/ACH.
4. Add PayPal Pay with Crypto for mainstream global crypto checkout if approved.
5. Add BTCPay only if we want self-hosted Bitcoin/Lightning and can maintain the server.
6. Keep all providers behind `/api/payments/intents` so future providers can be added without changing SmartContractor workflows.
