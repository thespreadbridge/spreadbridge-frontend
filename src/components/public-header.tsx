'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { Brand } from './brand';
import { useSession } from './auth/SessionProvider';

export function PublicHeader() {
  const { session, logout, refresh, busy } = useSession();
  const [logoutError, setLogoutError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [menuOpen]);
  return <header className="site-header" ref={headerRef} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
  }}>
    <div className="site-container site-header-inner">
      <Brand />
      <button ref={toggleRef} type="button" className="btn ghost site-menu-toggle" aria-expanded={menuOpen} aria-controls={menuId} aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} onClick={() => setMenuOpen(open => !open)}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{menuOpen ? <path d="m4 4 10 10M14 4 4 14" /> : <path d="M2 4h14M2 9h14M2 14h14" />}</svg>메뉴
      </button>
      <div className="site-menu" id={menuId} data-open={menuOpen}>
        <nav aria-label="주요 메뉴" className="site-nav" onClick={() => setMenuOpen(false)}>
          <Link href="/#how">작동 방식</Link><Link href="/#security">보안</Link><Link href="/#product">요금</Link><Link href="/#faq">FAQ</Link><Link href="/race/">진입갭 레이스</Link><Link href="/blog/">블로그</Link>
        </nav>
        <div className="site-actions" onClick={() => setMenuOpen(false)}>
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
      </div>
    </div>
    {logoutError ? <p className="site-container site-form-error" role="alert">로그아웃하지 못했습니다. 다시 시도해 주세요.</p> : null}
  </header>;
}
