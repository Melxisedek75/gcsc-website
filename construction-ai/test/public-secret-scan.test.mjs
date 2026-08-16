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

test('reports only metadata for a database-password assignment', () => {
  const findings = findPublicSecretFindings('public copy\nDATABASE_PASSWORD=not-a-real-password');

  assert.deepEqual(findings, [
    { type: 'database-password-assignment', index: 12, line: 2 },
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

test('reports a PEM private-key header location', () => {
  const findings = findPublicSecretFindings('line one\nline two\n-----BEGIN PRIVATE KEY-----');

  assert.deepEqual(findings, [
    { type: 'pem-private-key', index: 18, line: 3 },
  ]);
});
