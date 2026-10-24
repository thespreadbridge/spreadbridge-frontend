import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as start } from '@/app/api/session/google/start/route';
import { GET as callback } from '@/app/api/session/google/callback/route';
import { GET as getSession, POST as changeSession } from '@/app/api/session/route';
import { GET as memberSummary } from '@/app/api/member/summary/route';
import { ACCESS_COOKIE, REFRESH_COOKIE, OAUTH_COOKIE } from '@/lib/auth/cookies';

const origin = 'http://127.0.0.1:3210';
const state = 's'.repeat(43), verifier = 'v'.repeat(64);
const attempt = JSON.stringify({ state, codeVerifier: verifier, flow: 'DESKTOP', returnTo: '/payments/' });
const tokens = { accessToken: 'private-access-token'.repeat(4), refreshToken: 'private-refresh-token'.repeat(3), refreshExpiresAt: new Date(Date.now() + 86400000).toISOString() };
const request = (path: string, cookies: Record<string, string> = {}, options: NonNullable<ConstructorParameters<typeof NextRequest>[1]> = {}) => new NextRequest(origin + path, { ...options, headers: { host: '127.0.0.1:3210', cookie: Object.entries(cookies).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('; '), ...options.headers } });
const fetchAccount = (active = true) => vi.fn(async (input: string) => {
  const path = new URL(input).pathname;
  if (path === '/v1/auth/me') return Response.json({ userId: 'member-1', email: 'member@example.test', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' });
  if (path === '/v1/auth/profile') return Response.json({ display_name: '회원' });
  if (path === '/v1/subscriptions/current') return Response.json({ active, planName: active ? '5슬롯' : null, maxActiveSlots: active ? 5 : 0, expiresAt: null });
  return Response.json({ ok: true });
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('same-site login and session endpoints', () => {
  it('starts the supported loopback flow and keeps the verifier in an HttpOnly cookie', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: string) => {
      const api = new URL(input); expect(api.pathname).toBe('/v1/auth/google/desktop/start');
      expect(api.searchParams.get('redirectUri')).toBe(origin + '/');
      const signed = `head.${Buffer.from(JSON.stringify({ redirectUri: origin + '/' })).toString('base64url')}.sig`;
      return new Response(null, { status: 302, headers: { location: `https://accounts.google.com/o/oauth2/auth?state=${signed}` } });
    }));
    const response = await start(request('/api/session/google/start/?next=%2Fpayments%2F'));
    expect(new URL(response.headers.get('location')!).origin).toBe('https://accounts.google.com');
    expect(response.cookies.get(OAUTH_COOKIE)).toMatchObject({ httpOnly: true, path: '/api/session/google', maxAge: 300, sameSite: 'lax' });
    const data = JSON.parse(response.cookies.get(OAUTH_COOKIE)!.value);
    expect(data).toMatchObject({ flow: 'DESKTOP', returnTo: '/payments/' });
    expect(data.codeVerifier).toHaveLength(64);
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
  it('fails closed instead of sending a public site login back to the legacy origin', async () => {
    const signed = `head.${Buffer.from(JSON.stringify({ redirectUri: 'https://dollarflow.growbee.ai/api/session/google/callback' })).toString('base64url')}.sig`;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ url: `https://accounts.google.com/o/oauth2/auth?state=${signed}` })));
    const response = await start(new NextRequest('https://thespreadbridge.com/api/session/google/start/'));
    expect(response.headers.get('location')).toBe('https://thespreadbridge.com/login/?error=oauth_unavailable');
    expect(response.cookies.get(OAUTH_COOKIE)).toBeUndefined();
  });
  it.each([undefined, JSON.stringify({ state: 'x'.repeat(43), codeVerifier: verifier, flow: 'DESKTOP' })])('does not exchange a callback from another browser attempt', async value => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    const response = await callback(request(`/api/session/google/callback/?state=${state}&code=${'c'.repeat(48)}`, value ? { [OAUTH_COOKIE]: value } : {}));
    expect(response.headers.get('location')).toContain('/login/?error=oauth_error'); expect(fetcher).not.toHaveBeenCalled();
  });
  it('exchanges the one-time code on the server and never puts account tokens in a redirect URL', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: string, init: RequestInit) => {
      expect(new URL(input).pathname).toBe('/v1/auth/google/desktop/exchange');
      expect(JSON.parse(init.body as string)).toEqual({ code: 'c'.repeat(48), codeVerifier: verifier });
      return Response.json(tokens);
    }));
    const response = await callback(request(`/api/session/google/callback/?state=${state}&code=${'c'.repeat(48)}`, { [OAUTH_COOKIE]: attempt }));
    expect(response.headers.get('location')).toBe(origin + '/payments/');
    expect(response.cookies.get(ACCESS_COOKIE)).toMatchObject({ value: tokens.accessToken, httpOnly: true, sameSite: 'lax', path: '/' });
    expect(response.cookies.get(REFRESH_COOKIE)).toMatchObject({ httpOnly: true, path: '/api/session' });
    expect(response.cookies.get(OAUTH_COOKIE)?.maxAge).toBe(0);
  });
  it('clears the attempt after cancellation without creating a session', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    const response = await callback(request(`/api/session/google/callback/?state=${state}&error=access_denied`, { [OAUTH_COOKIE]: attempt }));
    expect(response.headers.get('location')).toContain('error=access_denied'); expect(response.cookies.get(ACCESS_COOKIE)).toBeUndefined(); expect(fetcher).not.toHaveBeenCalled();
  });
  it('marks production session cookies Secure', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(tokens)));
    const response = await callback(request(`/api/session/google/callback/?state=${state}&code=${'c'.repeat(48)}`, { [OAUTH_COOKIE]: attempt }));
    expect(response.cookies.get(ACCESS_COOKIE)?.secure).toBe(true); expect(response.cookies.get(REFRESH_COOKIE)?.secure).toBe(true);
  });
  it('returns real membership data while stripping bearer credentials from the response', async () => {
    vi.stubGlobal('fetch', fetchAccount());
    const response = await getSession(request('/api/session/', { [ACCESS_COOKIE]: tokens.accessToken }));
    const payload = await response.text(); expect(payload).toContain('5슬롯'); expect(payload).not.toContain(tokens.accessToken); expect(payload).not.toContain(tokens.refreshToken);
  });
  it('requests refresh when only a refresh cookie remains', async () => {
    expect(await (await getSession(request('/api/session/', { [REFRESH_COOKIE]: tokens.refreshToken }))).json()).toMatchObject({ status: 'refresh_required' });
  });
  it('rejects cross-origin logout and refresh before calling the API', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    const response = await changeSession(request('/api/session/', { [ACCESS_COOKIE]: tokens.accessToken }, { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'logout' }) }));
    expect(response.status).toBe(403); expect(fetcher).not.toHaveBeenCalled();
  });
  it('renews expired cookies and returns only public session fields', async () => {
    const account = fetchAccount();
    vi.stubGlobal('fetch', vi.fn(async (input: string, init: RequestInit) => new URL(input).pathname === '/v1/auth/refresh' ? Response.json(tokens) : account(input)));
    const response = await changeSession(request('/api/session/', { [REFRESH_COOKIE]: tokens.refreshToken }, { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'refresh' }) }));
    expect(response.cookies.get(ACCESS_COOKIE)?.value).toBe(tokens.accessToken); expect(await response.json()).toMatchObject({ status: 'authenticated', subscription: { active: true } });
  });
  it('preserves refresh credentials during temporary API downtime', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    const response = await changeSession(request('/api/session/', { [REFRESH_COOKIE]: tokens.refreshToken }, { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'refresh' }) }));
    expect(response.status).toBe(503); expect(response.cookies.get(REFRESH_COOKIE)).toBeUndefined();
  });
  it('revokes logout and expires both cookies at their original paths', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ loggedOut: true })); vi.stubGlobal('fetch', fetcher);
    const response = await changeSession(request('/api/session/', { [ACCESS_COOKIE]: tokens.accessToken }, { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'logout' }) }));
    expect(fetcher.mock.calls[0][0]).toContain('/auth/logout');
    expect(response.cookies.get(ACCESS_COOKIE)).toMatchObject({ maxAge: 0, path: '/' }); expect(response.cookies.get(REFRESH_COOKIE)).toMatchObject({ maxAge: 0, path: '/api/session' });
  });
  it('revokes the rotated session when logout overlaps with token refresh', async () => {
    const fetcher = vi.fn(async (input: string, init: RequestInit) => {
      if (new URL(input).pathname === '/v1/auth/refresh') return Response.json(tokens);
      expect(new URL(input).pathname).toBe('/v1/auth/logout');
      expect(init.headers).toMatchObject({ Authorization: `Bearer ${tokens.accessToken}` });
      return Response.json({ loggedOut: true });
    });
    vi.stubGlobal('fetch', fetcher);
    const response = await changeSession(request('/api/session/', { [ACCESS_COOKIE]: 'old-access', [REFRESH_COOKIE]: 'old-refresh' }, { method: 'POST', headers: { origin }, body: JSON.stringify({ mode: 'logout' }) }));
    expect(fetcher).toHaveBeenCalledTimes(2); expect(await response.json()).toMatchObject({ status: 'guest' }); expect(response.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(0);
  });
  it('protects member data on the server regardless of client view parameters', async () => {
    expect((await memberSummary(request('/api/member/summary/?view=paid'))).status).toBe(401);
    vi.stubGlobal('fetch', fetchAccount(false)); expect((await memberSummary(request('/api/member/summary/?view=paid', { [ACCESS_COOKIE]: tokens.accessToken }))).status).toBe(403);
  });
  it('loads only the signed-in paid member trade summary using their server credential', async () => {
    const account = fetchAccount();
    const history = { summary: { realizedPnl: 4200, entries: 2, exits: 1, missingPnlCount: 0 }, items: [{ id: 'trade-1', action: 'EXIT', realizedPnl: 4200 }] };
    vi.stubGlobal('fetch', vi.fn(async (input: string, init: RequestInit) => {
      if (new URL(input).pathname !== '/v1/history/trades') return account(input);
      expect(new URL(input).search).toBe('?month=all&limit=5&source=SPREADBRIDGE');
      expect(init.headers).toMatchObject({ Authorization: `Bearer ${tokens.accessToken}` });
      return Response.json(history);
    }));
    const response = await memberSummary(request('/api/member/summary/', { [ACCESS_COOKIE]: tokens.accessToken }));
    expect(response.status).toBe(200); expect(await response.json()).toEqual(history);
  });
});
