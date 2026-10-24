'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Brand } from './brand';
import { useSession } from './auth/SessionProvider';

export function PublicHeader() {
  const { session, logout, refresh, busy } = useSession();
  const [logoutError, setLogoutError] = useState(false);
  return <header className="site-header">
    <div className="site-container site-header-inner">
      <Brand />
      <nav aria-label="주요 메뉴" className="site-nav">
        <Link href="/#how">작동 방식</Link><Link href="/#security">보안</Link><Link href="/#product">요금</Link><Link href="/#faq">FAQ</Link>
      </nav>
      <div className="site-actions">
        {session.status === 'authenticated' ? <>
          <Link className="member-chip" href="/payments/" aria-label={`${session.user.displayName} 님 구독 관리`}>
            <span className="member-avatar" aria-hidden="true">{session.user.displayName.slice(0, 1)}</span><span>{session.user.displayName} 님</span>
          </Link>
          <Link href="/payments/" className="btn ghost">구독 관리</Link>
          <button className="btn ghost" type="button" disabled={busy} onClick={() => { setLogoutError(false); void logout().catch(() => setLogoutError(true)); }}>{busy ? '로그아웃 중' : '로그아웃'}</button>
        </> : session.status === 'unavailable' || session.status === 'refresh_required' ? <>
          <span className="member-status">로그인 정보 확인 {session.status === 'unavailable' ? '실패' : '중'}</span>
          <button className="btn ghost" type="button" onClick={() => void refresh()}>다시 확인</button>
        </> : <>
          <Link href="/login/" className="btn ghost">로그인</Link><Link href="/login/" className="btn primary">시작하기</Link>
        </>}
      </div>
      {logoutError ? <p className="site-form-error" role="alert">로그아웃하지 못했습니다. 다시 시도해 주세요.</p> : null}
    </div>
  </header>;
}
