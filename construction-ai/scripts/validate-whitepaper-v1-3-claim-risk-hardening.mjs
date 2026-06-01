import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  claimRegister: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-register.md'),
  hardeningChecklist: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-hardening-checklist.md'),
  dryRun: path.join(root, 'docs', 'whitepaper-v1-3-publication-readiness-dry-run.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  publicationEvidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-template.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];

function readRequired(file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
    return '';
  }

  return fs.readFileSync(file, 'utf8');
}

function assertIncludes(content, phrase, label) {
  if (!content.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

const claimRegister = readRequired(files.claimRegister);
const hardeningChecklist = readRequired(files.hardeningChecklist);
const dryRun = readRequired(files.dryRun);
const publicationGate = readRequired(files.publicationGate);
const publicationEvidence = readRequired(files.publicationEvidence);
const whitepaperDraft = readRequired(files.whitepaperDraft);
const homepageDraft = readRequired(files.homepageDraft);
const publicWhitepaper = readRequired(files.publicWhitepaper);
const publicHomepage = readRequired(files.publicHomepage);

for (const phrase of [
  'Highest-Risk Claims',
  'Safe Public Vocabulary',
  'Blocked Public Vocabulary',
  'Publication Rule',
  'GCSC issues construction-backed investment tokens',
  'Stablecoin settlement is live',
  'Metallicus approved GCSC',
]) {
  assertIncludes(claimRegister, phrase, 'claim risk register');
}

for (const phrase of [
  'Hard Block List',
  'Required Context If Mentioned',
  'Current Public File Risk',
  'Candidate Draft Checks',
  'Publication Stop Rule',
  'investment product',
  'stablecoin settlement as live',
  'Metallicus partnership approved',
]) {
  assertIncludes(hardeningChecklist, phrase, 'claim risk hardening checklist');
}

for (const phrase of [
  'Current result: NO-GO',
  'Public File Replacement Check',
  'Required Before Future GO',
  'NO-GO Reasons',
  'Safe Next Actions',
  'Founder approval is not recorded',
  'Legal/provider review is not recorded',
]) {
  assertIncludes(dryRun, phrase, 'publication readiness dry run');
}

assertIncludes(publicationGate, 'Default state: NO-GO', 'publication gate');
assertIncludes(publicationEvidence, 'Current decision | NO-GO', 'publication evidence template');

const draftBlockedPatterns = [
  /\bguaranteed return\b/i,
  /\brisk-free\b/i,
  /\bpassive income\b/i,
  /\binstant loan approval\b/i,
  /\bautomatic escrow release\b/i,
  /\bSEC-approved\b/i,
  /\bregulator-approved\b/i,
  /\bMetallicus partnership approved\b/i,
  /\bFIO payment requests live\b/i,
  /\bXPR settlement live\b/i,
];

for (const [label, content] of [
  ['whitepaper-v1-3-draft.html', whitepaperDraft],
  ['index-v1-3-draft.html', homepageDraft],
]) {
  for (const pattern of draftBlockedPatterns) {
    if (pattern.test(content)) {
      errors.push(`${label} contains blocked standalone claim: ${pattern.source}`);
    }
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Internal Draft - Not Approved For Publication') || content.includes('Current decision | NO-GO')) {
    errors.push(`${label} appears to have been replaced with internal v1.3 draft content`);
  }
}

for (const phrase of [
  'Construction Trust Infrastructure',
  'future regulated Web3',
  'does not currently originate, approve, fund, service, or guarantee loans',
]) {
  assertIncludes(whitepaperDraft, phrase, 'whitepaper v1.3 draft');
}

assertIncludes(homepageDraft, 'Publication Gate', 'homepage v1.3 draft');
assertIncludes(homepageDraft, 'NO-GO', 'homepage v1.3 draft');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 claim-risk hardening validation passed');
