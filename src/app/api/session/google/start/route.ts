import { createHash, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/auth/backend';
import { OAUTH_COOKIE, oauthCookieOptions, privateResponse } from '@/lib/auth/cookies';
import { googleTarget, isLoopbackOrigin, requestOrigin, safeReturnTo } from '@/lib/auth/security';

export async function GET(request: NextRequest) {
  const state = randomBytes(32).toString('base64url');
  const codeVerifier = randomBytes(48).toString('base64url');
  const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
  const origin = requestOrigin(request);
  const loopback = isLoopbackOrigin(origin);
  const callback = loopback ? `${origin}/` : `${origin}/api/session/google/callback`;
  try {
    let url: string;
    if (loopback) {
      const query = new URLSearchParams({ redirectUri: callback, state, codeChallenge });
      const result = await backend(`/auth/google/desktop/start?${query}`, { redirect: 'manual' });
      if (result.status !== 302 || !result.headers.get('location')) throw new Error('Google login unavailable');
      url = result.headers.get('location')!;
    } else {
      const result = await backend('/auth/google/web/start', { method: 'POST', body: JSON.stringify({ state, codeChallenge, redirectUri: callback }) });
      if (!result.ok) throw new Error('Google login unavailable');
      url = (await result.json()).url;
    }
    const response = privateResponse(NextResponse.redirect(googleTarget(url, callback)));
    response.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, codeVerifier, flow: loopback ? 'DESKTOP' : 'WEB', returnTo: safeReturnTo(request.nextUrl.searchParams.get('next')) }), oauthCookieOptions());
    return response;
  } catch {
    return privateResponse(NextResponse.redirect(new URL('/login/?error=oauth_unavailable', origin)));
  }
}
