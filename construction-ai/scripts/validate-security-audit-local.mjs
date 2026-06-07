import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const root = path.basename(cwd) === 'construction-ai' ? path.resolve(cwd, '..') : cwd;

const maxTextBytes = 1_500_000;
const requiredGitignoreEntries = [
  '.env',
  '.env.local',
  '.tmp/',
  'credentials.json',
  'token.json',
  '*.pem',
];

const requiredDocs = [
  'docs/security-audit-local-validator.md',
  'VALIDATORS.md',
  'docs/gcsc-kimi-2-6-phase1-action-register-2026-06-06.md',
];

const highRiskPatterns = [
  {
    id: 'private_key_block',
    regex: /-----BEGIN (?:RSA |OPENSSH |EC |DSA |PGP )?PRIVATE KEY-----/gi,
  },
  {
    id: 'openai_api_key',
    regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{30,}\b/g,
  },
  {
    id: 'stripe_secret_key',
    regex: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g,
  },
  {
    id: 'github_token',
    regex: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g,
  },
  {
    id: 'slack_token',
    regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g,
  },
  {
    id: 'jwt',
    regex: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    id: 'database_url_with_password',
    regex: /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^:\s/]+:[^@\s]+@/gi,
  },
];

function fail(message, extra = {}) {
  console.error(JSON.stringify({
    status: 'security_audit_local_failed',
    redacted_secret_output: true,
    message,
    ...extra,
  }, null, 2));
  process.exit(1);
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function normalizeGitPath(filePath) {
  return filePath.replaceAll('\\', '/');
}

function listTrackedFiles() {
  const output = execFileSync('git', ['-C', root, 'ls-files', '-z'], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });

  return output
    .split('\0')
    .filter(Boolean)
    .map(normalizeGitPath);
}

function isProbablyBinary(buffer) {
  if (buffer.includes(0)) {
    return true;
  }

  const sampleLength = Math.min(buffer.length, 8192);
  let suspicious = 0;
  for (let index = 0; index < sampleLength; index += 1) {
    const byte = buffer[index];
    if (byte < 7 || (byte > 14 && byte < 32)) {
      suspicious += 1;
    }
  }

  return sampleLength > 0 && suspicious / sampleLength > 0.05;
}

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split('\n').length;
}

const packageJsonPath = path.join(root, 'construction-ai/package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
if (packageJson.scripts?.['check:security-audit'] !== 'node scripts/validate-security-audit-local.mjs') {
  fail('package.json is missing the local security audit script');
}

const gitignore = readText('.gitignore');
const missingGitignoreEntries = requiredGitignoreEntries.filter((entry) => !gitignore.includes(entry));
if (missingGitignoreEntries.length > 0) {
  fail('root .gitignore is missing required secret-boundary entries', {
    missing_gitignore_entries: missingGitignoreEntries,
  });
}

for (const relativePath of requiredDocs) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail('required security audit documentation is missing', {
      missing_file: relativePath,
    });
  }
}

const docsText = requiredDocs.map((relativePath) => readText(relativePath)).join('\n');
for (const phrase of [
  'check:security-audit',
  'tracked files only',
  'redacted',
  'does not approve live Supabase',
  'does not approve real payments',
]) {
  if (!docsText.includes(phrase)) {
    fail('security audit documentation is missing a required boundary phrase', {
      missing_phrase: phrase,
    });
  }
}

const trackedFiles = listTrackedFiles();
const findings = [];
let scannedTextFiles = 0;
let skippedBinaryOrLargeFiles = 0;

for (const relativePath of trackedFiles) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    continue;
  }

  const stats = fs.statSync(fullPath);
  if (!stats.isFile() || stats.size > maxTextBytes) {
    skippedBinaryOrLargeFiles += 1;
    continue;
  }

  const buffer = fs.readFileSync(fullPath);
  if (isProbablyBinary(buffer)) {
    skippedBinaryOrLargeFiles += 1;
    continue;
  }

  const text = buffer.toString('utf8');
  scannedTextFiles += 1;

  for (const pattern of highRiskPatterns) {
    pattern.regex.lastIndex = 0;
    let match = pattern.regex.exec(text);
    while (match) {
      findings.push({
        file: relativePath,
        line_number: lineNumberForIndex(text, match.index),
        pattern_id: pattern.id,
      });
      match = pattern.regex.exec(text);
    }
  }
}

if (findings.length > 0) {
  fail('high-risk secret-looking values were detected in tracked files', {
    tracked_files_only: true,
    findings,
  });
}

console.log(JSON.stringify({
  status: 'security_audit_local_passed',
  tracked_files_only: true,
  redacted_secret_output: true,
  tracked_files_total: trackedFiles.length,
  scanned_text_files: scannedTextFiles,
  skipped_binary_or_large_files: skippedBinaryOrLargeFiles,
  checked_gitignore_entries: requiredGitignoreEntries,
}, null, 2));
