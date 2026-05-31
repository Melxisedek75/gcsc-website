import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = [
  {
    path: 'whitepaper-v1-3-draft.html',
    requiredIds: ['summary', 'problem', 'product', 'milestones', 'capital', 'partners', 'web3', 'fio', 'metal', 'value-mirror', 'gates'],
    requiredPhrases: [
      'Internal Draft - Not Approved For Publication',
      'Construction Trust Infrastructure',
      'GCSC does not reject Web3 finance',
      'FIO Protocol Roadmap',
      'does not claim partnership',
      'does not currently originate, approve, fund, service, or guarantee loans',
      'Live escrow custody must be handled by a licensed escrow partner',
    ],
  },
  {
    path: 'index-v1-3-draft.html',
    requiredIds: ['mission', 'products', 'technology', 'review'],
    requiredPhrases: [
      'Construction Trust Infrastructure',
      'partner-reviewed working-capital readiness',
      'Research path, not live finance',
      'Reputation as <span class="gradient-text">underwriting data</span>',
      'does not approve public publication',
    ],
  },
];

const blockedPatterns = [
  /risk-free/i,
  /SEC-approved/i,
  /regulator-approved/i,
  /passive income/i,
  /instant loan approval/i,
  /automatic escrow release/i,
  /blockchain escrow releases payment/i,
  /reputation into a financial asset/i,
  /reputation as collateral/i,
  /public NFT marketplace is approved/i,
  /Metallicus partnership is approved/i,
];

const errors = [];

for (const file of files) {
  const fullPath = path.join(root, file.path);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing draft HTML: ${file.path}`);
    continue;
  }

  const html = fs.readFileSync(fullPath, 'utf8');

  if (!html.includes('<meta name="viewport"')) {
    errors.push(`${file.path} missing viewport meta tag`);
  }

  for (const id of file.requiredIds) {
    if (!html.includes(`id="${id}"`)) {
      errors.push(`${file.path} missing section id: ${id}`);
    }
  }

  for (const phrase of file.requiredPhrases) {
    if (!html.includes(phrase)) {
      errors.push(`${file.path} missing required phrase: ${phrase}`);
    }
  }

  for (const pattern of blockedPatterns) {
    if (pattern.test(html)) {
      errors.push(`${file.path} contains blocked draft wording: ${pattern.source}`);
    }
  }

  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const anchor of anchors) {
    if (!html.includes(`id="${anchor}"`)) {
      errors.push(`${file.path} has broken in-page anchor: #${anchor}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft HTML smoke validation passed');
