import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  appendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  localDraftQaReadiness: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
  navigationClickHandoff: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-click-qa-handoff.md'),
  navigationClickIntake: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-intake-checklist.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  screenshotHandoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  reviewerResponseIntake: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
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

const appendix = readRequired('reviewer evidence appendix', files.appendix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const localDraftQaReadiness = readRequired('local draft QA readiness scorecard', files.localDraftQaReadiness);
const navigationClickHandoff = readRequired('navigation click handoff', files.navigationClickHandoff);
const navigationClickIntake = readRequired('navigation click evidence intake checklist', files.navigationClickIntake);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const screenshotHandoff = readRequired('screenshot QA handoff', files.screenshotHandoff);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const reviewerResponseIntake = readRequired('reviewer response intake template', files.reviewerResponseIntake);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal reviewer evidence appendix',
  'No outreach is approved',
  'Evidence Package Summary',
  'Evidence Not Yet Complete',
  'Reviewer Use',
  'Required Before Any Reviewer Send',
  'Stop Boundary',
  'manual navigation click evidence | PENDING',
  'screenshot evidence | PENDING',
  'live-action authorization | BLOCKED',
  'NO_GO_PUBLICATION_DEFAULT',
]) {
  requirePhrase(appendix, phrase, 'reviewer evidence appendix');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md',
  'docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
]) {
  requirePhrase(appendix, fileReference, 'reviewer evidence appendix');
}

requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(localDraftQaReadiness, 'Current publication decision remains NO-GO', 'local draft QA readiness scorecard');
requirePhrase(navigationClickHandoff, 'Manual click QA remains PENDING', 'navigation click handoff');
requirePhrase(navigationClickIntake, 'Manual click evidence remains PENDING', 'navigation click evidence intake checklist');
requirePhrase(navigationClickResults, 'No browser click evidence is recorded', 'navigation click evidence results template');
requirePhrase(screenshotHandoff, 'Screenshot QA is PENDING', 'screenshot QA handoff');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(screenshotResults, 'No screenshot evidence is recorded', 'screenshot evidence results template');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(reviewerResponseIntake, 'No reviewer response is recorded yet', 'reviewer response intake template');

const blockedApprovalPatterns = [
  /\boutreach approved\b/i,
  /\boutreach sent\b/i,
  /\bpacket sent\b/i,
  /\breviewer response recorded\b/i,
  /\bprovider response recorded\b/i,
  /\bscreenshot QA \| COMPLETE\b/i,
  /\bnavigation click QA \| COMPLETE\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blive-action authorization \| EXISTS\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(appendix)) {
    errors.push(`reviewer evidence appendix contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Reviewer Evidence Appendix') || content.includes('Evidence Package Summary')) {
    errors.push(`${label} appears to contain internal reviewer evidence appendix content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 reviewer evidence appendix validation passed');
