'use client';

import { MarketChart } from './MarketChart';
import { useMarketSeries } from './useMarketSeries';

export function LiveSpread() {
  const { futures, usdt, spread, current } = useMarketSeries();

  return (
    <section className="sb-section sb-section-tint">
      <div className="shell">
        <span className="sb-eyebrow"><i />SPREAD EXAMPLE</span>
        <h2 className="sb-h2">두 가격, 그리고 그 사이의 스프레드.</h2>
        <p className="sb-lead">KIS 달러선물과 Upbit USDT의 가격 차이(스프레드)가 어떻게 달라지는지 예시 데이터로 살펴보세요.</p>
        <div className="sb-market-card">
          <div className="sb-market-legend">
            <span className="sb-leg sb-leg-usdt">Upbit USDT <b>₩{current.usdt.toFixed(1)}</b></span>
            <span className="sb-leg sb-leg-fut">KIS 달러선물 <b>₩{current.futures.toFixed(1)}</b></span>
            <span className="sb-leg sb-leg-spread">스프레드 <b>{current.spread.toFixed(2)}%</b></span>
          </div>
          <MarketChart futures={futures} usdt={usdt} spread={spread} />
          <div className="sb-market-caption">
            <span>위 · 두 시장 가격 (원)</span>
            <span>아래 · 스프레드 (%)</span>
          </div>
        </div>
        <p className="sb-note">* 홈페이지 차트는 개념 설명을 위한 예시 데이터입니다. 시장 스프레드는 실현 수익과 다르며, 체결·수수료·세금에 따라 실제 결과는 달라집니다.</p>
      </div>
    </section>
  );
}
