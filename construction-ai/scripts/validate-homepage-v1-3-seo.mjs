import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const root = path.basename(cwd) === 'construction-ai' ? path.resolve(cwd, '..') : cwd;

const files = {
  staticDraft: path.join(root, 'index-v1-3-static-draft.html'),
  publicHomepage: path.join(root, 'index.html'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  packageJson: path.join(root, 'construction-ai', 'package.json'),
  validatorDoc: path.join(root, 'docs', 'homepage-seo-local-validator.md'),
  staticDraftDoc: path.join(root, 'docs', 'smartcontractor-public-homepage-static-asset-draft-2026-06-03.md'),
};

const titleBudget = { min: 20, max: 70 };
const descriptionBudget = { min: 120, max: 220 };
const h1Budget = { min: 20, max: 95 };

const blockedPublicRiskTerms = [
  /\bblockchain\b/i,
  /\bweb3\b/i,
  /\btoken\b/i,
  /\bxpr\b/i,
  /\bfio\b/i,
  /\bstablecoin\b/i,
  /\bescrow\b/i,
  /\blending\b/i,
  /\bloan\b/i,
  /\bcollateral\b/i,
  /\bmetallicus\b/i,
  /\bpublic launch approved\b/i,
  /\bproduction approved\b/i,
  /\bprovider approved\b/i,
  /\blegal approved\b/i,
];

const requiredH2Signals = [
  'The Problem We Solve',
  'Product Layers',
  'Future reviewed infrastructure',
  'Reputation as readiness data',
  'Review Boundary',
];

const errors = [];

function fail(message, extra = {}) {
  console.error(JSON.stringify({
    status: 'homepage_seo_local_failed',
    target: 'index-v1-3-static-draft.html',
    message,
    errors,
    ...extra,
  }, null, 2));
  process.exit(1);
}

function readRequired(label, filePath) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required ${label}: ${filePath}`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function requirePhrase(text, phrase, label) {
  if (!text.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function collectTags(text, tagName) {
  return [...text.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function getAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`\\b${attributeName}\\s*=\\s*(['"])(.*?)\\1`, 'i'));
  return match ? match[2] : '';
}

function decodeBasicEntities(text) {
  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function stripTags(text) {
  return decodeBasicEntities(text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function getSingleTitle(html) {
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => stripTags(match[1]));
  if (titles.length !== 1) {
    errors.push(`static draft should have exactly one title; found ${titles.length}`);
    return '';
  }

  return titles[0];
}

function getMetaByName(html, name) {
  return collectTags(html, 'meta').filter((tag) => getAttribute(tag, 'name').toLowerCase() === name);
}

function getLinkByRel(html, rel) {
  return collectTags(html, 'link').filter((tag) => getAttribute(tag, 'rel').toLowerCase() === rel);
}

function collectHeadings(html) {
  return [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: stripTags(match[2]),
  }));
}

function rejectBlockedTerms(text, label) {
  for (const pattern of blockedPublicRiskTerms) {
    if (pattern.test(text)) {
      errors.push(`${label} contains blocked public-risk term: ${pattern.source}`);
    }
  }
}

const staticDraft = readRequired('static homepage v1.3 draft', files.staticDraft);
const publicHomepage = readRequired('public homepage', files.publicHomepage);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const packageJsonText = readRequired('construction-ai package.json', files.packageJson);
const validatorDoc = readRequired('homepage SEO validator doc', files.validatorDoc);
const staticDraftDoc = readRequired('homepage static asset draft doc', files.staticDraftDoc);

if (errors.length > 0) {
  fail('required files are missing');
}

const packageJson = JSON.parse(packageJsonText);
if (packageJson.scripts?.['check:homepage:seo'] !== 'node scripts/validate-homepage-v1-3-seo.mjs') {
  errors.push('package.json is missing check:homepage:seo');
}

requirePhrase(staticDraft, '<html lang="en">', 'static homepage v1.3 draft');
requirePhrase(staticDraft, '<meta charset="UTF-8">', 'static homepage v1.3 draft');
requirePhrase(staticDraft, '<meta name="viewport" content="width=device-width, initial-scale=1.0">', 'static homepage v1.3 draft');
requirePhrase(staticDraft, 'Internal Draft - Not Approved For Publication', 'static homepage v1.3 draft');
requirePhrase(staticDraft, 'Publication Gate: NO-GO', 'static homepage v1.3 draft');

const title = getSingleTitle(staticDraft);
if (title.length < titleBudget.min || title.length > titleBudget.max) {
  errors.push(`title length is ${title.length}; budget is ${titleBudget.min}-${titleBudget.max}`);
}
requirePhrase(title, 'GCSC', 'static homepage title');
requirePhrase(title, 'Static Homepage Draft', 'static homepage title');
rejectBlockedTerms(title, 'static homepage title');

const descriptionMetas = getMetaByName(staticDraft, 'description');
if (descriptionMetas.length !== 1) {
  errors.push(`static draft should have exactly one meta description; found ${descriptionMetas.length}`);
}
const description = descriptionMetas.length === 1 ? getAttribute(descriptionMetas[0], 'content') : '';
if (description.length < descriptionBudget.min || description.length > descriptionBudget.max) {
  errors.push(`meta description length is ${description.length}; budget is ${descriptionBudget.min}-${descriptionBudget.max}`);
}
for (const phrase of [
  'Construction Trust Infrastructure',
  'verified project records',
  'milestone workflows',
  'dispute evidence',
  'partner-reviewed working-capital readiness',
]) {
  requirePhrase(description, phrase, 'static homepage meta description');
}
rejectBlockedTerms(description, 'static homepage meta description');

const robotsMetas = getMetaByName(staticDraft, 'robots');
if (robotsMetas.length !== 1) {
  errors.push(`static draft should have exactly one robots meta tag; found ${robotsMetas.length}`);
}
const robots = robotsMetas.length === 1 ? getAttribute(robotsMetas[0], 'content').toLowerCase() : '';
if (!robots.includes('noindex') || !robots.includes('nofollow')) {
  errors.push('static draft robots meta must include noindex and nofollow until PUBLICATION_GO');
}

const canonicalLinks = getLinkByRel(staticDraft, 'canonical');
if (canonicalLinks.length > 0) {
  errors.push('static draft must not include a canonical URL before founder-approved publication and deploy target');
}

const ogTags = collectTags(staticDraft, 'meta').filter((tag) => getAttribute(tag, 'property').toLowerCase().startsWith('og:'));
if (ogTags.length > 0) {
  errors.push('static draft must not include Open Graph public-sharing metadata before publication approval');
}

const twitterTags = collectTags(staticDraft, 'meta').filter((tag) => getAttribute(tag, 'name').toLowerCase().startsWith('twitter:'));
if (twitterTags.length > 0) {
  errors.push('static draft must not include Twitter/X public-sharing metadata before publication approval');
}

const headings = collectHeadings(staticDraft);
const h1s = headings.filter((heading) => heading.level === 1);
if (h1s.length !== 1) {
  errors.push(`static draft should have exactly one h1; found ${h1s.length}`);
}
const h1 = h1s[0]?.text ?? '';
if (h1.length < h1Budget.min || h1.length > h1Budget.max) {
  errors.push(`h1 length is ${h1.length}; budget is ${h1Budget.min}-${h1Budget.max}`);
}
requirePhrase(h1, 'Trust infrastructure', 'static homepage h1');
requirePhrase(h1, 'construction workflows', 'static homepage h1');
rejectBlockedTerms(h1, 'static homepage h1');

if (headings.length === 0 || headings[0].level !== 1) {
  errors.push('first heading should be h1');
}

for (let index = 1; index < headings.length; index += 1) {
  if (headings[index].level > headings[index - 1].level + 1) {
    errors.push(`heading level jumps from h${headings[index - 1].level} to h${headings[index].level}: ${headings[index].text}`);
  }
}

const h2Texts = headings.filter((heading) => heading.level === 2).map((heading) => heading.text);
for (const signal of requiredH2Signals) {
  if (!h2Texts.includes(signal)) {
    errors.push(`missing required h2 signal: ${signal}`);
  }
}

for (const [label, content] of [
  ['index.html', publicHomepage],
  ['whitepaper.html', publicWhitepaper],
]) {
  if (content.includes('GCSC - Static Homepage Draft') || content.includes('Internal Draft - Not Approved For Publication')) {
    errors.push(`${label} appears to contain static draft-only SEO or draft metadata`);
  }
}

for (const [label, content] of [
  ['homepage SEO validator doc', validatorDoc],
  ['homepage static asset draft doc', staticDraftDoc],
]) {
  for (const phrase of [
    'check:homepage:seo',
    'index-v1-3-static-draft.html',
    'canonical',
    'noindex',
    'public `index.html`',
    'public `whitepaper.html`',
    'does not approve publication',
  ]) {
    requirePhrase(content, phrase, label);
  }
}

if (errors.length > 0) {
  fail('homepage SEO guard failed', {
    title,
    description,
    robots,
    heading_count: headings.length,
    h2_signals_found: h2Texts,
  });
}

console.log(JSON.stringify({
  status: 'homepage_seo_local_passed',
  target: 'index-v1-3-static-draft.html',
  local_only: true,
  canonical_status: 'blocked_until_publication_go_and_deploy_target',
  public_sharing_metadata_status: 'blocked_until_publication_go',
  public_files_checked_for_draft_content_only: ['index.html', 'whitepaper.html'],
  title: {
    value: title,
    length: title.length,
    budget: titleBudget,
  },
  description: {
    length: description.length,
    budget: descriptionBudget,
  },
  robots,
  headings: {
    count: headings.length,
    h1_count: h1s.length,
    h2_count: h2Texts.length,
  },
}, null, 2));
