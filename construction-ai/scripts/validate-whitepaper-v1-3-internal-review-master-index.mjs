import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  founderPacket: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-packet.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  publicDraft: path.join(root, 'docs', 'whitepaper-v1-3-public-draft.md'),
  smartcontractorWordingStatus: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  providerQuestionStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  reviewerRouting: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  reviewerRedaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  reviewerSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  screenshotHandoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  qaIssueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  publicWordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  whitepaperDraftHtml: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraftHtml: path.join(root, 'index-v1-3-draft.html'),
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

const masterIndex = readRequired('internal review master index', files.masterIndex);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const founderPacket = readRequired('founder review packet', files.founderPacket);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const publicDraft = readRequired('public draft', files.publicDraft);
const smartcontractorWordingStatus = readRequired('SmartContractor wording review status', files.smartcontractorWordingStatus);
const providerQuestionStatus = readRequired('provider question status matrix', files.providerQuestionStatus);
const reviewerRouting = readRequired('reviewer routing index', files.reviewerRouting);
const reviewerRedaction = readRequired('reviewer packet redaction checklist', files.reviewerRedaction);
const reviewerSummary = readRequired('reviewer response summary shell', files.reviewerSummary);
const screenshotHandoff = readRequired('screenshot handoff', files.screenshotHandoff);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const qaIssueRegister = readRequired('draft QA issue register', files.qaIssueRegister);
const publicWordingScan = readRequired('public wording scan status', files.publicWordingScan);
const whitepaperDraftHtml = readRequired('whitepaper draft HTML', files.whitepaperDraftHtml);
const homepageDraftHtml = readRequired('homepage draft HTML', files.homepageDraftHtml);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Recommended Reading Order',
  'Strategy And Direction',
  'Public-Safe Drafts',
  'Claim-Risk Controls',
  'Provider And Legal Review',
  'Future Web3 Research',
  'Publication Evidence And Gates',
  'Local QA And Issue Control',
  'Current Decision State',
  'Founder Review Output',
  'Stop Boundary',
  'founder-ready packet status | ready for founder review',
  'public whitepaper replacement | NO-GO',
  'public homepage replacement | NO-GO',
]) {
  requirePhrase(masterIndex, phrase, 'internal review master index');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-founder-review-packet.md',
  'docs/whitepaper-v1-3-founder-review-closeout.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-go-record-template.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
]) {
  requirePhrase(masterIndex, fileReference, 'internal review master index');
}

requirePhrase(founderReadyRollup, 'Founder-Ready Packet Status Rollup', 'founder-ready packet status rollup');
requirePhrase(founderPacket, 'Construction Trust Infrastructure first', 'founder review packet');
requirePhrase(founderCloseout, 'Founder Decision Choices', 'founder review closeout');
requirePhrase(publicDraft, 'Status: internal public-safe draft', 'public draft');
requirePhrase(smartcontractorWordingStatus, 'SmartContractor Wording Review Status', 'SmartContractor wording review status');
requirePhrase(providerQuestionStatus, 'Provider Question Status Matrix', 'provider question status matrix');
requirePhrase(reviewerRouting, 'Reviewer Response Intake', 'reviewer routing index');
requirePhrase(reviewerRedaction, 'Reviewer Packet Redaction Checklist', 'reviewer packet redaction checklist');
requirePhrase(reviewerSummary, 'Reviewer Response Summary Shell', 'reviewer response summary shell');
requirePhrase(screenshotHandoff, 'Screenshot QA is PENDING', 'screenshot handoff');
requirePhrase(screenshotManifest, 'Screenshot Evidence Manifest', 'screenshot evidence manifest');
requirePhrase(qaIssueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(publicWordingScan, 'Public Wording Scan Current Status', 'public wording scan status');
requirePhrase(whitepaperDraftHtml, 'Internal Draft - Not Approved For Publication', 'whitepaper draft HTML');
requirePhrase(homepageDraftHtml, 'Publication Gate: NO-GO', 'homepage draft HTML');

const blockedApprovalPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal conclusion approved\b/i,
  /\bprovider commitment approved\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(masterIndex)) {
    errors.push(`internal review master index contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Internal Review Master Index') || content.includes('Recommended Reading Order')) {
    errors.push(`${label} appears to contain internal review index content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 internal review master index validation passed');
