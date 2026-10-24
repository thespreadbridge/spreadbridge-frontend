'use client';

import { useId } from 'react';

const W = 640;

function toPoints(series: number[], min: number, max: number, height: number, pad = 10) {
  const range = max - min || 1;
  return series.map((value, i) => {
    const x = (i / (series.length - 1)) * W;
    const y = pad + (1 - (value - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

export function MarketChart({
  futures,
  usdt,
  spread,
  priceH = 210,
  spreadH = 90,
}: {
  futures: number[];
  usdt: number[];
  spread: number[];
  priceH?: number;
  spreadH?: number;
}) {
  const gradId = useId();

  const priceMin = Math.min(...futures, ...usdt);
  const priceMax = Math.max(...futures, ...usdt);
  const fPts = toPoints(futures, priceMin, priceMax, priceH);
  const uPts = toPoints(usdt, priceMin, priceMax, priceH);
  const band = `${uPts.join(' ')} ${[...fPts].reverse().join(' ')}`;

  const spreadMin = Math.min(...spread);
  const spreadMax = Math.max(...spread);
  const sPts = toPoints(spread, spreadMin, spreadMax, spreadH);
  const sLine = sPts.join(' ');
  const sArea = `0,${spreadH} ${sLine} ${W},${spreadH}`;

  return (
    <div className="sb-mchart">
      <svg
        className="sb-mchart-price"
        viewBox={`0 0 ${W} ${priceH}`}
        width="100%"
        height={priceH}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points={band} fill="var(--brand-soft)" opacity="0.75" />
        <polyline points={uPts.join(' ')} fill="none" stroke="var(--positive)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <polyline points={fPts.join(' ')} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg
        className="sb-mchart-spread"
        viewBox={`0 0 ${W} ${spreadH}`}
        width="100%"
        height={spreadH}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={sArea} fill={`url(#${gradId})`} />
        <polyline points={sLine} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
