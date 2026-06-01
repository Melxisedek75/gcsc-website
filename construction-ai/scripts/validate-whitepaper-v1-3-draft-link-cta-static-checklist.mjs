import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-link-cta-static-checklist.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
  navigationReadiness: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-readiness-closeout.md'),
  navigationHandoff: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-click-qa-handoff.md'),
  clickIntake: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-intake-checklist.md'),
  clickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  browserQaFlow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  staticAssetManifest: path.join(root, 'docs', 'whitepaper-v1-3-draft-static-asset-manifest.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
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

function collectIds(html) {
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
}

function collectHrefs(html) {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((match) => match[1]);
}

function checkAnchorTargets(label, html) {
  const ids = collectIds(html);
  const hrefs = collectHrefs(html);

  for (const href of hrefs) {
    if (href === '#') {
      continue;
    }

    if (!href.startsWith('#')) {
      continue;
    }

    const target = href.slice(1);
    if (!ids.has(target)) {
      errors.push(`${label} has broken in-page anchor: ${href}`);
    }
  }
}

function checkDisallowedActions(label, html) {
  const blockedPatterns = [
    /<form\b/i,
    /\bonclick\s*=/i,
    /\btarget=["']_blank["']/i,
    /\bdownload\b/i,
    /href=["'](?:mailto|tel|sms|javascript|app|webauth|wallet|fio|xpr|proton):/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(html)) {
      errors.push(`${label} contains disallowed CTA/action pattern: ${pattern.source}`);
    }
  }
}

function checkExternalHrefs(label, hrefs) {
  const allowedExternalPrefixes = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  for (const href of hrefs) {
    if (!/^https?:\/\//i.test(href)) {
      continue;
    }

    if (allowedExternalPrefixes.some((prefix) => href.startsWith(prefix))) {
      continue;
    }

    errors.push(`${label} contains unexpected external href: ${href}`);
  }
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

const checklist = readRequired('draft link CTA static checklist', files.checklist);
const whitepaperDraft = readRequired('whitepaper draft HTML', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft HTML', files.homepageDraft);
const navigationReadiness = readRequired('draft navigation readiness closeout', files.navigationReadiness);
const navigationHandoff = readRequired('draft navigation click QA handoff', files.navigationHandoff);
const clickIntake = readRequired('navigation click evidence intake', files.clickIntake);
const clickResults = readRequired('navigation click evidence results', files.clickResults);
const browserQaFlow = readRequired('browser QA evidence flow', files.browserQaFlow);
const staticAssetManifest = readRequired('draft static asset manifest', files.staticAssetManifest);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicationGate = readRequired('publication gate', files.publicationGate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Draft Link CTA Static Checklist',
  'Status: internal draft link and CTA static checklist',
  'PENDING_BROWSER_CLICK_REVIEW',
  'PENDING_MOBILE_TAP_REVIEW',
  'Current publication decision remains NO-GO',
  'Static Link And CTA Checks',
  'PASS_STATIC_LEGACY_REFERENCE',
  'PASS_STATIC_SCAN_ONLY_BOUNDARY',
  'external provider action links are absent',
  'mailto, tel, form, onclick, target blank, and download actions are absent',
  'publication, replacement, provider outreach, and live finance CTAs are absent',
  'Manual Click Checks Still Required',
  'Required Source Documents',
  'Stop Boundary',
]) {
  requirePhrase(checklist, phrase, 'draft link CTA static checklist');
}

for (const fileReference of [
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
  'docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md',
  'docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-browser-qa-evidence-flow.md',
  'docs/whitepaper-v1-3-draft-static-asset-manifest.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-gate.md',
]) {
  requirePhrase(checklist, fileReference, 'draft link CTA static checklist');
}

checkAnchorTargets('whitepaper-v1-3-draft.html', whitepaperDraft);
checkAnchorTargets('index-v1-3-draft.html', homepageDraft);
checkDisallowedActions('whitepaper-v1-3-draft.html', whitepaperDraft);
checkDisallowedActions('index-v1-3-draft.html', homepageDraft);
checkExternalHrefs('whitepaper-v1-3-draft.html', collectHrefs(whitepaperDraft));
checkExternalHrefs('index-v1-3-draft.html', collectHrefs(homepageDraft));

for (const phrase of [
  'href="whitepaper-v1-3-draft.css"',
  'href="index.html"',
  'href="whitepaper.html"',
  'Current Public Whitepaper',
  'Internal Draft - Not Approved For Publication',
  'does not authorize legal claims, provider commitments, live payments, live loans, escrow, stablecoin settlement, token collateral, FIO actions, Metallicus partnership claims, XPR signatures, or public launch',
]) {
  requirePhrase(whitepaperDraft, phrase, 'whitepaper-v1-3-draft.html');
}

for (const phrase of [
  'href="whitepaper-v1-3-draft.html"',
  'href="whitepaper.html"',
  'Current Public Whitepaper',
  'Read v1.3 Draft',
  'Review Draft',
  'View Product Layers',
  'Publication Gate: NO-GO',
  'does not approve public publication, provider commitments, live payments, real loans, escrow, stablecoin settlement, token collateral, FIO registrations, Metallicus partnership claims, XPR signatures, legal conclusions, or public launch',
]) {
  requirePhrase(homepageDraft, phrase, 'index-v1-3-draft.html');
}

for (const requiredAnchor of [
  '#summary',
  '#product',
  '#partners',
  '#web3',
  '#gates',
]) {
  if (!collectHrefs(whitepaperDraft).includes(requiredAnchor)) {
    errors.push(`whitepaper-v1-3-draft.html missing required top nav href: ${requiredAnchor}`);
  }
}

for (const requiredAnchor of [
  '#mission',
  '#products',
  '#technology',
  '#review',
]) {
  if (!collectHrefs(homepageDraft).includes(requiredAnchor)) {
    errors.push(`index-v1-3-draft.html missing required top nav href: ${requiredAnchor}`);
  }
}

if (countMatches(homepageDraft, /href=["']whitepaper-v1-3-draft\.html["']/g) < 2) {
  errors.push('index-v1-3-draft.html must contain multiple local v1.3 draft CTA links');
}

for (const [label, html] of [
  ['whitepaper-v1-3-draft.html', whitepaperDraft],
  ['index-v1-3-draft.html', homepageDraft],
]) {
  for (const pattern of [
    /connect wallet/i,
    /register FIO/i,
    /sign XPR/i,
    /apply now for live loan/i,
    /open live escrow/i,
    /settle stablecoin/i,
    /lock token collateral/i,
  ]) {
    if (pattern.test(html)) {
      errors.push(`${label} contains blocked provider/live CTA wording or href: ${pattern.source}`);
    }
  }
}

requirePhrase(navigationReadiness, 'Manual browser click evidence and screenshot evidence are PENDING', 'draft navigation readiness closeout');
requirePhrase(navigationReadiness, 'public file links | `index.html`, `whitepaper.html` | SCAN_ONLY_BOUNDARY', 'draft navigation readiness closeout');
requirePhrase(navigationHandoff, 'Manual click QA remains PENDING', 'draft navigation click QA handoff');
requirePhrase(navigationHandoff, 'V13-NAV-HOME-05', 'draft navigation click QA handoff');
requirePhrase(clickIntake, 'Manual click evidence remains PENDING', 'navigation click evidence intake');
requirePhrase(clickIntake, 'wrong file opened? yes/no', 'navigation click evidence intake');
requirePhrase(clickResults, 'No browser click evidence is recorded', 'navigation click evidence results');
requirePhrase(clickResults, 'PENDING_CLICK', 'navigation click evidence results');
requirePhrase(browserQaFlow, 'PENDING_FLOW', 'browser QA evidence flow');
requirePhrase(browserQaFlow, 'Static anchor checks are not browser click evidence.', 'browser QA evidence flow');
requirePhrase(staticAssetManifest, 'PENDING_EXTERNAL_ASSET_REVIEW', 'draft static asset manifest');
requirePhrase(staticAssetManifest, 'Tailwind CDN usage in `index-v1-3-draft.html`', 'draft static asset manifest');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');

const blockedChecklistPatterns = [
  /\bCurrent decision:\s*GO\b/i,
  /\bclick QA complete\b/i,
  /\bmobile tap QA complete\b/i,
  /\bscreenshot evidence complete\b/i,
  /\bCTA approved for publication\b/i,
  /\bpublic routing approved\b/i,
  /\bpublic file replacement approved\b/i,
  /\blegal\/provider approval recorded\b/i,
  /\bprovider outreach approved\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedChecklistPatterns) {
  if (pattern.test(checklist)) {
    errors.push(`draft link CTA checklist contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft Link CTA Static Checklist') || content.includes('PENDING_BROWSER_CLICK_REVIEW')) {
    errors.push(`${label} appears to contain internal draft link CTA checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft link CTA static checklist validation passed');
