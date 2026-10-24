import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/auth/backend';
import { ACCESS_COOKIE, REFRESH_COOKIE, clearSessionCookies, privateResponse, setSessionCookies, validTokens } from '@/lib/auth/cookies';
import { refreshRequestId, sameOrigin } from '@/lib/auth/security';
import { resolveSession } from '@/lib/auth/session';
import { guestSession } from '@/lib/auth/types';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return privateResponse(NextResponse.json({ error: 'Invalid origin' }, { status: 403 }));
  const session = await resolveSession(request.cookies.get(ACCESS_COOKIE)?.value);
  const hasRefresh = request.cookies.has(REFRESH_COOKIE);
  if ((session.status === 'guest' || session.status === 'refresh_required') && hasRefresh) return privateResponse(NextResponse.json({ status: 'refresh_required', user: null, subscription: null }));
  const response = privateResponse(NextResponse.json(session.status === 'refresh_required' ? guestSession : session, { status: session.status === 'unavailable' ? 503 : 200 }));
  if (session.status === 'refresh_required') clearSessionCookies(response);
  return response;
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return privateResponse(NextResponse.json({ error: 'Invalid origin' }, { status: 403 }));
  let mode: unknown;
  try { mode = (await request.json()).mode; } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (mode === 'logout') {
    let token = request.cookies.get(ACCESS_COOKIE)?.value;
    const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
    // Rotate/recover the same session first, so a simultaneous refresh cannot resurrect it after logout.
    if (refresh) {
      try {
        const rotated = await backend('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken: refresh, requestId: refreshRequestId(refresh) }) });
        if (rotated.ok) { const data: unknown = await rotated.json(); if (validTokens(data)) token = data.accessToken; }
      } catch { /* Still remove browser credentials if the API cannot be reached. */ }
    }
    if (token) await backend('/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => undefined);
    const response = privateResponse(NextResponse.json(guestSession));
    clearSessionCookies(response);
    return response;
  }
  if (mode !== 'refresh') return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  const token = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!token) { const response = privateResponse(NextResponse.json(guestSession, { status: 401 })); clearSessionCookies(response); return response; }
  try {
    const result = await backend('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken: token, requestId: refreshRequestId(token) }) });
    if (result.status === 401) { const response = privateResponse(NextResponse.json(guestSession, { status: 401 })); clearSessionCookies(response); return response; }
    if (!result.ok) throw new Error('Refresh unavailable');
    const tokens: unknown = await result.json();
    if (!validTokens(tokens)) throw new Error('Invalid session');
    const session = await resolveSession(tokens.accessToken);
    const response = privateResponse(NextResponse.json(session));
    setSessionCookies(response, tokens);
    return response;
  } catch { return privateResponse(NextResponse.json({ status: 'unavailable', user: null, subscription: null }, { status: 503 })); }
}
