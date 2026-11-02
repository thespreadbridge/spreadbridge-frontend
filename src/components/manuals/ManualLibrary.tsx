'use client';

import { useEffect, useRef, useState } from 'react';
import manuals from '@/content/manuals.json';

type Manual = typeof manuals[number];

export function ManualLibrary() {
  const [selected, setSelected] = useState<Manual | null>(null);
  return <>
    <div className="manual-library">
      {manuals.map((manual, index) => <section className="manual-card" key={manual.id}>
        <button type="button" className="manual-cover" onClick={() => setSelected(manual)} aria-label={`${manual.title} 읽기`}>
          <img src={manual.pages[0].image} alt="" width={1440} height={900} />
        </button>
        <div className="manual-card-body">
          <p className="manual-index">GUIDE {String(index + 1).padStart(2, '0')} · v{manual.version} · {manual.pages.length}쪽</p>
          <h2>{manual.title}</h2><p>{manual.description}</p>
          <div className="manual-actions">
            <button type="button" className="btn primary" onClick={() => setSelected(manual)}>{manual.title} 읽기</button>
            <a className="btn ghost" href={manual.pdf} download>PDF 다운로드</a>
            <a className="btn ghost" href={manual.pptx} download>PPTX 다운로드</a>
          </div>
        </div>
      </section>)}
    </div>
    {selected ? <ManualReader key={selected.id} manual={selected} close={() => setSelected(null)} /> : null}
  </>;
}

function ManualReader({ manual, close }: { manual: Manual; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const current = manual.pages[page];
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  function changePage(next: number) {
    setPage(next);
    content.current?.scrollTo(0, 0);
  }
  return <dialog ref={dialog} className="manual-reader" aria-label={manual.title} onCancel={event => { event.preventDefault(); close(); }}>
    <header className="manual-reader-head"><div><h2>{manual.title}</h2><span>v{manual.version} · 화면 기준 2026.11.01</span></div><button type="button" className="btn ghost" onClick={close} aria-label="매뉴얼 닫기">닫기 ×</button></header>
    <nav className="manual-reader-nav" aria-label="매뉴얼 페이지">
      <button type="button" className="btn ghost" disabled={page === 0} onClick={() => changePage(page - 1)}>← 이전</button>
      <span role="status">{page + 1} / {manual.pages.length}쪽</span>
      <button type="button" className="btn ghost" disabled={page === manual.pages.length - 1} onClick={() => changePage(page + 1)}>다음 →</button>
      <a className="btn ghost" href={manual.pdf} target="_blank" rel="noopener noreferrer">PDF 크게 보기 ↗</a>
    </nav>
    <div ref={content} className="manual-reader-content">
      <img src={current.image} alt={`${manual.title} ${page + 1}쪽. 아래 문서 텍스트에서 내용을 확인할 수 있습니다.`} width={1440} height={900} />
      <details key={page}><summary>문서 텍스트 보기</summary><p>{current.text}</p></details>
    </div>
  </dialog>;
}
