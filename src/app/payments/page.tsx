import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SitePage } from '@/components/site/SitePage';
import { backend } from '@/lib/auth/backend';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';
import { serverSession } from '@/lib/auth/session';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { checkoutLink, kstDate, parseBilling, parseCancellation, won, type CancellationQuote, type CurrentBilling } from '@/lib/subscription-billing';
import { SubscriptionHistory, type SubscriptionReceipt } from '@/components/site/SubscriptionHistory';
import { PlanChangePanel } from '@/components/site/PlanChangePanel';

export const metadata = { title: '구독 관리', robots: { index: false, follow: false } };

async function json(response: Response | null) {
  try { return response?.ok ? await response.json() : null; } catch { return null; }
}

export default async function Payments({ searchParams }: { searchParams: Promise<{ historyPage?: string | string[] }> }) {
  const session = await serverSession();
  if (session.status === 'guest' || session.status === 'refresh_required') redirect('/login/?next=%2Fpayments%2F');
  if (session.status !== 'authenticated' || !session.subscription) return <SitePage title="구독 관리" eyebrow="SPREADBRIDGE · MEMBERSHIP" description="회원과 구독 정보를 확인합니다."><p role="status">구독 정보를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p></SitePage>;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const headers = { Authorization: `Bearer ${token}` };
  const [catalog, history, current, params] = await Promise.all([
    subscriptionCatalog(),
    backend('/subscriptions/history', { headers }).catch(() => null),
    backend('/subscriptions/current', { headers }).catch(() => null),
    searchParams,
  ]);
  const receipts: SubscriptionReceipt[] | null = await json(history);
  const member = session.subscription;
  const billing: CurrentBilling | null = member.active ? parseBilling(await json(current)) : null;
  const refund: CancellationQuote | null = billing ? parseCancellation(await json(await backend('/subscriptions/cancellation-quote', { headers }).catch(() => null))) : null;
  const eligible = session.user.role === 'OWNER' && session.user.emailVerified && session.user.customerStatus === 'ACTIVE';
  const checkout = catalog?.checkoutUrl ?? null;
  const renewal = billing?.renewal ?? null;
  return <SitePage title="구독 관리" eyebrow="SPREADBRIDGE · MEMBERSHIP" width="wide" description={`${session.user.displayName} 님의 구독 상태와 이용 내역을 확인하세요.`}>
    <div className="site-summary-grid">
      <article><h2>현재 플랜</h2><p>{member.active ? member.planName ?? '유료 구독' : '이용 가능한 구독 없음'}</p></article>
      <article><h2>이용 가능 슬롯</h2><p>{member.active ? member.maxActiveSlots : 0}개</p></article>
      <article><h2>이용 기한</h2><p>{member.expiresAt ? kstDate(member.expiresAt) : member.active ? '관리자 지정 이용권' : '—'}</p></article>
    </div>
    {billing ? <div className="site-summary-grid">
      <article><h2>이번 달 결제 요금</h2><p>{won(billing.paidMonthlyKrw)} / 월</p></article>
      <article><h2>다음 결제일</h2><p>{kstDate(billing.periodEnd)}</p></article>
      <article><h2>다음 달 요금</h2><p>{renewal?.monthlyKrw ? `${won(renewal.monthlyKrw)} / 월` : '갱신 구성을 선택해 주세요'}</p></article>
    </div> : null}
    {!catalog ? <p role="status">상품 정보를 불러오지 못했습니다.</p>
      : !catalog.products.length ? <p role="status">현재 판매 중인 구독 상품이 없습니다.</p>
      : member.active && !billing ? <p>관리자가 지정한 이용권은 이 화면에서 구성을 바꿀 수 없습니다. 변경이 필요하면 고객센터로 문의해 주세요.</p>
      : <PlanChangePanel products={catalog.products} addon={catalog.addon} billing={billing} checkoutUrl={checkout} eligible={eligible} />}
    {catalog && !checkout ? <p>결제 사이트 연결을 준비하고 있습니다. 결제나 자동 갱신 청구는 발생하지 않습니다.</p> : null}
    {billing ? <section className="site-plan-change" aria-labelledby="cancel-title"><h2 id="cancel-title">즉시 해지</h2>
      {refund ? <p>지금 해지하면 남은 {refund.remainingDays}일분 이용료 <b>{won(refund.refundAmount)}</b>을 환불합니다. 해지 즉시 신규 진입은 중단되고, 보유 포지션의 청산은 계속 가능합니다.</p> : <p role="status">환불 예정액을 불러오지 못했습니다.</p>}
      {refund && checkout && eligible
        ? <a className="btn ghost" href={checkoutLink(checkout, { action: 'cancel', quotedAt: refund.quotedAt })} target="_blank" rel="noopener noreferrer" data-analytics-id="subscription_cancel">해지 신청</a>
        : refund && eligible
          ? <a className="btn ghost" href={`mailto:contact@thespreadbridge.com?subject=${encodeURIComponent('구독 즉시 해지·환불 신청')}`} data-analytics-id="subscription_cancel_email">이메일로 해지 신청</a>
          : <button type="button" className="btn ghost" disabled>{eligible ? '환불 예정액 확인 필요' : '계정 상태 확인 필요'}</button>}
      {refund && !checkout ? <p>결제 사이트 연결 전에는 고객센터 이메일로 해지를 신청해 주세요. 결제 내역과 남은 일수를 확인한 뒤 위 기준으로 환불합니다.</p> : null}
    </section> : null}
    <section id="subscription-history"><h2>구독 이용 내역</h2>
      <SubscriptionHistory receipts={receipts} page={Array.isArray(params.historyPage) ? params.historyPage[0] : params.historyPage} />
    </section>
  </SitePage>;
}
