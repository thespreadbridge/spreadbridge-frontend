import { formatWon } from '@/lib/money';

export interface MemberTrade {
  id: string;
  occurredAt: string;
  action: 'ENTRY' | 'EXIT' | 'ROLLOVER';
  futuresSymbol?: string;
  spotSymbol?: string;
  rolloverFromSymbol?: string;
  rolloverToSymbol?: string;
  status: string;
  realizedPnl: number | null;
  isTest?: boolean;
}
const labels = { ENTRY: '진입', EXIT: '청산', ROLLOVER: '롤오버' };
const statuses: Record<string, string> = { EXECUTION_SETTLED: '체결 완료', EXECUTION_FAILED: '실패', PARTIAL: '부분 체결', UNFILLED: '미체결', UNKNOWN: '확인 필요' };

export function MemberTradeTable({ items }: { items: MemberTrade[] }) {
  return <div className="site-table-wrap"><table>
    <thead><tr><th scope="col">시간</th><th scope="col">종목</th><th scope="col">구분</th><th scope="col">체결 상태</th><th scope="col">실현손익</th></tr></thead>
    <tbody>{items.map(item => <tr key={item.id}>
      <td>{new Date(item.occurredAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
      <td>{item.action === 'ROLLOVER'
        ? item.rolloverFromSymbol && item.rolloverToSymbol ? `${item.rolloverFromSymbol} → ${item.rolloverToSymbol}` : item.futuresSymbol ?? '—'
        : `${item.futuresSymbol ?? '—'} / ${item.spotSymbol ?? '—'}`}</td>
      <td>{labels[item.action] ?? '거래'}{item.isTest ? <span className="site-test-label">테스트</span> : null}</td>
      <td>{statuses[item.status] ?? '확인 필요'}</td>
      <td>{item.action === 'EXIT' && item.status === 'EXECUTION_SETTLED' ? formatWon(item.realizedPnl) : '—'}</td>
    </tr>)}</tbody>
  </table></div>;
}
