import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  map: path.join(root, 'docs', 'whitepaper-v1-3-licensed-partner-architecture-map.md'),
  providerQuestions: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  providerHandoff: path.join(root, 'docs', 'whitepaper-v1-3-provider-handoff-packet-map.md'),
  legalProviderPacket: path.join(root, 'docs', 'whitepaper-v1-3-legal-provider-review-packet.md'),
  productMap: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-product-integration-map.md'),
  regulatedWeb3Map: path.join(root, 'docs', 'whitepaper-v1-3-regulated-web3-architecture-map.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
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

const map = readRequired('licensed partner architecture map', files.map);
const providerQuestions = readRequired('provider question register', files.providerQuestions);
const providerHandoff = readRequired('provider handoff packet map', files.providerHandoff);
const legalProviderPacket = readRequired('legal/provider review packet', files.legalProviderPacket);
const productMap = readRequired('SmartContractor product integration map', files.productMap);
const regulatedWeb3Map = readRequired('regulated Web3 architecture map', files.regulatedWeb3Map);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal architecture map. Research-only.',
  'No provider outreach, legal conclusion, provider commitment, external account setup, live API use, live Supabase change, real payment, real loan, escrow custody, stablecoin settlement, token collateral, FIO registration, XPR signature, public publication, or partnership claim is approved.',
  'Architecture Principle',
  'GCSC should integrate licensed partners before any value-bearing Web3 rail.',
  'Layer 0: Local Product Records',
  'Layer 1: Licensed Partner Services First',
  'Packet Flow',
  'State Model',
  'Data Minimization Boundary',
  'Provider API Boundary',
  'Required Cross References',
  'Relationship To Future Web3 Rails',
  'Stop Boundary',
  'Licensed escrow provider',
  'Licensed lender or embedded finance provider',
  'Payment processor or bank rails provider',
  'KYC/KYB/AML and fraud provider',
  'Insurance or bonding provider',
  'Valuation or appraisal provider',
  'Contractor licensing or compliance provider',
  'Privacy and security reviewer',
  'LOCAL_RECORD_ONLY',
  'PACKET_SPEC_READY',
  'FOUNDER_REVIEW_REQUIRED',
  'LEGAL_PROVIDER_REVIEW_REQUIRED',
  'BLOCKED_NO_OUTREACH',
  'BLOCKED_LIVE_ACTIONS',
  'Allowed local packet fields',
  'Blocked fields until review',
  'GCSC may design local API-neutral packet shapes.',
  'call provider APIs',
  'create provider accounts',
  'request provider API keys',
  'upload evidence to provider portals',
  'send emails or packets to providers',
  'move money',
  'originate or service credit',
  'hold escrow',
  'settle stablecoins',
  'lock token collateral',
  'sign XPR actions',
  'Licensed partner architecture comes first.',
  'This map does not approve FIO registration, XPR signatures, WebAuth wallet connection, Metal/Metallicus integration, stablecoin settlement, token collateral, DeFi lending, public Web3 finance claims, or provider partnership claims.',
]) {
  requirePhrase(map, phrase, 'licensed partner architecture map');
}

for (const reference of [
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-provider-handoff-packet-map.md',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-smartcontractor-product-integration-map.md',
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(map, reference, 'licensed partner architecture map');
}

for (const phrase of [
  'Escrow Custody',
  'Lending And Working Capital',
  'KYC, KYB, AML, And Fraud',
  'Payment Processing And Stablecoin Settlement',
  'Data Privacy And Audit Logs',
]) {
  requirePhrase(providerQuestions, phrase, 'provider question register');
}

for (const phrase of [
  'Provider Handoff Packet Map',
  'LOCAL_PACKET_SPEC_ONLY',
  'BLOCKED_NO_OUTREACH',
  'BLOCKED_LIVE_ACTIONS',
]) {
  requirePhrase(providerHandoff, phrase, 'provider handoff packet map');
}

requirePhrase(legalProviderPacket, 'Core Legal Position To Review', 'legal/provider review packet');
requirePhrase(productMap, 'Provider Handoff Packet Shape', 'SmartContractor product integration map');
requirePhrase(regulatedWeb3Map, 'Licensed Partner Services', 'regulated Web3 architecture map');
requirePhrase(publicationStatus, 'legal/provider review | PENDING', 'publication evidence current status');

for (const pattern of [
  /\bprovider outreach approved\b/i,
  /\bprovider commitment recorded\b/i,
  /\blegal conclusion recorded\b/i,
  /\blegal\/provider review complete\b/i,
  /\bpartnership approved\b/i,
  /\blive API approved\b/i,
  /\blive action approved\b/i,
  /\bpublic publication approved\b/i,
  /\bescrow release approved\b/i,
  /\bloan approval recorded\b/i,
]) {
  rejectPattern(map, pattern, 'licensed partner architecture map');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('GCSC Whitepaper v1.3 Licensed Partner Architecture Map') ||
    content.includes('Layer 1: Licensed Partner Services First') ||
    content.includes('PACKET_SPEC_READY')
  ) {
    errors.push(`${label} appears to contain internal licensed partner architecture map content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 licensed partner architecture map validation passed');
