import { UserProfile } from '../types';

interface AuthResponse {
  user: UserProfile | null;
  error?: string;
}

async function requestAuth(path: string, body?: Record<string, string>, method = body ? 'POST' : 'GET'): Promise<AuthResponse> {
  const response = await fetch(`/api/auth${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 204) return { user: null };

  const result = (await response.json()) as AuthResponse;
  if (!response.ok) throw new Error(result.error || 'Authentication request failed.');
  return result;
}

export async function getCurrentUser() {
  return (await requestAuth('/me')).user;
}

export async function signIn(email: string, password: string) {
  const result = await requestAuth('/login', { email, password });
  if (!result.user) throw new Error('Sign-in did not return an account.');
  return result.user;
}

export async function registerAccount(details: {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
}) {
  const result = await requestAuth('/register', details);
  if (!result.user) throw new Error('Registration did not return an account.');
  return result.user;
}

export async function signOut() {
  await requestAuth('/logout', {});
}

export async function updateAccountProfile(profile: UserProfile) {
  const result = await requestAuth('/me', {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    address: profile.address || ''
  }, 'PATCH');
  if (!result.user) throw new Error('Profile update did not return an account.');
  return result.user;
}