import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';
import { GET } from '@/app/api/member/download/route';
import Download from '@/app/download/page';
import { resolveSession, serverSession } from '@/lib/auth/session';
import { guestSession, type SiteSession } from '@/lib/auth/types';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';
import { SessionProvider } from '@/components/auth/SessionProvider';

vi.mock('@/lib/auth/session', () => ({ resolveSession: vi.fn(), serverSession: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh() {}, replace() {} }) }));
const member: SiteSession = { status: 'authenticated', user: { userId: 'member', email: 'member@example.test', displayName: '회원', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' }, subscription: { active: false, planName: null, maxActiveSlots: 0, expiresAt: null } };
const release = { platform: 'win32', architecture: 'x64', status: 'PUBLISHED', version: '1.2.3', artifactUrl: 'https://downloads.example.test/app.exe', sha512: 'A'.repeat(86) + '==', artifactSize: 12345, installationMode: 'AUTO_UNSIGNED' };
const request = (query = 'platform=win32&architecture=x64') => new NextRequest(`https://thespreadbridge.com/api/member/download/?${query}`, { headers: { cookie: `${ACCESS_COOKIE}=verified-member-token` } });
const html = async () => renderToStaticMarkup(<SessionProvider initialSession={guestSession}>{await Download()}</SessionProvider>);
let fetcher: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.mocked(resolveSession).mockResolvedValue(member);
  vi.mocked(serverSession).mockResolvedValue(member);
  fetcher = vi.fn(async () => Response.json({ release }));
  vi.stubGlobal('fetch', fetcher);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('member-only website downloads', () => {
  it.each(['guest', 'refresh_required'] as const)('sends %s visitors to login with a return to downloads', async status => {
    vi.mocked(resolveSession).mockResolvedValue({ status, user: null, subscription: null });
    const response = await GET(request());
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://thespreadbridge.com/login/?next=%2Fdownload%2F');
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('checks the session cookie and permits a member without a paid subscription', async () => {
    const response = await GET(request());
    expect(resolveSession).toHaveBeenCalledWith('verified-member-token');
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(release.artifactUrl);
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
    expect(response.headers.get('vary')).toBe('Cookie');
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
  });
  it('blocks downloads when identity verification is unavailable', async () => {
    vi.mocked(resolveSession).mockResolvedValue({ status: 'unavailable', user: null, subscription: null });
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(response.headers.get('location')).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each(['', 'platform=linux&architecture=x64', 'platform=win32&architecture=arm64', 'platform=https://evil.example&architecture=x64'])('rejects unsupported targets: %s', async query => {
    expect((await GET(request(query))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('returns 404 for a missing publication and 503 for release service failures', async () => {
    fetcher.mockResolvedValueOnce(Response.json({ release: null }));
    expect((await GET(request())).status).toBe(404);
    fetcher.mockResolvedValueOnce(new Response(null, { status: 503 }));
    expect((await GET(request())).status).toBe(503);
  });
  it.each(['guest', 'refresh_required', 'unavailable'] as const)('shows login links without querying or exposing installers to %s visitors', async status => {
    vi.mocked(serverSession).mockResolvedValue({ status, user: null, subscription: null });
    const markup = await html();
    expect(markup).toContain('로그인 후 다운로드');
    expect(markup).toMatch(/\/login\/?\?next=%2Fdownload%2F/);
    expect(markup).not.toContain(release.artifactUrl);
    expect(markup).not.toContain('/api/member/download/');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('uses the authenticated download endpoint rather than embedding the installer URL', async () => {
    const markup = await html();
    expect(markup).toContain('/api/member/download/?platform=win32&amp;architecture=x64');
    expect(markup).toContain('설치파일 다운로드');
    expect(markup).not.toContain(release.artifactUrl);
  });
});
