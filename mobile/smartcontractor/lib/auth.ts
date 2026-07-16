// Auth helpers — login/register against Railway /api/auth/*.
// Saves JWT + user to AsyncStorage on success via api.saveSession.

import { apiRequest, AuthUser, clearSession, normalizeUser, saveSession, UserRole } from './api';

interface AuthResponse {
  message?: string;
  token: string;
  user: AuthUser;
}

interface RegisterPendingResponse {
  message?: string;
  verification_required: true;
  verification_channel: 'email' | 'sms';
  email: string;
  phone?: string;
  expires_in_seconds: number;
}

interface RegisterImmediateResponse extends AuthResponse {
  verification_required: false;
  verification_channel?: 'email' | 'sms';
}

export type RegisterResponse = RegisterPendingResponse | RegisterImmediateResponse;

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: { email: email.trim().toLowerCase(), password },
  });
  await saveSession(res.token, res.user);
  return normalizeUser(res.user);
}

interface RegisterArgs {
  email: string;
  password: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
}

export async function register(args: RegisterArgs): Promise<RegisterResponse> {
  const res = await apiRequest<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      email: args.email.trim().toLowerCase(),
      password: args.password,
      role: args.role,
      fullName: args.fullName,
      phone: args.phone,
      verificationMode: 'optional',
    },
  });
  if (!res.verification_required) {
    await saveSession(res.token, res.user);
  }
  return res;
}

export async function fetchProfile(): Promise<AuthUser> {
  const res = await apiRequest<{ user: AuthUser }>('/api/auth/profile');
  return normalizeUser(res.user);
}

interface ProfilePatch {
  wallet?: { account: string; permission: string } | null;
  fullName?: string;
  phone?: string;
}

export async function updateProfile(patch: ProfilePatch): Promise<AuthUser> {
  const res = await apiRequest<{ user: AuthUser }>('/api/auth/profile', {
    method: 'PUT',
    body: patch,
  });
  return normalizeUser(res.user);
}

export async function logout(): Promise<void> {
  await clearSession();
}

interface VerifyResponse {
  message?: string;
  token?: string;
  user?: AuthUser;
}

export async function verifyCode(email: string, otp: string): Promise<AuthUser | null> {
  const res = await apiRequest<VerifyResponse>('/api/verify', {
    method: 'POST',
    auth: false,
    body: { email: email.trim().toLowerCase(), otp: otp.trim() },
  });
  if (res.token && res.user) {
    await saveSession(res.token, res.user);
    return res.user;
  }
  return null;
}
