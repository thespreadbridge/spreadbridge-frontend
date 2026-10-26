import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SitePage } from '@/components/site/SitePage';
import { backend } from '@/lib/auth/backend';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';
import { serverSession } from '@/lib/auth/session';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { calendarDays, kstDate, parseBilling, parseCancellation, won, type CancellationQuote, type CurrentBilling } from '@/lib/subscription-billing';
import { SubscriptionHistory, type SubscriptionReceipt } from '@/components/site/SubscriptionHistory';
import { monthlyBillingNotice, subscriptionEndNotice } from '@/lib/public-faq';
import { SubscriptionCancellation } from '@/components/site/SubscriptionCancellation';
import { BillingOperationStatus } from '@/components/site/BillingOperationStatus';
import { parseBillingStatus } from '@/lib/subscription-checkout';
import { PlanChangePanel } from '@/components/site/PlanChangePanel';

export const metadata = { title: '구독 관리', robots: { index: false, follow: false } };

async function json(response: Response | null) {
  try { return response?.ok ? await response.json() : null; } catch { return null; }
}

export default async function Payments({ searchParams }: { searchParams: Promise<{ historyPage?: string | string[] }> }) {
  const session = await serverSession();
  if (session.status === 'guest' || session.status === 'refresh_required') redirect('/login/?next=%2Fpayments%2F');
  if (session.status !== 'authenticated' || !session.subscription) return <SitePage title="구독 관리" eyebrow="스프레드브리지 · MEMBERSHIP" description="회원과 구독 정보를 확인합니다."><p role="status">구독 정보를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p></SitePage>;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const headers = { Authorization: `Bearer ${token}` };
  const eligible = session.user.role === 'OWNER' && session.user.emailVerified && session.user.customerStatus === 'ACTIVE';
  const [catalog, history, current, params, billingResponse] = await Promise.all([
    subscriptionCatalog(),
    backend('/subscriptions/history', { headers }).catch(() => null),
    backend('/subscriptions/current', { headers }).catch(() => null),
    searchParams,
    eligible ? backend('/subscriptions/billing', { headers }).catch(() => null) : Promise.resolve(null),
  ]);
  const receipts: SubscriptionReceipt[] | null = await json(history);
  const member = session.subscription;
  const currentData = await json(current);
  const billing: CurrentBilling | null = member.active ? parseBilling(currentData) : null;
  const managedEntitlement = currentData?.active === true && currentData.billing === null;
  const refund: CancellationQuote | null = billing ? parseCancellation(await json(await backend('/subscriptions/cancellation-quote', { headers }).catch(() => null))) : null;
  const paymentStatus = parseBillingStatus(await json(billingResponse));
  const checkout = catalog?.checkoutUrl ?? null;
  const renewal = billing?.renewal ?? null;
  const base = catalog?.products.find(plan => plan.code === billing?.baseCode);
  const currentBase = base?.name ?? (billing ? billing.baseCode : null);
  const additionalCapacity = billing && catalog?.addon ? Math.max(0, catalog.addon.max_quantity - billing.addonSlots) : 0;
  return <SitePage title="구독 관리" eyebrow="스프레드브리지 · MEMBERSHIP" width="wide" description={`${session.user.displayName} 님의 구독 상태와 이용 내역을 확인하세요.`}>
    {paymentStatus?.latestOperation ? <BillingOperationStatus initial={paymentStatus.latestOperation} /> : null}
    {paymentStatus?.cardRegistered ? <p>결제 카드: {paymentStatus.cardLabel} · {paymentStatus.renewalEnabled ? '자동결제 이용 중' : '자동결제 꺼짐'}</p> : null}
    <div className="site-summary-grid">
      <article><h2>현재 요금제</h2><p>{member.active ? currentBase ?? member.planName ?? '유료 구독' : '이용 가능한 구독 없음'}</p></article>
      <article><h2>이용 가능 슬롯</h2><p>{member.active ? member.maxActiveSlots : 0}개</p></article>
      <article><h2>이용 기한</h2><p>{member.expiresAt ? kstDate(member.expiresAt) : member.active ? '관리자 지정 이용권' : '—'}</p></article>
    </div>
    {billing ? <>
      <div className="site-summary-grid">
        <article><h2>추가 슬롯</h2><p>{billing.addonSlots}개 · {additionalCapacity}개 추가 구매 가능</p></article>
        <article><h2>현재 구성의 월 요금</h2><p>{won(billing.paidMonthlyKrw)} · 부가세 포함</p></article>
        <article><h2>다음 결제일의 청구 금액</h2><p>{renewal?.monthlyKrw != null ? won(renewal.monthlyKrw) : '갱신 구성을 선택해 주세요'}</p></article>
      </div>
      <dl className="site-quote">
        <div><dt>현재 결제 주기 시작일</dt><dd>{kstDate(billing.cycleStart)}</dd></div>
        <div><dt>다음 결제일</dt><dd>{kstDate(billing.periodEnd)}</dd></div>
        <div><dt>현재 결제 주기의 총일수</dt><dd>{calendarDays(billing.cycleStart, billing.periodEnd)}일</dd></div>
      </dl>
    </> : null}
    {!catalog ? <p role="status">상품 정보를 불러오지 못했습니다.</p>
      : !catalog.products.length ? <p role="status">현재 판매 중인 구독 상품이 없습니다.</p>
      : member.active && !billing ? <p role="status">{managedEntitlement ? '관리자가 지정한 이용권은 이 화면에서 구성을 바꿀 수 없습니다. 변경이 필요하면 고객센터로 문의해 주세요.' : '구독 세부 정보를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.'}</p>
      : <PlanChangePanel products={catalog.products} addon={catalog.addon} billing={billing} checkoutUrl={checkout} eligible={eligible} />}
    {catalog && !checkout && !paymentStatus?.enabled ? <p>새 구독 결제 연결을 준비하고 있습니다. 기존 구독의 자동결제 상태는 카드 정보에서 확인해 주세요.</p> : null}
    {billing ? <section className="site-plan-change" aria-labelledby="cancel-title"><h2 id="cancel-title">구독 해지와 환불</h2>
      <p>즉시 해지를 접수하면 이용을 종료합니다. 해지 당일은 미사용일수에 포함하지 않으며, 다음 날부터 다음 결제일 전날까지 각 결제분의 이용기간을 기준으로 환불액을 계산합니다.</p>
      {refund && eligible ? <SubscriptionCancellation quote={refund} enabled={paymentStatus?.enabled ?? false} /> : <p role="status">환불 예정액을 확인하려면 고객센터에 문의해 주세요. 결제 내역과 해지 접수일을 확인해 안내합니다.</p>}
      {!refund && eligible ? <a className="btn ghost" href={`mailto:contact@thespreadbridge.com?subject=${encodeURIComponent('구독 즉시 해지·환불 신청')}`} data-analytics-id="subscription_cancel_email">해지·환불 문의</a> : !eligible ? <button type="button" className="btn ghost" disabled>계정 상태 확인 필요</button> : null}
      {!refund ? <p>이메일 문의만으로 즉시 해지나 환불이 완료되지는 않습니다. 접수와 처리 결과를 확인해 주세요.</p> : null}
      <p>{subscriptionEndNotice}</p>
    </section> : null}
    <p>{monthlyBillingNotice}</p>
    <section id="subscription-history"><h2>구독 이용 내역</h2>
      <SubscriptionHistory receipts={receipts} page={Array.isArray(params.historyPage) ? params.historyPage[0] : params.historyPage} />
    </section>
  </SitePage>;
}
