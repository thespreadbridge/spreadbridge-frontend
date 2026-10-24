import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { HomeContent } from '@/components/home-v6/HomeContent';
import { HomeExperience } from '@/components/home-v6/HomeExperience';
import type { SiteSession } from '@/lib/auth/types';
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh() {}, replace() {} }) }));

const signedIn = (active: boolean): SiteSession => ({
  status: 'authenticated', user: { userId: 'member-1', email: 'member@example.test', displayName: '실제회원', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' },
  subscription: { active, planName: active ? '30슬롯' : null, maxActiveSlots: active ? 30 : 0, expiresAt: null },
});
const render = (session: SiteSession) => renderToStaticMarkup(<SessionProvider initialSession={session}><HomeExperience><HomeContent /></HomeExperience></SessionProvider>);
describe('homepage driven by verified session state', () => {
  it('renders local login links with no prototype view switches for guests', () => {
    const html = render({ status: 'guest', user: null, subscription: null });
    expect(html).toContain('data-view="guest"'); expect(html).toMatch(/href="\/login\/?"/);
    expect(html).not.toContain('viewSwitch'); expect(html).not.toContain('구독X'); expect(html).not.toContain('구독O'); expect(html).not.toContain('LIVE'); expect(html).not.toContain('ki**7');
  });
  it('renders the actual account and paid entitlement rather than reference account statistics', () => {
    const html = render(signedIn(true));
    expect(html).toContain('data-view="paid"'); expect(html).toContain('실제회원'); expect(html).toContain('30슬롯');
    expect(html).toContain('내 최근 거래'); expect(html).not.toContain('ha**3'); expect(html).not.toContain('1.84M'); expect(html).not.toContain('에이전트 3개');
  });
  it('explains an account restriction without incorrectly reporting an active plan as missing', () => {
    const session = signedIn(true);
    if (session.status !== 'authenticated') throw new Error('Invalid fixture');
    session.user.emailVerified = false;
    const html = render(session); expect(html).toContain('이메일 인증을 완료'); expect(html).toContain('계정 상태 확인'); expect(html).not.toContain('현재 이용 가능한 유료 구독이 없습니다');
  });
  it('renders a real unsubscribed account without granting the paid data view', () => {
    const html = render(signedIn(false)); expect(html).toContain('data-view="free"'); expect(html).toContain('지금 구독하기'); expect(html).not.toContain('내 최근 거래');
  });
});
