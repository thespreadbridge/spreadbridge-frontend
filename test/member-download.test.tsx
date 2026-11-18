import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';
import { GET } from '@/app/api/member/download/route';
import { GET as manualAsset } from '@/app/manuals/[...asset]/route';
import Download from '@/app/download/page';
import Manuals from '@/app/manuals/page';
import { resolveSession, serverSession } from '@/lib/auth/session';
import { guestSession, type SiteSession } from '@/lib/auth/types';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';
import { SessionProvider } from '@/components/auth/SessionProvider';

vi.mock('@/lib/auth/session', () => ({ resolveSession: vi.fn(), serverSession: vi.fn() }));
vi.mock('next/navigation', async importOriginal => ({
  ...await importOriginal<typeof import('next/navigation')>(),
  useRouter: () => ({ refresh() {}, replace() {} }),
}));
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
  it.each(['guest', 'refresh_required', 'unavailable'] as const)('redirects %s visitors before fetching installer information', async status => {
    vi.mocked(serverSession).mockResolvedValue({ status, user: null, subscription: null });
    await expect(html()).rejects.toMatchObject({ digest: expect.stringContaining(';/login/?next=%2Fdownload%2F;') });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('uses the authenticated download endpoint rather than embedding the installer URL', async () => {
    const markup = await html();
    expect(markup).toContain('/api/member/download/?platform=win32&amp;architecture=x64');
    expect(markup).toContain('설치파일 다운로드');
    expect(markup).not.toContain(release.artifactUrl);
    expect(markup).not.toContain('href="/manuals');
    expect(markup).toMatch(/href="\/payments\/?"/);
  });
  it('allows the installer for a signed-in member and reserves manual files for an active subscription', async () => {
    const params = { params: Promise.resolve({ asset: ['v1.1', 'install', 'install-guide-v1.1.pdf'] }) };
    expect((await GET(request())).status).toBe(302);
    expect((await manualAsset(request(), params)).status).toBe(403);
    vi.mocked(resolveSession).mockResolvedValue(guestSession);
    expect((await manualAsset(request(), params)).status).toBe(401);
    vi.mocked(resolveSession).mockResolvedValue({ ...member, subscription: { active: true, betaActive: true, planName: '베타', maxActiveSlots: 5, expiresAt: null } });
    const file = await manualAsset(request(), params);
    expect(file.status).toBe(200);
    expect(file.headers.get('content-type')).toBe('application/pdf');
    expect(file.headers.get('cache-control')).toContain('no-store');
    expect(Buffer.from(await file.arrayBuffer()).subarray(0, 5).toString()).toBe('%PDF-');
    const formerSlide = { params: Promise.resolve({ asset: ['v1.1', 'install', 'install-guide-v1.1.pptx'] }) };
    expect((await manualAsset(request(), formerSlide)).status).toBe(404);
  });
  it('offers each manual as a PDF and an on-page reader', async () => {
    const subscriber: SiteSession = { ...member, subscription: { active: true, planName: '베타', maxActiveSlots: 5, expiresAt: null } };
    vi.mocked(serverSession).mockResolvedValue(subscriber);
    const markup = renderToStaticMarkup(<SessionProvider initialSession={subscriber}>{await Manuals()}</SessionProvider>);
    expect(markup.match(/>PDF 다운로드<\/a>/g)).toHaveLength(3);
    expect(markup.match(/class="manual-cover"/g)).toHaveLength(3);
    expect(markup).not.toMatch(/pptx/i);
  });
});
