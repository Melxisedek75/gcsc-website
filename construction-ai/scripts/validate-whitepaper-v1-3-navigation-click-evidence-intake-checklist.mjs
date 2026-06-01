import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-intake-checklist.md'),
  readinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-readiness-closeout.md'),
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-click-qa-handoff.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
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

const intake = readRequired('navigation click evidence intake checklist', files.intake);
const readinessCloseout = readRequired('draft navigation readiness closeout', files.readinessCloseout);
const handoff = readRequired('draft navigation click QA handoff', files.handoff);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const whitepaperDraft = readRequired('whitepaper draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal navigation click evidence intake checklist',
  'Manual click evidence remains PENDING',
  'Intake Readiness',
  'Evidence ID Requirements',
  'Browser Click Review',
  'Issue Routing',
  'Acceptable Intake States',
  'Stop Boundary',
  'publication decision | NO-GO',
  'actual browser clicks recorded | PENDING',
  'mobile viewport click review complete | PENDING',
  'desktop viewport click review complete | PENDING',
]) {
  requirePhrase(intake, phrase, 'navigation click evidence intake checklist');
}

for (const linkedDoc of [
  'docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md',
  'docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(intake, linkedDoc, 'navigation click evidence intake checklist');
}

for (const evidenceId of [
  'V13-NAV-WP-01',
  'V13-NAV-WP-02',
  'V13-NAV-WP-03',
  'V13-NAV-WP-04',
  'V13-NAV-WP-05',
  'V13-NAV-WP-06',
  'V13-NAV-HOME-01',
  'V13-NAV-HOME-02',
  'V13-NAV-HOME-03',
  'V13-NAV-HOME-04',
  'V13-NAV-HOME-05',
]) {
  requirePhrase(intake, evidenceId, 'navigation click evidence intake checklist');
  requirePhrase(handoff, evidenceId, 'draft navigation click QA handoff');
}

for (const state of [
  'PENDING_CLICK',
  'PENDING_MOBILE_CLICK',
  'PENDING_DESKTOP_CLICK',
  'ISSUE_FOUND',
  'NEEDS_LOCAL_FIX',
  'PASS_LOCAL_ONLY',
  'HOLD_NO_PUBLIC_USE',
]) {
  requirePhrase(intake, state, 'navigation click evidence intake checklist');
}

for (const target of [
  '#summary',
  '#product',
  '#partners',
  '#web3',
  '#gates',
]) {
  requirePhrase(intake, target, 'navigation click evidence intake checklist');
  requirePhrase(whitepaperDraft, `href="${target}"`, 'whitepaper draft');
}

for (const target of [
  '#mission',
  '#products',
  '#technology',
  '#review',
]) {
  requirePhrase(intake, target, 'navigation click evidence intake checklist');
  requirePhrase(homepageDraft, `href="${target}"`, 'homepage draft');
}

requirePhrase(readinessCloseout, 'Manual browser click evidence and screenshot evidence are PENDING', 'draft navigation readiness closeout');
requirePhrase(handoff, 'Manual click QA remains PENDING', 'draft navigation click QA handoff');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(evidenceStatus, 'manual navigation click evidence | PENDING', 'publication evidence current status');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper draft');
requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'homepage draft');

const blockedApprovalPatterns = [
  /\bmanual click evidence \| COMPLETE\b/i,
  /\bbrowser click evidence \| COMPLETE\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\bprovider response recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership approval recorded\b/i,
  /\bpartnership commitment recorded\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(intake)) {
    errors.push(`navigation click evidence intake checklist contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('Navigation Click Evidence Intake Checklist')
    || content.includes('PENDING_MOBILE_CLICK')
    || content.includes('V13-NAV-WP-01')
  ) {
    errors.push(`${label} appears to contain internal navigation click intake checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 navigation click evidence intake checklist validation passed');
