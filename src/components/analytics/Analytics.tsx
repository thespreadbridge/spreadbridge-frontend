'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSession } from '@/components/auth/SessionProvider';
import { analyticsAllowed, analyticsPage, createAnalyticsTracker, normalizePath, registerAnalyticsTracker, safeDestination, validMeasurementId, type AnalyticsTracker, type Gtag } from '@/lib/analytics';

declare global { interface Window { dataLayer?: unknown[]; gtag?: Gtag } }
const LOGIN_MARKER = 'spreadbridge_analytics_login_started';
function storageMarker(mode: 'start' | 'consume') {
  try {
    if (mode === 'start') { sessionStorage.setItem(LOGIN_MARKER, String(Date.now())); return false; }
    const timestamp = Number(sessionStorage.getItem(LOGIN_MARKER));
    sessionStorage.removeItem(LOGIN_MARKER);
    return timestamp > 0 && Date.now() - timestamp < 600_000;
  } catch { return false; }
}
function area(element: Element) {
  if (element.closest('.site-header')) return 'header';
  if (element.closest('.site-footer')) return 'footer';
  if (element.closest('.site-pagination')) return 'subscription_history';
  if (element.closest('.site-login-card')) return 'login';
  if (element.closest('.logged-main')) return 'member_dashboard';
  if (element.closest('.hero')) return 'hero';
  if (element.closest('#product')) return 'pricing';
  if (element.closest('#faq')) return 'faq';
  if (element.closest('.insight-body, .insight-toc')) return 'article';
  return 'content';
}

export function Analytics({ measurementId, pageTitles }: { measurementId: string; pageTitles: Record<string, string> }) {
  const pathname = normalizePath(usePathname());
  const params = useSearchParams();
  const { session } = useSession();
  const [enabled, setEnabled] = useState(false);
  const [identityWaitExpired, setIdentityWaitExpired] = useState(false);
  const tracker = useRef<AnalyticsTracker | null>(null);
  const previousPage = useRef<{ key: string; location: string; referrer: string } | null>(null);
  const loginErrorReported = useRef(false);
  const userId = session.status === 'authenticated' ? session.user.userId : null;
  const memberState = session.status === 'authenticated' ? 'member' : session.status === 'guest' ? 'guest' : 'unknown';
  const subscriptionState = session.status === 'authenticated' && session.subscription
    ? session.subscription.active ? 'active' : 'inactive' : 'unknown';
  const debug = process.env.NEXT_PUBLIC_GA_DEBUG_MODE === 'true' || params.get('ga_debug') === '1';

  useEffect(() => {
    if (memberState !== 'unknown') return;
    const timer = setTimeout(() => setIdentityWaitExpired(true), 3000);
    return () => clearTimeout(timer);
  }, [memberState]);

  useEffect(() => {
    if (memberState === 'unknown' && !identityWaitExpired && !tracker.current) return;
    const optedOut = navigator.doNotTrack === '1' || Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
    if (!validMeasurementId(measurementId) || !analyticsAllowed(location.hostname, debug, optedOut)) return;
    const page = analyticsPage(location.href, pageTitles, document.referrer);
    if (!page && !tracker.current) return;
    if (!tracker.current) {
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = window.gtag ?? function () { window.dataLayer?.push(arguments); };
      window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('set', 'ads_data_redaction', true);
      window.gtag('js', new Date());
      tracker.current = createAnalyticsTracker(window.gtag, measurementId, debug);
      setEnabled(true);
    }
    registerAnalyticsTracker(tracker.current);
    if (page && previousPage.current) {
      page.referrer = previousPage.current.key === page.key ? previousPage.current.referrer : previousPage.current.location;
    }
    tracker.current.update({ userId, memberState, subscriptionState }, page);
    if (page) previousPage.current = { key: page.key, location: page.location, referrer: page.referrer };
    if (userId && storageMarker('consume')) tracker.current.event('login', { method: 'Google' });
    if (pathname === '/login/' && params.get('error') && !loginErrorReported.current) {
      loginErrorReported.current = true;
      storageMarker('consume');
      tracker.current.event('login_error', { method: 'Google' });
    }
    if (pathname !== '/login/') loginErrorReported.current = false;
  }, [measurementId, pathname, params, userId, memberState, subscriptionState, debug, pageTitles, identityWaitExpired]);

  useEffect(() => {
    if (!enabled) return;
    const interact = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      const control = target.closest<HTMLElement>('a, button, [role="button"], summary');
      if (!control || control.matches(':disabled, [aria-disabled="true"]') || control.closest('[data-analytics-ignore]')) return;
      const href = control instanceof HTMLAnchorElement ? control.getAttribute('href') : null;
      const destination = href ? safeDestination(href, location.origin, pageTitles) : null;
      const specified = control.dataset.analyticsId;
      const controlId = specified && /^[a-z][a-z0-9_]{0,63}$/.test(specified) ? specified
        : destination?.control_id ?? (control.tagName === 'SUMMARY' ? 'article_details_' + ([...document.querySelectorAll('summary')].indexOf(control) + 1) : 'button_' + ([...document.querySelectorAll('button, [role="button"]')].indexOf(control) + 1));
      tracker.current?.event('ui_click', { control_id: controlId, control_type: control.tagName.toLowerCase(),
        ui_area: area(control), destination_path: destination?.destination_path, link_domain: destination?.link_domain });
      if (destination?.control_id === 'google_login') {
        storageMarker('start'); tracker.current?.event('login_start', { method: 'Google' });
      }
      if (href?.startsWith('mailto:')) tracker.current?.event('contact_click', { control_id: 'contact_email', ui_area: area(control) });
      if (control.matches('.faq-q')) tracker.current?.event('faq_toggle', { control_id: controlId, action: control.getAttribute('aria-expanded') === 'true' ? 'close' : 'open' });
      const namedEvent = control.dataset.analyticsEvent;
      if (namedEvent === 'file_download') tracker.current?.event('file_download', { control_id: controlId, platform: control.dataset.analyticsPlatform });
      if (namedEvent === 'begin_checkout') tracker.current?.event('begin_checkout', { control_id: controlId });
    };
    const click = (event: MouseEvent) => interact(event.target);
    const keyboard = (event: KeyboardEvent) => {
      if (!event.repeat && ['Enter', ' '].includes(event.key) && event.target instanceof Element && event.target.matches('[role="button"]:not(button)')) interact(event.target);
    };
    const change = (event: Event) => {
      const control = event.target;
      if (control instanceof HTMLElement && control.dataset.analyticsId) tracker.current?.event('filter_change', { control_id: control.dataset.analyticsId, ui_area: area(control) });
    };
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', keyboard, true);
    document.addEventListener('change', change, true);
    return () => {
      document.removeEventListener('click', click, true); document.removeEventListener('keydown', keyboard, true); document.removeEventListener('change', change, true);
    };
  }, [enabled, pageTitles]);

  useEffect(() => {
    if (!enabled) return;
    const thresholds = new Set<number>();
    const started = Date.now();
    let articleRead = false;
    let frame = 0;
    const inspectScroll = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      const percent = height > 0 ? Math.round(scrollY / height * 100) : 100;
      for (const threshold of [25, 50, 75, 90]) {
        if (percent >= threshold && !thresholds.has(threshold)) {
          thresholds.add(threshold); tracker.current?.event('scroll_depth', { percent_scrolled: threshold });
        }
      }
      if (!articleRead && pathname.startsWith('/blog/') && pathname !== '/blog/' && percent >= 75 && Date.now() - started >= 30_000) {
        articleRead = true; tracker.current?.event('article_read', { article_slug: pathname.split('/')[2] });
      }
    };
    const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(inspectScroll); };
    const timer = setTimeout(inspectScroll, 30_000);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); };
  }, [enabled, pathname, params]);

  useEffect(() => () => { registerAnalyticsTracker(null); }, []);
  return enabled ? <Script id="spreadbridge-google-analytics" src={'https://www.googletagmanager.com/gtag/js?id=' + measurementId} strategy="afterInteractive" /> : null;
}
