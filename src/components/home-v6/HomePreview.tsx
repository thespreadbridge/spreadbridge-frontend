'use client';

import { useEffect, useRef, useState, type MouseEvent, type KeyboardEvent, type ReactNode } from 'react';

type View = 'guest' | 'free' | 'paid';

export function HomePreview({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('guest');
  const [boardOpen, setBoardOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!boardOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = root.current?.querySelector<HTMLButtonElement>('#mbClose');
    close?.focus();
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setBoardOpen(false);
      if (event.key === 'Tab') {
        const focusable = [...(root.current?.querySelectorAll<HTMLElement>('#memberBoard button, #memberBoard a[href]') ?? [])];
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
      returnFocus.current?.focus();
    };
  }, [boardOpen]);

  function activate(target: Element, event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) {
    const switcher = target.closest<HTMLButtonElement>('#viewSwitch button');
    if (switcher) {
      const next = switcher.dataset.view;
      if (next === 'guest' || next === 'free' || next === 'paid') { setView(next); setNotice(''); window.scrollTo(0, 0); }
      return;
    }
    if (target.closest('#logoutBtn')) { event.preventDefault(); setView('guest'); return; }
    const faq = target.closest<HTMLElement>('.faq-q');
    if (faq) {
      event.preventDefault();
      const item = faq.closest('.faq-item');
      item?.classList.toggle('open');
      faq.setAttribute('aria-expanded', String(item?.classList.contains('open') ?? false));
      return;
    }
    if (target.closest('#mbClose') || target.id === 'memberBoard') { setBoardOpen(false); return; }
    if (target.closest('.board-lock .btn') || target.closest('#paidBoard')) {
      event.preventDefault();
      returnFocus.current = target.closest<HTMLElement>('a, button') ?? null;
      setBoardOpen(true);
      return;
    }
    const tab = target.closest<HTMLButtonElement>('.mb-tab');
    if (tab) {
      const tabs = [...(root.current?.querySelectorAll<HTMLButtonElement>('.mb-tab') ?? [])];
      tabs.forEach(button => button.classList.toggle('active', button === tab));
      const table = root.current?.querySelector('.mb-table');
      if (table) {
        const rows = [...table.querySelectorAll<HTMLElement>('.mb-row:not(.mb-hd)')];
        const entries = tabs.indexOf(tab) === 1;
        rows.sort((a, b) => {
          const value = (row: HTMLElement) => Number((row.children[entries ? 2 : 5]?.textContent ?? '').replace(/[^\d.]/g, ''));
          return value(b) - value(a);
        });
        rows.forEach(row => table.append(row));
      }
      setNotice(tabs.indexOf(tab) === 2 ? '이번 달 화면도 현재는 동일한 예시 데이터를 사용합니다.' : '');
      return;
    }
    const link = target.closest<HTMLAnchorElement>('a');
    const href = link?.getAttribute('href');
    if (view !== 'guest' && href && ['#how', '#security', '#product', '#faq'].includes(href)) {
      event.preventDefault();
      setView('guest');
      requestAnimationFrame(() => root.current?.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }));
      return;
    }
    if (link?.getAttribute('href') === '#') { event.preventDefault(); setNotice(`${link.textContent?.trim() ?? '이 기능'} 연결은 준비 중입니다.`); }
  }

  return (
    <div ref={root} className="spreadbridge-home" data-view={view} data-board-open={boardOpen}
      onClick={event => { if (event.target instanceof Element) activate(event.target, event); }}
      onKeyDown={event => {
        if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof Element && event.target.matches('.faq-q')) activate(event.target, event);
      }}>
      {children}
      {notice ? <div className="preview-toast" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="안내 닫기">×</button></div> : null}
    </div>
  );
}
