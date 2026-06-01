import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  map: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-product-integration-map.md'),
  wordingAlignment: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-alignment.md'),
  wordingStatus: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  wordingEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-evidence-log.md'),
  placeholderPlan: path.join(root, 'docs', 'whitepaper-v1-3-product-integration-placeholder-plan.md'),
  architectureMap: path.join(root, 'docs', 'whitepaper-v1-3-regulated-web3-architecture-map.md'),
  providerQuestions: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  publicationStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  smartcontractorHtml: path.join(root, 'construction-ai', 'public', 'smartcontractor.html'),
  smartcontractorValidator: path.join(root, 'construction-ai', 'scripts', 'validate-smartcontractor.mjs'),
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

const map = readRequired('SmartContractor product integration map', files.map);
const wordingAlignment = readRequired('SmartContractor wording alignment', files.wordingAlignment);
const wordingStatus = readRequired('SmartContractor wording review status', files.wordingStatus);
const wordingEvidenceLog = readRequired('SmartContractor wording evidence log', files.wordingEvidenceLog);
const placeholderPlan = readRequired('product integration placeholder plan', files.placeholderPlan);
const architectureMap = readRequired('regulated Web3 architecture map', files.architectureMap);
const providerQuestions = readRequired('provider question register', files.providerQuestions);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const smartcontractorHtml = readRequired('SmartContractor HTML', files.smartcontractorHtml);
const smartcontractorValidator = readRequired('SmartContractor validator', files.smartcontractorValidator);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'SmartContractor Product Integration Map',
  'Current Allowed Product Treatment',
  'Blocked Live Treatment',
  'Required Product Data Boundaries',
  'Provider Handoff Packet Shape',
  'Product Release Gates',
  'PENDING_PRODUCT_BROWSER_QA',
  'PENDING_FOUNDER_PRODUCT_RELEASE_GO',
  'PENDING_LEGAL_PROVIDER_REVIEW',
  'BLOCKED_LIVE_ACTIONS',
  'BLOCKED_PUBLICATION_NO_GO',
  'Stop Boundary',
  'Homeowner project intake',
  'Contractor profile',
  'Bid workspace',
  'Project contract record',
  'Milestone tracker',
  'Evidence packet',
  'Dispute center',
  'Reputation context',
  'Working-capital readiness',
  'Payment intent record',
  'Admin review console',
  'Future digital construction record',
  'FIO Protocol UX',
  'XPR/WebAuth/Metallicus path',
  'no real money movement is allowed',
  'no FIO registration, XPR signature, stablecoin settlement, token collateral lock',
]) {
  requirePhrase(map, phrase, 'SmartContractor product integration map');
}

for (const reference of [
  'docs/whitepaper-v1-3-smartcontractor-wording-alignment.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-evidence-log.md',
  'docs/whitepaper-v1-3-product-integration-placeholder-plan.md',
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'construction-ai/public/smartcontractor.html',
  'construction-ai/scripts/validate-smartcontractor.mjs',
]) {
  requirePhrase(map, reference, 'SmartContractor product integration map');
}

requirePhrase(wordingAlignment, 'construction workflow software', 'SmartContractor wording alignment');
requirePhrase(wordingStatus, 'SmartContractor Wording Review Status', 'SmartContractor wording review status');
requirePhrase(wordingEvidenceLog, 'SMARTCONTRACTOR_DEMO_ONLY_SCAN', 'SmartContractor wording evidence log');
requirePhrase(placeholderPlan, 'Candidate Product Placeholders', 'product integration placeholder plan');
requirePhrase(architectureMap, 'Current No-Real-Money Construction Workflow', 'regulated Web3 architecture map');
requirePhrase(providerQuestions, 'Escrow Custody', 'provider question register');
requirePhrase(providerQuestions, 'XPR, WebAuth, Metal, And Metallicus', 'provider question register');
requirePhrase(publicationStatus, 'SmartContractor wording evidence log | PENDING_PRODUCT_RELEASE_GO', 'publication evidence current status');
requirePhrase(smartcontractorHtml, 'No real payments', 'SmartContractor HTML');
requirePhrase(smartcontractorHtml, 'No live loan approval', 'SmartContractor HTML');
requirePhrase(smartcontractorHtml, 'No escrow release', 'SmartContractor HTML');
requirePhrase(smartcontractorHtml, 'No token collateral lock', 'SmartContractor HTML');
requirePhrase(smartcontractorHtml, 'No legal decision', 'SmartContractor HTML');
requirePhrase(smartcontractorValidator, 'No token collateral lock', 'SmartContractor validator');

const blockedApprovalPatterns = [
  /\bproduction release approved\b/i,
  /\bpublic publication approved\b/i,
  /\blegal\/provider review complete\b/i,
  /\blive finance approved\b/i,
  /\bFIO registration approved\b/i,
  /\bXPR signature approved\b/i,
  /\bpartnership approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(map)) {
    errors.push(`SmartContractor product integration map contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('SmartContractor Product Integration Map') || content.includes('Product Module Map')) {
    errors.push(`${label} appears to contain internal product integration map content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 SmartContractor product integration map validation passed');
