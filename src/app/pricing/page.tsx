import { publicPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { SitePage } from '@/components/site/SitePage';

export default async function Pricing() {
  const catalog = await subscriptionCatalog();
  return <SitePage title="필요한 슬롯만큼 월 구독으로." eyebrow="SPREADBRIDGE · MONTHLY MEMBERSHIP" width="wide" description="거래금액별 크레딧 차감 없이 월 구독료만 부과합니다.">
    <div className="site-card-grid">
      {!catalog ? <p role="status">요금 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</p> : !catalog.products.length ? <p role="status">현재 판매 중인 구독 상품이 없습니다.</p> : catalog.products.map(plan => <section className="site-card" key={plan.code}>
        <span className="site-tag">{plan.promotion_label}</span>
        <h2>{plan.name}</h2><p>Spreadbridge 월 구독</p>
        <div className="site-plan-price"><strong>{plan.monthly_krw.toLocaleString('ko-KR')}원</strong><span>/ 월</span></div>
        <p>월 구독 · 매월 갱신</p>
        <ul className="site-features"><li>등록·동시 실행 슬롯 최대 {plan.slots}개</li><li>거래금액별 서비스 수수료 없음</li><li>거래소·증권사 수수료 별도</li><li>유료 구독 회원 전용</li></ul>
        <Link data-analytics-id={"plan_" + plan.code.toLowerCase()} href="/payments/" className="btn primary">구독 관리</Link>
      </section>)}
    </div>
    <div className="site-summary-grid">
      <article><h3>월 구독</h3><p>등록·동시 실행할 슬롯 수에 맞춰 선택하세요.</p></article>
      <article><h3>별도 결제</h3><p>구독 관리에서 결제 사이트의 이용 조건과 갱신 금액을 확인하세요.</p></article>
      <article><h3>이용 기한</h3><p>만료 시 신규 진입은 중단되며 보유 포지션의 청산은 가능합니다.</p></article>
    </div>
  </SitePage>;
}

export const metadata = publicPageMetadata('/pricing/');
