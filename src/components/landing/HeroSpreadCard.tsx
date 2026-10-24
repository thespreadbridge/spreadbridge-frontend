'use client';

import { useMarketSeries } from './useMarketSeries';

export function HeroSpreadCard() {
  const { current } = useMarketSeries();
  const spread = current.spread;
  const status =
    spread <= 0.1
      ? { label: '스프레드 좁음 · 진입 구간', cls: 'enter' }
      : spread >= 0.28
        ? { label: '스프레드 넓음 · 청산 구간', cls: 'exit' }
        : { label: '감시 중', cls: 'watch' };

  return (
    <aside className="sb-spread-card" aria-label="시장 스프레드 예시">
      <div className="sb-spread-head">
        <span>진입 스프레드 예시</span>
        <span className="sb-live"><i />DEMO</span>
      </div>
      <div className="sb-spread-num">{spread.toFixed(2)}<sup>%</sup></div>
      <span className={`sb-spread-status sb-spread-status-${status.cls}`}>{status.label}</span>
      <p className="sb-spread-hint">스프레드가 좁아지면 자동 진입, 벌어지면 정리합니다.</p>
    </aside>
  );
}
