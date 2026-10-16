import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveApiBaseUrl, resolveApiTarget } from './api-config';

test('rejects a loopback API URL for a physical device build', () => {
  assert.throws(
    () => resolveApiBaseUrl('http://127.0.0.1:10000', 'device'),
    /loopback API URL cannot be used on a physical device/i,
  );
});

test('accepts an explicit HTTPS test backend for a physical device build', () => {
  assert.equal(
    resolveApiBaseUrl('https://api.test.example', 'device'),
    'https://api.test.example',
  );
});

test('requires an explicit API URL instead of silently choosing a live backend', () => {
  assert.throws(
    () => resolveApiBaseUrl(undefined, 'device'),
    /EXPO_PUBLIC_API_BASE_URL is required/i,
  );
});

test('allows loopback only when the build explicitly declares local-test mode', () => {
  assert.equal(resolveApiTarget('local-test'), 'local-test');
  assert.equal(
    resolveApiBaseUrl('http://127.0.0.1:10000', resolveApiTarget('local-test')),
    'http://127.0.0.1:10000',
  );
});

test('rejects an unknown API target instead of weakening device protection', () => {
  assert.throws(() => resolveApiTarget('preview'), /EXPO_PUBLIC_API_TARGET/i);
});
