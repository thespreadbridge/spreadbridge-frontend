'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from '@/components/auth/SessionProvider';
import { homeView } from '@/lib/auth/types';
import { MemberTradeTable, type MemberTrade } from './MemberTradeTable';
import { TestDataNotice } from '@/components/site/TestDataNotice';
import { formatWon } from '@/lib/money';

interface MemberHistory {
  summary: { realizedPnl: number | null; entries: number; exits: number; missingPnlCount: number };
  items: MemberTrade[];
}

export function MemberHome() {
  const { session, refresh } = useSession();
  const view = homeView(session);
  const userId = session.status === 'authenticated' ? session.user.userId : null;
  const [history, setHistory] = useState<{ userId: string; data: MemberHistory | null; failed: boolean } | null>(null);
  useEffect(() => {
    if (view !== 'paid' || !userId) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch('/api/member/summary/', { cache: 'no-store', signal: controller.signal });
        if (response.status === 401 || response.status === 403) void refresh();
        if (!response.ok) throw new Error('History unavailable');
        const data: MemberHistory = await response.json();
        setHistory({ userId, data, failed: false });
      } catch { if (!controller.signal.aborted) setHistory({ userId, data: null, failed: true }); }
    };
    void load();
    const timer = setInterval(() => { if (document.visibilityState === 'visible') void load(); }, 60_000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [view, userId, refresh]);
  if (session.status !== 'authenticated' || !session.subscription || view === 'pending') return null;
  const membership = session.subscription;
  const accountReady = session.user.customerStatus === 'ACTIVE' && session.user.emailVerified;
  const current = history?.userId === userId ? history : null;
  const data = current?.data;
  const remaining = membership.expiresAt ? Math.max(0, Math.ceil((Date.parse(membership.expiresAt) - Date.now()) / 86400000)) : null;
  return <section className="logged-main">
    <div className="wrap">
      {membership.testData ? <TestDataNotice /> : null}
      <div className={`welcome-bar ${view === 'paid' ? 'paid' : ''}`}>
        <div><div className="wb-hi">{view === 'paid' ? '다시 오셨네요' : '환영합니다'}, <b>{session.user.displayName}</b> 님</div>
          <p className="wb-sub">{view === 'paid' ? `${membership.planName ?? '유료 구독'} · 최대 ${membership.maxActiveSlots}슬롯 · ${remaining === null ? '관리자 지정 이용권' : `잔여 ${remaining}일`}` : session.user.customerStatus !== 'ACTIVE' ? '계정 상태를 확인해 주세요. 고객센터에서 이용 가능 여부를 안내합니다.' : !session.user.emailVerified ? '이메일 인증을 완료한 뒤 회원 기능을 이용해 주세요.' : '현재 이용 가능한 유료 구독이 없습니다. 구독 후 회원 기능을 이용할 수 있습니다.'}</p>
        </div>
        <Link href="/payments/" className="btn primary">{view === 'paid' ? '구독 관리' : !accountReady ? '계정 상태 확인' : '지금 구독하기'}</Link>
      </div>
      {view === 'paid' ? <>
        <div className="paid-summary four">
          <div className="ps-card"><span className="ps-lbl">누적 실현손익</span><b className={`ps-val ${(data?.summary.realizedPnl ?? 0) < 0 ? 'down' : 'up'}`}>{formatWon(data?.summary.realizedPnl)}</b></div>
          <div className="ps-card"><span className="ps-lbl">체결 완료 진입</span><b className="ps-val">{data?.summary.entries ?? '—'}</b></div>
          <div className="ps-card"><span className="ps-lbl">이용 가능 슬롯</span><b className="ps-val">{membership.maxActiveSlots}</b></div>
          <div className="ps-card"><span className="ps-lbl">구독 잔여</span><b className="ps-val">{remaining === null ? '관리자 지정' : <>{remaining}<span className="ps-unit">일</span></>}</b></div>
        </div>
        <div className="board board-wide">
          <div className="board-head"><span className="title">내 최근 거래</span><span className="sub">서버에 수신된 거래 기록</span></div>
          <div className="member-history">
            {current?.failed ? <p role="status">거래 기록을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</p> : !data ? <p role="status">거래 기록을 불러오는 중입니다.</p> : !data.items.length ? <p>아직 기록된 거래가 없습니다.</p> : <MemberTradeTable items={data.items} />}
          </div>
          <div className="board-foot">증권사·거래소의 실제 체결 내역도 함께 확인해 주세요.</div>
        </div>
      </> : <div className="site-callout"><p>구독 상태와 이용 기간은 <Link href="/payments/">구독 관리</Link>에서 확인할 수 있습니다.</p></div>}
      <div className="member-actions"><Link href="/download/" className="btn primary">데스크톱 앱 다운로드</Link><Link href="/guide/" className="btn ghost">시작 가이드</Link></div>
    </div>
  </section>;
}
