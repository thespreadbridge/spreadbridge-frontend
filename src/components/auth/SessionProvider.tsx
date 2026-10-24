'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { guestSession, type SiteSession } from '@/lib/auth/types';
import { sendAnalyticsEvent } from '@/lib/analytics';

type SessionContextValue = { session: SiteSession; refresh: () => Promise<void>; logout: () => Promise<void>; busy: boolean };
const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ initialSession, children }: { initialSession: SiteSession; children: ReactNode }) {
  const [session, setSession] = useState(initialSession);
  const [busy, setBusy] = useState(false);
  const current = useRef(initialSession);
  const flight = useRef<Promise<void> | null>(null);
  const router = useRouter();

  useEffect(() => { current.current = initialSession; setSession(initialSession); }, [initialSession]);
  const refresh = useCallback(() => {
    if (flight.current) return flight.current;
    flight.current = (async () => {
      try {
        let response = await fetch('/api/session/', { cache: 'no-store', credentials: 'same-origin' });
        let next: SiteSession = await response.json();
        if (next.status === 'refresh_required') {
          response = await fetch('/api/session/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'refresh' }) });
          next = await response.json();
        }
        if (!['guest', 'authenticated', 'unavailable'].includes(next.status)) throw new Error('Session unavailable');
        const changed = JSON.stringify(next) !== JSON.stringify(current.current);
        current.current = next; setSession(next);
        if (changed) router.refresh();
      } catch {
        const unavailable: SiteSession = { status: 'unavailable', user: null, subscription: null };
        current.current = unavailable; setSession(unavailable);
      } finally { flight.current = null; }
    })();
    return flight.current;
  }, [router]);

  useEffect(() => {
    void refresh();
    const visible = () => { if (document.visibilityState === 'visible') void refresh(); };
    const timer = window.setInterval(visible, 60_000);
    document.addEventListener('visibilitychange', visible);
    window.addEventListener('focus', visible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', visible); window.removeEventListener('focus', visible); };
  }, [refresh]);

  const logout = useCallback(async () => {
    setBusy(true);
    try {
      await flight.current;
      const response = await fetch('/api/session/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'logout' }) });
      if (!response.ok) throw new Error('Logout unavailable');
      sendAnalyticsEvent('logout', { method: 'manual' });
      current.current = guestSession; setSession(guestSession);
      router.replace('/'); router.refresh();
    } finally { setBusy(false); }
  }, [router]);

  return <SessionContext.Provider value={{ session, refresh, logout, busy }}>{children}</SessionContext.Provider>;
}
export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('SessionProvider is required');
  return value;
}
