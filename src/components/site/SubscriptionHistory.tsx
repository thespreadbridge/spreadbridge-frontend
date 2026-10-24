import { paginate } from '@/lib/pagination';
import { Pagination } from './Pagination';

export interface SubscriptionReceipt {
  id: string; total_slots: number; amount: number; period_start: string; period_end: string; revoked_at: string | null; is_test?: boolean;
}
const date = (value: string) => new Date(value).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
export function receiptStatus(item: SubscriptionReceipt, now: number) {
  if (item.revoked_at) return '취소';
  if (Date.parse(item.period_start) > now) return '시작 예정';
  return Date.parse(item.period_end) > now ? '이용 중' : '만료';
}
export function SubscriptionHistory({ receipts, now = Date.now(), page }: { receipts: SubscriptionReceipt[] | null; now?: number; page?: string | number }) {
  if (receipts === null) return <p role="status">구독 이용 내역을 불러오지 못했습니다.</p>;
  if (!receipts.length) return <p>아직 구독 결제 내역이 없습니다.</p>;
  const { items, ...pagination } = paginate(receipts, page);
  return <>
    {receipts.length === 100 ? <p>최근 100건의 이용 내역입니다.</p> : null}
    <div className="site-table-wrap site-records"><table className="site-record-table subscription-record-table" role="table" aria-label="구독 이용 내역"><thead role="rowgroup"><tr role="row"><th scope="col">플랜</th><th scope="col">금액</th><th scope="col">이용 기간</th><th scope="col">상태</th></tr></thead>
      <tbody role="rowgroup">{items.map(item => <tr key={item.id} role="row">
        <td role="cell" data-label="플랜">{item.total_slots}슬롯{item.is_test ? <span className="site-test-label">테스트</span> : null}</td>
        <td role="cell" data-label="금액" className="record-amount">{item.amount.toLocaleString('ko-KR')}원</td>
        <td role="cell" data-label="이용 기간" className="record-wide"><span className="record-period"><time dateTime={item.period_start}>{date(item.period_start)}</time><span>~</span><time dateTime={item.period_end}>{date(item.period_end)}</time></span></td>
        <td role="cell" data-label="상태" className="record-wide record-status">{receiptStatus(item, now)}</td>
      </tr>)}</tbody>
    </table></div>
    <Pagination {...pagination} basePath="/payments/" pageParam="historyPage" anchor="subscription-history" />
  </>;
}
