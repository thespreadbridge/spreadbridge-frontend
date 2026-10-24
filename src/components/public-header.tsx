'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Brand } from './brand';
import { useSession } from './auth/SessionProvider';

export function PublicHeader() {
  const { session, logout, refresh, busy } = useSession();
  const [logoutError, setLogoutError] = useState(false);
  return (
    <header className="public-header shell">
      <Brand />
      <nav aria-label="주요 메뉴" className="sb-nav">
        <Link href="/#principle">원리</Link>
        <Link href="/pricing">요금</Link>
        <Link href="/guide">가이드</Link>
        <Link href="/blog/">인사이트</Link>
        <Link href="/download">앱 다운로드</Link>
      </nav>
      <div className="header-actions">
        {session.status === 'authenticated' ? <>
          <Link href="/payments/" className="text-button">{session.user.displayName} 님</Link>
          <button type="button" className="button button-blue" disabled={busy} onClick={() => { setLogoutError(false); void logout().catch(() => setLogoutError(true)); }}>{busy ? '로그아웃 중' : '로그아웃'}</button>
        </> : session.status === 'unavailable' || session.status === 'refresh_required' ? <button type="button" className="text-button" onClick={() => void refresh()}>로그인 정보 다시 확인</button> : <>
          <Link href="/login/" className="text-button">로그인</Link>
          <Link href="/login/" className="button button-blue">시작하기</Link>
        </>}
        {logoutError ? <span role="alert">로그아웃을 다시 시도해 주세요.</span> : null}
      </div>
    </header>
  );
}
