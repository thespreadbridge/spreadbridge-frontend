'use client';

import { MarketChart } from './MarketChart';
import { useMarketSeries } from './useMarketSeries';

export function LiveSpread() {
  const { futures, usdt, spread, current } = useMarketSeries();

  return (
    <section className="sb-section sb-section-tint">
      <div className="shell">
        <span className="sb-eyebrow"><i />LIVE MARKET</span>
        <h2 className="sb-h2">두 가격, 그리고 그 사이의 스프레드.</h2>
        <p className="sb-lead">KIS 달러선물과 Upbit USDT의 실시간 가격, 그리고 둘의 차이(스프레드)가 어떻게 벌어졌다 좁혀지는지 함께 봅니다. Spreadbridge는 이 움직임 위에서 실행됩니다.</p>
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
        <p className="sb-note">* 현재는 데모 데이터이며, 정식 오픈 시 KIS·Upbit 실시간 시세로 연결됩니다. 시장 스프레드일 뿐 실현 수익이 아니며, 체결·수수료·세금에 따라 결과는 달라집니다.</p>
      </div>
    </section>
  );
}
