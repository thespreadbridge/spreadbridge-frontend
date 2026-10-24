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
}
const labels = { ENTRY: '진입', EXIT: '청산', ROLLOVER: '롤오버' };

export function MemberTradeTable({ items }: { items: MemberTrade[] }) {
  return <div className="site-table-wrap"><table>
    <thead><tr><th scope="col">시간</th><th scope="col">종목</th><th scope="col">구분</th><th scope="col">실현손익</th></tr></thead>
    <tbody>{items.map(item => <tr key={item.id}>
      <td>{new Date(item.occurredAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
      <td>{item.action === 'ROLLOVER'
        ? item.rolloverFromSymbol && item.rolloverToSymbol ? `${item.rolloverFromSymbol} → ${item.rolloverToSymbol}` : item.futuresSymbol ?? '—'
        : `${item.futuresSymbol ?? '—'} / ${item.spotSymbol ?? '—'}`}</td>
      <td>{labels[item.action] ?? '거래'}</td>
      <td>{item.action === 'EXIT' && item.status === 'EXECUTION_SETTLED' && item.realizedPnl != null
        ? `${item.realizedPnl > 0 ? '+' : ''}₩${item.realizedPnl.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}` : '—'}</td>
    </tr>)}</tbody>
  </table></div>;
}
