import { describe, expect, it } from 'vitest';
import { readingMinutes } from '@/lib/reading-time';
import { insights } from '@/lib/insights';
import { calendarDays, parseCancellation, quoteIsCurrent, REFUND_POLICY_VERSION } from '@/lib/subscription-billing';

const refund = {
  policyVersion: REFUND_POLICY_VERSION, refundAmount: 83969,
  cancellationDate: '2026-11-21', unusedFrom: '2026-11-22', periodEnd: '2026-12-01', quotedAt: '2026-11-21T01:00:00Z',
  allocations: [
    { receiptId: 'base', amount: 99900, periodStart: '2026-11-01', periodEnd: '2026-12-01', periodDays: 30, remainingDays: 9, refundableBalance: 99900, refundAmount: 29970 },
    { receiptId: 'upgrade1', amount: 33333, periodStart: '2026-11-21', periodEnd: '2026-12-01', periodDays: 10, remainingDays: 9, refundableBalance: 33333, refundAmount: 30000 },
    { receiptId: 'upgrade2', amount: 26666, periodStart: '2026-11-21', periodEnd: '2026-12-01', periodDays: 10, remainingDays: 9, refundableBalance: 26666, refundAmount: 23999 },
  ],
};

describe('new refund policy contract', () => {
  it('accepts per-payment allocation including the distributed rounding won', () => {
    const quote = parseCancellation(refund)!;
    expect(quote.refundAmount).toBe(83969);
    expect(quote.allocations.map(a => a.periodDays)).toEqual([30, 10, 10]);
    expect(quote.allocations.reduce((sum, a) => sum + a.refundAmount, 0)).toBe(83969);
  });
  it('hides a legacy quote, incorrect allocation, duplicate payment or a refund above the balance', () => {
    expect(parseCancellation({ ...refund, policyVersion: undefined })).toBeNull();
    expect(parseCancellation({ ...refund, refundAmount: 83968 })).toBeNull();
    expect(parseCancellation({ ...refund, unusedFrom: '2026-11-21' })).toBeNull();
    expect(parseCancellation({ ...refund, allocations: [...refund.allocations, refund.allocations[0]] })).toBeNull();
    expect(parseCancellation({ ...refund, allocations: refund.allocations.map((a, i) => i ? a : { ...a, refundableBalance: 10 }) })).toBeNull();
  });
  it('uses Korea calendar dates and expires a quote at midnight even before one hour', () => {
    expect(calendarDays('2026-10-31T15:01:00Z', '2026-11-30T15:00:00Z')).toBe(30);
    expect(quoteIsCurrent('2026-11-21T14:50:00Z', Date.parse('2026-11-21T14:59:00Z'))).toBe(true);
    expect(quoteIsCurrent('2026-11-21T14:50:00Z', Date.parse('2026-11-21T15:00:00Z'))).toBe(false);
    expect(quoteIsCurrent('2026-11-21T01:00:00Z', Date.parse('2026-11-21T02:00:00Z'))).toBe(false);
    expect(quoteIsCurrent('2026-11-21T01:00:00Z', Date.parse('2026-11-21T00:59:00Z'))).toBe(false);
    expect(quoteIsCurrent('2026-11-21T01:00:01Z', Date.parse('2026-11-21T01:00:00Z'))).toBe(true);
  });
});

describe('editorial reading time', () => {
  it('counts readable body and disclosure text, with 600-character boundaries', () => {
    expect(readingMinutes(`<p>${'가 '.repeat(600)}</p>`)).toBe(1);
    expect(readingMinutes(`<p>${'가'.repeat(600)}</p><details><summary>더</summary><p>보기</p></details>`)).toBe(2);
    expect(readingMinutes('<script>hidden</script><style>hidden</style><!--hidden-->')).toBe(1);
    expect(readingMinutes('&#x1f600;'.repeat(600) + '&nbsp;')).toBe(1);
  });
  it('shares final body-derived values across cards and article pages', () => {
    expect(insights).toHaveLength(14);
    expect(insights.find(p => p.slug === 'spread-and-profit')?.readingMinutes).toBe(3);
    for (const post of insights) {
      expect(post.readingMinutes).toBe(readingMinutes(post.bodyHtml));
      expect(post.bodyHtml).not.toMatch(/Spreadbridge[이은]|스프레드브릿지|부분체결/);
    }
  });
});
