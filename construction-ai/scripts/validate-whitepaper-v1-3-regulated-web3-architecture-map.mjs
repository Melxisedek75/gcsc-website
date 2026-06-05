import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  architectureMap: path.join(root, 'docs', 'whitepaper-v1-3-regulated-web3-architecture-map.md'),
  fioBrief: path.join(root, 'docs', 'whitepaper-v1-3-fio-protocol-integration-brief.md'),
  metallicusBrief: path.join(root, 'docs', 'whitepaper-v1-3-metallicus-xpr-integration-brief.md'),
  providerHandoffMap: path.join(root, 'docs', 'whitepaper-v1-3-provider-handoff-packet-map.md'),
  productMap: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-product-integration-map.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];

function readRequired(label, file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required ${label}: ${file}`);
    return '';
  }

  return fs.readFileSync(file, 'utf8');
}

function requirePhrase(text, phrase, label) {
  if (!text.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const architectureMap = readRequired('regulated Web3 architecture map', files.architectureMap);
const fioBrief = readRequired('FIO Protocol integration brief', files.fioBrief);
const metallicusBrief = readRequired('Metallicus/XPR integration brief', files.metallicusBrief);
const providerHandoffMap = readRequired('provider handoff packet map', files.providerHandoffMap);
const productMap = readRequired('SmartContractor product integration map', files.productMap);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal architecture map. Research-only.',
  'No partnership, endorsement, integration, account setup, provider approval, public publication, FIO registration, XPR signature, wallet connection, stablecoin settlement, token collateral, loan, escrow, custody, or money movement is approved.',
  'Current No-Real-Money Construction Workflow',
  'Licensed Partner Services',
  'Future Regulated Web3 Identity And Record Rails',
  'Future Regulated Digital Construction Records',
  'Data Flow',
  'Blocked Live Actions',
  'Implementation Sequence',
  'Marketing Boundary',
  'Project records',
  'Working-capital readiness',
  'Payment intent records',
  'Escrow provider',
  'Licensed lender',
  'Payment processor',
  'KYC/KYB/AML provider',
  'Custodian',
  'XPR Network',
  'WebAuth',
  'FIO Protocol',
  'Metal Blockchain / Metallicus ecosystem',
  'Metal X / LOAN Protocol',
  'Stable-value settlement rails',
  'Provider handoff packet',
  'FIO payment requests',
  'XPR signatures involving value',
  'stablecoin settlement',
  'token collateral',
  'loan origination, approval, funding, or servicing',
  'money movement',
  'public publication of regulated claims',
  'Build non-value Web3 proof designs',
  'Written decisions outside autonomous Codex',
  'future regulated Web3 construction records',
  'GCSC has Metallicus approval.',
  'GCSC uses FIO for live payment requests.',
]) {
  requirePhrase(architectureMap, phrase, 'regulated Web3 architecture map');
}

for (const phrase of [
  'future Web3 usability layer',
  'human-readable handles, payment requests, and encrypted metadata',
  'It is not:',
  'Safe Pilot Order',
  'Blocked Until Review',
  'registering a public GCSC FIO domain',
  'sending real payment requests',
  'tying FIO requests to real escrow, loans, stablecoin settlement, or token collateral',
]) {
  requirePhrase(fioBrief, phrase, 'FIO Protocol integration brief');
}

for (const phrase of [
  'does not claim partnership, approval, integration, or live production use',
  'candidate infrastructure path',
  'XPR Network',
  'WebAuth',
  'Metal Blockchain',
  'Metal X',
  'LOAN Protocol',
  'Safe Technical Path',
  'Blocked Until Founder/Legal/Provider Approval',
  'Do not claim Metallicus approval without written permission',
]) {
  requirePhrase(metallicusBrief, phrase, 'Metallicus/XPR integration brief');
}

for (const phrase of [
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
  'Web3 audit proof packet',
  'FIO UX review packet',
  'XPR/WebAuth/Metallicus technical review packet',
]) {
  requirePhrase(providerHandoffMap, phrase, 'provider handoff packet map');
}

for (const phrase of [
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
  'FIO Protocol UX',
  'XPR/WebAuth/Metallicus path',
  'no FIO registration, XPR signature, stablecoin settlement, token collateral lock',
]) {
  requirePhrase(productMap, phrase, 'SmartContractor product integration map');
}

for (const pattern of [
  /\bpartnership approved\b/i,
  /\bprovider response approved\b/i,
  /\blegal\/provider review complete\b/i,
  /\blive integration approved\b/i,
  /\bpublic publication approved\b/i,
  /\bFIO registration approved\b/i,
  /\bXPR signature approved\b/i,
  /\bstablecoin settlement approved\b/i,
  /\btoken collateral approved\b/i,
  /\bescrow custody approved\b/i,
  /\bloan origination approved\b/i,
]) {
  rejectPattern(architectureMap, pattern, 'regulated Web3 architecture map');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('GCSC Whitepaper v1.3 Regulated Web3 Architecture Map') ||
    content.includes('Current No-Real-Money Construction Workflow') ||
    content.includes('Layer 2: Future Regulated Web3 Identity And Record Rails')
  ) {
    errors.push(`${label} appears to contain internal regulated Web3 architecture map content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 regulated Web3 architecture map validation passed');
