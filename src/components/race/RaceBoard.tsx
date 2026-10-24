'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '@/components/auth/SessionProvider';
import { isRaceSymbol, kstTime, raceMonthLabel, slotShares, upcomingRaceSymbols, type RaceSummary } from '@/lib/race';

type Metric = 'people' | 'slots';
type Status = 'loading' | 'ready' | 'denied' | 'expired' | 'error';
const REFRESH_MS = 20_000;

export function RaceBoard() {
  const { refresh } = useSession();
  const defaults = useMemo(() => upcomingRaceSymbols(), []);
  const [symbol, setSymbol] = useState(defaults[0] ?? '');
  const [metric, setMetric] = useState<Metric>('people');
  const [summary, setSummary] = useState<RaceSummary | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [tick, setTick] = useState(0);
  const renewed = useRef(false);

  const load = useCallback(async (target: string, signal: AbortSignal) => {
    const fetchSummary = () => fetch(`/api/member/race/?symbol=${encodeURIComponent(target)}`, { cache: 'no-store', credentials: 'same-origin', signal });
    try {
      let response = await fetchSummary();
      if (response.status === 401 && !renewed.current) {
        // The access cookie lasts 15 minutes; renew it once through the session provider before giving up.
        renewed.current = true;
        await refresh();
        response = await fetchSummary();
      }
      if (signal.aborted) return;
      if (response.status === 401) { setStatus('expired'); return; }
      if (response.status === 403) { setStatus('denied'); return; }
      if (!response.ok) throw new Error('Race unavailable');
      const data: RaceSummary = await response.json();
      if (signal.aborted || data.symbol !== target) return;
      renewed.current = false;
      setSummary(data); setStatus('ready');
    } catch { if (!signal.aborted) setStatus('error'); }
  }, [refresh]);

  useEffect(() => {
    if (!isRaceSymbol(symbol)) return;
    const controller = new AbortController();
    setSummary(null); setStatus('loading');
    void load(symbol, controller.signal);
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void load(symbol, controller.signal); }, REFRESH_MS);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [symbol, tick, load]);

  useEffect(() => {
    if (status !== 'expired') return;
    const timer = window.setInterval(() => void load(symbol, new AbortController().signal), REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [status, symbol, load]);

  const months = useMemo(() => [...new Set([...defaults, ...(summary?.months ?? [])])].filter(isRaceSymbol).sort(), [defaults, summary]);
  const buckets = useMemo(() => [...(summary?.buckets ?? [])].sort((a, b) => metric === 'people'
    ? b.people - a.people || a.lower - b.lower
    : b.slots - a.slots || a.lower - b.lower), [summary, metric]);
  const shares = useMemo(() => slotShares(buckets), [buckets]);
  const maximum = Math.max(1, ...buckets.map(bucket => bucket[metric]));
  const message = status === 'expired' ? '로그인이 만료되었습니다. 다시 로그인해 주세요.'
    : status === 'denied' ? '이메일 인증과 계정 승인이 완료된 회원만 집계를 볼 수 있습니다.'
    : status === 'error' ? '집계 데이터를 불러오지 못했습니다. 새로고침해 주세요.'
    : summary && !buckets.length ? '이 월물에 공유된 활성 진입대기 슬롯이 없습니다.'
    : status === 'loading' ? '집계 데이터를 불러오는 중입니다.' : '';

  return <section className="race-board">
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
        <button type="button" className="btn ghost" onClick={() => setTick(n => n + 1)}>새로고침 ↻</button>
      </div>
    </div>

    <div className="site-summary-grid race-stats">
      <article><h2>참여 인원</h2><p><strong>{summary?.people ?? '—'}</strong> 명</p><small>선택 월물 내 중복 제거</small></article>
      <article><h2>활성 진입대기 슬롯</h2><p><strong>{summary?.slots ?? '—'}</strong> 개</p><small>정지·보유·완료 제외</small></article>
      <article><h2>내 설정</h2><p><strong>{summary ? (summary.shared ? '익명 공유 중' : '익명 공유 안 함') : '—'}</strong></p><small>앱의 진입갭 레이스에서 변경</small></article>
    </div>

    <p role="status" aria-live="polite" className={message ? 'race-empty' : 'race-status-hidden'}>{message}</p>
    {buckets.length ? <div className="site-table-wrap"><table className="race-table">
      <caption>{metric === 'people' ? '인원수' : '슬롯수'} 기준 인기 순위</caption>
      <thead><tr><th scope="col">순위</th><th scope="col">진입 기준값 구간</th><th scope="col">인원</th><th scope="col">슬롯</th><th scope="col">슬롯 비중</th><th scope="col">순위 변동</th></tr></thead>
      <tbody>
        {buckets.map(bucket => {
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
    </table></div> : null}
  </section>;
}
