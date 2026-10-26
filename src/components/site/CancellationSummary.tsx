import { calendarDays, kstDate, won, type CancellationQuote } from '@/lib/subscription-billing';

export function CancellationSummary({ quote }: { quote: CancellationQuote }) {
  return <>
    <dl className="site-quote">
      <div><dt>해지일</dt><dd>{kstDate(quote.cancellationDate)}</dd></div>
      <div><dt>환불 대상 기간</dt><dd>{calendarDays(quote.unusedFrom,quote.periodEnd)<=0?'미사용 기간 없음':`${kstDate(quote.unusedFrom)} ~ ${kstDate(quote.periodEnd)} 전날`}</dd></div>
      <div><dt>환불 예정액</dt><dd><strong>{won(quote.refundAmount)}</strong></dd></div>
    </dl>
    <div className="site-table-wrap site-records"><table className="site-record-table" aria-label="결제별 환불 예정액">
      <thead><tr><th scope="col">결제 금액</th><th scope="col">이용기간 총일수</th><th scope="col">미사용일수</th><th scope="col">환불 예정액</th></tr></thead>
      <tbody>{quote.allocations.map(item => <tr key={item.receiptId}>
        <td data-label="결제 금액">{won(item.amount)}</td><td data-label="이용기간 총일수">{item.periodDays}일</td><td data-label="미사용일수">{item.remainingDays}일</td><td data-label="환불 예정액">{won(item.refundAmount)}</td>
      </tr>)}</tbody>
    </table></div>
    <p>추가 결제분은 해당 결제분의 이용기간 총일수를 기준으로 계산합니다. 각 계산값을 합산한 뒤 원 미만을 버립니다. 환불 예정액은 실제 환불 완료 금액과 다를 수 있으며, 처리 결과는 별도로 확인해 주세요.</p>
  </>;
}
