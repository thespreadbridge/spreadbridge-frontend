import { describe, expect, it, vi } from 'vitest';
import { analyticsAllowed, analyticsPage, cleanReferrer, createAnalyticsTracker, safeDestination, safeUserId, sanitizeEventParams, validMeasurementId } from '@/lib/analytics';

const titles = { '/': 'Spreadbridge', '/pricing/': '요금', '/payments/': '구독 관리', '/login/': '로그인', '/blog/example/': '공개 블로그 글' };
const origin = 'https://thespreadbridge.com';
const userId = '11111111-1111-4111-8111-111111111111';
const page = (path = '/') => analyticsPage(origin + path, titles, 'https://www.google.com/search?q=private')!;

describe('analytics privacy and attribution', () => {
  it('allows production and explicit local debugging while respecting opt-out', () => {
    expect(analyticsAllowed('thespreadbridge.com', false, false)).toBe(true);
    expect(analyticsAllowed('127.0.0.1', false, false)).toBe(false);
    expect(analyticsAllowed('127.0.0.1', true, false)).toBe(true);
    expect(analyticsAllowed('project.vercel.app', true, false)).toBe(false);
    expect(analyticsAllowed('thespreadbridge.com', true, true)).toBe(false);
    expect(validMeasurementId('G-PR09649NG7')).toBe(true);
    expect(validMeasurementId('G-test<script>')).toBe(false);
  });
  it('preserves safe acquisition tags and advertising click IDs without unrelated query data', () => {
    const result = analyticsPage(origin + '/?utm_source=naver&utm_medium=cpc&utm_campaign=launch&gclid=public-click-id&name=Private+Name&phone=01012345678&ga_debug=1', titles, '');
    expect(result?.location).toBe(origin + '/?utm_source=naver&utm_medium=cpc&utm_campaign=launch&gclid=public-click-id');
    expect(analyticsPage(origin + '/?utm_term=person%40example.com', titles, '')?.location).toBe(origin + '/');
  });
  it.each(['code', 'state', 'access_token', 'refresh_token', 'email', 'password'])('never initializes a page carrying %s', key => {
    expect(analyticsPage(origin + '/?' + key + '=private', titles, '')).toBeNull();
  });
  it('never sends arbitrary paths or credential-bearing destinations', () => {
    expect(analyticsPage(origin + '/users/private-person/', titles, '')?.location).toBe(origin + '/not-found/');
    expect(safeDestination('mailto:person@example.com', origin, titles)).toEqual({ destination_path: 'contact', link_domain: 'email', control_id: 'contact' });
    expect(safeDestination('https://downloads.example.test/private?token=secret', origin, titles)).toMatchObject({ destination_path: '/external/', link_domain: 'downloads.example.test' });
    expect(safeDestination('javascript:alert(1)', origin, titles)).toBeNull();
    expect(safeDestination('/private-person/', origin, titles)).toMatchObject({ destination_path: '/other/', control_id: 'other_link' });
    expect(safeDestination('/api/session/google/start/?next=%2Fpayments%2F&code=private', origin, titles)?.destination_path).toBe('/login/');
  });
  it('removes OAuth/self-auth referrals and strips search terms from external referrers', () => {
    expect(cleanReferrer('https://accounts.google.com/o/oauth2?code=private', origin, titles)).toBe('');
    expect(cleanReferrer('https://api.thespreadbridge.com/v1/auth/callback', origin, titles)).toBe('');
    expect(cleanReferrer('https://www.google.com/search?q=private', origin, titles)).toBe('https://www.google.com/');
    expect(cleanReferrer(origin + '/pricing/?email=private@example.com', origin, titles)).toBe(origin + '/pricing/');
  });
  it('only permits opaque UUIDs for User-ID and a fixed safe event parameter set', () => {
    expect(safeUserId(userId)).toBe(userId);
    expect(safeUserId('person@example.com')).toBeNull();
    expect(sanitizeEventParams({ email: 'person@example.com', user_id: userId, control_id: 'hero_start', destination_path: '/?token=private', percent_scrolled: NaN })).toEqual({ control_id: 'hero_start' });
  });
});

describe('analytics lifecycle', () => {
  it('sets the built-in User-ID before events and clears it when the member logs out', () => {
    const sink = vi.fn();
    const tracker = createAnalyticsTracker(sink, 'G-PR09649NG7');
    tracker.update({ userId, memberState: 'member', subscriptionState: 'active' }, page());
    expect(sink.mock.calls[0]).toMatchObject(['config', 'G-PR09649NG7', { user_id: userId, send_page_view: false }]);
    tracker.event('ui_click', { control_id: 'hero_start', email: 'private@example.com' });
    expect(sink.mock.calls.at(-1)).toMatchObject(['event', 'ui_click', { member_state: 'member', subscription_state: 'active', control_id: 'hero_start' }]);
    expect(sink.mock.calls.at(-1)?.[2]).not.toHaveProperty('user_id');
    expect(sink.mock.calls.at(-1)?.[2]).not.toHaveProperty('email');
    tracker.update({ userId: null, memberState: 'guest', subscriptionState: 'unknown' }, page());
    expect(sink.mock.calls.at(-1)).toMatchObject(['config', 'G-PR09649NG7', { user_id: null }]);
  });
  it('does not double-count page views on identity refreshes or in-page anchors', () => {
    const sink = vi.fn();
    const tracker = createAnalyticsTracker(sink, 'G-PR09649NG7');
    const guest = { userId: null, memberState: 'guest', subscriptionState: 'unknown' } as const;
    tracker.update(guest, page()); tracker.update(guest, page('/#faq'));
    tracker.update({ userId, memberState: 'member', subscriptionState: 'active' }, page());
    expect(sink.mock.calls.filter(call => call[0] === 'event' && call[1] === 'page_view')).toHaveLength(1);
    tracker.update(guest, page('/pricing/'));
    expect(sink.mock.calls.filter(call => call[0] === 'event' && call[1] === 'page_view')).toHaveLength(2);
  });
  it('tracks receipt pagination and pauses event dispatch on an authentication callback', () => {
    const sink = vi.fn();
    const tracker = createAnalyticsTracker(sink, 'G-PR09649NG7');
    const identity = { userId, memberState: 'member', subscriptionState: 'active' } as const;
    tracker.update(identity, page('/payments/?historyPage=1'));
    tracker.update(identity, page('/payments/?historyPage=2'));
    expect(sink.mock.calls.filter(call => call[0] === 'event' && call[1] === 'page_view')).toHaveLength(2);
    tracker.update(identity, null); const count = sink.mock.calls.length;
    tracker.event('ui_click', { control_id: 'ignored' });
    expect(sink.mock.calls).toHaveLength(count);
    expect(JSON.stringify(sink.mock.calls)).not.toContain('access_token=');
  });
});
