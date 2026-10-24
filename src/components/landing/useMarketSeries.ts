'use client';

import { useEffect, useRef, useState } from 'react';

// 홈페이지 차트용 예시 데이터입니다.
const POINTS = 48;
const BASE_PRICE = 1386; // KIS 달러선물 기준가 (원)
const BASE_SPREAD = 0.18; // 스프레드 (%)
const AMP = 0.11; // 스프레드 진폭: 벌어졌다 채워지는 폭 (0.07 ~ 0.29%)

export interface Market {
  futures: number[];
  usdt: number[];
  spread: number[];
}

function spreadAt(i: number): number {
  return BASE_SPREAD + Math.sin(i / 6) * AMP;
}

function futuresAt(i: number): number {
  return BASE_PRICE + Math.sin(i / 9) * 1.2;
}

function seed(): Market {
  const futures: number[] = [];
  const usdt: number[] = [];
  const spread: number[] = [];
  for (let i = 0; i < POINTS; i += 1) {
    const f = futuresAt(i);
    const s = spreadAt(i);
    futures.push(f);
    spread.push(s);
    usdt.push(f * (1 + s / 100));
  }
  return { futures, usdt, spread };
}

export function useMarketSeries(intervalMs = 700) {
  const [data, setData] = useState<Market>(seed);
  const tick = useRef(POINTS);

  useEffect(() => {
    const timer = setInterval(() => {
      const i = tick.current;
      tick.current += 1;
      const f = futuresAt(i) + (Math.random() - 0.5) * 0.3;
      const s = Math.max(0.03, spreadAt(i) + (Math.random() - 0.5) * 0.02);
      setData((prev) => ({
        futures: [...prev.futures.slice(1), f],
        usdt: [...prev.usdt.slice(1), f * (1 + s / 100)],
        spread: [...prev.spread.slice(1), s],
      }));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  const last = data.spread.length - 1;
  return {
    ...data,
    current: {
      futures: data.futures[last] ?? BASE_PRICE,
      usdt: data.usdt[last] ?? BASE_PRICE,
      spread: data.spread[last] ?? BASE_SPREAD,
    },
  };
}
