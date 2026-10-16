export type ApiTarget = 'device' | 'local-test';

export function resolveApiTarget(value: string | undefined): ApiTarget {
  if (!value || value === 'device') return 'device';
  if (value === 'local-test') return 'local-test';
  throw new Error('EXPO_PUBLIC_API_TARGET must be device or local-test');
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function resolveApiBaseUrl(value: string | undefined, target: ApiTarget): string {
  const configured = value?.trim();
  if (!configured) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is required for a device build');
  }

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new Error('EXPO_PUBLIC_API_BASE_URL must be an absolute HTTP(S) URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('EXPO_PUBLIC_API_BASE_URL must use HTTP or HTTPS');
  }
  if (target === 'device' && isLoopbackHost(url.hostname)) {
    throw new Error('A loopback API URL cannot be used on a physical device');
  }

  return url.toString().replace(/\/$/, '');
}
