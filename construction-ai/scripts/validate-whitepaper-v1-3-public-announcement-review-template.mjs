import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  template: path.join(root, 'docs', 'whitepaper-v1-3-public-announcement-review-template.md'),
  claimRiskHardening: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-hardening-checklist.md'),
  publicationEvidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  publicationBlockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  partnerOutreachDrafts: path.join(root, 'docs', 'whitepaper-v1-3-partner-outreach-drafts.md'),
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

const template = readRequired('public announcement review template', files.template);
const claimRiskHardening = readRequired('claim risk hardening checklist', files.claimRiskHardening);
const publicationEvidenceStatus = readRequired('publication evidence current status', files.publicationEvidenceStatus);
const publicationBlockerMatrix = readRequired('publication blocker status matrix', files.publicationBlockerMatrix);
const partnerOutreachDrafts = readRequired('partner outreach drafts', files.partnerOutreachDrafts);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal public announcement review template',
  'No public announcement',
  'Announcement Review Record Template',
  'Announcement Copy Rows Template',
  'Allowed Result States',
  'Required Before Any PASS',
  'Stop Boundary',
  'publication approved? | NO by default',
  'public file replacement approved? | NO by default',
  'provider outreach approved? | NO by default',
  'reviewer outreach approved? | NO by default',
  'PENDING_ANNOUNCEMENT_REVIEW',
  'V13-ANNOUNCE-WEB-01',
  'V13-ANNOUNCE-SOCIAL-01',
  'V13-ANNOUNCE-PARTNER-01',
]) {
  requirePhrase(template, phrase, 'public announcement review template');
}

for (const blockedAction of [
  'cannot be used to publish announcements',
  'send email',
  'post social content',
  'contact providers',
  'contact reviewers',
  'replace public files',
  'register FIO names',
  'sign XPR actions',
]) {
  requirePhrase(template, blockedAction, 'public announcement review template');
}

requirePhrase(claimRiskHardening, 'Hard Block List', 'claim risk hardening checklist');
requirePhrase(publicationEvidenceStatus, 'external announcement review | PENDING', 'publication evidence current status');
requirePhrase(publicationBlockerMatrix, 'announcement/public distribution review | PENDING', 'publication blocker status matrix');
requirePhrase(partnerOutreachDrafts, 'Founder Use Rule', 'partner outreach drafts');

for (const pattern of [
  /\bpublication approved\? \| YES\b/i,
  /\bpublic file replacement approved\? \| YES\b/i,
  /\bprovider outreach approved\? \| YES\b/i,
  /\breviewer outreach approved\? \| YES\b/i,
  /\bANNOUNCEMENT_GO\b/i,
  /\bPUBLISH_NOW\b/i,
  /\bSEND_NOW\b/i,
  /\bPOST_NOW\b/i,
]) {
  rejectPattern(template, pattern, 'public announcement review template');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Public Announcement Review Template') || content.includes('V13-ANNOUNCE-WEB-01')) {
    errors.push(`${label} appears to contain internal public announcement review template content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 public announcement review template validation passed');
