import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PublicHeader } from '@/components/public-header';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { guestSession, type SiteSession } from '@/lib/auth/types';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh() {}, replace() {} }) }));
const render = (session: SiteSession) => renderToStaticMarkup(<SessionProvider initialSession={session}><PublicHeader /></SessionProvider>);
const member = (active: boolean): SiteSession => ({
  status: 'authenticated',
  user: { userId: 'member', email: 'member@example.test', displayName: '회원', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' },
  subscription: { active, planName: active ? '베타' : null, betaActive: active, maxActiveSlots: active ? 5 : 0, expiresAt: null },
});
describe('published homepage session navigation', () => {
  it('keeps sign-in on the published site', () => {
    const html = render(guestSession);
    expect(html).toMatch(/href="\/login\/?"/);
    expect(html).not.toContain('dollarflow.growbee.ai');
  });
  it('hides the main menu from guests and shows only downloads to members without an active subscription', () => {
    expect(render(guestSession)).not.toContain('aria-label="주요 메뉴"');
    const menu = render(member(false)).match(/<nav[^>]*>(.*?)<\/nav>/)?.[1];
    expect(menu).toMatch(/^<a href="\/download\/?">다운로드<\/a>$/);
  });
  it('places race, blog, download and manuals in the top menu of active subscribers, including beta', () => {
    const html = render(member(true));
    expect(html).toMatch(/href="\/race\/?"[^>]*>진입갭 레이스</);
    expect(html).toMatch(/href="\/blog\/?"[^>]*>블로그<\/a><a href="\/download\/?"[^>]*>다운로드<\/a>/);
    expect(html).toMatch(/href="\/manuals\/?"[^>]*>설치 매뉴얼</);
  });
  it('shows the verified member and offers logout', () => {
    const html = render({ status: 'authenticated', user: { userId: 'member', email: 'member@example.test', displayName: '회원', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' }, subscription: null });
    expect(html).toContain('회원 님');
    expect(html).toMatch(/href="\/payments\/?"/);
    expect(html).toContain('로그아웃');
    expect(html).not.toContain('시작하기');
  });
});
