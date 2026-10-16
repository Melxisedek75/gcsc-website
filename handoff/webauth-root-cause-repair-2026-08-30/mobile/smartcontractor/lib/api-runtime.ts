import { resolveApiBaseUrl, resolveApiTarget } from './api-config';

// Expo replaces this direct public-environment access at bundle time. Do not
// use optional chaining or a fallback to a live service: those hide a build
// configuration error until it reaches a tester's phone.
export const API_BASE_URL = resolveApiBaseUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL,
  resolveApiTarget(process.env.EXPO_PUBLIC_API_TARGET),
);
