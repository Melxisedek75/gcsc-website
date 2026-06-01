import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');
const docPath = path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-alignment.md');
const evidenceLogPath = path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-evidence-log.md');
const htmlPath = path.join(process.cwd(), 'public', 'smartcontractor.html');

const errors = [];

function readRequired(file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
    return '';
  }

  return fs.readFileSync(file, 'utf8');
}

function requireIncludes(content, phrase, label) {
  if (!content.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

const doc = readRequired(docPath);
const evidenceLog = readRequired(evidenceLogPath);
const html = readRequired(htmlPath);

for (const phrase of [
  'Construction Trust Infrastructure first',
  'future regulated Web3 construction infrastructure second',
  'Safe Product Position',
  'Blocked Product Claims',
  'Safe Replacements',
  'Allowed Context For Risky Terms',
  'Product Copy Rule',
  'docs/whitepaper-v1-3-smartcontractor-wording-evidence-log.md',
  'partner-reviewed working-capital readiness',
  'escrow-ready milestone records',
  'reputation as underwriting context',
  'Research-only. No partnership, endorsement, integration, account setup, or provider approval is claimed.',
  'Stop Boundary',
]) {
  requireIncludes(doc, phrase, 'wording alignment doc');
}

for (const phrase of [
  'SmartContractor Wording Evidence Log',
  'SMARTCONTRACTOR_DEMO_ONLY_SCAN',
  'V13-SCWORD-001',
]) {
  requireIncludes(evidenceLog, phrase, 'SmartContractor wording evidence log');
}

for (const phrase of [
  'Demo-only loan requests create local review records only',
  'They do not approve credit, fund a contractor, route repayment, release escrow, or lock token collateral',
  'Demo-only payment intents create local review records only',
  'They do not charge a card, move XPR, release escrow, settle stablecoins, repay loans, or lock token collateral',
  'Demo-only disputes create local evidence and peer-review records only',
  'They do not decide legal liability, release funds, issue refunds, or override escrow',
  'Demo-only admin actions save local draft notes only',
  'They do not approve loans, reject users, release funds, change live RLS, or update Supabase roles',
]) {
  requireIncludes(html, phrase, 'smartcontractor.html');
}

const blockedStandalonePatterns = [
  /\binvestment product\b/i,
  /\byield\b/i,
  /\bpassive income\b/i,
  /\binstant loan approval\b/i,
  /\breputation as collateral\b/i,
  /\ball on blockchain\b/i,
  /\bsmart escrow\b/i,
  /\bpublic NFT marketplace\b/i,
  /\bMetallicus partnership\b/i,
  /\bFIO integration approved\b/i,
  /\bSEC-approved\b/i,
  /\bregulator-approved\b/i,
  /\brisk-free\b/i,
];

for (const pattern of blockedStandalonePatterns) {
  if (pattern.test(html)) {
    errors.push(`smartcontractor.html contains blocked standalone wording: ${pattern.source}`);
  }
}

const riskyTerms = [
  'token collateral',
  'stablecoins',
  'release escrow',
  'real loans',
  'XPR',
];

for (const term of riskyTerms) {
  if (!html.toLowerCase().includes(term.toLowerCase())) {
    continue;
  }

  const nearbyBoundary = new RegExp(
    `(Demo-only|No |do not|does not|not approve|not charge|not enabled|future|blocked|local review records only)[^\\n]{0,220}${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]{0,220}(Demo-only|No |do not|does not|not approve|not charge|not enabled|future|blocked|local review records only)`,
    'i'
  );

  if (!nearbyBoundary.test(html)) {
    errors.push(`smartcontractor.html mentions "${term}" without nearby demo/future/blocked boundary wording`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 SmartContractor wording validation passed');
