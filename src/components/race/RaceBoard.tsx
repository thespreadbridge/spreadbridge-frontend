'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isRaceSymbol, kstTime, raceMonthLabel, slotShares, upcomingRaceSymbols, type RaceSummary } from '@/lib/race';

type Metric = 'people' | 'slots';
const REFRESH_MS = 20_000;

export function RaceBoard() {
  const defaults = useMemo(() => upcomingRaceSymbols(), []);
  const [symbol, setSymbol] = useState(defaults[0] ?? '');
  const [metric, setMetric] = useState<Metric>('people');
  const [summary, setSummary] = useState<RaceSummary | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');
  const [tick, setTick] = useState(0);

  const load = useCallback(async (target: string, signal: AbortSignal) => {
    try {
      const response = await fetch(`/api/member/race/?symbol=${encodeURIComponent(target)}`, { cache: 'no-store', credentials: 'same-origin', signal });
      if (response.status === 401 || response.status === 403) { setStatus('denied'); return; }
      if (!response.ok) throw new Error('Race unavailable');
      const data: RaceSummary = await response.json();
      if (!signal.aborted) { setSummary(data); setStatus('ready'); }
    } catch { if (!signal.aborted) setStatus('error'); }
  }, []);

  useEffect(() => {
    if (!isRaceSymbol(symbol)) return;
    const controller = new AbortController();
    setStatus(current => current === 'ready' ? current : 'loading');
    void load(symbol, controller.signal);
    const timer = window.setInterval(() => void load(symbol, controller.signal), REFRESH_MS);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [symbol, tick, load]);

  const months = useMemo(() => [...new Set([...defaults, ...(summary?.months ?? [])])].sort(), [defaults, summary]);
  const buckets = useMemo(() => [...(summary?.buckets ?? [])].sort((a, b) => metric === 'people'
    ? b.people - a.people || a.lower - b.lower
    : b.slots - a.slots || a.lower - b.lower), [summary, metric]);
  const shares = useMemo(() => slotShares(buckets, summary?.slots ?? 0), [buckets, summary]);
  const maximum = Math.max(1, ...buckets.map(bucket => bucket[metric]));

  return <section className="race-board" aria-live="polite">
    <div className="race-tools">
      <label className="race-select">월물
        <select value={symbol} onChange={event => setSymbol(event.target.value)}>
          {months.map(month => <option key={month} value={month}>{raceMonthLabel(month)}</option>)}
        </select>
      </label>
      <div className="race-sort" role="group" aria-label="정렬 기준">
        {([['people', '인원순'], ['slots', '슬롯순']] as const).map(([id, label]) => (
          <button key={id} type="button" aria-pressed={metric === id} onClick={() => setMetric(id)}>{label}</button>
        ))}
      </div>
      <div className="race-updated">
        <span>{summary ? `${kstTime(summary.updatedAt)} 집계` : status === 'loading' ? '집계 조회 중' : '—'}</span>
        <button type="button" className="btn ghost" onClick={() => setTick(n => n + 1)}>새로고침</button>
      </div>
    </div>

    <div className="site-summary-grid race-stats">
      <article><h2>참여 인원</h2><p><strong>{summary?.people ?? '—'}</strong> 명</p><small>선택 월물 내 중복 제거</small></article>
      <article><h2>활성 진입대기 슬롯</h2><p><strong>{summary?.slots ?? '—'}</strong> 개</p><small>정지·보유·완료 제외</small></article>
      <article><h2>내 공유 상태</h2><p><strong>{summary ? (summary.shared ? '공유 중' : '공유 안 함') : '—'}</strong></p><small>데스크톱 앱의 레이스 화면에서 변경</small></article>
    </div>

    {status === 'denied' ? <p role="status" className="race-empty">이메일 인증과 계정 승인이 완료된 회원만 집계를 볼 수 있습니다.</p>
      : status === 'error' ? <p role="status" className="race-empty">집계를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</p>
      : summary && !buckets.length ? <p role="status" className="race-empty">이 월물에 공유된 활성 진입대기 슬롯이 아직 없습니다.</p>
      : <div className="site-table-wrap"><table className="race-table">
        <caption>{metric === 'people' ? '인원수' : '슬롯수'} 기준 인기 순위 · 1원 단위 구간</caption>
        <thead><tr><th scope="col">순위</th><th scope="col">진입 기준값 구간</th><th scope="col">인원</th><th scope="col">슬롯</th><th scope="col">슬롯 비중</th><th scope="col">순위 변동</th></tr></thead>
        <tbody>
          {status === 'loading' && !summary ? <tr><td colSpan={6}>집계 데이터를 불러오는 중입니다.</td></tr> : buckets.map(bucket => {
            const rank = bucket[metric] > 0 ? buckets.findIndex(b => b[metric] === bucket[metric]) + 1 : null;
            const previous = metric === 'people' ? bucket.previousPeopleRank : bucket.previousSlotsRank;
            const change = rank && previous ? previous - rank : 0;
            const label = !rank || !summary?.comparisonAt ? '—' : previous == null ? 'NEW' : change > 0 ? `▲ ${change}` : change < 0 ? `▼ ${-change}` : '—';
            return <tr key={bucket.lower}>
              <td className={rank === 1 ? 'race-top' : undefined}>{rank ?? '—'}</td>
              <td><div>{bucket.lower} ~ {bucket.lower + 1}원</div><div className="race-track" aria-hidden="true"><span style={{ width: `${bucket[metric] / maximum * 100}%` }} /></div></td>
              <td>{bucket.people}명</td>
              <td>{bucket.slots}개</td>
              <td>{(shares.get(bucket.lower) ?? 0).toFixed(1)}%</td>
              <td className={change > 0 ? 'race-up' : change < 0 ? 'race-down' : previous == null && rank && summary?.comparisonAt ? 'race-new' : undefined}
                title={summary?.comparisonAt ? `이전 분 집계 (${kstTime(summary.comparisonAt)}) 대비` : '비교 집계 대기'}>{label}</td>
            </tr>;
          })}
        </tbody>
      </table></div>}
  </section>;
}
