'use client';

import { useEffect, useState } from 'react';
import { LAUNCH_PROMOTION_ENDS_AT } from '@/lib/launch-promotion';

const deadline = Date.parse(LAUNCH_PROMOTION_ENDS_AT);
const units = [
  { id: 'cd-d', label: '일', seconds: 86400 },
  { id: 'cd-h', label: '시', seconds: 3600 },
  { id: 'cd-m', label: '분', seconds: 60 },
  { id: 'cd-s', label: '초', seconds: 1 },
];

export function LaunchCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) window.clearInterval(timer);
    };
    const timer = window.setInterval(update, 1000);
    update();
    // Recalculate after background throttling or a browser back/forward restoration.
    document.addEventListener('visibilitychange', update);
    window.addEventListener('pageshow', update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('pageshow', update);
    };
  }, []);

  return (
    <div className="countdown">
      <span className="cd-label">{remaining === 0 ? '런칭 할인 기간이 종료되었습니다' : '🔥 런칭 할인 종료까지'}</span>
      <div className="cd-clock" role="timer" aria-live="off" aria-label="런칭 할인 남은 시간">
        {units.map((unit, index) => {
          const value = remaining === null ? '--' : String(
            Math.floor(remaining / unit.seconds) % (index === 0 ? Infinity : index === 1 ? 24 : 60),
          ).padStart(2, '0');
          return <span className="cd-box" key={unit.id}><b id={unit.id}>{value}</b><i>{unit.label}</i></span>;
        })}
      </div>
    </div>
  );
}
