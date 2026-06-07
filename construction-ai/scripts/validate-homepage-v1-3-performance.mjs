import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const root = path.basename(cwd) === 'construction-ai' ? path.resolve(cwd, '..') : cwd;

const files = {
  staticDraft: path.join(root, 'index-v1-3-static-draft.html'),
  publicHomepage: path.join(root, 'index.html'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  packageJson: path.join(root, 'construction-ai', 'package.json'),
  validatorDoc: path.join(root, 'docs', 'homepage-performance-local-validator.md'),
  staticDraftDoc: path.join(root, 'docs', 'smartcontractor-public-homepage-static-asset-draft-2026-06-03.md'),
};

const budgets = {
  maxHtmlBytes: 40_000,
  maxInlineCssBytes: 30_000,
  maxInlineJsBytes: 0,
  maxExternalAssetReferences: 0,
  maxDataUriReferences: 0,
};

const errors = [];

function fail(message, extra = {}) {
  console.error(JSON.stringify({
    status: 'homepage_performance_local_failed',
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

function byteLength(text) {
  return Buffer.byteLength(text, 'utf8');
}

function requirePhrase(text, phrase, label) {
  if (!text.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains blocked performance pattern: ${pattern.source}`);
  }
}

function collectBlocks(text, tagName) {
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  return [...text.matchAll(regex)].map((match) => match[1]);
}

function collectMatches(text, pattern) {
  return [...text.matchAll(pattern)].map((match) => match[0]);
}

const staticDraft = readRequired('static homepage v1.3 draft', files.staticDraft);
const publicHomepage = readRequired('public homepage', files.publicHomepage);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const packageJsonText = readRequired('construction-ai package.json', files.packageJson);
const validatorDoc = readRequired('homepage performance validator doc', files.validatorDoc);
const staticDraftDoc = readRequired('homepage static asset draft doc', files.staticDraftDoc);

if (errors.length > 0) {
  fail('required files are missing');
}

const packageJson = JSON.parse(packageJsonText);
if (packageJson.scripts?.['check:homepage:performance'] !== 'node scripts/validate-homepage-v1-3-performance.mjs') {
  errors.push('package.json is missing check:homepage:performance');
}

const htmlBytes = byteLength(staticDraft);
if (htmlBytes > budgets.maxHtmlBytes) {
  errors.push(`static draft HTML is ${htmlBytes} bytes; budget is ${budgets.maxHtmlBytes}`);
}

const styleBlocks = collectBlocks(staticDraft, 'style');
if (styleBlocks.length !== 1) {
  errors.push(`static draft should have exactly one inline style block; found ${styleBlocks.length}`);
}

const inlineCssBytes = byteLength(styleBlocks.join('\n'));
if (inlineCssBytes > budgets.maxInlineCssBytes) {
  errors.push(`static draft inline CSS is ${inlineCssBytes} bytes; budget is ${budgets.maxInlineCssBytes}`);
}

const scriptBlocks = collectBlocks(staticDraft, 'script');
const inlineJsBytes = byteLength(scriptBlocks.join('\n'));
if (scriptBlocks.length > 0 || inlineJsBytes > budgets.maxInlineJsBytes || /<script\b/i.test(staticDraft)) {
  errors.push('static draft should not include inline or external JavaScript');
}

const externalAssetReferences = collectMatches(staticDraft, /\b(?:https?:\/\/|\/\/[a-z0-9.-]+|src=["'][^"']+|srcset=["'][^"']+)/gi);
const disallowedExternalReferences = externalAssetReferences.filter((reference) => !reference.startsWith('href="whitepaper'));
if (disallowedExternalReferences.length > budgets.maxExternalAssetReferences) {
  errors.push(`static draft contains external or eager asset references: ${disallowedExternalReferences.join(', ')}`);
}

const dataUriReferences = collectMatches(staticDraft, /\bdata:(?:image|font|application)\//gi);
if (dataUriReferences.length > budgets.maxDataUriReferences) {
  errors.push(`static draft contains data URI asset references: ${dataUriReferences.join(', ')}`);
}

for (const [pattern, label] of [
  [/@import\b/i, 'CSS imports'],
  [/\burl\s*\(/i, 'CSS url() asset fetches'],
  [/\brel=["'](?:preload|preconnect|dns-prefetch)["']/i, 'preload/preconnect hints'],
  [/\bloading=["']eager["']/i, 'eager image loading'],
  [/\bautoplay\b/i, 'autoplay media'],
]) {
  rejectPattern(staticDraft, pattern, `static draft (${label})`);
}

for (const phrase of [
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<meta name="description"',
  '<title>GCSC - Static Homepage Draft</title>',
  'Internal Draft - Not Approved For Publication',
  'Publication Gate: NO-GO',
  'SmartContractor by GCSC',
]) {
  requirePhrase(staticDraft, phrase, 'static homepage v1.3 draft');
}

for (const [label, content] of [
  ['index.html', publicHomepage],
  ['whitepaper.html', publicWhitepaper],
]) {
  if (content.includes('GCSC - Static Homepage Draft') || content.includes('Static CSS Candidate')) {
    errors.push(`${label} appears to contain static draft-only homepage content`);
  }
}

for (const [label, content] of [
  ['homepage performance validator doc', validatorDoc],
  ['homepage static asset draft doc', staticDraftDoc],
]) {
  for (const phrase of [
    'check:homepage:performance',
    'index-v1-3-static-draft.html',
    'public `index.html`',
    'public `whitepaper.html`',
    'does not approve publication',
  ]) {
    requirePhrase(content, phrase, label);
  }
}

if (errors.length > 0) {
  fail('homepage performance guard failed', {
    actual: {
      html_bytes: htmlBytes,
      inline_css_bytes: inlineCssBytes,
      inline_js_bytes: inlineJsBytes,
      style_blocks: styleBlocks.length,
      script_blocks: scriptBlocks.length,
      external_asset_references: disallowedExternalReferences,
      data_uri_references: dataUriReferences,
    },
    budgets,
  });
}

console.log(JSON.stringify({
  status: 'homepage_performance_local_passed',
  target: 'index-v1-3-static-draft.html',
  local_only: true,
  public_files_checked_for_draft_content_only: ['index.html', 'whitepaper.html'],
  budgets,
  actual: {
    html_bytes: htmlBytes,
    inline_css_bytes: inlineCssBytes,
    inline_js_bytes: inlineJsBytes,
    style_blocks: styleBlocks.length,
    script_blocks: scriptBlocks.length,
    external_asset_references: disallowedExternalReferences.length,
    data_uri_references: dataUriReferences.length,
  },
}, null, 2));
