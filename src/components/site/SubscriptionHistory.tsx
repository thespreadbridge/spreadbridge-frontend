export interface SubscriptionReceipt {
  id: string; total_slots: number; amount: number; period_start: string; period_end: string; revoked_at: string | null; is_test?: boolean;
}
const date = (value: string) => new Date(value).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
export function receiptStatus(item: SubscriptionReceipt, now: number) {
  if (item.revoked_at) return '취소';
  if (Date.parse(item.period_start) > now) return '시작 예정';
  return Date.parse(item.period_end) > now ? '이용 중' : '만료';
}
export function SubscriptionHistory({ receipts, now = Date.now() }: { receipts: SubscriptionReceipt[] | null; now?: number }) {
  if (receipts === null) return <p role="status">구독 이용 내역을 불러오지 못했습니다.</p>;
  if (!receipts.length) return <p>아직 구독 결제 내역이 없습니다.</p>;
  return <div className="site-table-wrap"><table><thead><tr><th scope="col">플랜</th><th scope="col">금액</th><th scope="col">이용 기간</th><th scope="col">상태</th></tr></thead>
    <tbody>{receipts.map(item => <tr key={item.id}><td>{item.total_slots}슬롯{item.is_test ? <span className="site-test-label">테스트</span> : null}</td><td>{item.amount.toLocaleString('ko-KR')}원</td><td>{date(item.period_start)} ~ {date(item.period_end)}</td><td>{receiptStatus(item, now)}</td></tr>)}</tbody>
  </table></div>;
}
