import { publicPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { SitePage } from '@/components/site/SitePage';
import { won } from '@/lib/subscription-billing';

export default async function Pricing() {
  const catalog = await subscriptionCatalog();
  const addon = catalog?.addon ?? null;
  return <SitePage title="필요한 슬롯만큼 월 구독으로." eyebrow="SPREADBRIDGE · MONTHLY MEMBERSHIP" width="wide" description="거래금액별 크레딧 차감 없이 월 구독료만 부과합니다.">
    <div className="site-card-grid">
      {!catalog ? <p role="status">요금 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</p> : !catalog.products.length ? <p role="status">현재 판매 중인 구독 상품이 없습니다.</p> : catalog.products.map(plan => <section className="site-card" key={plan.code}>
        {plan.promotion_label ? <span className="site-tag">{plan.promotion_label}</span> : null}
        <h2>{plan.name}</h2><p>Spreadbridge 월 구독</p>
        <div className="site-plan-price"><strong>{won(plan.monthly_krw)}</strong><span>/ 월</span></div>
        <p>월 구독 · 매월 갱신</p>
        <ul className="site-features"><li>등록·동시 실행 슬롯 최대 {plan.slots}개</li>{addon ? <li>추가 슬롯 1개씩 최대 {addon.max_quantity}개 (월 {won(addon.monthly_krw)})</li> : null}<li>거래금액별 서비스 수수료 없음</li><li>거래소·증권사 수수료 별도</li><li>유료 구독 회원 전용</li></ul>
        <Link data-analytics-id={"plan_" + plan.code.toLowerCase()} href="/payments/" className="btn primary">구독 관리</Link>
      </section>)}
    </div>
    {addon ? <section className="site-card site-addon-card" aria-labelledby="addon-title">
      <span className="site-tag">추가 슬롯</span>
      <h2 id="addon-title">{addon.name}</h2>
      <div className="site-plan-price"><strong>{won(addon.monthly_krw)}</strong><span>/ 월 · 1슬롯</span></div>
      <p>어떤 요금제든 슬롯을 1개씩 더할 수 있습니다. 요금제마다 최대 {addon.max_quantity}개까지 구매할 수 있습니다.</p>
    </section> : null}
    <div className="site-summary-grid">
      <article><h3>업그레이드</h3><p>즉시 적용됩니다. 남은 기간만큼 차액만 결제합니다. (변경 후 요금 − 기존 요금) × 남은 일수 ÷ 이번 달 일수</p></article>
      <article><h3>다운그레이드</h3><p>남은 기간은 지금 구성을 그대로 쓰고, 다음 결제일부터 바뀝니다. 이미 결제한 금액은 환불되지 않습니다.</p></article>
      <article><h3>즉시 해지</h3><p>남은 기간의 이용료를 환불합니다. 해지 후 신규 진입은 중단되며 보유 포지션의 청산은 가능합니다.</p></article>
    </div>
    <p>상위 요금제로 바꾸면 그 요금제에 포함되는 기존 추가 슬롯은 더 이상 청구하지 않습니다. 결제 전에 오늘 결제할 금액과 다음 달 전체 요금을 함께 안내합니다.</p>
  </SitePage>;
}

export const metadata = publicPageMetadata('/pricing/');
