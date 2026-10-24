'use client';

import { useEffect, useState } from 'react';

const FRAMES = [
  { futures: 1386.9, usdt: 1387.3, label: '두 시장의 가격을 잽니다', tone: 'measure' },
  { futures: 1386.9, usdt: 1387.1, label: '좁혀졌을 때 진입 · 선물 매수 · USDT 매도', tone: 'enter' },
  { futures: 1385.6, usdt: 1388.7, label: '벌어지면 정리 · 그 차이만큼 수익 확정', tone: 'close' },
];

export function PrincipleAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FRAMES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const frame = FRAMES[index];
  const diff = Math.round((frame.usdt - frame.futures) * 10) / 10;

  return (
    <div className={`sb-anim sb-anim-${frame.tone}`} aria-hidden="true">
      <div className="sb-anim-rows">
        <div className="sb-anim-row">
          <span>한국 달러선물</span>
          <b>₩{frame.futures.toFixed(1)}</b>
        </div>
        <div className="sb-anim-row">
          <span>원화 USDT</span>
          <b>₩{frame.usdt.toFixed(1)}</b>
        </div>
      </div>
      <div className="sb-anim-diff">
        스프레드 <strong>₩{diff.toFixed(1)}</strong>
      </div>
      <div className="sb-anim-caption">{frame.label}</div>
    </div>
  );
}
