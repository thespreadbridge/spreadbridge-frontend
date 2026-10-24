import { NextResponse } from 'next/server';

export const ACCESS_COOKIE = 'spreadbridge_session';
export const REFRESH_COOKIE = 'spreadbridge_refresh';
export const OAUTH_COOKIE = 'spreadbridge_google_attempt';
export interface Tokens { accessToken: string; refreshToken: string; refreshExpiresAt: string }
export function validTokens(value: unknown): value is Tokens {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<Tokens>;
  return typeof data.accessToken === 'string' && data.accessToken.length > 20
    && typeof data.refreshToken === 'string' && data.refreshToken.length >= 32
    && typeof data.refreshExpiresAt === 'string' && Date.parse(data.refreshExpiresAt) > Date.now();
}
const base = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const });
export function setSessionCookies(response: NextResponse, tokens: Tokens) {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, { ...base(), path: '/', maxAge: 900 });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, { ...base(), path: '/api/session', expires: new Date(tokens.refreshExpiresAt) });
}
export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, '', { ...base(), path: '/', maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, '', { ...base(), path: '/api/session', maxAge: 0 });
}
export function oauthCookieOptions() { return { ...base(), path: '/api/session/google', maxAge: 300 }; }
export function privateResponse(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Vary', 'Cookie');
  return response;
}
