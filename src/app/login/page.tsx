import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SitePage } from '@/components/site/SitePage';
import { serverSession } from '@/lib/auth/session';
import { safeReturnTo } from '@/lib/auth/security';

const errors: Record<string, string> = {
  access_denied: 'Google 로그인이 취소되었습니다. 다시 시도해 주세요.',
  account_link_required: '기존 계정의 소유 확인이 필요합니다. 고객센터에 계정 연결을 문의해 주세요.',
  operator_login_required: '관리자 계정은 기존 관리자 로그인 화면을 이용해 주세요.',
  oauth_unavailable: '로그인 연결을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.',
  oauth_error: '로그인을 완료하지 못했습니다. Google로 다시 접속해 주세요.',
};
export const metadata: Metadata = { title: '로그인', robots: { index: false, follow: false } };
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const returnTo = safeReturnTo(params.next);
  const session = await serverSession();
  if (session.status === 'authenticated') redirect(returnTo);
  return <SitePage title="다시 오신 것을 환영합니다." eyebrow="SPREADBRIDGE · SIGN IN" description="Google 계정으로 가입하고 로그인하세요.">
    <div className="site-login-card site-card">
      <h2>Spreadbridge 로그인</h2><p>기존 회원은 가입했던 Google 계정으로 접속해 주세요.</p>
      {params.error ? <p className="site-form-error" role="alert">{errors[params.error] ?? errors.oauth_error}</p> : null}
      <a className="btn primary" href={`/api/session/google/start/?next=${encodeURIComponent(returnTo)}`}>Google로 계속하기</a>
      <p className="site-login-note">처음 접속하면 계정이 생성됩니다. 로그인 과정에서 기본 Google 계정 정보를 확인합니다.</p>
      <p><Link href="/privacy/">개인정보처리방침</Link></p>
    </div>
  </SitePage>;
}
