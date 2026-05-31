import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const requiredFiles = [
  'docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md',
  'docs/whitepaper-v1-3-founder-review-packet.md',
  'docs/whitepaper-v1-3-claim-risk-register.md',
  'docs/whitepaper-v1-3-public-outline.md',
  'docs/whitepaper-v1-3-integration-roadmap.md',
  'docs/whitepaper-v1-3-provider-shortlist.md',
  'docs/whitepaper-v1-3-fio-protocol-integration-brief.md',
  'docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md',
  'docs/whitepaper-v1-3-public-website-update-plan.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'docs/whitepaper-v1-3-archive-and-rollback-plan.md',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
];

const hybridDraftPhrases = [
  'Construction Trust Infrastructure',
  'GCSC does not reject Web3 finance',
  'GCSC phases Web3 finance responsibly',
  'FIO Protocol',
  'XPR Network',
  'Metallicus',
  'licensed partner',
  'not approved for public publication',
];

const fileSpecificPhrases = new Map([
  ['docs/whitepaper-v1-3-founder-review-packet.md', ['Founder Review Questions', 'Construction Trust Infrastructure first']],
  ['docs/whitepaper-v1-3-claim-risk-register.md', ['Highest-Risk Claims', 'Blocked Public Vocabulary', 'Publication Rule']],
  ['docs/whitepaper-v1-3-public-outline.md', ['Public Positioning', 'Explicit Public Boundaries']],
  ['docs/whitepaper-v1-3-integration-roadmap.md', ['Phase 0', 'Phase 5', 'Never Skip']],
  ['docs/whitepaper-v1-3-provider-shortlist.md', ['research-only shortlist', 'Next Research Actions']],
  ['docs/whitepaper-v1-3-fio-protocol-integration-brief.md', ['FIO Protocol', 'Technical Research Questions', 'Blocked Until Review']],
  ['docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md', ['Metallicus', 'XPR Network', 'Blocked Until Founder/Legal/Provider Approval']],
  ['docs/whitepaper-v1-3-public-website-update-plan.md', ['High-Risk Old Wording To Replace', 'Required Before Editing Public Files']],
  ['docs/whitepaper-v1-3-public-draft.md', ['internal public-safe draft', 'not live', 'provider-reviewed', 'review-required']],
  ['docs/whitepaper-v1-3-publication-gate.md', ['Default state: NO-GO', 'Blocked Public Actions']],
  ['docs/whitepaper-v1-3-archive-and-rollback-plan.md', ['Archive Strategy', 'Rollback Strategy', 'Blocked Until GO']],
  ['docs/whitepaper-v1-3-legal-provider-review-packet.md', ['Core Legal Position To Review', 'Review Area 5: FIO Protocol', 'Review Area 6: Metallicus, XPR, Metal, WebAuth', 'Required Review Outputs']],
]);

const unsafeStandaloneClaims = [
  'SEC-approved',
  'regulator-approved',
  'guaranteed return',
  'risk-free',
  'instant loan approval',
  'insured profit',
];

const errors = [];

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${file}`);
    continue;
  }

  const text = fs.readFileSync(fullPath, 'utf8');

  if (file === 'docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md') {
    for (const phrase of hybridDraftPhrases) {
      if (!text.includes(phrase)) {
        errors.push(`Missing phrase in ${file}: ${phrase}`);
      }
    }
  }

  const required = fileSpecificPhrases.get(file) ?? [];
  for (const phrase of required) {
    if (!text.includes(phrase)) {
      errors.push(`Missing phrase in ${file}: ${phrase}`);
    }
  }

  for (const claim of unsafeStandaloneClaims) {
    if (text.includes(claim) && !text.includes('Blocked') && !text.includes('Risky') && !text.includes('risk register')) {
      errors.push(`Unsafe claim appears outside risk context in ${file}: ${claim}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 plan validation passed');
