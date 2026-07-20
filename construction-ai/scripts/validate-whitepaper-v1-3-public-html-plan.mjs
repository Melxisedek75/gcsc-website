import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const requiredDocs = [
  'docs/whitepaper-v1-3-public-website-risk-scan.md',
  'docs/whitepaper-v1-3-public-html-replacement-plan.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'docs/whitepaper-v1-3-archive-and-rollback-plan.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'docs/whitepaper-v1-3-publication-decision-packet.md',
  'docs/whitepaper-v1-3-archive-execution-checklist.md',
  'docs/whitepaper-v1-3-homepage-wording-plan.md',
  'docs/whitepaper-v1-3-visual-review-checklist.md',
  'docs/whitepaper-v1-3-founder-approval-to-review-packet.md',
  'docs/whitepaper-v1-3-autonomous-continuation-rule.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-local-browser-review-notes.md',
  'docs/whitepaper-v1-3-publication-evidence-template.md',
];

const requiredScripts = [
  'construction-ai/scripts/validate-whitepaper-v1-3-draft-html-smoke.mjs',
];

const requiredDocPhrases = new Map([
  ['docs/whitepaper-v1-3-public-website-risk-scan.md', [
    'Highest-Risk `whitepaper.html` Findings',
    'Highest-Risk `index.html` Findings',
    'Stop Boundary',
  ]],
  ['docs/whitepaper-v1-3-public-html-replacement-plan.md', [
    'Current state remains NO-GO',
    'whitepaper-v1-3-draft.html',
    'GO Condition',
  ]],
  ['docs/whitepaper-v1-3-publication-decision-packet.md', [
    'Recommended current decision: **NO-GO FOR PUBLIC REPLACEMENT**',
    'Decision Options',
  ]],
  ['docs/whitepaper-v1-3-homepage-wording-plan.md', [
    'Proposed Homepage Direction',
    'Create `index-v1-3-draft.html` as a local draft only',
  ]],
  ['docs/whitepaper-v1-3-founder-approval-to-review-packet.md', [
    'V1_3_LOCAL_REVIEW_APPROVED',
    'This phrase does not approve public publication or live integrations',
  ]],
  ['docs/whitepaper-v1-3-autonomous-continuation-rule.md', [
    'After every completed safe v1.3 task',
    'Codex must stop before',
  ]],
  ['docs/whitepaper-v1-3-local-browser-review-notes.md', [
    'Headless browser availability',
    'Browser Screenshot QA Still Required',
    'Public file replacement',
  ]],
  ['docs/whitepaper-v1-3-publication-evidence-template.md', [
    'Current decision | NO-GO',
    'Required Evidence Before GO',
    'Explicit Non-Approval',
  ]],
]);

const oldPublicFiles = ['whitepaper.html', 'index.html'];
const draftHtml = 'whitepaper-v1-3-draft.html';
const homepageDraft = 'index-v1-3-draft.html';
const riskyPatterns = [
  /investment/i,
  /staking/i,
  /yield/i,
  /AI-managed/i,
  /NFT/i,
  /token appreciation/i,
  /passive income/i,
  /risk-free/i,
  /SEC-approved/i,
  /regulator-approved/i,
];

const errors = [];
const warnings = [];

for (const file of requiredDocs) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required doc: ${file}`);
    continue;
  }

  const text = fs.readFileSync(fullPath, 'utf8');
  for (const phrase of requiredDocPhrases.get(file) ?? []) {
    if (!text.includes(phrase)) {
      errors.push(`Missing phrase in ${file}: ${phrase}`);
    }
  }
}

for (const file of requiredScripts) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`Missing required script: ${file}`);
  }
}

for (const file of oldPublicFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing public file for scan: ${file}`);
    continue;
  }

  const text = fs.readFileSync(fullPath, 'utf8');
  const matches = riskyPatterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
  if (matches.length > 0) {
    warnings.push(`${file}: legacy risky wording still present (${matches.join(', ')})`);
  }
}

const draftPath = path.join(root, draftHtml);
if (!fs.existsSync(draftPath)) {
  warnings.push(`${draftHtml}: not created yet`);
} else {
  const draft = fs.readFileSync(draftPath, 'utf8');
  const requiredDraftPhrases = [
    'Internal Draft - Not Approved For Publication',
    'Construction Trust Infrastructure',
    'GCSC does not reject Web3 finance',
    'FIO Protocol Roadmap',
    'XPR, WebAuth, Metal, And Metallicus Research Path',
    'does not claim partnership',
    'does not currently originate, approve, fund, service, or guarantee loans',
    'Live escrow custody must be handled by a licensed escrow partner',
    'publication approval',
  ];

  for (const phrase of requiredDraftPhrases) {
    if (!draft.includes(phrase)) {
      errors.push(`${draftHtml} missing required boundary phrase: ${phrase}`);
    }
  }

  const blockedDraftPatterns = [
    /guaranteed return/i,
    /risk-free/i,
    /SEC-approved/i,
    /regulator-approved/i,
    /passive income/i,
    /instant loan approval/i,
    /automatic escrow release/i,
  ];

  for (const pattern of blockedDraftPatterns) {
    if (pattern.test(draft)) {
      errors.push(`${draftHtml} contains blocked public wording: ${pattern.source}`);
    }
  }
}

const homepageDraftPath = path.join(root, homepageDraft);
if (!fs.existsSync(homepageDraftPath)) {
  warnings.push(`${homepageDraft}: not created yet`);
} else {
  const homepage = fs.readFileSync(homepageDraftPath, 'utf8');
  const requiredHomepagePhrases = [
    'Construction Trust Infrastructure',
    'partner-reviewed working-capital readiness',
    'future regulated layer',
    'Provider-reviewed only',
    'Research path, not live finance',
    'Publication Gate',
    'NO-GO',
    // Canonical wording per validate-homepage-v1-3-static-draft.mjs: the draft
    // deliberately says "readiness data", not finance-flavored "underwriting data".
    'Reputation as <span class="gradient-text">readiness data</span>',
    'does not approve public publication',
  ];

  for (const phrase of requiredHomepagePhrases) {
    if (!homepage.includes(phrase)) {
      errors.push(`${homepageDraft} missing required boundary phrase: ${phrase}`);
    }
  }

  const blockedHomepagePatterns = [
    /reputation into a financial asset/i,
    /blockchain escrow releases payment/i,
    /reputation as collateral/i,
    /all on blockchain/i,
    /smart escrow/i,
    /live escrow/i,
    /instant loan/i,
    /passive income/i,
    /investment token/i,
  ];

  for (const pattern of blockedHomepagePatterns) {
    if (pattern.test(homepage)) {
      errors.push(`${homepageDraft} contains blocked homepage wording: ${pattern.source}`);
    }
  }
}

const gate = fs.readFileSync(path.join(root, 'docs/whitepaper-v1-3-publication-gate.md'), 'utf8');
if (!gate.includes('Default state: NO-GO')) {
  errors.push('Publication gate must remain default NO-GO while legacy public wording is present.');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

for (const warning of warnings) {
  console.warn(`WARNING: ${warning}`);
}

console.log('whitepaper v1.3 public html replacement plan validation passed');
