import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { googleTarget, isLoopbackOrigin, readAttempt, refreshRequestId, safeReturnTo, sameOrigin } from '@/lib/auth/security';

const state = 's'.repeat(43), codeVerifier = 'v'.repeat(64);
const attempt = JSON.stringify({ state, codeVerifier, flow: 'DESKTOP', returnTo: '/payments/' });
describe('OAuth and request boundaries', () => {
  it.each(['https://evil.example/', '//evil.example/', '/\\evil.example', '/api/session/', '%2F%2Fevil.example', null])('rejects external and unsupported return targets: %s', value => expect(safeReturnTo(value)).toBe('/'));
  it('keeps supported internal return targets', () => expect(safeReturnTo('/payments/')).toBe('/payments/'));
  it('requires the exact initiating state and a well-formed verifier', () => {
    expect(readAttempt(attempt, state)).toMatchObject({ state, codeVerifier, returnTo: '/payments/' });
    for (const [cookie, returned] of [[attempt, 'x'.repeat(43)], [undefined, state], [attempt, null], ['bad-json', state], [JSON.stringify({ state, codeVerifier: 'short', flow: 'WEB' }), state]] as const) expect(() => readAttempt(cookie, returned)).toThrow();
  });
  it('never reflects a tampered return URL from an attempt cookie', () => {
    expect(readAttempt(JSON.stringify({ state, codeVerifier, flow: 'WEB', returnTo: '//evil.example' }), state).returnTo).toBe('/');
  });
  it('accepts only the supported loopback adapter', () => {
    expect(isLoopbackOrigin('http://127.0.0.1:3210')).toBe(true);
    for (const url of ['https://127.0.0.1:3210', 'http://localhost:3210', 'http://127.0.0.1:80', 'https://thespreadbridge.com']) expect(isLoopbackOrigin(url)).toBe(false);
  });
  it('rejects forged and missing origins on state-changing requests', () => {
    const request = (origin?: string, site?: string) => new NextRequest('http://127.0.0.1:3210/api/session/', { method: 'POST', headers: { host: '127.0.0.1:3210', ...(origin ? { origin } : {}), ...(site ? { 'sec-fetch-site': site } : {}) } });
    expect(sameOrigin(request('http://127.0.0.1:3210'))).toBe(true);
    expect(sameOrigin(request('https://evil.example'))).toBe(false);
    expect(sameOrigin(request())).toBe(false);
    expect(sameOrigin(request('http://127.0.0.1:3210', 'cross-site'))).toBe(false);
  });
  it('accepts only Google authorization URLs with the intended signed return metadata', () => {
    const state = `header.${Buffer.from(JSON.stringify({ redirectUri: 'http://127.0.0.1:3210/' })).toString('base64url')}.signature`;
    const url = `https://accounts.google.com/o/oauth2/auth?state=${state}`;
    expect(googleTarget(url, 'http://127.0.0.1:3210/').origin).toBe('https://accounts.google.com');
    expect(() => googleTarget(url, 'https://thespreadbridge.com/api/session/google/callback')).toThrow();
    expect(() => googleTarget('https://accounts.google.com.evil.example/')).toThrow();
  });
  it('uses one replay-safe rotation identifier for concurrent requests with the same refresh token', () => {
    expect(refreshRequestId('one')).toBe(refreshRequestId('one'));
    expect(refreshRequestId('one')).not.toBe(refreshRequestId('two'));
    expect(refreshRequestId('one')).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-8[a-f0-9]{3}-[a-f0-9]{12}$/);
  });
});
