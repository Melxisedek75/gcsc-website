import assert from 'node:assert/strict';
import test from 'node:test';

import { findPublicSecretFindings } from '../src/validation/public-secret-scan.mjs';

test('does not flag benign public safety prose', () => {
  const findings = findPublicSecretFindings([
    'Do not paste a service-role key.',
    'No private key is requested.',
  ].join('\n'));

  assert.deepEqual(findings, []);
});

test('reports only metadata for a Supabase service-role assignment', () => {
  const findings = findPublicSecretFindings('SUPABASE_SERVICE_ROLE_KEY=sbp_12345678901234567890');

  assert.deepEqual(findings, [
    { type: 'supabase-service-role-key', index: 0, line: 1 },
  ]);
});

test('reports only metadata for a private-key assignment', () => {
  const findings = findPublicSecretFindings('PRIVATE_KEY=not-a-real-key-but-long-enough');

  assert.deepEqual(findings, [
    { type: 'private-key-assignment', index: 0, line: 1 },
  ]);
});

test('reports metadata for a private-key assignment inside a prefixed key name', () => {
  const findings = findPublicSecretFindings('APP_PRIVATE_KEY=not-a-real-key-but-long-enough');

  assert.deepEqual(findings, [
    { type: 'private-key-assignment', index: 4, line: 1 },
  ]);
});

test('reports metadata for a quoted prefixed private-key assignment', () => {
  const findings = findPublicSecretFindings('"APP_PRIVATE-KEY"=not-a-real-key-but-long-enough');

  assert.deepEqual(findings, [
    { type: 'private-key-assignment', index: 5, line: 1 },
  ]);
});

test('reports metadata for a quoted private-key assignment', () => {
  const findings = findPublicSecretFindings('"PRIVATE_KEY"=not-a-real-key-but-long-enough');

  assert.deepEqual(findings, [
    { type: 'private-key-assignment', index: 0, line: 1 },
  ]);
});

test('reports only metadata for a database-password assignment', () => {
  const findings = findPublicSecretFindings('public copy\nDATABASE_PASSWORD=not-a-real-password');

  assert.deepEqual(findings, [
    { type: 'database-password-assignment', index: 12, line: 2 },
  ]);
});

test('reports metadata for a space-separated database-password assignment', () => {
  const findings = findPublicSecretFindings('DATABASE PASSWORD=not-a-real-password');

  assert.deepEqual(findings, [
    { type: 'database-password-assignment', index: 0, line: 1 },
  ]);
});

test('reports metadata for a quoted service-role assignment', () => {
  const findings = findPublicSecretFindings('"SERVICE_ROLE_KEY"=service-role-value');

  assert.deepEqual(findings, [
    { type: 'service-role-key-assignment', index: 0, line: 1 },
  ]);
});

test('reports metadata for generic service-role, seed-phrase, and DB-password assignments', () => {
  const findings = findPublicSecretFindings([
    'SERVICE_ROLE_KEY=service-role-value',
    'SEED_PHRASE=seed-phrase-value',
    'DB_PASSWORD=db-password-value',
  ].join('\n'));

  assert.deepEqual(findings, [
    { type: 'service-role-key-assignment', index: 0, line: 1 },
    { type: 'seed-phrase-assignment', index: 36, line: 2 },
    { type: 'database-password-assignment', index: 66, line: 3 },
  ]);
});

test('reports metadata for prefixed seed-phrase and database-password assignments', () => {
  const findings = findPublicSecretFindings([
    'APP_SEED_PHRASE=seed-phrase-value',
    'APP_DATABASE PASSWORD=not-a-real-password',
  ].join('\n'));

  assert.deepEqual(findings, [
    { type: 'seed-phrase-assignment', index: 4, line: 1 },
    { type: 'database-password-assignment', index: 38, line: 2 },
  ]);
});

test('reports one deterministic finding for a quoted lowercase Supabase assignment', () => {
  const findings = findPublicSecretFindings('"supabase_service_role_key"=sbp_12345678901234567890');

  assert.deepEqual(findings, [
    { type: 'supabase-service-role-key', index: 0, line: 1 },
  ]);
});

test('does not flag a service-role assignment without KEY', () => {
  const findings = findPublicSecretFindings('SERVICE_ROLE=administrator');

  assert.deepEqual(findings, []);
});

test('does not flag a private-key assignment whose value starts with a placeholder', () => {
  const findings = findPublicSecretFindings('PRIVATE_KEY=<never-place-a-key-here>');

  assert.deepEqual(findings, []);
});

test('reports a Stripe live-like key location', () => {
  const findings = findPublicSecretFindings('public copy\nsk_live_123456789012345678901234');

  assert.deepEqual(findings, [
    { type: 'stripe-live-secret-key', index: 12, line: 2 },
  ]);
});

test('reports a JWT-shaped string location', () => {
  const findings = findPublicSecretFindings('token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signaturevalue1234567890');

  assert.deepEqual(findings, [
    { type: 'jwt', index: 7, line: 1 },
  ]);
});

test('does not flag a short JWT-like prose string', () => {
  const findings = findPublicSecretFindings('Example token eyJshorttoken.abcdefghijk.abcdefghijk is not a credential.');

  assert.deepEqual(findings, []);
});

test('reports a PEM private-key header location', () => {
  const pemHeader = ['-----BEGIN', 'PRIVATE', 'KEY-----'].join(' ');
  const findings = findPublicSecretFindings(`line one\nline two\n${pemHeader}`);

  assert.deepEqual(findings, [
    { type: 'pem-private-key', index: 18, line: 3 },
  ]);
});
