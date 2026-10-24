import { createHash, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

const allowedReturns = new Set(['/', '/payments/', '/pricing/', '/download/']);
export function safeReturnTo(value: unknown) {
  return typeof value === 'string' && allowedReturns.has(value) ? value : '/';
}
export function requestOrigin(request: NextRequest) {
  // NextURL normalizes 127.0.0.1 to localhost; retain the actual browser host for cookies and loopback OAuth.
  const configured = process.env.SPREADBRIDGE_SITE_ORIGIN;
  const url = new URL(configured ?? request.url);
  const host = request.headers.get('host');
  if (!configured && host) url.host = host;
  return url.origin;
}
export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || request.headers.get('sec-fetch-site') === 'cross-site') return false;
  return origin === requestOrigin(request);
}
export function isLoopbackOrigin(origin: string) {
  const url = new URL(origin);
  return url.protocol === 'http:' && url.hostname === '127.0.0.1' && Number(url.port) >= 1024 && Number(url.port) <= 65535;
}
export interface OAuthAttempt { state: string; codeVerifier: string; flow: 'DESKTOP' | 'WEB'; returnTo: string }
export function readAttempt(cookie: string | undefined, state: string | null): OAuthAttempt {
  if (!cookie || !state) throw new Error('Missing OAuth state');
  const data = JSON.parse(cookie) as OAuthAttempt;
  if (!/^[A-Za-z0-9_-]{43}$/.test(data.state) || !/^[A-Za-z0-9_-]{64}$/.test(data.codeVerifier)
    || !['DESKTOP', 'WEB'].includes(data.flow) || state.length !== data.state.length
    || !timingSafeEqual(Buffer.from(data.state), Buffer.from(state))) throw new Error('Invalid OAuth state');
  return { ...data, returnTo: safeReturnTo(data.returnTo) };
}
export function googleTarget(value: string, callback?: string) {
  const url = new URL(value);
  if (url.origin !== 'https://accounts.google.com' || url.username || url.password) throw new Error('Invalid Google destination');
  // Metadata from our trusted API, used only to detect a mismatched return origin.
  // The API verifies its own signed state and PKCE during callback/exchange.
  if (callback) {
    const state = JSON.parse(Buffer.from((url.searchParams.get('state') ?? '').split('.')[1] ?? '', 'base64url').toString());
    if (state.redirectUri !== callback) throw new Error('OAuth callback is not configured for this site');
  }
  return url;
}
export function refreshRequestId(token: string) {
  const hex = createHash('sha256').update(token).digest('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`;
}
