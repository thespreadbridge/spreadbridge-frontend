import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveSession } from '@/lib/auth/session';
import { homeView } from '@/lib/auth/types';

afterEach(() => vi.unstubAllGlobals());
const user = { userId: 'member-1', email: 'member@example.test', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' };
function api(overrides: Record<string, unknown> = {}) {
  const data: Record<string, unknown> = {
    '/v1/auth/me': user, '/v1/auth/profile': { display_name: '실제회원' },
    '/v1/subscriptions/current': { active: true, planName: '15슬롯', maxActiveSlots: 15, expiresAt: new Date(Date.now() + 86400000).toISOString() }, ...overrides,
  };
  const fetcher = vi.fn(async (input: string) => {
    const value = data[new URL(input).pathname];
    return value instanceof Response ? value : Response.json(value);
  });
  vi.stubGlobal('fetch', fetcher); return fetcher;
}
describe('verified account and membership state', () => {
  it('does not contact the API for a guest', async () => { const fetcher = api(); expect(homeView(await resolveSession())).toBe('guest'); expect(fetcher).not.toHaveBeenCalled(); });
  it('requires session renewal after API rejection', async () => { api({ '/v1/auth/me': new Response(null, { status: 401 }) }); expect((await resolveSession('expired-token')).status).toBe('refresh_required'); });
  it('uses real account and entitlement fields without returning credentials', async () => {
    api(); const session = await resolveSession('private-access-token');
    expect(session).toMatchObject({ status: 'authenticated', user: { displayName: '실제회원' }, subscription: { active: true, planName: '15슬롯', maxActiveSlots: 15 } });
    expect(homeView(session)).toBe('paid'); expect(JSON.stringify(session)).not.toContain('private-access-token');
  });
  it('does not grant paid view for a timestamp-expired membership even if a stale response says active', async () => {
    api({ '/v1/subscriptions/current': { active: true, expiresAt: '2020-01-01T00:00:00Z', maxActiveSlots: 30 } });
    expect(homeView(await resolveSession('token'))).toBe('free');
  });
  it('preserves manually assigned subscriptions without an expiry', async () => {
    api({ '/v1/subscriptions/current': { active: true, planName: '관리자 지정', expiresAt: null, maxActiveSlots: 30 } });
    expect(homeView(await resolveSession('token'))).toBe('paid');
  });
  it('shows the unsubscribed view for an authenticated account with no entitlement', async () => { api({ '/v1/subscriptions/current': { active: false, planName: null, maxActiveSlots: 0, expiresAt: null } }); expect(homeView(await resolveSession('token'))).toBe('free'); });
  it('does not treat an unavailable subscription service as a known unpaid account', async () => { api({ '/v1/subscriptions/current': new Response(null, { status: 503 }) }); expect(homeView(await resolveSession('token'))).toBe('pending'); });
  it('does not grant a paid view to a halted account', async () => { api({ '/v1/auth/me': { ...user, customerStatus: 'HALTED' } }); expect(homeView(await resolveSession('token'))).toBe('free'); });
  it('preserves an unavailable state on a network failure instead of claiming the user logged out', async () => { vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network'))); expect((await resolveSession('token')).status).toBe('unavailable'); });
});
