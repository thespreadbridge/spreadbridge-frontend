import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SitePage } from '@/components/site/SitePage';
import { backend } from '@/lib/auth/backend';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';
import { serverSession } from '@/lib/auth/session';
import { checkoutTarget, subscriptionCatalog } from '@/lib/subscription-catalog';
import { SubscriptionHistory, type SubscriptionReceipt } from '@/components/site/SubscriptionHistory';

const date = (value: string) => new Date(value).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
export const metadata = { title: '구독 관리', robots: { index: false, follow: false } };

export default async function Payments() {
  const session = await serverSession();
  if (session.status === 'guest' || session.status === 'refresh_required') redirect('/login/?next=%2Fpayments%2F');
  if (session.status !== 'authenticated' || !session.subscription) return <SitePage title="구독 관리" eyebrow="SPREADBRIDGE · MEMBERSHIP" description="회원과 구독 정보를 확인합니다."><p role="status">구독 정보를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p></SitePage>;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const [catalog, history] = await Promise.all([
    subscriptionCatalog(),
    backend('/subscriptions/history', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
  ]);
  let receipts: SubscriptionReceipt[] | null = null;
  try {
    if (history?.ok) receipts = await history.json();
  } catch { /* Preserve the verified membership and show an explicit unavailable state below. */ }
  const member = session.subscription;
  const eligible = session.user.role === 'OWNER' && session.user.emailVerified && session.user.customerStatus === 'ACTIVE';
  const checkout = checkoutTarget(catalog?.checkoutUrl ?? null);
  return <SitePage title="구독 관리" eyebrow="SPREADBRIDGE · MEMBERSHIP" width="wide" description={`${session.user.displayName} 님의 구독 상태와 이용 내역을 확인하세요.`}>
    <div className="site-summary-grid">
      <article><h2>현재 플랜</h2><p>{member.active ? member.planName ?? '유료 구독' : '이용 가능한 구독 없음'}</p></article>
      <article><h2>이용 가능 슬롯</h2><p>{member.active ? member.maxActiveSlots : 0}개</p></article>
      <article><h2>이용 기한</h2><p>{member.expiresAt ? date(member.expiresAt) : member.active ? '관리자 지정 이용권' : '—'}</p></article>
    </div>
    <div className="site-card-grid">
      {catalog ? !catalog.products.length ? <p role="status">현재 판매 중인 구독 상품이 없습니다.</p> : catalog.products.map(plan => {
        const target = checkout ? new URL(checkout) : null;
        target?.searchParams.set('plan', plan.code);
        return <section key={plan.code} className="site-card"><span className="site-tag">{plan.promotion_label}</span><h2>{plan.name}</h2>
          <div className="site-plan-price"><strong>{plan.monthly_krw.toLocaleString('ko-KR')}원</strong><span>/ 월</span></div>
          <p>최대 {plan.slots}슬롯 · 거래소·증권사 수수료 별도</p>
          {target && eligible ? <a href={target.toString()} className="btn primary" target="_blank" rel="noopener noreferrer">구독하기</a> : <button type="button" className="btn ghost" disabled>{eligible ? '결제 준비 중' : '계정 상태 확인 필요'}</button>}
        </section>;
      }) : <p role="status">상품 정보를 불러오지 못했습니다.</p>}
    </div>
    {catalog && !checkout ? <p>결제 사이트 연결을 준비하고 있습니다. 결제나 자동 갱신 청구는 발생하지 않습니다.</p> : null}
    <section><h2>구독 이용 내역</h2>
      <SubscriptionHistory receipts={receipts} />
    </section>
  </SitePage>;
}
