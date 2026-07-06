import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const root = path.basename(cwd) === 'construction-ai' ? path.resolve(cwd, '..') : cwd;

const files = {
  staticDraft: path.join(root, 'index-v1-3-static-draft.html'),
  publicHomepage: path.join(root, 'index.html'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  packageJson: path.join(root, 'construction-ai', 'package.json'),
  validatorDoc: path.join(root, 'docs', 'homepage-w3c-local-validator.md'),
  staticDraftDoc: path.join(root, 'docs', 'smartcontractor-public-homepage-static-asset-draft-2026-06-03.md'),
};

const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const requiredSingleTags = ['html', 'head', 'body', 'main', 'title'];
const requiredSectionIds = ['mission', 'products', 'technology', 'review'];
const allowedLocalHtmlLinks = new Set(['whitepaper-v1-3-draft.html', 'whitepaper.html']);

const errors = [];

function fail(message, extra = {}) {
  console.error(JSON.stringify({
    status: 'homepage_w3c_local_failed',
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

function collectTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => ({
    tag: match[0],
    index: match.index,
  }));
}

function getAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`\\b${attributeName}\\s*=\\s*(['"])(.*?)\\1`, 'i'));
  return match ? match[2] : '';
}

function stripTagBlocks(html, tagName) {
  return html.replace(new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'gi'), '');
}

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split('\n').length;
}

function validateTagStack(html) {
  const htmlWithoutRawText = stripTagBlocks(stripTagBlocks(html, 'style'), 'script');
  const stack = [];
  const issues = [];
  const tagRegex = /<\/?([a-z][a-z0-9-]*)(?:\s[^<>]*)?>/gi;
  let match = tagRegex.exec(htmlWithoutRawText);

  while (match) {
    const raw = match[0];
    const name = match[1].toLowerCase();
    const line = lineNumberForIndex(htmlWithoutRawText, match.index);
    const isClosing = raw.startsWith('</');
    const isSelfClosing = raw.endsWith('/>') || voidTags.has(name);

    if (isClosing) {
      const previous = stack.pop();
      if (!previous) {
        issues.push(`Unexpected closing </${name}> at line ${line}`);
      } else if (previous.name !== name) {
        issues.push(`Mismatched closing </${name}> at line ${line}; expected </${previous.name}> from line ${previous.line}`);
      }
    } else if (!isSelfClosing) {
      stack.push({ name, line });
    }

    match = tagRegex.exec(htmlWithoutRawText);
  }

  for (const openTag of stack.reverse()) {
    issues.push(`Unclosed <${openTag.name}> opened at line ${openTag.line}`);
  }

  return issues;
}

function validateDuplicateIds(html) {
  const idMatches = [...html.matchAll(/\bid\s*=\s*(['"])(.*?)\1/gi)];
  const ids = new Map();
  for (const match of idMatches) {
    const id = match[2];
    if (!ids.has(id)) {
      ids.set(id, []);
    }
    ids.get(id).push(lineNumberForIndex(html, match.index));
  }

  return [...ids.entries()]
    .filter(([, lines]) => lines.length > 1)
    .map(([id, lines]) => `Duplicate id "${id}" at lines ${lines.join(', ')}`);
}

function validateLinks(html, idSet) {
  const linkIssues = [];
  const anchors = collectTags(html, 'a');

  for (const anchor of anchors) {
    const href = getAttribute(anchor.tag, 'href');
    const line = lineNumberForIndex(html, anchor.index);

    if (!href) {
      linkIssues.push(`Anchor at line ${line} is missing href`);
      continue;
    }

    if (href === '#') {
      continue;
    }

    if (href.startsWith('#')) {
      const targetId = href.slice(1);
      if (!idSet.has(targetId)) {
        linkIssues.push(`Anchor at line ${line} points to missing fragment id "${targetId}"`);
      }
      continue;
    }

    if (/^(?:https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(href)) {
      linkIssues.push(`Anchor at line ${line} uses a blocked non-local href: ${href}`);
      continue;
    }

    // Local relative link: strip fragment/query, then enforce the HTML allowlist
    // AND verify the target file actually exists on disk so the draft cannot ship
    // dangling local links (e.g. a missing whitepaper-v1-3-draft.html).
    const localPath = href.split('#')[0].split('?')[0];
    if (!localPath) {
      continue;
    }

    if (localPath.endsWith('.html') && !allowedLocalHtmlLinks.has(localPath)) {
      linkIssues.push(`Anchor at line ${line} points to unexpected local HTML file: ${href}`);
    }

    if (!fs.existsSync(path.join(root, localPath))) {
      linkIssues.push(`Anchor at line ${line} points to a missing local target: ${href}`);
    }
  }

  return linkIssues;
}

const staticDraft = readRequired('static homepage v1.3 draft', files.staticDraft);
const publicHomepage = readRequired('public homepage', files.publicHomepage);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const packageJsonText = readRequired('construction-ai package.json', files.packageJson);
const validatorDoc = readRequired('homepage W3C local validator doc', files.validatorDoc);
const staticDraftDoc = readRequired('homepage static asset draft doc', files.staticDraftDoc);

if (errors.length > 0) {
  fail('required files are missing');
}

const packageJson = JSON.parse(packageJsonText);
if (packageJson.scripts?.['check:homepage:w3c'] !== 'node scripts/validate-homepage-v1-3-w3c.mjs') {
  errors.push('package.json is missing check:homepage:w3c');
}

if (!/^<!DOCTYPE html>\s*<html\b/i.test(staticDraft.trimStart())) {
  errors.push('static draft must start with <!DOCTYPE html> followed by <html>');
}

requirePhrase(staticDraft, '<html lang="en">', 'static homepage v1.3 draft');
requirePhrase(staticDraft, '<meta charset="UTF-8">', 'static homepage v1.3 draft');
requirePhrase(staticDraft, '<meta name="viewport" content="width=device-width, initial-scale=1.0">', 'static homepage v1.3 draft');
requirePhrase(staticDraft, '<meta name="robots" content="noindex, nofollow">', 'static homepage v1.3 draft');
requirePhrase(staticDraft, 'Internal Draft - Not Approved For Publication', 'static homepage v1.3 draft');
requirePhrase(staticDraft, 'Publication Gate: NO-GO', 'static homepage v1.3 draft');

for (const tagName of requiredSingleTags) {
  const openCount = collectTags(staticDraft, tagName).length;
  const closeCount = [...staticDraft.matchAll(new RegExp(`</${tagName}>`, 'gi'))].length;
  if (openCount !== 1) {
    errors.push(`static draft should have exactly one <${tagName}> opening tag; found ${openCount}`);
  }
  if (!voidTags.has(tagName) && closeCount !== 1) {
    errors.push(`static draft should have exactly one </${tagName}> closing tag; found ${closeCount}`);
  }
}

const headIndex = staticDraft.search(/<head>/i);
const headCloseIndex = staticDraft.search(/<\/head>/i);
const bodyIndex = staticDraft.search(/<body>/i);
const bodyCloseIndex = staticDraft.search(/<\/body>/i);
if (headIndex < 0 || bodyIndex < 0 || headIndex > bodyIndex || headCloseIndex > bodyIndex || bodyCloseIndex < bodyIndex) {
  errors.push('static draft must keep a valid head-before-body skeleton');
}

errors.push(...validateTagStack(staticDraft));

const duplicateIdErrors = validateDuplicateIds(staticDraft);
errors.push(...duplicateIdErrors);

const idSet = new Set([...staticDraft.matchAll(/\bid\s*=\s*(['"])(.*?)\1/gi)].map((match) => match[2]));
for (const id of requiredSectionIds) {
  if (!idSet.has(id)) {
    errors.push(`missing required section id: ${id}`);
  }
}

errors.push(...validateLinks(staticDraft, idSet));

const sectionCount = collectTags(staticDraft, 'section').length;
if (sectionCount < 5) {
  errors.push(`static draft should have at least five semantic sections; found ${sectionCount}`);
}

const navCount = collectTags(staticDraft, 'nav').length;
if (navCount !== 1) {
  errors.push(`static draft should have exactly one nav; found ${navCount}`);
}

const footerCount = collectTags(staticDraft, 'footer').length;
if (footerCount !== 1) {
  errors.push(`static draft should have exactly one footer; found ${footerCount}`);
}

for (const [label, content] of [
  ['index.html', publicHomepage],
  ['whitepaper.html', publicWhitepaper],
]) {
  if (content.includes('GCSC - Static Homepage Draft') || content.includes('Internal Draft - Not Approved For Publication')) {
    errors.push(`${label} appears to contain static draft-only W3C or draft metadata`);
  }
}

for (const [label, content] of [
  ['homepage W3C local validator doc', validatorDoc],
  ['homepage static asset draft doc', staticDraftDoc],
]) {
  for (const phrase of [
    'check:homepage:w3c',
    'index-v1-3-static-draft.html',
    'local W3C-style',
    'does not approve publication',
    'public `index.html`',
    'public `whitepaper.html`',
  ]) {
    requirePhrase(content, phrase, label);
  }
}

if (errors.length > 0) {
  fail('homepage W3C-style local guard failed', {
    section_count: sectionCount,
    nav_count: navCount,
    footer_count: footerCount,
  });
}

console.log(JSON.stringify({
  status: 'homepage_w3c_local_passed',
  target: 'index-v1-3-static-draft.html',
  local_only: true,
  external_w3c_service_used: false,
  public_files_checked_for_draft_content_only: ['index.html', 'whitepaper.html'],
  checked: {
    doctype: true,
    skeleton: true,
    tag_stack: true,
    duplicate_ids: duplicateIdErrors.length === 0,
    fragment_links: true,
    required_section_ids: requiredSectionIds,
    section_count: sectionCount,
    nav_count: navCount,
    footer_count: footerCount,
  },
}, null, 2));
