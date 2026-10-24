export type Gtag = (...args: unknown[]) => void;
export interface AnalyticsIdentity {
  userId: string | null;
  memberState: 'guest' | 'member' | 'unknown';
  subscriptionState: 'active' | 'inactive' | 'unknown';
}
export interface AnalyticsPage {
  location: string; path: string; key: string; title: string; referrer: string; group: string;
}
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content'];
const sensitiveKeys = /^(code|state|token|access_token|refresh_token|id_token|email|password|api_key|session)$/i;
const allowedParams = new Set(['control_id', 'control_type', 'ui_area', 'destination_path', 'link_domain', 'platform', 'action', 'percent_scrolled', 'method', 'article_slug']);
export const validMeasurementId = (value: string) => /^G-[A-Z0-9]{6,20}$/.test(value);
export const safeUserId = (value: string | null) => value && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value) ? value : null;
export function analyticsAllowed(hostname: string, debug: boolean, optedOut: boolean) {
  return !optedOut && (['thespreadbridge.com', 'www.thespreadbridge.com'].includes(hostname)
    || debug && ['127.0.0.1', 'localhost'].includes(hostname));
}
export function normalizePath(value: string) { return value === '/' ? '/' : value.replace(/\/+$/, '') + '/'; }
export function hasAuthParameters(params: URLSearchParams) { return [...params.keys()].some(key => sensitiveKeys.test(key)); }
function safeCampaign(value: string) {
  return value.length <= 100 && /^[\p{L}\p{N}_. ~+-]+$/u.test(value) ? value : null;
}
export function cleanReferrer(raw: string, origin: string, knownPaths: Record<string, string>) {
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol) || ['accounts.google.com', 'api.thespreadbridge.com', 'oauth2.googleapis.com'].includes(url.hostname)) return '';
    if (url.origin !== origin) return url.origin + '/';
    const path = normalizePath(url.pathname);
    return knownPaths[path] ? url.origin + path : '';
  } catch { return ''; }
}
export function analyticsPage(raw: string, titleByPath: Record<string, string>, referrer: string): AnalyticsPage | null {
  const url = new URL(raw);
  if (url.pathname.startsWith('/api/') || hasAuthParameters(url.searchParams)) return null;
  const normalized = normalizePath(url.pathname);
  const path = titleByPath[normalized] ? normalized : '/not-found/';
  const query = new URLSearchParams();
  for (const key of campaignKeys) {
    const value = url.searchParams.get(key);
    if (value && safeCampaign(value)) query.set(key, value);
  }
  for (const key of ['gclid', 'dclid', 'gbraid', 'wbraid']) {
    const value = url.searchParams.get(key);
    if (value && /^[a-z0-9_.~-]{1,200}$/i.test(value)) query.set(key, value);
  }
  const historyPage = url.searchParams.get('historyPage');
  if (path === '/payments/' && historyPage && /^[1-9]\d{0,3}$/.test(historyPage)) query.set('historyPage', historyPage);
  const suffix = query.size ? '?' + query : '';
  return { path, location: url.origin + path + suffix, key: path + (query.has('historyPage') ? '?historyPage=' + query.get('historyPage') : ''),
    title: titleByPath[path] ?? '페이지를 찾을 수 없습니다 | Spreadbridge',
    referrer: cleanReferrer(referrer, url.origin, titleByPath),
    group: path.startsWith('/blog/') ? 'blog' : ['/login/', '/payments/', '/race/'].includes(path) ? 'member' : 'public' };
}
export function safeDestination(raw: string, origin: string, knownPaths: Record<string, string>) {
  if (raw.startsWith('mailto:')) return { destination_path: 'contact', link_domain: 'email', control_id: 'contact' };
  if (raw.startsWith('tel:')) return { destination_path: 'contact', link_domain: 'phone', control_id: 'contact' };
  try {
    const url = new URL(raw, origin);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (url.pathname.startsWith('/api/session/google/start')) return { destination_path: '/login/', link_domain: new URL(origin).hostname, control_id: 'google_login' };
    const path = normalizePath(url.pathname);
    const hash = /^#[a-z][a-z0-9-]{0,63}$/i.test(url.hash) ? url.hash : '';
    const internal = url.origin === origin;
    return { destination_path: internal ? (knownPaths[path] ? path : '/other/') + hash : '/external/',
      link_domain: url.hostname, control_id: internal ? !knownPaths[path] ? 'other_link' : path === '/' ? 'home' + (hash ? '_' + hash.slice(1) : '') : path.startsWith('/blog/') ? 'blog_link' : path.split('/')[1] : 'external_link' };
  } catch { return null; }
}
export function sanitizeEventParams(params: AnalyticsParams) {
  return Object.fromEntries(Object.entries(params).filter(([key, value]) => allowedParams.has(key) && value !== undefined
    && (typeof value !== 'number' || Number.isFinite(value))
    && (typeof value !== 'string' || value.length <= 120 && !/[@<>]|(?:bearer|token=|code=|password=)/i.test(value))));
}
export function createAnalyticsTracker(sink: Gtag, measurementId: string, debug = false) {
  let identity: AnalyticsIdentity = { userId: null, memberState: 'unknown', subscriptionState: 'unknown' };
  let page: AnalyticsPage | null = null;
  let previousKey: string | null = null;
  const event = (name: string, params: AnalyticsParams = {}) => {
    if (!page || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) return;
    const payload = { ...sanitizeEventParams(params), page_location: page.location, page_title: page.title,
      page_referrer: page.referrer, content_group: page.group,
      member_state: identity.memberState, subscription_state: identity.subscriptionState,
      ...(debug ? { debug_mode: true } : {}) };
    sink('event', name, payload);
    if (debug && typeof console !== 'undefined') console.info('[Spreadbridge analytics]', name,
      { ...sanitizeEventParams(params), identified: Boolean(identity.userId), member_state: identity.memberState });
  };
  return {
    update(nextIdentity: AnalyticsIdentity, nextPage: AnalyticsPage | null) {
      identity = { ...nextIdentity, userId: safeUserId(nextIdentity.userId) };
      page = nextPage;
      if (!page) {
        sink('config', measurementId, { user_id: null, send_page_view: false, page_location: 'https://thespreadbridge.com/login/', page_title: '로그인 처리', page_referrer: '' });
        return;
      }
      sink('config', measurementId, { user_id: identity.userId, send_page_view: false, page_location: page.location,
        page_title: page.title, page_referrer: page.referrer, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 31_536_000 });
      if (page.key !== previousKey) { previousKey = page.key; event('page_view'); }
    },
    event,
  };
}
export type AnalyticsTracker = ReturnType<typeof createAnalyticsTracker>;
let activeTracker: AnalyticsTracker | null = null;
export function registerAnalyticsTracker(tracker: AnalyticsTracker | null) { activeTracker = tracker; }
export function sendAnalyticsEvent(name: string, params: AnalyticsParams = {}) { activeTracker?.event(name, params); }
