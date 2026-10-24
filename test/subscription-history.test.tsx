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
});
