import Link from 'next/link';

export function Pagination({ page, pageCount, total, start, end, basePath, pageParam, anchor }: {
  page: number; pageCount: number; total: number; start: number; end: number;
  basePath: string; pageParam: string; anchor: string;
}) {
  const href = (target: number) => `${basePath}?${new URLSearchParams({ [pageParam]: String(target) })}#${anchor}`;
  return <nav className="site-pagination" aria-label="구독 이용 내역 페이지">
    <p className="site-pagination-count">조회된 {total}건 중 {start}–{end}건</p>
    <div className="site-pagination-controls">
      {page > 1 ? <Link data-analytics-id="history_previous" className="btn ghost" href={href(page - 1)} prefetch={false} aria-label="이전 페이지">이전</Link> : <span className="btn ghost" aria-disabled="true">이전</span>}
      <span className="site-pagination-current" aria-live="polite"><span aria-current="page">{page}</span> / {pageCount} 페이지</span>
      {page < pageCount ? <Link data-analytics-id="history_next" className="btn ghost" href={href(page + 1)} prefetch={false} aria-label="다음 페이지">다음</Link> : <span className="btn ghost" aria-disabled="true">다음</span>}
    </div>
  </nav>;
}
