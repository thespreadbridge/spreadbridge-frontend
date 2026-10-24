import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { subscriptionCatalog, checkoutTarget } from '@/lib/subscription-catalog';
import { publishedRelease } from '@/lib/published-releases';
import { HomeContent } from '@/components/home-v6/HomeContent';
import Download from '@/app/download/page';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { guestSession } from '@/lib/auth/types';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh() {}, replace() {} }) }));
const downloadHtml = async () => renderToStaticMarkup(<SessionProvider initialSession={guestSession}>{await Download()}</SessionProvider>);

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const plan = { code: 'BASE_5', name: '5슬롯', slots: 5, monthly_krw: 123000, promotion_label: '서버 요금', enabled: true, sort_order: 5 };
const catalog = { products: [plan], checkoutUrl: null, billingPeriod: 'MONTHLY' };
const release = { platform: 'darwin', architecture: 'arm64', status: 'PUBLISHED', version: '1.2.3', artifactUrl: 'https://downloads.example.test/app.zip', sha512: 'A'.repeat(86) + '==', artifactSize: 12345, installationMode: 'MANUAL' };
const target = { platform: 'darwin', architecture: 'arm64' } as const;

describe('live public API data', () => {
  it('uses the dedicated API without serving a stored price after the server changes it', async () => {
    vi.stubEnv('SPREADBRIDGE_API_URL', 'https://api.thespreadbridge.com/v1');
    const fetcher = vi.fn(async () => Response.json(catalog)); vi.stubGlobal('fetch', fetcher);
    const html = renderToStaticMarkup(await HomeContent());
    expect(fetcher).toHaveBeenCalledWith('https://api.thespreadbridge.com/v1/public/subscriptions/catalog', expect.objectContaining({ cache: 'no-store' }));
    expect(html).toContain('123,000'); expect(html).toContain('서버 요금'); expect(html).not.toContain('₩99,000');
  });
  it('does not advertise disabled products', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ...catalog, products: [plan, { ...plan, code: 'DISABLED', enabled: false }] })));
    expect((await subscriptionCatalog())?.products.map(p => p.code)).toEqual(['BASE_5']);
  });
  it('shows a lookup failure instead of old prices on API failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 503 })));
    const html = renderToStaticMarkup(await HomeContent());
    expect(html).toContain('요금 정보를 불러오지 못했습니다'); expect(html).not.toContain('₩99,000');
  });
  it.each([-1, 1.5, '99000'])('rejects an invalid server price %s', async price => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ...catalog, products: [{ ...plan, monthly_krw: price }] })));
    expect(await subscriptionCatalog()).toBeNull();
  });
  it.each(['http://billing.example.test', 'javascript:alert(1)', 'https://user:secret@billing.example.test'])('rejects unsafe checkout URL %s', url => {
    expect(checkoutTarget(url)).toBeNull();
  });
  it('preserves the configured HTTPS checkout URL', () => {
    expect(checkoutTarget('https://billing.example.test/subscribe')?.origin).toBe('https://billing.example.test');
  });
  it('uses published release metadata from the requested platform', async () => {
    const fetcher = vi.fn(async (_input: string) => Response.json({ release })); vi.stubGlobal('fetch', fetcher);
    expect(await publishedRelease(target)).toMatchObject({ status: 'ready', release: { version: '1.2.3' } });
    expect(fetcher.mock.calls[0][0]).toContain('platform=darwin&architecture=arm64&updaterVersion=2');
  });
  it('shows no installer when the new API has no published release', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ release: null })));
    const html = await downloadHtml();
    expect(html).toContain('현재 등록된 설치파일이 없습니다'); expect(html).not.toContain('cloudfront.net'); expect(html).not.toContain('설치파일 다운로드');
  });
  it.each([{ platform: 'win32' }, { status: 'DRAFT' }, { artifactUrl: 'http://downloads.example.test/app.zip' }, { artifactUrl: 'https://downloads.example.test/app.exe' }, { sha512: null }])('does not expose an invalid or mismatched release %j', async changes => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ release: { ...release, ...changes } })));
    expect(await publishedRelease(target)).toEqual({ status: 'unavailable', release: null });
  });
  it('distinguishes release service failure from an empty publication list', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 503 })));
    const html = await downloadHtml(); expect(html).toContain('배포 정보를 불러오지 못했습니다'); expect(html).not.toContain('현재 등록된 설치파일이 없습니다');
  });
});
