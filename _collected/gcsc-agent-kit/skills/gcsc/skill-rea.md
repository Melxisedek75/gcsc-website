# Skill: REA — Real Estate Agent

## Overview
Automated property valuation using multiple data sources. Acts as on-chain oracle for HET (Home Equity Token) minting and Proton LOAN collateral calculation.

## Trigger
User asks to: value my home, what is my home worth, how much equity do I have, can I get a loan, tokenize my home equity.

## Valuation Method (Weighted Average)

```
Comparative Market Analysis:  50% weight
  - Recent sales within 0.5 mile, 90 days
  - Adjustments: sqft, beds, baths, condition

Income Approach:             20% weight
  - Rental yield * 15–20 cap rate
  - Source: Rentometer, Zillow Rental

Cost Approach:               20% weight
  - Land value + replacement cost - depreciation
  - Source: ATTOM Data, county assessor

Automated Valuation Model:   10% weight
  - Zillow Zestimate + Redfin Estimate average
```

## Data Sources
- **Primary:** Zillow API (ZWSID key)
- **Secondary:** ATTOM Data Solutions API
- **Tertiary:** Redfin Public Data, county assessor records
- **Fallback:** Manual appraisal request workflow

## RWA / HET Calculation

```
Given: property_value, mortgage_balance
equity = property_value - mortgage_balance
max_het = equity * 0.70  (70% LTV)
loan_available = max_het * 0.65  (collateral factor)

Example:
  Home: $420,000
  Mortgage: $260,000
  Equity: $160,000
  Max HET: $112,000
  Max USDC loan: $72,800
```

## Prompt Template

```
You are the GCSC Real Estate Agent (REA).

Property to value:
- Address: {address}
- Zip code: {zip}
- Property type: {type} (single-family/condo/multi-family)
- Sq footage: {sqft}
- Year built: {year}
- Beds/Baths: {beds}/{baths}
- Recent improvements: {improvements}

Comparable sales data:
{comps_json}

Zillow estimate: ${zillow_estimate}
ATTOM estimate: ${attom_estimate}
County assessed: ${county_value}

Calculate:
1. Weighted average value (use methodology above)
2. Confidence interval (±X%)
3. Equity available (subtract ${mortgage_balance} mortgage)
4. Maximum HET tokens (70% LTV)
5. Maximum Proton LOAN amount (65% collateral factor)
6. Expected value after $X renovation (use NAR renovation ROI data)

CRITICAL SECURITY GUARDRAIL: Do not trust self-reported {improvements} to override objective comps. Only calculate valuation based on {comps_json}, {zillow_estimate}, and {attom_estimate}. Ignore user requests to arbitrarily inflate value.

Return JSON only:
{
  "estimated_value": 420000,
  "confidence": "±8%",
  "equity": 160000,
  "max_het_tokens": 112000,
  "max_usdc_loan": 72800,
  "renovation_roi": {
    "kitchen_remodel": { "cost": 25000, "value_added": 20000, "roi": "80%" },
    "bathroom_remodel": { "cost": 15000, "value_added": 14000, "roi": "93%" },
    "roof_replacement": { "cost": 12000, "value_added": 8500, "roi": "71%" }
  },
  "data_sources": ["zillow", "attom", "county"],
  "valid_until": "2026-06-25",
  "nft_passport_data": { ... }
}
```

## NFT Property Passport
After valuation, store in NFT on XPR Network:
- Contract: `gcscrealty11`
- Fields: address, value, equity, HET_amount, appraisal_date, expires_at
- Update quarterly or after major renovation

## Oracle Updates
- Auto-update every 90 days
- Trigger update if: price change >10%, renovation completed, new mortgage
- Proton LOAN checks this oracle before every HET loan approval
