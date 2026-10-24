import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { resolveSession } from '@/lib/auth/session';
import { backend } from '@/lib/auth/backend';
import { isRaceSymbol } from '@/lib/race';

// Anonymous aggregate only: the backend never returns member, account or slot identifiers.
export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol') ?? '';
  if (!isRaceSymbol(symbol)) return privateResponse(NextResponse.json({ error: 'Invalid symbol' }, { status: 400 }));
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const session = await resolveSession(token);
  if (session.status === 'guest' || session.status === 'refresh_required') return privateResponse(NextResponse.json({ error: 'Authentication required' }, { status: 401 }));
  if (session.status === 'unavailable') return privateResponse(NextResponse.json({ error: 'Account unavailable' }, { status: 503 }));
  try {
    const result = await backend(`/desktop/entry-race?symbol=${encodeURIComponent(symbol)}`, { headers: { Authorization: `Bearer ${token}` } });
    if (result.status === 401 || result.status === 403) return privateResponse(NextResponse.json({ error: 'Not permitted' }, { status: result.status }));
    if (!result.ok) return privateResponse(NextResponse.json({ error: 'Race unavailable' }, { status: 503 }));
    return privateResponse(NextResponse.json(await result.json()));
  } catch { return privateResponse(NextResponse.json({ error: 'Race unavailable' }, { status: 503 })); }
}
