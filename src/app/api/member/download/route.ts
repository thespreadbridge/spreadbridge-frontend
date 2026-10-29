import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { resolveSession } from '@/lib/auth/session';
import { requestOrigin } from '@/lib/auth/security';
import { downloadTargets, publishedRelease } from '@/lib/published-releases';

export async function GET(request: NextRequest) {
  const session = await resolveSession(request.cookies.get(ACCESS_COOKIE)?.value);
  if (session.status === 'guest' || session.status === 'refresh_required') {
    return privateResponse(NextResponse.redirect(new URL('/login/?next=%2Fdownload%2F', requestOrigin(request)), 302));
  }
  if (session.status !== 'authenticated') {
    return privateResponse(NextResponse.json({ error: '로그인 정보를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 503 }));
  }
  const target = downloadTargets.find(item => item.platform === request.nextUrl.searchParams.get('platform')
    && item.architecture === request.nextUrl.searchParams.get('architecture'));
  if (!target) return privateResponse(NextResponse.json({ error: '지원하지 않는 설치파일입니다.' }, { status: 400 }));
  const { status, release } = await publishedRelease(target);
  if (!release) {
    return privateResponse(NextResponse.json({ error: status === 'unavailable' ? '배포 정보를 불러오지 못했습니다.' : '현재 등록된 설치파일이 없습니다.' }, { status: status === 'unavailable' ? 503 : 404 }));
  }
  return privateResponse(NextResponse.redirect(release.artifactUrl, 302));
}
