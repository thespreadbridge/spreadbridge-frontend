'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SubscriptionBeta } from '@/lib/subscription-catalog';

export function BetaSubscriptionPanel({ beta, active, canEnroll }: {
  beta: SubscriptionBeta; active: boolean; canEnroll: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const subscribed = active || joined;

  async function enroll() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/member/subscription/beta/', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      if (result.active !== true) throw new Error('베타 가입 상태를 확인하지 못했습니다.');
      setJoined(true);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error && error.message ? error.message : '베타에 가입하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="site-plan-change" aria-labelledby="beta-title">
    <h2 id="beta-title">베타 · 월 {beta.monthlyKrw}원</h2>
    <p>기본 {beta.baseSlots}슬롯과 추가 {beta.addonSlots}슬롯을 베타 종료까지 이용할 수 있습니다. 결제 수단 등록 없이 가입할 수 있고 정식 구독은 별도로 신청합니다.</p>
    {subscribed
      ? <p role="status">무료 베타 이용 중</p>
      : <button type="button" className="btn primary" disabled={busy || !canEnroll} onClick={() => void enroll()}>
        {busy ? '베타 가입 중…' : '무료 베타 구독'}
      </button>}
    {message && <p role="alert">{message}</p>}
  </section>;
}
