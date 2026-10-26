'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SubscriptionAddon, SubscriptionProduct } from '@/lib/subscription-catalog';
import { downgradeNotice } from '@/lib/public-faq';
import { quoteIsCurrent, checkoutLink, configLabel, kstDate, parseQuote, won, type ChangeQuote, type CurrentBilling } from '@/lib/subscription-billing';

interface Props {
  products: SubscriptionProduct[];
  addon: SubscriptionAddon | null;
  billing: CurrentBilling | null;
  checkoutUrl: string | null;
  eligible: boolean;
}
type Load = { state: 'idle' | 'loading' | 'error' } | { state: 'ready'; quote: ChangeQuote; key: string };

export function QuoteSummary({ quote }: { quote: ChangeQuote }) {
  const target = configLabel(quote.target.baseName, quote.target.addonSlots);
  if (quote.direction === 'NONE') return <p role="status">현재 이용 중인 구성입니다.</p>;
  if (quote.direction === 'DOWNGRADE') return <dl className="site-quote">
    <div><dt>적용 시점</dt><dd>{kstDate(quote.effectiveAt)} 다음 결제일부터</dd></div>
    <div><dt>이번 추가 결제 금액</dt><dd>{won(0)}</dd></div>
    <div><dt>다음 결제일의 청구 금액</dt><dd>{won(quote.nextMonthlyKrw)} / 월</dd></div>
    <p>{downgradeNotice}</p>
  </dl>;
  return <dl className="site-quote">
    <div><dt>변경 적용일</dt><dd>{kstDate(quote.effectiveAt)}</dd></div>
    <div><dt>변경 후 구성</dt><dd>{target} · 총 {quote.target.totalSlots}슬롯</dd></div>
    <div><dt>이번 추가 결제 금액</dt><dd><strong>{won(quote.chargeToday)}</strong></dd></div>
    <div><dt>다음 결제일의 청구 금액</dt><dd>{won(quote.nextMonthlyKrw)} / 월 · {kstDate(quote.nextBillingAt)}부터</dd></div>
    {quote.direction === 'UPGRADE' && quote.current && quote.remainingDays !== null && quote.periodDays !== null
      ? <p>(변경 후 {won(quote.target.monthlyKrw)} − 기존 {won(quote.current.paidMonthlyKrw)}) × 변경 당일부터 남은 {quote.remainingDays}일 / 현재 결제 주기의 총일수 {quote.periodDays}일. 결제 완료 후 즉시 적용됩니다.</p> : null}
    {quote.removedAddonSlots > 0 ? <p>상위 요금제에 포함되는 기존 추가 슬롯 {quote.removedAddonSlots}개는 더 이상 청구되지 않습니다.</p> : null}
  </dl>;
}

export function PlanChangePanel({ products, addon, billing, checkoutUrl, eligible }: Props) {
  const router = useRouter();
  const maxAddons = addon?.max_quantity ?? 0;
  const initialBase = billing && products.some(p => p.code === billing.baseCode) ? billing.baseCode : products[0]?.code ?? '';
  const [baseCode, setBaseCode] = useState(initialBase);
  const [addonSlots, setAddonSlots] = useState(billing && initialBase === billing.baseCode ? Math.min(billing.addonSlots, maxAddons) : 0);
  const [load, setLoad] = useState<Load>({ state: 'idle' });
  const [reload, setReload] = useState(0);
  const [expired, setExpired] = useState(false);
  const selectionKey = `${baseCode}:${addonSlots}`;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const base = useMemo(() => products.find(p => p.code === baseCode), [products, baseCode]);
  const estimate = base ? base.monthly_krw + (addon?.monthly_krw ?? 0) * addonSlots : 0;

  useEffect(() => {
    if (!base) return;
    const controller = new AbortController();
    setLoad({ state: 'loading' }); setMessage(null);
    const query = new URLSearchParams({ baseCode, addonSlots: String(addonSlots) });
    fetch(`/api/member/subscription/quote/?${query}`, { cache: 'no-store', credentials: 'same-origin', signal: controller.signal })
      .then(async response => {
        const quote = response.ok ? parseQuote(await response.json()) : null;
        if (!controller.signal.aborted) { setExpired(false); setLoad(quote ? { state: 'ready', quote, key: `${baseCode}:${addonSlots}` } : { state: 'error' }); }
      })
      .catch(error => { if ((error as Error).name !== 'AbortError') setLoad({ state: 'error' }); });
    return () => controller.abort();
  }, [base, baseCode, addonSlots, reload]);

  useEffect(() => {
    if (load.state !== 'ready') return;
    const check = () => setExpired(!quoteIsCurrent(load.quote.quotedAt));
    check();
    const timer = setInterval(check, 15000);
    window.addEventListener('focus', check);
    return () => { clearInterval(timer); window.removeEventListener('focus', check); };
  }, [load]);

  const schedule = useCallback(async () => {
    if (load.state !== 'ready' || load.key !== selectionKey || !quoteIsCurrent(load.quote.quotedAt)) { setExpired(true); return; }
    setBusy(true); setMessage(null);
    try {
      const response = await fetch('/api/member/subscription/scheduled-change/', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baseCode, addonSlots }) });
      if (!response.ok) throw new Error('schedule failed');
      setMessage('다음 결제일부터 적용되도록 예약했습니다.');
      router.refresh();
    } catch { setMessage('변경을 예약하지 못했습니다. 잠시 후 다시 시도해 주세요.'); } finally { setBusy(false); }
  }, [baseCode, addonSlots, router, load, selectionKey]);

  const unschedule = useCallback(async () => {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch('/api/member/subscription/scheduled-change/', { method: 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!response.ok) throw new Error('cancel failed');
      setMessage('예약한 변경을 취소했습니다.');
      router.refresh();
    } catch { setMessage('예약을 취소하지 못했습니다. 잠시 후 다시 시도해 주세요.'); } finally { setBusy(false); }
  }, [router]);

  if (!products.length) return null;
  const quote = load.state === 'ready' && load.key === selectionKey && load.quote.target.baseCode === baseCode && load.quote.target.addonSlots === addonSlots && !expired ? load.quote : null;
  const scheduled = billing?.scheduledChange ?? null;
  const scheduledName = scheduled ? configLabel(products.find(p => p.code === scheduled.baseCode)?.name ?? scheduled.baseCode, scheduled.addonSlots) : '';
  const payHref = quote && checkoutUrl && (quote.direction === 'NEW' || (quote.direction === 'UPGRADE' && quote.chargeToday > 0))
    ? checkoutLink(checkoutUrl, { action: quote.direction === 'NEW' ? 'subscribe' : 'upgrade', plan: baseCode, addons: addonSlots, quotedAt: quote.quotedAt }) : null;

  return <section className="site-plan-change" aria-labelledby="plan-change-title">
    <h2 id="plan-change-title">{billing ? '구성 변경' : '구독 구성 선택'}</h2>
    {scheduled ? <div className="site-notice" role="status">
      <p>{kstDate(scheduled.effectiveAt)}부터 <b>{scheduledName}</b>(으)로 변경이 예약되어 있습니다.</p>
      {eligible ? <button type="button" className="btn ghost" disabled={busy} onClick={unschedule}>예약 취소</button> : null}
    </div> : null}
    <fieldset className="site-plan-options"><legend>기본 요금제</legend>
      {products.map(plan => <label key={plan.code} className={plan.code === baseCode ? 'selected' : undefined}>
        <input type="radio" name="baseCode" value={plan.code} checked={plan.code === baseCode} disabled={busy} onChange={() => { setBaseCode(plan.code); setAddonSlots(0); }} />
        <span>{plan.name}</span><b>{won(plan.monthly_krw)}</b>
      </label>)}
    </fieldset>
    {addon ? <div className="site-addon-stepper">
      <span>추가 슬롯 <small>1개당 {won(addon.monthly_krw)} / 월 · 최대 {maxAddons}개</small></span>
      <div role="group" aria-label="추가 슬롯 수">
        <button type="button" className="btn ghost" aria-label="추가 슬롯 줄이기" disabled={busy || addonSlots <= 0} onClick={() => setAddonSlots(n => Math.max(0, n - 1))}>−</button>
        <output aria-live="polite">{addonSlots}개</output>
        <button type="button" className="btn ghost" aria-label="추가 슬롯 늘리기" disabled={busy || addonSlots >= maxAddons} onClick={() => setAddonSlots(n => Math.min(maxAddons, n + 1))}>+</button>
      </div>
    </div> : null}
    {billing ? <p>현재 추가 슬롯 {billing.addonSlots}개 · 현재 구성에서 {Math.max(0, maxAddons - billing.addonSlots)}개 추가 구매 가능. 상위 기본 요금제로 변경하면 기존 추가 슬롯을 흡수하고, 새 요금제에서도 다시 최대 {maxAddons}개를 추가할 수 있습니다.</p> : null}
    <p className="site-plan-total">선택 구성 {base ? configLabel(base.name, addonSlots) : ''} · 총 {(base?.slots ?? 0) + addonSlots}슬롯 · 월 {won(estimate)} · 부가세 포함</p>
    {load.state === 'loading' ? <p role="status">금액을 계산하고 있습니다.</p> : null}
    {load.state === 'error' || expired ? <div role="status"><p>{expired ? '견적 유효기간이 지났습니다. 변경된 금액을 다시 확인하세요.' : '금액을 계산하지 못했습니다.'}</p><button type="button" className="btn ghost" onClick={() => setReload(n => n + 1)}>금액 다시 확인</button></div> : null}
    {load.state === 'ready' ? <p className="site-quote-time">견적 기준 <time dateTime={load.quote.quotedAt}>{new Date(load.quote.quotedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</time></p> : null}
    {quote ? <QuoteSummary quote={quote} /> : null}
    {quote && quote.direction !== 'NONE' ? !eligible
      ? <button type="button" className="btn ghost" disabled>계정 상태 확인 필요</button>
      : quote.direction === 'DOWNGRADE'
        ? <button type="button" className="btn primary" disabled={busy} onClick={schedule} data-analytics-id="plan_downgrade_schedule">다음 결제일부터 변경</button>
        : payHref
          ? <a className="btn primary" href={payHref} onClick={event => { if (!quoteIsCurrent(quote.quotedAt)) { event.preventDefault(); setExpired(true); } }} target="_blank" rel="noopener noreferrer" data-analytics-id={`checkout_${quote.direction.toLowerCase()}`} data-analytics-event="begin_checkout">{quote.direction === 'UPGRADE' ? `${won(quote.chargeToday)} 결제하고 바로 변경` : '구독하기'}</a>
          : <button type="button" className="btn ghost" disabled>{quote.direction === 'UPGRADE' && quote.chargeToday === 0 ? '변경 처리 준비 중' : '결제 준비 중'}</button>
      : null}
    {message ? <p role="status">{message}</p> : null}
  </section>;
}
