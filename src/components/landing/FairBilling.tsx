import Link from 'next/link';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
export async function FairBilling() {
  const {products} = await subscriptionCatalog();
  return <section className="sb-section"><div className="shell sb-billing"><div className="sb-billing-copy"><span className="sb-eyebrow">MONTHLY MEMBERSHIP</span><h2 className="sb-h2">필요한 슬롯만큼,<br />월 구독으로 이용하세요.</h2><p className="sb-lead">슬롯별 월 구독. 거래금액별 크레딧 차감 없이 월 구독료만 부과합니다. 거래소·증권사 수수료는 별도입니다.</p><Link href="/pricing" className="button button-ghost">월 구독 요금 확인 ↗</Link></div><div className="sb-ledger"><header className="sb-ledger-head"><span>월 구독 상품</span><strong>매월 갱신</strong></header>{products.map(plan=><div key={plan.code} className="sb-ledger-row"><span className="sb-ledger-icon sb-ledger-check" aria-hidden="true"/><div><strong>{plan.name}</strong><small>월 구독</small></div><b>{plan.monthly_krw.toLocaleString('ko-KR')}원</b></div>)}</div></div></section>;
}
