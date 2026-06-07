import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const root = path.basename(cwd) === 'construction-ai' ? path.resolve(cwd, '..') : cwd;

const requiredDocs = [
  'docs/no-live-actions-local-validator.md',
  'VALIDATORS.md',
  'docs/gcsc-kimi-2-6-phase2-output-intake-2026-06-07.md',
];

const packageScriptCommandPatterns = [
  {
    id: 'deploy_command_in_package_script',
    regex: /\b(?:vercel\s+deploy|wrangler\s+deploy|firebase\s+deploy|netlify\s+deploy|npm\s+publish|gh\s+release|git\s+push)\b/i,
  },
  {
    id: 'supabase_live_command_in_package_script',
    regex: /\bsupabase\s+(?:db\s+push|migration\s+up|functions\s+deploy|secrets\s+set)\b/i,
  },
  {
    id: 'xpr_cli_command_in_package_script',
    regex: /\b(?:cleos|proton)\s+(?:set|push|transfer|deploy)\b/i,
  },
];

const workflowForbiddenPatterns = [
  {
    id: 'deploy_command_in_workflow',
    regex: /\b(?:vercel\s+deploy|wrangler\s+deploy|firebase\s+deploy|netlify\s+deploy|npm\s+publish|gh\s+release)\b/i,
  },
  {
    id: 'live_supabase_command_in_workflow',
    regex: /\bsupabase\s+(?:db\s+push|migration\s+up|functions\s+deploy|secrets\s+set)\b/i,
  },
  {
    id: 'production_environment_in_workflow',
    regex: /\benvironment\s*:\s*production\b/i,
  },
];

const sourceForbiddenPatterns = [
  {
    id: 'xpr_or_wallet_signing_call',
    regex: /\b(?:sendTransaction|signTransaction|wallet\.sign|xpr\.(?:charge|session)\s*\(|eosio\.token::transfer)\b/i,
  },
  {
    id: 'xpr_contract_deploy_call',
    regex: /\b(?:setcode\s*\(|setabi\s*\(|cleos\s+set\s+(?:contract|account))\b/i,
  },
  {
    id: 'public_html_replacement_call',
    regex: /\b(?:writeFileSync|copyFileSync|renameSync|rmSync|unlinkSync)\s*\([^;\n]*(?:index|whitepaper)\.html/i,
  },
  {
    id: 'powershell_public_html_replacement',
    regex: /\b(?:Copy-Item|Move-Item|Remove-Item)\b[^\n]*(?:index|whitepaper)\.html/i,
  },
  {
    id: 'external_write_fetch',
    regex: /fetch\s*\(\s*['"]https?:\/\/(?!127\.0\.0\.1|localhost)[^'"]+['"][\s\S]{0,240}\bmethod\s*:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i,
  },
];

function fail(message, extra = {}) {
  console.error(JSON.stringify({
    status: 'no_live_actions_failed',
    redacted_output: true,
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

  return output.split('\0').filter(Boolean).map(normalizeGitPath);
}

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split('\n').length;
}

function isWorkflowFile(relativePath) {
  return /^\.github\/workflows\/[^/]+\.(?:yml|yaml)$/i.test(relativePath);
}

function isPackageFile(relativePath) {
  return relativePath === 'package.json' || relativePath === 'construction-ai/package.json';
}

function isSourceOrScriptFile(relativePath) {
  if (relativePath === 'construction-ai/scripts/validate-no-live-actions-local.mjs') {
    return false;
  }

  return (
    /^construction-ai\/(?:server|app)\.(?:js|mjs|cjs|ts)$/i.test(relativePath) ||
    /^construction-ai\/(?:public|knowledge|src|scripts)\/.+\.(?:js|mjs|cjs|ts|tsx|ps1)$/i.test(relativePath) ||
    /^contracts\/.+\.(?:ts|tsx|js|mjs)$/i.test(relativePath)
  );
}

function collectMatches(relativePath, text, patterns) {
  const findings = [];
  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    const match = pattern.regex.exec(text);
    if (match) {
      if (pattern.id === 'external_write_fetch' && hasExplicitExternalSendGate(text, match.index)) {
        continue;
      }

      findings.push({
        file: relativePath,
        line_number: lineNumberForIndex(text, match.index),
        pattern_id: pattern.id,
      });
    }
  }

  return findings;
}

function hasExplicitExternalSendGate(text, matchIndex) {
  const gateWindow = text.slice(Math.max(0, matchIndex - 900), matchIndex + 260);
  return (
    gateWindow.includes('SMARTCONTRACTOR_ALLOW_EXTERNAL_SLACK_SEND') &&
    gateWindow.includes("=== 'true'") &&
    gateWindow.includes('SLACK_BOT_TOKEN')
  );
}

const packageJson = JSON.parse(readText('construction-ai/package.json'));
if (packageJson.scripts?.['check:no-live-actions'] !== 'node scripts/validate-no-live-actions-local.mjs') {
  fail('package.json is missing check:no-live-actions');
}

for (const relativePath of requiredDocs) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail('required no-live-actions documentation is missing', { missing_file: relativePath });
  }
}

const docsText = requiredDocs.map((relativePath) => readText(relativePath)).join('\n');
for (const phrase of [
  'check:no-live-actions',
  'tracked files only',
  'redacted',
  'does not approve live Supabase',
  'does not approve public website replacement',
]) {
  if (!docsText.includes(phrase)) {
    fail('no-live-actions documentation is missing a required boundary phrase', {
      missing_phrase: phrase,
    });
  }
}

const trackedFiles = listTrackedFiles();
const findings = [];
let scannedPackageFiles = 0;
let scannedWorkflowFiles = 0;
let scannedSourceFiles = 0;

for (const relativePath of trackedFiles) {
  if (isPackageFile(relativePath)) {
    const text = readText(relativePath);
    scannedPackageFiles += 1;
    findings.push(...collectMatches(relativePath, text, packageScriptCommandPatterns));
    continue;
  }

  if (isWorkflowFile(relativePath)) {
    const text = readText(relativePath);
    scannedWorkflowFiles += 1;
    findings.push(...collectMatches(relativePath, text, workflowForbiddenPatterns));
    continue;
  }

  if (isSourceOrScriptFile(relativePath)) {
    const fullPath = path.join(root, relativePath);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size > 1_500_000) {
      continue;
    }

    const text = readText(relativePath);
    scannedSourceFiles += 1;
    findings.push(...collectMatches(relativePath, text, sourceForbiddenPatterns));
  }
}

if (findings.length > 0) {
  fail('live-action trigger patterns were detected in tracked source/config files', {
    tracked_files_only: true,
    findings,
  });
}

console.log(JSON.stringify({
  status: 'no_live_actions_passed',
  tracked_files_only: true,
  redacted_output: true,
  scanned_package_files: scannedPackageFiles,
  scanned_workflow_files: scannedWorkflowFiles,
  scanned_source_files: scannedSourceFiles,
}, null, 2));
