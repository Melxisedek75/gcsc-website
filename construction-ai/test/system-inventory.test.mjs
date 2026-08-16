import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import test from 'node:test';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDirectory, '..', '..');

function expectInvalidInventoryCsv(rewrite, expectedMessage) {
  const sourceCsvPath = path.join(root, 'docs', 'architecture', '2026-08-component-provenance.csv');
  const originalCsv = fs.readFileSync(sourceCsvPath, 'utf8');
  const tempRoot = path.join(root, '.tmp');
  fs.mkdirSync(tempRoot, { recursive: true });
  const tempDirectory = fs.mkdtempSync(path.join(tempRoot, 'system-inventory-test-'));
  const csvPath = path.join(tempDirectory, 'inventory.csv');
  const relativeCsvPath = path.relative(root, csvPath).split(path.sep).join('/');

  try {
    fs.writeFileSync(csvPath, rewrite(originalCsv), 'utf8');
    const result = spawnSync(process.execPath, [
      'construction-ai/scripts/validate-system-inventory.mjs',
      '--inventory-csv',
      relativeCsvPath,
    ], {
      cwd: root,
      encoding: 'utf8',
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expectedMessage);
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

test('system inventory validator accepts the checked root-only inventory', () => {
  const output = execFileSync(
    process.execPath,
    ['construction-ai/scripts/validate-system-inventory.mjs'],
    { cwd: root, encoding: 'utf8' },
  );

  assert.match(output, /system_inventory_validation_passed/);
  assert.match(output, /tracked_root_only/);
  assert.match(output, /99f2838a5d80bf1c3c1b368c50bcb4a28ef41521/);
  assert.match(output, /baseline_root_dirty/);
});

test('inventory classifies a tracked token source as local source', () => {
  const csv = fs.readFileSync(
    path.join(root, 'docs', 'architecture', '2026-08-component-provenance.csv'),
    'utf8',
  );

  assert.match(csv, /^gcsctoken111,gcsctoken111,directory,LOCAL_SOURCE_VERIFIED,/m);
});

test('inventory rejects an untracked path with a non-external provenance state', () => {
  expectInvalidInventoryCsv(
    (csv) => `${csv}untracked-optional,untracked-optional,directory,EXTERNAL_STATE_UNVERIFIED,Must not pass without tracked source.\n`,
    /untracked path must be EXTERNAL_SOURCE_NOT_PRESENT/,
  );
});

test('inventory rejects Git pathspec syntax that is not a tracked path', () => {
  expectInvalidInventoryCsv(
    (csv) => `${csv}pathspec-glob,:(glob)PROJECT-MAP.md,file,EXTERNAL_STATE_UNVERIFIED,Must not bypass tracked provenance.\n`,
    /untracked path must be EXTERNAL_SOURCE_NOT_PRESENT/,
  );
});

test('inventory rejects a tracked component marked external', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('construction-ai,construction-ai,directory,LOCAL_SOURCE_VERIFIED', 'construction-ai,construction-ai,directory,EXTERNAL_SOURCE_NOT_PRESENT'),
    /tracked path needs local provenance/,
  );
});

test('inventory rejects a substituted path for a required component', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('construction-ai,construction-ai,directory,LOCAL_SOURCE_VERIFIED', 'construction-ai,mobile/smartcontractor,directory,LOCAL_SOURCE_VERIFIED'),
    /required component is missing or misclassified: construction-ai/,
  );
});

test('inventory rejects an unsupported expected kind', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('gcscbuild11,gcscbuild11,directory', 'gcscbuild11,gcscbuild11,sidecar'),
    /unsupported expected kind/,
  );
});

test('inventory rejects quoted CSV fields', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('Tracked local token-contract source', '"Tracked local token-contract source"'),
    /quoted CSV fields are not supported/,
  );
});

test('inventory rejects a CSV override through an external junction', () => {
  const sourceCsvPath = path.join(root, 'docs', 'architecture', '2026-08-component-provenance.csv');
  const externalDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'system-inventory-external-'));
  const localDirectory = fs.mkdtempSync(path.join(root, '.tmp', 'system-inventory-link-'));
  const externalCsvPath = path.join(externalDirectory, 'inventory.csv');
  const localJunctionPath = path.join(localDirectory, 'outside');

  try {
    fs.copyFileSync(sourceCsvPath, externalCsvPath);
    fs.symlinkSync(externalDirectory, localJunctionPath, 'junction');
    const relativeCsvPath = path.relative(root, path.join(localJunctionPath, 'inventory.csv')).split(path.sep).join('/');
    const result = spawnSync(process.execPath, [
      'construction-ai/scripts/validate-system-inventory.mjs',
      '--inventory-csv',
      relativeCsvPath,
    ], {
      cwd: root,
      encoding: 'utf8',
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /inventory CSV path must not contain a symlink/);
  } finally {
    fs.rmSync(localDirectory, { recursive: true, force: true });
    fs.rmSync(externalDirectory, { recursive: true, force: true });
  }
});

test('inventory rejects an inventory Markdown override through an external junction', () => {
  const sourceInventoryPath = path.join(root, 'docs', 'architecture', '2026-08-system-inventory.md');
  const externalDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'system-inventory-doc-external-'));
  const localDirectory = fs.mkdtempSync(path.join(root, '.tmp', 'system-inventory-doc-link-'));
  const externalInventoryPath = path.join(externalDirectory, 'inventory.md');
  const localJunctionPath = path.join(localDirectory, 'outside');

  try {
    fs.copyFileSync(sourceInventoryPath, externalInventoryPath);
    fs.symlinkSync(externalDirectory, localJunctionPath, 'junction');
    const relativeInventoryPath = path.relative(root, path.join(localJunctionPath, 'inventory.md')).split(path.sep).join('/');
    const result = spawnSync(process.execPath, [
      'construction-ai/scripts/validate-system-inventory.mjs',
      '--inventory-doc',
      relativeInventoryPath,
    ], {
      cwd: root,
      encoding: 'utf8',
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /inventory Markdown path must not contain a symlink/);
  } finally {
    fs.rmSync(localDirectory, { recursive: true, force: true });
    fs.rmSync(externalDirectory, { recursive: true, force: true });
  }
});

test('inventory rejects an absolute component path', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('gcscbuild11,gcscbuild11,directory', 'gcscbuild11,C:\\outside,directory'),
    /path must be root-relative/,
  );
});

test('inventory rejects parent-directory traversal', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('gcscbuild11,gcscbuild11,directory', 'gcscbuild11,../outside,directory'),
    /path must be root-relative/,
  );
});

test('inventory rejects an unknown provenance state', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('gcscbuild11,gcscbuild11,directory,EXTERNAL_SOURCE_NOT_PRESENT', 'gcscbuild11,gcscbuild11,directory,UNKNOWN_STATE'),
    /unsupported provenance state/,
  );
});

test('inventory rejects a missing required component', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.split('\n').filter((line) => !line.startsWith('gcscbuild11,')).join('\n'),
    /required component is missing or misclassified: gcscbuild11/,
  );
});

test('inventory rejects an untracked local-source claim', () => {
  expectInvalidInventoryCsv(
    (csv) => `${csv}untracked-local,untracked-local,directory,LOCAL_SOURCE_VERIFIED,Must not claim untracked source.\n`,
    /untracked path must be EXTERNAL_SOURCE_NOT_PRESENT/,
  );
});
