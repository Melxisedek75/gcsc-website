// Typed HTTP client for the SmartContractor Railway backend.
// Persists JWT in AsyncStorage; injects Authorization header automatically.

import { safeStorage as AsyncStorage } from './storage';
import { PAYMENT_CONFIG } from './payments';

const TOKEN_KEY = '@gcsc/auth/token';
const USER_KEY = '@gcsc/auth/user';

export type UserRole = 'homeowner' | 'contractor';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  full_name?: string;
  phone?: string;
  verification_status?: string;
  wallet?: { account?: string; permission?: string } | null;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  body?: unknown;
}

let cachedToken: string | null = null;
let cachedUser: AuthUser | null = null;

export async function loadSession(): Promise<{ token: string | null; user: AuthUser | null }> {
  const [token, userRaw] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);
  cachedToken = token;
  cachedUser = userRaw ? safeParse<AuthUser>(userRaw) : null;
  return { token: cachedToken, user: cachedUser };
}

export async function saveSession(token: string, user: AuthUser): Promise<void> {
  cachedToken = token;
  cachedUser = user;
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearSession(): Promise<void> {
  cachedToken = null;
  cachedUser = null;
  await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
}

export function getToken(): string | null {
  return cachedToken;
}

export function getCurrentUser(): AuthUser | null {
  return cachedUser;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = `${PAYMENT_CONFIG.API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers ?? {}),
  };
  if (opts.auth !== false && cachedToken) {
    headers.Authorization = `Bearer ${cachedToken}`;
  }

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body != null ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  const parsed = text ? safeParse<unknown>(text) : null;

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message: extractMessage(parsed) ?? `Request failed: ${res.status}`,
      body: parsed,
    };
    throw err;
  }

  return (parsed ?? {}) as T;
}

function safeParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object') {
    const rec = body as Record<string, unknown>;
    if (typeof rec.error === 'string') return rec.error;
    if (typeof rec.message === 'string') return rec.message;
  }
  return undefined;
}
