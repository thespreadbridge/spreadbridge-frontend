import Link from 'next/link';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/landing/SiteFooter';

export default async function Pricing() {
  const {products} = await subscriptionCatalog();
  return <div className="marketing-page"><PublicHeader /><main>
    <section className="simple-hero shell"><span className="eyebrow"><span /> MONTHLY MEMBERSHIP</span><h1>필요한 슬롯만큼<br /><em>월 구독으로.</em></h1><p>거래금액별 크레딧 차감 없이 월 구독료만 부과합니다.</p></section>
    {products.map(plan=><section className="pricing-card shell" key={plan.code}><div><span>{plan.promotion_label}</span><h2>{plan.name}</h2><p>Spreadbridge 월 구독</p></div><div className="price"><strong>{plan.monthly_krw.toLocaleString('ko-KR')}<sup>원</sup></strong><span>월 구독 · 매월 갱신</span></div><ul><li>등록·동시 실행 슬롯 최대 {plan.slots}개</li><li>거래금액별 서비스 수수료 없음</li><li>거래소·증권사 수수료 별도</li><li>유료 구독 회원 전용</li></ul><Link href="https://dollarflow.growbee.ai/payments" className="button button-blue">구독 관리</Link></section>)}
    <section className="principles shell"><article><h3>월 구독</h3><p>등록·동시 실행할 슬롯 수에 맞춰 선택하세요.</p></article><article><h3>별도 결제</h3><p>구독 관리에서 결제 사이트의 이용 조건과 갱신 금액을 확인하세요.</p></article><article><h3>이용 기한</h3><p>만료 시 신규 진입은 중단되며 보유 포지션의 청산은 가능합니다.</p></article></section>
  </main><SiteFooter /></div>;
}

export const metadata = { alternates: { canonical: 'https://thespreadbridge.com/pricing/' } };
