import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SubscriptionHistory, receiptStatus, type SubscriptionReceipt } from '@/components/site/SubscriptionHistory';

const now = Date.parse('2026-10-24T05:00:00Z');
const receipt: SubscriptionReceipt = { id: 'test', total_slots: 5, amount: 99000, period_start: '2026-10-01T00:00:00Z', period_end: '2026-11-01T00:00:00Z', revoked_at: null };
describe('subscription receipt states', () => {
  it.each([
    [receipt, '이용 중'],
    [{ ...receipt, period_start: '2026-11-01T00:00:00Z', period_end: '2026-12-01T00:00:00Z' }, '시작 예정'],
    [{ ...receipt, period_end: new Date(now).toISOString() }, '만료'],
    [{ ...receipt, revoked_at: '2026-10-20T00:00:00Z' }, '취소'],
  ])('correctly labels the receipt period and revocation', (item, expected) => {
    expect(receiptStatus(item as SubscriptionReceipt, now)).toBe(expected);
  });
  it('identifies test receipts and preserves amount, slot count and dates', () => {
    const html = renderToStaticMarkup(<SubscriptionHistory receipts={[{ ...receipt, is_test: true }]} now={now} />);
    expect(html).toContain('테스트'); expect(html).toContain('99,000'); expect(html).toContain('5슬롯'); expect(html).toContain('이용 중');
  });
  it('distinguishes an empty history from lookup failure', () => {
    expect(renderToStaticMarkup(<SubscriptionHistory receipts={[]} now={now} />)).toContain('아직 구독 결제 내역이 없습니다');
    expect(renderToStaticMarkup(<SubscriptionHistory receipts={null} now={now} />)).toContain('불러오지 못했습니다');
  });
  it('shows ten receipts per page and links to neighboring pages at the history section', () => {
    const receipts = Array.from({ length: 23 }, (_, index) => ({ ...receipt, id: `receipt-${index}`, amount: 10000 + index }));
    const html = renderToStaticMarkup(<SubscriptionHistory receipts={receipts} now={now} page="2" />);
    expect(html).toContain('10,010원'); expect(html).toContain('10,019원');
    expect(html).not.toContain('10,009원'); expect(html).not.toContain('10,020원');
    expect(html).toMatch(/\/payments\/?\?historyPage=1#subscription-history/);
    expect(html).toMatch(/\/payments\/?\?historyPage=3#subscription-history/);
    expect(html).toContain('11–20');
  });
  it('clamps an excessive page to the last available page without a next link', () => {
    const receipts = Array.from({ length: 23 }, (_, index) => ({ ...receipt, id: `receipt-${index}`, amount: 10000 + index }));
    const html = renderToStaticMarkup(<SubscriptionHistory receipts={receipts} now={now} page="999" />);
    expect(html).toContain('10,020원'); expect(html).toContain('10,022원'); expect(html).not.toContain('10,019원');
    expect(html).toContain('21–23'); expect(html).toMatch(/\/payments\/?\?historyPage=2#subscription-history/);
    expect(html).not.toContain('aria-label="다음 페이지"');
  });
  it.each(['-1', 'invalid', '1.5', undefined])('uses the first page for an invalid or missing page (%s)', page => {
    const html = renderToStaticMarkup(<SubscriptionHistory receipts={[receipt]} now={now} page={page} />);
    expect(html).toContain('99,000원'); expect(html).not.toContain('historyPage=');
    expect(html.match(/aria-disabled="true"/g)).toHaveLength(2);
  });
});
