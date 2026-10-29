import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PublicHeader } from '@/components/public-header';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { guestSession, type SiteSession } from '@/lib/auth/types';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh() {}, replace() {} }) }));
const render = (session: SiteSession) => renderToStaticMarkup(<SessionProvider initialSession={session}><PublicHeader /></SessionProvider>);
describe('published homepage session navigation', () => {
  it('keeps sign-in on the published site', () => {
    const html = render(guestSession);
    expect(html).toMatch(/href="\/login\/?"/);
    expect(html).not.toContain('dollarflow.growbee.ai');
  });
  it('links the member race page from the top menu', () => {
    expect(render(guestSession)).toMatch(/href="\/race\/?"[^>]*>진입갭 레이스</);
  });
  it('places the download link next to the blog in the top menu', () => {
    expect(render(guestSession)).toMatch(/href="\/blog\/?"[^>]*>블로그<\/a><a href="\/download\/?"[^>]*>다운로드<\/a>/);
  });
  it('shows the verified member and offers logout', () => {
    const html = render({ status: 'authenticated', user: { userId: 'member', email: 'member@example.test', displayName: '회원', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' }, subscription: null });
    expect(html).toContain('회원 님');
    expect(html).toMatch(/href="\/payments\/?"/);
    expect(html).toContain('로그아웃');
    expect(html).not.toContain('시작하기');
  });
});
