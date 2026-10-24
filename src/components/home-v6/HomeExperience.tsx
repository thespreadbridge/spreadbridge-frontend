'use client';

import { useState, type MouseEvent, type KeyboardEvent, type ReactNode } from 'react';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { useSession } from '@/components/auth/SessionProvider';
import { homeView } from '@/lib/auth/types';
import { MemberHome } from './MemberHome';

export function HomeExperience({ children }: { children: ReactNode }) {
  const { session, refresh } = useSession();
  const view = homeView(session);
  const [notice, setNotice] = useState('');
  function activate(target: Element, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) {
    const faq = target.closest<HTMLElement>('.faq-q');
    if (faq) {
      event.preventDefault();
      const item = faq.closest('.faq-item');
      item?.classList.toggle('open');
      faq.setAttribute('aria-expanded', String(item?.classList.contains('open') ?? false));
      return;
    }
    const link = target.closest<HTMLAnchorElement>('a');
    if (link?.getAttribute('href') === '#') { event.preventDefault(); setNotice(`${link.textContent?.trim() ?? '이 기능'} 연결은 준비 중입니다.`); }
  }
  return <div className="spreadbridge-home" data-view={view}
    onClick={event => { if (event.target instanceof Element) activate(event.target, event); }}
    onKeyDown={event => { if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof Element && event.target.matches('.faq-q')) activate(event.target, event); }}>
    <PublicHeader />
    {view === 'pending' ? <div className="site-container session-status" role="status"><p>회원·구독 정보를 확인하지 못했습니다.</p><button data-analytics-id="session_retry" type="button" className="btn ghost" onClick={() => void refresh()}>다시 확인</button></div> : null}
    <MemberHome />
    {children}
    <SiteFooter />
    {notice ? <div className="preview-toast" role="status">{notice}<button data-analytics-id="notice_dismiss" type="button" onClick={() => setNotice('')} aria-label="안내 닫기">×</button></div> : null}
  </div>;
}
