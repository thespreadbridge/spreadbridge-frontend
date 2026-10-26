import { publicPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { SitePage } from '@/components/site/SitePage';
import { monthlyBillingNotice, downgradeNotice, subscriptionEndNotice } from '@/lib/public-faq';
import { won } from '@/lib/subscription-billing';

export default async function Pricing() {
  const catalog = await subscriptionCatalog();
  const addon = catalog?.addon ?? null;
  return <SitePage title="운용 규모에 맞는 요금제를 선택하세요" eyebrow="스프레드브리지 · MONTHLY MEMBERSHIP" width="wide" description="거래 금액과 관계없이 선택한 요금제의 월 구독료가 적용됩니다. 거래소·증권사 수수료는 별도입니다.">
    <div className="site-card-grid">
      {!catalog ? <p role="status">요금 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</p> : !catalog.products.length ? <p role="status">현재 판매 중인 구독 상품이 없습니다.</p> : catalog.products.map(plan => <section className="site-card" key={plan.code}>
        {plan.promotion_label ? <span className="site-tag">{plan.promotion_label}</span> : null}
        <h2>{plan.name}</h2><p>스프레드브리지 월 구독</p>
        <div className="site-plan-price"><strong>{won(plan.monthly_krw)}</strong><span>/ 월 · 부가세 포함</span></div>
        <p>월 구독 · 매월 자동 결제</p>
        <ul className="site-features"><li>기본 {plan.slots}슬롯{addon ? ` · 추가 시 최대 ${plan.slots + addon.max_quantity}개` : ''}</li>{addon ? <li>추가 슬롯 1개씩 최대 {addon.max_quantity}개 (월 {won(addon.monthly_krw)})</li> : null}<li>거래금액별 서비스 수수료 없음</li><li>거래소·증권사 수수료 별도</li><li>유료 구독 회원 전용</li></ul>
        <Link data-analytics-id={"plan_" + plan.code.toLowerCase()} href="/payments/" className="btn primary">구독 관리</Link>
      </section>)}
    </div>
    {addon ? <section className="site-card site-addon-card" aria-labelledby="addon-title">
      <span className="site-tag">추가 슬롯</span>
      <h2 id="addon-title">{addon.name}</h2>
      <div className="site-plan-price"><strong>{won(addon.monthly_krw)}</strong><span>/ 월 · 1슬롯 · 부가세 포함</span></div>
      <p>각 기본 요금제에 슬롯을 최대 {addon.max_quantity}개까지 추가할 수 있습니다.</p>
    </section> : null}
    <div className="site-summary-grid">
      <article><h3>업그레이드</h3><p>즉시 적용됩니다. 남은 기간만큼 차액만 결제합니다. (변경 후 월 요금 − 기존 월 요금) × 변경 당일부터 남은 일수 ÷ 현재 결제 주기의 총일수</p></article>
      <article><h3>다운그레이드</h3><p>{downgradeNotice}</p></article>
      <article><h3>즉시 해지</h3><p>현재 결제 주기의 각 결제분에서 미사용 기간에 해당하는 금액을 계산합니다. 해지 당일은 제외하고 다음 날부터 계산하며, 합산한 뒤 원 미만은 버립니다.</p></article>
    </div>
    <p>상위 요금제로 바꾸면 그 요금제에 포함되는 기존 추가 슬롯은 더 이상 청구하지 않습니다. 새 요금제에서도 다시 최대 3개를 추가할 수 있습니다. 기본 요금제는 같은 결제 주기 안에서도 여러 번 상향할 수 있습니다. 결제 전에 이번 추가 결제 금액과 다음 결제일의 청구 금액을 함께 안내합니다.</p>
    <p>{monthlyBillingNotice}</p>
    <p>{subscriptionEndNotice}</p>
  </SitePage>;
}

export const metadata = publicPageMetadata('/pricing/');
