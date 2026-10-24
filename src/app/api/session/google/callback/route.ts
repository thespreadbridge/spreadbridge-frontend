import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/auth/backend';
import { OAUTH_COOKIE, oauthCookieOptions, privateResponse, setSessionCookies, validTokens } from '@/lib/auth/cookies';
import { readAttempt, requestOrigin } from '@/lib/auth/security';

export async function GET(request: NextRequest) {
  let response: NextResponse;
  try {
    const attempt = readAttempt(request.cookies.get(OAUTH_COOKIE)?.value, request.nextUrl.searchParams.get('state'));
    const error = request.nextUrl.searchParams.get('error');
    if (error) {
      const known = ['access_denied', 'account_link_required', 'operator_login_required'].includes(error) ? error : 'oauth_error';
      response = NextResponse.redirect(new URL(`/login/?error=${known}`, requestOrigin(request)));
    } else {
      const code = request.nextUrl.searchParams.get('code');
      if (!code || !/^[A-Za-z0-9_-]{32,256}$/.test(code)) throw new Error('Invalid login code');
      const result = await backend(`/auth/google/${attempt.flow === 'DESKTOP' ? 'desktop' : 'web'}/exchange`, {
        method: 'POST', body: JSON.stringify({ code, codeVerifier: attempt.codeVerifier }),
      });
      if (!result.ok) throw new Error('Login code rejected');
      const tokens: unknown = await result.json();
      if (!validTokens(tokens)) throw new Error('Invalid session');
      response = NextResponse.redirect(new URL(attempt.returnTo, requestOrigin(request)));
      setSessionCookies(response, tokens);
    }
  } catch { response = NextResponse.redirect(new URL('/login/?error=oauth_error', requestOrigin(request))); }
  response.cookies.set(OAUTH_COOKIE, '', { ...oauthCookieOptions(), maxAge: 0 });
  return privateResponse(response);
}
