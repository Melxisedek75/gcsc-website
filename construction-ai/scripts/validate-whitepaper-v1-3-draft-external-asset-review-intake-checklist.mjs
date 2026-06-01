import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-draft-external-asset-review-intake-checklist.md'),
  staticManifest: path.join(root, 'docs', 'whitepaper-v1-3-draft-static-asset-manifest.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  linkCtaChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-link-cta-static-checklist.md'),
  browserQaFlow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  localDraftQaReadiness: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
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

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const intake = readRequired('draft external asset review intake checklist', files.intake);
const staticManifest = readRequired('draft static asset manifest', files.staticManifest);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const publicationGate = readRequired('publication gate', files.publicationGate);
const linkCtaChecklist = readRequired('draft link CTA static checklist', files.linkCtaChecklist);
const browserQaFlow = readRequired('browser QA evidence flow', files.browserQaFlow);
const localDraftQaReadiness = readRequired('local draft QA readiness scorecard', files.localDraftQaReadiness);
const whitepaperDraft = readRequired('whitepaper draft HTML', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft HTML', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Draft External Asset Review Intake Checklist',
  'Status: internal draft external asset review intake checklist',
  'Draft external asset review remains PENDING_EXTERNAL_ASSET_REVIEW',
  'Current publication decision remains NO-GO',
  'Assets In Scope',
  'Intake Requirements',
  'Allowed Intake States',
  'Reviewer Record Template',
  'Required Source Documents',
  'No Shortcut Rules',
  'Stop Boundary',
  'PENDING_PRIVACY_REVIEW',
  'PENDING_PERFORMANCE_REVIEW',
  'PENDING_FALLBACK_REVIEW',
  'PENDING_PUBLIC_ROUTING_REVIEW',
  'PENDING_BROWSER_EVIDENCE',
  'HOLD_NO_PUBLIC_USE',
]) {
  requirePhrase(intake, phrase, 'draft external asset review intake checklist');
}

for (const phrase of [
  'https://fonts.googleapis.com',
  'https://cdn.tailwindcss.com',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper-v1-3-draft.css',
  'whitepaper.html',
  'index.html',
  'PENDING_EXTERNAL_ASSET_REVIEW',
  'ALLOW_DRAFT_ONLY',
  'BUNDLE_BEFORE_PUBLIC_USE',
  'SELF_HOST_BEFORE_PUBLIC_USE',
  'REMOVE_BEFORE_PUBLIC_USE',
  'NEEDS_PERFORMANCE_REVIEW',
  'NEEDS_PRIVACY_REVIEW',
  'NEEDS_FALLBACK_REVIEW',
]) {
  requirePhrase(intake, phrase, 'draft external asset review intake checklist');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-draft-static-asset-manifest.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'docs/whitepaper-v1-3-draft-link-cta-static-checklist.md',
  'docs/whitepaper-v1-3-browser-qa-evidence-flow.md',
  'docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md',
]) {
  requirePhrase(intake, fileReference, 'draft external asset review intake checklist');
}

requirePhrase(staticManifest, 'Draft static asset review is PENDING_EXTERNAL_ASSET_REVIEW', 'draft static asset manifest');
requirePhrase(staticManifest, 'Tailwind CDN usage in `index-v1-3-draft.html`', 'draft static asset manifest');
requirePhrase(staticManifest, 'Google Fonts usage in both local draft files', 'draft static asset manifest');
requirePhrase(evidenceStatus, 'draft external asset review | PENDING_EXTERNAL_ASSET_REVIEW', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'draft static asset manifest | READY_LOCAL_MANIFEST_PENDING_EXTERNAL_ASSET_REVIEW', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'draft static asset manifest | local manifest only / external asset review pending', 'internal review master index');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(linkCtaChecklist, 'external provider action links are absent', 'draft link CTA static checklist');
requirePhrase(browserQaFlow, 'PENDING_FLOW', 'browser QA evidence flow');
requirePhrase(localDraftQaReadiness, 'public replacement readiness | NO-GO', 'local draft QA readiness scorecard');

requirePhrase(whitepaperDraft, 'https://fonts.googleapis.com', 'whitepaper-v1-3-draft.html');
requirePhrase(homepageDraft, 'https://cdn.tailwindcss.com', 'index-v1-3-draft.html');
requirePhrase(homepageDraft, 'https://fonts.googleapis.com', 'index-v1-3-draft.html');
requirePhrase(whitepaperDraft, 'href="whitepaper-v1-3-draft.css"', 'whitepaper-v1-3-draft.html');

for (const pattern of [
  /\bCurrent publication decision remains GO\b/i,
  /\bexternal asset review complete\b/i,
  /\bCDN production usage approved\b/i,
  /\bGoogle Fonts production usage approved\b/i,
  /\bpublic routing approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bpublication approved\b/i,
  /\blegal\/provider clearance recorded\b/i,
  /\blive action approved\b/i,
]) {
  rejectPattern(intake, pattern, 'draft external asset review intake checklist');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft External Asset Review Intake Checklist') || content.includes('PENDING_PRIVACY_REVIEW')) {
    errors.push(`${label} appears to contain internal draft external asset review intake content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft external asset review intake validation passed');
