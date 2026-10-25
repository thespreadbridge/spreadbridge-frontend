import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server';
import { GET as quoteRoute } from '@/app/api/member/subscription/quote/route';
import { PUT as scheduleRoute, DELETE as unscheduleRoute } from '@/app/api/member/subscription/scheduled-change/route';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';
import { checkoutLink, parseBilling, parseCancellation, parseQuote, validConfig } from '@/lib/subscription-billing';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { QuoteSummary } from '@/components/site/PlanChangePanel';
import Pricing from '@/app/pricing/page';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { guestSession } from '@/lib/auth/types';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh() {}, replace() {} }) }));
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

const origin = 'http://127.0.0.1:3210';
const token = 'member-access-token'.repeat(3);
const request = (path: string, options: NonNullable<ConstructorParameters<typeof NextRequest>[1]> = {}, withCookie = true) => new NextRequest(origin + path, {
  ...options, headers: { host: '127.0.0.1:3210', ...(withCookie ? { cookie: `${ACCESS_COOKIE}=${token}` } : {}), ...options.headers },
});
// 10/1–11/1 cycle, 5 slots + 3 add-ons (129,600원) upgraded to 15 slots on 10/22: 10 of 31 days left.
const upgrade = {
  direction: 'UPGRADE', removedAddonSlots: 3, remainingDays: 10, periodDays: 31, chargeToday: 22677, nextMonthlyKrw: 199900,
  effectiveAt: '2026-10-22T01:00:00.000Z', nextBillingAt: '2026-10-31T15:00:00.000Z', quotedAt: '2026-10-22T01:00:00.000Z',
  target: { baseCode: 'BASE_15', baseName: '15슬롯', addonSlots: 0, totalSlots: 15, monthlyKrw: 199900 },
  current: { baseCode: 'BASE_5', baseName: '5슬롯', addonSlots: 3, totalSlots: 8, paidMonthlyKrw: 129600, cycleStart: '2026-09-30T15:00:00.000Z', periodEnd: '2026-10-31T15:00:00.000Z' },
};
const downgrade = { ...upgrade, direction: 'DOWNGRADE', chargeToday: 0, removedAddonSlots: 0, nextMonthlyKrw: 99900, effectiveAt: upgrade.nextBillingAt,
  target: { baseCode: 'BASE_5', baseName: '5슬롯', addonSlots: 0, totalSlots: 5, monthlyKrw: 99900 } };
const account = (role = 'OWNER') => (input: string) => {
  const path = new URL(input).pathname;
  if (path === '/v1/auth/me') return Response.json({ userId: 'member-1', email: 'member@example.test', role, emailVerified: true, customerStatus: 'ACTIVE' });
  if (path === '/v1/auth/profile') return Response.json({ display_name: '회원' });
  if (path === '/v1/subscriptions/current') return Response.json({ active: true, planName: '5슬롯 + 추가 3슬롯', maxActiveSlots: 8, expiresAt: '2026-11-01T00:00:00Z' });
  return null;
};

describe('slot pricing data', () => {
  it('reads the add-on product beside the base plans', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ products: [{ code: 'BASE_5', kind: 'BASE', name: '5슬롯', slots: 5, monthly_krw: 99900, promotion_label: '', enabled: true, sort_order: 5 }],
      addon: { code: 'ADDON_1', name: '추가 1슬롯', slots: 1, monthly_krw: 9900, max_quantity: 3 }, checkoutUrl: null, billingPeriod: 'MONTHLY' })));
    const catalog = await subscriptionCatalog();
    expect(catalog?.addon).toEqual({ code: 'ADDON_1', name: '추가 1슬롯', slots: 1, monthly_krw: 9900, max_quantity: 3 });
    const html = renderToStaticMarkup(<SessionProvider initialSession={guestSession}>{await Pricing()}</SessionProvider>);
    expect(html).toContain('99,900원'); expect(html).toContain('9,900원'); expect(html).toContain('최대 3개');
    expect(html).toContain('다음 결제일부터'); expect(html).toContain('남은 기간의 이용료를 환불');
  });
  it('treats an add-on outside the 1-slot, 1–3 quantity rule as missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ products: [], addon: { code: 'ADDON_1', name: '추가', slots: 2, monthly_krw: 9900, max_quantity: 3 }, checkoutUrl: null, billingPeriod: 'MONTHLY' })));
    expect((await subscriptionCatalog())?.addon).toBeNull();
  });
  it('accepts only a known plan code with 0–3 add-ons', () => {
    expect(validConfig('BASE_15', '2')).toEqual({ baseCode: 'BASE_15', addonSlots: 2 });
    for (const [base, addons] of [['BASE_15', '4'], ['BASE_15', '-1'], ['base_15', 0], ['BASE_15', 1.5], [null, 0]]) expect(validConfig(base, addons)).toBeNull();
  });
  it('parses billing, quotes and refunds and rejects incomplete responses', () => {
    expect(parseQuote(upgrade)?.chargeToday).toBe(22677);
    expect(parseQuote({ ...upgrade, current: null })).toBeNull();
    expect(parseQuote({ ...upgrade, chargeToday: -1 })).toBeNull();
    const billing = parseBilling({ billing: { baseCode: 'BASE_5', addonSlots: 3, paidMonthlyKrw: 129600, cycleStart: upgrade.current.cycleStart, periodEnd: upgrade.current.periodEnd,
      renewal: { baseCode: 'BASE_5', addonSlots: 0, monthlyKrw: 99900 }, scheduledChange: { baseCode: 'BASE_5', addonSlots: 0, effectiveAt: upgrade.current.periodEnd } } });
    expect(billing?.renewal?.monthlyKrw).toBe(99900); expect(billing?.scheduledChange?.addonSlots).toBe(0);
    expect(parseBilling({ billing: null })).toBeNull();
    expect(parseCancellation({ refundAmount: 41806, paidMonthlyKrw: 129600, remainingDays: 10, periodDays: 31, periodEnd: upgrade.current.periodEnd, quotedAt: upgrade.quotedAt })?.refundAmount).toBe(41806);
  });
  it('adds plan parameters to the billing site link', () => {
    expect(checkoutLink('https://pay.example.test/checkout?src=site', { action: 'upgrade', plan: 'BASE_15', addons: 0 })).toBe('https://pay.example.test/checkout?src=site&action=upgrade&plan=BASE_15&addons=0');
  });
});

describe('quote summary', () => {
  it('shows today’s prorated charge, next month’s price and the add-ons no longer billed', () => {
    const html = renderToStaticMarkup(<QuoteSummary quote={parseQuote(upgrade)!} />);
    expect(html).toContain('22,677원'); expect(html).toContain('199,900원'); expect(html).toContain('남은 10일 / 31일');
    expect(html).toContain('추가 슬롯 3개는 더 이상 청구되지 않습니다'); expect(html).toContain('2026. 11. 1.');
  });
  it('explains that a downgrade waits for the next billing date without a refund', () => {
    const html = renderToStaticMarkup(<QuoteSummary quote={parseQuote(downgrade)!} />);
    expect(html).toContain('0원'); expect(html).toContain('99,900원'); expect(html).toContain('환불되지 않습니다'); expect(html).toContain('5슬롯 + 추가 3슬롯');
  });
});

describe('member subscription routes', () => {
  it('forwards a validated quote request with the member token', async () => {
    const fetcher = vi.fn(async (input: string, init?: RequestInit) => {
      const url = new URL(input);
      expect(url.pathname).toBe('/v1/subscriptions/change-quote'); expect(url.searchParams.get('baseCode')).toBe('BASE_15'); expect(url.searchParams.get('addonSlots')).toBe('0');
      expect((init?.headers as Record<string, string>).Authorization).toBe(`Bearer ${token}`);
      return Response.json({ ...upgrade, internalNote: 'hidden' });
    });
    vi.stubGlobal('fetch', fetcher);
    const response = await quoteRoute(request('/api/member/subscription/quote/?baseCode=BASE_15&addonSlots=0'));
    expect(response.status).toBe(200); expect(response.headers.get('cache-control')).toContain('no-store');
    const body = await response.json(); expect(body.chargeToday).toBe(22677); expect(body.internalNote).toBeUndefined();
  });
  it('rejects invalid configurations and anonymous requests before calling the API', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    expect((await quoteRoute(request('/api/member/subscription/quote/?baseCode=BASE_15&addonSlots=4'))).status).toBe(400);
    expect((await quoteRoute(request('/api/member/subscription/quote/?baseCode=BASE_15&addonSlots=0', {}, false))).status).toBe(401);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('schedules a downgrade only for a same-origin owner request', async () => {
    const calls: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (input: string, init?: RequestInit) => {
      const known = account()(input); if (known) return known;
      calls.push(`${init?.method} ${new URL(input).pathname} ${init?.body}`);
      return Response.json(downgrade);
    }));
    const put = (headers: Record<string, string>) => scheduleRoute(request('/api/member/subscription/scheduled-change/', { method: 'PUT', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify({ baseCode: 'BASE_5', addonSlots: 0 }) }));
    expect((await put({ origin: 'https://evil.example' })).status).toBe(403);
    const response = await put({ origin });
    expect(response.status).toBe(200); expect((await response.json()).direction).toBe('DOWNGRADE');
    expect(calls).toEqual(['PUT /v1/subscriptions/scheduled-change {"baseCode":"BASE_5","addonSlots":0}']);
  });
  it('refuses members who are not the account owner', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: string) => account('MEMBER')(input) ?? Response.json(downgrade)));
    const response = await unscheduleRoute(request('/api/member/subscription/scheduled-change/', { method: 'DELETE', headers: { origin } }));
    expect(response.status).toBe(403);
  });
  it('cancels a scheduled downgrade with a JSON body the API accepts', async () => {
    let sent: RequestInit | undefined;
    vi.stubGlobal('fetch', vi.fn(async (input: string, init?: RequestInit) => { const known = account()(input); if (known) return known; sent = init; return Response.json({ cancelled: true }); }));
    const response = await unscheduleRoute(request('/api/member/subscription/scheduled-change/', { method: 'DELETE', headers: { origin } }));
    expect(await response.json()).toEqual({ cancelled: true }); expect(sent?.method).toBe('DELETE'); expect(sent?.body).toBe('{}');
  });
});

describe('plan change and refund rules in terms and FAQ', () => {
  it('states the upgrade formula, no downgrade refund and prorated cancellation refund', async () => {
    const { default: Terms } = await import('@/app/terms/page');
    const { Faq } = await import('@/components/landing/Faq');
    const terms = renderToStaticMarkup(<SessionProvider initialSession={guestSession}><Terms /></SessionProvider>);
    expect(terms).toContain('(변경 후 월 요금 − 기존 월 요금) × 남은 일수 ÷ 현재 결제 주기 일수');
    expect(terms).toContain('이미 결제한 이용료의 차액은 환불하지 않습니다');
    expect(terms).toContain('결제한 월 요금 × 남은 일수 ÷ 현재 결제 주기 일수를 환불합니다');
    const faq = renderToStaticMarkup(<Faq />);
    expect(faq).toContain('요금제를 바꾸거나 슬롯을 추가하면'); expect(faq).toContain('구독을 바로 해지하면 환불되나요?');
  });
});
