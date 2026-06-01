import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  map: path.join(root, 'docs', 'whitepaper-v1-3-provider-handoff-packet-map.md'),
  providerQuestions: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-register.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  legalProviderPacket: path.join(root, 'docs', 'whitepaper-v1-3-legal-provider-review-packet.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  questionMapping: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  smartcontractorProductMap: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-product-integration-map.md'),
  architectureMap: path.join(root, 'docs', 'whitepaper-v1-3-regulated-web3-architecture-map.md'),
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

const map = readRequired('provider handoff packet map', files.map);
const providerQuestions = readRequired('provider question register', files.providerQuestions);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const legalProviderPacket = readRequired('legal provider review packet', files.legalProviderPacket);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const questionMapping = readRequired('reviewer question mapping matrix', files.questionMapping);
const smartcontractorProductMap = readRequired('SmartContractor product integration map', files.smartcontractorProductMap);
const architectureMap = readRequired('regulated Web3 architecture map', files.architectureMap);
const publicationStatus = readRequired('publication evidence current status', files.publicationStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Provider Handoff Packet Map',
  'Packet Map',
  'Data Minimization Rules',
  'Required Before Any Send',
  'Blocked Decisions',
  'LOCAL_PACKET_SPEC_ONLY',
  'PENDING_PROVIDER_REVIEW',
  'BLOCKED_NO_OUTREACH',
  'BLOCKED_LIVE_ACTIONS',
  'Escrow-ready milestone packet',
  'Working-capital readiness packet',
  'KYC/KYB/AML verification packet',
  'Payment processing/reconciliation packet',
  'Insurance/bonding context packet',
  'Valuation/appraisal context packet',
  'Web3 audit proof packet',
  'FIO UX review packet',
  'XPR/WebAuth/Metallicus technical review packet',
  'no autonomous outreach',
  'Stop Boundary',
]) {
  requirePhrase(map, phrase, 'provider handoff packet map');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md',
  'docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md',
  'docs/whitepaper-v1-3-smartcontractor-product-integration-map.md',
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(map, fileReference, 'provider handoff packet map');
}

for (const phrase of [
  'Escrow Custody',
  'Lending And Working Capital',
  'FIO Protocol',
  'XPR, WebAuth, Metal, And Metallicus',
]) {
  requirePhrase(providerQuestions, phrase, 'provider question register');
}

requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(legalProviderPacket, 'Core Legal Position To Review', 'legal provider review packet');
requirePhrase(legalProviderPacket, 'Required Review Outputs', 'legal provider review packet');
requirePhrase(sendReadiness, 'BLOCKED_NO_SEND', 'reviewer packet send readiness checklist');
requirePhrase(questionMapping, 'BLOCKED_NO_OUTREACH', 'reviewer question mapping matrix');
requirePhrase(smartcontractorProductMap, 'Provider Handoff Packet Shape', 'SmartContractor product integration map');
requirePhrase(architectureMap, 'Licensed Partner Services', 'regulated Web3 architecture map');
requirePhrase(publicationStatus, 'legal/provider review | PENDING', 'publication evidence current status');

for (const pattern of [
  /\bprovider outreach approved\b/i,
  /\bprovider response recorded\b/i,
  /\blegal\/provider review complete\b/i,
  /\bpartnership approved\b/i,
  /\blive action approved\b/i,
]) {
  rejectPattern(map, pattern, 'provider handoff packet map');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Provider Handoff Packet Map') || content.includes('LOCAL_PACKET_SPEC_ONLY')) {
    errors.push(`${label} appears to contain internal provider handoff packet map content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 provider handoff packet map validation passed');
