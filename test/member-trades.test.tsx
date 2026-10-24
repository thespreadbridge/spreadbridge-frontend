import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemberTradeTable, type MemberTrade } from '@/components/home-v6/MemberTradeTable';

const trade: MemberTrade = { id: 'trade-1', occurredAt: '2026-10-24T01:00:00Z', action: 'ROLLOVER', futuresSymbol: 'A75611', rolloverFromSymbol: 'A75610', rolloverToSymbol: 'A75611', status: 'EXECUTION_SETTLED', realizedPnl: null };
describe('member trade history', () => {
  it('renders a rollover as rollover with its old and new contract, without labeling it an exit', () => {
    const html = renderToStaticMarkup(<MemberTradeTable items={[trade]} />);
    expect(html).toContain('롤오버'); expect(html).toContain('A75610 → A75611'); expect(html).not.toContain('청산'); expect(html).not.toContain('₩');
  });
  it('supports the current server response before rollover contract metadata is deployed', () => {
    const html = renderToStaticMarkup(<MemberTradeTable items={[{ ...trade, rolloverFromSymbol: undefined, rolloverToSymbol: undefined, status: 'PARTIAL' }]} />);
    expect(html).toContain('롤오버'); expect(html).toContain('A75611'); expect(html).not.toContain('청산'); expect(html).not.toContain('→');
  });
  it('shows realized PnL only for a settled exit', () => {
    const html = renderToStaticMarkup(<MemberTradeTable items={[
      { ...trade, id: 'entry', action: 'ENTRY', realizedPnl: 1111 },
      { ...trade, id: 'roll', realizedPnl: 2222 },
      { ...trade, id: 'failed', action: 'EXIT', status: 'EXECUTION_FAILED', realizedPnl: 3333 },
      { ...trade, id: 'exit', action: 'EXIT', realizedPnl: 4444 },
    ]} />);
    expect(html).toContain('진입'); expect(html).toContain('청산'); expect(html).toContain('+4,444원');
    expect(html).not.toContain('1,111'); expect(html).not.toContain('2,222'); expect(html).not.toContain('3,333');
  });
  it('shows failed and partially filled entries separately and identifies test data', () => {
    const html = renderToStaticMarkup(<MemberTradeTable items={[
      { ...trade, id: 'failed', action: 'ENTRY', status: 'EXECUTION_FAILED', isTest: true },
      { ...trade, id: 'partial', action: 'ENTRY', status: 'PARTIAL', isTest: true },
      { ...trade, id: 'loss', action: 'EXIT', realizedPnl: -3700 },
    ]} />);
    expect(html).toContain('실패'); expect(html).toContain('부분 체결'); expect(html).toContain('테스트'); expect(html).toContain('-3,700원');
  });
});
