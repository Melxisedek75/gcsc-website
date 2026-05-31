import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const requiredDocs = [
  'docs/whitepaper-v1-3-public-website-risk-scan.md',
  'docs/whitepaper-v1-3-public-html-replacement-plan.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'docs/whitepaper-v1-3-archive-and-rollback-plan.md',
  'docs/whitepaper-v1-3-public-draft.md',
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
]);

const oldPublicFiles = ['whitepaper.html', 'index.html'];
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
